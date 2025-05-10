import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Switch } from "@/Components/ui/switch";
import AdminLayout from "@/Layouts/AdminLayout";
import React, { useState } from "react";
import { router, useForm } from "@inertiajs/react";
import { Eye, EyeOff, InfoIcon } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";

export default function UserEdit({ user }) {
    const { data, setData, errors, put, processing } = useForm({
        name: user.name || "",
        email: user.email || "",
        password: "",
        password_confirmation: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const [changePassword, setChangePassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.users.update", user.id));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const togglePasswordConfirmationVisibility = () => {
        setShowPasswordConfirmation(!showPasswordConfirmation);
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Modifier l'utilisateur</h1>
                    <Button variant="outline" onClick={() => router.get(route("admin.users.index"))}>
                        Retour à la liste
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="rounded-md border p-6 space-y-4">
                        <h2 className="text-xl font-medium">Informations de l'utilisateur</h2>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nom complet <span className="text-red-500">*</span></Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    required
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Adresse e-mail <span className="text-red-500">*</span></Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                    required
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm">{errors.email}</p>
                                )}
                            </div>

                            <div className="flex items-center space-x-2 pt-4">
                                <Switch
                                    id="change-password"
                                    checked={changePassword}
                                    onCheckedChange={setChangePassword}
                                />
                                <Label htmlFor="change-password">Changer le mot de passe</Label>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <InfoIcon className="h-4 w-4 text-muted-foreground" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Laissez vide pour conserver le mot de passe actuel</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>

                            {changePassword && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Nouveau mot de passe</Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                value={data.password}
                                                onChange={(e) => setData("password", e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={togglePasswordVisibility}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="text-red-500 text-sm">{errors.password}</p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            Le mot de passe doit contenir au moins 8 caractères.
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation">Confirmation du nouveau mot de passe</Label>
                                        <div className="relative">
                                            <Input
                                                id="password_confirmation"
                                                type={showPasswordConfirmation ? "text" : "password"}
                                                value={data.password_confirmation}
                                                onChange={(e) => setData("password_confirmation", e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={togglePasswordConfirmationVisibility}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                                            >
                                                {showPasswordConfirmation ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                        {errors.password_confirmation && (
                                            <p className="text-red-500 text-sm">{errors.password_confirmation}</p>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.get(route("admin.users.index"))}
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
    );
}
