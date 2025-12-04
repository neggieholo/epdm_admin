import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ContactEditor = () => {
    const [contact, setContact] = useState({
        companyName: "",
        address: "",
        email: "",
        phones: [""],
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [originalContact, setOriginalContact] = useState(null);
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchContact = async () => {
            try {
                const res = await fetch(`${apiUrl}/terms_socials/contact`);
                const data = await res.json();
                if (data.success && data.contact) {
                    setContact(data.contact);
                    setOriginalContact(data.contact);
                }
            } catch (err) {
                toast.error("Failed to load contact info");
            } finally {
                setLoading(false);
            }
        };
        fetchContact();
    }, [apiUrl]);

    const handleChange = (field, value) => {
        setContact((prev) => ({ ...prev, [field]: value }));
    };

    const handlePhoneChange = (index, value) => {
        const newPhones = [...contact.phones];
        newPhones[index] = value;
        setContact((prev) => ({ ...prev, phones: newPhones }));
    };

    const addPhoneField = () => {
        setContact((prev) => ({ ...prev, phones: [...prev.phones, ""] }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`${apiUrl}/terms_socials/contact/save`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(contact),
                credentials: "include",
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Contact info saved successfully");
            } else {
                toast.error(data.error || "Failed to save");
            }
        } catch (err) {
            toast.error("Server error");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (originalContact) {
            setContact(originalContact);
        }
    };

    const removePhoneField = (index) => {
        const newPhones = [...contact.phones];
        newPhones.splice(index, 1);
        setContact((prev) => ({ ...prev, phones: newPhones }));
    };

    return (
        <div
            className="container mt-3 color-background p-3 m-2"
            style={{ borderRadius: "10px", width: "70%", maxWidth: "900px", minWidth: "350px" }}
        >
            <h2 className="text-center">Edit Contact Info</h2>
            <hr style={{ borderColor: "#f2f7ffff" , width: "100%" }}/>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <div className="mb-3">
                        <h5>Or you can reach us directly on</h5>
                        <label className="form-label">Company Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={contact.companyName}
                            onChange={(e) => handleChange("companyName", e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Address</label>
                        <textarea
                            className="form-control"
                            rows="3"
                            value={contact.address}
                            onChange={(e) => handleChange("address", e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={contact.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Telephone</label>
                            {contact.phones.map((phone, i) => (
                                <div key={i} className="d-flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={phone}
                                        onChange={(e) => handlePhoneChange(i, e.target.value)}
                                        placeholder="Enter phone number"
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-danger"
                                        onClick={() => removePhoneField(i)}
                                        disabled={contact.phones.length === 1} // prevent removing the last field
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        <button
                            type="button"
                                className="btn btn-sm color-background-light"
                            onClick={addPhoneField}
                        >
                            + Add another phone
                        </button>
                    </div>
                </>
            )}

            <div className="d-flex gap-2 mt-3">
                <button
                    className="btn color-background-dark text-light"
                    style={{ width: "80px" }}
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? (
                        <div className="spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Saving...</span>
                        </div>
                    ) : (
                        "Save"
                    )}
                </button>
                <button
                    className="btn btn-danger"
                    style={{ width: "80px" }}
                    onClick={handleCancel}
                >
                    Cancel
                </button>
                <button
                    className="btn color-background-dark text-light"
                    style={{ width: "80px" }}
                    onClick={() => navigate("/admin/edit_info")}
                >
                    Back
                </button>
            </div>
        </div>
    );
};

export default ContactEditor;
