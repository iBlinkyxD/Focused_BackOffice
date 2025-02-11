import { useState } from "react";
import Styles from "./ProfileBox.module.css";
import PasswordModal from "./PasswordModal";
import { useTranslation } from "react-i18next";

export default function ProfileBox({
  onEditToggle,
  isEditing,
  onCancelToggle,
  onConfirmToggle,
  hasErrors, // new prop for error tracking
  name,
  lastname,
}) {
  const [modal, setModal] = useState(false);
  const { t } = useTranslation();

  const toggleModal = () => {
    setModal(!modal);
  }

  const handleEditClick = () => {
    onEditToggle(true);
  };

  const handleConfirmClick = () => {
    if (!hasErrors) {
      onEditToggle(false); // Only exit edit mode if there are no errors
      onConfirmToggle();
    }
  };

  const handleCancelClick = () => {
    onEditToggle(false);
    onCancelToggle(true);
  };

  return (
    <div className={Styles.box}>
      {isEditing ? (
        <>
          <div className={Styles.profile_container}>
            <img
              className={Styles.profile_pic}
              src="/assets/images/default-pfp.png"
              alt="Profile"
            />
          </div>
          <button className={Styles.pfp_btn}>{t("HTML.profileUpload")}</button>
          <div className={Styles.button_container}>
            <button onClick={handleConfirmClick} className={Styles.default_btn}>
              {t("HTML.confirm")}
            </button>
            <button onClick={handleCancelClick} className={Styles.cancel_btn}>
              {t("HTML.cancel")}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className={Styles.profile_container}>
            <img
              className={Styles.profile_pic}
              src="/assets/images/default-pfp.png"
              alt="Profile"
            />
          </div>
          <h1 className={Styles.name}>
            {name} {lastname}
          </h1>
          <div className={Styles.button_container}>
            <button onClick={handleEditClick} className={Styles.default_btn}>
              {t("HTML.editProfile")}
            </button>
            <button onClick={toggleModal} className={Styles.default_btn}>{t("HTML.changePassword")}</button>
            <PasswordModal modal={modal} toggleModal={toggleModal}/>
          </div>
        </>
      )}
    </div>
  );
}

