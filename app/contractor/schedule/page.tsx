"use client";

import { useState, useMemo } from "react";

type ViewMode = "month" | "week";

interface ScheduleEvent {
  date: string; // YYYY-MM-DD
  time: string;
  project: string;
  task: string;
  trade: string;
  workers: string[];
}

const tradeColors: Record<string, { bg: string; text: string; dot: string }> = {
  泥作: { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-400" },
  水電: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400" },
  木工: { bg: "bg-yellow-50", text: "text-yellow-800", dot: "bg-yellow-400" },
  油漆: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-400" },
  鋁窗: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-400" },
  拆除: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-400" },
};

const mockEvents: ScheduleEvent[] = [
  { date: "2026-03-17", time: "08:00", project: "大安區林宅翻新", task: "浴室防水施作", trade: "泥作", workers: ["陳師傅", "小林"] },
  { date: "2026-03-17", time: "09:00", project: "信義區張宅廚房改造", task: "廚房配管", trade: "水電", workers: ["張師傅"] },
  { date: "2026-03-18", time: "08:00", project: "大安區林宅翻新", task: "磁磚鋪設", trade: "泥作", workers: ["陳師傅", "阿國"] },
  { date: "2026-03-18", time: "13:00", project: "松山區吳宅全室裝潢", task: "天花板木作", trade: "木工", workers: ["吳師傅", "小陳"] },
  { date: "2026-03-19", time: "08:00", project: "中山區陳宅浴室翻修", task: "鋁窗安裝", trade: "鋁窗", workers: ["李師傅"] },
  { date: "2026-03-19", time: "09:00", project: "信義區張宅廚房改造", task: "電線配置", trade: "水電", workers: ["張師傅", "小周"] },
  { date: "2026-03-19", time: "14:00", project: "內湖區黃宅陽台外推", task: "外牆批土", trade: "泥作", workers: ["陳師傅"] },
  { date: "2026-03-20", time: "08:00", project: "松山區吳宅全室裝潢", task: "隔間拆除", trade: "拆除", workers: ["阿國", "小林"] },
  { date: "2026-03-20", time: "13:00", project: "大安區林宅翻新", task: "油漆底漆", trade: "油漆", workers: ["劉師傅"] },
  { date: "2026-03-21", time: "08:00", project: "大安區林宅翻新", task: "浴室磁磚鋪設", trade: "泥作", workers: ["陳師傅", "小林"] },
  { date: "2026-03-21", time: "08:30", project: "信義區張宅廚房改造", task: "廚房配管完成", trade: "水電", workers: ["張師傅"] },
  { date: "2026-03-21", time: "13:00", project: "中山區陳宅浴室翻修", task: "鋁窗驗收", trade: "鋁窗", workers: ["李師傅"] },
  { date: "2026-03-21", time: "14:00", project: "內湖區黃宅陽台外推", task: "外牆防水", trade: "泥作", workers: ["陳師傅", "阿國"] },
  { date: "2026-03-22", time: "08:00", project: "松山區吳宅全室裝潢", task: "水電管線", trade: "水電", workers: ["張師傅", "小周"] },
  { date: "2026-03-22", time: "09:00", project: "內湖區黃宅陽台外推", task: "窗框安裝", trade: "鋁窗", workers: ["李師傅"] },
  { date: "2026-03-23", time: "08:00", project: "大安區林宅翻新", task: "木地板施作", trade: "木工", workers: ["吳師傅"] },
  { date: "2026-03-24", time: "08:00", project: "信義區張宅廚房改造", task: "櫥櫃安裝", trade: "木工", workers: ["吳師傅", "小陳"] },
  { date: "2026-03-24", time: "13:00", project: "大安區林宅翻新", task: "面漆施作", trade: "油漆", workers: ["劉師傅", "小廖"] },
  { date: "2026-03-25", time: "08:00", project: "中山區陳宅浴室翻修", task: "最終驗收", trade: "泥作", workers: ["陳師傅"] },
  { date: "2026-03-25", time: "14:00", project: "松山區吳宅全室裝潢", task: "泥作粉光", trade: "泥作", workers: ["陳師傅", "阿國"] },
  { date: "2026-03-26", time: "08:00", project: "內湖區黃宅陽台外推", task: "油漆底漆", trade: "油漆", workers: ["劉師傅"] },
  { date: "2026-03-27", time: "08:00", project: "松山區吳宅全室裝潢", task: "木作收邊", trade: "木工", workers: ["吳師傅", "小陳"] },
  { date: "2026-03-28", time: "08:00", project: "信義區張宅廚房改造", task: "面漆施作", trade: "油漆", workers: ["劉師傅", "小廖"] },
];

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function getWeekDates(baseDate: Date): Date[] {
  const day = baseDate.getDay();
  const start = new Date(baseDate);
  start.setDate(start.getDate() - day);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function SchedulePage() {
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 21));
  const [selectedDate, setSelectedDate] = useState<string>("2026-03-21");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const eventsByDate = useMemo(() => {
    const map: Record<string, ScheduleEvent[]> = {};
    for (const ev of mockEvents) {
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    }
    return map;
  }, []);

  const navigatePrev = () => {
    if (viewMode === "month") {
      setCurrentDate(new Date(year, month - 1, 1));
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 7);
      setCurrentDate(d);
    }
  };

  const navigateNext = () => {
    if (viewMode === "month") {
      setCurrentDate(new Date(year, month + 1, 1));
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 7);
      setCurrentDate(d);
    }
  };

  const goToday = () => {
    setCurrentDate(new Date(2026, 2, 21));
    setSelectedDate("2026-03-21");
  };

  const selectedEvents = eventsByDate[selectedDate] ?? [];

  // Month view data
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Week view data
  const weekDates = getWeekDates(currentDate);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">工程日曆</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={goToday}
            className="px-3 py-1.5 text-sm font-medium text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
          >
            今天
          </button>
          <div className="flex bg-slate-100 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode("month")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                viewMode === "month" ? "bg-white text-amber-700 shadow-sm" : "text-slate-600"
              }`}
            >
              月
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                viewMode === "week" ? "bg-white text-amber-700 shadow-sm" : "text-slate-600"
              }`}
            >
              週
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={navigatePrev} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-lg font-semibold text-slate-900">
          {viewMode === "month"
            ? `${year} 年 ${month + 1} 月`
            : `${formatDate(weekDates[0])} ~ ${formatDate(weekDates[6])}`}
        </h2>
        <button onClick={navigateNext} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Trade Legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(tradeColors).map(([trade, colors]) => (
          <span key={trade} className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
            {trade}
          </span>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-amber-100 p-4">
          {viewMode === "month" ? (
            <>
              {/* Month view header */}
              <div className="grid grid-cols-7 mb-2">
                {WEEKDAYS.map((d) => (
                  <div key={d} className="text-center text-xs font-medium text-slate-400 py-2">
                    {d}
                  </div>
                ))}
              </div>
              {/* Month view days */}
              <div className="grid grid-cols-7 gap-px bg-slate-100 rounded-lg overflow-hidden">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="bg-slate-50 min-h-[80px] p-1" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const events = eventsByDate[dateStr] ?? [];
                  const isToday = dateStr === "2026-03-21";
                  const isSelected = dateStr === selectedDate;

                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`bg-white min-h-[80px] p-1.5 text-left transition-colors hover:bg-amber-50/50 ${
                        isSelected ? "ring-2 ring-amber-400 ring-inset" : ""
                      }`}
                    >
                      <span
                        className={`text-xs font-medium inline-flex items-center justify-center w-6 h-6 rounded-full ${
                          isToday ? "bg-amber-500 text-white" : "text-slate-700"
                        }`}
                      >
                        {day}
                      </span>
                      <div className="mt-1 space-y-0.5">
                        {events.slice(0, 3).map((ev, idx) => {
                          const color = tradeColors[ev.trade];
                          return (
                            <div
                              key={idx}
                              className={`text-[10px] leading-tight px-1 py-0.5 rounded truncate ${color?.bg ?? "bg-slate-50"} ${color?.text ?? "text-slate-600"}`}
                            >
                              {ev.task}
                            </div>
                          );
                        })}
                        {events.length > 3 && (
                          <p className="text-[10px] text-slate-400 px-1">+{events.length - 3} 更多</p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            /* Week view */
            <div className="space-y-0">
              <div className="grid grid-cols-7 mb-2">
                {weekDates.map((d, i) => {
                  const dateStr = formatDate(d);
                  const isToday = dateStr === "2026-03-21";
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(dateStr)}
                      className="text-center py-2"
                    >
                      <p className="text-xs text-slate-400">{WEEKDAYS[i]}</p>
                      <p
                        className={`text-sm font-medium mt-1 inline-flex items-center justify-center w-8 h-8 rounded-full ${
                          isToday ? "bg-amber-500 text-white" : dateStr === selectedDate ? "bg-amber-100 text-amber-800" : "text-slate-700"
                        }`}
                      >
                        {d.getDate()}
                      </p>
                    </button>
                  );
                })}
              </div>
              <div className="grid grid-cols-7 gap-px bg-slate-100 rounded-lg overflow-hidden">
                {weekDates.map((d, i) => {
                  const dateStr = formatDate(d);
                  const events = eventsByDate[dateStr] ?? [];
                  return (
                    <div key={i} className="bg-white min-h-[300px] p-2 space-y-1.5">
                      {events.map((ev, idx) => {
                        const color = tradeColors[ev.trade];
                        return (
                          <div
                            key={idx}
                            className={`p-2 rounded-lg ${color?.bg ?? "bg-slate-50"} border border-transparent hover:border-amber-200 transition-colors cursor-pointer`}
                          >
                            <p className={`text-xs font-medium ${color?.text ?? "text-slate-700"}`}>{ev.time}</p>
                            <p className="text-xs text-slate-700 font-medium mt-0.5 leading-tight">{ev.task}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5 truncate">{ev.project}</p>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Selected Date Detail */}
        <div className="bg-white rounded-xl border border-amber-100 p-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">
            {selectedDate} 施工排程
          </h3>
          {selectedEvents.length === 0 ? (
            <p className="text-sm text-slate-400 py-8 text-center">此日無排程</p>
          ) : (
            <div className="space-y-3">
              {selectedEvents.map((ev, idx) => {
                const color = tradeColors[ev.trade];
                return (
                  <div key={idx} className={`p-3 rounded-lg ${color?.bg ?? "bg-slate-50"}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full ${color?.dot ?? "bg-slate-400"}`} />
                      <span className={`text-xs font-semibold ${color?.text ?? "text-slate-600"}`}>{ev.trade}</span>
                      <span className="text-xs text-slate-400 ml-auto">{ev.time}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-900">{ev.task}</p>
                    <p className="text-xs text-slate-500 mt-1">{ev.project}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {ev.workers.map((w) => (
                        <span key={w} className="text-xs bg-white/70 px-1.5 py-0.5 rounded text-slate-600">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
