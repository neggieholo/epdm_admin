import React, { useState } from "react";
import { toast } from "react-toastify";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

// Reusable Editor component
const TiptapEditor = ({ value, onChange }) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({ link: false }), 
            Link.configure({
                openOnClick: true,
                autolink: true,
                HTMLAttributes: {
                    rel: "noopener noreferrer",
                    target: "_blank",
                },
            }),
        ],
        content: value || "",
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    return (
        <div
            className="border rounded p-2"
            style={{ backgroundColor: "white", color: "black", minHeight: "120px" }}
        >
            {editor ? (
                <EditorContent editor={editor} />
            ) : (
                <small className="text-muted">Loading editor...</small>
            )}
        </div>
    );
};

const IndustryContentCreator = () => {
    const [heading, setHeading] = useState("");
    const [sections, setSections] = useState([]);
    const [saving, setSaving] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const location = useLocation();
    const { urlEndpoint, name, dataName } = location.state || {};

    
    const MAX_PDF_SIZE = 10 * 1024 * 1024; 

    const handleAddSection = (type) => {
        if (type === "pdf") {
        if (sections.some((s) => s.type === "pdf")) return;
    }
        if (type === "image" || type === "video" || type === "pdf") {
            setSections([...sections, { type, content: "", caption: "" }]);
        } else {
            setSections([...sections, { type, content: "" }]);
        }
    };

    const handlePdfChange = (index, file) => {
        if (file.size > MAX_PDF_SIZE) {
            toast.error("PDF cannot exceed 10 MB");
            return;
        }
        handleChange(index, file, "content");
    };

    const handleChange = (index, value, field = "content") => {
        const updated = [...sections];
        updated[index][field] = value;
        setSections(updated);
    };

    const handleRemoveSection = (index) => {
        setSections(sections.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (!heading.trim()) {
            toast.error("Heading is required");
            return;
        }

        if (sections.some((s) => s.type === "paragraph" && (!s.content || !s.content.trim()))) {
            toast.error("All paragraph sections must have content");
            return;
        }

        if (sections.some((s) => (s.type === "image" || s.type === "video") && !(s.content instanceof File))) {
            toast.error("All image/video sections must have a file");
            return;
        }

        if (sections.some((s) => s.type === "pdf" && !(s.content instanceof File))) {
            toast.error("All PDF sections must have a file");
            return;
        }

        setSaving(true);
        try {
            const formData = new FormData();
            formData.append("heading", heading);

            // Prepare sections JSON (replace file contents with placeholder)
            const preparedSections = sections.map((s) => {
                if ((s.type === "image" || s.type === "video" || s.type === "pdf") && s.content instanceof File) {
                    return { ...s, content: "__UPLOAD__" };
                }
                return s;
            });

            formData.append("sections", JSON.stringify(preparedSections));

            // Append actual files
            sections.forEach((s) => {
                if ((s.type === "image" || s.type === "video" || s.type === "pdf") && s.content instanceof File) {
                    formData.append("media", s.content);
                    console.log("Appending file:", s.content.name,"Type:", s.type);
                }
            });

            const res = await fetch(`${apiUrl}/${urlEndpoint}/create`, {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            const data = await res.json();
            if (data.success) {
                toast.success("Content created successfully");
                setHeading("");
                setSections([]);
            } else {
                toast.error(data.error || "Failed to save news");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        } finally {
            setSaving(false);
        }
    };

    if (!urlEndpoint) return <p>No endpoint provided.</p>;

    return (
        <div
            className="p-4 d-flex flex-column"
            style={{
                width: "60%",
                minWidth: "400px",
                backgroundColor: "#778ca9",
                borderRadius: "10px",
                color: "#f2f7ffff",
                height: "80vh",
            }}
        >
            <h1 className="mb-4 text-center">Upload {name}</h1>
            <hr style={{ borderColor: "#f2f7ffff" }} />

            <div className="mb-4">
                <label>
                    <strong>{name} Heading *</strong>
                </label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter main heading"
                    value={heading}
                    onChange={(e) => setHeading(e.target.value)}
                />
            </div>

            <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
                {sections.map((section, index) => (
                    <div key={index} className="border p-3 rounded mb-3">
                        <div className="d-flex justify-content-between mb-2">
                            <strong>{section.type.toUpperCase()}</strong>
                            <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={() => handleRemoveSection(index)}
                            >
                                ×
                            </button>
                        </div>

                        {section.type === "paragraph" && (
                            <TiptapEditor
                                value={section.content}
                                onChange={(val) => handleChange(index, val)}
                            />
                        )}

                        {section.type === "image" && (
                            <>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="form-control mb-2"
                                    onChange={(e) =>
                                        handleChange(index, e.target.files[0], "content")
                                    }
                                />
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Optional caption"
                                    value={section.caption || ""}
                                    onChange={(e) =>
                                        handleChange(index, e.target.value, "caption")
                                    }
                                />
                            </>
                        )}

                        {section.type === "video" && (
                            <>
                                <input
                                    type="file"
                                    accept="video/*"
                                    className="form-control mb-2"
                                    onChange={(e) =>
                                        handleChange(index, e.target.files[0], "content")
                                    }
                                />
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Optional caption"
                                    value={section.caption || ""}
                                    onChange={(e) =>
                                        handleChange(index, e.target.value, "caption")
                                    }
                                />
                            </>
                        )}

                        {section.type === "pdf" && (
                            <>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    className="form-control mb-2"
                                    onChange={(e) => handlePdfChange(index, e.target.files[0])}
                                />

                                {/* <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Optional description"
                                    value={section.caption || ""}
                                    onChange={(e) =>
                                        handleChange(index, e.target.value, "caption")
                                    }
                                /> */}
                            </>
                        )}
                    </div>
                ))}
            </div>

            <div className="d-flex gap-2 mt-3">
                <button className="btn btn-light" onClick={() => handleAddSection("paragraph")}>
                    + Paragraph
                </button>
                <button className="btn btn-light" onClick={() => handleAddSection("image")}>
                    + Image
                </button>
                <button className="btn btn-light" onClick={() => handleAddSection("video")}>
                    + Video
                </button>
                <button className="btn btn-light" onClick={() => handleAddSection("pdf")} disabled={sections.some((s) => s.type === "pdf")}>
                    + PDF
                </button>
            </div>

            <div className="mt-4 d-flex gap-3">
                <button
                    className="btn"
                    onClick={handleSave}
                    disabled={saving}
                    style={{ backgroundColor: "#293b53", color: "#fff", width: "120px" }}
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
                    style={{ width: "120px" }}
                    onClick={() => {
                        setHeading("");
                        setSections([]);
                    }}
                >
                    Cancel
                </button>

                <button
                    className="btn"
                    style={{ backgroundColor: "#293b53", color: "#fff", width: "120px" }}
                    onClick={() => {
                        setHeading("");
                        setSections([]);
                        navigate("/admin/industry_info_dashboard");
                    }}
                >
                    Back
                </button>

                <button
                    className="btn"
                    style={{ backgroundColor: "#293b53", color: "#fff", width: "120px" }}
                    onClick={() =>
                        navigate("/admin/view_industryList", {
                            state: {
                                urlEndpoint: urlEndpoint,
                                name: name,
                                dataName: dataName,
                            },
                        })
                    }
                >
                    All {name}
                </button>
            </div>
        </div>
    );
};

export default IndustryContentCreator;
