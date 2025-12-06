import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const IndustryPreview = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedPreview } = location.state || {};
    let pdfSection = selectedPreview.sections?.find(s => s.type === "pdf");

    useEffect(() => {
        if (selectedPreview) {
            const pdfSection = selectedPreview.sections?.find(s => s.type === "pdf");
            console.log("Selected preview data:", pdfSection);
        }
    }, [selectedPreview]);

    if (!selectedPreview) {
        return <p>No data available.</p>;
    }

    // Find PDF section (assuming only one)
    

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
                <h5>Industry Preview</h5>
                <div className="text-dark bg-light p-2" style={{ overflowY: "auto", borderRadius: "8px" }}>
                    <h2 className="mb-3 text-center" style={{ fontWeight: "600" }}>
                        {selectedPreview.heading}
                    </h2>

                    {selectedPreview.sections?.map((section) => {
                        if (section.type === "image") {
                            return (
                                <figure key={section._id} style={{ textAlign: "center", marginBottom: "15px" }}>
                                    <img
                                        src={section.content}
                                        alt={section.caption || ""}
                                        style={{ maxWidth: "100%", margin: "10px 0", borderRadius: "8px" }}
                                    />
                                    {section.caption && (
                                        <figcaption
                                            className="text-start ms-4"
                                            style={{ marginTop: "5px", fontStyle: "italic", fontSize: "0.9rem", color: "#555" }}
                                        >
                                            {section.caption}
                                        </figcaption>
                                    )}
                                </figure>
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
                                    {section.caption && (
                                        <figcaption
                                            className="text-start ms-4"
                                            style={{ marginTop: "5px", fontStyle: "italic", fontSize: "0.9rem", color: "#555" }}
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
                                    style={{ marginBottom: "15px", lineHeight: "1.6" }}
                                    dangerouslySetInnerHTML={{ __html: section.content }}
                                />
                            );
                        }
                        return null;
                    })}

                    {/* PDF Section at the bottom */}
                    {pdfSection && (
                        <div
                            style={{
                                marginTop: "20px",
                                padding: "10px",
                                backgroundColor: "#f2f2f2",
                                borderRadius: "6px",
                                textAlign: "center",
                            }}
                        >
                            <a
                                href={pdfSection.content} 
                                className="btn btn-primary"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Get PDF
                            </a>
                        </div>
                    )}
                </div>

                <div className="mt-3 d-flex justify-content-center">
                    <button className="btn color-background-dark text-light" onClick={() => navigate(-1)}>
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IndustryPreview;
