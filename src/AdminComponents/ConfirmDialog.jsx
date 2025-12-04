import React from "react";

const ConfirmDialog = ({ message, onConfirm, onCancel, isLoading }) => {
    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{ backgroundColor: "rgba(242, 247, 255,0.6)", zIndex: 9999, width: '350px' }}>
            <div className="p-4 color-background text-white rounded" style={{ minWidth: "300px" }}>
                <h5>⚠️ Confirmation</h5>
                <p>{message}</p>
                <div className="d-flex justify-content-end gap-2">
                    <button className="btn" onClick={onCancel} style={{ backgroundColor: '#293b53', color: '#f2f7ffff' }}>Cancel</button>
                    <button className="btn btn-danger" disabled={isLoading} onClick={onConfirm} style={{ width: '120px' }}>
                        {isLoading ?
                            (<div className="spinner-border spinner-border-sm" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>) : 'Yes, Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
