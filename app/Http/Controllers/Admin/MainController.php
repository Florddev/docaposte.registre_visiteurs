<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Visit;
use App\Models\Visitor;
use App\Models\Purpose;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MainController extends Controller
{
    public function home()
    {
        // Date references
        $today = Carbon::today();
        $yesterday = Carbon::yesterday();
        $currentMonth = Carbon::now()->startOfMonth();
        $lastMonth = Carbon::now()->subMonth()->startOfMonth();
        $weekAgo = Carbon::now()->subDays(7);

        // Total company visits (grouped by company and date)
        $totalVisits = Visit::select(DB::raw('DATE(date_entree) as visit_date'), 'company')
            ->whereNotNull('date_entree')
            ->whereNotNull('company')
            ->where('company', '!=', '')
            ->groupBy('visit_date', 'company')
            ->get()
            ->count();

        $totalVisitsLastMonth = Visit::select(DB::raw('DATE(date_entree) as visit_date'), 'company')
            ->whereNotNull('date_entree')
            ->whereNotNull('company')
            ->where('company', '!=', '')
            ->where('created_at', '<', $currentMonth)
            ->where('created_at', '>=', $lastMonth)
            ->groupBy('visit_date', 'company')
            ->get()
            ->count();

        $visitsTrend = $totalVisitsLastMonth > 0
            ? round(($totalVisits - $totalVisitsLastMonth) / $totalVisitsLastMonth * 100)
            : 100;

        // Active company visits (companies currently visiting)
        $activeVisits = Visit::select('company')
            ->whereNotNull('date_entree')
            ->whereNull('date_sortie')
            ->whereNotNull('company')
            ->where('company', '!=', '')
            ->whereDate('date_entree', $today)
            ->groupBy('company')
            ->get()
            ->count();

        // Today's company visits
        $todayVisits = Visit::select('company')
            ->whereDate('date_entree', $today)
            ->whereNotNull('company')
            ->where('company', '!=', '')
            ->groupBy('company')
            ->get()
            ->count();

        $yesterdayVisits = Visit::select('company')
            ->whereDate('date_entree', $yesterday)
            ->whereNotNull('company')
            ->where('company', '!=', '')
            ->groupBy('company')
            ->get()
            ->count();
        $todayTrend = $yesterdayVisits > 0 ? ($todayVisits >= $yesterdayVisits ? 'up' : 'down') : 'up';
        $todayTrendValue = $yesterdayVisits > 0
            ? round(abs($todayVisits - $yesterdayVisits) / $yesterdayVisits * 100)
            : 100;

        // Planned company visits (future dates)
        $plannedVisits = Visit::select('company', DB::raw('DATE(date_entree) as visit_date'))
            ->where('date_entree', '>', Carbon::now())
            ->whereNotNull('company')
            ->where('company', '!=', '')
            ->groupBy('company', 'visit_date')
            ->get()
            ->count();

        // Unique companies
        $uniqueVisitors = Visit::select('company')
            ->whereNotNull('company')
            ->where('company', '!=', '')
            ->groupBy('company')
            ->get()
            ->count();

        $uniqueVisitorsLastMonth = Visit::select('company')
            ->where('created_at', '<', $currentMonth)
            ->where('created_at', '>=', $lastMonth)
            ->whereNotNull('company')
            ->where('company', '!=', '')
            ->groupBy('company')
            ->get()
            ->count();
        $visitorsTrend = $uniqueVisitorsLastMonth > 0
            ? round(($uniqueVisitors - $uniqueVisitorsLastMonth) / $uniqueVisitorsLastMonth * 100)
            : 100;

        // Recurring companies (companies that have visited more than once)
        $recurringVisitorsCount = DB::table('visits')
            ->select('company', DB::raw('COUNT(DISTINCT DATE(date_entree)) as visit_days'))
            ->whereNotNull('company')
            ->where('company', '!=', '')
            ->whereNotNull('date_entree')
            ->groupBy('company')
            ->having('visit_days', '>', 1)
            ->get()
            ->count();

        $returningVisitorsPercentage = $uniqueVisitors > 0
            ? round($recurringVisitorsCount / $uniqueVisitors * 100)
            : 0;

        // Total individual visitors per company visits
        $totalIndividualVisitors = Visit::whereNotNull('company')
            ->where('company', '!=', '')
            ->whereNotNull('date_entree')
            ->count();

        // Average visitors per company visit
        $avgVisitorsPerCompanyVisit = $totalVisits > 0
            ? round($totalIndividualVisitors / $totalVisits, 1)
            : 0;

        // Average visit duration
        $averageDuration = Visit::whereNotNull('date_entree')
            ->whereNotNull('date_sortie')
            ->get()
            ->avg(function ($visit) {
                $entryDate = Carbon::parse($visit->date_entree);
                $exitDate = Carbon::parse($visit->date_sortie);
                return $entryDate->diffInMinutes($exitDate);
            });

        // Format average duration as hours and minutes
        $averageDurationHours = floor($averageDuration / 60);
        $averageDurationMinutes = round($averageDuration % 60);
        $formattedAverageDuration = $averageDurationHours > 0
            ? $averageDurationHours . 'h ' . $averageDurationMinutes . 'min'
            : $averageDurationMinutes . 'min';

        // Completion rate (visits that have both entry and exit times)
        $completedVisits = Visit::whereNotNull('date_entree')
            ->whereNotNull('date_sortie')
            ->count();
        $completionRate = $totalVisits > 0 ? round($completedVisits / $totalVisits * 100) : 0;

        // Top purpose
        $topPurpose = Purpose::select('purposes.id', 'purposes.nom as name', DB::raw('COUNT(visits.id) as count'))
            ->leftJoin('visits', 'purposes.id', '=', 'visits.motif_id')
            ->whereNotNull('visits.id')
            ->groupBy('purposes.id', 'purposes.nom')
            ->orderBy('count', 'desc')
            ->first();

        // Busiest day of the week
        $busiestDay = DB::table('visits')
            ->select(DB::raw('DAYNAME(date_entree) as day'), DB::raw('COUNT(*) as count'))
            ->whereNotNull('date_entree')
            ->groupBy('day')
            ->orderBy('count', 'desc')
            ->first();

        // Peak hour
        $peakHour = DB::table('visits')
            ->select(DB::raw('HOUR(date_entree) as hour'), DB::raw('COUNT(*) as count'))
            ->whereNotNull('date_entree')
            ->groupBy('hour')
            ->orderBy('count', 'desc')
            ->first();

        if ($peakHour) {
            $peakHour->hour = sprintf('%02d:00', $peakHour->hour);
        } else {
            $peakHour = (object) ['hour' => '00:00', 'count' => 0];
        }

        if (!$busiestDay) {
            $busiestDay = (object) ['day' => 'Lundi', 'count' => 0];
        }

        if (!$topPurpose) {
            $topPurpose = (object) ['name' => 'Aucun', 'count' => 0];
        }

        // Employee vs external visits
        $employeeVisits = Visit::whereHas('visitor', function ($query) {
            $query->whereNotNull('employee_number');
        })->count();

        $externalVisits = $totalVisits - $employeeVisits;

        // Duration by purpose
        $durationByPurpose = Purpose::select('purposes.nom as name', DB::raw('AVG(TIMESTAMPDIFF(MINUTE, visits.date_entree, visits.date_sortie)) as value'))
            ->join('visits', 'purposes.id', '=', 'visits.motif_id')
            ->whereNotNull('visits.date_entree')
            ->whereNotNull('visits.date_sortie')
            ->groupBy('purposes.id', 'purposes.nom')
            ->having('value', '>', 0)
            ->get()
            ->map(function ($item) {
                $item->value = round($item->value);
                return $item;
            });

        // Daily company visits data (last 7 days)
        $dailyVisitsData = collect(range(0, 6))
            ->map(function ($daysAgo) {
                $date = Carbon::now()->subDays($daysAgo);

                $companyVisits = Visit::select('company')
                    ->whereDate('date_entree', $date->toDateString())
                    ->whereNotNull('company')
                    ->where('company', '!=', '')
                    ->groupBy('company')
                    ->get()
                    ->count();

                return [
                    'name' => $date->format('d/m'),
                    'value' => $companyVisits
                ];
            })
            ->reverse()
            ->values();

        // Visits by purpose data
        $purposeData = Purpose::select('purposes.nom as name', DB::raw('COUNT(visits.id) as value'))
            ->leftJoin('visits', 'purposes.id', '=', 'visits.motif_id')
            ->whereNotNull('visits.id')
            ->groupBy('purposes.id', 'purposes.nom')
            ->get();

        // Visits by time of day
        $timeRanges = [
            '8h-10h' => [8, 10],
            '10h-12h' => [10, 12],
            '12h-14h' => [12, 14],
            '14h-16h' => [14, 16],
            '16h-18h' => [16, 18],
            'Après 18h' => [18, 24]
        ];

        $timeData = collect($timeRanges)->map(function ($range, $label) {
            $companyVisits = Visit::select('company', DB::raw('DATE(date_entree) as visit_date'))
                ->whereNotNull('date_entree')
                ->whereNotNull('company')
                ->where('company', '!=', '')
                ->whereRaw('HOUR(date_entree) >= ?', [$range[0]])
                ->whereRaw('HOUR(date_entree) < ?', [$range[1]])
                ->groupBy('company', 'visit_date')
                ->get()
                ->count();

            return [
                'name' => $label,
                'value' => $companyVisits
            ];
        })->values();

        // Monthly completion rate data (last 6 months)
        $completionRateData = collect(range(0, 5))
            ->map(function ($monthsAgo) {
                $date = Carbon::now()->subMonths($monthsAgo)->startOfMonth();
                $month = $date->format('M Y');

                $totalMonthVisits = Visit::whereBetween('created_at', [
                    $date->copy()->startOfMonth(),
                    $date->copy()->endOfMonth()
                ])->count();

                $completedMonthVisits = Visit::whereNotNull('date_entree')
                    ->whereNotNull('date_sortie')
                    ->whereBetween('created_at', [
                        $date->copy()->startOfMonth(),
                        $date->copy()->endOfMonth()
                    ])->count();

                $rate = $totalMonthVisits > 0 ? round($completedMonthVisits / $totalMonthVisits * 100) : 0;

                return [
                    'name' => $month,
                    'value' => $rate
                ];
            })
            ->reverse()
            ->values();

        // Recent visits with visitor and purpose data
        $recentVisits = Visit::with(['visitor', 'purpose'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($visit) {
                return [
                    'id' => $visit->id,
                    'visitor' => $visit->visitor,
                    'purpose' => $visit->purpose ? ['name' => $visit->purpose->nom] : null,
                    'visit_recipient' => $visit->visit_recipient,
                    'company' => $visit->company,
                    'date_entree' => $visit->date_entree,
                    'date_sortie' => $visit->date_sortie,
                    'identifiant_sortie' => $visit->identifiant_sortie,
                ];
            });

        // Stats array
        $stats = [
            'totalVisits' => $totalVisits,
            'activeVisits' => $activeVisits,
            'visitsTrend' => $visitsTrend,
            'todayVisits' => $todayVisits,
            'plannedVisits' => $plannedVisits,
            'todayTrend' => $todayTrend,
            'todayTrendValue' => $todayTrendValue,
            'uniqueVisitors' => $uniqueVisitors,
            'visitorsTrend' => $visitorsTrend,
            'returningVisitorsPercentage' => $returningVisitorsPercentage,
            'totalIndividualVisitors' => $totalIndividualVisitors,
            'avgVisitorsPerCompanyVisit' => $avgVisitorsPerCompanyVisit,
            'averageDuration' => $formattedAverageDuration,
            'completionRate' => $completionRate,
            'completionRateTrend' => 5, // Mock value, would need historical data to calculate
            'topPurpose' => [
                'name' => $topPurpose->name ?? 'Aucun',
                'count' => $topPurpose->count ?? 0
            ],
            'busiestDay' => [
                'day' => $busiestDay->day,
                'count' => $busiestDay->count
            ],
            'peakHour' => [
                'hour' => $peakHour->hour,
                'count' => $peakHour->count
            ],
            'employeeVisits' => $employeeVisits,
            'externalVisits' => $externalVisits,
            'durationByPurpose' => $durationByPurpose
        ];

        return Inertia::render('Admin/Home', [
            'stats' => $stats,
            'recentVisits' => $recentVisits,
            'dailyVisitsData' => $dailyVisitsData,
            'purposeData' => $purposeData,
            'timeData' => $timeData,
            'completionRateData' => $completionRateData
        ]);
    }
}
