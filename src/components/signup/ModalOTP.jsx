import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Styles from "./ModalOTP.module.css";
import { useTranslation } from "react-i18next";

export default function ModalOTP({ modal, toggleModal }) {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState(""); // New state for error message
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleChange = (element, index) => {
    const value = element.target.value;
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;

      if (value && element.target.nextSibling) {
        element.target.nextSibling.focus();
      }

      setOtp(newOtp);
      setError(""); // Clear error message on valid input
    }
  };

  const handleKeyDown = (e, index) => {
    const newOtp = [...otp];

    if (e.key === "Backspace") {
      if (newOtp[index] === "") {
        if (e.target.previousSibling) {
          e.target.previousSibling.focus();
        }
      } else {
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length === 4) {
      toggleModal();
      navigate("/");
    } else {
      setError("Please enter the full OTP."); // Set error message if OTP is incomplete
    }
  };

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
              {t("signup.modal_messages.signup_complete")} <br /> {t("signup.modal_messages.signup_message")}
            </p>
            {/* <form className={Styles.otpForm} onSubmit={handleSubmit} autocomplete="off">
              <div className={Styles.otpInputs}>
                {otp.map((value, index) => (
                  <input
                    type="text"
                    key={index}
                    maxLength="1"
                    value={value}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className={Styles.otpInput}
                    inputMode="numeric"
                  />
                ))}
              </div>
              {error && <p className={Styles.errorMessage}>{error}</p>}
              <button type="submit" className={Styles.signUpButton}>
                Sign Up
              </button>
            </form> */}
            <center>
              <Link to="/" type="submit" className={Styles.signUpButton}>
                {t("signup.btn.back_to_login")}
              </Link>
            </center>
          </div>
        </div>
      )}
    </>
  );
}
