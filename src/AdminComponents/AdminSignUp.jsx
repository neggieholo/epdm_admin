import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AdminSignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [newAdminUsername, setNewAdminUsername] = useState('');
    const [newAdminPassword, setNewAdminPassword] = useState('');
    const [newAdminEmail, setNewAdminEmail] = useState('');
    const [currentAdminUsername, setCurrentAdminUsername] = useState('');
    const [currentAdminPassword, setCurrentAdminPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const response = await fetch(`${apiUrl}/admin/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", 
                body: JSON.stringify({
                    newAdminUsername,
                    newAdminPassword,
                    newAdminEmail,
                    currentAdminUsername,
                    currentAdminPassword
                })
            });

            const data = await response.json();

            if (data.error) {
                console.log(data.error);
                toast.error(data.error);
            } else if (data.success) {
                console.log(data.message);
                toast.success(data.message)
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Something went wrong. Please try again.")
        } finally {
            setLoading(false);
            e.target.reset();
        }
    };

    return (
        <div className='p-3 d-flex flex-column' style={{ width: '35%', minWidth: '350px', height:'fit-content', backgroundColor: '#778ca9', borderRadius: '10px', color: '#f2f7ffff' }}>
            <h2 className="mb-3">Admin Registration</h2>
            <h5 className="mb-3">To register, you will need the credentials of a current admin member</h5>

            <form onSubmit={handleSubmit}>
                <div style={{ overflowY: 'auto',height:'55%' }}>
                    <div className="mb-3">
                        <label htmlFor="newAdminUsername" className="form-label">New Admin Username</label>
                        <input type="text" className="form-control" id="newAdminUsername" name="newAdminUsername"
                            placeholder="Enter New Admin Username" onChange={(e) => { setNewAdminUsername(e.target.value.trim()) }} required />
                    </div>

                    <label htmlFor="newAdminPassword" className="form-label">New Admin Password</label>
                    <div className="input-group mb-3">
                        <input type={showPassword ? "text" : "password"} className="form-control" id="newAdminPassword" name="newAdminPassword"
                            placeholder="Enter New Admin Password" onChange={(e) => { setNewAdminPassword(e.target.value.trim()) }} required />
                        <span id="eyeIconReg" className="color-font p-1 text-center" onClick={() => setShowPassword(!showPassword)}
                            style={{ backgroundColor: '#f2f7ffff', borderRadius: '0 5px 5px 0', width: '50px' }}>
                            {showPassword ? 'hide' : 'show'}
                        </span>
                    </div>

                    <div className="mb-1">
                        <label htmlFor="newAdminEmail" className="form-label">Email Address</label>
                        <input type="email" className="form-control" id="newAdminEmail" name="newAdminEmail"
                            placeholder="Enter your email" onChange={(e) => { setNewAdminEmail(e.target.value.trim()) }} required />
                    </div>

                    <h4 className="mt-4">Current Admin Authentication</h4>
                    <p>Please enter your credentials to authorize the registration.</p>

                    <div className="mb-3">
                        <label htmlFor="currentAdminUsername" className="form-label">Current Admin Username</label>
                        <input type="text" className="form-control" id="currentAdminUsername" name="currentAdminUsername"
                            placeholder="Enter Your Username" onChange={(e) => { setCurrentAdminUsername(e.target.value.trim()) }} required />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="currentAdminPassword" className="form-label">Current Admin Password</label>
                        <input type="password" className="form-control" id="currentAdminPassword" name="currentAdminPassword"
                            placeholder="Enter Your Password" onChange={(e) => { setCurrentAdminPassword(e.target.value.trim()) }} required />
                    </div>
                </div>  
                <div>
                    <p id="regmessage" className="mb-2 text-light" style={{ height: '20px' }}></p>

                    <button type="submit" className="btn me-2 text-center" style={{ borderRadius: '5px', color: '#f2f7ffff', backgroundColor: '#293b53', width: '80px' }}>
                        {loading ?
                            (<div className="spinner-border spinner-border-sm" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>) : 'Register'}
                    </button>
                    <button type="button" className="btn btn-danger" onClick={() => { navigate("/admin") }}>Cancel</button>
                </div>               
            </form>
        </div>
    );
};

export default AdminSignUp;
