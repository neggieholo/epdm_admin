import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SendEmails = () => {
    const [sendTo, setSendTo] = useState('all');
    const [projectId, setProjectId] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const handleSend = async () => {
        console.log({ sendTo, projectId, subject, message });
        setLoading(true);
        if (!subject || !message) {
            toast.error('Title and message are required');
            return;
        }

        const payload = {
            type: sendTo,
            subject,
            message,
            ...(sendTo === 'specific' && { projectId })
        };

        try {
            const res = await fetch(`${apiUrl}/emailSend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials:'include',
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (data.success) {
                toast.success(data.message || 'Emails sent');
                handleCancel();
            } else {
                toast.error(data.error || 'Failed to send emails');
            }
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong');
        } finally {
            setLoading(false)
        }
    };


    const handleCancel = () => {
        setSendTo('all');
        setProjectId('');
        setSubject('');
        setMessage('');
    };

    const handleBack = () => {
        setSendTo('all');
        setProjectId('');
        setSubject('');
        setMessage('');
        navigate("/admin/adminDashboard")
    };

    return (
        <div className='px-2  d-flex flex-column' style={{
            width: '50%', height: 'fit-content', minWidth: '350px',
            backgroundColor: '#778ca9', borderRadius: '10px', color: '#f2f7ffff',overflowY:'auto'
        }}>
            <div style={{ height: '75%' }}>
                <div>
                    <h1 className="mb-4 text-center p-2 color-background">Send Email</h1>
                </div>

                <div className="d-flex align-items-center justify-content-start px-4 mb-3 gap-4" style={{height:"10%"}}>
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="sendOption"
                            id="sendAll"
                            value="all"
                            checked={sendTo === 'all'}
                            onChange={() => setSendTo('all')}
                        />
                        <label className="form-check-label" htmlFor="sendAll">
                            All
                        </label>
                    </div>

                    <div className="form-check d-flex align-items-center gap-2">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="sendOption"
                            id="sendSpecific"
                            value="specific"
                            checked={sendTo === 'specific'}
                            onChange={() => setSendTo('specific')}
                        />
                        <label className="form-check-label" htmlFor="sendSpecific">
                            Specific Project
                        </label>
                        {sendTo === 'specific' && (
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Enter Project ID"
                                value={projectId}
                                onChange={(e) => setProjectId(e.target.value.toString())}
                                style={{ maxWidth: '200px' }}
                            />
                        )}
                    </div>
                </div>

                <div className='px-4 mb-3' style={{ height: "10%" }} >
                    <label><strong>Subject</strong></label>
                    <input
                        type="text"
                        className="form-control"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Enter email Subject"
                    />
                </div>

                <div className='px-4 my-5' style={{ height: "80%" }}>
                    <label><strong>Message</strong></label>
                    <textarea
                        className="form-control"
                        rows="6"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write your message here"
                    />
                </div>
            </div>           

            <div className='px-4 mb-4 d-flex gap-3'>
                <button className='btn' onClick={handleSend} disabled={loading} style={{ backgroundColor: '#293b53', color: '#f2f7ffff', width: '120px' }}>
                    {loading ?
                        (<div className="spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>) : (<><i className="bi bi-arrow-right me-1"></i>Send</>)}
                </button>
                <button className='btn btn-danger' onClick={handleCancel} style={{ color: '#293b53',width:'120px' }}>Cancel</button>
                <button className="btn ms-2" onClick={handleBack} style={{ backgroundColor: '#293b53', color: '#f2f7ffff', width: '120px' }}>
                    Back
                </button>
            </div>
        </div>
    );
};

export default SendEmails;
