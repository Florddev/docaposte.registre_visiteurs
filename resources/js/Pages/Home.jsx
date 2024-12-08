import React from 'react';
import {User, Users, ArrowLeft, DoorOpen, DoorClosed, UserCheck} from 'lucide-react';
import { Button } from "@/Components/ui/button";
import {Link} from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout.jsx";
import TactileButton from "@/Components/TactileButton.jsx";

const Home = () => {
    return (
        <MainLayout
            title="Bienvenue chez Docaposte"
            subtitle="Veuillez enregistrer votre entrée dans notre registre, ou nous informer de votre départ"
        >
            <div className="flex justify-center space-x-6 my-16">
                {[
                    { title: "Entrée", subtitle: "Enregistrez votre visite dans notre registre visiteurs", Icon: DoorOpen, href: route('entry.index') },
                    { title: "Sortie", subtitle: "Renseignez votre sortie signant la fin de votre visite", Icon: DoorClosed, href: route('exit.index') }
                ].map((item, index) => (
                    <TactileButton key={index} {...item}/>
                ))}
            </div>
        </MainLayout>
    );
};

export default Home;
