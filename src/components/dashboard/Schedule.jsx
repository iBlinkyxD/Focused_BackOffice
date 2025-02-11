import { useState, useEffect } from "react";
import Styles from "./Schedule.module.css";
import { IconCalendarMonth } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import AppointmentCard from "./AppointmentCard";
import { useTranslation } from "react-i18next";

export default function Schedule({ sessionToken, appointmentData }) {
  const [days, setDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const { t } = useTranslation();
  const language = localStorage.getItem("language");

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  // Utility to get the day name (e.g., Sun, Mon)
  const getDayLabel = (date) => {
    if(language === "en"){
      return date.toLocaleDateString("en-US", { weekday: "short" });
    }else{
      return capitalize(date.toLocaleDateString("es-ES", { weekday: "short"}));
      
    }
  };

  // Utility to format the day number (e.g., 01, 02)
  const formatDay = (date) => {
    return date.getDate().toString().padStart(2, "0");
  };

  // Utility to format time to 12-hour format
  const formatTimeTo12Hour = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    const isPM = hour >= 12;
    const formattedHour = isPM ? hour % 12 || 12 : hour;
    const period = isPM ? "PM" : "AM";
    return `${formattedHour}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  // Generate the last 3 days, today, and the next 3 days
  useEffect(() => {
    const today = new Date();
    const dayArray = [];

    for (let i = -3; i <= 3; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i); // Shift days
      dayArray.push({
        date,
        day: formatDay(date),
        label: getDayLabel(date),
        isToday: i === 0, // Highlight today's date
      });
    }

    setDays(dayArray);
    setSelectedDay(today); // Set today's date as the default selected day
  }, [language]);

  // Filter and sort appointments based on the selected day
  useEffect(() => {
    if (selectedDay && appointmentData.length > 0) {
      const selectedDate = selectedDay.toISOString().split("T")[0];
      const filtered = appointmentData
        .filter((appointment) => appointment.appointment_date === selectedDate)
        .sort((a, b) => a.start_time.localeCompare(b.start_time)); // Sort by start_time
      setFilteredAppointments(filtered);
    } else {
      setFilteredAppointments([]);
    }
  }, [selectedDay, appointmentData]);

  // Handle the selection of a new day
  const handleDayClick = (date) => {
    setSelectedDay(date);
  };

  return (
    <>
      <div>
        <h1 className={Styles.title}>
          {t("schedule.title")}{" "}
          <Link className={Styles.calendarIcon}>
            <IconCalendarMonth />
          </Link>
        </h1>

        <div className={Styles.daysContainer}>
          {days.map(({ day, label, date, isToday }, index) => (
            <button
              key={index}
              className={`${Styles.dayCard} ${
                isToday && !selectedDay ? Styles.currentDay : ""
              } ${
                selectedDay?.toDateString() === date.toDateString()
                  ? Styles.currentDay
                  : ""
              }`}
              onClick={() => handleDayClick(date)}
            >
              <span className={Styles.daySpan}>{day}</span>
              <span className={Styles.dayLabel}>{label}</span>
            </button>
          ))}
        </div>

        <div className={Styles.appointmentList}>
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <Link
                to={`/home/patient/${appointment.id_patient}`}
                key={appointment.id}
              >
                <AppointmentCard
                  sessionToken={sessionToken}
                  time={formatTimeTo12Hour(appointment.start_time)}
                  patientName={appointment.patient_name}
                  patientLastName={appointment.patient_lastname}
                  appointment={true}
                />
              </Link>
            ))
          ) : (
            <AppointmentCard appointment={false} />
          )}
        </div>
      </div>
    </>
  );
}
