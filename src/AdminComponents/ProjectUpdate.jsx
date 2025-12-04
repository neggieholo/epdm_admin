import React, { useEffect, useState } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import { convertProjectKeysForBackend } from './AdminFetchers';
import { toast } from 'react-toastify';

const ProjectUpdate = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const initialProject = location.state?.project;
    const id = location.state?.id;
    const [projectData, setProjectData] = useState(null);
    const [originalProjectData, setOriginalProjectData] = useState({});
    const [editState, setEditState] = useState({});
    const [updateData, setUpdateData] = useState({});
    const [loading, setLoading] = useState(false)

    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (initialProject) {
            setProjectData(initialProject);
            setOriginalProjectData(initialProject);
        }
    }, [initialProject]);

    const handleEditToggle = (field) => {
        setEditState(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleInputChange = (field, value) => {
        setProjectData(prev => ({
            ...prev,
            [field]: value
        }));
        setUpdateData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleConfirm = () => {
        setLoading(true)
        const cleanedUpdateData = convertProjectKeysForBackend(updateData);
        fetch(`${apiUrl}/new-project/project-update?projectId=${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ cleanedUpdateData })
        })
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    toast.success("Project updated successfully");
                    setUpdateData({});
                } else {
                    toast.error("Error updating project: " + result.message);
                }
            })
            .catch(err => {
                console.error(err);
                toast.error("Network error.");
            }).finally(setLoading(false));
    };

    const handleCancel = () => {
        setProjectData(originalProjectData);
        setUpdateData({});
        setEditState({});
    };

    if (!projectData) {
        return <p className='fw-bold color-font'>Loading project...</p>;
    }

    return (
        <div className='px-2 d-flex flex-column' style={{
            width: '50%', height: '90%', minWidth: '350px', overflowY: 'auto',
            backgroundColor: '#778ca9', borderRadius: '10px', color: '#f2f7ffff'
        }}>
            <div>
                <h1 className="mb-4 text-center p-2 color-background">Project Editor</h1>
                <p className='fw-bold text-center mx-auto' style={{fontSize:'25px'}}>{projectData['Project Name']}</p>
            </div>
            <div id='form_div' className='px-4' style={{ height: '72%', overflowY: 'auto', minWidth:'100%' }}>
                {Object.entries(projectData).map(([field, value]) => {
                    if (field === 'Project Name') return null;

                    return (
                        <div id='projectSpan' className='p-2' key={field} 
                        style={{ marginBottom: '1rem', width: 'fit-content', backgroundColor: '#f2f7ffff', borderRadius: '5px', color:'#778ca9' }}>
                            <strong className='mx-2'>{field}: </strong>
                            {editState[field] ? (
                                field === 'Project Size' ? (
                                    <select
                                        value={value}
                                        onChange={e => handleInputChange(field, e.target.value)}
                                    >
                                        <option value="">Select Project Size</option>
                                        <option value="whole project">Whole Project</option>
                                        <option value="package">Package</option>
                                    </select>
                                ) :
                                (
                                <input
                                    type="text"
                                    value={value}
                                    onChange={e => handleInputChange(field, e.target.value)}
                                />
                            ) ): (
                                <span className='color-font'>{value}</span>
                            )}
                            <button
                                onClick={() => handleEditToggle(field)}
                                className="btn btn-sm ms-5"
                                style={{ backgroundColor: '#778ca9', color: '#f2f7ffff' }}
                            >
                                {editState[field] ? 'Save' : 'Edit'}
                            </button>
                        </div>
                    );
                })}                
            </div>
            <div className="mt-4 d-flex flex-end align-items-end py-1">
                <button className="btn color-background me-2" onClick={handleConfirm} style={{ backgroundColor: '#293b53', color: '#f2f7ffff', width: '150px' }}>
                    {loading ?
                        (<div className="spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>) : 'Confirm'}
                </button>
                <button className="btn btn-danger" onClick={handleCancel} style={{ color: '#293b53', width: '80px' }}>
                    Cancel
                </button>
                <button className="btn ms-2" onClick={() => { navigate("/admin/find_project") }} style={{ backgroundColor: '#293b53', color: '#f2f7ffff', width: '80px' }}>
                    Back
                </button>
            </div>
        </div>
    );
};

export default ProjectUpdate;
