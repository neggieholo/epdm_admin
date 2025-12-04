import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { cleanUserData } from './AdminFetchers';
import { useNavigate } from 'react-router-dom';

const AdminLogsCheck = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState([]);
    const [logDate, setLogDate] = useState('');
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    useEffect(() => {
        handleCheckLogs();
    },[])

    const handleCheckLogs = async () => {
        setLoading(true);
        if (!startDate && endDate) {
            toast.error("Start date is required when selecting an end date.");
            setLoading(false);
            return;
        }
        if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
            toast.error("End date cannot be earlier than start date.");
            setLoading(false);
            return;
        }
        try {
            const res = await fetch(`${apiUrl}/admin/logs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    ...(startDate && { startDate }),
                    ...(endDate && { endDate })
                })
            });

            const data = await res.json();

            if (data.error) {
                toast.error(data.error);
            } else {
                setLogs(data.logs)
                if (startDate && endDate) {
                    setLogDate(`${startDate} to ${endDate}`);
                } else if (startDate) {
                    setLogDate(`${startDate}`);
                } else {
                    setLogDate("Today");
                }
            }
        } catch (err) {
            console.error("Log fetch error:", err);
            toast.error("Failed to load logs.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='px-2 d-flex flex-column' style={{
            width: '50%', height: '90%', minWidth: '350px',
            backgroundColor: '#778ca9', borderRadius: '10px', color: '#f2f7ffff',overflow:"auto"
        }}>
            <div>
                <h1 className="mb-4 text-center p-2 color-background">Logs</h1>
            </div>
            <div className="d-flex align-items-center justify-content-center px-4 mb-3 gap-2">
                <input
                    type="date"
                    className="form-control"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{ maxWidth: '200px' }}
                />
                <input
                    type="date"
                    className="form-control"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{ maxWidth: '200px' }}
                />
                <button className="btn btn-dark d-flex align-items-center text-center" onClick={handleCheckLogs} style={{ backgroundColor: '#293b53', color:'#f2f7ff',width:'100px'}}>
                    {loading ?
                        (<div className="spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>) : (<><i className="bi bi-arrow-right me-1"></i>Check</>)}
                </button>
            </div>
            <div id='form_div' className='px-4' style={{ height: '75%', overflowY: 'auto', minWidth: '90%', backgroundColor: '#f2f7ff', borderRadius: '10px' }}>
                {logs.length > 0 ? logs.map(log =>
                        <ul className='m-2 p-2 color-background' key={log._id} style={{ color: '#f2f7ff', borderRadius: '10px' }}>
                        <li className='d-flex justify-content-between px-2'><strong className='me-5'>
                            Date: {log.date}</strong><strong>Number: {log.users.length}</strong>
                        </li>
                        {cleanUserData(log.users).map((user, idx) => (
                            <ul className='m-3 p-2 color-font' key={idx} style={{ backgroundColor: '#f2f7ff',borderRadius:'10px'}}>
                                {Object.entries(user).map(([key, value]) => (
                                    <li className='logLi m-1 p-1 shadow-sm' key={key}><strong className='me-4'>{key}: </strong> {String(value)}</li>
                                ))}
                            </ul>
                        ))}
                    </ul>
                ) : <p className='color-font'>No logs available</p>}
            </div>
            <div className='d-flex justify-content-between px-2'>
                <p><strong>Logs for: {logDate}</strong></p>
                <p><strong>Total Number: {logs.reduce((acc, log) => acc + log.users.length, 0)}</strong></p>
            </div>
            <div className='py-2'>
                <button type="button" className="btn btn-danger" style={{ width: '100px' }} onClick={() => { navigate("/admin/adminDashboard") }}>Cancel</button>
            </div>            
        </div>
    );
};

export default AdminLogsCheck;
