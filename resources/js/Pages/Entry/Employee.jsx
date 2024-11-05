import React, {useState} from 'react';
import {User, Users, ArrowLeft, DoorOpen, DoorClosed, UserCheck} from 'lucide-react';
import { Button } from "@/Components/ui/button";
import {Link} from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import PersonToMeet from "@/Pages/Entry/PersonToMeet.jsx";

const STEPS = [
    {
        Component: PersonToMeet,
        props: {
            title: "Dites nous qui vous êtes",
            subtitle: "Veuillez renseigner la personne que vous souhaitez rencontrer"
        }
    },
    {
        Component: PersonToMeet,
        props: {
            title: "Test2",
            subtitle: "hey"
        }
    },
];

const Employee = () => {
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
        totalSteps: Object.keys(STEPS).length
    };

    return (
        <MainLayout {...props} sectionName="Entrée" SectionIcon={DoorOpen}>
            <Component {...commonProps} {...props} />
        </MainLayout>
    );
};

export default Employee;
