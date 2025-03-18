import React from 'react';
import {User, Users, ArrowLeft, DoorOpen, UserCheck, House, ArrowRight, Sparkles} from 'lucide-react';
import { Button } from "@/Components/ui/button";
import {Link} from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import TactileButton from "@/Components/TactileButton";

const End = () => {
    return (
        <MainLayout sectionName="A bientôt" SectionIcon={Sparkles} title="Votre départ a bien été enregistré" subtitle="Merci pour votre visite et à bientôt !">
            <div className="flex justify-center space-x-6 my-16">
                {[
                    { title: "Revenir à l’accueil", subtitle: "Revenir à l’accueil du registre visiteur", Icon: House, href: route('home') },
                    { title: "Nouvelle sortie", subtitle: "Renseigner une nouvelle sortie signant la fin d’une visite", Icon: ArrowRight, href: route('exit.index') }
                ].map((item, index) => (
                    <TactileButton key={index} {...item}/>
                ))}
            </div>
        </MainLayout>
    );
};

export default End;
