import React from "react";
import { Link } from "react-router-dom";
import Styles from "./ForgotOTP.module.css";
import { useTranslation } from "react-i18next";

function VerifyOTP({modal}) {
  const { t } = useTranslation();
  return (
    <>
      {modal && (
        <div className={Styles.modal}>
          <div className={Styles.overlay}></div>
          <div className={Styles.modal_content}>
            <div>
              <center>
                <img
                  src="\assets\images\Vector.png"
                  alt="Icon"
                  className={Styles.icon}
                />
              </center>
            </div>
            <p className={Styles.messageText}>
              {t("verify.message")}
            </p>
            <center>
              <Link to="/" className={Styles.signUpButton}>
              {t("recover.back_to_login")}
              </Link>
            </center>
          </div>
        </div>
      )}
    </>
  );
}

export default VerifyOTP