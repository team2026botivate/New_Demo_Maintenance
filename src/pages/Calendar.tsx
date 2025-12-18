import React, { useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays, CheckCircle, Clock } from "lucide-react";

interface Task {
  id: string;
  title: string;
  date: Date;
  status: "completed" | "pending" | "in-progress";
}

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("month");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Dynamic task generation for infinite calendar data
  const getTasksForDate = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    
    // Deterministic logic to assign tasks to specific days (e.g., every 2nd or 3rd day, plus weekends)
    // This ensures every month has plenty of data without hardcoding
    const pseudoRandom = (day + month + year) % 5;
    const hasTasks = pseudoRandom !== 0 && pseudoRandom !== 3; // Populate ~60% of days
    
    if (!hasTasks) return [];

    const taskCount = ((day + month) % 3) + 1; // 1 to 3 tasks per day
    const generatedTasks: Task[] = [];
    
    const titles = [
      "Daily Machine Inspection", "Safety Protocol Check", "Oil Level Monitor", 
      "Air Filter Cleaning", "Control Panel Maintenance", "Sensor Calibration",
      "Hydraulic Pressure Test", "Emergency Systems Test", "Belt Tension Check",
      "Lubrication Round", "Voltage Reading Log", "Coolant System Flush"
    ];

    const statuses: ("completed" | "pending" | "in-progress")[] = ["completed", "pending", "in-progress"];

    for (let i = 0; i < taskCount; i++) {
        const titleIndex = (day + month + year + i) % titles.length;
        const statusIndex = (day + i) % 3;
        
        generatedTasks.push({
            id: `${year}-${month}-${day}-${i}`,
            title: titles[titleIndex],
            date: date,
            status: statuses[statusIndex]
        });
    }
    
    return generatedTasks;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const previousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const nextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const renderMonthView = () => {
    const days = [];
    const totalCells = Math.ceil((daysInMonth + startingDayOfWeek) / 7) * 7;

    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - startingDayOfWeek + 1;
      const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth;
      const date = isValidDay ? new Date(year, month, dayNumber) : null;
      const dayTasks = date ? getTasksForDate(date) : [];
      const isToday = date && date.toDateString() === new Date().toDateString();
      const isSelected = selectedDate && date && date.toDateString() === selectedDate.toDateString();

      days.push(
        <div
          key={i}
          className={`min-h-16 md:min-h-20 p-1 md:p-2 border border-gray-200 ${
            !isValidDay ? "bg-gray-50" : "bg-white hover:bg-gray-50"
          } ${isToday ? "ring-2 ring-sky-500" : ""} ${
            isSelected ? "bg-sky-50" : ""
          } cursor-pointer transition-colors`}
          onClick={() => date && setSelectedDate(date)}
        >
          {isValidDay && (
            <>
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-xs md:text-xs font-semibold ${
                    isToday ? "text-sky-600" : "text-gray-900"
                  }`}
                >
                  {dayNumber}
                </span>
                {dayTasks.length > 0 && (
                  <span className="bg-sky-600 text-white text-xs px-1.5 md:px-2 py-0.5 rounded-full font-semibold">
                    {dayTasks.length}
                  </span>
                )}
              </div>
              <div className="space-y-1 hidden md:block">
                {dayTasks.slice(0, 2).map((task) => (
                  <div
                    key={task.id}
                    className={`text-xs p-1.5 rounded truncate ${
                      task.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : task.status === "in-progress"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {task.title}
                  </div>
                ))}
                {dayTasks.length > 2 && (
                  <div className="text-xs text-gray-500 font-medium pl-1">
                    +{dayTasks.length - 2} more
                  </div>
                )}
              </div>
              {/* Mobile: Just show colored dots for tasks */}
              {dayTasks.length > 0 && (
                <div className="flex gap-1 mt-1 md:hidden">
                  {dayTasks.slice(0, 3).map((task) => (
                    <div
                      key={task.id}
                      className={`w-1.5 h-1.5 rounded-full ${
                        task.status === "completed"
                          ? "bg-green-600"
                          : task.status === "in-progress"
                          ? "bg-blue-600"
                          : "bg-orange-600"
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      );
    }

    return days;
  };

  const renderWeekView = () => {
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay());

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
        {[0, 1, 2, 3, 4, 5, 6].map((dayOffset) => {
          const date = new Date(weekStart);
          date.setDate(weekStart.getDate() + dayOffset);
          const dayTasks = getTasksForDate(date);
          const isToday = date.toDateString() === new Date().toDateString();

          return (
            <div key={dayOffset} className="bg-white rounded-lg border border-gray-200 p-3 md:p-4">
              <div className="text-center mb-3">
                <div className="text-xs text-gray-500 font-medium">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayOffset]}
                </div>
                <div
                  className={`text-lg md:text-xl font-bold mt-1 ${
                    isToday ? "text-sky-600" : "text-gray-900"
                  }`}
                >
                  {date.getDate()}
                </div>
              </div>
              <div className="space-y-2">
                {dayTasks.length === 0 ? (
                  <div className="text-xs text-gray-400 text-center py-2">No tasks</div>
                ) : (
                  dayTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`text-xs p-2 rounded truncate ${
                        task.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : task.status === "in-progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                      title={task.title}
                    >
                      {task.title}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDayView = () => {
    const dayTasks = getTasksForDate(currentDate);

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
        <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4">
          {currentDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </h3>
        {dayTasks.length === 0 ? (
          <div className="text-center py-12">
            <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No tasks scheduled for this day</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dayTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-3 md:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {task.status === "completed" ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                ) : (
                  <Clock className="w-5 h-5 text-orange-600 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-xs md:text-sm truncate">{task.title}</p>
                  <p className="text-xs md:text-xs text-gray-500 capitalize">{task.status}</p>
                </div>
                <span
                  className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                    task.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : task.status === "in-progress"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 md:p-6 space-y-4 md:space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
            <p className="text-sm text-gray-600">View and manage scheduled tasks</p>
          </div>
          <div className="flex bg-gray-100 p-1 rounded-lg self-start md:self-center">
            <button
              onClick={() => setView("day")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                view === "day"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setView("week")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                view === "week"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setView("month")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                view === "month"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Month
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between bg-white p-3 md:p-4 rounded-lg border border-gray-200">
          <button
            onClick={view === "day" ? previousDay : previousMonth}
            className="p-2 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors touch-manipulation"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h2 className="text-sm md:text-lg font-bold text-gray-900 text-center">
            {view === "day" 
              ? currentDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
              : `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
            }
          </h2>
          <button
            onClick={view === "day" ? nextDay : nextMonth}
            className="p-2 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors touch-manipulation"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Calendar View */}
        {view === "month" && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-7 bg-gray-50">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="p-2 md:p-3 text-center text-xs md:text-xs font-semibold text-gray-700 border-b border-gray-200">
                  <span className="hidden sm:inline">{day}</span>
                  <span className="sm:hidden">{day.charAt(0)}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">{renderMonthView()}</div>
          </div>
        )}

        {view === "week" && renderWeekView()}
        {view === "day" && renderDayView()}

        {/* Selected Date Details - Mobile Friendly */}
        {selectedDate && view === "month" && (
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <h3 className="text-sm md:text-base font-bold text-gray-900 mb-4">
              Tasks for {selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </h3>
            {getTasksForDate(selectedDate).length === 0 ? (
              <div className="text-center py-8">
                <CalendarDays className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-500">No tasks scheduled for this date</p>
              </div>
            ) : (
              <div className="space-y-2 md:space-y-3">
                {getTasksForDate(selectedDate).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 md:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  >
                    {task.status === "completed" ? (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    ) : task.status === "in-progress" ? (
                      <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    ) : (
                      <Clock className="w-5 h-5 text-orange-600 flex-shrink-0" />
                    )}
                    <span className="flex-1 font-medium text-gray-900 text-xs md:text-sm min-w-0 truncate">{task.title}</span>
                    <span
                      className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                        task.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : task.status === "in-progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;