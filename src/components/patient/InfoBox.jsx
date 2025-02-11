import React from "react";
import Styles from "./InfoBox.module.css";
import Prescription from "./Prescription";
import { useTranslation } from "react-i18next";

export default function InfoBox({ role, name, lastname, email, birthdate, phone, proName, proLastname, proEmail, proPhone }) {
  const { t } = useTranslation();
  const language = localStorage.getItem("language");

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function formatPhoneNumber(phone) {
    if (phone === "Not Assigned") return t("infoBox.notAssigned");
    if (!phone) return t("infoBox.invalid");

    // Remove any non-digit characters
    const phoneStr = phone.toString().replace(/\D/g, "");

    // Check if the cleaned string has a valid length
    if (phoneStr.length === 10) {
      // Standard 10-digit number
      return `(${phoneStr.slice(0, 3)}) - ${phoneStr.slice(
        3,
        6
      )} - ${phoneStr.slice(6)}`;
    } else if (phoneStr.length === 11 && phoneStr.startsWith("1")) {
      // Handle US-like numbers with leading 1
      return `(${phoneStr.slice(1, 4)}) - ${phoneStr.slice(
        4,
        7
      )} - ${phoneStr.slice(7)}`;
    } else if (phoneStr.length === 12 && phoneStr.startsWith("809")) {
      // Handle numbers with +809
      return `(${phoneStr.slice(0, 3)}) - ${phoneStr.slice(
        3,
        6
      )} - ${phoneStr.slice(6)}`;
    }

    return t("infoBox.invalid");
  }

  return (
    <>
      <div className={Styles.box}>
        <h1 className={Styles.title}>
          {t("infoBox.personalInfo")}</h1>
        <div className={Styles.column}>
          <div className={Styles.row}>
            <div className={Styles.group}>
              <p className={Styles.label} >{t("infoBox.firstName")}</p>
              <p className={Styles.data}>{name}</p>
            </div>
            <div className={Styles.group}>
              <p className={Styles.label}>{t("infoBox.lastName")}</p>
              <p className={Styles.data}>{lastname}</p>
            </div>
          </div>
          <div className={Styles.row}>
            <div className={Styles.group}>
              <p className={Styles.label}>{t("infoBox.email")}</p>
              <p className={Styles.data}>{email}</p>
            </div>
            <div className={Styles.group}>
              <p className={Styles.label}>{t("infoBox.phoneNumber")}</p>
              <p className={Styles.data}>{formatPhoneNumber(phone)}</p>
            </div>
          </div>
          <div className={Styles.row}>
            <div className={Styles.group}>
              <p className={Styles.label}>{t("infoBox.birthdate")}</p>
              <p className={Styles.data}>{formatDate(birthdate)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className={Styles.box}>
        <h1 className={Styles.title}>{role === "Psychologist" ? t("infoBox.psychiatrist") : role === "Psychiatrist" ? t("infoBox.psychologist") : ""}</h1>
        <div className={Styles.column}>
          <div className={Styles.row}>
            <div className={Styles.group}>
              <p className={Styles.label}>{t("infoBox.firstName")}</p>
              <p className={Styles.data}>{proName === "Not Assigned" && language === "es" ? t("infoBox.notAssigned") : proName}</p>
            </div>
            <div className={Styles.group}>
              <p className={Styles.label}>{t("infoBox.lastName")}</p>
              <p className={Styles.data}>{proLastname === "Not Assigned" && language === "es" ? t("infoBox.notAssigned") : proLastname}</p>
            </div>
          </div>
          <div className={Styles.row}>
            <div className={Styles.group}>
              <p className={Styles.label}>{t("infoBox.email")}</p>
              <p className={Styles.data}>{proEmail === "Not Assigned" && language === "es" ? t("infoBox.notAssigned") : proEmail}</p>
            </div>
            <div className={Styles.group}>
              <p className={Styles.label}>{t("infoBox.phoneNumber")}</p>
              <p className={Styles.data}>{formatPhoneNumber(proPhone) === "Not Assigned" && language === "es" ? t("infoBox.notAssigned") : formatPhoneNumber(proPhone)}</p>
            </div>
          </div>
        </div>
      </div>

      {role === "Psychiatrist" && (
          <Prescription />
      )}
    </>
  );
}
