import React, { useState, useEffect, useRef, useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  IconHome,
  IconCalendarMonth,
  IconUser,
  IconLogout,
  IconMenu2,
} from "@tabler/icons-react";
import Styles from "./Navbar.module.css";
import AuthContext from "../context/AuthProvider";
import i18n from "i18next";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const { logOut } = useContext(AuthContext);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null); // Ref for detecting clicks outside
  const location = useLocation(); // Get the current location
  const { t } = useTranslation();
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en"
  );

  useEffect(() => {
    i18n.changeLanguage(language); // Update i18n language
  }, [language]);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    // Add event listener to detect clicks outside
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Cleanup event listener on component unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to close dropdown on navigation
  const handleNavLinkClick = () => {
    setDropdownVisible(false);
  };

  const handleNavLinkClick2 = () => {
    logOut();
    setDropdownVisible(false);
  };

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "es" : "en";
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage); // Save preference locally
  };

  return (
    <nav className={Styles.navbar}>
      <div className={Styles.container}>
        <div className={Styles.nav_content}>
          <input
            type="checkbox"
            id="sidebar_active"
            className={Styles.sidebar_active}
          />
          <label htmlFor="sidebar_active" className={Styles.open_sidebar}>
            <IconMenu2 stroke={3} />
          </label>

          <label
            id="overlay"
            htmlFor="sidebar_active"
            className={Styles.overlay}
          ></label>
          <div className={Styles.nav_left}>
            <NavLink className={Styles.logo_link} to="/home">
              <img
                className={Styles.logo}
                src="/assets/images/Focused-Logo.png"
                alt="Focused"
              />
            </NavLink>
            <div className={Styles.nav_links}>
              <div className={Styles.nav_items}>
                <div>
                  <NavLink className={Styles.sidebarlogo} to="/home">
                    <img
                      className={Styles.logo}
                      src="/assets/images/Focused-Logo.png"
                      alt="Focused"
                    />
                  </NavLink>
                </div>
                <NavLink
                  to="/home"
                  className={
                    location.pathname === "/home"
                      ? Styles.active_link // Apply inactive style when on profile page
                      : Styles.link
                  }
                >
                  <IconHome /> {t("navbar.home")}
                </NavLink>
                <NavLink
                  to="/home/calendar"
                  className={
                    location.pathname === "/home/calendar"
                      ? Styles.active_link // Apply inactive style when on profile page
                      : Styles.link
                  }
                >
                  <IconCalendarMonth /> {t("navbar.calendar")}
                </NavLink>
                <NavLink
                  to="/home/patient"
                  className={
                    location.pathname === "/home/patient"
                      ? Styles.active_link // Apply inactive style when on profile page
                      : Styles.link
                  }
                >
                  <IconUser /> {t("navbar.patient")}
                </NavLink>
                <NavLink to="/" className={Styles.sidebar_logout}>
                  <IconLogout /> {t("navbar.logout")}
                </NavLink>
              </div>
            </div>
          </div>
          {/* Profile Picture and Dropdown */}
          <div className={Styles.nav_right}>
            <div className={Styles.profile_container} onClick={toggleDropdown}>
              <img
                className={Styles.profile_pic}
                src="/assets/images/default-pfp.png" // Change to your profile image path
                alt="Profile"
              />
            </div>
            {/* Dropdown Menu */}
            {dropdownVisible && (
              <div className={Styles.dropdown} ref={dropdownRef}>
                <NavLink
                  to="/home/profile"
                  className={Styles.dropdown_item}
                  onClick={handleNavLinkClick} // Close dropdown on navigation
                >
                  {t("navbar.profile")}
                </NavLink>
                {/* Language Toggle Button */}
                <button
                  onClick={toggleLanguage}
                  className={Styles.language_btn}
                >
                  {language === "en" ? "Switch to Spanish" : "Cambiar a Inglés"}
                </button>
                <NavLink
                  to="/"
                  className={Styles.dropdown_item2}
                  onClick={handleNavLinkClick2} // Close dropdown on navigation
                >
                  {t("navbar.logout")} <IconLogout />
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
