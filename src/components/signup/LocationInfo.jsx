import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Styles from "./LocationInfo.module.css";
import ModalOTP from "./ModalOTP"; // Import the Modal component

const validationSchema = Yup.object().shape({
  city: Yup.string().required("City is required"),
  sector: Yup.string().required("Sector is required"),
  address: Yup.string().required("Address Name is required"),
});

export default function LocationInfo({
  onPrevious,
  formData,
  setFormData,
  handleSubmit, // Accept handleSubmit function as a prop
}) {
  const [modal, setModal] = useState(false); // Modal visibility state
  useEffect(() => {
    if (modal) {
      // Block scrolling
      document.body.style.overflow = "hidden";
    } else {
      // Restore scrolling
      document.body.style.overflow = "auto";
    }

    // Clean-up function to reset the overflow when the component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [modal]); // Dependency array contains modal to trigger effect when it changes

  const toggleModal = () => {
    setModal(!modal); // Toggle modal visibility
  };
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      city: formData.city,
      sector: formData.sector,
      address: formData.address,
    },
  });

  const onSubmit = (data) => {
    // Update formData with the latest values
    const updatedFormData = {
      ...formData,
      city: data.city,
      sector: data.sector,
      address: data.address,
    };

    // Call setFormData and only after that call the handleSubmit
    setFormData(updatedFormData);

    // Call handleSubmit after ensuring the state is updated
    handleSubmit(updatedFormData);
    toggleModal();
  };

  return (
    <div className={Styles.form_container}>
      <h1 className={Styles.form_title}>
        Location <br /> Details
      </h1>
      <form onSubmit={handleFormSubmit(onSubmit)}>
        <div className={Styles.input_group}>
          <label>
            City{" "}
            {errors.city && (
              <label className={errors.city ? Styles.error_label : ""}>*</label>
            )}
          </label>
          <input
            type="text"
            {...register("city")}
            className={errors.city ? Styles.error_input : ""}
            defaultValue={formData.city} // Use formData default
          />
          {errors.city && (
            <p className={Styles.error_message}>{errors.city.message}</p>
          )}
        </div>
        <div className={Styles.input_group}>
          <label>
            Sector{" "}
            {errors.sector && (
              <label className={errors.sector ? Styles.error_label : ""}>
                *
              </label>
            )}
          </label>
          <input
            type="text"
            {...register("sector")}
            className={errors.sector ? Styles.error_input : ""}
            defaultValue={formData.sector} // Use formData default
          />
          {errors.sector && (
            <p className={Styles.error_message}>{errors.sector.message}</p>
          )}
        </div>
        <div className={Styles.input_group}>
          <label>
            Address{" "}
            {errors.address && (
              <label className={errors.address ? Styles.error_label : ""}>
                *
              </label>
            )}
          </label>
          <input
            type="text"
            {...register("address")}
            className={errors.address ? Styles.error_input : ""}
            defaultValue={formData.address} // Use formData default
          />
          {errors.address && (
            <p className={Styles.error_message}>{errors.address.message}</p>
          )}
        </div>
        <div className={Styles.checkbox_container}>
          <label>
            <input type="checkbox" required />
            Agree Terms & Conditions
          </label>
        </div>
        <div className={Styles.checkbox_container}>
          <label>
            <input type="checkbox" required />
            Verify all information introduced is correct.
          </label>
        </div>
        <div className={Styles.btn_container}>
          <button onClick={onPrevious} className={Styles.previous_btn}>
            Back
          </button>
          <button type="submit" className={Styles.next_btn}>
            Sign Up
          </button>
        </div>
      </form>
      <ModalOTP modal={modal} toggleModal={toggleModal} />
    </div>
  );
}
