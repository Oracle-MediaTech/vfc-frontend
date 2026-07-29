"use client";

import { useEffect, useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Loader2, Download, TrendingUp } from "lucide-react";
import { attendanceService } from "@/services/attendanceService";
import { AttendanceTrendPoint } from "@/types/attendance";



interface Props {
  last?: number;
  height?: number;
  departmentId?: string;
}

const ALL = "__ALL__";
const NO_DAY = "__NONE__";

export default function AttendanceTrendBlock({
  last = 12,
  height = 300,
  departmentId = "",
}: Props) {
  const [data, setData] = useState<AttendanceTrendPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [pick, setPick] = useState<string>(ALL);

  useEffect(() => {
    setLoading(true);
    attendanceService
      .getAttendanceTrend({ groupBy: "session", departmentId })
      .then((rows) => setData(rows ?? []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [departmentId]);

  const serviceDays = useMemo(() => {
    const map = new Map<string, string>();
    const sorted = [...data].sort((a, b) => +new Date(a.period) - +new Date(b.period));
    for (const p of sorted) {
      if (p.serviceDayId && p.serviceDayName) {
        if (!map.has(p.serviceDayId)) map.set(p.serviceDayId, p.serviceDayName);
      }
    }
    return Array.from(map, ([id, name]) => ({ id, name }));
  }, [data]);

  const hasUnassigned = useMemo(() => data.some((p) => !p.serviceDayId), [data]);

  const filtered = useMemo(() => {
    const sorted = [...data].sort((a, b) => +new Date(a.period) - +new Date(b.period));
    const matched = sorted.filter((p) => {
      if (pick === ALL) return true;
      if (pick === NO_DAY) return !p.serviceDayId;
      return p.serviceDayId === pick;
    });
    const capped = last > 0 ? matched.slice(-last) : matched;
    return capped.map((p) => ({
      name: format(parseISO(p.period), "MMM dd"),
      rawPeriod: p.period,
      label: p.label,
      count: p.count,
    }));
  }, [data, pick, last]);

  // Key KPI Metrics
  const stats = useMemo(() => {
    if (!filtered.length) return { total: 0, avg: 0, peak: 0 };
    const total = filtered.reduce((acc, curr) => acc + curr.count, 0);
    const peak = Math.max(...filtered.map((f) => f.count));
    return {
      total,
      avg: Math.round(total / filtered.length),
      peak,
    };
  }, [filtered]);

  // Professional PDF Export Function
  const handleExportPDF = async () => {
    if (!filtered.length) return;

    try {
      setExporting(true);
      
      // Dynamic client-side import to avoid SSR errors
      const html2pdf = (await import("html2pdf.js")).default;

      // HTML Template for PDF output
      const element = document.createElement("div");
      element.innerHTML = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 24px; color: #0f172a; background-color: #ffffff;">
          
          <!-- Document Header -->
          <div style="border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 20px;">
            <h1 style="font-size: 22px; font-weight: bold; color: #1e293b; margin: 0 0 4px 0;">Attendance Trend Report</h1>
            <p style="font-size: 11px; color: #64748b; margin: 0;">
              Generated on ${format(new Date(), "MMM dd, yyyy")} &bull; Total Sessions: ${filtered.length}
            </p>
          </div>

          <!-- KPI Summary Cards -->
          <table style="width: 100%; border-collapse: separate; border-spacing: 12px 0; margin: 0 -12px 20px -12px;">
            <tr>
              <td style="width: 33%; vertical-align: top;">
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #2563eb; border-radius: 6px; padding: 12px;">
                  <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #64748b; margin-bottom: 4px;">Total Attendance</div>
                  <div style="font-size: 20px; font-weight: bold; color: #1e293b;">${stats.total.toLocaleString()}</div>
                </div>
              </td>
              <td style="width: 33%; vertical-align: top;">
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #f59e0b; border-radius: 6px; padding: 12px;">
                  <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #64748b; margin-bottom: 4px;">Average / Session</div>
                  <div style="font-size: 20px; font-weight: bold; color: #1e293b;">${stats.avg.toLocaleString()}</div>
                </div>
              </td>
              <td style="width: 34%; vertical-align: top;">
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #10b981; border-radius: 6px; padding: 12px;">
                  <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #64748b; margin-bottom: 4px;">Peak Attendance</div>
                  <div style="font-size: 20px; font-weight: bold; color: #1e293b;">${stats.peak.toLocaleString()}</div>
                </div>
              </td>
            </tr>
          </table>

          <!-- Main Attendance Data Table -->
          <table style="width: 100%; border-collapse: collapse; background: #ffffff; border: 1px solid #e2e8f0; font-size: 12px;">
            <thead>
              <tr style="background-color: #1e293b; color: #ffffff;">
                <th style="padding: 10px; text-align: center; font-size: 11px; text-transform: uppercase;">Date</th>
                <th style="padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase;">Service / Session Name</th>
                <th style="padding: 10px; text-align: right; font-size: 11px; text-transform: uppercase;">Attendance</th>
                <th style="padding: 10px; text-align: right; font-size: 11px; text-transform: uppercase;">vs. Avg</th>
                <th style="padding: 10px; text-align: center; font-size: 11px; text-transform: uppercase;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${filtered
                .map((item, idx) => {
                  const diff = item.count - stats.avg;
                  const isAbove = item.count >= stats.avg;
                  const bg = idx % 2 === 1 ? "background-color: #f8fafc;" : "";
                  const badgeStyle = isAbove
                    ? "background-color: #dcfce7; color: #15803d;"
                    : "background-color: #fee2e2; color: #b91c1c;";
                  const diffColor = isAbove ? "color: #15803d;" : "color: #b91c1c;";
                  const diffFormatted = diff > 0 ? `+${diff}` : `${diff}`;

                  return `
                    <tr style="${bg} border-bottom: 1px solid #e2e8f0;">
                      <td style="padding: 8px 10px; text-align: center;">${item.name}</td>
                      <td style="padding: 8px 10px; font-weight: 500;">${item.label || "N/A"}</td>
                      <td style="padding: 8px 10px; text-align: right; font-weight: 600;">${item.count.toLocaleString()}</td>
                      <td style="padding: 8px 10px; text-align: right; font-weight: 600; ${diffColor}">${diffFormatted}</td>
                      <td style="padding: 8px 10px; text-align: center;">
                        <span style="display: inline-block; padding: 2px 8px; font-size: 10px; font-weight: 600; border-radius: 10px; ${badgeStyle}">
                          ${isAbove ? "Above Avg" : "Below Avg"}
                        </span>
                      </td>
                    </tr>
                  `;
                })
                .join("")}
            </tbody>
          </table>

        </div>
      `;

      // Render options
const opt = {
  margin: 10,
  filename: `Attendance_Trend_${format(new Date(), "yyyy_MM_dd")}.pdf`,
  image: { type: "jpeg", quality: 0.98 },
  html2canvas: { scale: 2, logging: false },
  jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
} as const; 

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("Failed to generate PDF report:", error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* KPI summary inline */}
        {!loading && filtered.length > 0 && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span>
                Avg: <strong className="text-foreground font-semibold">{stats.avg}</strong> / session
              </span>
            </div>
            <span>•</span>
            <div>
              Total: <strong className="text-foreground font-semibold">{stats.total}</strong>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 ml-auto">
          <Select value={pick} onValueChange={setPick}>
            <SelectTrigger className="w-[180px] h-9 text-xs">
              <SelectValue placeholder="Service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All sessions</SelectItem>
              {serviceDays.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name}
                </SelectItem>
              ))}
              {hasUnassigned && (
                <SelectItem value={NO_DAY}>Unassigned (legacy)</SelectItem>
              )}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            className="h-9 px-2.5"
            onClick={handleExportPDF}
            disabled={loading || exporting || filtered.length === 0}
            title="Export PDF Report"
          >
            {exporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div style={{ height }} className="w-full">
        {loading ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground text-sm border border-dashed rounded-lg">
            {data.length === 0 ? "No session data yet" : "No sessions for this service"}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filtered} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} fontSize={11} tickLine={false} axisLine={false} />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-popover p-2.5 shadow-md text-xs space-y-1">
                        <p className="font-semibold">{item.name}</p>
                        {item.label && <p className="text-muted-foreground">{item.label}</p>}
                        <p className="text-primary font-medium">
                          Attendance: <span className="font-bold">{item.count}</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* Benchmark Reference Line */}
              <ReferenceLine
                y={stats.avg}
                stroke="#f59e0b"
                strokeDasharray="3 3"
                strokeWidth={1}
              />

              <Line
                type="monotone"
                dataKey="count"
                stroke="hsl(var(--primary, #6366f1))"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "hsl(var(--primary, #6366f1))" }}
                activeDot={{ r: 5, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}