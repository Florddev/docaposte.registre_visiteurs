import React, { useState } from 'react';
import { User, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from "@/Components/ui/button";
import { Link } from "@inertiajs/react";
import { Card, CardContent } from "@/Components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Input } from "@/Components/ui/input";

const PersonToMeet = ({
    nextStep,
    backStep,
    formData,
    currentStep,
    totalSteps,
    motifs
}) => {
    const [data, setData] = useState({
        personToMeet: formData.personToMeet || '',
        motifId: formData.motifId || ''
    });

    const handleSubmit = () => {
        if (data.personToMeet && data.motifId) {
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
                                <h2 className="font-semibold text-lg">Personne à rencontrer</h2>
                                <p className="text-sm text-muted-foreground">
                                    Veuillez indiquer la personne avec qui vous avez un rendez-vous ou que vous souhaitez rencontrer lors de votre visite.
                                </p>

                                <div className="pt-6 w-full flex flex-col gap-2">
                                    <Input
                                        placeholder="Qui venez vous rencontrer ?"
                                        value={data.personToMeet}
                                        onChange={(e) => setData(prev => ({
                                            ...prev,
                                            personToMeet: e.target.value
                                        }))}
                                    />
                                    <Select
                                        value={data.motifId}
                                        onValueChange={(value) => setData(prev => ({
                                            ...prev,
                                            motifId: value
                                        }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Quel est le motif de votre visite ?" />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                            {motifs && motifs.map(item => (
                                                <SelectItem key={item.id} value={item.id}>
                                                    {item.nom}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-between w-full">
                <Button variant="outline" asChild>
                    <Link href={route('entry.index')}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Retour
                    </Link>
                </Button>
                <Button
                    variant="default"
                    onClick={handleSubmit}
                    disabled={!data.personToMeet || !data.motifId}
                >
                    Suivant <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </>
    );
};

export default PersonToMeet;
