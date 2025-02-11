import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Styles from "./LoginPage.module.css";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import AuthContext from "../context/AuthProvider";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const { signIn, role } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    // Add class to body when the component is mounted
    document.body.classList.add(Styles.login_background);

    // Remove class from body when the component is unmounted
    return () => {
      document.body.classList.remove(Styles.login_background);
    };
  }, []);

  // useEffect(() => {
  //   if (role) {
  //     console.log(role);
  //     if (role === "Psychologist" || role === "Psychiatrist") {
  //       console.log("home");
  //       navigate("/home");
  //     } else if (role === "Administrator") {
  //       console.log("admin");
  //       navigate("/admin");
  //     } else {
  //       console.log("base");
  //       navigate("/");
  //     }
  //   }
  // }, [role, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    navigate("/home");
    // setError(""); // Reset error message before login attempt

    // try {
    //   await signIn(email, password);
    // } catch (error) {
    //   console.log(error.message);
    //   if (error.message === "Request failed with status code 404") {
    //     setError(`${t("login.error_invalid_credentials")}`);
    //   } else if (error.message === "Request failed with status code 401") {
    //     setError(`${t("login.error_account_not_verified")}`);
    //   } else if (error.message === "Access denied: Role not allowed.") {
    //     setError(`${t("login.error_access_denied")}`);
    //   } else if (error.message === "Request failed with status code 403") {
    //     setError(`${t("login.error_inactive")}`);
    //   } else {
    //     setError(`${t("login.error_generic")}`);
    //   }
    // }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className={Styles.login_page_container}>
      <div className={Styles.login_container}>
        {/* Login Form */}
        <div className={Styles.login_left}>
          <center>
            <div className={Styles.resp_logo} />
          </center>
          <h1>
            {t("login.hey")} <br /> {t("login.welcome")}
          </h1>
          <form className={Styles.form_container} onSubmit={handleLogin}>
            {error && (
              <div className={Styles.error_container}>
                <p className={Styles.error_message}>{error}</p>
              </div>
            )}{" "}
            {/* Error message display */}
            <div className={Styles.input_group}>
              <label htmlFor="email">{t("login.email_label")}</label>
              <input
                id="email"
                name="email"
                autoComplete="on"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={Styles.input_group}>
              <label htmlFor="password">{t("login.password_label")}</label>
              <div className={Styles.password_container}>
                <input
                  id="password"
                  name="password"
                  autoComplete="off"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  onClick={togglePasswordVisibility}
                  role="button"
                  aria-label="Toggle password visibility"
                  className={Styles.toggle_icon}
                >
                  {showPassword ? (
                    <IconEyeOff size={16} />
                  ) : (
                    <IconEye size={16} />
                  )}
                </span>
              </div>
              <Link to="/recover">{t("login.forgot_password")}</Link>
            </div>
            <button type="submit" className={Styles.login_button}>
              {t("login.login_button")}
            </button>
          </form>
          <div className={Styles.sign_up}>
            <p>
              {t("login.signup_prompt")} <br />
              <Link to="/signup">{t("login.signup_link")}</Link>
            </p>
            <p>
              {t("login.verify_prompt")} <br />
              <Link to="/verify">{t("login.verify_link")}</Link>
            </p>
          </div>
        </div>

        {/* Login Big Logo */}
        <div className={Styles.login_right}>
          <img
            src="\assets\images\Focused-Logo.png"
            alt="Focused Logo"
            className={Styles.logo}
          />
        </div>
      </div>
    </div>
  );
}
