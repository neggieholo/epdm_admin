import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { token } = useParams(); 
    const apiUrl = import.meta.env.VITE_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("❌ Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${apiUrl}/admin/reset-password/${token}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password:newPassword }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(`✅ ${data.message}`);
                setNewPassword('');
                setConfirmPassword('');
            } else {
                toast.error("❌ " + data.message);
            }
        } catch (error) {
            toast.error("❌ Server connection error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='p-2' style={{ width: '30%', minWidth: '300px', backgroundColor: '#778ca9', borderRadius: '10px', color: '#f2f7ffff' }}>
            <h2>Reset Password</h2>
            <p>Enter and confirm your new password</p>
            <form onSubmit={handleSubmit}>
                <div className="container-fluid p-3">
                    <div className="mb-2">
                        <label htmlFor="newPassword">New Password</label>
                        <input
                            className="form-control"
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={newPassword}
                            placeholder="Enter New Password"
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            className="form-control"
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            placeholder="Confirm New Password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button className="mt-3 mb-1 btn" type="submit"
                        disabled={loading}
                        style={{ backgroundColor: '#293b53', color: '#f2f7ffff', width: '80px' }}>
                        {loading ?
                            (<div className="spinner-border spinner-border-sm" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>) : 'Reset'}
                    </button>

                    <button className="mt-3 mb-1 mx-3 btn btn-danger" type="button" onClick={() => navigate('/admin')}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminResetPassword;
