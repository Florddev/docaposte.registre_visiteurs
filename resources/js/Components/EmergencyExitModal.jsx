import React, { useState } from 'react';
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Search, LogOut, Eye, EyeOff, AlertTriangle, Loader2 } from "lucide-react";
import {router, usePage} from "@inertiajs/react";

const EmergencyExitModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState('password'); // 'password' | 'visits'
    const [password, setPassword] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [visits, setVisits] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [processingVisit, setProcessingVisit] = useState(null);
    const { csrf } = usePage().props;

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(route('emergency.authenticate'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf,
                },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (data.success) {
                setVisits(data.visits);
                setStep('visits');
            } else {
                setError(data.message || 'Erreur d\'authentification');
            }
        } catch (err) {
            setError('Erreur de connexion au serveur: ' + err);
        } finally {
            setLoading(false);
        }
    };

    const handleForceExit = async (visitId) => {
        setProcessingVisit(visitId);
        setError('');

        try {
            const response = await fetch(route('emergency.forceExit', visitId), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf,
                },
            });

            const data = await response.json();

            if (data.success) {
                setVisits(prev => prev.filter(visit => visit.id !== visitId));
            } else {
                setError(data.message || 'Erreur lors de la sortie forcée');
            }
        } catch (err) {
            setError('Erreur de connexion au serveur');
        } finally {
            setProcessingVisit(null);
        }
    };

    const filteredVisits = visits.filter(visit =>
        visit.visitor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (visit.visitor_company && visit.visitor_company.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (visit.purpose && visit.purpose.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleClose = () => {
        setStep('password');
        setPassword('');
        setSearchTerm('');
        setVisits([]);
        setError('');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        <span>Accès d'urgence - Gestion des sorties</span>
                    </DialogTitle>
                    <DialogDescription>
                        {step === 'password'
                            ? "Saisissez le mot de passe administrateur pour accéder à la gestion des sorties d'urgence."
                            : "Liste des visiteurs actuellement présents. Cliquez sur 'Forcer la sortie' pour enregistrer automatiquement leur départ."
                        }
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {step === 'password' && (
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="admin-password">Mot de passe administrateur</Label>
                            <Input
                                id="admin-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Saisissez le mot de passe"
                                autoFocus
                                disabled={loading}
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={handleClose}>
                                Annuler
                            </Button>
                            <Button type="submit" disabled={!password || loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Authentifier
                            </Button>
                        </div>
                    </form>
                )}

                {step === 'visits' && (
                    <div className="space-y-4">
                        {/* Barre de recherche */}
                        <div className="flex items-center space-x-2">
                            <Search className="h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher par nom, société, motif ou code de sortie..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1"
                            />
                        </div>

                        {/* Information de sécurité */}
                        <Alert>
                            <Eye className="h-4 w-4" />
                            <AlertDescription>
                                Pour des raisons de sécurité, les informations sont floutées.
                                Survolez une ligne pour la rendre visible.
                            </AlertDescription>
                        </Alert>

                        {/* Tableau des visites */}
                        <div className="border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nom du visiteur</TableHead>
                                        <TableHead>Société</TableHead>
                                        <TableHead>Motif</TableHead>
                                        <TableHead>Heure d'entrée</TableHead>
                                        <TableHead>Code de sortie</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredVisits.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                                {visits.length === 0
                                                    ? "Aucun visiteur actuellement présent"
                                                    : "Aucun résultat trouvé pour cette recherche"
                                                }
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredVisits.map((visit) => (
                                            <TableRow
                                                key={visit.id}
                                                className="group hover:bg-muted/50 transition-colors"
                                            >
                                                <TableCell className="group-hover:filter-none filter blur-sm transition-all">
                                                    <div className="font-medium">{visit.visitor_name}</div>
                                                </TableCell>
                                                <TableCell className="group-hover:filter-none filter blur-sm transition-all">
                                                    {visit.visitor_company || 'Docaposte'}
                                                </TableCell>
                                                <TableCell className="group-hover:filter-none filter blur-sm transition-all">
                                                    {visit.purpose || 'Non renseigné'}
                                                </TableCell>
                                                <TableCell className="group-hover:filter-none filter blur-sm transition-all">
                                                    {visit.entry_time}
                                                </TableCell>
                                                <TableCell className="group-hover:filter-none filter blur-sm transition-all">
                                                    <code className="bg-muted px-2 py-1 rounded text-sm">
                                                        {visit.exit_code}
                                                    </code>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleForceExit(visit.id)}
                                                        disabled={processingVisit === visit.id}
                                                    >
                                                        {processingVisit === visit.id ? (
                                                            <>
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                                En traitement...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <LogOut className="h-4 w-4 mr-2" />
                                                                Forcer la sortie
                                                            </>
                                                        )}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="flex justify-between">
                            <Button variant="outline" onClick={() => setStep('password')}>
                                Retour
                            </Button>
                            <Button onClick={handleClose}>
                                Fermer
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default EmergencyExitModal;
