import React, { useState } from 'react';
import { Info, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Checkbox } from "@/Components/ui/checkbox";
import { router } from '@inertiajs/react';
import {Label} from "@/Components/ui/label";
import {Switch} from "@/Components/ui/switch";

const PersonalData = ({
                          nextStep,
                          backStep,
                          formData,
                          currentStep,
                          totalSteps
                      }) => {
    const [consents, setConsents] = useState({
        dataUnderstanding: formData.dataUnderstanding || false,
        dataRetention: formData.dataRetention || false
    });

    const handleCheckboxChange = (id) => {
        setConsents(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleSubmit = () => {
        const finalData = {
            ...formData,
            dataUnderstanding: consents.dataUnderstanding,
            dataRetention: consents.dataRetention
        };

        router.post(route('entry.submitVisit'), finalData);
    };

    return (
        <>
            <div className="flex justify-center space-x-6 my-16 w-[850px]">
                <Card className="w-full">
                    <CardContent className="pt-6">
                        <div className="flex items-start">
                            <Info className="h-12 w-12 text-primary mr-4 flex-shrink-0" />
                            <div className="w-full">
                                <h2 className="font-semibold text-lg">Conservation et traitement des données personnelles</h2>

                                <div className="text-sm pt-2 pb-4">
                                    <p className="py-2">Les informations collectées dans le cadre de votre visite sont traitées de manière confidentielle et sont conservées pour une durée maximale d'un mois, après quoi elles sont automatiquement supprimées. </p>
                                    <p className="py-2">Ces données sont utilisées pour faciliter et accélérer vos prochaines visites en pré-remplissant certaines informations, si vous y consentez.</p>
                                    <p className="py-2">En acceptant cette collecte de données, vous consentez à leur utilisation dans le but d'améliorer votre expérience en pré-remplissant vos informations personnelles lors de vos prochaines visites. Vous avez le droit de retirer ce consentement à tout moment.</p>
                                </div>

                                <div className="flex flex-col gap-2">
                                    {/*<div className="items-top flex space-x-3 rounded-md border p-4">*/}
                                    {/*    <Checkbox*/}
                                    {/*        id="dataUnderstanding"*/}
                                    {/*        checked={consents.dataUnderstanding}*/}
                                    {/*        onCheckedChange={() => handleCheckboxChange('dataUnderstanding')}*/}
                                    {/*    />*/}
                                    {/*    <div className="grid gap-1.5 leading-none">*/}
                                    {/*        <label*/}
                                    {/*            htmlFor="dataUnderstanding"*/}
                                    {/*            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"*/}
                                    {/*        >*/}
                                    {/*            Informations de conservation des données*/}
                                    {/*        </label>*/}
                                    {/*        <p className="text-sm text-muted-foreground">*/}
                                    {/*            J'ai lu et compris les informations relatives à la conservation et à l'utilisation de mes données personnelles.*/}
                                    {/*        </p>*/}
                                    {/*    </div>*/}
                                    {/*</div>*/}
                                    {/*<div className="items-top flex space-x-3 rounded-md border p-4">*/}
                                    {/*    <Checkbox*/}
                                    {/*        id="dataRetention"*/}
                                    {/*        checked={consents.dataRetention}*/}
                                    {/*        onCheckedChange={() => handleCheckboxChange('dataRetention')}*/}
                                    {/*    />*/}
                                    {/*    <div className="grid gap-1.5 leading-none">*/}
                                    {/*        <label*/}
                                    {/*            htmlFor="dataRetention"*/}
                                    {/*            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"*/}
                                    {/*        >*/}
                                    {/*            Conserver mes données personnelles*/}
                                    {/*        </label>*/}
                                    {/*        <p className="text-sm text-muted-foreground">*/}
                                    {/*            J'accepte que mes informations soient conservées au-delà de la durée standard d'un mois pour faciliter mes prochaines visites.*/}
                                    {/*        </p>*/}
                                    {/*    </div>*/}
                                    {/*</div>*/}

                                    <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <Label
                                                className="text-base"
                                                htmlFor="dataUnderstanding"
                                            >
                                                Informations de conservation des données
                                            </Label>
                                            <p className="text-sm text-muted-foreground">
                                                J'ai lu et compris les informations relatives à la conservation et à l'utilisation de mes données personnelles.
                                            </p>
                                        </div>
                                        <Switch
                                            id="dataUnderstanding"
                                            checked={consents.dataUnderstanding}
                                            onCheckedChange={() => handleCheckboxChange('dataUnderstanding')}
                                        />
                                    </div>
                                    <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <Label
                                                className="text-base"
                                                htmlFor="dataRetention"
                                            >
                                                Conserver mes données personnelles
                                            </Label>
                                            <p className="text-sm text-muted-foreground">
                                                J'accepte que mes informations soient conservées au-delà de la durée standard d'un mois pour faciliter mes prochaines visites.
                                            </p>
                                        </div>
                                        <Switch
                                            id="dataRetention"
                                            checked={consents.dataRetention}
                                            onCheckedChange={() => handleCheckboxChange('dataRetention')}
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
                    onClick={handleSubmit}
                    disabled={!consents.dataUnderstanding}
                >
                    Terminer <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </>
    );
};

export default PersonalData;
