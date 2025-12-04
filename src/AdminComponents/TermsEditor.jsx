import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

const TermsEditor = () => {
    const [docType, setDocType] = useState("terms");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [content, setContent] = useState("");
    const [previousContent, setPreviousContent] = useState("");
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    // Setup Tiptap editor
    const editor = useEditor({
        extensions: [StarterKit, Link],
        content: "",
        onUpdate: ({ editor }) => {
            setContent(editor.getHTML()); // keep React state in sync with editor
        },
    });

    // Fetch document when docType changes
    useEffect(() => {
        const fetchDoc = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${apiUrl}/terms_socials/legalDocs/${docType}`);
                const data = await res.json();

                if (data.success && data.doc) {
                    editor?.commands.setContent(data.doc.content);
                    setContent(data.doc.content);
                    setPreviousContent(data.doc.content);
                } else {
                    editor?.commands.setContent("");
                    setContent("");
                    setPreviousContent("");
                }
            } catch (err) {
                toast.error("Failed to load document");
            } finally {
                setLoading(false);
            }
        };

        if (editor) fetchDoc();
    }, [apiUrl, docType, editor]);

    // Save handler
    const handleSave = async () => {
        if (!editor) return;
        setSaving(true);
        try {
            const res = await fetch(`${apiUrl}/terms_socials/legalDocs/${docType}/save`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: editor.getHTML() }),
                credentials: "include",
            });
            const data = await res.json();
            if (data.success) {
                toast.success(
                    `${docType === "terms" ? "Terms & Conditions" : "Privacy & Cookies Policy"} saved successfully`
                );
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
        editor?.commands.setContent(previousContent); // 👈 restore previous
        setContent(previousContent);
    };

    return (
        <div
            className="container mt-3 color-background p-3 m-2"
            style={{ borderRadius: "10px", width: "70%", maxWidth: "900px", minWidth: "350px" }}
        >
            <h5>Manage Legal Documents</h5>

            {/* Radio toggle */}
            <div className="mb-3">
                <label className="me-3">
                    <input
                        type="radio"
                        name="docType"
                        value="terms"
                        checked={docType === "terms"}
                        onChange={(e) => setDocType(e.target.value)}
                    />{" "}
                    Terms & Conditions
                </label>
                <label>
                    <input
                        type="radio"
                        name="docType"
                        value="privacy"
                        checked={docType === "privacy"}
                        onChange={(e) => setDocType(e.target.value)}
                    />{" "}
                    Privacy & Cookies Policy
                </label>
            </div>

            {/* Editor */}
            <div className="editor-container border rounded mb-3"
                style={{
                    background: "white",
                    height: "400px",
                    overflowY: "auto",
                    padding: "10px"
                }}
            >
                {editor ? (
                    <EditorContent editor={editor} />
                ) : (
                    <small className="text-muted">Loading editor...</small>
                )}
            </div>

            {/* Status message */}
            <div style={{ height: "30px" }}>
                {loading && (
                    <small className="text-muted">
                        Loading {docType === "terms" ? "terms" : "privacy policy"}...
                    </small>
                )}
                {!loading && !content && (
                    <small className="text-muted">
                        No {docType === "terms" ? "terms" : "privacy policy"} have been set yet.
                    </small>
                )}
            </div>

            {/* Buttons */}
            <div className="d-flex gap-2">
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
                    className="btn color-background-dark text-light"
                    style={{ width: "80px" }}
                    onClick={() => navigate("/admin/edit_info")}
                >
                    Back
                </button>
                <button
                    className="btn btn-danger"
                    style={{ width: "80px" }}
                    onClick={handleCancel}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default TermsEditor;
