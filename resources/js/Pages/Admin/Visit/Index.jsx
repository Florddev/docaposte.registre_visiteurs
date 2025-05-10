import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import AdminLayout from "@/Layouts/AdminLayout";
import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/Components/ui/pagination";

export default function Index({ visits, purposes }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPurpose, setSelectedPurpose] = useState("");
    const [dateFilter, setDateFilter] = useState("");

    const formatDateTime = (dateString) => {
        if (!dateString) return "-";
        return format(new Date(dateString), "dd MMM yyyy HH:mm", { locale: fr });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handlePurposeChange = (e) => {
        setSelectedPurpose(e.target.value);
    };

    const handleDateChange = (e) => {
        setDateFilter(e.target.value);
    };

    const handleCreateVisit = () => {
        router.get(route("admin.visits.create"));
    };

    const handleEditVisit = (id) => {
        router.get(route("admin.visits.edit", id));
    };

    const handleViewDetails = (id) => {
        router.get(route("admin.visits.show", id));
    };

    const getVisitStatus = (visit) => {
        if (!visit.date_entree) return "Non commencée";
        if (!visit.date_sortie) return "En cours";
        return "Terminée";
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Visites</h1>
                    <Button onClick={handleCreateVisit}>Nouvelle visite</Button>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/3">
                        <Input
                            placeholder="Rechercher un visiteur..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="w-full md:w-1/3">
                        <Select value={selectedPurpose} onValueChange={handlePurposeChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Tous les motifs" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="0">Tous les motifs</SelectItem>
                                    {purposes && purposes.map((purpose) => (
                                        <SelectItem key={purpose.id} value={purpose.id}>
                                            {purpose.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-full md:w-1/3">
                        <Input
                            type="date"
                            value={dateFilter}
                            onChange={handleDateChange}
                        />
                    </div>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Visiteur</TableHead>
                                <TableHead>Société</TableHead>
                                <TableHead>Motif</TableHead>
                                <TableHead>Personne visitée</TableHead>
                                <TableHead>Date d'entrée</TableHead>
                                <TableHead>Date de sortie</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {visits?.data && visits.data.map((visit) => (
                                <TableRow key={visit.id}>
                                    <TableCell>
                                        {visit.visitor
                                            ? `${visit.visitor.lastname} ${visit.visitor.firstname}`
                                            : "-"}
                                    </TableCell>
                                    <TableCell>{visit.company || "Docaposte"}</TableCell>
                                    <TableCell>{visit.purpose?.name || "-"}</TableCell>
                                    <TableCell>{visit.visit_recipient || "-"}</TableCell>
                                    <TableCell>{formatDateTime(visit.date_entree)}</TableCell>
                                    <TableCell>{formatDateTime(visit.date_sortie)}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                !visit.date_entree
                                                    ? "bg-gray-100 text-gray-800"
                                                    : !visit.date_sortie
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-blue-100 text-blue-800"
                                            }`}
                                        >
                                          {getVisitStatus(visit)}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleViewDetails(visit.id)}
                                            >
                                                Voir
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEditVisit(visit.id)}
                                            >
                                                Éditer
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <Pagination>
                    <PaginationContent>
                        {visits?.links && visits.links.map((link, i) => {
                            if (link.url === null) return null;

                            if (link.label === "&laquo; Previous") {
                                return (
                                    <PaginationItem key={i}>
                                        <PaginationPrevious
                                            href={link.url}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                router.get(link.url);
                                            }}
                                            className={link.active ? "bg-primary text-white" : ""}
                                        />
                                    </PaginationItem>
                                );
                            }

                            if (link.label === "Next &raquo;") {
                                return (
                                    <PaginationItem key={i}>
                                        <PaginationNext
                                            href={link.url}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                router.get(link.url);
                                            }}
                                            className={link.active ? "bg-primary text-white" : ""}
                                        />
                                    </PaginationItem>
                                );
                            }

                            return (
                                <PaginationItem key={i}>
                                    <a
                                        href={link.url}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            router.get(link.url);
                                        }}
                                        className={`px-3 py-1 rounded ${
                                            link.active
                                                ? "bg-primary text-white"
                                                : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                    >
                                        {link.label}
                                    </a>
                                </PaginationItem>
                            );
                        })}
                    </PaginationContent>
                </Pagination>
            </div>
        </AdminLayout>
    );
}
