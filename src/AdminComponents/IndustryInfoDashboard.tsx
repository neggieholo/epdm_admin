import React from 'react'
import { useNavigate } from 'react-router-dom'

const IndustryInfoDashboard = () => {
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
            <h2 className="mb-4 text-center">Edit Industry Information</h2>

            <div className="container">
                <div className="row g-3">
                    <div className="col-md-6">
                        <button className="btn color-background-dark text-white w-100 py-3 fw-bold shadow" onClick={() => navigate("/admin/set_interviews")}>
                            Project Interview
                        </button>
                    </div>
                    <div className="col-md-6">
                        <button className="btn color-background-dark text-white w-100 py-3 fw-bold shadow" onClick={() => navigate("/admin/edit_industryData")}>
                            Energy Data
                        </button>
                    </div>
                    <div className="col-md-6">
                        <button className="btn color-background-dark text-white w-100 py-3 fw-bold shadow"
                         onClick={() =>
                            navigate("/admin/edit_industryInfo", {
                                state: {
                                    urlEndpoint: "localcontent",
                                    name: "Local Contents",
                                    dataName: "localcontents",
                                },
                            })
                        }>
                            Local Content
                        </button>
                    </div>
                    <div className="col-md-6">
                        <button className="btn color-background-dark text-white w-100 py-3 fw-bold shadow" 
                        onClick={() =>
                            navigate("/admin/edit_industryInfo", {
                                state: {
                                    urlEndpoint: "industryreports",
                                    name: "Industry Reports",
                                    dataName: "industryreports",
                                },
                            })
                        }>
                            Industry Reports
                        </button>
                    </div>
                    <div className="col-md-6">
                        <button className="btn color-background-dark text-white w-100 py-3 fw-bold shadow" 
                        onClick={() =>
                            navigate("/admin/edit_industryInfo", {
                                state: {
                                    urlEndpoint: "industryawards",
                                    name: "Industry Awards",
                                    dataName: "industryawards",
                                },
                            })}>
                            Industry Awards
                        </button>
                    </div>
                    <div className="col-md-6">
                        <button className="btn color-background-dark text-white w-100 py-3 fw-bold shadow" 
                        onClick={() =>
                            navigate("/admin/edit_industryInfo", {
                                state: {
                                    urlEndpoint: "industrychallenge",
                                    name: "Industry Challenges",
                                    dataName: "industrychallenges",
                                },
                            })
                        }>
                            Energy Challenge
                        </button>
                    </div>                    
                    <div className="col-md-6">
                        <button className="btn color-background-dark text-white w-100 py-3 fw-bold shadow" onClick={() => navigate("/admin/set_newsLinks")}>
                            News Links
                        </button>
                    </div>                    
                <div className="row mt-4">
                    <div className="col-12">
                        <button
                            className="btn py-2 fw-bold shadow color-background-light"
                            onClick={() => navigate("/admin/edit_info")}
                            style={{ width: '100px'}}
                        >
                            ← Back
                        </button>
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}

export default IndustryInfoDashboard
