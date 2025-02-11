import { useCallback, useContext, useEffect, useState } from "react";
import Styles from "./CalendarPage.module.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import AppointmentModal from "../components/calendar/AppointmentModal";
import AppointmentEdit from "../components/calendar/AppointmentEdit";
import { IconPlus } from "@tabler/icons-react";
import AuthContext from "../context/AuthProvider";
import { getProfessionalPatient } from "../services/ProfessionalService";
import { getAppointment } from "../services/AppointmentService";
import { toast } from "react-toastify";
import esLocale from '@fullcalendar/core/locales/es';
import { useTranslation } from "react-i18next";

export default function CalendarPage() {
  const { sessionToken } = useContext(AuthContext);
  const [modal, setModal] = useState(false); // Modal visibility state
  const [editModal, setEditModal] = useState(false); // Modal visibility state
  const [events, setEvents] = useState([]);
  const [patientData, setPatientData] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState({
    id: "",
    patientId: "",
    date: "",
    startTime: "",
    endTime: "",
  });
  const { t } = useTranslation();
  const language = localStorage.getItem("language");
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const fetchPatientData = useCallback(async () => {
    try {
      const patientData = await getProfessionalPatient(sessionToken);
      setPatientData(patientData);
    } catch (error) {
      if (error.message === "No patient found.") {
        toast.info(`${error.message}`);
      } else {
        toast.error(`${error.message}`);
      }
    }
  }, [sessionToken, modal, editModal]);

  const fetchAppointmentData = useCallback(async () => {
    try {
      // Fetch appointment data
      const eventData = await getAppointment(sessionToken);

      // Check if eventData is empty
      if (!eventData || eventData.length === 0) {
        // No events found; ensure `events` state is cleared
        setEvents([]);
        return;
      }

      // Transform event data into the format required for FullCalendar
      const transformedEvents = eventData.map((event) => {
        return {
          id: event.id,
          title: `${event.patient_name} ${event.patient_lastname}`, // Use patient name and lastname as event title
          start: `${event.appointment_date}T${event.start_time}`, // Combine date and time
          end: `${event.appointment_date}T${event.end_time}`,
          extendedProps: {
            patientId: event.id_patient, // Patient ID added to extendedProps
          },
        };
      });

      // Set transformed events
      setEvents(transformedEvents);
    } catch (error) {
      if (error.message === "No appointments found.") {
        toast.info(`${error.message}`);
      } else {
        toast.error(`${error.message}`);
      }
    }
  }, [sessionToken]);

  const fetchData = useCallback(async () => {
    await Promise.all([fetchPatientData(), fetchAppointmentData()]);
  }, [fetchPatientData, fetchAppointmentData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleModal = () => {
    setModal(!modal);
  };

  const toggleEditModal = () => {
    setEditModal(!editModal);
  };

  // const handleDateClick = (arg) => {
  //   alert(`Date clicked: ${arg.dateStr}`);
  // };

  const handleEventClick = (arg) => {
    const event = arg.event;

    // Set selected event details
    setSelectedEvent({
      id: event.id,
      patientId: event.extendedProps.patientId,
      date: event.startStr.split("T")[0],
      startTime: event.startStr.split("T")[1].substring(0, 5),
      endTime: event.endStr.split("T")[1].substring(0, 5),
    });

    toggleEditModal();
  };

  const getCalendarOptions = () => {
    if (screenWidth <= 750) {
      return {
        initialView: "timeGridWeek", // Default view for smaller screens
        headerToolbar: {
          start: "today prev next",
          center: "title",
          end: "timeGridWeek,timeGridDay", // Remove 'dayGridMonth' for small screens
        },
        slotMinTime: "09:00:00", // Show times starting from 9 AM
        slotMaxTime: "19:00:00", // Show times ending at 7 PM
        weekends: false,
      };
    } else {
      return {
        initialView: "dayGridMonth", // Default view for larger screens
        headerToolbar: {
          start: "today prev next",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay",
        },
        slotMinTime: "09:00:00", // Show times starting from 9 AM
        slotMaxTime: "19:00:00", // Show times ending at 7 PM
      };
    }
  };

  return (
    <div className={Styles.main_container}>
      <div className={Styles.title_container}>
        <h1 className={Styles.title}>{t("calendar.title")}</h1>
        <button className={Styles.appointment_btn} onClick={toggleModal}>
          <IconPlus />
        </button>
        <AppointmentModal
          modal={modal}
          toggleModal={toggleModal}
          selectData={patientData}
        />
      </div>
      <div className={Styles.calendar_container}>
        <style>
          {`
            .fc .fc-toolbar-title {
              font-size: 1.75em;
              margin: 0px;
              text-transform: capitalize;
            }

            .fc .fc-button-primary:disabled {
                background-color: var(--Dark-blue);
                border-color: var(--Dark-blue);
                color: var(--fc-button-text-color);
            }

            .fc .fc-button:disabled {
                opacity: 1;
            }

            .fc .fc-button-primary {
                background-color: var(--White);
                border-color: var(--Dark-cyan);
                color: var(--Dark-blue);
                text-transform: capitalize;
            }

            .fc .fc-button-primary:hover {
                background-color: var(--Dark-blue);
                border-color: var(--Dark-blue);
                color: var(--fc-button-text-color);
                text-transform: capitalize;
            }

            .fc .fc-button-primary:not(:disabled).fc-button-active, .fc .fc-button-primary:not(:disabled):active {
                background-color: var(--Dark-blue);
                border-color: var(--Dark-blue);
                color: var(--fc-button-text-color);
                text-transform: capitalize;
            }

            @media (max-width: 750px) {
              .fc .fc-button {
                  border-radius: 0.25em;
                  display: inline-block;
                  font-size: 0.5em;
                  font-weight: 400;
                  line-height: 1.5;
                  padding: 0.4em 0.65em;
                  text-align: center;
                  user-select: none;
                  vertical-align: middle;
              }

              .fc .fc-toolbar-title {
                  text-align: center;
                  font-size: 16px;
                  margin: 0px;
              }

              .fc-col-header-cell-cushion{
                font-size: 8px;
              }

              .fc-daygrid-day-number{
                font-size: 8px;
              }

              .fc-event-time, .fc-event-title{
                font-size:8px;
                overflow: hidden;
              }
            }

            @media (max-width: 468px) {
              .fc .fc-button {
                  padding: 0.5em
              }

              .fc .fc-toolbar-title {
                  font-size: 10px;
                  margin: 0px;
                  max-width: 70px;
              }

              .fc-direction-ltr .fc-toolbar > * > :not(:first-child) {
                  margin-left: 4px;
              }

              .fc .fc-daygrid-day {
                min-height: 50px;
              }

              .fc .fc-event {
                font-size: 8px;
                padding: 2px;
              }

              .fc table {
                  font-size: 10px;
              }
            }
          `}
        </style>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          {...getCalendarOptions()} // Apply dynamic options based on screen width
          height={"auto"}
          events={events}
          locale={language === "es" ? esLocale : ""}
          // dateClick={handleDateClick}
          eventClick={handleEventClick} // Add eventClick handler
        />
        <AppointmentEdit
          modal={editModal}
          toggleModal={toggleEditModal}
          selectData={patientData}
          selectedEventId={selectedEvent.id}
          selectedPatientId={selectedEvent.patientId}
          selectedDate={selectedEvent.date}
          selectedStartTime={selectedEvent.startTime}
          selectedEndTime={selectedEvent.endTime}
        />
      </div>
    </div>
  );
}
