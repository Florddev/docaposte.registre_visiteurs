import React, {useState} from 'react';
import {Sparkles, DoorOpen, Lock} from 'lucide-react';
import MainLayout from "@/Layouts/MainLayout";
import PersonToMeet from "@/Pages/Entry/PersonToMeet.jsx";
import Matricule from "@/Pages/Entry/Matricule.jsx";
import Identity from "@/Pages/Entry/Identity.jsx";
import PersonalData from "@/Pages/Entry/PersonalData.jsx";
import End from "@/Pages/Entry/End.jsx";
import Company from "@/Pages/Entry/Company.jsx";
import EntryTypes from "@/Enums/EntryTypes";

const STEPS = [
    {
        Component: PersonToMeet,
        props: {
            subtitle: 'Veuillez renseigner la personne que vous souhaitez rencontrer'
        }
    },
    {
        Component: Company,
        props: {
            subtitle: 'Veuillez renseigner l’entreprise dans laquelle vous travaillez'
        }
    },
    {
        Component: Identity,
        props: {
            subtitle: 'Veuillez renseigner vos informations personnelles'
        }
    },
    {
        Component: Matricule,
        props: {
            sectionTitle: 'Identifiant de sortie',
            sectionSubTitle: 'Cette identifiant vous permettera de valider votre sortie et signer la fin de votre visie. Vous devez absolument vous souvenir de cette identifiant pour valider votre sortie',
            SectionIcon: Lock,
            subtitle: 'Veuillez renseigner votre numéro de matricule'
        }
    },
    {
        Component: PersonalData,
        props: {
            title: 'Données personnelles',
            subtitle: 'Informations sur la conservation et le traitement'
        }
    },
    {
        Component: End,
        props: {
            title: 'Votre visite à bien été enregistré !',
            subtitle: 'N’oubliez pas de venir renseigner votre sortie lors \n' + "de votre depart",
            sectionName: 'Bonne visite',
            SectionIcon: Sparkles
        }
    }
];

const Visitor = ({ motifs }) => {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({});

    const { Component, props } = STEPS[step] || STEPS[0];

    const handleNext = (stepData) => {
        setFormData(prev => ({
            ...prev,
            ...stepData
        }));
        setStep(prev => prev + 1);
    };

    const handleBack = () => {
        setStep(prev => prev - 1);
    };

    const commonProps = {
        nextStep: handleNext,
        backStep: handleBack,
        formData, // Données globales du formulaire
        currentStep: step,
        totalSteps: Object.keys(STEPS).length,
        entryType: EntryTypes.Visitor
    };

    return (
        <MainLayout sectionName="Entrée" SectionIcon={DoorOpen} title="Visiteur extérieur" {...props}>
            <Component motifs={motifs} {...commonProps} {...props} />
        </MainLayout>
    );
};

export default Visitor;
