import React, { useEffect, useState } from "react";
import Styles from "./AllergyModal.module.css";
import { IconX } from "@tabler/icons-react";
import { editPatientAllergie } from "../../services/PatientService";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function AllergyModal({
  modal,
  toggleModal,
  patientID,
  sessionToken,
  allergie,
  onUpdateAllergies, // New callback prop
}) {
  const [allergies, setAllergies] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    if (modal) {
      setAllergies(allergie || "");
    }
  }, [modal, allergie]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await editPatientAllergie(sessionToken, patientID, allergies);
      onUpdateAllergies(allergies); // Call the callback to update the parent
      toggleModal(); // Close the modal
      toast.success(t("allergyModal.allergyUpdated"));
    } catch (error) {
      toast.error(`${error.message}`);
    }
  };

  const handleToggleModal = () => {
    toggleModal();
  };

  return (
    <>
      {modal && (
        <div className={Styles.modal}>
          <div className={Styles.overlay}></div>
          <div className={Styles.modal_content}>
            <div className={Styles.modal_header}>
              <h1 className={Styles.title}>{t("allergyModal.newAllergy")}</h1>
              <IconX
                className={Styles.close_icon}
                onClick={handleToggleModal}
                style={{ cursor: "pointer" }}
              />
            </div>
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className={Styles.input_group}>
                <label htmlFor="allergy">{t("allergyModal.allergy")}</label>
                <input
                  id="allergy"
                  name="allergy"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                />
              </div>
              <button type="submit" className={Styles.create_btn}>
                {t("allergyModal.addAllergy")}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
