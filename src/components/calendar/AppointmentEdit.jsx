import { useContext, useState, useEffect } from "react";
import * as yup from "yup";
import Styles from "./AppointmentEdit.module.css";
import { IconX } from "@tabler/icons-react";
import AuthContext from "../../context/AuthProvider";
import {
  editAppointment,
  deleteAppointment,
} from "../../services/AppointmentService";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function AppointmentEdit({
  modal,
  toggleModal,
  selectData,
  selectedEventId,
  selectedPatientId,
  selectedDate,
  selectedStartTime,
  selectedEndTime,
}) {
  const { sessionToken } = useContext(AuthContext);
  const [patientName, setPatientName] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [errors, setErrors] = useState({});
  const [isConfirmDelete, setIsConfirmDelete] = useState(false); // Track if the confirm delete buttons are shown
  const { t } = useTranslation();

  const validationSchema = yup.object().shape({
    patientName: yup.string().required(t("appointmentModal.patientRequired")),
    date: yup.string().required(t("appointmentModal.dateRequired")),
    startTime: yup.string().required(t("appointmentModal.startTimeRequired")),
    endTime: yup.string().required(t("appointmentModal.endTimeRequired")),
  });

  useEffect(() => {
    if (modal) {
      setPatientName(selectedPatientId || "");
      setDate(selectedDate || "");
      setStartTime(convertTo12HourFormat(selectedStartTime) || "");
      setEndTime(convertTo12HourFormat(selectedEndTime) || "");
    }
  }, [
    modal,
    selectedPatientId,
    selectedDate,
    selectedStartTime,
    selectedEndTime,
  ]);

  const convertTo12HourFormat = (time24) => {
    if (!time24) return "";
    const [hour24, minute] = time24.split(":").map(Number);
    const amPm = hour24 >= 12 ? "PM" : "AM";
    const hour12 = hour24 % 12 || 12;
    return `${hour12}:${String(minute).padStart(2, "0")} ${amPm}`;
  };

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

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!(await validateForm())) return;
    try {
      await editAppointment(
        sessionToken,
        selectedEventId,
        patientName,
        date,
        convertTime(startTime),
        convertTime(endTime)
      );
      handleToggleModal();
      toast.success(t("appointmentModal.appointmentUpdated"));
    } catch (error) {
      toast.error(`${error.message}`);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      await deleteAppointment(sessionToken, selectedEventId);
      handleToggleModal();
      toast.success(t("appointmentModal.appointmentDeleted"));
    } catch (error) {
      toast.error(`${error.message}`);
    }
  };

  const confirmDelete = () => {
    setIsConfirmDelete(true); // Show the confirm/cancel buttons
  };

  const cancelDelete = () => {
    setIsConfirmDelete(false); // Hide the confirm/cancel buttons and show edit/delete
  };

  const handleToggleModal = () => {
    toggleModal();
    resetForm();
  };

  const resetForm = () => {
    setPatientName("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setErrors({});
    setIsConfirmDelete(false);
  }

  const handleChange = async (field, value) => {
    const newValue = value ? value.toString() : "";

    if (field === "startTime") {
      setStartTime(newValue);
    } else if (field === "endTime") {
      setEndTime(newValue);
    } else if (field === "patientName") {
      setPatientName(newValue);
    } else if (field === "date") {
      setDate(newValue);
    }

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

    if (amPm === "AM" && hour === 12) {
      convertedHour = 0;
    } else if (amPm === "PM" && hour !== 12) {
      convertedHour += 12;
    }

    return `${String(convertedHour).padStart(2, "0")}:${String(minute).padStart(
      2,
      "0"
    )}`;
  };

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

  const getFilteredEndTimes = () => {
    if (!startTime || typeof startTime !== "string") return [];

    const startTimeString = startTime.trim();
    if (!startTimeString.includes(":") || !startTimeString.includes(" ")) {
      return [];
    }

    const startHour = parseInt(startTimeString.split(":")[0]);
    const startMinute = parseInt(startTimeString.split(":")[1].split(" ")[0]);
    const startAmPm = startTimeString.split(" ")[1];

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

    for (let i = 1; i < 5; i++) {
      const targetTimeInMinutes = startTimeInMinutes + i * 30;
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
              {!isConfirmDelete ? (
                <>
                  {" "}
                  <h1 className={Styles.title}>
                    {t("appointmentModal.editAppointment")}
                  </h1>
                  <IconX
                    className={Styles.close_icon}
                    onClick={handleToggleModal}
                    style={{ cursor: "pointer" }}
                  />
                </>
              ) : (
                <>
                  <h1 className={Styles.title2}>
                    {t("appointmentModal.deleteAppointment")}
                  </h1>
                  <IconX
                    className={Styles.close_icon}
                    onClick={handleToggleModal}
                    style={{ cursor: "pointer" }}
                  />
                </>
              )}
            </div>
            <form onSubmit={handleEdit} autoComplete="off">
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
                    onChange={(e) => handleChange("startTime", e.target.value)}
                  >
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

              <div className={Styles.row}>
                {!isConfirmDelete ? (
                  <>
                    <button type="submit" className={Styles.edit_btn}>
                      {t("appointmentModal.save")}
                    </button>
                    <button
                      type="button"
                      className={Styles.delete_btn}
                      onClick={confirmDelete}
                    >
                      {t("appointmentModal.delete")}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className={Styles.edit_btn}
                      onClick={handleDelete}
                    >
                      {t("appointmentModal.confirm")}
                    </button>
                    <button
                      type="button"
                      className={Styles.delete_btn}
                      onClick={cancelDelete}
                    >
                      {t("appointmentModal.cancel")}
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
