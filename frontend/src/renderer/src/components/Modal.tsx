import React from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
}

function Modal({ isOpen, onClose, title, message }: ModalProps): React.JSX.Element | null {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{title}</h2>
        <p className="modal-message">{message}</p>
        <button className="modal-button" onClick={onClose}>
          확인
        </button>
      </div>
    </div>
  )
}

export default Modal

