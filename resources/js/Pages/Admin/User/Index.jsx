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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Search, Plus, MoreHorizontal, Pencil, Trash, Eye, Shield } from "lucide-react";
import { useDebounce } from "@/lib/hooks";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Badge } from "@/Components/ui/badge";

export default function Index({ users, filters }) {
    const page = usePage().props;
    const flash = page.flash || {};
    const currentUser = page.auth.user;
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // Effectuer la recherche après le debounce
    useEffect(() => {
        if (debouncedSearchTerm !== filters.search) {
            router.get(
                route("admin.users.index"),
                { search: debouncedSearchTerm },
                { preserveState: true }
            );
        }
    }, [debouncedSearchTerm]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCreateUser = () => {
        router.get(route("admin.users.create"));
    };

    const handleEditUser = (id) => {
        router.get(route("admin.users.edit", id));
    };

    const handleViewUser = (id) => {
        router.get(route("admin.users.show", id));
    };

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (userToDelete) {
            router.delete(route("admin.users.destroy", userToDelete.id));
        }
        setDeleteDialogOpen(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Non vérifié";
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Gestion des utilisateurs</h1>
                    <Button onClick={handleCreateUser}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nouvel utilisateur
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
                                placeholder="Rechercher un utilisateur..."
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
                                <TableHead>Nom</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Créé le</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.length > 0 ? (
                                users.data.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            {user.email_verified_at ? (
                                                <Badge variant="outline" className="bg-green-50 text-green-800 hover:bg-green-100">
                                                    Vérifié
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-amber-50 text-amber-800 hover:bg-amber-100">
                                                    Non vérifié
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>{formatDate(user.created_at)}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleViewUser(user.id)}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        <span>Voir</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleEditUser(user.id)}>
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        <span>Modifier</span>
                                                    </DropdownMenuItem>
                                                    {user.id !== currentUser.id && (
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={() => handleDeleteClick(user)}
                                                        >
                                                            <Trash className="mr-2 h-4 w-4" />
                                                            <span>Supprimer</span>
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        Aucun utilisateur trouvé.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {users.links && users.links.length > 3 && (
                    <Pagination>
                        <PaginationContent>
                            {users.links.map((link, i) => {
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
                            Cette action supprimera définitivement l'utilisateur "
                            {userToDelete?.name}". Cette action est irréversible.
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
