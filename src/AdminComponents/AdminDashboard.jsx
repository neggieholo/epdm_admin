import React from 'react'
import { useNavigate } from 'react-router-dom'
import localforage from 'localforage';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    async function handleLogOut() {
        await fetch(`${apiUrl}/session_destroy`, {
            method: 'GET',
            credentials: 'include',
        }); 
        await localforage.clear();
        navigate("/")
    }
    return (
        <div className='p-2' style={{ width: '40%', minWidth: '350px', backgroundColor: '#778ca9', borderRadius: '10px', color: '#f2f7ffff' }}>
            <h2>What would you like to do?</h2>
            <div className="container p-3">
                <div className="row g-3">
                    <div className="col-md-6">
                        <button className="btn btn-primary shadow-lg w-100 py-2 fw-bold todo-button" onClick={()=> { navigate('/admin/register_project')}}>
                            Register New Project
                        </button>
                    </div>
                    <div className="col-md-6">
                        <button className="btn btn-warning shadow-lg w-100 py-2 fw-bold todo-button" onClick={() => { navigate('/admin/find_project') }}>
                            Update Existing Project
                        </button>
                    </div>
                    <div className="col-md-6">
                        <button className="btn btn-danger shadow-lg w-100 py-2 fw-bold todo-button" onClick={() => { navigate('/admin/delete_project') }}>
                            Delete Project
                        </button>
                    </div>
                    <div className="col-md-6">
                        <button className="btn btn-success shadow-lg w-100 py-2 fw-bold todo-button" onClick={() => { navigate('/admin/send_email') }}>
                            Send Email
                        </button>
                    </div>
                    <div className="col-md-6">
                        <button id='logsBtn' className="btn shadow-lg w-100 py-2 fw-bold todo-button color-font" onClick={() => { navigate('/admin/logs') }}
                            style={{ backgroundColor: '#f2f7ffff' }}>
                            Check logs
                        </button>
                    </div>
                    <div className="col-md-6">
                        <button id='infoBtn' className="btn shadow-lg w-100 py-2 fw-bold todo-button color-font" onClick={() => { navigate('/admin/edit_info') }}
                            style={{ backgroundColor: '#d3eecbff' }}>
                            Edit Company Info/News
                        </button>
                    </div>
                    <div className="col-md-12">
                        <button id='usersBtn' className="btn shadow-lg w-100 py-2 fw-bold todo-button color-font" onClick={() => { navigate('/admin/users_info') }}
                            style={{ backgroundColor: '#abf0ecff' }}>
                            Users Info
                        </button>
                    </div>
                </div>
            </div>
            <button className="mt-3 mb-1 mx-3 btn btn-dark" type="button" id="cancelAdminMain"
                style={{ borderRadius: '5px', color: '#f2f7ffff', backgroundColor: '#293b53' }}  onClick={handleLogOut} >
                Logout
            </button>
        </div>
    )
}

export default AdminDashboard