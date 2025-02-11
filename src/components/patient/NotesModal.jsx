import { useState, useEffect } from "react";
import Styles from "./NotesModal.module.css";
import { IconX } from "@tabler/icons-react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function NotesModal({ modal, toggleModal, patientID }) {
  const [note, setNote] = useState("");
  const { t } = useTranslation();

  // Load the note corresponding to the patientID when the modal is opened
  useEffect(() => {
    if (modal && patientID) {
      const notesKey = `notes-${patientID}`;
      const existingNote = localStorage.getItem(notesKey);
      if (existingNote) {
        setNote(existingNote); // Set the note for this patient if one exists
      } else {
        setNote(""); // Show empty input if no note exists for this patient
      }
    }
  }, [modal, patientID]);

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    saveNoteToLocalStorage(note); // Save the note locally
    toggleModal(); // Close modal
    setNote(""); // Reset the note input field
    toast.success(t("notesModal.successAddNotes"));
  };

  const saveNoteToLocalStorage = (newNote) => {
    const notesKey = `notes-${patientID}`;
    localStorage.setItem(notesKey, newNote); // Store only the latest note for this patient
  };

  const handleToggleModal = () => {
    toggleModal(); // Close modal
  };

  return (
    <>
      {modal && (
        <div className={Styles.modal}>
          <div className={Styles.overlay}></div>
          <div className={Styles.modal_content}>
            <div className={Styles.modal_header}>
              <h1 className={Styles.title}>{t("notesModal.title")}</h1>
              <IconX
                className={Styles.close_icon}
                onClick={handleToggleModal}
                style={{ cursor: "pointer" }}
              />
            </div>
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className={Styles.input_group}>
                <label htmlFor="note">{t("notesModal.note")}</label>
                <input
                  id="note"
                  name="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className={Styles.create_btn}>
              {t("notesModal.addNote")}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
