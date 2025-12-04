import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from './ConfirmDialog';
import { toast } from "react-toastify";


const NewsList = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch(`${apiUrl}/news`);
                if (!res.ok) throw new Error("Failed to fetch news");
                const data = await res.json();
                // console.log("Fetched news:", data);

                // ✅ use data.news (not data directly)
                setNews(Array.isArray(data.news) ? data.news : []);
            } catch (err) {
                console.error("Error fetching news:", err);
                setError("Failed to load news");
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [apiUrl]);

    const handlePreview = (id) => {
        const selectedNews = news.find((n) => n._id === id);

        if (selectedNews) {
            navigate("/admin/edit_preview_news", {
                state: { selectedPreview: selectedNews }
            });
        }
    };

    const handleDelete = async (id) => {
        setDeleting(true);
        try {
            const res = await fetch(`${apiUrl}/news/delete/${id}`, {
                method: "DELETE",
                credentials: "include", // if using session auth
            });

            const data = await res.json(); // ✅ parse the JSON

            if (!res.ok || data.error) {
                throw new Error(data.error || "Failed to delete news");
            }

            // If deletion was successful
            setNews((prev) => prev.filter((n) => n._id !== id));
            toast.success("News deleted successfully");

        } catch (err) {
            console.error("Error deleting news:", err);
            toast.error(err.message || "Failed to delete news");
        } finally {
            setShowConfirmDialog(false);
            setDeleteId(null);
            setDeleting(false);
        }
    };


    return (
        <>

            <div className="container mt-4 color-background" style={{ maxHeight: '70vh', overflowY: 'auto', borderRadius: '10px' }}>
                <h1 className="text-center">All News</h1>
                <hr style={{ borderColor: "#f2f7ffff" }} />
                <div className="mt-3 p-3" style={{ overflowY: 'auto', height: '50vh' }}>
                    {news.length > 0 ? (
                        news.map((n) => {
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
                        <p className="text-light">No news available</p>
                    )}
                </div>
                <div className="text-light" style={{ height: '50px', width: '100%' }}>{loading ? 'Loading news...' : error ? error : ''}</div>
                <div>
                    <button className="btn text-light color-background-dark m-2" onClick={() => navigate('/admin/set_news')}>
                        Back
                    </button>
                </div>
            </div>
            {showConfirmDialog && (
                <ConfirmDialog
                    message="Are you sure you want to delete this news item?"
                    onConfirm={() => handleDelete(deleteId)}
                    onCancel={() => setShowConfirmDialog(false)}
                    isLoading={deleting}
                />
            )}
        </>
    );
};

export default NewsList;
