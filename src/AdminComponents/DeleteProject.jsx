import React, { useState } from 'react'
import { deleteProject } from './AdminFetchers';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from './ConfirmDialog';

const DeleteProject = () => {
    const [projectId, setProjectId] = useState('');
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    const handleDelete = async () => {
        setLoading(true);
        await deleteProject(projectId);
        setLoading(false);
        setShowConfirm(false);
        setProjectId("")
    };

    return (
        <>
        <div className='p-2' style={{ width: '30%', minWidth: '300px', backgroundColor: '#778ca9', borderRadius: '10px', color: '#f2f7ffff' }}>
            <h2>Enter Project ID</h2>
            <p>Deletion is permanent</p>
            <form id="deleteProjectForm" onSubmit={handleSubmit}>
                <div className="container-fluid p-3">
                    <div>
                        <label htmlFor="deleteProjectId">Project ID</label>
                        <input className="form-control" type="number" id="deleteProjectId" name="projectId" value={projectId}
                            placeholder="Enter Project ID" onChange={(e)=>{setProjectId(e.target.value.toString())}} required />
                        <p className="m-2 text-light" id="projectDeleteMsg"></p>
                    </div>
                        <button className="mt-3 mb-1 btn btn-danger" type="submit" style={{ width: '80px' }}>
                            Delete
                        </button>
                        <button className="mt-3 mb-1 mx-3 btn" type="button" id="cancelDeleteId"
                            onClick={() => { navigate("/admin/adminDashboard") }} style={{ backgroundColor: '#293b53', color: '#f2f7ffff' }}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
        
        {showConfirm && (
            <ConfirmDialog
                message="Are you sure you want to delete this project? This action is irreversible."
                onConfirm={handleDelete}
                onCancel={() => setShowConfirm(false)}
                isLoading={loading}
            />
        )}
        </>
    )
}

export default DeleteProject