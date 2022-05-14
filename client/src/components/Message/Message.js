import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import './Message.css'

export default function Message(props) {
    
    let type = props.type;
    let onClose = props.onClose;
    const [showAlert, setShowAlert] = useState(props.showAlert);
    const [message, setMessage] = useState(props.message);

    useEffect(() => {
        setShowAlert(props.showAlert);
        setMessage(props.message);
    }, [props.message, props.showAlert])

    const handleCloseAlert = () => {
        setShowAlert(false);
        onClose();
    }

    return (
        <div className="Message">
            <Modal
                show={showAlert}
                onHide={handleCloseAlert}
                size="sm"
                aria-labelledby="example-modal-sizes-title-sm"
                className="message-modal"
            >
                <Modal.Body className="message-body">
                    <h4 className="message-title">{type === "success" ? <i className="far fa-grin"></i> : "שגיאה"}</h4>
                    <p>{message}</p>
                </Modal.Body>
            </Modal>
        </div>
    )
}
