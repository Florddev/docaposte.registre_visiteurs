import React from 'react';
import {Head, usePage} from "@inertiajs/react";
import { Link } from '@inertiajs/react'
import {
    Bell,
    CircleUser,
    Home, Icon,
    LineChart,
    Menu,
    Package,
    Search,
    ShoppingCart,
    Users,
} from "lucide-react"

import { Button } from "@/Components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"
import { Input } from "@/Components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/Components/ui/sheet"
import ApplicationLogo from "@/Components/ApplicationLogo";
import {cn} from "@/lib/utils";

function LinkComponent({ text = '', Icon = null, ...props}) {
    const isActive = props.href === window.location.href;

    return(
        <Link className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-muted-foreground hover:bg-muted hover:text-foreground/70",
            isActive && "!bg-primary/5 !text-primary"
        )} {...props}>
            {Icon && <Icon className="h-4 w-4" />}
            { text }
        </Link>
    );
}

const MainLayout = ({ title, subtitle, children, sectionName, SectionIcon, ...props }) => {
    const auth = usePage().props.auth;

    return (
        <>
            <Head>
                <title>Registre Visiteurs - Docaposte</title>
                <meta name="description" content="Docaposte app" />
            </Head>
            <div className="flex min-h-screen w-full justify-between">
                <div className="hidden border-r bg-muted/40 md:block w-max md:w-[220px] lg:w-[280px]">
                    <div className="flex h-full max-h-screen flex-col gap-2 sticky top-0">
                        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                            <Link href="/" className="flex items-center gap-2 font-semibold">
                                <ApplicationLogo className="h-6 w-6 fill-primary" />
                                <span className="">Docaposte</span>
                            </Link>
                            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                                <Bell className="h-4 w-4" />
                                <span className="sr-only">Toggle notifications</span>
                            </Button>
                        </div>
                        <div className="flex-1">
                            <nav className="grid gap-0.5 items-start px-2 text-sm font-medium lg:px-4">
                                <LinkComponent href={route('admin.home')} text="Accueil" Icon={Home} />
                                <LinkComponent href={route('admin.visits.index')} text="Visites" Icon={ShoppingCart} />
                                <LinkComponent href={route('home')} text="Utilisateurs" Icon={Users} />
                                <LinkComponent href={route('home')} text="Motifs de visite" Icon={Package} />
                                <LinkComponent href={route('home')} text="Statistiques" Icon={LineChart} />
                            </nav>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col w-full">
                    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 sticky top-0 backdrop-blur-3xl">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="shrink-0 md:hidden"
                                >
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle navigation menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="flex flex-col">
                                <nav className="grid gap-2 text-lg font-medium">
                                    <LinkComponent href="#" text="Accueil" Icon={Home} isActive={true} />
                                    <LinkComponent href="#" text="Visites" Icon={ShoppingCart} />
                                    <LinkComponent href="#" text="Utilisateurs" Icon={Users} />
                                    <LinkComponent href="#" text="Motifs de visite" Icon={Package} />
                                    <LinkComponent href="#" text="Statistiques" Icon={LineChart} />
                                </nav>
                            </SheetContent>
                        </Sheet>
                        <div className="w-full flex-1">
                            <form>
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Search products..."
                                        className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                                    />
                                </div>
                            </form>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary">
                                    {auth.user.name}
                                    <CircleUser size="icon" className="rounded-full h-5 w-5 ml-2" />
                                    <span className="sr-only">Toggle user menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href={route('profile.edit')} className="w-full">Profil</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={route('logout')} className="w-full" method="post" as="button">Logout</Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </header>
                    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6" {...props}>
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
};

export default MainLayout;
