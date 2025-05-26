import { useState } from "react";

export function useModal() {
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

  return { activeModal, modalIsOpen, handleModalOpen, handleModalClose };
}
