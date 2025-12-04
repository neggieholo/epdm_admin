import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const RegisterProject = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [loading, setLoading] = useState(false)
    
    async function handleSubmit(e) {
        e.preventDefault(); // Prevent default form submit
        setLoading(true);

        const form = e.target;
        const formData = new FormData(form);

        // Convert FormData to plain object
        const plainData = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`${apiUrl}/new-project`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(plainData), // ✅ properly send as JSON
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.success);
                form.reset();
            } else {
                toast.error(data.error || "An error occurred");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Submission failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='px-2' style={{
            width: '50%', height: '90%', minWidth: '350px', overflowY: 'auto',
            backgroundColor: '#778ca9', borderRadius: '10px', color: '#f2f7ffff'
        }}>
            <h1 className="mb-4 text-center p-2 color-background">Project Entry Form</h1>
            <div  className='px-4' style={{ maxHeight: '80%'}}>
                <form id="projectRegForm" onSubmit={handleSubmit}>
                    <div id='form_div' style={{ overflowY: 'auto' ,maxHeight:"70vh"}}>
                        <div className="mb-3">
                            <label htmlFor="project-id" className="form-label">Project ID</label>
                            <input type="number" className="form-control" id="projectId" name="projectId" placeholder="Enter Project ID" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="project-name" className="form-label">Project Name</label>
                            <input type="text" className="form-control" id="projectName" name="projectName" placeholder="Enter Project Name" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="location" className="form-label">Location</label>
                            <input type="text" className="form-control" id="location" name="location" placeholder="Enter Location" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="capacity" className="form-label">Capacity</label>
                            <div className="input-group">
                                <input type="text" className="form-control" id="capacity" name="capacity" placeholder="Enter Capacity (eg: 110,000 b/d oil field development)" />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="client" className="form-label">Client</label>
                            <input type="text" className="form-control" id="client" name="client" placeholder="Enter Client" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="client-home-county" className="form-label">Client Home Country</label>
                            <input type="text" className="form-control" id="clientHomeCounty" name="clientHomeCounty" placeholder="Enter Client Home County" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="project-partners-stakeholders" className="form-label">Project Partners/Stakeholders</label>
                            <input type="text" className="form-control" id="projectPartnersStakeholders" name="projectPartnersStakeholders" placeholder="Enter Project Partners/Stakeholders" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="main-contractor" className="form-label">Main Contractor</label>
                            <input type="text" className="form-control" id="mainContractor" name="mainContractor" placeholder="Enter Main Contractor" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="estimated-budget" className="form-label">Estimated Budget</label>
                            <input type="text" className="form-control" id="estimated-budget" name="estimated-budget" placeholder="eg:$150m" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="contract-value" className="form-label">Contract Value</label>
                            <input type="text" className="form-control" id="contract-value" name="contract-value" placeholder="eg: $140m" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="local-spending" className="form-label">Local Spend</label>
                            <input type="text" className="form-control" id="local-spending" name="local-spending" placeholder="eg: $100m" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="foreign-spending" className="form-label">Foreign Spend</label>
                            <input type="text" className="form-control" id="foreign-spending" name="foreign-spending" placeholder="eg: $40m" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="project-scope" className="form-label">Project Scope</label>
                            <input type="text" className="form-control" id="project-scope" name="project-scope" placeholder="Enter Project Scope" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="award-date" className="form-label">Award Date</label>
                            <input type="date" className="form-control" id="award-date" name="award-date" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="project-start-up-date" className="form-label">Project Start-up Date</label>
                            <input type="date" className="form-control" id="project-start-up-date" name="project-start-up-date" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="project-completion-date" className="form-label">Project Completion Date</label>
                            <input type="date" className="form-control" id="project-completion-date" name="project-completion-date" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="project-status" className="form-label">Project Status</label>
                            <input type="text" className="form-control" id="project-status" name="project-status" placeholder="eg: FEED Completed,Detailed Engineering is 75% completion" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="project-schedule" className="form-label">Project Schedule</label>
                            <input type="text" className="form-control" id="project-schedule" name="project-schedule" placeholder="Enter Project Schedule" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="local-content-plans" className="form-label">Local Content Plans</label>
                            <input type="text" className="form-control form-control-sm" id="local-content-plans" name="local-content-plans" placeholder="Enter Local Content Plans" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="milestones" className="form-label">Major Milestones in the History of Project Development with Dates</label>
                            <input type="text" className="form-control" id="milestones" name="milestones" placeholder="Enter Major Milestone with date e.g 1990:ProjectStartup" />
                        </div>
                        <button type="button" id="add-milestone-btn" className="btn btn-primary mb-3" style={{ display: "none" }}>Add Milestone</button>
                        <div className="mb-3">
                            <label htmlFor="project-overview" className="form-label">Project Overview</label>
                            <input type="text" className="form-control" id="project-overview" name="project-overview" placeholder="Enter Project Overview" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor='classification' className="form-label">Classification</label>
                            <input type="text" className="form-control" id="classification" name="classification" placeholder="eg: Oil or Gas Project" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor='projectFinance' className="form-label">Project Finance</label>
                            <input type="text" className="form-control" id="projectFinance" name="projectFinance" placeholder="Enter Project Finance" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor='business_opportunities' className="form-label">Business Opportunities</label>
                            <input type="text" className="form-control" id="business_opportunities" name="business_opportunities" placeholder="Enter Business Opportunities" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor='project_size' className="form-label">Project Size</label>
                            <select
                                className="form-control"
                                id="project_size"
                                name="project_size"
                                defaultValue=""
                            >
                                <option value="" disabled>Select Project Size</option>
                                <option value="whole project">Whole Project</option>
                                <option value="package">Package</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor='sub-contractors' className="form-label">Sub-Contractors</label>
                            <input type="text" className="form-control" id="sub-contractors" name="sub-contractors" placeholder="Enter Sub-Contractor(s).Separate with comma" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Section</label>
                            <input type="text" className="form-control" id="section" name="section" placeholder="Enter project sectione e.g upstream or midstream" />
                        </div>

                        <h3 className="mt-5">Client Personnel</h3>
                        <div className="mb-3">
                            <label htmlFor="project-manager-name-client" className="form-label">Project Manager Name (Client)</label>
                            <input type="text" className="form-control" id="project-manager-name-client" name="project-manager-name-client" placeholder="Enter Project Manager Name (Client)" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="project-manager-telephone-client" className="form-label">Project Manager Telephone (Client)</label>
                            <input type="tel" className="form-control" id="project-manager-telephone-client" name="project-manager-telephone-client" placeholder="Enter Project Manager Telephone (Client)" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="project-manager-email-client" className="form-label">Project Manager Email (Client)</label>
                            <input type="email" className="form-control" id="project-manager-email-client" name="project-manager-email-client" placeholder="Enter Project Manager Email (Client)" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="project-coordinator-name-client" className="form-label">Project Coordinator Name (Client)</label>
                            <input type="text" className="form-control" id="project-coordinator-name-client" name="project-coordinator-name-client" placeholder="Enter Project Coordinator Name (Client)" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="project-coordinator-telephone-client" className="form-label">Project Coordinator Telephone (Client)</label>
                            <input type="tel" className="form-control" id="project-coordinator-telephone-client" name="project-coordinator-telephone-client" placeholder="Enter Project Coordinator Telephone (Client)" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="project-coordinator-email-client" className="form-label">Project Coordinator Email (Client)</label>
                            <input type="email" className="form-control" id="project-coordinator-email-client" name="project-coordinator-email-client" placeholder="Enter Project Coordinator Email (Client)" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="project-procurement-manager-name-client" className="form-label">Project Procurement Manager Name (Client)</label>
                            <input type="text" className="form-control" id="project-procurement-manager-name-client" name="project-procurement-manager-name-client" placeholder="Enter Project Procurement Manager Name (Client)" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="project-procurement-manager-telephone-client" className="form-label">Project Procurement Manager Telephone (Client)</label>
                            <input type="tel" className="form-control" id="project-procurement-manager-telephone-client" name="project-procurement-manager-telephone-client" placeholder="Enter Project Procurement Manager Telephone (Client)" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="project-procurement-manager-email-client" className="form-label">Project Procurement Manager Email (Client)</label>
                            <input type="email" className="form-control" id="project-procurement-manager-email-client" name="project-procurement-manager-email-client" placeholder="Enter Project Procurement Manager Email (Client)" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="project_local_content_manager_client" className="form-label">Project Local Content Manager (Client)</label>
                            <input type="text" className="form-control" id="project_local_content_manager_client" name="project_local_content_manager_client" placeholder="Enter Local Content Manager Info" />
                        </div>

                        <h3 className="mt-5">Main Contractor Personnel</h3>
                        <div className="mb-3">
                            <label htmlFor="project-manager-name-main-contractor" className="form-label">Project Manager Name (Main Contractor)</label>
                            <input type="text" className="form-control" id="project-manager-name-main-contractor" name="project-manager-name-main-contractor" placeholder="Enter Project Manager Name (Main Contractor)" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="project-manager-telephone-main-contractor" className="form-label">Project Manager Telephone (Main Contractor)</label>
                            <input type="tel" className="form-control" id="project-manager-telephone-main-contractor" name="project-manager-telephone-main-contractor" placeholder="Enter Project Manager Telephone (Main Contractor)" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="project-manager-email-main-contractor" className="form-label">Project Manager Email (Main Contractor)</label>
                            <input type="email" className="form-control" id="project-manager-email-main-contractor" name="project-manager-email-main-contractor" placeholder="Enter Project Manager Email (Main Contractor)" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="project-coordinator-name-main-contractor" className="form-label">Project Coordinator Name (Main Contractor)</label>
                            <input type="text" className="form-control" id="project-coordinator-name-main-contractor" name="project-coordinator-name-main-contractor" placeholder="Enter Project Coordinator Name (Main Contractor)" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="project-coordinator-telephone-main-contractor" className="form-label">Project Coordinator Telephone (Main Contractor)</label>
                            <input type="tel" className="form-control" id="project-coordinator-telephone-main-contractor" name="project-coordinator-telephone-main-contractor" placeholder="Enter Project Coordinator Telephone (Main Contractor)" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="project-coordinator-email-main-contractor" className="form-label">Project Coordinator Email (Main Contractor)</label>
                            <input type="email" className="form-control" id="project-coordinator-email-main-contractor" name="project-coordinator-email-main-contractor" placeholder="Enter Project Coordinator Email (Main Contractor)" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="project-procurement-manager-name-main-contractor" className="form-label">Project Procurement Manager Name (Main Contractor)</label>
                            <input type="text" className="form-control" id="project-procurement-manager-name-main-contractor" name="project-procurement-manager-name-main-contractor" placeholder="Enter Project Procurement Manager Name (Main Contractor)" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="project-procurement-manager-telephone-main-contractor" className="form-label">Project Procurement Manager Telephone (Main Contractor)</label>
                            <input type="tel" className="form-control" id="project-procurement-manager-telephone-main-contractor" name="project-procurement-manager-telephone-main-contractor" placeholder="Enter Project Procurement Manager Telephone (Main Contractor)" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="project-procurement-manager-email-main-contractor" className="form-label">Project Procurement Manager Email (Main Contractor)</label>
                            <input type="email" className="form-control" id="project-procurement-manager-email-main-contractor" name="project-procurement-manager-email-main-contractor" placeholder="Enter Project Procurement Manager Email (Main Contractor)" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="project_local_content_manager_contractor" className="form-label">Project Local Content Manager (Main Contractor)</label>
                            <input type="text" className="form-control" id="project_local_content_manager_contractor" name="project_local_content_manager_contractor" placeholder="Enter Local Content Manager Info" />
                        </div>
                    </div>
                    <div style={{maxHeight:'150px'}}>
                        <p id="projectSaveStatus"></p>
                        <button type="submit" id="projectRegSubmit" className="btn m-2" style={{ backgroundColor: '#293b53', color: '#f2f7ffff', width: '80px' }}>
                            {loading ?
                                (<div className="spinner-border spinner-border-sm" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>) : 'Submit'}
                        </button>
                        <button type="button" id="projectRegCancel" className="btn btn-danger m-2" style={{ width: '80px' }}>
                            <Link to="/admin/adminDashboard" style={{ textDecoration: 'none', color: '#293b53' }}>Cancel</Link>
                        </button>
                    </div>                    
                </form>
            </div>          
        </div>

    )
}

export default RegisterProject