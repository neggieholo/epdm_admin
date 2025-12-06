import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const NewsLinksCreator = ({ onSubmit }) => {
    const [links, setLinks] = useState([{ title: "", link: "" }]);
    const [originalLinks, setOriginalLinks] = useState([{ title: "", link: "" }]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);   
    const [loading, setLoading] = useState(true);
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLinks = async () => {
            try {
                const res = await fetch(`${apiUrl}/newslinks`);
                if (!res.ok) throw new Error("Failed to fetch news");
                const data = await res.json();
                console.log("Fetched links:", data);

                const fetched = Array.isArray(data.links) ? data.links : [];

                // ✅ If API returns empty, keep the initial row
                if (fetched.length === 0) {
                    setLinks([{ title: "", link: "" }]);
                    setOriginalLinks([{ title: "", link: "" }]);
                } else {
                    const reversed = [...fetched].reverse(); // copy before reversing
                    console.log("Fetched links (reversed):", reversed);
                    setLinks(reversed);
                    setOriginalLinks(reversed);
                }

            } catch (err) {
                console.error("Error fetching news:", err);
                setError("Failed to load news");
            } finally {
                setLoading(false);
            }
        };

        fetchLinks();
    }, [apiUrl]);

    
    const handleSave = async () => {
        setSaving(true);
        try {
            setLoading(true);
            const reversedForSave = [...links].reverse();
            const res = await fetch(`${apiUrl}/newsLinks/save`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ links: reversedForSave })
            });

            if (!res.ok) throw new Error("Failed to save links");
            const data = await res.json();

            
            const reversedAgain = [...data.links].reverse();

            setLinks(reversedAgain);
            setOriginalLinks(reversedAgain);

            toast.success("Links saved successfully!");
        } catch (err) {
            console.error("Save error:", err);
            toast.error("Failed to save links");
        } finally {
            setSaving(false);
        }
    };
    
    const handleChange = (index, field, value) => {
        const updated = [...links];
        updated[index][field] = value;
        setLinks(updated);
    };

    const addLink = () => {
        setLinks([...links, { title: "", link: "" }]);
    };

    const removeLink = async (id, index) => {
        try {
            // 🔹 Optimistically update UI
            const updated = links.filter((_, i) => i !== index);
            setLinks(updated);

            // 🔹 Send delete request to backend
            const res = await fetch(`${apiUrl}/newsLinks/delete/${id}`, {
                method: "DELETE"
            });

            if (!res.ok) throw new Error("Failed to delete link");

            const data = await res.json();
            console.log("Deleted link:", data);
        } catch (err) {
            console.error("Delete error:", err);
            toast.error("❌ Failed to delete link");
        }
    };


    return (
        <div
            className="p-4 d-flex flex-column"
            style={{
                width: "50%",
                minWidth: "300px",
                backgroundColor: "#778ca9",
                borderRadius: "10px",
                color: "#f2f7ffff",
                height: '60vh'
            }}
        >
            <h1 className="mb-3 text-center">Add News Links</h1>
            <hr style={{ borderColor: "#f2f7ffff" }}/>
            <div className="d-flex flex-column align-items-center" style={{ height: "70%", overflowY: "auto", width: "100%" }}>
                {links.map((item, index) => (
                    <div
                        key={index}
                        className="d-flex align-items-center gap-2 mb-2 p-3"
                        style={{ width: '100%'}}
                    >
                        <input
                            type="text"
                            placeholder="News title"
                            value={item.title}
                            onChange={(e) => handleChange(index, "title", e.target.value)}
                            className="form-control"
                            required
                        />
                        <input
                            type="url"
                            placeholder="https://example.com"
                            value={item.link}
                            onChange={(e) => handleChange(index, "link", e.target.value)}
                            className="form-control"
                            required
                        />
                        {links.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeLink(item._id, index)}
                                className="btn btn-outline-danger"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <div className="d-flex gap-2 mt-3 px-4">
                <button type="button" onClick={addLink} className="btn color-background-light text-dark">
                    Add another link
                </button>               
            </div>
            <hr style={{ borderColor: "#f2f7ffff" }}/>
            <div className="d-flex gap-2 mt-3">
                <button type="submit" className="btn color-background-dark text-light" onClick={handleSave}>
                    {saving ? (
                        <div className="spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Saving...</span>
                        </div>
                    ) : (
                        "Save"
                    )}
                </button>
                <button type="button" className="btn btn-danger" onClick={() => setLinks(originalLinks)}>
                    Cancel
                </button>
                <button type="button" className="btn color-background-dark text-light"
                    onClick={() => navigate("/admin/industry_info_dashboard")}>
                    Back
                </button>
            </div>
        </div>
    );
};

export default NewsLinksCreator;
