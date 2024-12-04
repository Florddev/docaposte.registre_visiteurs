import React, { useState } from 'react';
import { User, ArrowLeft, ArrowRight, Phone } from 'lucide-react';
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";

const Identity = ({
  nextStep,
  backStep,
  formData,
  currentStep,
  totalSteps
}) => {
    const [data, setData] = useState({
        lastName: formData.lastName || '',
        firstName: formData.firstName || '',
        phone: formData.phone || '',
        email: formData.email || ''
    });

    const handleChange = (field) => (e) => {
        setData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const handleNext = () => {
        if (data.lastName && data.firstName && data.phone && data.email) {
            nextStep(data);
        }
    };

    return (
        <>
            <div className="flex justify-center space-x-6 my-16 w-[900px]">
                <Card className="w-full">
                    <CardContent className="pt-6">
                        <div className="flex items-start">
                            <User className="h-12 w-12 text-primary mr-4 flex-shrink-0" />
                            <div className="w-full">
                                <h2 className="font-semibold text-lg">Identité</h2>
                                <p className="text-sm text-muted-foreground">
                                    Renseignez vos identité pour que l'on puisse vous reconnaitre.
                                </p>

                                <div className="pt-6 flex w-full gap-4">
                                    <div className="w-full flex flex-col space-y-1.5">
                                        <Label htmlFor="lastName">Nom</Label>
                                        <Input
                                            value={data.lastName}
                                            onChange={handleChange('lastName')}
                                            placeholder="Nom de famille"
                                        />
                                    </div>
                                    <div className="w-full flex flex-col space-y-1.5">
                                        <Label htmlFor="firstName">Prénom</Label>
                                        <Input
                                            value={data.firstName}
                                            onChange={handleChange('firstName')}
                                            placeholder="Prénom"
                                        />
                                    </div>
                                </div>
                                <div className="pt-6 flex w-full gap-4">
                                    <div className="w-96 flex flex-col space-y-1.5">
                                        <Label htmlFor="phone">Téléphone</Label>
                                        <Input
                                            value={data.phone}
                                            onChange={handleChange('phone')}
                                            placeholder="Numéro de téléphone"
                                        />
                                    </div>
                                    <div className="w-full flex flex-col space-y-1.5">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            type="email"
                                            value={data.email}
                                            onChange={handleChange('email')}
                                            placeholder="Adresse email"
                                        />
                                    </div>
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
                    onClick={handleNext}
                    disabled={!data.lastName || !data.firstName || !data.phone || !data.email}
                >
                    Suivant <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </>
    );
};

export default Identity;
