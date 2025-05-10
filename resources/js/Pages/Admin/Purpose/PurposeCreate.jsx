import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import AdminLayout from "@/Layouts/AdminLayout";
import React from "react";
import { router, useForm } from "@inertiajs/react";

export default function PurposeCreate() {
    const { data, setData, errors, post, processing } = useForm({
        nom: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.purposes.store"));
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Nouveau motif de visite</h1>
                    <Button variant="outline" onClick={() => router.get(route("admin.purposes.index"))}>
                        Retour à la liste
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="rounded-md border p-6 space-y-4">
                        <h2 className="text-xl font-medium">Informations du motif</h2>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="nom">Nom du motif <span className="text-red-500">*</span></Label>
                                <Input
                                    id="nom"
                                    value={data.nom}
                                    onChange={(e) => setData("nom", e.target.value)}
                                    required
                                    placeholder="Ex: Réunion, Entretien, Formation..."
                                />
                                {errors.nom && (
                                    <p className="text-red-500 text-sm">{errors.nom}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.get(route("admin.purposes.index"))}
                            disabled={processing}
                        >
                            Annuler
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? "Enregistrement..." : "Enregistrer le motif"}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
