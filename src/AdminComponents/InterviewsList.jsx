import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from './ConfirmDialog';
import { toast } from "react-toastify";


const InterviewsList = () => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const res = await fetch(`${apiUrl}/project_interview`);
                if (!res.ok) throw new Error("Failed to fetch interviews");
                const data = await res.json();
                // console.log("Fetched interviews:", data);

                // ✅ use data.interviews (not data directly)
                setInterviews(Array.isArray(data.interviews) ? data.interviews : []);
            } catch (err) {
                console.error("Error fetching interviews:", err);
                setError("Failed to load interviews");
            } finally {
                setLoading(false);
            }
        };

        fetchInterviews();
    }, [apiUrl]);

    const handlePreview = (id) => {
        const selectedInterview = interviews.find((n) => n._id === id);

        if (selectedInterview) {
            navigate("/admin/edit_preview_news", {
                state: { selectedPreview: selectedInterview }
            });
        }
    };

    const handleDelete = async (id) => {
        setDeleting(true);
        try {
            const res = await fetch(`${apiUrl}/project_interview/delete/${id}`, {
                method: "DELETE",
                credentials: "include", // if using session auth
            });

            const data = await res.json();

            if (!res.ok || data.error) {
                throw new Error(data.error || "Failed to delete news");
            }

            // If deletion was successful
            setInterviews((prev) => prev.filter((n) => n._id !== id));
            toast.success("Interview deleted successfully");

        } catch (err) {
            console.error("Error deleting interview:", err);
            toast.error(err.message || "Failed to delete interview");
        } finally {
            setShowConfirmDialog(false);
            setDeleteId(null);
            setDeleting(false);
        }
    };


    return (
        <>
            <div className="container mt-4 color-background" style={{ maxHeight: '70vh', overflowY: 'auto', borderRadius: '10px' }}>
                <h1 className="text-center">All Interviews</h1>
                <hr style={{ borderColor: "#f2f7ffff" }} />
                <div className="mt-3 p-3" style={{ overflowY: 'auto', height: '50vh' }}>
                    {interviews.length > 0 ? (
                        interviews.map((n) => {
                            const imageSection = n.sections?.find((section) => section.type === "image");

                            return (
                                <div key={n._id} className="card mb-3 p-3 shadow-sm">
                                    <div className="d-flex align-items-center mb-2">
                                        {imageSection ? (
                                            <img
                                                src={imageSection.content}
                                                alt={imageSection.caption || ""}
                                                style={{
                                                    width: "100px",
                                                    height: "70px",
                                                    objectFit: "cover",
                                                    marginRight: "12px",
                                                    borderRadius: "6px",
                                                }}
                                            />
                                        ) : (
                                            <div
                                                style={{
                                                    width: "100px",
                                                    height: "70px",
                                                    background: "#e9ecef",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    marginRight: "12px",
                                                    borderRadius: "6px",
                                                    color: "#666",
                                                    fontSize: "14px",
                                                }}
                                            >
                                                No Image
                                            </div>
                                        )}

                                        <h5 className="mb-0">{n.heading}</h5>
                                    </div>

                                    <div className="d-flex gap-2 mb-2">
                                        <button
                                            className="btn btn-sm btn-secondary text-light color-background-dark"
                                            onClick={() => handlePreview(n._id)}
                                        >
                                            Preview
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => {
                                                setDeleteId(n._id);
                                                setShowConfirmDialog(true);
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-light">No interviews available</p>
                    )}
                </div>
                <div className="text-light" style={{ height: '50px', width: '100%' }}>{loading ? 'Loading interviews...' : error ? error : ''}</div>
                <div>
                    <button className="btn text-light color-background-dark m-2" onClick={() => navigate('/admin/set_interviews')}>
                        Back
                    </button>
                </div>
            </div>
            {showConfirmDialog && (
                <ConfirmDialog
                    message="Are you sure you want to delete this interview item?"
                    onConfirm={() => handleDelete(deleteId)}
                    onCancel={() => setShowConfirmDialog(false)}
                    isLoading={deleting}
                />
            )}
        </>
    );
};

export default InterviewsList;
