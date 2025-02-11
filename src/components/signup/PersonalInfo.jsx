import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Styles from "./PersonalInfo.module.css";
import { useTranslation } from "react-i18next";

export default function PersonalInfo({
  formData,
  setFormData,
  months,
  years,
  onNext,
  onPrevious,
}) {
  const { t } = useTranslation();
  const language = localStorage.getItem("language");
  const [days, setDays] = useState([]);

  const schema = yup.object().shape({
    day: yup.string().required(`${t("signup.validation.dayRequired")}`),
    month: yup.string().required(`${t("signup.validation.monthRequired")}`),
    year: yup.string().required(`${t("signup.validation.yearRequired")}`),
    sex: yup.string().required(`${t("signup.validation.sexRequired")}`),
    phone: yup
      .string()
      .required(`${t("signup.validation.phoneRequired")}`)
      .matches(/^[0-9]+$/, `${t("signup.validation.phoneDigitsOnly")}`)
      .min(7, `${t("signup.validation.phoneMinLength")}`)
      .max(15, `${t("signup.validation.phoneMaxLength")}`),
    documentType: yup
      .string()
      .required(`${t("signup.validation.documentTypeRequired")}`),
    documentNumber: yup
      .string()
      .required(`${t("signup.validation.documentNumberRequired")}`),
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: formData,
  });

  const onSubmit = (data) => {
    setFormData(data); // Update the form data
    onNext(); // Move to the next step
  };

  useEffect(() => {
    const day = watch("day");
    const month = watch("month");
    const year = watch("year");

    // Helper function to calculate the number of days in a month
    const getDaysInMonth = (month, year) => {
      return new Date(year, month, 0).getDate();
    };

    // If month or year changes, recalculate the days for that month
    if (month && year) {
      const numberOfDays = getDaysInMonth(Number(month), Number(year));
      const daysArray = Array.from({ length: numberOfDays }, (_, i) => i + 1);
      setDays(daysArray);
    }

    // If selected day is greater than available days, reset day
    if (day && day > days.length) {
      setFormData((prev) => ({ ...prev, day: "" }));
    }
  }, [watch("month"), watch("year"), days.length, setFormData]);

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
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className={Styles.row}>
          <div className={Styles.input_group}>
            <label htmlFor="day">
              {t("signup.form_labels.birth_day")}{" "}
              {errors.day && (
                <label className={errors.day ? Styles.error_label : ""}>
                  *
                </label>
              )}
            </label>
            <select
              id="day"
              name="day"
              {...register("day")}
              className={errors.day ? Styles.error_input : ""}
            >
              <option value="" className={Styles.option}>
                {t("signup.form_labels.birth_day")}
              </option>
              {days.map((day) => (
                <option key={day} value={String(day).padStart(2, "0")}>
                  {day}
                </option>
              ))}
            </select>
            {errors.day && (
              <p className={Styles.error_message}>{errors.day.message}</p>
            )}
          </div>
          <div className={Styles.input_group}>
            <label htmlFor="month">
              {t("signup.form_labels.birth_month")}{" "}
              {errors.month && (
                <label className={errors.month ? Styles.error_label : ""}>
                  *
                </label>
              )}
            </label>
            <select
              id="month"
              name="month"
              {...register("month")}
              className={errors.month ? Styles.error_input : ""}
            >
              <option value="" className={Styles.option}>
                {t("signup.form_labels.birth_month")}
              </option>
              {months.map((month, index) => (
                <option key={index} value={String(index + 1).padStart(2, "0")}>
                  {month}
                </option>
              ))}
            </select>
            {errors.month && (
              <p className={Styles.error_message}>{errors.month.message}</p>
            )}
          </div>
          <div className={Styles.input_group}>
            <label htmlFor="year">
              {t("signup.form_labels.birth_year")}{" "}
              {errors.year && (
                <label className={errors.year ? Styles.error_label : ""}>
                  *
                </label>
              )}
            </label>
            <select
              id="year"
              name="year"
              {...register("year")}
              className={errors.year ? Styles.error_input : ""}
            >
              <option value="" className={Styles.option}>
                {t("signup.form_labels.birth_year")}
              </option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {errors.year && (
              <p className={Styles.error_message}>{errors.year.message}</p>
            )}
          </div>
        </div>
        <div className={Styles.row}>
          <div className={Styles.input_group2}>
            <label htmlFor="sex">
              {t("signup.form_labels.sex")}{" "}
              {errors.profession && (
                <label className={errors.sex ? Styles.error_label : ""}>
                  *
                </label>
              )}
            </label>
            <select
              id="sex"
              name="sex"
              {...register("sex")}
              className={errors.sex ? Styles.error_input : ""}
            >
              <option value=""></option>
              <option value="M">{t("signup.form_placeholders.male")}</option>
              <option value="F">{t("signup.form_placeholders.female")}</option>
              <option value="O">{t("signup.form_placeholders.other")}</option>
            </select>
            {errors.sex && (
              <p className={Styles.error_message}>{errors.sex.message}</p>
            )}
          </div>
          <div className={Styles.input_group2}>
            <label htmlFor="phone">
              {t("signup.form_labels.phone")}{" "}
              {errors.phone && (
                <label className={errors.phone ? Styles.error_label : ""}>
                  *
                </label>
              )}
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              {...register("phone")}
              className={errors.phone ? Styles.error_input : ""}
            />
            {errors.phone && (
              <p className={Styles.error_message}>{errors.phone.message}</p>
            )}
          </div>
        </div>

        <div className={Styles.input_group}>
          <label htmlFor="documentType">
            {t("signup.form_labels.document_type")}{" "}
            {errors.documentType && (
              <label className={errors.documentType ? Styles.error_label : ""}>
                *
              </label>
            )}
          </label>
          <select
            id="documentType"
            name="documentType"
            {...register("documentType")}
            className={errors.documentType ? Styles.error_input : ""}
          >
            <option value=""></option>
            <option value="passport">{t("signup.form_placeholders.passport")}</option>
            <option value="id">{t("signup.form_placeholders.id")}</option>
          </select>
          {errors.documentType && (
            <p className={Styles.error_message}>
              {errors.documentType.message}
            </p>
          )}
        </div>
        <div className={Styles.input_group}>
          <label htmlFor="documentNumber">
            {t("signup.form_labels.document_number")}{" "}
            {errors.documentNumber && (
              <label
                className={errors.documentNumber ? Styles.error_label : ""}
              >
                *
              </label>
            )}
          </label>
          <input
            id="documentNumber"
            htmlFor="documentNumber"
            type="text"
            {...register("documentNumber")}
            className={errors.documentNumber ? Styles.error_input : ""}
          />
          {errors.documentNumber && (
            <p className={Styles.error_message}>
              {errors.documentNumber.message}
            </p>
          )}
        </div>
        <div className={Styles.btn_container}>
          <button onClick={onPrevious} className={Styles.previous_btn}>
            {t("signup.btn.previous")}
          </button>
          <button type="submit" className={Styles.next_btn}>
            {t("signup.btn.next")}
          </button>
        </div>
      </form>
    </div>
  );
}
