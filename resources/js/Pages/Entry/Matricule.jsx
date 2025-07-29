import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from "@/Components/ui/button";
import { Link } from "@inertiajs/react";
import { Card, CardContent } from "@/Components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/Components/ui/input-otp";
import EntryTypes from "@/Enums/EntryTypes";

const Matricule = ({
   nextStep,
   backStep,
   formData,
   currentStep,
   totalSteps,
   entryType,
   sectionTitle,
   sectionSubTitle,
   SectionIcon = ShieldCheck
}) => {
    const [value, setValue] = useState(formData.matricule || '');

    const handleComplete = (value) => {
        if (value.length === 8) {
            switch (entryType) {
                case EntryTypes.Employee: nextStep({ matricule: value }); break;
                case EntryTypes.Visitor: nextStep({ identifiant: value }); break;
            }
        }
    };

    return (
        <>
            <div className="flex justify-center space-x-6 my-16 w-[900px]">
                <Card className="w-full">
                    <CardContent className="pt-6">
                        <div className="flex items-start">
                            <SectionIcon className="h-12 w-12 text-primary mr-4 flex-shrink-0" />
                            <div className="w-full">
                                <h2 className="font-semibold text-lg">{sectionTitle ?? 'Matricule Docaposte'}</h2>
                                <p className="text-sm text-muted-foreground">{sectionSubTitle ?? 'Pour continuer nous allons avoir besoin de votre matricule à 8 chiffres'}</p>

                                <div className="pt-6 w-full">
                                    <InputOTP
                                        type="number"
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
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-between w-full">
                <Button variant="outline" onClick={backStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Retour
                </Button>
                <Button
                    variant="default"
                    onClick={() => value.length === 8 && nextStep({ matricule: value })}
                    disabled={value.length !== 8}
                >
                    Suivant <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </>
    );
};

export default Matricule;
