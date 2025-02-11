import React, { useContext } from "react";
import Styles from "./UserEdit.module.css";
import { IconX } from "@tabler/icons-react";
import { deactivateUser, activateUser } from "../../services/UserService";
import { unlinkProfessional } from "../../services/PatientService";
import { toast } from "react-toastify";
import AuthContext from "../../context/AuthProvider";

function UserEdit({ modal, user, toggleModal, refetchData }) {
  const { sessionToken } = useContext(AuthContext);
  const handleToggleModal = () => {
    toggleModal();
  };

  const handleDeactivate = async () => {
    try {
      await deactivateUser(sessionToken, user.id);
      refetchData();
      toggleModal();
      toast.success("User deactivated successfully!");
    } catch (error) {
      toast.error(`${error.message}`);
    }
  };

  const handleActivate = async () => {
    try {
      await activateUser(sessionToken, user.id);
      refetchData();
      toggleModal();
      toast.success("User activated successfully!");
    } catch (error) {
      toast.error(`${error.message}`);
    }
  };

  const handleUnlinkPsycologist = async () => {
    try {
      await unlinkProfessional(sessionToken, user.id, 2);
      toggleModal();
      toast.success("Professional unlinked successfully!");
    } catch (error){
      toast.error(`${error.message}`);
    }
  }

  const handleUnlinkPsychiatrist = async () => {
    try {
      await unlinkProfessional(sessionToken, user.id, 1);
      toggleModal();
      toast.success("Professional unlinked successfully!");
    } catch (error){
      toast.error(`${error.message}`);
    }
  }

  return (
    <>
      {modal && (
        <div className={Styles.modal}>
          <div className={Styles.overlay}></div>
          <div className={Styles.modal_content}>
            {user.id_rol === 1 ? (
              <>
                <div className={Styles.modal_header}>
                  {user.active ? (
                    <>
                      <h1 className={Styles.title}>Deactivate User</h1>
                      <IconX
                        className={Styles.close_icon}
                        onClick={handleToggleModal}
                        style={{ cursor: "pointer" }}
                      />
                    </>
                  ) : (
                    <>
                      <h1 className={Styles.title}>Activate User</h1>
                      <IconX
                        className={Styles.close_icon}
                        onClick={handleToggleModal}
                        style={{ cursor: "pointer" }}
                      />
                    </>
                  )}
                </div>
                <div className={Styles.row}>
                  {user.active ? (
                    <>
                      {" "}
                      <button
                        type="button"
                        className={Styles.edit_btn}
                        onClick={handleDeactivate}
                      >
                        Confirm
                      </button>
                    </>
                  ) : (
                    <>
                      {" "}
                      <button
                        type="button"
                        className={Styles.edit_btn}
                        onClick={handleActivate}
                      >
                        Confirm
                      </button>
                    </>
                  )}
                  <button type="button" className={Styles.delete_btn}>
                    Cancel
                  </button>
                </div>
                <br></br>
                <div className={Styles.modal_header}>
                  <h1 className={Styles.title}>Unlink Psychologist</h1>
                </div>
                <div className={Styles.row}>
                  <button
                    type="button"
                    className={Styles.edit_btn}
                    onClick={handleUnlinkPsycologist}
                  >
                    Confirm
                  </button>
                  <button type="button" className={Styles.delete_btn}>
                    Cancel
                  </button>
                </div>
                <br></br>
                <div className={Styles.modal_header}>
                  <h1 className={Styles.title}>Unlink Psychiatrist</h1>
                </div>
                <div className={Styles.row}>
                  <button
                    type="button"
                    className={Styles.edit_btn}
                    onClick={handleUnlinkPsychiatrist}
                  >
                    Confirm
                  </button>
                  <button type="button" className={Styles.delete_btn}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className={Styles.modal_header}>
                  {user.active ? (
                    <>
                      <h1 className={Styles.title}>Deactivate User</h1>
                      <IconX
                        className={Styles.close_icon}
                        onClick={handleToggleModal}
                        style={{ cursor: "pointer" }}
                      />
                    </>
                  ) : (
                    <>
                      <h1 className={Styles.title}>Activate User</h1>
                      <IconX
                        className={Styles.close_icon}
                        onClick={handleToggleModal}
                        style={{ cursor: "pointer" }}
                      />
                    </>
                  )}
                </div>
                <div className={Styles.row}>
                  {user.active ? (
                    <>
                      {" "}
                      <button
                        type="button"
                        className={Styles.edit_btn}
                        onClick={handleDeactivate}
                      >
                        Confirm
                      </button>
                    </>
                  ) : (
                    <>
                      {" "}
                      <button
                        type="button"
                        className={Styles.edit_btn}
                        onClick={handleActivate}
                      >
                        Confirm
                      </button>
                    </>
                  )}
                  <button type="button" className={Styles.delete_btn}>
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default UserEdit;
