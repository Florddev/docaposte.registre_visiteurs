import AdminLayout from "@/Layouts/AdminLayout";
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Badge } from "@/Components/ui/badge";
import { useForm } from "@inertiajs/react";
import { Settings, Save, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/Components/ui/alert";

export default function Index({ settings, flash }) {
    const { data, setData, post, processing, errors } = useForm({
        data_retention_days: settings.data_retention_days?.value || 30,
        process_visits_time: settings.process_visits_time?.value || '22:00',
        admin_emergency_password: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <Settings className="h-8 w-8 text-blue-600" />
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
                            <p className="text-muted-foreground">
                                Configurez les paramètres généraux de l'application
                            </p>
                        </div>
                    </div>
                </div>

                {flash?.success && (
                    <Alert className="border-green-200 bg-green-50">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-green-800">
                            {flash.success}
                        </AlertDescription>
                    </Alert>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <span>Rétention des données</span>
                            <Badge variant="outline">Configuration</Badge>
                        </CardTitle>
                        <CardDescription>
                            Configurez la durée de conservation des données des visiteurs avant suppression automatique.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="data_retention_days">
                                    Période de conservation (en jours)
                                </Label>
                                <div className="flex items-center space-x-4">
                                    <Input
                                        id="data_retention_days"
                                        type="number"
                                        min="1"
                                        max="365"
                                        value={data.data_retention_days}
                                        onChange={(e) => setData('data_retention_days', e.target.value)}
                                        className="w-32"
                                        placeholder="30"
                                    />
                                    <span className="text-sm text-muted-foreground">
                                        jours
                                    </span>
                                </div>
                                {errors.data_retention_days && (
                                    <p className="text-sm text-red-600">{errors.data_retention_days}</p>
                                )}
                                <p className="text-sm text-muted-foreground">
                                    Les données des visiteurs seront automatiquement supprimées après cette période.
                                    Valeur recommandée : entre 30 et 90 jours.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="process_visits_time">
                                    Heure d'exécution du traitement des visites
                                </Label>
                                <div className="flex items-center space-x-4">
                                    <Input
                                        id="process_visits_time"
                                        type="time"
                                        value={data.process_visits_time}
                                        onChange={(e) => setData('process_visits_time', e.target.value)}
                                        className="w-32"
                                    />
                                    <span className="text-sm text-muted-foreground">
                                        (format 24h)
                                    </span>
                                </div>
                                {errors.process_visits_time && (
                                    <p className="text-sm text-red-600">{errors.process_visits_time}</p>
                                )}
                                <p className="text-sm text-muted-foreground">
                                    L'heure quotidienne à laquelle s'exécute automatiquement le traitement des visites.
                                    Recommandé : en dehors des heures de bureau.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="admin_emergency_password">
                                    Mot de passe administrateur d'urgence
                                </Label>
                                <div className="flex items-center space-x-4">
                                    <Input
                                        id="admin_emergency_password"
                                        type="password"
                                        value={data.admin_emergency_password}
                                        onChange={(e) => setData('admin_emergency_password', e.target.value)}
                                        className="w-64"
                                        placeholder="Laisser vide pour ne pas modifier"
                                    />
                                </div>
                                {errors.admin_emergency_password && (
                                    <p className="text-sm text-red-600">{errors.admin_emergency_password}</p>
                                )}
                                <p className="text-sm text-muted-foreground">
                                    Permet l'accès d'urgence pour forcer la sortie des visiteurs.
                                    Laisser vide pour conserver le mot de passe actuel. (Minimum 6 caractères)
                                </p>
                            </div>

                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <h4 className="font-medium text-blue-900 mb-2">À propos de ces fonctionnalités</h4>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>• <strong>Rétention des données :</strong> La suppression automatique s'exécute quotidiennement</li>
                                    <li>• Seules les données sans indicateur de rétention sont supprimées</li>
                                    <li>• Les visites associées seront conservées mais anonymisées</li>
                                    <li>• <strong>Traitement des visites :</strong> S'exécute quotidiennement à l'heure configurée</li>
                                    <li>• <strong>Mot de passe d'urgence :</strong> Permet l'accès à la gestion des sorties forcées</li>
                                    <li>• Redémarrage du scheduler requis pour appliquer les changements d'heure</li>
                                </ul>
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing} className="flex items-center space-x-2">
                                    <Save className="h-4 w-4" />
                                    <span>{processing ? 'Sauvegarde...' : 'Sauvegarder'}</span>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
