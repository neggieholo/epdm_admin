import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate,Link } from 'react-router-dom';
import localforage from 'localforage';

const AdminLogin = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate()

    useEffect(() => {
       localforage.clear()
    }, []);

    function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        fetch(`${apiUrl}/admin/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ username: username.trim(), password: password.trim() })
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.log(data.error);
                    toast.error(data.error)
                } else if (data.success) {
                    console.log(data.success);
                    toast.success(data.success)
                    setTimeout(() => {
                        navigate("/admin/adminDashboard")
                    }, 1000);
                }
            })
            .catch(error => {
                console.error("Error:", error);
                toast.error("Server or connection error");
            })
            .finally(() => setLoading(false));;
    }
    return (
        <div className='p-2' style={{ width: '35%', minWidth: '350px', backgroundColor: '#778ca9', borderRadius: '10px', color:'#f2f7ffff'}}>
            <h2>Admin Login</h2>
            <form id="adminLoginForm" onSubmit={handleSubmit}>
                <div className="container-fluid p-3">
                    <div>
                        <label htmlFor="username">Username:</label>
                        <input className="form-control" type="text" id="username" name="username" 
                        placeholder="Enter admin username" onChange={(e)=>{setUsername(e.target.value)}} required />
                    </div>
                    <label htmlFor="password">Password:</label>
                    <div className="input-group mb-3">
                        <input className="form-control" type={showPassword ? "text" : "password"} id="password" name="password" 
                        placeholder="Enter admin password" onChange={(e)=>{setPassword(e.target.value)}} required />
                        <span id="eyeIcon" className="eye-icon p-1 color-font text-center" onClick={() => setShowPassword(!showPassword)}
                         style={{ backgroundColor: 'white', borderRadius: '0 5px 5px 0', width:'50px' }} >
                            {showPassword ? 'hide' : 'show'}
                        </span>
                    </div>
                    <p className="text-center mb-1 mt-2 mx-auto" style={{ display: 'block' }}>Register a new Admin
                        <Link to="/admin/register" className='fw-bold color-font' id="adminRegLink" style={{ textDecoration: 'none' }} >
                            Here
                        </Link>
                    </p>
                    <div className="d-flex justify-content-center loginButtons">
                        <button className="mt-3 mb-1 btn color-font" type="submit" id="submitLogin" 
                        disabled={loading} style={{ backgroundColor: '#293b53', color: '#f2f7ffff', width:'80px' }}>
                            {loading ?
                                (<div className="spinner-border spinner-border-sm" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>) : 'Login'}
                        </button>
                    </div>
                </div>
            </form>
            <Link className="text-center text-light" to='/admin/forgot_password' rel="noopener noreferrer">Forgot Password?</Link>
        </div>
    );
};

export default AdminLogin;
