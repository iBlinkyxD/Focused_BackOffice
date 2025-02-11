import { useCallback, useContext, useEffect, useState } from "react";
import { IconPlus, IconEdit } from "@tabler/icons-react";
import Styles from "./Prescription.module.css";
import PrescriptionModal from "./PrescriptionModal";
import PrescriptionInfo from "./PrescriptionInfo";
import MedicationModal from "./MedicationModal";
import MedicationEdit from "./MedicationEdit";
import PrescriptionEdit from "./PrescriptionEdit";
import Pagination from "./Pagination";
import { getPrescriptionByPatient } from "../../services/PrescriptionService";
import { getPrescriptionMedication } from "../../services/PrescriptionMedicationService";
import { getMedicationByID } from "../../services/MedicationService";
import AuthContext from "../../context/AuthProvider";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function Prescription() {
  const { patientId } = useParams();
  const { sessionToken, professionID } = useContext(AuthContext);
  const [prescriptions, setPrescriptions] = useState([]);
  const [modal, setModal] = useState(false);
  const [currentModal, setCurrentModal] = useState(null); // Track the current modal: 'prescription' or 'medication'
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [prescriptionInfoFetchData, setPrescriptionInfoFetchData] =
    useState(null);
  const [medicationDetails, setMedicationDetails] = useState(null);
  const { t } = useTranslation();
  const itemPerPage = 5;

  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItem = prescriptions.slice(indexOfFirstItem, indexOfLastItem);

  const fetchData = useCallback(async () => {
    try {
      const prescriptionsData = await getPrescriptionByPatient(
        sessionToken,
        patientId
      );
  
      // Enrich each prescription with its medication name or a fallback
      const enrichedData = await Promise.all(
        prescriptionsData.map(async (prescription) => {
          try {
            const medications = await getPrescriptionMedication(
              sessionToken,
              prescription.id
            );
  
            // Separate active and inactive medications
            const activeMedications = medications.filter((medication) => medication.active);
            const inactiveMedications = medications.filter((medication) => !medication.active);
  
            // If there are active medications, fetch their names
            const medicationNames = activeMedications.length
              ? await Promise.all(
                  activeMedications.map((medication) =>
                    getMedicationByID(sessionToken, medication.id_medication)
                  )
                )
              : null;
  
            let medicationName = t("prescription.noMedication"); // Default fallback message
            
            if (medicationNames && medicationNames.length > 0) {
              // Show active medication names
              medicationName = medicationNames.map((m) => m.name).join(", ");
            } else if (inactiveMedications.length > 0) {
              // If no active medications but there are inactive ones, fetch their names
              const inactiveMedicationNames = await Promise.all(
                inactiveMedications.map((medication) =>
                  getMedicationByID(sessionToken, medication.id_medication)
                )
              );
  
              medicationName = inactiveMedicationNames
                .map((medication) => medication.name)  // Get the medication name
                .join(", ");
            }
  
            return {
              id: prescription.id,
              psychiatristID: prescription.id_psychiatrist,
              medicationName,
              date: new Date(prescription.start_date)
                .toISOString()
                .split("T")[0],
              note: prescription.notes,
              psychiatrist: `${prescription.professional_name} ${prescription.professional_lastname}`,
              status: prescription.active ? "Active" : "Disable",
            };
          } catch {
            return {
              id: prescription.id,
              psychiatristID: prescription.id_psychiatrist,
              medicationName: t("prescription.noMedication"), // Fallback if there's an error fetching medications
              date: new Date(prescription.start_date)
                .toISOString()
                .split("T")[0],
              note: prescription.notes,
              psychiatrist: `${prescription.professional_name} ${prescription.professional_lastname}`,
              status: prescription.active ? "Active" : "Disable",
            };
          }
        })
      );
  
      setPrescriptions(enrichedData.sort((b, a) => new Date(a.date) - new Date(b.date)));
    } catch (error) {
      toast.error(`${error.message}`);
    }
  }, [sessionToken, patientId, currentModal]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData, modal]);

  const handleEditIconClick = (prescription) => {
    setSelectedPrescription(prescription); // Store the full prescription data
    setCurrentModal("preEdit"); // Open the edit modal
  };

  const rows = [...currentItem];
  while (rows.length < itemPerPage) {
    rows.push({
      id: `placeholder-${rows.length}`,
      medicationName: "",
      date: "",
      note: "",
      psychiatrist: "",
      status: "",
    });
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(prescriptions.length / itemPerPage);

  const toggleModal = () => {
    setModal(!modal);
  };

  const togglePrescriptionModal = (item = null) => {
    setSelectedPrescription(item);
    setCurrentModal(currentModal === "prescription" ? null : "prescription");
  };

  const handleUpdate = () => {
    setCurrentModal("prescription");
    if (prescriptionInfoFetchData) {
      prescriptionInfoFetchData(); // Trigger data refresh in PrescriptionInfo
    }
  };

  const toggleMedicationModal = () => {
    setCurrentModal(currentModal === "medication" ? null : "medication");
  };

  const switchToMedicationModal = () => {
    setCurrentModal("medication");
  };

  const toggleEditModal = () => {
    setCurrentModal(currentModal === "edit" ? null : "edit");
  };

  const togglePrescriptionEditModal = () => {
    setCurrentModal(currentModal === "preEdit" ? null : "preEdit");
  }

  const switchToEditModal = () => {
    setCurrentModal("edit");
  };

  return (
    <div className={Styles.box}>
      <div className={Styles.row2}>
        <h1 className={Styles.title}>{t("prescription.prescriptions")}</h1>
        <button className={Styles.default_btn} onClick={toggleModal}>
          <IconPlus />
        </button>
        <PrescriptionModal modal={modal} toggleModal={toggleModal} />
      </div>
      <div className={Styles.table_container}>
        <table className={Styles.medication_table}>
          <thead>
            <tr>
              <th>{t("prescription.medications")}</th>
              <th>{t("prescription.date")}</th>
              <th>{t("prescription.note")}</th>
              <th>{t("prescription.prescribedBy")}</th>
              <th>{t("prescription.status")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item, index) => (
              <tr
                key={item.id || index}
                onClick={() =>
                  item.medicationName && togglePrescriptionModal(item)
                } // Open modal only for valid data
                className={Styles.clickableRow}
              >
                <td>{item.medicationName || ""}</td>
                <td>{item.date || ""}</td>
                <td>{item.note || ""}</td>
                <td>{item.psychiatrist || ""}</td>
                <td className={item.status === "Active" ? Styles.activeStatus : Styles.disableStatus}>{item.status || ""}</td>
                <td>
                  {item.status && item.psychiatristID === professionID &&(
                    <IconEdit
                      style={{ cursor: "pointer" }}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering row click
                        handleEditIconClick(item); // Pass the full prescription data
                      }}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <PrescriptionInfo
          modal={currentModal === "prescription"}
          toggleModal={togglePrescriptionModal}
          switchToMedicationModal={switchToMedicationModal}
          switchToEditModal={switchToEditModal}
          sessionToken={sessionToken}
          prescriptionID={selectedPrescription?.id}
          prescriptionStatus={selectedPrescription?.status}
          setMedicationDetails={setMedicationDetails} // Pass down the setter function
        />
        <MedicationModal
          modal={currentModal === "medication"}
          toggleModal={toggleMedicationModal}
          switchToPrescriptionModal={handleUpdate} // Refresh and switch modal
          prescriptionID={selectedPrescription?.id}
        />
        <MedicationEdit
          modal={currentModal === "edit"}
          toggleModal={toggleEditModal}
          switchToPrescriptionModal={handleUpdate}
          prescriptionID={selectedPrescription?.id}
          medicationDetails={medicationDetails}
        />
        <PrescriptionEdit
          modal={currentModal === "preEdit"}
          toggleModal={togglePrescriptionEditModal}
          prescriptionData={selectedPrescription} // Pass full data
        />
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        paginate={paginate}
      />
    </div>
  );
}
