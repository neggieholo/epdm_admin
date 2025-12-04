import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import localforage from 'localforage';

const EditAboutUs = () => {
    const [sections, setSections] = useState([{ heading: "", message: "" }]);
    const [serverSections, setServerSections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [docLoading, setDocLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            setDocLoading(true);
            try {
                // Try to load from localforage first
                const draft = await localforage.getItem("aboutSections");

                if (draft && Array.isArray(draft)) {
                    setSections(draft);
                } else {
                    const res = await fetch(`${apiUrl}/aboutUS_services/about`, {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include"
                    });

                    const data = await res.json();
                    if (data && data.sections) {
                        setSections(data.sections);
                        setServerSections(data.sections);
                    }
                }
            } catch (err) {
                console.error("Failed to load About Us:", err);
            } finally {
                setDocLoading(false);
                setLoaded(true);
            }
        };

        loadData();
    }, [apiUrl]);


    useEffect(() => {
        if (!loaded) return;

        const hasContent = sections.some(
            (s) => s.heading.trim() !== "" || s.message.trim() !== ""
        );

        if (hasContent) {
            localforage.setItem("aboutSections", sections);
        } else {
            localforage.removeItem("aboutSections"); // clear empty drafts
        }
    }, [sections, loaded]);

    const handleAddSection = () => {
        setSections([...sections, { heading: "", message: "" }]);
    };

    const handleChange = (index, field, value) => {
        const updated = [...sections];
        updated[index][field] = value;
        setSections(updated);
    };

    const handleRemoveSection = (index) => {
        const updated = sections.filter((_, i) => i !== index);
        setSections(updated);
    };

    const handleSave = async () => {
        if (sections.some(s => !s.message)) {
            toast.error("All sections must have a message");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${apiUrl}/aboutUS_services/about`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ sections })
            });

            const data = await res.json();
            if (data.success) {
                await localforage.setItem("aboutSections", sections);
                setServerSections(sections);
                toast.success("About Us updated");
            } else {
                toast.error(data.error || "Failed to update");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        if (serverSections.length > 0) {
            setSections(serverSections); // restore last saved server doc
            await localforage.setItem("aboutSections", serverSections); // keep baseline in localforage
        } else {
            const empty = [{ heading: "", message: "" }];
            setSections(empty);
            await localforage.setItem("aboutSections", empty);
        }
    };



    const handleBack = () => {
        navigate("/admin/edit_info");
        localforage.removeItem("aboutSections");
    };

    const handlePreview = () => {
        navigate("/admin/preview", { state: { type: "about" } });
    };

    return (
        <div className='px-2' style={{
            width: '50%',
            minWidth: '400px',
            backgroundColor: '#778ca9',
            borderRadius: '10px',
            color: '#f2f7ffff'
        }}>
            <h1 className="mb-4 text-center p-2 color-background">Edit About Us</h1>

            <div className="px-4 mb-3" >
                <div style={{
                    overflowY: 'auto',
                    maxHeight: '600px'
                }}>
                    {sections.map((section, index) => (
                        <div key={index} className="mb-4 border p-3 rounded position-relative">
                            {/* Heading Row with Remove button (only for extra sections) */}
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <label className="mb-0"><strong>Heading</strong></label>
                                {index > 0 && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleRemoveSection(index)}
                                    >
                                        ×
                                    </button>
                                )}
                            </div>

                            <input
                                type="text"
                                className="form-control mb-2"
                                value={section.heading}
                                onChange={(e) => handleChange(index, "heading", e.target.value)}
                                disabled={docLoading}
                                placeholder="Enter heading (e.g. History, Mission)"
                            />

                            <label><strong>Message</strong></label>
                            <textarea
                                className="form-control"
                                rows="4"
                                value={section.message}
                                onChange={(e) => handleChange(index, "message", e.target.value)}
                                disabled={docLoading}
                                placeholder="Enter section message"
                            />
                        </div>
                    ))}
                </div>                
                <button className="btn btn-light mt-2" onClick={handleAddSection} disabled={docLoading}>
                    + Add Section
                </button>
            </div>

            <div className='px-4 mb-4 d-flex gap-3'>
                <button className='btn' onClick={handleSave} disabled={loading}
                    style={{ backgroundColor: '#293b53', color: '#f2f7ffff', width: '120px' }}>
                    {loading ?
                        (<div className="spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>) : 'Save'}
                </button>
                <button className='btn btn-danger' onClick={handleCancel} style={{ color: '#293b53', width: '120px' }}>
                    Cancel
                </button>
                <button className="btn ms-2" onClick={handleBack} style={{ backgroundColor: '#293b53', color: '#f2f7ffff', width: '120px' }}>
                    Back
                </button>
                <button className="btn btn-secondary" onClick={handlePreview} style={{ width: '120px', backgroundColor: '#293b53', color: '#f2f7ffff' }}>
                    Preview
                </button>
            </div>
        </div>
    );
};

export default EditAboutUs;
