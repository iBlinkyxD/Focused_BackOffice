import React from "react";
import { Link } from "react-router-dom";
import Styles from "./HeaderCard.module.css";
import { useTranslation } from "react-i18next";

export default function HeaderCard({ name, lastName, sex, nextAppointment }) {
  const { t } = useTranslation();
  const language = localStorage.getItem("language");

  const formatDate = (dateString) => {
    // Parse the date string into Date object
    const dateParts = dateString.split("-");
    const appointmentDate = new Date(
      dateParts[0],
      dateParts[1] - 1,
      dateParts[2]
    );

    const today = new Date();
    const offset = today.getTimezoneOffset(); // Timezone offset in minutes
    today.setMinutes(today.getMinutes() - offset); // Adjust to local time
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Format as YYYY-MM-DD
    const todayStr = today.toISOString().split("T")[0];
    const tomorrowStr = tomorrow.toISOString().split("T")[0];
    const appointmentStr = appointmentDate.toISOString().split("T")[0];

    // Compare with today and tomorrow
    if (appointmentStr === todayStr) {
      // Return "Today" with formatted date
      const options = { month: "long", day: "numeric" };
      let formattedDate = appointmentDate.toLocaleDateString(
        language === "es" ? "es-ES" : "en-US",
        options
      );
      if (language === "es") {
        const [day, de, month] = formattedDate.split(" ");
        formattedDate = `${day} ${de} ${
          month.charAt(0).toUpperCase() + month.slice(1)
        }`;
      }
      return `${t("headerCard.today")} ${formattedDate}`; // "Today MM/DD"
    } else if (appointmentStr === tomorrowStr) {
      // Return "Tomorrow" with formatted date
      const options = { month: "long", day: "numeric" };
      let formattedDate = appointmentDate.toLocaleDateString(
        language === "es" ? "es-ES" : "en-US",
        options
      );
      if (language === "es") {
        const [day, de, month] = formattedDate.split(" ");
        formattedDate = `${day} ${de} ${
          month.charAt(0).toUpperCase() + month.slice(1)
        }`;
      }
      return `${t("headerCard.tomorrow")} ${formattedDate}`; // "Tomorrow MM/DD"
    }

    // Default format for other days
    const options = { month: "long", day: "numeric" };
    let formattedDate = appointmentDate.toLocaleDateString(
      language === "es" ? "es-ES" : "en-US",
      options
    );

    // Capitalize the month name in Spanish
    if (language === "es") {
      const [day, de, month] = formattedDate.split(" ");
      formattedDate = `${day} ${de} ${
        month.charAt(0).toUpperCase() + month.slice(1)
      }`;
    }

    return formattedDate;
  };

  return (
    <>
      <div className={Styles.header}>
        <h2 className={Styles.greeting}>
          {language === "es" && sex === "M"
            ? t("headerCard.hiM")
            : t("headerCard.hiF")}{" "}
          {name} {lastName}
        </h2>
        <p className={Styles.welcome}>
          {language === "es" && sex === "M"
            ? t("headerCard.welcomeM")
            : t("headerCard.welcomeF")}
        </p>
      </div>
      <p className={Styles.nextAppointment}>
        {t("headerCard.next_appointment")}
      </p>
      {nextAppointment ? (
        <div className={Styles.appointmentCard}>
          <div className={Styles.profile_container}>
            <img
              className={Styles.profile_pic}
              src="/assets/images/default-pfp.png"
              alt={t("headerCard.profile")}
            />
          </div>
          <div className={Styles.details}>
            <p className={Styles.name}>
              {nextAppointment.patient_name} {nextAppointment.patient_lastname}
            </p>
            <p className={Styles.dateTime}>
              {t("headerCard.date")}{" "}
              {formatDate(nextAppointment.appointment_date)}
            </p>
            <p className={Styles.dateTime}>
              {t("headerCard.time")} {nextAppointment.start_time} {t("headerCard.to")}{" "}
              {nextAppointment.end_time}
            </p>
          </div>
          <Link
            className={Styles.moreDetails}
            to={`/home/patient/${nextAppointment.id_patient}`}
          >
            {t("headerCard.more_details")}
          </Link>
        </div>
      ) : (
        <div className={Styles.appointmentCard}>
          <div className={Styles.profile_container}>
            <img
              className={Styles.profile_pic}
              src="/assets/images/default-pfp.png"
              alt={t("headerCard.profile")}
            />
          </div>
          <div className={Styles.details}>
            <p className={Styles.name}>{t("headerCard.appointment")}</p>
          </div>
        </div>
      )}
    </>
  );
}
