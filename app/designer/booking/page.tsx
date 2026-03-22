"use client";

import { useState } from "react";
import { clsx } from "clsx";

const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

const timeSlots = [
  "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "19:00", "20:00",
];

const appointmentTypes = ["初次諮詢", "現場丈量", "設計提案", "合約簽訂", "工程驗收", "其他"];

interface Appointment {
  id: number;
  name: string;
  date: string;
  time: string;
  type: string;
  status: string;
  phone: string;
  note: string;
}

const initialAppointments: Appointment[] = [
  { id: 1, name: "陳怡君", date: "2026-03-18", time: "10:00", type: "初次諮詢", status: "confirmed", phone: "0912-345-678", note: "想了解現代簡約風格，預算約 150 萬" },
  { id: 2, name: "林志明", date: "2026-03-18", time: "14:00", type: "現場丈量", status: "confirmed", phone: "0923-456-789", note: "板橋老公寓，約 28 坪" },
  { id: 3, name: "王美玲", date: "2026-03-19", time: "11:00", type: "設計提案", status: "pending", phone: "0934-567-890", note: "第二次提案討論，帶修改後的 3D 圖" },
  { id: 4, name: "張家豪", date: "2026-03-20", time: "15:00", type: "初次諮詢", status: "confirmed", phone: "0945-678-901", note: "透過作品集找到我們，對日式風格有興趣" },
  { id: 5, name: "劉雅婷", date: "2026-03-21", time: "10:00", type: "合約簽訂", status: "pending", phone: "0956-789-012", note: "確認最終報價後簽約" },
];

function generateCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  return days;
}

const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

export default function BookingPage() {
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(2); // March (0-indexed)
  const [selectedDate, setSelectedDate] = useState("2026-03-18");
  const [showForm, setShowForm] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);

  // Form state
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formType, setFormType] = useState(appointmentTypes[0]);
  const [formNote, setFormNote] = useState("");
  const [formTime, setFormTime] = useState("10:00");
  const [toast, setToast] = useState<string | null>(null);

  const calendarDays = generateCalendarDays(currentYear, currentMonth);
  const today = currentYear === 2026 && currentMonth === 2 ? 21 : -1;

  const dateStr = (day: number) => {
    const m = String(currentMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${currentYear}-${m}-${d}`;
  };

  const todayAppointments = appointments.filter((a) => a.date === selectedDate);

  const bookedSlots: Record<string, string[]> = {};
  appointments.forEach((a) => {
    if (!bookedSlots[a.date]) bookedSlots[a.date] = [];
    bookedSlots[a.date].push(a.time);
  });

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleSubmit = () => {
    if (!formName.trim() || !formPhone.trim()) return;

    const newAppointment: Appointment = {
      id: Date.now(),
      name: formName,
      date: selectedDate,
      time: formTime,
      type: formType,
      status: "pending",
      phone: formPhone,
      note: formNote,
    };

    setAppointments((prev) => [...prev, newAppointment]);
    setFormName("");
    setFormPhone("");
    setFormType(appointmentTypes[0]);
    setFormNote("");
    setFormTime("10:00");
    setShowForm(false);
    setToast(`已新增 ${formName} 的預約`);
    setTimeout(() => setToast(null), 2000);
  };

  const statusColors: Record<string, string> = {
    confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  };
  const statusLabels: Record<string, string> = { confirmed: "已確認", pending: "待確認", cancelled: "已取消" };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">
          ✓ {toast}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">📅 線上諮詢預約系統</h1>
          <p className="text-sm text-slate-500 mt-1">管理您的諮詢預約時段</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors min-h-[44px] shrink-0"
        >
          {showForm ? "✕ 取消" : "+ 新增預約"}
        </button>
      </div>

      {/* New Appointment Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-indigo-200 p-5">
          <h3 className="font-semibold text-slate-900 mb-4">新增預約 — {selectedDate}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">姓名 *</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="業主姓名"
                className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[44px]"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">電話 *</label>
              <input
                type="text"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                placeholder="0912-345-678"
                className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[44px]"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">預約類型</label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[44px]"
              >
                {appointmentTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">預約時間</label>
              <select
                value={formTime}
                onChange={(e) => setFormTime(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[44px]"
              >
                {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-slate-500 block mb-1">備註</label>
              <textarea
                value={formNote}
                onChange={(e) => setFormNote(e.target.value)}
                placeholder="特殊需求或說明..."
                rows={2}
                className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSubmit}
              disabled={!formName.trim() || !formPhone.trim()}
              className="px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed min-h-[44px]"
            >
              確認新增
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2.5 border border-slate-300 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors min-h-[44px]"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">本週預約</p>
          <p className="text-2xl font-bold text-indigo-600">{appointments.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">待確認</p>
          <p className="text-2xl font-bold text-amber-600">{appointments.filter((a) => a.status === "pending").length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">本月諮詢</p>
          <p className="text-2xl font-bold text-emerald-600">{appointments.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">轉換率</p>
          <p className="text-2xl font-bold text-violet-600">45%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              ← 上月
            </button>
            <h2 className="text-sm font-semibold text-slate-700">
              {currentYear} 年 {monthNames[currentMonth]}
            </h2>
            <button
              onClick={nextMonth}
              className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              下月 →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {weekDays.map((d) => (
              <div key={d} className="text-xs font-medium text-slate-400 py-1">{d}</div>
            ))}
            {calendarDays.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} />;
              const ds = dateStr(day);
              const hasBooking = bookedSlots[ds]?.length > 0;
              const isSelected = ds === selectedDate;
              const isToday = day === today;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(ds)}
                  className={clsx(
                    "w-full aspect-square rounded-lg text-sm font-medium transition-colors relative flex items-center justify-center",
                    isSelected ? "bg-indigo-600 text-white" :
                    isToday ? "bg-indigo-50 text-indigo-700" :
                    "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  {day}
                  {hasBooking && !isSelected && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-500" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Time slots for selected date */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs font-medium text-slate-500 mb-2">可預約時段</p>
            <div className="grid grid-cols-5 gap-1.5">
              {timeSlots.map((slot) => {
                const isBooked = bookedSlots[selectedDate]?.includes(slot);
                return (
                  <div
                    key={slot}
                    className={clsx(
                      "text-center py-1.5 rounded text-xs font-medium",
                      isBooked ? "bg-indigo-100 text-indigo-700" : "bg-slate-50 text-slate-400"
                    )}
                  >
                    {slot}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold text-slate-700">
            {selectedDate} 的預約 ({todayAppointments.length})
          </h2>
          {todayAppointments.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400">
              <span className="text-4xl block mb-2">📅</span>
              <p className="text-sm">該日無預約</p>
            </div>
          ) : (
            todayAppointments.map((apt) => (
              <div key={apt.id} className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-bold shrink-0">
                      {apt.name[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{apt.name}</h3>
                      <p className="text-xs text-slate-500">{apt.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-indigo-600">{apt.time}</span>
                    <span className={clsx("text-xs px-2 py-0.5 rounded-full border", statusColors[apt.status])}>
                      {statusLabels[apt.status]}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{apt.type}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3">{apt.note}</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => { setToast(`已確認 ${apt.name} 的預約`); setTimeout(() => setToast(null), 2000); }} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors min-h-[36px]">
                    確認預約
                  </button>
                  <button onClick={() => { setToast(`${apt.name} 的預約已進入重新排程`); setTimeout(() => setToast(null), 2000); }} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors min-h-[36px]">
                    重新排程
                  </button>
                  <button onClick={() => { setAppointments((prev) => prev.filter((a) => a.id !== apt.id)); setToast(`${apt.name} 的預約已取消`); setTimeout(() => setToast(null), 2000); }} className="px-3 py-1.5 text-xs font-medium rounded-lg text-red-600 hover:bg-red-50 transition-colors min-h-[36px]">
                    取消
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Upcoming */}
          <h2 className="text-sm font-semibold text-slate-700 pt-2">即將到來的預約</h2>
          <div className="space-y-2">
            {appointments.filter((a) => a.date !== selectedDate).map((apt) => (
              <div key={apt.id} className="bg-white rounded-xl border border-slate-200 p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-center shrink-0">
                    <p className="text-lg font-bold text-indigo-600">{apt.date.split("-")[2]}</p>
                    <p className="text-[10px] text-slate-400">{Number(apt.date.split("-")[1])}月</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{apt.name} — {apt.type}</p>
                    <p className="text-xs text-slate-500">{apt.time}</p>
                  </div>
                </div>
                <span className={clsx("text-xs px-2 py-0.5 rounded-full border shrink-0", statusColors[apt.status])}>
                  {statusLabels[apt.status]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
