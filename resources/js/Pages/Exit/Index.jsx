import React, {useState} from 'react';
import MainLayout from "@/Layouts/MainLayout";
import Matricule from "@/Pages/Entry/Matricule.jsx";
import EntryTypes from "@/Enums/EntryTypes";
import { DoorClosed, Lock } from 'lucide-react';
import ExitCode from "@/Pages/Exit/ExitCode";

const STEPS = [
    {
        Component: ExitCode,
        props: {
            title: "Renseignez-votre départ",
            subtitle: "Renseignez votre matricule ou identifiant de sortie pour nous informer de votre départ"
        }
    },
];

const Exit = ({ motifs }) => {
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
        <MainLayout sectionName="Sortie" SectionIcon={DoorClosed} {...props}>
            <Component motifs={motifs} {...commonProps} {...props} />
        </MainLayout>
    );
};

export default Exit;
