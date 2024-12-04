import React, {useState} from 'react';
import {User, ArrowLeft, ArrowRight, Building2} from 'lucide-react';
import { Button } from "@/Components/ui/button";
import {Link} from "@inertiajs/react";
import {Card, CardContent} from "@/Components/ui/card";
import {Input} from "@/Components/ui/input";

const Company = ({
    nextStep,
    backStep,
    formData,
    currentStep,
    totalSteps
}) => {
    const [data, setData] = useState({
        company: formData.company || '',
    });

    const handleSubmit = () => {
        if (data.company) {
            nextStep(data);
        }
    };

    return (
        <>
            <div className="flex justify-center space-x-6 my-16 w-[900px]">
                <Card className="w-full">
                    <CardContent className="pt-6">
                        <div className="flex items-start">
                            <Building2 className="h-12 w-12 text-primary mr-4 flex-shrink-0" />
                            <div className="w-full">
                                <h2 className="font-semibold text-lg">Votre entreprise</h2>
                                <p className="text-sm text-muted-foreground">Veuillez indiquer le nom de l’entreprise pour laquelle vous travaillez.</p>

                                <div className="pt-6 w-full">
                                    <Input id="company"
                                           placeholder="Nom de votre entreprise"
                                           value={data.company}
                                           onChange={(e) => setData(prev => ({
                                               ...prev,
                                               company: e.target.value
                                           }))}
                                    />
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
                <Button variant="default"
                        onClick={handleSubmit}
                        disabled={!data.company}
                >
                    Suivant <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </>
    );
};

export default Company;
