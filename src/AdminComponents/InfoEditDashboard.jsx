import React from 'react'
import { useNavigate } from 'react-router-dom'

const InfoEditDashboard = () => {
    const navigate = useNavigate();

    return (
        <div
            className="p-3"
            style={{
                width: '60%',
                minWidth: '500px',
                backgroundColor: '#778ca9',
                borderRadius: '10px',
                color: '#f2f7ffff'
            }}
        >
            <h2 className="mb-4 text-center">Edit Company Information</h2>

            <div className="container">
                <div className="row g-3">
                    <div className="col-md-6">
                        <button className="btn color-background-light w-100 py-3 fw-bold shadow" onClick={() => navigate("/admin/edit_aboutUs")}>
                            About Us
                        </button>
                    </div>
                    <div className="col-md-6">
                        <button className="btn color-background-light w-100 py-3 fw-bold shadow" onClick={() => navigate("/admin/edit_services")}>
                            Our Services
                        </button>
                    </div>
                    <div className="col-md-6">
                        <button className="btn color-background-light w-100 py-3 fw-bold shadow" onClick={() => navigate("/admin/edit_ourTeam")}>
                            Our Team
                        </button>
                    </div>
                    <div className="col-md-6">
                        <button className="btn color-background-light w-100 py-3 fw-bold shadow" onClick={() => navigate("/admin/edit_partners")}>
                            Our Partners
                        </button>
                    </div>
                    <div className="col-md-6">
                        <button className="btn color-background-light w-100 py-3 fw-bold shadow" onClick={() => navigate("/admin/set_interviews")}>
                            Project Interview
                        </button>
                    </div>
                    <div className="col-md-6">
                        <button className="btn color-background-light w-100 py-3 fw-bold shadow" onClick={() => navigate("/admin/set_news")}>
                            News
                        </button>
                    </div>
                    <div className="col-md-6">
                        <button className="btn color-background-light w-100 py-3 fw-bold shadow" onClick={() => navigate("/admin/edit_socials")}>
                            Social Links/Payment Amount
                        </button>
                    </div>
                    <div className="col-md-6">
                        <button className="btn color-background-light w-100 py-3 fw-bold shadow" onClick={() => navigate("/admin/edit_contact")}>
                            Contact Us
                        </button>
                    </div>
                    <div className="col-md-6">
                        <button className="btn color-background-light w-100 py-3 fw-bold shadow" onClick={() => navigate("/admin/edit_terms")}>
                            Ts and Cs
                        </button>
                    </div>
                    <div className="col-md-6">
                        <button className="btn color-background-light w-100 py-3 fw-bold shadow" onClick={() => navigate("/admin/set_newsLinks")}>
                            News Links
                        </button>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-12">
                        <button
                            className="btn py-2 fw-bold shadow"
                            onClick={() => navigate("/admin/adminDashboard")}
                            style={{ width: '100px', backgroundColor: '#293b53', color: '#f2f7ffff' }}
                        >
                            ← Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InfoEditDashboard
