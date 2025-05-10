import { Button } from "@/Components/ui/button";
import AdminLayout from "@/Layouts/AdminLayout";
import React from "react";
import { router } from "@inertiajs/react";
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card";
import { Pencil, ArrowLeft, Mail, Calendar, CheckCircle, XCircle } from "lucide-react";

export default function UserShow({ user }) {
    const handleEdit = () => {
        router.get(route("admin.users.edit", user.id));
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
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
                    <h1 className="text-2xl font-semibold">Détails de l'utilisateur</h1>
                    <div className="flex space-x-2">
                        <Button onClick={handleEdit} variant="default">
                            <Pencil className="mr-2 h-4 w-4" />
                            Modifier
                        </Button>
                        <Button variant="outline" onClick={() => router.get(route("admin.users.index"))}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Retour à la liste
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations personnelles</CardTitle>
                            <CardDescription>Détails du profil de l'utilisateur</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center border-b pb-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                    <span className="text-lg font-medium text-primary">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium">{user.name}</p>
                                    <p className="text-sm text-muted-foreground flex items-center">
                                        <Mail className="mr-1 h-3 w-3" />
                                        {user.email}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium">Statut du compte</h3>
                                <div className="flex items-center">
                                    {user.email_verified_at ? (
                                        <>
                                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                            <span>Vérifié</span>
                                            <Badge variant="outline" className="ml-2 bg-green-50 text-green-800 hover:bg-green-100">
                                                Actif
                                            </Badge>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="h-5 w-5 text-amber-500 mr-2" />
                                            <span>Non vérifié</span>
                                            <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-800 hover:bg-amber-100">
                                                En attente
                                            </Badge>
                                        </>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Détails du compte</CardTitle>
                            <CardDescription>Informations techniques du compte</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Vérifié le</p>
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                                        <p>{formatDate(user.email_verified_at) || "Non vérifié"}</p>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Créé le</p>
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                                        <p>{formatDate(user.created_at)}</p>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Dernière mise à jour</p>
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                                        <p>{formatDate(user.updated_at)}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <p className="text-xs text-muted-foreground">
                                Les détails du compte sont mis à jour automatiquement.
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
