import { useEffect } from "react";
import "./IntegrationModal.css";

export default function IntegrationModal({ isOpen, companyCode, onClose }) {
  useEffect(() => {
    if (!isOpen) return;

    // Automatically trigger close after 3 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getCompanyDescription = () => {
    if (companyCode === "1000") {
      return {
        name: "Pitti Engineering Ltd",
        text: "The ERP data pipelines for Pitti Engineering Ltd (company code 1000) are currently being configured. Standalone statements will be available once the integration is complete."
      };
    } else {
      return {
        name: "Pitti Industries pvt Ltd",
        text: "The ERP data pipelines for Pitti Industries pvt Ltd (company code 4000) are currently being configured. Standalone statements will be available once the integration is complete."
      };
    }
  };

  const info = getCompanyDescription();

  return (
    <div className="integration-overlay" onClick={onClose}>
      <div className="integration-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="integration-modal__title">Integration in Progress</h2>
        <p className="integration-modal__text">{info.text}</p>
        <button className="integration-modal__btn" type="button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
