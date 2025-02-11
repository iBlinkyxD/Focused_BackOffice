import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { useParams } from "react-router-dom";
import Styles from "./PatientPage.module.css";
import ProfileBox from "../components/patient/ProfileBox";
import InfoBox from "../components/patient/InfoBox";
import AuthContext from "../context/AuthProvider";
import {
  getPatientByID,
  getPatientProfessional,
} from "../services/PatientService";
import jsPDF from "jspdf"; // Import jsPDF
import "jspdf-autotable";
import ToDoPieChart from "../components/patient/graph/ToDoPieChart";
import FlashCardPieChart from "../components/patient/graph/FlashCardPieChart";
import { getPatientMedication } from "../services/MedLogService";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { getPatientTaskCompletion, getPatientFlashcardProgresion } from "../services/ReportServices";

export default function PatientPage() {
  const { patientId } = useParams(); // Access the dynamic route parameter
  const { sessionToken, role } = useContext(AuthContext);
  const [patientData, setPatientData] = useState({});
  const [professionalData, setProfessionalData] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const chartRef = useRef(null);
  const chartRef2 = useRef(null);
  const { t } = useTranslation();
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

  const fetchPatientData = useCallback(async () => {
    try {
      const data = await getPatientByID(sessionToken, patientId);
      setPatientData(data);

      // Only fetch professional data if both IDs are not null
      if (data.id_psychiatrist !== null && data.id_psychologist !== null) {
        const data2 = await getPatientProfessional(sessionToken, patientId);
        setProfessionalData(data2);
      }
    } catch (error) {
      toast.error(`${error.message}`);
    }
  }, [sessionToken]);

  useEffect(() => {
    fetchPatientData();
  }, [fetchPatientData]);

  const fetchFlashcardData = useCallback(async () => {
    try {
      const data = await getPatientFlashcardProgresion(
        sessionToken,
        patientId,
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
  }, [patientId]);

  useEffect(() => {
    fetchFlashcardData();
  }, [fetchFlashcardData]);

  const handleStartDateChange = (e) => {
    const selectedStartDate = e.target.value;
    setStartDate(selectedStartDate);

    // If endDate is earlier than the new startDate, reset endDate
    if (endDate && endDate < selectedStartDate) {
      setEndDate("");
    }
  };

  const exportChartAsBase64 = () => {
    if (chartRef.current) {
      const base64Image = chartRef.current.exportToImage(); // Get the image directly
      return base64Image; // Return the data URL
    }
    return null; // Handle the case where the chart ref is unavailable
  };

  const exportChart2AsBase64 = () => {
    if (chartRef2.current) {
      const base64Image = chartRef2.current.exportToImage(); // Get the image directly
      return base64Image; // Return the data URL
    }
    return null; // Handle the case where the chart ref is unavailable
  };

  const loadImageAsBase64 = async (imagePath) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imagePath;
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = (err) => reject(err);
    });
  };

  const generatePDFPsychologist = async (e) => {
    e.preventDefault(); // Prevent default form submission
  
    try {
      // Ensure flashcard data and To-Do data are fetched
      const data2 = await getPatientTaskCompletion(
        sessionToken,
        patientId,
        startDate,
        endDate
      );
      setPatientToDoData(data2);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 1-second delay
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0];

      const doc = new jsPDF();
      const imgData = await loadImageAsBase64("/assets/images/Focused-Logo.png");
  
      // Add logo and patient info
      doc.addImage(imgData, "PNG", 14, 10, 70, 20);
      doc.setFont("times");
      doc.setFontSize(24);
      doc.text(`${patientData.name} ${patientData.lastname}`, 14, 40);
      doc.setFontSize(12);
      doc.text(`${t("pdf.date_generated")} ${formattedDate}`, 130, 20);
      doc.text(`${t("pdf.start_date")} ${startDate}`, 130, 25);
      doc.text(`${t("pdf.end_date")} ${endDate}`, 130, 30);      
      doc.setFontSize(16);
  
      // Add To-Do data and chart
      doc.text(`${t("pdf.task")}`, 14, 50);
      doc.autoTable({
        startY: 55,
        head: [[t("pdf.status"), t("pdf.numTask")]],
        body: [
          [t("pdf.done"), data2.completed],
          [t("pdf.notDone"), data2.not_completed],
          [t("pdf.completedOnTime"), data2.completed_within_time],
          [t("pdf.completedOffTime"), data2.completed_outside_time],
        ],
        headStyles: { fillColor: [33, 90, 109] },
        styles: { font: "times", fontSize: 12 },
        columnStyles: {
          0: { cellWidth: 50 }, // Width for the first column
          1: { cellWidth: 30 },  // Width for the second column
        },
      });
  
      const chartImage = await exportChartAsBase64();
      if (chartImage) {
        doc.addImage(chartImage, "PNG", 120, doc.lastAutoTable.finalY - 55, 70, 60);
      }
  
      // Add Flash Card data and chart
      doc.text(`${t("pdf.flashcard")}`, 14, doc.lastAutoTable.finalY + 30);
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 35,
        head: [[t("pdf.level"), t("pdf.numFlash")]],
        body: [
          ["Lv. 1", patientFlashcardData.Level_1],
          ["Lv. 2", patientFlashcardData.Level_2],
          ["Lv. 3", patientFlashcardData.Level_3],
          ["Lv. 4", patientFlashcardData.Level_4],
          ["Total", patientFlashcardData.Total_Flashcards],
        ],
        headStyles: { fillColor: [33, 90, 109] },
        styles: { font: "times", fontSize: 12 },
        columnStyles: {
          0: { cellWidth: 50 }, // Width for the first column
          1: { cellWidth: 30 },  // Width for the second column
        },
      });
  
      const chart2Image = await exportChart2AsBase64();
      if (chart2Image) {
        doc.addImage(chart2Image, "PNG", 120, doc.lastAutoTable.finalY - 55, 70, 60);
      }
  
      // Save the PDF
      doc.save(`${patientData.name} ${patientData.lastname} ${t("pdf.report")}.pdf`);
    } catch (error) {
      toast.error(`${error.message}`);
    }
  }

  const generatePDFPsychiatrist = async (e) => {
    e.preventDefault(); // Prevent default form submission
  
    try {
      // Ensure flashcard data and To-Do data are fetched
      const data2 = await getPatientTaskCompletion(
        sessionToken,
        patientId,
        startDate,
        endDate
      );
      setPatientToDoData(data2);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 1-second delay
      const data = await getPatientMedication(sessionToken, patientId, startDate, endDate);
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0];
      const tableData = data.map((med) => [
        med.name,
        med.taken_count,
        med.taken_on_time,
        med.not_taken_count,
        `${med.percentage_taken}%`,
      ]);
  
      const doc = new jsPDF();
      const imgData = await loadImageAsBase64("/assets/images/Focused-Logo.png");
  
      // Add logo and patient info
      doc.addImage(imgData, "PNG", 14, 10, 70, 20);
      doc.setFont("times");
      doc.setFontSize(24);
      doc.text(`${patientData.name} ${patientData.lastname}`, 14, 40);
      doc.setFontSize(12);
      doc.text(`${t("pdf.date_generated")} ${formattedDate}`, 130, 20);
      doc.text(`${t("pdf.start_date")} ${startDate}`, 130, 25);
      doc.text(`${t("pdf.end_date")} ${endDate}`, 130, 30);      
  
      // Medication Table
      doc.setFontSize(16);
      doc.text(`${t("pdf.medication")}`, 14, 50);
      doc.autoTable({
        startY: 55,
        head: [
          [t("pdf.medName"), t("pdf.amountTaken"), t("pdf.amountTakenOnTime"), t("pdf.amountNotTaken"), t("pdf.percentageTaken")],
        ],
        body: tableData,
        headStyles: { fillColor: [33, 90, 109] },
        styles: { font: "times", fontSize: 12 },
      });
  
      // Add To-Do data and chart
      doc.text(`${t("pdf.task")}`, 14, doc.lastAutoTable.finalY + 10);
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 15,
        head: [[t("pdf.status"), t("pdf.numTask")]],
        body: [
          [t("pdf.done"), data2.completed],
          [t("pdf.notDone"), data2.not_completed],
          [t("pdf.completedOnTime"), data2.completed_within_time],
          [t("pdf.completedOffTime"), data2.completed_outside_time],
        ],
        headStyles: { fillColor: [33, 90, 109] },
        styles: { font: "times", fontSize: 12 },
        columnStyles: {
          0: { cellWidth: 50 }, // Width for the first column
          1: { cellWidth: 30 },  // Width for the second column
        },
      });
  
      const chartImage = await exportChartAsBase64();
      if (chartImage) {
        doc.addImage(chartImage, "PNG", 120, doc.lastAutoTable.finalY - 55, 70, 60);
      }
  
      // Add Flash Card data and chart
      doc.text(`${t("pdf.flashcard")}`, 14, doc.lastAutoTable.finalY + 40);
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 45,
        head: [[t("pdf.level"), t("pdf.numFlash")]],
        body: [
          ["Lv. 1", patientFlashcardData.Level_1],
          ["Lv. 2", patientFlashcardData.Level_2],
          ["Lv. 3", patientFlashcardData.Level_3],
          ["Lv. 4", patientFlashcardData.Level_4],
          ["Total", patientFlashcardData.Total_Flashcards],
        ],
        headStyles: { fillColor: [33, 90, 109] },
        styles: { font: "times", fontSize: 12 },
        columnStyles: {
          0: { cellWidth: 50 }, // Width for the first column
          1: { cellWidth: 30 },  // Width for the second column
        },
      });
  
      const chart2Image = await exportChart2AsBase64();
      if (chart2Image) {
        doc.addImage(chart2Image, "PNG", 120, doc.lastAutoTable.finalY - 55, 70, 60);
      }
  
      // Save the PDF
      doc.save(`${patientData.name} ${patientData.lastname} ${t("pdf.report")}.pdf`);
    } catch (error) {
        if(error.message === "No medication found."){
          generatePDFPsychologist();
        }else{
          toast.error(`${error.message}`);
        }
    }
  };
  

  return (
    <div className={Styles.main_container}>
      <div className={Styles.group_container}>
        <div className={Styles.profile_container}>
          <ProfileBox
            patientID={patientId}
            sessionToken={sessionToken}
            name={patientData.name}
            lastname={patientData.lastname}
            condition={patientData.condition}
            sex={patientData.sex}
            birthdate={patientData.birthdate}
            allergie={patientData.allergies}
          />
        </div>
        <div className={Styles.info_container}>
          <InfoBox
            role={role}
            name={patientData.name}
            lastname={patientData.lastname}
            email={patientData.email}
            birthdate={patientData.birthdate}
            phone={patientData.phone}
            proName={professionalData.name || "Not Assigned"}
            proLastname={professionalData.lastname || "Not Assigned"}
            proEmail={professionalData.email || "Not Assigned"}
            proPhone={professionalData.phone || "Not Assigned"}
          />
        </div>
      </div>
      <div className={Styles.graph_container}>
        <div className={Styles.graph_card}>
          <form autoComplete="off" onSubmit={role === "Psychologist" ? generatePDFPsychologist : generatePDFPsychiatrist}>
            <h1 className={Styles.title}>{t("patientProfile.title")}</h1>
            <div className={Styles.input_group}>
              <label htmlFor="startDate">{t("patientProfile.startDate")}</label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                required
                value={startDate}
                onChange={handleStartDateChange}
              />
            </div>
            <div className={Styles.input_group}>
              <label htmlFor="endDate">{t("patientProfile.endDate")}</label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate} // Set the minimum date for endDate dynamically
              />
            </div>
            <button type="submit" className={Styles.create_btn}>
              {t("patientProfile.generate")}
            </button>
          </form>
        </div>
        <div className={Styles.graph_card}>
          <div className={Styles.graph_box}>
          <ToDoPieChart ref={chartRef} data={patientToDoData}/>
          </div>
        </div>
        <div className={Styles.graph_card}>
          <div className={Styles.graph_box}>
            <FlashCardPieChart ref={chartRef2} data={patientFlashcardData}/>
          </div>
        </div>
      </div>
    </div>
  );
}
