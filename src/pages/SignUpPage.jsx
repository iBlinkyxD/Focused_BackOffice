import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Styles from "./SignUpPage.module.css";
import StepNav from "../components/signup/StepNav";
import BasicInfo from "../components/signup/BasicInfo";
import PersonalInfo from "../components/signup/PersonalInfo";
import ProfessionalInfo from "../components/signup/ProfessionalInfo";
import LocationInfo from "../components/signup/LocationInfo";
import { signUp } from "../services/AuthService";
import { toast } from "react-toastify";
import ModalOTP from "../components/signup/ModalOTP";
import { useTranslation } from "react-i18next";

export default function SignUpPage() {
  useEffect(() => {
    // Add class to body when the component is mounted
    document.body.classList.add(Styles.signup_background);

    // Remove class from body when the component is unmounted
    return () => {
      document.body.classList.remove(Styles.signup_background);
    };
  }, []);

  const [step, setStep] = useState(1);
  const [modal, setModal] = useState(false); // Modal visibility state
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    day: "",
    month: "",
    year: "",
    sex: "",
    phone: "",
    documentType: "",
    documentNumber: "",
    exequatur: "",
    profession: "",
  });

  const handleNext = () => setStep(step + 1);
  const handlePrevious = () => setStep(step - 1);

  const currentYear = new Date().getFullYear();
  const daysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const days = Array.from(
    { length: daysInMonth(formData.month, formData.year || currentYear) },
    (_, i) => i + 1
  );

  const months = t("signup.months", { returnObjects: true });

  const years = Array.from({ length: 120 }, (_, i) => currentYear - i); // last 120 years

  useEffect(() => {
    // Reset day if it's greater than available days in the selected month
    if (formData.day > days.length) {
      setFormData({ ...formData, day: "" });
    }
  }, [formData.month, formData.year]);

  const capitalizeEachWord = (string) => {
    return string
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const toggleModal = () => {
    setModal(!modal); // Toggle modal visibility
  };

  const handleSubmit = async (updatedFormData) => {

    const birthdate = `${updatedFormData.year}-${updatedFormData.month}-${updatedFormData.day}`;

    const {
      firstName,
      lastName, 
      email,
      password,
      profession,
      phone,
      documentType,
      documentNumber,
      exequatur,
      sex,
    } = updatedFormData;

    const capitalizedFirstName = capitalizeEachWord(firstName);
    const capitalizedLastName = capitalizeEachWord(lastName);

    try {
      await signUp(
        capitalizedFirstName,
        email,
        password,
        profession,
        capitalizedLastName,
        birthdate,
        phone,
        documentType,
        documentNumber,
        exequatur,
        sex
      );
      toast.success(t("signup.messages.user_registered"));
      toggleModal();
    }catch (error){
      toast.error(`${error.message}`);
    }
  };

  return (
    <div className={Styles.signup_container}>
      <div className={Styles.signup_left}>
        <center>
          <div className={Styles.resp_logo} />
        </center>
        <StepNav step={step} />
        {step === 1 && (
          <BasicInfo
            onNext={handleNext}
            formData={formData}
            setFormData={setFormData}
          />
        )}
        {step === 2 && (
          <PersonalInfo
            formData={formData}
            setFormData={setFormData}
            days={days}
            months={months}
            years={years}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}
        {step === 3 && (
          <ProfessionalInfo
            formData={formData}
            setFormData={setFormData}
            onPrevious={handlePrevious}
            handleSubmit={handleSubmit}
          />
        )}
        <ModalOTP modal={modal} toggleModal={toggleModal} />
        {/* {step === 4 && (
          <LocationInfo
            formData={formData}
            setFormData={setFormData}
            onPrevious={handlePrevious}
            handleSubmit={handleSubmit}  // Pass handleSubmit to LocationInfo
          />
        )} */}
        <div className={Styles.login}>
        <p>
            {t("signup.messages.already_have_account")} <br />
            <Link to="/">{t("signup.messages.login_here")}</Link>
          </p>
        </div>
      </div>
      <div className={Styles.signup_right}>
        <img
          src="\assets\images\Focused-Logo.png"
          alt={t("signup.alt_text.logo")}
          className={Styles.logo}
        />
      </div>
    </div>
  );
}
