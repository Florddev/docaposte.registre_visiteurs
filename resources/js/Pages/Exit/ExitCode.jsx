import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Lock, AlertTriangle } from 'lucide-react';
import { Button } from "@/Components/ui/button";
import { Link, router, usePage } from "@inertiajs/react";
import { Card, CardContent } from "@/Components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/Components/ui/input-otp";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import EmergencyExitModal from "@/Components/EmergencyExitModal";

const ExitCode = ({
  nextStep,
  backStep,
  formData,
  currentStep,
  totalSteps,
  entryType,
}) => {
    const { errors } = usePage().props;
    const [value, setValue] = useState(formData.exitCode || '');
    const [showEmergencyModal, setShowEmergencyModal] = useState(false);

    const handleComplete = (value) => {
        if (value.length === 8) {
            nextStep({ exitCode: value });
        }
    };

    const handleSubmit = () => {
        const finalData = {
            ...formData,
            exitCode: value
        };

        router.post(route('exit.submitExit'), finalData);
    };

    return (
        <>
            <div className="flex justify-center space-x-6 my-16 w-[900px]">
                <Card className="w-full">
                    <CardContent className="pt-6">
                        <div className="flex items-start">
                            <Lock className="h-12 w-12 text-primary mr-4 flex-shrink-0" />
                            <div className="w-full">
                                <h2 className="font-semibold text-lg">Matricule Docaposte ou Identifiant de sortie</h2>
                                <p className="text-sm text-muted-foreground">Pour valider votre sortie nous allons avoir besoin de votre Matricule ou de votre identifiant de sortie à 8 chiffres saisie lors de votre entrée.</p>

                                <div className="pt-6 w-full">
                                    <InputOTP
                                        value={value}
                                        onChange={setValue}
                                        maxLength={8}
                                        onComplete={handleComplete}
                                        className="w-full"
                                    >
                                        {Array.from({ length: 8 }).map((_, i) => (
                                            <InputOTPGroup key={i} className="w-full">
                                                <InputOTPSlot
                                                    index={i}
                                                    className="w-full text-4xl h-auto aspect-square"
                                                />
                                            </InputOTPGroup>
                                        ))}
                                    </InputOTP>

                                    {errors?.exitCode && (
                                        <Alert variant="destructive" className="mt-4">
                                            <AlertDescription>
                                                {errors.exitCode}
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    {/* Bouton d'accès d'urgence */}
                                    <div className="mt-6 pt-4 border-t">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowEmergencyModal(true)}
                                            className="w-full text-orange-600 border-orange-200 hover:bg-orange-50"
                                        >
                                            <AlertTriangle className="mr-2 h-4 w-4" />
                                            Identifiant de sortie oublié
                                        </Button>
                                        {/*<p className="text-xs text-muted-foreground mt-2 text-center">*/}
                                        {/*    Accès administrateur pour forcer la sortie*/}
                                        {/*</p>*/}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-between w-full">
                <Button variant="outline" asChild>
                    <Link href={route('home')}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Accueil
                    </Link>
                </Button>
                <Button
                    variant="default"
                    onClick={handleSubmit}
                    disabled={value.length !== 8}
                >
                    Suivant <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>

            {/* Modal d'urgence */}
            <EmergencyExitModal
                isOpen={showEmergencyModal}
                onClose={() => setShowEmergencyModal(false)}
            />
        </>
    );
};

export default ExitCode;
