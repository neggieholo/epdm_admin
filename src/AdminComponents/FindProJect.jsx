import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchProject } from './AdminFetchers';

const FindProJect  = () => {
    const navigate = useNavigate()
    const [projectId, setProjectId] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const foundproject = await fetchProject(projectId.toString());
            if (foundproject.project) {
                navigate("/admin/update_project", { state: { project: foundproject.project, id:foundproject.projectId } });
            } else {
                toast.error(foundproject.error || "Project not found.");
            }
        } catch (error) {
            toast.error("Something went wrong.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className='p-2' id="projectFinddiv" style={{ width: '30%', minWidth: '300px', backgroundColor: '#778ca9', borderRadius: '10px', color: '#f2f7ffff' }}>
            <h2>Find Project</h2>
            <form id="findProjectForm" onSubmit={handleSubmit}>
                <div className="container-fluid p-3">
                    <div>
                        <label htmlFor="projectFindId">Project ID</label>
                        <input
                            className="form-control"
                            type="number"
                            id="projectFindId"
                            name="projectId"
                            value={projectId}
                            placeholder="Enter Project ID"
                            onChange={(e) => { setProjectId(e.target.value) }}
                            required
                        />
                    </div>
                    <button className="mt-3 mb-1 btn" type="submit" id="submitFindId" style={{ backgroundColor: '#293b53', color: '#f2f7ffff', width: '80px' }}>
                        {loading ?
                            (<div className="spinner-border spinner-border-sm" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>) : 'Find'}
                    </button>
                    <button className="mt-3 mb-1 mx-3 btn btn-danger" type="button" id="cancelFindId" onClick={() => { navigate('/admin/adminDashboard') }}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}

export default FindProJect