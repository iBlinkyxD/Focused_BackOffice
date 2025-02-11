import React from "react";
import Styles from "./SuccessfulModal.module.css";
import { IconCircleDashedCheck } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function SuccessfulModal({ modal }) {
  const { t } = useTranslation();
  return (
    <>
      {modal && (
        <div className={Styles.modal}>
          <div className={Styles.overlay}></div>
          <div className={Styles.modal_content}>
            <div>
              <center>
                <IconCircleDashedCheck size={128} color="#215A6D" />
              </center>
            </div>
            <p className={Styles.messageText}>
              {t("forgot.password_reset")} <br /> {t("forgot.successful")}!
            </p>
            <center>
              <Link to="/" className={Styles.signUpButton}>
              {t("forgot.back_to_login")}
              </Link>
            </center>
          </div>
        </div>
      )}
    </>
  );
}

export default SuccessfulModal;
