import { useState, useEffect, useContext } from "react";
import * as yup from "yup";
import Styles from "./InfoBox.module.css";
import AuthContext from "../../context/AuthProvider";
import { updateProfessional } from "../../services/ProfessionalService";
import { createOffice, updateOffice } from "../../services/OfficeService";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function InfoBox({
  isEditable,
  isCancel,
  isConfirm,
  dataName,
  dataLastname,
  dataEmail,
  dataPhone,
  dataBirthdate,
  dataSex,
  dataDocument,
  dataDocumentType,
  dataExequatur,
  dataImage,
  dataOfficeID,
  dataOfficeName,
  dataCity,
  dataSector,
  dataAddress,
  onErrorsChange,
  onUpdateSuccess,
}) {
  const { sessionToken, role } = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const [hasErrors, setHasErrors] = useState(false);
  const { t } = useTranslation();

  const validationSchema = yup.object().shape({
    firstName: yup.string().required(t("validation.firstName")),
    lastName: yup.string().required(t("validation.lastName")),
    email: yup
      .string()
      .email(t("validation.email"))
      .required(t("validation.reqEmail")),
    phoneNumber: yup
      .string()
      .matches(/^\(\d{3}\) - \d{3} - \d{4}$/, t("validation.phoneNum"))
      .required(t("validation.reqPhone")),
    birthdate: yup
      .string()
      .matches(
        /^\d{4}-\d{2}-\d{2}$/,
        t("validation.birthdateFormat") // Add a proper validation message
      )
      .required(t("validation.birthdate")),
    sex: yup.string().required(t("validation.sex")),
    officeName: yup.string().required(t("validation.officeName")),
    city: yup.string().required(t("validation.city")),
    sector: yup.string().required(t("validation.sector")),
    address: yup.string().required(t("validation.address")),
    documentId: yup.string().required(t("validation.documentID")),
  });

  const initialValues = {
    firstName: dataName || "",
    lastName: dataLastname || "",
    email: dataEmail || "",
    phoneNumber: formatPhoneNumber(dataPhone) || "",
    birthdate: formatDate(dataBirthdate) || "",
    sex: dataSex || "",
    officeName: dataOfficeName || "",
    city: dataCity || "",
    sector: dataSector || "",
    address: dataAddress || "",
    documentId: dataDocument || "",
  };

  const [formData, setFormData] = useState(initialValues);

  useEffect(() => {
    setFormData({
      firstName: dataName || "",
      lastName: dataLastname || "",
      email: dataEmail || "",
      phoneNumber: formatPhoneNumber(dataPhone) || "",
      birthdate: formatDate(dataBirthdate) || "",
      sex: dataSex || "",
      officeID: dataOfficeID || "",
      officeName: dataOfficeName || "",
      city: dataCity || "",
      sector: dataSector || "",
      address: dataAddress || "",
      documentId: dataDocument || "",
    });
  }, [
    dataName,
    dataLastname,
    dataEmail,
    dataPhone,
    dataBirthdate,
    dataSex,
    dataDocument,
    dataOfficeID,
    dataOfficeName,
    dataCity,
    dataSector,
    dataAddress,
  ]);

  function formatInputPhoneNumber(value) {
    // Remove all non-digit characters
    const phoneDigits = value.replace(/\D/g, "").slice(0, 10); // Allow up to 10 digits only
    const areaCode = phoneDigits.slice(0, 3);
    const middle = phoneDigits.slice(3, 6);
    const last = phoneDigits.slice(6, 10);

    if (phoneDigits.length <= 3) {
      return `(${areaCode}`;
    } else if (phoneDigits.length <= 6) {
      return `(${areaCode}) - ${middle}`;
    } else {
      return `(${areaCode}) - ${middle} - ${last}`;
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date)) return ""; // Invalid date check
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function formatPhoneNumber(phone) {
    if (!phone || phone.toString().length !== 10)
      return t("validation.invalidPhone");
    const phoneStr = phone.toString();
    return `(${phoneStr.slice(0, 3)}) - ${phoneStr.slice(
      3,
      6
    )} - ${phoneStr.slice(6)}`;
  }

  function revertPhoneNumber(formattedPhone) {
    if (!formattedPhone) return t("validation.invalidPhone");
    return formattedPhone.replace(/\D/g, ""); // Removes all non-digit characters
  }

  const handleChange = async (field, value) => {
    let updatedValue = value;

    // Format the phone number on input
    if (field === "phoneNumber") {
      updatedValue = formatInputPhoneNumber(value);
    }
    if (field === "birthdate") {
      // Remove non-digit characters
      const digitsOnly = value.replace(/\D/g, "");

      // Format as yyyy-mm-dd step by step
      if (digitsOnly.length <= 4) {
        updatedValue = digitsOnly; // yyyy
      } else if (digitsOnly.length <= 6) {
        updatedValue = `${digitsOnly.slice(0, 4)}-${digitsOnly.slice(4)}`; // yyyy-mm
      } else {
        updatedValue = `${digitsOnly.slice(0, 4)}-${digitsOnly.slice(
          4,
          6
        )}-${digitsOnly.slice(6, 8)}`; // yyyy-mm-dd
      }
    }

    setFormData((prev) => ({ ...prev, [field]: updatedValue }));

    // Validate the field that was changed
    try {
      await validationSchema.validateAt(field, { ...formData, [field]: value });
      setErrors((prev) => ({ ...prev, [field]: undefined })); // Clear the specific error if valid
      setHasErrors(false);
    } catch (error) {
      setHasErrors(true);
      setErrors((prev) => ({
        ...prev,
        [field]: error.message, // Set error message for the changed field
      }));
    }
  };

  const validateForm = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      setHasErrors(false);
      return true;
    } catch (error) {
      const validationErrors = {};
      error.inner.forEach((err) => {
        validationErrors[err.path] = err.message;
      });
      setErrors(validationErrors);
      setHasErrors(true);
      return false;
    }
  };

  const registerOffice = async () => {
    if (!formData.officeName) return;
    try {
      await createOffice(
        sessionToken,
        formData.officeName,
        formData.city,
        formData.sector,
        formData.address
      );
      toast.success(t("validation.regOffice"));
    } catch (error) {
      toast.error(`${error.message}`);
    }
  };

  const updateData = async () => {
    if (!(await validateForm())) return;

    try {
      await updateProfessional(
        sessionToken,
        formData.firstName,
        formData.lastName,
        formData.birthdate,
        revertPhoneNumber(formData.phoneNumber),
        dataDocumentType,
        dataDocument,
        dataExequatur,
        formData.sex,
        dataImage
      );
      await updateOffice(
        sessionToken,
        formData.officeID,
        formData.officeName,
        formData.city,
        formData.sector,
        formData.address
      );
      onUpdateSuccess(formData);
      toast.success(t("profile.profileUpdate"));
    } catch (error) {
      toast.error(`${error.message}`);
    }
  };

  useEffect(() => {
    if (isConfirm) {
      validateForm().then((isValid) => {
        if (isValid) {
          if (dataOfficeID === undefined) {
            registerOffice();
            onErrorsChange(false);
          } else {
            updateData();
            onErrorsChange(false); // No errors, allow editing to close
          }
        } else {
          onErrorsChange(true); // Keep in edit mode if errors
        }
      });
    }
    if (isCancel) {
      setErrors({});
      setFormData(initialValues);
      onErrorsChange(false);
    }
  }, [isConfirm, isCancel]);

  useEffect(() => {
    // Trigger onErrorsChange when hasErrors state changes
    onErrorsChange(hasErrors);
  }, [hasErrors, onErrorsChange]);

  return (
    <>
      <div className={Styles.box}>
        <h1 className={Styles.title}>{t("HTML.userInfo")}</h1>
        <form>
          <div className={Styles.column}>
            <div className={Styles.row}>
              <div className={Styles.group}>
                <label htmlFor="firstName">
                  {t("HTML.firstName")}{" "}
                  {errors.firstName && (
                    <label className={Styles.error_label}>*</label>
                  )}
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  readOnly={!isEditable}
                  value={formData.firstName}
                  autoComplete="off"
                  className={
                    isEditable ? Styles.editableInput : Styles.readOnlyInput
                  }
                  onChange={(e) => handleChange("firstName", e.target.value)}
                />
                {errors.firstName && (
                  <p className={Styles.error_message}>{errors.firstName}</p>
                )}
              </div>
              <div className={Styles.group}>
                <label htmlFor="lastName">
                  {t("HTML.lastName")}{" "}
                  {errors.lastName && (
                    <label className={Styles.error_label}>*</label>
                  )}
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  readOnly={!isEditable}
                  value={formData.lastName}
                  autoComplete="off"
                  className={
                    isEditable ? Styles.editableInput : Styles.readOnlyInput
                  }
                  onChange={(e) => handleChange("lastName", e.target.value)}
                ></input>
                {errors.lastName && (
                  <p className={Styles.error_message}>{errors.lastName}</p>
                )}
              </div>
            </div>
            <div className={Styles.row}>
              <div className={Styles.group}>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  readOnly
                  value={formData.email}
                  autoComplete="off"
                  className={Styles.readOnlyInput}
                ></input>
              </div>
              <div className={Styles.group}>
                <label htmlFor="phone">
                  {t("HTML.phoneNum")}{" "}
                  {errors.phoneNumber && (
                    <label className={Styles.error_label}>*</label>
                  )}
                </label>
                <input
                  id="phone"
                  name="phone"
                  readOnly={!isEditable}
                  value={formData.phoneNumber}
                  autoComplete="off"
                  className={
                    isEditable ? Styles.editableInput : Styles.readOnlyInput
                  }
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                ></input>
                {errors.phoneNumber && (
                  <p className={Styles.error_message}>{errors.phoneNumber}</p>
                )}
              </div>
            </div>
            <div className={Styles.row}>
              <div className={Styles.group}>
                <label htmlFor="birthdate">
                  {t("HTML.birthdate")}{" "}
                  {errors.birthdate && (
                    <label className={Styles.error_label}>*</label>
                  )}
                </label>
                <input
                  id="birthdate"
                  name="birthdate"
                  readOnly={!isEditable}
                  value={formData.birthdate}
                  autoComplete="off"
                  className={
                    isEditable ? Styles.editableInput : Styles.readOnlyInput
                  }
                  onChange={(e) => handleChange("birthdate", e.target.value)}
                ></input>
                {errors.birthdate && (
                  <p className={Styles.error_message}>{errors.birthdate}</p>
                )}
              </div>
              <div className={Styles.group}>
                <label htmlFor="sex">
                  {t("HTML.sex")}{" "}
                  {errors.sex && (
                    <label className={Styles.error_label}>*</label>
                  )}
                </label>

                {/* Conditional rendering based on isEditable */}
                {isEditable ? (
                  // Render select dropdown when not editable
                  <select
                    id="sex"
                    name="sex"
                    disabled={!isEditable} // This will disable it when not editable
                    value={formData.sex} // Ensure the value is controlled
                    className={Styles.editableInput}
                    onChange={(e) => handleChange("sex", e.target.value)}
                  >
                    <option value="">{t("HTML.selectSex")}</option>
                    <option value="M">{t("HTML.male")}</option>
                    <option value="F">{t("HTML.female")}</option>
                    <option value="O">{t("HTML.other")}</option>
                  </select>
                ) : (
                  // Render input field when editable
                  <input
                    id="sex"
                    name="sex"
                    value={
                      formData.sex === "M"
                        ? t("HTML.male")
                        : formData.sex === "F"
                        ? t("HTML.female")
                        : formData.sex === "O"
                        ? t("HTML.other")
                        : ""
                    } // Map "M", "F", "O" to the corresponding string
                    className={Styles.readOnlyInput}
                    autoComplete="off"
                    readOnly // Mark as readonly when not editable
                  />
                )}

                {errors.sex && (
                  <p className={Styles.error_message}>{errors.sex}</p>
                )}
              </div>
            </div>
            <div className={Styles.group}>
              <label htmlFor="document">{t("HTML.documentID")}</label>
              <input
                id="document"
                name="document"
                readOnly
                value={formData.documentId}
                className={Styles.readOnlyInput}
                autoComplete="off"
              ></input>
            </div>
          </div>
        </form>
      </div>

      <div className={Styles.box}>
        <h1 className={Styles.title}>{t("HTML.professionalInfo")}</h1>
        <form>
          <div className={Styles.column}>
            <div className={Styles.row}>
              <div className={Styles.group}>
                <label htmlFor="profession">{t("HTML.profession")}</label>
                <input
                  id="profession"
                  name="profession"
                  readOnly
                  value={role}
                  className={Styles.readOnlyInput}
                  autoComplete="off"
                ></input>
              </div>
              <div className={Styles.group}>
                <label htmlFor="officeName">
                  {t("HTML.officeName")}{" "}
                  {errors.officeName && (
                    <label className={Styles.error_label}>*</label>
                  )}
                </label>
                <input
                  id="officeName"
                  name="officeName"
                  readOnly={!isEditable}
                  value={formData.officeName}
                  autoComplete="off"
                  className={
                    isEditable ? Styles.editableInput : Styles.readOnlyInput
                  }
                  onChange={(e) => handleChange("officeName", e.target.value)}
                ></input>
                {errors.officeName && (
                  <p className={Styles.error_message}>{errors.officeName}</p>
                )}
              </div>
            </div>
            <div className={Styles.row}>
              <div className={Styles.group}>
                <label htmlFor="city">
                  {t("HTML.city")}{" "}
                  {errors.city && (
                    <label className={Styles.error_label}>*</label>
                  )}
                </label>
                <input
                  id="city"
                  name="city"
                  readOnly={!isEditable}
                  value={formData.city}
                  autoComplete="off"
                  className={
                    isEditable ? Styles.editableInput : Styles.readOnlyInput
                  }
                  onChange={(e) => handleChange("city", e.target.value)}
                ></input>
                {errors.city && (
                  <p className={Styles.error_message}>{errors.city}</p>
                )}
              </div>
              <div className={Styles.group}>
                <label htmlFor="sector">
                  {t("HTML.sector")}{" "}
                  {errors.sector && (
                    <label className={Styles.error_label}>*</label>
                  )}
                </label>
                <input
                  id="sector"
                  name="sector"
                  readOnly={!isEditable}
                  value={formData.sector}
                  autoComplete="off"
                  className={
                    isEditable ? Styles.editableInput : Styles.readOnlyInput
                  }
                  onChange={(e) => handleChange("sector", e.target.value)}
                ></input>
                {errors.sector && (
                  <p className={Styles.error_message}>{errors.sector}</p>
                )}
              </div>
            </div>
            <div className={Styles.group2}>
              <label htmlFor="address">
                {t("HTML.address")}{" "}
                {errors.address && (
                  <label className={Styles.error_label}>*</label>
                )}
              </label>
              <input
                id="address"
                name="address"
                readOnly={!isEditable}
                value={formData.address}
                autoComplete="off"
                className={
                  isEditable ? Styles.editableInput : Styles.readOnlyInput
                }
                onChange={(e) => handleChange("address", e.target.value)}
              ></input>
              {errors.address && (
                <p className={Styles.error_message}>{errors.address}</p>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
