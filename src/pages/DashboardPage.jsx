import React, { useCallback, useContext, useEffect, useState } from "react";
import Styles from "./DashboardPage.module.css";
import HeaderCard from "../components/dashboard/HeaderCard";
import Schedule from "../components/dashboard/Schedule";
import StadisticsCard from "../components/dashboard/StadisticsCard";
import AuthContext from "../context/AuthProvider";
import { getProfessionalMe } from "../services/ProfessionalService";
import { getAppointment } from "../services/AppointmentService";
import { toast } from "react-toastify";

export default function DashboardPage() {
  const { sessionToken } = useContext(AuthContext);
  const [professionalData, setProfessionalData] = useState({});
  const [nextAppointment, setNextAppointment] = useState(null);
  const [appointmentData, setAppointmentData] = useState([]);

  const convertTo12Hour = (time24) => {
    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const getNextAppointment = (data) => {
    const now = new Date();
    const today = now.toISOString().split("T")[0]; // Today's date in YYYY-MM-DD format
  
    const convertToDateTime = (date, time) => new Date(`${date}T${time}`);
  
    // Filter appointments: exclude appointments where the time has already passed today
    const validAppointments = data.filter((item) => {
      const appointmentDate = item.appointment_date;
      const endDateTime = convertToDateTime(item.appointment_date, item.end_time);
  
      if (appointmentDate < today) return false; // Past dates are excluded
      if (appointmentDate === today && endDateTime <= now) return false; // Today's past appointments excluded
      return true; // Keep future and valid today's appointments
    });
  
    // Sort valid appointments by date and start time
    validAppointments.sort((a, b) => {
      const aDateTime = convertToDateTime(a.appointment_date, a.start_time);
      const bDateTime = convertToDateTime(b.appointment_date, b.start_time);
      return aDateTime - bDateTime;
    });
  
    // Return the next valid appointment
    const nextAppointment = validAppointments[0] || null;
  
    if (nextAppointment) {
      return {
        ...nextAppointment,
        start_time: convertTo12Hour(nextAppointment.start_time),
        end_time: convertTo12Hour(nextAppointment.end_time),
      };
    }
  
    return null;
  };

  const fetchProfessioanlData = useCallback(async () => {
    try {
      // Fetch professional data
      const data = await getProfessionalMe(sessionToken);
      setProfessionalData(data[0]);
    } catch (error) {
      toast.error(`${error.message}`);
    }
  }, [sessionToken]);

  const fetchAppointmentData = useCallback(async () => {
    try {
      // Fetch appointments
      const appointments = await getAppointment(sessionToken);
      const nextAppointment = getNextAppointment(appointments);
      setNextAppointment(nextAppointment);
      setAppointmentData(appointments);
    } catch (error) {
      if (error.message === "No appointments found.") {
        return;
      } else {
        toast.error(`${error.message}`);
      }
    }
  }, [sessionToken]);

  const fetchData = useCallback(async () => {
    await Promise.all([fetchProfessioanlData(), fetchAppointmentData()]);
  }, [fetchProfessioanlData, fetchAppointmentData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      <div className={Styles.dashboard_container}>
        <div className={Styles.left}>
          <div>
            <HeaderCard
              name={professionalData.name}
              lastName={professionalData.lastname}
              sex={professionalData.sex}
              nextAppointment={nextAppointment}
            />
          </div>
        </div>
        <div className={Styles.right}>
          <Schedule
            sessionToken={sessionToken}
            appointmentData={appointmentData}
          />
        </div>
      </div>
      <div className={Styles.graphContainer}>
        <StadisticsCard
          sessionToken={sessionToken}
          nextAppointment={nextAppointment}
        />
      </div>
    </div>
  );
}
