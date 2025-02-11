import { useState, useEffect } from "react";
import Styles from "./ProfileBox.module.css";
import { IconPlus, IconEdit } from "@tabler/icons-react";
import AllergyModal from "./AllergyModal";
import NotesModal from "./NotesModal";
import ConditionModal from "./ConditionModal";
import { useTranslation } from "react-i18next";

export default function ProfileBox({
  patientID,
  sessionToken,
  name,
  lastname,
  condition,
  sex,
  birthdate,
  allergie,
}) {
  const [modalAllergy, setModalAllergy] = useState(false);
  const [modalNote, setModalNote] = useState(false);
  const [modalCondition, setModalCondition] = useState(false);
  const [notes, setNotes] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [patientCondition, setPatientCondition] = useState("");
  const { t } = useTranslation();

  const conditionStyle =
    {
      "Newly Diagnosed": Styles.newlyDiagnosed,
      "Stable": Styles.stable,
      "Improving": Styles.improving,
      "Worsening": Styles.worsening,
      "Chronic": Styles.chronic,
      "In Crisis": Styles.inCrisis,
    }[(condition, patientCondition)] || Styles.default; // Fallback to a default style if no match

  useEffect(() => {
    const notesKey = `notes-${patientID}`;
    const savedNotes = localStorage.getItem(notesKey) || t("profileBox.noNotes");
    setNotes(savedNotes);
  }, [patientID, modalNote]); // Update notes when modal closes

  useEffect(() => {
    setAllergies(allergie ? allergie.split(",").map((a) => a.trim()) : []);
  }, [allergie]);

  useEffect(() => {
    setPatientCondition(condition);
  }, [condition]);

  const toggleModalAllergy = () => {
    setModalAllergy(!modalAllergy);
  };

  const updateAllergies = (newAllergies) => {
    setAllergies(newAllergies.split(",").map((allergy) => allergy.trim()));
  };

  const updateCondition = (newCondition) => {
    setPatientCondition(newCondition);
  };

  const toggleModalNote = () => {
    setModalNote(!modalNote);
  };

  const toggleModalCondition = () => {
    setModalCondition(!modalCondition);
  };

  function calculateAge(birthDate) {
    const birth = new Date(birthDate);

    if (isNaN(birth.getTime())) {
      return "Invalid date"; // Handle invalid dates gracefully
    }

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();

    // Adjust if the birthday hasn't occurred this year
    const monthDiff = today.getMonth() - birth.getMonth();
    const dayDiff = today.getDate() - birth.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
  }

  const age = calculateAge(birthdate);

  return (
    <>
      <div className={Styles.box}>
        <div className={Styles.profile_container}>
          <img
            className={Styles.profile_pic}
            src="/assets/images/default-pfp.png"
            alt={t("profileBox.profile")}
          />
        </div>
        <div className={Styles.details}>
          <h1 className={Styles.name}>
            {name} {lastname}
          </h1>
          <div className={Styles.info}>
            <p className={Styles.label}>{t("profileBox.condition")}</p>
            <p className={conditionStyle}>
              {t(`profileBox.${patientCondition}`)}{" "}
              <button className={Styles.edit_btn}>
                <IconEdit color="#3CA2A2" onClick={toggleModalCondition} />
              </button>
            </p>
            <ConditionModal
              modal={modalCondition}
              toggleModal={toggleModalCondition}
              patientID={patientID}
              sessionToken={sessionToken}
              condition={patientCondition}
              onUpdateCondition={updateCondition}
            />

            {/* <form className={Styles.form_container}>
              <select value={condition} className={Styles.value}>
                <option value="Normal">Normal</option>
                <option value="Test">Normal2</option>
                <option value="Test2">Normal4</option>
              </select>
              <button className={Styles.edit_btn}>
                <IconEdit color="#3CA2A2" />
              </button>
            </form> */}
          </div>

          <div className={Styles.info}>
            <p className={Styles.label}>{t("profileBox.gender")}</p>
            <p className={Styles.value}>
              {sex === "M"
                ? t("profileBox.male")
                : sex === "F"
                ? t("profileBox.female")
                : sex === "O"
                ? t("profileBox.other")
                : ""}
            </p>
          </div>
          <div className={Styles.info}>
            <p className={Styles.label}>{t("profileBox.age")}</p>
            <p className={Styles.value}>{age}</p>
          </div>
        </div>
      </div>
      <div className={Styles.box}>
        <div className={Styles.details}>
          <div className={Styles.row}>
            <h2 className={Styles.subtitle2}>{t("profileBox.allergies")}</h2>
            <button
              className={Styles.default_btn2}
              onClick={toggleModalAllergy}
            >
              <IconPlus />
            </button>
            <AllergyModal
              modal={modalAllergy}
              toggleModal={toggleModalAllergy}
            />
          </div>
          <h2 className={Styles.subtitle}>{t("profileBox.allergies")}</h2>
          {/* Dynamically render allergies */}
          {allergies.length > 0 ? (
            allergies.map((allergy, index) => (
              <p key={index} className={Styles.label2}>
                {allergy}
              </p>
            ))
          ) : (
            <p className={Styles.label2}>{t("profileBox.noAllergies")}</p>
          )}
          <button
            className={Styles.default_btn}
            onClick={toggleModalAllergy}
          >
            <IconPlus />
          </button>
          <AllergyModal
            modal={modalAllergy}
            toggleModal={toggleModalAllergy}
            patientID={patientID}
            sessionToken={sessionToken}
            allergie={allergies}
            onUpdateAllergies={updateAllergies} // Pass the callback
          />
        </div>
      </div>
      <div className={Styles.box}>
        <div className={Styles.details}>
          <div className={Styles.row}>
            <h2 className={Styles.subtitle2}>{t("profileBox.note")}</h2>
            <button className={Styles.default_btn2} onClick={toggleModalNote}>
              <IconPlus />
            </button>
            <NotesModal
              modal={modalNote}
              toggleModal={toggleModalNote}
              patientID={patientID}
            />
          </div>
          <h2 className={Styles.subtitle}>{t("profileBox.note")}</h2>
          <p className={Styles.label2}>{notes}</p>
          <button className={Styles.default_btn} onClick={toggleModalNote}>
          {t("profileBox.addNote")}
          </button>
          <NotesModal
            modal={modalNote}
            toggleModal={toggleModalNote}
            patientID={patientID}
          />
        </div>
      </div>
    </>
  );
}
