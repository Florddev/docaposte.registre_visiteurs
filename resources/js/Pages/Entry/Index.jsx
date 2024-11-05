import React from 'react';
import {User, Users, ArrowLeft, DoorOpen, UserCheck} from 'lucide-react';
import { Button } from "@/Components/ui/button";
import {Link} from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout.jsx";
import TactileButton from "@/Components/TactileButton.jsx";

const EntryPage = () => {
    return (
        <MainLayout
            title="Dites nous qui vous êtes"
            subtitle="Veuillez sélectionner l'option qui vous décrit le mieux"
            sectionName="Entrée"
            SectionIcon={DoorOpen}
        >
            <div className="flex justify-center space-x-6 my-16">
                {[
                    { title: "Salarié Docaposte", subtitle: "Vous êtes un salarié de Docaposte tout site confondu", Icon: UserCheck, href: route('entry.employee') },
                    { title: "Visiteur extérieur", subtitle: "Vous êtes un visiteur extérieur à l'entreprise", Icon: User }
                ].map((item, index) => (
                    <TactileButton key={index} {...item}/>
                ))}
            </div>
            <div className="flex justify-start w-full">
                <Button variant="outline" asChild>
                    <Link href={route('home')}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Retour
                    </Link>
                </Button>
            </div>
        </MainLayout>
    );
};

export default EntryPage;
