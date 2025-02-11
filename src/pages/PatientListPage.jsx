import React, { useCallback, useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { IconUserPlus } from "@tabler/icons-react";
import Styles from "./PatientListPage.module.css";
import PatientCard from "../components/list/PatientCard";
import AuthContext from "../context/AuthProvider";
import { getProfessionalPatient } from "../services/ProfessionalService";
import AddPatientModal from "../components/list/AddPatientModal";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function ReportPage() {
  const { sessionToken } = useContext(AuthContext);
  const [patientData, setPatientData] = useState([]);
  const [modal, setModal] = useState(false);
  const { t } = useTranslation();

  const fetchData = useCallback(async () => {
    try {
      const data = await getProfessionalPatient(sessionToken);
      setPatientData(data); // Assuming data is an array of patient objects
    } catch (error) {
      if(error.message === "No patient found."){
        toast.info(`${error.message}`);
      }else{
        toast.error(`${error.message}`);
      }
    }
  }, [sessionToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleModal = () => {
    setModal(!modal);
  };

  return (
    <div className={Styles.main_container}>
      <div className={Styles.list_container}>
        <div className={Styles.title_container}>
          <h1 className={Styles.title}>{t("patientList.title")}</h1>
          <button className={Styles.userPlus_btn} onClick={toggleModal}>
            <IconUserPlus />
          </button>
          <AddPatientModal modal={modal} toggleModal={toggleModal} sessionToken={sessionToken}/>
        </div>
        {patientData.length > 0 ? (
          [...patientData]
            .sort((a, b) => a.id - b.id) // Sort by patient ID in ascending order
            .map((patient) => (
              <NavLink
                key={patient.id} // Use patient's id as key
                className={Styles.link}
                to={`/home/patient/${patient.id}`} // Dynamic route based on patient id
              >
                <PatientCard
                  name={patient.name}
                  lastname={patient.lastname}
                  condition={patient.condition}
                  id={patient.id}
                  patient={true}  
                />
              </NavLink>
            ))
        ) : (
          <PatientCard patient={false}/>
        )}
      </div>
      {/* <div className={Styles.graph_container}>
        <h1 className={Styles.title}>Generic Statistics</h1>
        <div className={Styles.graph_card}>
          <BarChart />
        </div>
        <div className={Styles.graph_card}>
          <PieChart />
        </div>
        <div className={Styles.graph_card}>
          <BarChart />
        </div>
      </div> */}
    </div>
  );
}
