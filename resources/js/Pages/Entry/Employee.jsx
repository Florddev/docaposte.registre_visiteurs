import React, {useState} from 'react';
import {Sparkles, DoorOpen} from 'lucide-react';
import MainLayout from "@/Layouts/MainLayout";
import PersonToMeet from "@/Pages/Entry/PersonToMeet.jsx";
import Matricule from "@/Pages/Entry/Matricule.jsx";
import Identity from "@/Pages/Entry/Identity.jsx";
import PersonalData from "@/Pages/Entry/PersonalData.jsx";
import End from "@/Pages/Entry/End.jsx";
import EntryTypes from "@/Enums/EntryTypes";

const STEPS = [
    {
        Component: PersonToMeet,
        props: {
            subtitle: "Veuillez renseigner la personne que vous souhaitez rencontrer"
        }
    },
    {
        Component: Matricule,
        props: {
            subtitle: "Veuillez renseigner votre numéro de matricule"
        }
    },
    {
        Component: Identity,
        props: {
            subtitle: "Veuillez renseigner vos informations personnelles"
        }
    },
    {
        Component: PersonalData,
        props: {
            title: "Données personnelles",
            subtitle: "Informations sur la conservation et le traitement"
        }
    }
];

const Employee = ({ motifs }) => {
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
        entryType: EntryTypes.Employee
    };

    return (
        <MainLayout sectionName="Entrée" SectionIcon={DoorOpen} title="Salarié Docaposte" {...props}>
            <Component motifs={motifs} {...commonProps} {...props} />
        </MainLayout>
    );
};

export default Employee;
