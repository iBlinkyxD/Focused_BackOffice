import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Styles from "./ProfessionalInfo.module.css";
import { useTranslation } from "react-i18next";

export default function ProfessionalInfo({
  onPrevious,
  formData,
  setFormData,
  handleSubmit,
}) {
  const { t } = useTranslation();
  const language = localStorage.getItem("language");

  const validationSchema = Yup.object().shape({
    exequatur: Yup.string()
      .required(`${t("signup.validation.exequaturRequired")}`)
      .min(4,`${t("signup.validation.exequaturMinLength")}`)
      .max(6, `${t("signup.validation.exequaturMaxLength")}`),
    profession: Yup.string().required(`${t("signup.validation.professionRequired")}`),
  });
  
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      exequatur: formData.exequatur,
      profession: formData.profession,
    },
  });

  const onSubmit = (data) => {
    const updatedFormData = {
      ...formData,
      exequatur: data.exequatur,
      profession: data.profession,
    };

    setFormData(updatedFormData);

    handleSubmit(updatedFormData);
  };

  return (
    <div className={Styles.form_container}>
      <h1 className={Styles.form_title}>
        {language === "en"
          ? t("signup.step_navigation.step1")
          : t("signup.step_navigation.information")}{" "}
        <br />
        {language === "es"
          ? t("signup.step_navigation.step1")
          : t("signup.step_navigation.information")}{" "}
      </h1>
      <form onSubmit={handleFormSubmit(onSubmit)} autoComplete="off">
        <div className={Styles.input_group}>
          <label htmlFor="exequatur">
            {t("signup.form_labels.exequatur")}{" "}
            {errors.exequatur && (
              <label className={errors.exequatur ? Styles.error_label : ""}>
                *
              </label>
            )}
          </label>
          <input
            id="exequatur"
            name="exequatur"
            type="text"
            {...register("exequatur")}
            className={errors.exequatur ? Styles.error_input : ""}
          />
          {errors.exequatur && (
            <p className={Styles.error_message}>{errors.exequatur.message}</p>
          )}
        </div>
        <div className={Styles.input_group}>
          <label htmlFor="profession">
            {t("signup.form_labels.profession")}{" "}
            {errors.profession && (
              <label className={errors.profession ? Styles.error_label : ""}>
                *
              </label>
            )}
          </label>
          <select
            id="profession"
            name="profession"
            {...register("profession")}
            className={errors.profession ? Styles.error_input : ""}
          >
            <option value="">{t("signup.form_placeholders.select_profession")}</option>
            <option value="2">{t("signup.form_placeholders.psychologist")}</option>
            <option value="3">{t("signup.form_placeholders.psychiatrist")}</option>
          </select>
          {errors.profession && (
            <p className={Styles.error_message}>{errors.profession.message}</p>
          )}
        </div>
        <div className={Styles.checkbox_container}>
          <label htmlFor="terms">
            <input id="terms" name="terms" type="checkbox" required />
            {t("signup.form_labels.terms")}
          </label>
        </div>
        {/* <div className={Styles.checkbox_container}>
          <label>
            <input type="checkbox" required />
            Verify all information introduced is correct.
          </label>
        </div> */}
        <div className={Styles.btn_container}>
          <button onClick={onPrevious} className={Styles.previous_btn}>
            {t("signup.btn.previous")}
          </button>
          <button type="submit" className={Styles.next_btn}>
            {t("signup.btn.signup_btn")}
          </button>
        </div>
      </form>
    </div>
  );
}
