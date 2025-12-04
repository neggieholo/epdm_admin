import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import localforage from "localforage";
import { toast } from "react-toastify";

const EditServices = () => {
    const [heading, setHeading] = useState("");
    const [serverData, setServerData] = useState({ heading: "", items: [] });
    const [items, setItems] = useState([{ text: "" }]);
    const [loading, setLoading] = useState(false);
    const [docLoading, setDocLoading] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setDocLoading(true);
            try {
                const draft = await localforage.getItem("servicesContent");

                if (draft) {
                    setHeading(draft.heading || "");
                    setItems(draft.items || [{ text: "" }]);
                } else {
                    const res = await fetch(`${apiUrl}/aboutUS_services/services`, {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                    });

                    const data = await res.json();
                    if (data) {
                        const h = data.heading || "";
                        const i = data.items || [{ text: "" }];
                        setHeading(h);
                        setItems(i);
                        setServerData({ heading: h, items: i }); // ✅ store original server doc
                    }
                }
            } catch (err) {
                console.error("Failed to load services:", err);
            } finally {
                setDocLoading(false);
                setLoaded(true); // ✅ mark load complete
            }
        };

        loadData();
    }, [apiUrl]);

    // ✅ Only save after data has been loaded once
    useEffect(() => {
        if (!loaded) return;

        const hasContent =
            heading.trim() !== "" || items.some((item) => item.text.trim() !== "");

        if (hasContent) {
            localforage.setItem("servicesContent", { heading, items });
        } else {
            localforage.removeItem("servicesContent");
        }
    }, [heading, items, loaded]);


    const handleAddItem = () => {
        setItems([...items, { text: "" }]);
    };

    const handleItemChange = (index, value) => {
        const updated = [...items];
        updated[index].text = value;
        setItems(updated);
    };

    const handleRemoveItem = (index) => {
        const updated = items.filter((_, i) => i !== index);
        setItems(updated);
    };

    const handlePreview = () => {
        navigate("/admin/preview", { state: { type: "services" } });
    };

    const handleCancel = async () => {
        if (serverData.heading || (serverData.items && serverData.items.length > 0)) {
            setHeading(serverData.heading);
            setItems(serverData.items);
        } else {
            setHeading("");
            setItems([{ text: "" }]);
        }
        await localforage.removeItem("servicesContent"); // clear draft
    };


    const handleSave = async () => {
        if (!heading.trim()) {
            toast.error("Heading is required before saving!");
            return;
        }

        // remove empty items
        const cleanedItems = items.filter(item => item.text.trim() !== "");
        setLoading(true);

        try {
            const response = await fetch(`${apiUrl}/aboutUS_services/services`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // keep session cookie
                body: JSON.stringify({ heading, items: cleanedItems }),
            });

            if (!response.ok) {
                throw new Error("Failed to save services");
            }

            const data = await response.json();

            if (data.success) {
                const saved = { heading, items: cleanedItems };
                await localforage.setItem("servicesContent", saved);
                setServerData(saved); // ✅ update server baseline
                toast.success("Services saved successfully!");
            } else {
                toast.error(data.error)
            }
        } catch (err) {
            console.error("Save failed:", err);
            toast.error("Failed to save services.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="container mt-3" style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div className="card">
                <div
                    className="card-header color-background"
                    style={{ color: "#f2f7ffff" }}
                >
                    <h1 className="text-center">Edit Services</h1>
                </div>
                <div
                    className="card-body color-background"
                    style={{ color: "#f2f7ffff" }}
                >
                    {/* Heading input */}
                    <div className="mb-3">
                        <label className="form-label">Heading</label>
                        <input
                            type="text"
                            className="form-control"
                            value={heading}
                            disabled={docLoading}
                            onChange={(e) => setHeading(e.target.value)}
                        />
                    </div>

                    {/* List items */}
                    <div className="mb-3">
                        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                            {items.length > 0 && <label className="form-label">Services List</label>}
                            {items.map((item, idx) => (
                                <div key={idx} className="d-flex align-items-center mb-2" style={{ gap: "8px" }}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={item.text}
                                        disabled={docLoading}
                                        onChange={(e) => handleItemChange(idx, e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm"
                                        disabled={docLoading}
                                        onClick={() => handleRemoveItem(idx)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>                        
                        <button className="btn btn-light mt-2" onClick={handleAddItem} disabled={docLoading}>
                            + Add Item
                        </button>
                    </div>

                    {/* Buttons */}
                    <div className="d-flex gap-2">
                        <button
                            className="btn"
                            style={{ backgroundColor: "#293b53", color: "#f2f7ffff" }}
                            onClick={handleSave}
                        >
                            {loading ?
                                (<div className="spinner-border spinner-border-sm" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>) : 'Save'}
                        </button>
                        <button
                            className="btn"
                            style={{ backgroundColor: "#293b53", color: "#f2f7ffff" }}
                            onClick={() => { navigate("/admin/edit_info"); localforage.removeItem("servicesContent"); }}
                        >
                            Back
                        </button>
                        <button className="btn btn-danger" onClick={handleCancel}>
                            Cancel
                        </button>
                        <button
                            className="btn"
                            onClick={handlePreview}
                            style={{ backgroundColor: "#293b53", color: "#f2f7ffff" }}
                        >
                            Preview
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditServices;
