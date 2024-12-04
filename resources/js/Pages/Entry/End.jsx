import React from 'react';
import {User, Users, ArrowLeft, DoorOpen, UserCheck, House, ArrowRight, Sparkles} from 'lucide-react';
import { Button } from "@/Components/ui/button";
import {Link} from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import TactileButton from "@/Components/TactileButton";

const End = () => {
    return (
        <MainLayout sectionName="Bonne visite" SectionIcon={Sparkles} title="Votre visite à bien été enregistré !" subtitle="N’oubliez pas de venir renseigner votre sortie lors de votre depart">
            <div className="flex justify-center space-x-6 my-16">
                {[
                    { title: "Revenir à l’accueil", subtitle: "Revenir à l’accueil de l’application du registre visiteur", Icon: House, href: route('home') },
                    { title: "Nouvelle entrée", subtitle: "Renseigner une nouvelle entrée dans le registre visiteur", Icon: ArrowRight, href: route('entry.index') }
                ].map((item, index) => (
                    <TactileButton key={index} {...item}/>
                ))}
            </div>
        </MainLayout>
    );
};

export default End;
