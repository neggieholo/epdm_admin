import { useLocation, useNavigate } from "react-router-dom";

const EditPreviewNews = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedPreview } = location.state || {};

    if (!selectedPreview) {
        return <p>No news data available.</p>;
    }

    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{
                height: "80vh",
                padding: "20px",
            }}
        >
            <div
                style={{
                    width: "60%",
                    minWidth: "300px",
                    backgroundColor: "#778ca9",
                    borderRadius: "8px",
                    padding: "20px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    maxHeight: "100%",
                }}
            >
                <h5>Preview News</h5>
                <div className="text-dark bg-light p-2" style={{ overflowY: "auto", borderRadius: "8px" }}>
                    <h2 className="mb-3 text-center" style={{
                        fontWeight: "600",
                    }}>{selectedPreview.heading}</h2>

                    {selectedPreview.sections?.map((section) => {
                        if (section.type === "image") {
                            return (
                                <div key={section._id} style={{ textAlign: "center" }}>
                                    <figure key={section._id} style={{ textAlign: "center", marginBottom: "15px" }}>
                                        <img
                                            src={section.content}
                                            alt={section.caption || ""}
                                            style={{
                                                maxWidth: "100%",
                                                margin: "10px 0",
                                                borderRadius: "8px",
                                            }}
                                        />
                                        {section.caption && section.caption.trim() !== "" && (
                                            <figcaption
                                                className="text-start ms-4"
                                                style={{
                                                    marginTop: "5px",
                                                    fontStyle: "italic",
                                                    fontSize: "0.9rem",
                                                    color: "#555",
                                                }}
                                            >
                                                {section.caption}
                                            </figcaption>
                                        )}
                                    </figure>
                                    
                                </div>
                            );
                        }
                        if (section.type === "video") {
                            return (
                                <div key={section._id} style={{ textAlign: "center", marginBottom: "15px" }}>
                                    <video
                                        src={section.content}
                                        controls
                                        controlsList="nodownload"
                                        style={{ maxWidth: "100%", borderRadius: "8px" }}
                                    />
                                    {section.caption && section.caption.trim() !== "" && (
                                        <figcaption
                                            className="text-start ms-4"
                                            style={{
                                                marginTop: "5px",
                                                fontStyle: "italic",
                                                fontSize: "0.9rem",
                                                color: "#555",
                                            }}
                                        >
                                            {section.caption}
                                        </figcaption>
                                    )}
                                </div>
                            );
                        }

                        if (section.type === "paragraph") {
                            return (
                                <div
                                    key={section._id}
                                    style={{
                                        marginBottom: "15px",
                                        lineHeight: "1.6",
                                    }}
                                    dangerouslySetInnerHTML={{ __html: section.content }}
                                />
                            );
                        }
                        return null;
                    })}
                </div>

                <div className="mt-3 d-flex justify-content-center">
                    <button
                        className="btn color-background-dark text-light"
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditPreviewNews;
