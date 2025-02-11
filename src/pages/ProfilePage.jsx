import { useEffect, useState, useContext, useCallback } from "react";
import Styles from "./ProfilePage.module.css";
import ProfileBox from "../components/profile/ProfileBox";
import InfoBox from "../components/profile/InfoBox";
import AuthContext from "../context/AuthProvider";
import { getProfessionalMe } from "../services/ProfessionalService";
import { getOffice } from "../services/OfficeService";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function ProfilePage() {
  const { sessionToken, userEmail, loading } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isCancel, setIsCancel] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [professionalData, setProfessionalData] = useState({});
  const [officeData, setOfficeData] = useState({});
  const [errors, setErrors] = useState(false);
  const { t } = useTranslation();

  const handleEditToggle = (editing) => {
    setIsEditing(editing);
  };

  const handleCancelToggle = (cancel) => {
    setIsEditing(false);
    setIsCancel(cancel);
    if (cancel) {
      setTimeout(() => setIsCancel(false), 0); // Reset isCancel after triggering
    }
  };

  const handleConfirmToggle = () => {
    if (errors === false) {
      // Only exit edit mode if there are no errors
      setIsEditing(false);
      setIsConfirm(true);
      setTimeout(() => setIsConfirm(false), 0); // Reset isCancel after triggering

    //   setTimeout(() => {
    //     window.location.reload();
    // }, 500);
    } else {
      // Stay in edit mode if there are errors
      setIsEditing(true);
      setIsConfirm(false);
      
    }
  };

  const handleErrorsChange = useCallback(
    (hasErrors) => {
      setErrors(hasErrors)
    },
    []
  );

  const handleUpdateSuccess = (updatedData) => {
    // Update the state or context with the new data
    setProfessionalData(updatedData);
    setOfficeData(updatedData);
    // You can also trigger a re-fetch here if needed
  };
  
  function revertPhoneNumber(formattedPhone) {
    if (!formattedPhone) return t("profile.invalid");
    return formattedPhone.replace(/\D/g, ""); // Removes all non-digit characters
  }

  const fetchData = useCallback(async () => {
    try {
      const data = await getProfessionalMe(sessionToken);
      setProfessionalData(data[0]);
      const office = await getOffice(sessionToken);
      setOfficeData(office[0]);
    } catch (error) {
      if (error.message === t("profile.noOffice")) {
        toast.info(`${error.message}`);
      }else{
        toast.error(`${error.message}`);
      }
    }
  }, [sessionToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className={!isEditing ? Styles.main_container : Styles.edit_container}>
      <div className={Styles.profile_container}>
        <ProfileBox
          onEditToggle={handleEditToggle}
          onCancelToggle={handleCancelToggle}
          onConfirmToggle={handleConfirmToggle}
          isEditing={isEditing}
          name={professionalData.name || professionalData.firstName}
          lastname={professionalData.lastname || professionalData.lastName}
        />
      </div>
      <div className={Styles.info_container}>
        <InfoBox
          isEditable={isEditing}
          isCancel={isCancel}
          isConfirm={isConfirm}
          onErrorsChange={handleErrorsChange}
          onUpdateSuccess={handleUpdateSuccess} // Updates errors when there are validation issues
          dataName={professionalData.name || professionalData.firstName}
          dataLastname={professionalData.lastname || professionalData.lastName}
          dataEmail={userEmail}
          dataPhone={professionalData.phone || revertPhoneNumber(professionalData.phoneNumber)}
          dataBirthdate={professionalData.birthdate}
          dataSex={professionalData.sex}
          dataDocument={professionalData.document || professionalData.documentId}
          dataDocumentType={professionalData.document_type}
          dataExequatur={professionalData.exequatur}
          dataImage={null}
          dataOfficeID={officeData.id || professionalData.officeID}
          dataOfficeName={officeData.name || officeData.officeName}
          dataCity={officeData.city}
          dataSector={officeData.sector}
          dataAddress={officeData.address}
        />
      </div>
    </div>
  );
}