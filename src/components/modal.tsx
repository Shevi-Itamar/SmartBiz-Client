// Modal.tsx
type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
  };
  
  export default function Modal({ isOpen, onClose, children }: ModalProps) {
    if (!isOpen) return null;
  
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close-button" onClick={onClose}>
            ×
          </button>
          {children}
        </div>
      </div>
    );
  }
  