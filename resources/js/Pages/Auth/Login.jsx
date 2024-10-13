import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { Loader2 } from "lucide-react";

import { Button } from "@/Components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'));
    };

    return (
            <form onSubmit={submit} className="min-h-screen flex items-center">
                <Head title="Log in" />
                {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

                {/*<form onSubmit={submit}>*/}
                {/*    <div>*/}
                {/*        <InputLabel htmlFor="email" value="Email" />*/}

                {/*        <TextInput*/}
                {/*            id="email"*/}
                {/*            type="email"*/}
                {/*            name="email"*/}
                {/*            value={data.email}*/}
                {/*            className="mt-1 block w-full"*/}
                {/*            autoComplete="username"*/}
                {/*            isFocused={true}*/}
                {/*            onChange={(e) => setData('email', e.target.value)}*/}
                {/*        />*/}

                {/*        <InputError message={errors.email} className="mt-2" />*/}
                {/*    </div>*/}

                {/*    <div className="mt-4">*/}
                {/*        <InputLabel htmlFor="password" value="Password" />*/}

                {/*        <TextInput*/}
                {/*            id="password"*/}
                {/*            type="password"*/}
                {/*            name="password"*/}
                {/*            value={data.password}*/}
                {/*            className="mt-1 block w-full"*/}
                {/*            autoComplete="current-password"*/}
                {/*            onChange={(e) => setData('password', e.target.value)}*/}
                {/*        />*/}

                {/*        <InputError message={errors.password} className="mt-2" />*/}
                {/*    </div>*/}

                {/*    <div className="block mt-4">*/}
                {/*        <label className="flex items-center">*/}
                {/*            <Checkbox*/}
                {/*                name="remember"*/}
                {/*                checked={data.remember}*/}
                {/*                onChange={(e) => setData('remember', e.target.checked)}*/}
                {/*            />*/}
                {/*            <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>*/}
                {/*        </label>*/}
                {/*    </div>*/}

                {/*    <div className="flex items-center justify-end mt-4">*/}
                {/*        {canResetPassword && (*/}
                {/*            <Link*/}
                {/*                href={route('password.request')}*/}
                {/*                className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"*/}
                {/*            >*/}
                {/*                Forgot your password?*/}
                {/*            </Link>*/}
                {/*        )}*/}

                {/*        <PrimaryButton className="ms-4" disabled={processing}>*/}
                {/*            Log in*/}
                {/*        </PrimaryButton>*/}
                {/*    </div>*/}
                {/*</form>*/}

                <Card className="mx-auto max-w-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl">Login</CardTitle>
                        <CardDescription>
                            Enter your email below to login to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full"
                                    autoComplete="username"
                                    placeholder="m@example.com"
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    {canResetPassword && (
                                        <Link href={route('password.request')} className="ml-auto inline-block text-sm underline">
                                            Forgot your password?
                                        </Link>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="block">
                                <label className="flex items-center">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                    />
                                    <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                                </label>
                            </div>

                            <Button type="submit" className="w-full" disabled={processing}>
                                {processing && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Login
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link href={route("register")} className="underline">
                                Sign up
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </form>
    );
}
