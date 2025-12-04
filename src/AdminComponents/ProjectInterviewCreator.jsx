import React, { useState } from "react";
import { toast } from "react-toastify";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useNavigate } from "react-router-dom";

// Reusable Editor component
const TiptapEditor = ({ value, onChange }) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({ link: false }), // 👈 disable default link
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

const ProjectInterviewCreator = () => {
    const [heading, setHeading] = useState("");
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const handleAddSection = (type) => {
        if (type === "image" || type === "video") {
            setSections([...sections, { type, content: "", caption: "" }]);
        } else {
            setSections([...sections, { type, content: "" }]);
        }
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

        // Validate only paragraph sections
        if (sections.some((s) => s.type === "paragraph" && (!s.content || !s.content.trim()))) {
            toast.error("All paragraph sections must have content");
            return;
        }

        // Optional: Validate media sections
        if (sections.some((s) => (s.type === "image" || s.type === "video") && !(s.content instanceof File))) {
            toast.error("All image/video sections must have a file");
            return;
        }

        setSaving(true);
        try {
            const formData = new FormData();
            formData.append("heading", heading);

            // Replace any file-type section with placeholder
            const preparedSections = sections.map((s) => {
                if (s.type === "image" || s.type === "video") {
                    if (s.content instanceof File) {
                        return { ...s, content: "__UPLOAD__" }; // keep caption
                    }
                }
                return s;
            });

            // Add sections JSON
            formData.append("sections", JSON.stringify(preparedSections));

            // Append files in order
            sections.forEach((s) => {
                if ((s.type === "image" || s.type === "video") && s.content instanceof File) {
                    formData.append("media", s.content);
                }
            });

            const res = await fetch(`${apiUrl}/project_interview/create`, {
                method: "POST",
                body: formData,
                credentials: "include"
            });

            const data = await res.json();
            if (data.success) {
                toast.success("News created successfully");
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

    return (
        <div
            className="p-4 d-flex flex-column"
            style={{
                width: "60%",
                minWidth: "400px",
                backgroundColor: "#778ca9",
                borderRadius: "10px",
                color: "#f2f7ffff",
                height: '80vh'
            }}
        >
            <h1 className="mb-4 text-center">Upload Project Interview</h1>
            <hr style={{ borderColor: "#f2f7ffff" }}/>

            {/* Compulsory Heading */}
            <div className="mb-4">
                <label>
                    <strong>Interview Heading *</strong>
                </label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter main heading"
                    value={heading}
                    onChange={(e) => setHeading(e.target.value)}
                />
            </div>

            {/* Sections */}
            <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
                {sections.map((section, index) => (
                    <div key={index} className="border p-3 rounded mb-3">
                        <div className="d-flex justify-content-between mb-2">
                            <strong>{section.type.toUpperCase()}</strong>
                            {index >= 0 && (
                                <button
                                    type="button"
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleRemoveSection(index)}
                                >
                                    ×
                                </button>
                            )}
                        </div>

                        {/* Paragraph / Heading -> Tiptap Editor */}
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
                                    onChange={(e) => handleChange(index, e.target.files[0], "content")}
                                />
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Optional caption"
                                    value={section.caption || ""}
                                    onChange={(e) => handleChange(index, e.target.value, "caption")}
                                />
                            </>
                        )}

                        {section.type === "video" && (
                            <>
                                <input
                                    type="file"
                                    accept="video/*"
                                    className="form-control mb-2"
                                    onChange={(e) => handleChange(index, e.target.files[0], "content")}
                                />
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Optional caption"
                                    value={section.caption || ""}
                                    onChange={(e) => handleChange(index, e.target.value, "caption")}
                                />
                            </>
                        )}

                    </div>
                ))}
            </div>

            {/* Add Section Buttons */}
            <div className="d-flex gap-2 mt-3">
                <button
                    className="btn btn-light"
                    onClick={() => handleAddSection("paragraph")}
                >
                    + Paragraph
                </button>
                <button
                    className="btn btn-light"
                    onClick={() => handleAddSection("image")}
                >
                    + Image
                </button>
                <button
                    className="btn btn-light"
                    onClick={() => handleAddSection("video")}
                >
                    + Video
                </button>
            </div>

            {/* Save */}
            <div className="mt-4 d-flex gap-3">
                {/* Save button */}
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
                {/* Third button (example: Reset form without navigation) */}
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


                {/* Cancel button */}
                <button
                    className="btn"
                    style={{ backgroundColor: "#293b53", color: "#fff", width: "120px" }}
                    onClick={() => {
                        setHeading("");
                        setSections([]);
                        navigate("/admin/edit_info");
                    }}
                >
                    Back
                </button>
                <button
                    className="btn"
                    style={{ backgroundColor: "#293b53", color: "#fff", width: "120px" }}
                    onClick={() => navigate("/admin/view_interviews")}
                >
                    All Interviews
                </button>
            </div>
        </div>
    );
};

export default ProjectInterviewCreator;
