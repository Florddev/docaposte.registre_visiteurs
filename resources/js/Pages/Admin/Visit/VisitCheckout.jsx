import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import AdminLayout from "@/Layouts/AdminLayout";
import React from "react";
import { router } from "@inertiajs/react";
import { useForm } from "@inertiajs/react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function VisitCheckout({ visit }) {
    const { data, setData, errors, post, processing } = useForm({
        identifiant_sortie: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("visits.checkout.store", visit.id));
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return "-";
        return format(new Date(dateString), "dd MMMM yyyy à HH:mm", { locale: fr });
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Enregistrer la sortie</h1>
                    <Button variant="outline" onClick={() => router.get(route("visits.index"))}>
                        Retour à la liste
                    </Button>
                </div>

                <div className="rounded-md border p-6 space-y-4">
                    <h2 className="text-xl font-medium">Informations du visiteur</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Nom</p>
                            <p>{visit.visitor?.lastname} {visit.visitor?.firstname}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Email</p>
                            <p>{visit.visitor?.email || "-"}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Téléphone</p>
                            <p>{visit.visitor?.phone || "-"}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Société</p>
                            <p>{visit.company || "-"}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-md border p-6 space-y-4">
                    <h2 className="text-xl font-medium">Informations de la visite</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Motif</p>
                            <p>{visit.purpose?.name || "-"}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Personne visitée</p>
                            <p>{visit.visit_recipient || "-"}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Date et heure d'entrée</p>
                            <p>{formatDateTime(visit.date_entree)}</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="rounded-md border p-6 space-y-4">
                    <h2 className="text-xl font-medium">Enregistrement de la sortie</h2>

                    <div className="space-y-2">
                        <Label htmlFor="identifiant_sortie">
                            Identifiant de sortie <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="identifiant_sortie"
                            type="number"
                            value={data.identifiant_sortie}
                            onChange={e => setData("identifiant_sortie", e.target.value)}
                            required
                            placeholder="Entrez l'identifiant de sortie"
                        />
                        {errors.identifiant_sortie && (
                            <p className="text-red-500 text-sm">{errors.identifiant_sortie}</p>
                        )}
                    </div>

                    <div className="pt-4">
                        <p className="text-sm text-gray-500">
                            L'heure et la date de sortie seront automatiquement enregistrées au moment de la validation.
                        </p>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.get(route("visits.index"))}
                            disabled={processing}
                        >
                            Annuler
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? "Enregistrement..." : "Enregistrer la sortie"}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
