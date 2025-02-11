import React from 'react'
import Styles from './AppointmentCard.module.css';
import { useTranslation } from "react-i18next";

export default function AppointmentCard({ time, patientName, patientLastName, appointment}) {
  const { t } = useTranslation();
  if (!appointment) {
    return (
      <div className={Styles.card}>
        <p className={Styles.text3}>{t("schedule.appointment")}</p>
      </div>
    );
  }

  return (
    <div className={Styles.card}>
      <p className={Styles.text}>{time}</p>
        <p className={Styles.text2}>
          {patientName} {patientLastName}
        </p>
    </div>
  )
}