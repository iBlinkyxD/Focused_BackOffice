import React, {
  startTransition,
  useCallback,
  useEffect,
  useState,
} from "react";
import Styles from "./StadisticsCard.module.css";
import ToDoPieChart from "./ToDoPieChart.jsx";
import FlashcardPieChart from "./FlashcardPieChart.jsx";
import { useTranslation } from "react-i18next";
import {
  getPatientFlashcardProgresion,
  getPatientTaskCompletion,
} from "../../services/ReportServices.js";
import { toast } from "react-toastify";

function StadisticsCard({ sessionToken, nextAppointment }) {
  const { t } = useTranslation();
  const language = localStorage.getItem("language");
  const [patientToDoData, setPatientToDoData] = useState({
    not_completed: 0,
    completed: 0,
    completed_within_time: 0,
    completed_outside_time: 0,
  });
  const [patientFlashcardData, setPatientFlashcardData] = useState({
    Level_1: 0,
    Level_2: 0,
    Level_3: 0,
    Level_4: 0,
    Total_Flashcards: 0,
  });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const getWeekRange = useCallback(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // Sunday is 0, Monday is 1, ..., Saturday is 6
    const differenceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust for Sunday being the start of the week
    const monday = new Date(today);
    monday.setDate(today.getDate() + differenceToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    // Format as YYYY-MM-DD
    const formatDate = (date) => date.toISOString().split("T")[0];
    setStartDate(formatDate(monday));
    setEndDate(formatDate(sunday));
  }, []);

  const fetchToDoData = useCallback(async () => {
    if (nextAppointment === null) return;
    try {
      const data = await getPatientTaskCompletion(
        sessionToken,
        nextAppointment.id_patient,
        startDate,
        endDate
      );
      setPatientToDoData(data);
    } catch (error) {
      if (error.message === "No tasks found for the given criteria.") {
        setPatientToDoData({
          not_completed: 0,
          completed: 0,
          completed_within_time: 0,
          completed_outside_time: 0,
        });
        return;
      } else {
        toast.error(`${error.message}`);
      }
    }
  }, [nextAppointment]);

  const fetchFlashcardData = useCallback(async () => {
    if (nextAppointment === null) return;
    try {
      const data = await getPatientFlashcardProgresion(
        sessionToken,
        nextAppointment.id_patient
      );
      setPatientFlashcardData(data);
    } catch (error) {
      if (error.message === "No flashcards found for the given criteria.") {
        setPatientFlashcardData({
          Level_1: 0,
          Level_2: 0,
          Level_3: 0,
          Level_4: 0,
          Total_Flashcards: 0,
        });
        return;
      } else {
        toast.error(`${error.message}`);
      }
    }
  }, [nextAppointment]);

  const fetchData = useCallback(async () => {
    await Promise.all([fetchToDoData(), fetchFlashcardData()]);
  }, [fetchToDoData, fetchFlashcardData]);

  useEffect(() => {
    getWeekRange();
  }, [getWeekRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <h1 className={Styles.title}>
        {nextAppointment ? (
          <>
            {language === "es" ? t("stadistics.title") : ""}
            {nextAppointment.patient_name} {nextAppointment.patient_lastname}{" "}
            {language === "en" ? t("stadistics.title") : ""}
          </>
        ) : (
          <>{t("stadistics.title")}</>
        )}
      </h1>
      <div className={Styles.cardContainer}>
        <div className={Styles.card}>
          <ToDoPieChart data={patientToDoData} />
        </div>
        <div className={Styles.card}>
          <FlashcardPieChart data={patientFlashcardData}/>
        </div>
      </div>
    </>
  );
}

export default StadisticsCard;
