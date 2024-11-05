import React from 'react';
import {User, Users, ArrowLeft, DoorOpen, UserCheck, ArrowRight} from 'lucide-react';
import { Button } from "@/Components/ui/button";
import {Link} from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/Components/ui/card";
import {Label} from "@/Components/ui/label";
import {Input} from "@/Components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/Components/ui/select";

const PersonToMeet = ({
    nextStep,
    backStep,
    formData,
    currentStep,
    totalSteps
}) => {
    return (
        <>
            <div className="flex justify-center space-x-6 my-16">
                <Card className="min-w-[900px]">
                    <CardContent className="pt-6">
                        <div className="flex items-start">
                            <User className="h-12 w-12 text-primary mr-4 flex-shrink-0" />
                            <div>
                                <h2 className="font-semibold text-lg">Personne à rencontrer</h2>
                                <p className="text-sm text-muted-foreground">Veuillez indiquer la personne avec qui vous avez un rendez-vous ou que vous souhaitez rencontrer lors de votre visite. Cela nous permettra de vous diriger efficacement vers le bon service.</p>

                                <div className="pt-6">
                                    <Select>
                                        <SelectTrigger id="framework">
                                            <SelectValue placeholder="Selectionnez la personne à rencontrer..." />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                            <SelectItem value="next">Next.js</SelectItem>
                                            <SelectItem value="sveltekit">SvelteKit</SelectItem>
                                            <SelectItem value="astro">Astro</SelectItem>
                                            <SelectItem value="nuxt">Nuxt.js</SelectItem>
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
                <Button variant="default" onClick={nextStep}>
                    Suivant <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </>
    );
};

export default PersonToMeet;
