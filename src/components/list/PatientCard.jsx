import React from "react";
import Styles from "./PatientCard.module.css";
import { useTranslation } from "react-i18next";

export default function PatientCard({ name, lastname, condition, patient }) {
  const { t } = useTranslation();

  const conditionStyle =
    {
      "Newly Diagnosed": Styles.newlyDiagnosed,
      "Stable": Styles.stable,
      "Improving": Styles.improving,
      "Worsening": Styles.worsening,
      "Chronic": Styles.chronic,
      "In Crisis": Styles.inCrisis,
    }[condition] || Styles.default; // Fallback to a default style if no match

  if (!patient) {
    return (
      <div className={Styles.box}>
        <p className={Styles.text3}>{t("patientList.no_patient")}</p>
      </div>
    );
  }

  return (
    <div className={Styles.box}>
      <div className={Styles.profile_container}>
        <img
          className={Styles.profile_pic}
          src="/assets/images/default-pfp.png"
          alt={t("navbar.profile")}
        />
      </div>
      <div className={Styles.details}>
        <h1 className={Styles.name}>
          {name} {lastname}
        </h1>
        <p className={Styles.condition}>
          {t("patientList.condition")} <span className={conditionStyle}>{t(`patientList.${condition}`)}</span>
        </p>
      </div>
    </div>
  );
}
