import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import AdminLayout from "@/Layouts/AdminLayout";
import React, { useState } from "react";
import { router, useForm } from "@inertiajs/react";
import { Eye, EyeOff } from "lucide-react";

export default function UserCreate() {
    const { data, setData, errors, post, processing } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.users.store"));
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
                    <h1 className="text-2xl font-semibold">Nouvel utilisateur</h1>
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
                                    placeholder="John Doe"
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
                                    placeholder="john.doe@example.com"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm">{errors.email}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Mot de passe <span className="text-red-500">*</span></Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={data.password}
                                        onChange={(e) => setData("password", e.target.value)}
                                        required
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
                                <Label htmlFor="password_confirmation">Confirmation du mot de passe <span className="text-red-500">*</span></Label>
                                <div className="relative">
                                    <Input
                                        id="password_confirmation"
                                        type={showPasswordConfirmation ? "text" : "password"}
                                        value={data.password_confirmation}
                                        onChange={(e) => setData("password_confirmation", e.target.value)}
                                        required
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
                            {processing ? "Enregistrement..." : "Créer l'utilisateur"}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
