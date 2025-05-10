import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import AdminLayout from "@/Layouts/AdminLayout";
import React, { useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import { Search, Plus, Pencil, Trash } from "lucide-react";
import { useDebounce } from "@/lib/hooks";
import { Alert, AlertDescription } from "@/Components/ui/alert";

export default function Index({ purposes, filters }) {
    const page = usePage().props;
    const flash = page.flash || {};
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [purposeToDelete, setPurposeToDelete] = useState(null);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // Effectuer la recherche après le debounce
    useEffect(() => {
        if (debouncedSearchTerm !== filters.search) {
            router.get(
                route("admin.purposes.index"),
                { search: debouncedSearchTerm },
                { preserveState: true }
            );
        }
    }, [debouncedSearchTerm]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCreatePurpose = () => {
        router.get(route("admin.purposes.create"));
    };

    const handleEditPurpose = (id) => {
        router.get(route("admin.purposes.edit", id));
    };

    const handleDeleteClick = (purpose) => {
        setPurposeToDelete(purpose);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (purposeToDelete) {
            router.delete(route("admin.purposes.destroy", purposeToDelete.id));
        }
        setDeleteDialogOpen(false);
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Motifs de visite</h1>
                    <Button onClick={handleCreatePurpose}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nouveau motif
                    </Button>
                </div>

                {flash.success && (
                    <Alert className="bg-green-50 text-green-800 border-green-200">
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                )}

                {flash.error && (
                    <Alert variant="destructive">
                        <AlertDescription>{flash.error}</AlertDescription>
                    </Alert>
                )}

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/3">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher un motif..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="pl-8"
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Nom</TableHead>
                                <TableHead>Nombre de visites</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {purposes.data.length > 0 ? (
                                purposes.data.map((purpose) => (
                                    <TableRow key={purpose.id}>
                                        <TableCell className="font-medium">{purpose.id}</TableCell>
                                        <TableCell>{purpose.nom}</TableCell>
                                        <TableCell>{purpose.visits_count || 0}</TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEditPurpose(purpose.id)}
                                                >
                                                    <Pencil className="h-4 w-4 mr-1" />
                                                    Éditer
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-red-500 hover:text-red-700"
                                                    onClick={() => handleDeleteClick(purpose)}
                                                >
                                                    <Trash className="h-4 w-4 mr-1" />
                                                    Supprimer
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        Aucun motif de visite trouvé.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {purposes.links && purposes.links.length > 3 && (
                    <Pagination>
                        <PaginationContent>
                            {purposes.links.map((link, i) => {
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
                )}
            </div>

            {/* Boîte de dialogue de confirmation de suppression */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action supprimera définitivement le motif de visite "
                            {purposeToDelete?.nom}". Cette action est irréversible.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
                            Supprimer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
