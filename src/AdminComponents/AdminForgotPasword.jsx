import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const AdminForgotPasword = () => {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true)
        try {
            const response = await fetch(`${apiUrl}/admin/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(`${data.message} to ${email}`);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message || "Error connecting to server.");
        } finally {
            setLoading(false);
            setEmail("");
        }

    }
    
    return (
        <div className='p-2' style={{ width: '30%', minWidth: '300px', backgroundColor: '#778ca9', borderRadius: '10px', color: '#f2f7ffff' }}>
            <h2>Forgot Password</h2>
            <p>Enter your email address to a receive password reset email</p>
            <form onSubmit={handleSubmit}>
                <div className="container-fluid p-3">
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            className="form-control"
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            placeholder="Enter Email"
                            onChange={(e) => { setEmail(e.target.value.trim()) }}
                            required
                        />
                    </div>
                    <button className="mt-3 mb-1 btn" type="submit" style={{ backgroundColor: '#293b53', color: '#f2f7ffff', width: '80px' }}>
                        {loading ?
                            (<div className="spinner-border spinner-border-sm" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>) : 'Send'}
                    </button>
                    <button className="mt-3 mb-1 mx-3 btn btn-danger" type="button" id="cancelFindId" onClick={() => { navigate('/') }}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AdminForgotPasword