import { Button } from "@/Components/ui/button";
import AdminLayout from "@/Layouts/AdminLayout";
import React from "react";
import { router } from "@inertiajs/react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function VisitShow({ visit }) {
    const formatDateTime = (dateString) => {
        if (!dateString) return "-";
        return format(new Date(dateString), "dd MMMM yyyy à HH:mm", { locale: fr });
    };

    const handleEdit = () => {
        router.get(route("admin.visits.edit", visit.id));
    };

    const handleCheckout = () => {
        router.get(route("admin.visits.checkout", visit.id));
    };

    const getVisitStatus = (visit) => {
        if (!visit.date_entree) return "Non commencée";
        if (!visit.date_sortie) return "En cours";
        return "Terminée";
    };

    const getStatusColor = (visit) => {
        if (!visit.date_entree) return "bg-gray-100 text-gray-800";
        if (!visit.date_sortie) return "bg-green-100 text-green-800";
        return "bg-blue-100 text-blue-800";
    };

    const calculateDuration = () => {
        if (!visit.date_entree || !visit.date_sortie) return "-";

        const entryDate = new Date(visit.date_entree);
        const exitDate = new Date(visit.date_sortie);

        const durationMs = exitDate - entryDate;
        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

        return `${hours}h ${minutes}min`;
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Détails de la visite</h1>
                    <div className="flex space-x-2">
                        {!visit.date_sortie && (
                            <Button onClick={handleCheckout} variant="secondary">
                                Enregistrer la sortie
                            </Button>
                        )}
                        <Button onClick={handleEdit} variant="default">
                            Modifier
                        </Button>
                        <Button variant="outline" onClick={() => router.get(route("admin.visits.index"))}>
                            Retour à la liste
                        </Button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <div className="p-6 border-b">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">
                                Visite #{visit.id}
                            </h2>
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(visit)}`}
                            >
                {getVisitStatus(visit)}
              </span>
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium mb-4">Informations du visiteur</h3>
                                <dl className="grid grid-cols-1 gap-y-4">
                                    <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                                        <dt className="text-sm font-medium text-gray-500">Nom complet</dt>
                                        <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                                            {visit.visitor ? `${visit.visitor.lastname} ${visit.visitor.firstname}` : "-"}
                                        </dd>
                                    </div>

                                    <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                                        <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                                            {visit.visitor?.email || "-"}
                                        </dd>
                                    </div>

                                    <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                                        <dt className="text-sm font-medium text-gray-500">Téléphone</dt>
                                        <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                                            {visit.visitor?.phone || "-"}
                                        </dd>
                                    </div>

                                    <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                                        <dt className="text-sm font-medium text-gray-500">N° Employé</dt>
                                        <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                                            {visit.visitor?.employee_number || "-"}
                                        </dd>
                                    </div>

                                    <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                                        <dt className="text-sm font-medium text-gray-500">Compréhension des données</dt>
                                        <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                                            {visit.visitor?.data_understanding ? "Oui" : "Non"}
                                        </dd>
                                    </div>

                                    <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                                        <dt className="text-sm font-medium text-gray-500">Rétention des données</dt>
                                        <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                                            {visit.visitor?.data_retention ? "Oui" : "Non"}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium mb-4">Informations de la visite</h3>
                                <dl className="grid grid-cols-1 gap-y-4">
                                    <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                                        <dt className="text-sm font-medium text-gray-500">Société</dt>
                                        <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                                            {visit.company || "-"}
                                        </dd>
                                    </div>

                                    <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                                        <dt className="text-sm font-medium text-gray-500">Motif</dt>
                                        <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                                            {visit.purpose?.name || "-"}
                                        </dd>
                                    </div>

                                    <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                                        <dt className="text-sm font-medium text-gray-500">Personne visitée</dt>
                                        <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                                            {visit.visit_recipient || "-"}
                                        </dd>
                                    </div>

                                    <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                                        <dt className="text-sm font-medium text-gray-500">Date d'entrée</dt>
                                        <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                                            {formatDateTime(visit.date_entree)}
                                        </dd>
                                    </div>

                                    <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                                        <dt className="text-sm font-medium text-gray-500">Date de sortie</dt>
                                        <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                                            {formatDateTime(visit.date_sortie)}
                                        </dd>
                                    </div>

                                    <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                                        <dt className="text-sm font-medium text-gray-500">Durée</dt>
                                        <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                                            {calculateDuration()}
                                        </dd>
                                    </div>

                                    <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                                        <dt className="text-sm font-medium text-gray-500">ID de sortie</dt>
                                        <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                                            {visit.identifiant_sortie || "-"}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
