import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { useState } from "react";

function App() {
  const [activeModal, setActiveModal] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleModalOpen = (modalName) => {
    setActiveModal(modalName);
    setModalIsOpen(true);
  };

  const handleModalClose = () => {
    setActiveModal("");
    setModalIsOpen(false);
  };

  const handleLogin = () => {};
  const handleRegister = () => {};

  return (
    <>
      <Header handleSignInModalOpen={() => handleModalOpen("sign-in")} />
      <Main />
      <Footer />
      <LoginModal
        title="Sign in"
        name="sign-in"
        activeModal={activeModal}
        modalIsOpen={modalIsOpen}
        handleModalClose={handleModalClose}
        buttonText={"Sign in"}
        switchBtnHandler={() => handleModalOpen("sign-up")}
        switchBtnText="Sign up"
        handleLogin={handleLogin}
      />
      <RegisterModal
        title="Sign up"
        name="sign-up"
        activeModal={activeModal}
        modalIsOpen={modalIsOpen}
        handleModalClose={handleModalClose}
        buttonText={"Sign up"}
        switchBtnHandler={() => handleModalOpen("sign-in")}
        switchBtnText="Sign in"
        handleRegister={handleRegister}
      />
    </>
  );
}

export default App;
