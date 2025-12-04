import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { cleanUserData } from './AdminFetchers';
import { useNavigate } from 'react-router-dom';
import { formatUser } from './AdminFetchers';
import ConfirmDialog from './ConfirmDialog';
import { fi } from 'intl-tel-input/i18n';

const UsersInfo = () => {
    const [searchValue, setSearchValue] = useState('');
    const [deleting, setDeleting] = useState(false);
    const [suspending, setSuspending] = useState(false);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [originalUsers, setOriginalUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [noSelectedUser, setNoSelectedUser] = useState(true);
    const [suspendedDisplay, setSuspendedDisplay] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, [])

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${apiUrl}/users`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });

            const data = await res.json();

            if (data.error) {
                toast.error(data.error);
            } else {
                setUsers(data.loggers);
                setOriginalUsers(data.loggers);
            }
        } catch (err) {
            console.error("Log fetch error:", err);
            toast.error("Failed to load logs.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const q = searchValue.toLowerCase();
        const filtered = users.filter(user =>
            user.username?.toLowerCase().includes(q) ||
            user.email?.toLowerCase().includes(q)
        );
        setFilteredUsers(filtered);
    }, [searchValue, users]);

    // Suspend / Unsuspend user
    const handleSuspendUser = async (userId) => {
        setSuspending(true);
        try {
            const res = await fetch(`${apiUrl}/users/suspend/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            const data = await res.json();

            if (!data.success) {
                toast.error(data.error || "Failed to suspend user");
                return;
            }

            toast.success(`User ${data.logger.suspended ? "suspended" : "unsuspended"} successfully`);

            // Refresh list
            setUsers((prev) =>
                prev.map((u) =>
                    u._id === userId ? { ...u, suspended: data.logger.suspended } : u
                )
            );
            setOriginalUsers((prev) =>
                prev.map((u) =>
                    u._id === userId ? { ...u, suspended: data.logger.suspended } : u
                )
            );

            // Update selected user if open
            if (selectedUser?._id === userId) {
                setSelectedUser((prev) => ({ ...prev, suspended: data.logger.suspended }));
            }
        } catch (err) {
            console.error("Error suspending user:", err);
            toast.error("Error suspending user");
        } finally {
            setSuspending(false);
        }
    };

    // Delete user
    const handleDeleteUser = async (userId) => {
        setDeleting(true);
        try {
            const res = await fetch(`${apiUrl}/users/delete/${userId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            const data = await res.json();

            if (!data.success) {
                toast.error(data.error || "Failed to delete user");
                return;
            }

            toast.success("User deleted successfully");

            // Remove from list
            setUsers((prev) => prev.filter((u) => u._id !== userId));
            setOriginalUsers((prev) => prev.filter((u) => u._id !== userId));

            // Clear selected user if it was the one deleted
            if (selectedUser?._id === userId) {
                setSelectedUser(null);
                setNoSelectedUser(true);
            }
        } catch (err) {
            console.error("Error deleting user:", err);
            toast.error("Error deleting user");
        } finally {
            setDeleting(false);
            setShowConfirm(false);
        }
    };

    const handleShowSuspendedUsers = () => {
        const suspended = users.filter(user => user.suspended === true);
        setUsers(suspended);
        setNoSelectedUser(true);
        setSelectedUser(null);
        setSuspendedDisplay(true);
    };

    const handleShowExpiredUsers = () => {
        const expiredUsers = users.filter((u) => {
            if (!u.subscriptionExpiry) return false;
            return new Date(u.subscriptionExpiry) < new Date();
        });
        setUsers(expiredUsers);
        setNoSelectedUser(true);
        setSelectedUser(null);
        setSuspendedDisplay(true);
    };

   

    return (
        <>
        <div className='px-2 d-flex flex-column' style={{
            width: '50%', height: '90%', minWidth: '350px',
            backgroundColor: '#778ca9', borderRadius: '10px', color: '#f2f7ffff', overflow: "auto"
        }}>
            <div>
                <h1 className="mb-4 text-center p-2 color-background">Find User info</h1>
            </div>
            <hr style={{ borderColor: '#f2f7ff' }} />
            <div className="d-flex align-items-center justify-content-evenly px-4 mb-3 gap-2">
                {noSelectedUser && (
                    <>
                        <button
                            type="button"
                            className="btn color-background-dark text-light"
                            disabled={loading}
                            onClick={handleShowSuspendedUsers} // navigate to suspension list page
                            style={{ width: '150px' }}
                        >
                            Suspension List
                        </button>
                        <button
                            type="button"
                            className="btn color-background-dark text-light"
                            disabled={loading}
                            onClick={handleShowExpiredUsers} // navigate to expired users list page
                            style={{ width: '150px' }}
                        >
                            Expired List
                        </button>
                        <input
                            type="text"
                            className="form-control"
                            value={searchValue}
                            placeholder="Search..."
                            onChange={(e) => setSearchValue(e.target.value)}
                            style={{ maxWidth: '200px' }}
                        />
                    </>
                )}
            </div>
            <div
                id="form_div"
                className="px-4"
                style={{
                    height: "75%",
                    overflowY: "auto",
                    minWidth: "90%",
                    backgroundColor: "#f2f7ff",
                    borderRadius: "10px",
                }}
            >
                {noSelectedUser && (
                    <>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <ul
                                    className="m-2 p-2 color-background"
                                    key={user._id}
                                    onClick={() => {
                                        setSelectedUser(user);
                                        setNoSelectedUser(false);
                                    }}
                                    style={{ color: "#f2f7ff", borderRadius: "10px", cursor: "pointer" }}
                                >
                                    <li className="d-flex justify-content-between px-2">
                                        <strong className="me-5">UserName: {user.username}</strong>
                                    </li>
                                    <li className="d-flex justify-content-between px-2">
                                        <strong className="me-5">Email: {user.email}</strong>
                                    </li>
                                </ul>
                            ))
                        ) : (
                            <p className="color-font">{suspendedDisplay ? "No suspended users" : "No registered users"}</p>
                        )}
                    </>
                )}
                {selectedUser &&
                    (<div className='d-flex flex-column'>
                    <div className="p-3 text-light" style={{ backgroundColor: '#778ca9', borderRadius: "10px" }}>
                        <h5>User Details</h5>
                        <ul style={{ listStyle: "none", padding: 0 }}>
                            {Object.entries(formatUser(selectedUser)).map(([key, value]) => {
                                if (key === "_id") return null; // 🚫 don't render ID
                                return (
                                    <li key={key} className="d-flex justify-content-between py-1 border-bottom">
                                        <strong>{key}:</strong> <span>{String(value)}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>                        
                        <div className="d-flex justify-content-evenly m-3">
                            <button type="button" id='sendEmail_user' className="btn color-background-dark text-light" disabled={suspending || deleting}
                                onClick={() => navigate("/admin/send_user_email", { state: { email: selectedUser.email } })} style={{ width: '150px' }}>
                                Send Email
                            </button>
                            <button type="button" className="btn btn-warning" onClick={() => handleSuspendUser(selectedUser._id)} disabled={suspending || deleting} style={{ width: '100px' }}>
                                {suspending ? <div className="spinner-border spinner-border-sm" role="status">
                                    <span className="visually-hidden">Saving...</span>
                                </div> : (selectedUser.suspended ? "Suspended" : "Suspend")}
                            </button>
                            <button type="button" className="btn btn-danger" onClick={() => setShowConfirm(true)} disabled={suspending || deleting} style={{ width: '100px' }}>
                                Delete
                            </button>
                        </div>
                    </div>)}
            </div>
            {noSelectedUser && <div className='d-flex justify-content-between px-2'>
                <p><strong>Total Number: {users.length}</strong></p>
            </div>}
            <div style={{height:'50px'}}>{loading ? 'Loading Users...' : ''}</div>
            <div className='d-flex justify-content-between p-2'>
                    <button type="button" className="btn color-background-dark text-light" style={{ width: '100px' }} onClick={() => { navigate("/admin/adminDashboard") }}>Back</button>
                    {(selectedUser || suspendedDisplay) && (
                        <button type="button" className="btn color-background-dark text-light" style={{ width: '100px' }}
                            onClick={() => {
                                setNoSelectedUser(true);
                                setSelectedUser(null);
                                setUsers(originalUsers);
                                setSuspendedDisplay(false);
                            }}>
                            Users
                        </button>
                    )}               
            </div>
        </div>
        {showConfirm && (
                <ConfirmDialog
                    message="Are you sure you want to delete this subscriber? This action is irreversible."
                    onConfirm={() => handleDeleteUser(selectedUser._id)}
                    onCancel={() => setShowConfirm(false)}
                    isLoading={deleting}
                />
            )}

        </>
    );
};

export default UsersInfo;
