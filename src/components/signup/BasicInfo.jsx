import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Styles from "./BasicInfo.module.css";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

export default function BasicInfo({ onNext, formData, setFormData }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { t } = useTranslation();
  const language = localStorage.getItem("language");

  // Define the validation schema with Yup
const validationSchema = yup.object().shape({
  firstName: yup
    .string()
    .required(`${t("signup.validation.firstNameRequired")}`),
  lastName: yup.string().required(`${t("signup.validation.lastNameRequired")}`),
  email: yup
    .string()
    .email(`${t("signup.validation.emailInvalid")}`)
    .required(`${t("signup.validation.emailRequired")}`),
  password: yup
    .string()
    .min(8, `${t("signup.validation.passwordMinLength")}`)
    .matches(/[a-z]/, `${t("signup.validation.passwordLowercase")}`)
    .matches(/[A-Z]/, `${t("signup.validation.passwordUppercase")}`)
    .matches(/\d/, `${t("signup.validation.passwordNumber")}`)
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      `${t("signup.validation.passwordSpecialChar")}`
    )
    .required(`${t("signup.validation.passwordRequired")}`),
  confirmPassword: yup
    .string()
    .oneOf(
      [yup.ref("password"), null],
      `${t("signup.validation.confirmPasswordMatch")}`
    )
    .required(`${t("signup.validation.confirmPasswordRequired")}`),
});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: formData,
    resolver: yupResolver(validationSchema), // Integrating Yup with react-hook-form
    mode: "onChange",
  });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const onSubmit = (data) => {
    setFormData(data); // Update form data state
    onNext(); // Trigger the next step
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
          : t("signup.step_navigation.information")}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className={Styles.row}>
          <div className={Styles.input_group2}>
            <label htmlFor="firstname">
              {t("signup.form_labels.first_name")}{" "}
              {errors.firstName && (
                <label className={Styles.error_label}>*</label>
              )}
            </label>
            <input
              id="firstname"
              name="firstname"
              className={errors.firstName ? Styles.error_input : ""}
              type="text"
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className={Styles.error_message}>{errors.firstName.message}</p>
            )}
          </div>
          <div className={Styles.input_group2}>
            <label htmlFor="lastname">
              {t("signup.form_labels.last_name")}{" "}
              {errors.lastName && (
                <label className={errors.lastName ? Styles.error_label : ""}>
                  *
                </label>
              )}
            </label>
            <input
              id="lastname"
              name="lastname"
              className={errors.lastName ? Styles.error_input : ""}
              type="text"
              {...register("lastName")}
            />
            {errors.lastName && (
              <p className={Styles.error_message}>{errors.lastName.message}</p>
            )}
          </div>
        </div>
        <div className={Styles.input_group}>
          <label htmlFor="email">
            {t("signup.form_labels.email")}{" "}
            {errors.email && (
              <label className={errors.email ? Styles.error_label : ""}>
                *
              </label>
            )}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="off"
            className={errors.email ? Styles.error_input : ""}
            {...register("email")}
          />
          {errors.email && (
            <p className={Styles.error_message}>{errors.email.message}</p>
          )}
        </div>
        <div className={Styles.input_group}>
          <label htmlFor="password">
            {t("signup.form_labels.password")}{" "}
            {errors.password && (
              <label className={errors.password ? Styles.error_label : ""}>
                *
              </label>
            )}
          </label>
          <div className={Styles.password_container}>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              className={errors.password ? Styles.error_input : ""}
              {...register("password")}
            />
            <span
              onClick={togglePasswordVisibility}
              role="button"
              aria-label="Toggle password visibility"
              className={Styles.toggle_icon}
            >
              {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
            </span>
          </div>
          {errors.password && (
            <p className={Styles.error_message}>{errors.password.message}</p>
          )}
        </div>
        <div className={Styles.input_group}>
          <label htmlFor="confirmPassword">
            {t("signup.form_labels.confirm_password")}{" "}
            {errors.confirmPassword && (
              <label
                className={errors.confirmPassword ? Styles.error_label : ""}
              >
                *
              </label>
            )}
          </label>
          <div className={Styles.password_container}>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              className={errors.confirmPassword ? Styles.error_input : ""}
              {...register("confirmPassword")}
            />
            <span
              onClick={toggleConfirmPasswordVisibility}
              role="button"
              aria-label="Toggle confirm password visibility"
              className={Styles.toggle_icon}
            >
              {showConfirmPassword ? (
                <IconEyeOff size={16} />
              ) : (
                <IconEye size={16} />
              )}
            </span>
          </div>
          {errors.confirmPassword && (
            <p className={Styles.error_message}>
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <div className={Styles.btn_container}>
          <button type="submit" className={Styles.next_btn}>
            {t("signup.btn.next")}
          </button>
        </div>
      </form>
    </div>
  );
}
