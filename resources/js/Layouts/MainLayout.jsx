import React from 'react';
import {User, Users, ArrowLeft, DoorOpen, DoorClosed, UserCheck} from 'lucide-react';
import { Button } from "@/Components/ui/button";
import {Link} from "@inertiajs/react";

const MainLayout = ({ title, subtitle, children, sectionName, SectionIcon }) => {
    return (
        <div className="flex justify-center items-center">
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 max-w-fit">
                <div className="flex justify-center mb-8">
                    {SectionIcon && <SectionIcon className="h-8 w-8 text-primary" />}
                    <span className="ml-2 text-xl font-semibold">{sectionName}</span>
                </div>

                <h1 className="text-3xl font-bold text-center mb-2">{title}</h1>
                <p className="text-muted-foreground text-center">{subtitle}</p>

                <div className="w-full max-w-4xl">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
