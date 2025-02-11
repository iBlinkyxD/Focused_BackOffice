import { useContext, useState } from "react";
import * as yup from "yup";
import Styles from "./AppointmentModal.module.css";
import { IconX } from "@tabler/icons-react";
import AuthContext from "../../context/AuthProvider";
import { createAppointment } from "../../services/AppointmentService";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function AppointmentModal({ modal, toggleModal, selectData }) {
  const { sessionToken } = useContext(AuthContext);
  const [patientName, setPatientName] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [errors, setErrors] = useState({});
  const { t } = useTranslation();

  const validationSchema = yup.object().shape({
    patientName: yup.string().required(t("appointmentModal.patientRequired")),
    date: yup.string().required(t("appointmentModal.dateRequired")),
    startTime: yup.string().required(t("appointmentModal.startTimeRequired")),
    endTime: yup.string().required(t("appointmentModal.endTimeRequired")),
  });

  const validateForm = async () => {
    try {
      await validationSchema.validate(
        { patientName, date, startTime, endTime },
        { abortEarly: false }
      );
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
        return false;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (!(await validateForm())) return; // Validate and only proceed if the form is valid
    try {
      await createAppointment(
        sessionToken,
        patientName,
        date,
        convertTime(startTime),
        convertTime(endTime)
      );
      handleToggleModal();
      toast.success(t("appointmentModal.appointmentCreated"));
    } catch (error) {
      toast.error(`${error.message}`);
    }
  };

  const resetForm = () => {
    setPatientName("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setErrors({});
  };

  // Function to handle modal toggle
  const handleToggleModal = () => {
    resetForm();
    toggleModal(); // Close modal
  };

  const handleChange = async (field, value) => {
    const newValue = value ? value.toString() : "";

    // Correctly update the states for startTime and endTime
    if (field === "startTime") {
      setStartTime(newValue); // Update startTime correctly
    } else if (field === "endTime") {
      setEndTime(newValue); // Update endTime correctly
    } else if (field === "patientName") {
      setPatientName(newValue); // Update patientName correctly
    } else if (field === "date") {
      setDate(newValue); // Update date correctly
    }

    // Validate the updated field
    try {
      await validationSchema.validateAt(field, {
        patientName,
        date,
        startTime,
        endTime,
        [field]: newValue,
      });
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        [field]: error.message,
      }));
    }
  };

  const convertTime = (time) => {
    const [hourMinute, amPm] = time.split(" ");
    const [hour, minute] = hourMinute.split(":").map(Number);

    let convertedHour = hour;

    // Convert to 24-hour format
    if (amPm === "AM" && hour === 12) {
      convertedHour = 0; // 12 AM is 00:xx in 24-hour format
    } else if (amPm === "PM" && hour !== 12) {
      convertedHour += 12; // PM times need to be adjusted by adding 12
    }

    return `${String(convertedHour).padStart(2, "0")}:${String(minute).padStart(
      2,
      "0"
    )}`;
  };

  // Generate time slots from 9:00 AM to 5:00 PM
  const generateTimeSlots = () => {
    const times = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
        const amPm = hour < 12 ? "AM" : "PM";
        const time = `${formattedHour}:${minute
          .toString()
          .padStart(2, "0")} ${amPm}`;
        times.push(time);
      }
    }
    return times;
  };

  const timeSlots = generateTimeSlots();

  // Function to filter end time options based on the selected start time
  // const getFilteredEndTimes = () => {
  //   // Ensure startTime is defined and is a non-empty string before processing
  //   if (!startTime || typeof startTime !== "string") return timeSlots;

  //   const startTimeString = startTime.trim(); // trim to avoid any extra spaces

  //   // Ensure that startTimeString has a valid format before calling split
  //   if (!startTimeString.includes(":") || !startTimeString.includes(" ")) {
  //     return timeSlots; // Return all time slots if the format is incorrect
  //   }

  //   const startHour = parseInt(startTimeString.split(":")[0]);
  //   const startMinute = parseInt(startTimeString.split(":")[1].split(" ")[0]);
  //   const startAmPm = startTimeString.split(" ")[1];

  //   // Convert to 24-hour format for comparison
  //   const startTimeInMinutes =
  //     (startAmPm === "PM"
  //       ? startHour === 12
  //         ? 12
  //         : startHour + 12
  //       : startHour === 12
  //       ? 0
  //       : startHour) *
  //       60 +
  //     startMinute;

  //   return timeSlots.filter((time) => {
  //     const [hourPart, minutePart] = time.split(":");
  //     const hour = parseInt(hourPart);
  //     const minute = parseInt(minutePart.split(" ")[0]);
  //     const amPm = minutePart.split(" ")[1];

  //     const endTimeInMinutes =
  //       (amPm === "PM"
  //         ? hour === 12
  //           ? 12
  //           : hour + 12
  //         : hour === 12
  //         ? 0
  //         : hour) *
  //         60 +
  //       minute;

  //     return endTimeInMinutes > startTimeInMinutes; // Only allow end times after the start time
  //   });
  // };

  const getFilteredEndTimes = () => {
    // Ensure startTime is defined and is a valid string
    if (!startTime || typeof startTime !== "string") return [];

    const startTimeString = startTime.trim(); // Trim to avoid any extra spaces

    // Ensure the startTimeString has a valid format before processing
    if (!startTimeString.includes(":") || !startTimeString.includes(" ")) {
      return []; // Return empty array if the format is incorrect
    }

    const startHour = parseInt(startTimeString.split(":")[0]);
    const startMinute = parseInt(startTimeString.split(":")[1].split(" ")[0]);
    const startAmPm = startTimeString.split(" ")[1];

    // Convert to 24-hour format for comparison
    const startTimeInMinutes =
      (startAmPm === "PM"
        ? startHour === 12
          ? 12
          : startHour + 12
        : startHour === 12
        ? 0
        : startHour) *
        60 +
      startMinute;

    const timeSlotsWithinNextTwoHours = [];

    // Generate time slots within the next 2 hours
    for (let i = 1; i < 5; i++) {
      const targetTimeInMinutes = startTimeInMinutes + i * 30; // Every 30 minutes
      const targetHour = Math.floor(targetTimeInMinutes / 60);
      const targetMinute = targetTimeInMinutes % 60;

      const formattedHour = targetHour % 12 === 0 ? 12 : targetHour % 12;
      const amPm = targetHour < 12 || targetHour === 24 ? "AM" : "PM";

      const formattedTime = `${formattedHour}:${String(targetMinute).padStart(
        2,
        "0"
      )} ${amPm}`;
      timeSlotsWithinNextTwoHours.push(formattedTime);
    }

    return timeSlotsWithinNextTwoHours;
  };

  const filteredEndTimes = getFilteredEndTimes();

  return (
    <>
      {modal && (
        <div className={Styles.modal}>
          <div className={Styles.overlay}></div>
          <div className={Styles.modal_content}>
            <div className={Styles.modal_header}>
              <h1 className={Styles.title}>{t("appointmentModal.newAppointment")}</h1>
              <IconX
                className={Styles.close_icon}
                onClick={handleToggleModal}
                style={{ cursor: "pointer" }}
              />
            </div>
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className={Styles.input_group}>
                <label htmlFor="patientName">
                {t("appointmentModal.patientName")}{" "}
                  {errors.patientName && (
                    <label className={Styles.error_label}>*</label>
                  )}
                </label>
                <select
                  id="patientName"
                  name="patientName"
                  value={patientName}
                  className={errors.patientName ? Styles.error_input : ""}
                  onChange={(e) => handleChange("patientName", e.target.value)}
                >
                  <option value="">{t("appointmentModal.selectPatient")}</option>
                  {selectData.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} {patient.lastname}
                    </option>
                  ))}
                </select>
                {errors.patientName && (
                  <p className={Styles.error_message}>{errors.patientName}</p>
                )}
              </div>
              <div className={Styles.input_group}>
                <label htmlFor="date">
                {t("appointmentModal.date")}{" "}
                  {errors.date && (
                    <label className={Styles.error_label}>*</label>
                  )}
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={date}
                  className={errors.date ? Styles.error_input : ""}
                  onChange={(e) => handleChange("date", e.target.value)}
                />
                {errors.date && (
                  <p className={Styles.error_message}>{errors.date}</p>
                )}
              </div>
              <div className={Styles.row}>
                <div className={Styles.group}>
                  <label htmlFor="startTime">
                  {t("appointmentModal.startTime")}{" "}
                    {errors.startTime && (
                      <label className={Styles.error_label}>*</label>
                    )}
                  </label>
                  <select
                    id="startTime"
                    name="startTime"
                    value={startTime}
                    className={errors.startTime ? Styles.error_input : ""}
                    onChange={(e) => {
                      handleChange("startTime", e.target.value);
                      setEndTime(""); // Reset end time when start time changes
                    }}
                  >
                    <option value="" className={Styles.option}>
                    {t("appointmentModal.selectStart")}
                    </option>
                    {timeSlots.map((time, index) => (
                      <option key={index} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  {errors.startTime && (
                    <p className={Styles.error_message}>{errors.startTime}</p>
                  )}
                </div>
                <div className={Styles.group}>
                  <label htmlFor="endTime">
                  {t("appointmentModal.endTime")}{" "}
                    {errors.endTime && (
                      <label className={Styles.error_label}>*</label>
                    )}
                  </label>
                  <select
                    id="endTime"
                    name="endTime"
                    value={endTime}
                    className={errors.endTime ? Styles.error_input : ""}
                    onChange={(e) => handleChange("endTime", e.target.value)}
                  >
                    <option value="">{t("appointmentModal.selectEnd")}</option>
                    {filteredEndTimes.map((time, index) => (
                      <option key={index} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  {errors.endTime && (
                    <p className={Styles.error_message}>{errors.endTime}</p>
                  )}
                </div>
              </div>
              <button type="submit" className={Styles.create_btn}>
              {t("appointmentModal.create")}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
