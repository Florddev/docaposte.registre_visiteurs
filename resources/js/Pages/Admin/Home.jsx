import AdminLayout from "@/Layouts/AdminLayout";
import React, { useState } from "react";
import { ArrowUpIcon, ArrowDownIcon, BarChart3, PieChart, Clock, UserRound, Calendar, ClipboardCheck, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart as RechartsPieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from "recharts";
import { Badge } from "@/Components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { router } from "@inertiajs/react";

// Dashboard Stat Card Component
const StatCard = ({ title, value, description, icon: Icon, trend, trendValue }) => {
    const trendIsPositive = trend === 'up';
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
                {trend && (
                    <div className={`flex items-center space-x-1 mt-2 text-xs ${trendIsPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {trendIsPositive ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
                        <span>{trendValue}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

// Dashboard Overview Component
const VisitsOverview = ({ stats }) => {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <StatCard
                title="Visites d'entreprises"
                value={stats.totalVisits}
                description={`${stats.activeVisits} entreprises actuellement en visite`}
                icon={ClipboardCheck}
                trend="up"
                trendValue={`${stats.visitsTrend}% depuis le mois dernier`}
            />
            <StatCard
                title="Entreprises uniques"
                value={stats.uniqueVisitors}
                description={`${stats.returningVisitorsPercentage}% d'entreprises récurrentes`}
                icon={UserRound}
                trend="up"
                trendValue={`${stats.visitorsTrend}% depuis le mois dernier`}
            />
            <StatCard
                title="Visiteurs individuels"
                value={stats.totalIndividualVisitors}
                description={`Moyenne: ${stats.avgVisitorsPerCompanyVisit} visiteurs/visite`}
                icon={Users}
            />
            <StatCard
                title="Durée moyenne"
                value={stats.averageDuration}
                description="Durée moyenne des visites"
                icon={Clock}
            />
            <StatCard
                title="Aujourd'hui"
                value={stats.todayVisits}
                description={`${stats.plannedVisits} visites d'entreprises planifiées`}
                icon={Calendar}
                trend={stats.todayTrend === 'up' ? 'up' : 'down'}
                trendValue={`${Math.abs(stats.todayTrendValue)}% par rapport à hier`}
            />
        </div>
    );
};

// Composant de tableau des visites récentes
const RecentVisitsTable = ({ recentVisits }) => {
    const formatDateTime = (dateString) => {
        if (!dateString) return "-";
        return format(new Date(dateString), "dd MMM yyyy • HH:mm", { locale: fr });
    };

    const getVisitStatus = (visit) => {
        if (!visit.date_entree) return "Non commencée";
        if (!visit.date_sortie) return "En cours";
        return "Terminée";
    };

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case "Non commencée": return "outline";
            case "En cours": return "success";
            case "Terminée": return "default";
            default: return "outline";
        }
    };

    const handleViewClick = (visitId) => {
        router.get(route("admin.visits.show", visitId));
    };

    return (
        <Card className="col-span-1 md:col-span-2">
            <CardHeader>
                <CardTitle>Visites récentes</CardTitle>
                <CardDescription>Les dernières visites enregistrées</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Visiteur</TableHead>
                            <TableHead>Motif</TableHead>
                            <TableHead>Date d'entrée</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentVisits.map((visit) => {
                            const status = getVisitStatus(visit);
                            const badgeVariant = getStatusBadgeVariant(status);

                            let badgeClassName = "bg-gray-100 text-gray-800";
                            if (status === "En cours") badgeClassName = "bg-green-100 text-green-800";
                            if (status === "Terminée") badgeClassName = "bg-blue-100 text-blue-800";

                            return (
                                <TableRow key={visit.id}>
                                    <TableCell className="font-medium">
                                        {visit.visitor
                                            ? `${visit.visitor.lastname} ${visit.visitor.firstname}`
                                            : "Visiteur supprimé"}
                                    </TableCell>
                                    <TableCell>{visit.purpose?.name || "-"}</TableCell>
                                    <TableCell>{formatDateTime(visit.date_entree)}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={badgeVariant}
                                            className={badgeClassName}
                                        >
                                            {status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleViewClick(visit.id)}
                                        >
                                            Voir
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter>
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.get(route("admin.visits.index"))}
                >
                    Voir toutes les visites
                </Button>
            </CardFooter>
        </Card>
    );
};

// Composant du graphique des visites par jour
const VisitsByDayChart = ({ dailyVisitsData }) => {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <Card className="col-span-1 md:col-span-2">
            <CardHeader>
                <CardTitle>Visites d'entreprises par jour</CardTitle>
                <CardDescription>Évolution du nombre de visites d'entreprises sur les 7 derniers jours</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={dailyVisitsData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0066FF" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#0066FF" stopOpacity={0.1}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#0066FF"
                                fillOpacity={1}
                                fill="url(#colorVisits)"
                                name="Visites"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

// Composant du graphique des visites par motif
const VisitsByPurposeChart = ({ purposeData }) => {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF6B6B', '#6BCB77', '#4D96FF', '#9D6BCB'];

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Répartition par motif</CardTitle>
                <CardDescription>Distribution des visites par motif</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-80 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                            <Pie
                                data={purposeData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                                {purposeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} visites`, 'Nombre']} />
                            <Legend />
                        </RechartsPieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

// Composant du graphique des visites par période de la journée
const VisitsByTimeChart = ({ timeData }) => {
    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Visites d'entreprises par horaire</CardTitle>
                <CardDescription>Répartition des visites d'entreprises par tranche horaire</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={timeData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#6366F1" name="Visites d'entreprises" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

// Composant principal du tableau de bord
export default function Home({ stats, recentVisits, dailyVisitsData, purposeData, timeData, completionRateData }) {
    const [selectedTab, setSelectedTab] = useState("overview");

    return (
        <AdminLayout>
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Tableau de bord</h2>
                <div className="flex items-center space-x-2">
                    <Button onClick={() => router.get(route("admin.visits.create"))}>
                        Nouvelle visite
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="overview" value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                    <TabsTrigger value="analytics">Analytiques détaillées</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <VisitsOverview stats={stats} />

                    <div className="grid gap-4 md:grid-cols-2">
                        <VisitsByPurposeChart purposeData={purposeData} />
                        <VisitsByTimeChart timeData={timeData} />
                        <VisitsByDayChart dailyVisitsData={dailyVisitsData} />
                    </div>

                    <RecentVisitsTable recentVisits={recentVisits} />
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            title="Taux de complétion"
                            value={`${stats.completionRate}%`}
                            description="Visites terminées correctement"
                            icon={BarChart3}
                            trend="up"
                            trendValue={`${stats.completionRateTrend}% depuis le mois dernier`}
                        />
                        <StatCard
                            title="Motif le plus fréquent"
                            value={stats.topPurpose.name}
                            description={`${stats.topPurpose.count} visites ce mois-ci`}
                            icon={PieChart}
                        />
                        <StatCard
                            title="Jour le plus chargé"
                            value={stats.busiestDay.day}
                            description={`${stats.busiestDay.count} visites en moyenne`}
                            icon={Calendar}
                        />
                        <StatCard
                            title="Heure de pointe"
                            value={stats.peakHour.hour}
                            description={`${stats.peakHour.count} visites en moyenne`}
                            icon={Clock}
                        />
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Taux de complétion des visites</CardTitle>
                            <CardDescription>Pourcentage des visites terminées correctement par mois</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={completionRateData}
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis domain={[0, 100]} />
                                        <Tooltip formatter={(value) => [`${value}%`, 'Taux de complétion']} />
                                        <Legend />
                                        <Line type="monotone" dataKey="value" stroke="#0066FF" activeDot={{ r: 8 }} name="Taux de complétion" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Visites par type de visiteur</CardTitle>
                                <CardDescription>Répartition entre employés et visiteurs extérieurs</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RechartsPieChart>
                                            <Pie
                                                data={[
                                                    { name: 'Employés', value: stats.employeeVisits },
                                                    { name: 'Visiteurs externes', value: stats.externalVisits }
                                                ]}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                                nameKey="name"
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            >
                                                <Cell fill="#0088FE" />
                                                <Cell fill="#00C49F" />
                                            </Pie>
                                            <Tooltip formatter={(value) => [`${value} visites`, 'Nombre']} />
                                            <Legend />
                                        </RechartsPieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Durée moyenne par motif</CardTitle>
                                <CardDescription>Temps moyen passé par type de visite (en minutes)</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={stats.durationByPurpose}
                                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip formatter={(value) => [`${value} min`, 'Durée moyenne']} />
                                            <Bar dataKey="value" fill="#8884d8" name="Durée moyenne (min)" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </AdminLayout>
    );
}
