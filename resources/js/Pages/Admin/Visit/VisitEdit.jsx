import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Checkbox } from "@/Components/ui/checkbox";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/Components/ui/select";
import AdminLayout from "@/Layouts/AdminLayout";
import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { useForm } from "@inertiajs/react";

export default function VisitEdit({ visit, purposes }) {
    const {data, setData, errors, put, processing} = useForm({
        visitor: {
            lastname: visit.visitor?.lastname || "",
            firstname: visit.visitor?.firstname || "",
            email: visit.visitor?.email || "",
            phone: visit.visitor?.phone || "",
            employee_number: visit.visitor?.employee_number || "",
            data_understanding: visit.visitor?.data_understanding || false,
            data_retention: visit.visitor?.data_retention || false,
        },
        motif_id: visit.motif_id || "",
        visit_recipient: visit.visit_recipient || "",
        company: visit.company || "",
        date_entree: visit.date_entree ? new Date(visit.date_entree).toISOString().slice(0, 16) : "",
        date_sortie: visit.date_sortie ? new Date(visit.date_sortie).toISOString().slice(0, 16) : "",
        identifiant_sortie: visit.identifiant_sortie || "",
    });

    const handleVisitorChange = (e) => {
        const {name, value, type, checked} = e.target;
        setData("visitor", {
            ...data.visitor,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.visits.update", visit.id));
    };

    const handleCheckout = () => {
        router.get(route("admin.visits.checkout", visit.id));
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Modifier la visite</h1>
                    <div className="flex space-x-2">
                        {!visit.date_sortie && (
                            <Button onClick={handleCheckout} variant="secondary">
                                Enregistrer la sortie
                            </Button>
                        )}
                        <Button variant="outline" onClick={() => router.get(route("visits.index"))}>
                            Retour à la liste
                        </Button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Section Visiteur */}
                    <div className="rounded-md border p-6 space-y-4">
                        <h2 className="text-xl font-medium">Informations du visiteur</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="lastname">Nom <span className="text-red-500">*</span></Label>
                                <Input
                                    id="lastname"
                                    name="lastname"
                                    value={data.visitor.lastname}
                                    onChange={handleVisitorChange}
                                    required
                                />
                                {errors.visitor?.lastname && (
                                    <p className="text-red-500 text-sm">{errors.visitor.lastname}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="firstname">Prénom <span className="text-red-500">*</span></Label>
                                <Input
                                    id="firstname"
                                    name="firstname"
                                    value={data.visitor.firstname}
                                    onChange={handleVisitorChange}
                                    required
                                />
                                {errors.visitor?.firstname && (
                                    <p className="text-red-500 text-sm">{errors.visitor.firstname}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={data.visitor.email}
                                    onChange={handleVisitorChange}
                                />
                                {errors.visitor?.email && (
                                    <p className="text-red-500 text-sm">{errors.visitor.email}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Téléphone</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={data.visitor.phone}
                                    onChange={handleVisitorChange}
                                />
                                {errors.visitor?.phone && (
                                    <p className="text-red-500 text-sm">{errors.visitor.phone}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="employee_number">Numéro d'employé (si applicable)</Label>
                                <Input
                                    id="employee_number"
                                    name="employee_number"
                                    type="number"
                                    value={data.visitor.employee_number}
                                    onChange={handleVisitorChange}
                                />
                                {errors.visitor?.employee_number && (
                                    <p className="text-red-500 text-sm">{errors.visitor.employee_number}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2 pt-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="data_understanding"
                                    name="data_understanding"
                                    checked={data.visitor.data_understanding}
                                    onChange={handleVisitorChange}
                                />
                                <Label htmlFor="data_understanding">
                                    Je comprends que mes données personnelles seront traitées conformément à la
                                    politique de confidentialité
                                </Label>
                            </div>
                            {errors.visitor?.data_understanding && (
                                <p className="text-red-500 text-sm">{errors.visitor.data_understanding}</p>
                            )}

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="data_retention"
                                    name="data_retention"
                                    checked={data.visitor.data_retention}
                                    onChange={handleVisitorChange}
                                />
                                <Label htmlFor="data_retention">
                                    J'accepte que mes données soient conservées pour faciliter mes futures visites
                                </Label>
                            </div>
                            {errors.visitor?.data_retention && (
                                <p className="text-red-500 text-sm">{errors.visitor.data_retention}</p>
                            )}
                        </div>
                    </div>

                    {/* Section Visite */}
                    <div className="rounded-md border p-6 space-y-4">
                        <h2 className="text-xl font-medium">Informations de la visite</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="motif_id">Motif de visite <span
                                    className="text-red-500">*</span></Label>
                                <Select
                                    id="motif_id"
                                    value={data.motif_id}
                                    onValueChange={(value) => setData("motif_id", value)}
                                    required
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Sélectionner un motif" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {purposes.map((purpose) => (
                                                <SelectItem key={purpose.id} value={purpose.id}>
                                                    {purpose.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {errors.motif_id && (
                                    <p className="text-red-500 text-sm">{errors.motif_id}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="company">Société</Label>
                                <Input
                                    id="company"
                                    value={data.company}
                                    onChange={e => setData("company", e.target.value)}
                                />
                                {errors.company && (
                                    <p className="text-red-500 text-sm">{errors.company}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="visit_recipient">Personne visitée <span
                                    className="text-red-500">*</span></Label>
                                <Input
                                    id="visit_recipient"
                                    value={data.visit_recipient}
                                    onChange={e => setData("visit_recipient", e.target.value)}
                                    required
                                />
                                {errors.visit_recipient && (
                                    <p className="text-red-500 text-sm">{errors.visit_recipient}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date_entree">Date et heure d'entrée <span
                                    className="text-red-500">*</span></Label>
                                <Input
                                    id="date_entree"
                                    type="datetime-local"
                                    value={data.date_entree}
                                    onChange={e => setData("date_entree", e.target.value)}
                                    required
                                />
                                {errors.date_entree && (
                                    <p className="text-red-500 text-sm">{errors.date_entree}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date_sortie">Date et heure de sortie</Label>
                                <Input
                                    id="date_sortie"
                                    type="datetime-local"
                                    value={data.date_sortie}
                                    onChange={e => setData("date_sortie", e.target.value)}
                                />
                                {errors.date_sortie && (
                                    <p className="text-red-500 text-sm">{errors.date_sortie}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="identifiant_sortie">Identifiant de sortie</Label>
                                <Input
                                    id="identifiant_sortie"
                                    type="number"
                                    value={data.identifiant_sortie}
                                    onChange={e => setData("identifiant_sortie", e.target.value)}
                                />
                                {errors.identifiant_sortie && (
                                    <p className="text-red-500 text-sm">{errors.identifiant_sortie}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.get(route("admin.visits.index"))}
                            disabled={processing}
                        >
                            Annuler
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? "Enregistrement..." : "Enregistrer les modifications"}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    )
};
