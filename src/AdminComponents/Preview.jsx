import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import localforage from "localforage";

const PreviewPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [sections, setSections] = useState([]);
    const [services, setServices] = useState({ heading: "", items: [] });

    const type = location.state?.type || "about";

    // Load saved sections or services from localforage
    useEffect(() => {
        if (type === "about") {
            localforage.getItem("aboutSections").then((saved) => {
                if (saved && Array.isArray(saved)) {
                    setSections(saved);
                }
            });
        } else if (type === "services") {
            localforage.getItem("servicesContent").then((saved) => {
                if (saved) {
                    setServices(saved);
                }
            });
        }
    }, [type]);

    return (
        <div className="container mt-3">
            <button
                className="btn btn-dark mb-3"
                style={{ backgroundColor: '#293b53', color: '#f2f7ffff' }}
                onClick={() => navigate(-1)}
            >
                <i className="bi bi-chevron-double-left"></i> Back
            </button>

            <div className="card">
                <div
                    className="card-header"
                    style={{ backgroundColor: '#f2f7ffff', color: '#293b53' }}
                >
                    <h5>{type === "about" ? "About EPDM Energy" : "Our Services"}</h5>
                </div>
                <div
                    className="card-body color-background"
                    style={{ color: '#f2f7ffff' }}
                >
                    {type === "about" && sections?.map((sec, idx) => (
                        <div key={idx} className="mb-3">
                            {sec.heading ? <h6>{sec.heading}</h6> : null}
                            <p>{sec.message}</p>
                        </div>
                    ))}

                    {/* Services Preview */}
                    {type === "services" && (
                        <>
                            <h6>{services.heading}</h6>
                            <ul>
                                {services.items?.map((item, idx) => (
                                    <li key={idx}>{item.text}</li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PreviewPage;
