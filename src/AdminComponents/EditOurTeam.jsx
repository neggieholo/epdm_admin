import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from './ConfirmDialog';

const EditOurTeam = () => {
    const [team, setTeam] = useState([]);
    const [editingMember, setEditingMember] = useState(null);
    const [addingMember, setAddingMember] = useState(false);
    const [newMember, setNewMember] = useState({ name: '', bio: '', image: null });
    const [expandedBio, setExpandedBio] = useState(null);
    const [saving, setSaving] = useState(false);
    const [adding, setAdding] = useState(false);
    const [ordering, setOrdering] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [orderChanged, setOrderChanged] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    // Fetch team
    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const res = await fetch(`${apiUrl}/team/members`, { credentials: 'include' });
                const data = await res.json();
                console.log("members", data.members)

                if (data.success) {
                    setTeam(data.members); // use `members` from backend
                } else {
                    toast.error(data.error || 'Failed to fetch team members');
                }
            } catch (err) {
                toast.error('Server error');
                console.error(err);
            }
        };

        fetchTeam();
    }, [apiUrl]);

    const handleEdit = (member) => setEditingMember(member);

    const handleSave = async (member) => {
        setSaving(true);
        const formData = new FormData();
        formData.append('name', member.name);
        formData.append('role', member.role);
        formData.append('bio', member.bio);
        if (member.image instanceof File) {
            formData.append('image', member.image);
        }

        try {
            const res = await fetch(`${apiUrl}/team/update_member/${member._id}`, {
                method: 'PUT',
                body: formData,
                credentials: 'include',
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Member updated');
                setTeam(team.map(m => (m._id === member._id ? data.member : m)));
                setEditingMember(null);
                setOrderChanged(false);
            } else {
                toast.error(data.error || 'Update failed');
            }
        } catch (err) {
            toast.error('Server error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true)
        try {
            const res = await fetch(`${apiUrl}/team/delete_member/${deletingId}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Member deleted');
                setTeam(team.filter(m => m._id !== deletingId));
            } else {
                toast.error(data.error || 'Delete failed');
            }
        } catch (err) {
            toast.error('Server error');
        } finally {
            setDeletingId(null);
            setDeleting(false)
            setShowConfirm(false)
        }
    };

    const handleAdd = async () => {
        setAdding(true);
        const formData = new FormData();
        formData.append('name', newMember.name);
        formData.append('role', newMember.role);
        formData.append('bio', newMember.bio);
        if (newMember.image instanceof File) {
            formData.append('image', newMember.image);
        } else {
            toast.error('Invalid image format');
            return;
        }

        try {
            const res = await fetch(`${apiUrl}/team/add_member`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Member added');
                setTeam([...team, data.member]);
                setNewMember({ name: '', bio: '', image: null });
                setAddingMember(false);
            } else {
                toast.error(data.error || 'Failed to add');
            }
        } catch (err) {
            toast.error('Server error');
        } finally {
            setAdding(false);
        }
    };

    const moveMember = (from, to) => {
        const updated = [...team];
        const [moved] = updated.splice(from, 1);
        updated.splice(to, 0, moved);
        setTeam(updated);
        setOrderChanged(true);
    };

    // New function for saving order
    const handleSaveOrder = async () => {
        setOrdering(true);
        try {
            const res = await fetch(`${apiUrl}/team/reorder`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ members: team.map(m => m._id) }),
            });
            const data = await res.json();

            if (data.success) {
                toast.success("Order updated successfully");
                setOrderChanged(false);
            } else {
                toast.error(data.error || "Failed to update order");
            }
        } catch (err) {
            console.error(err);
            toast.error("Server error");
        } finally {
            setOrdering(false);
        }
    };

    return (
        <>
            <div className="container my-3 color-background" style={{color:'#f2f7ffff', width:'50%', minWidth:'350px',borderRadius:'10px',height:'fit-content', overflow:'auto'}}>
                <h3 className="mb-3 w-100 text-center py-3" style={{ width: '100%', borderBottom: '1px solid #526072ff' }}>Edit Our Team</h3>
                <div className='my-2 p-2' style={{width:'100%', border: '1px solid #f7ffff', borderRadius: '5px', padding: '5px', overflowY: 'auto', height:'50vh' }}>
                    {team.length === 0 && <p>No members added yet.</p>}

                    {team.map((member, index) => (
                        <div key={member._id} className="d-flex justify-content-start align-items-start border rounded p-3 mb-3" style={{ background: '#f2f7ff', width: '100%' }}>
                            <img
                                src={member.image}
                                alt={member.name}
                                className="rounded me-3"
                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                            />
                            <div className="flex-grow-1 d-flex flex-column">
                                {editingMember && editingMember._id === member._id ? (
                                    <>
                                        <input
                                            type="text"
                                            className="form-control mb-2"
                                            value={editingMember.name}
                                            onChange={e => setEditingMember({ ...editingMember, name: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            className="form-control mb-2"
                                            placeholder="Role"
                                            value={editingMember?.role || ''}
                                            onChange={e => setEditingMember({ ...editingMember, role: e.target.value })}
                                        />
                                        <textarea
                                            className="form-control mb-2"
                                            value={editingMember.bio}
                                            onChange={e => setEditingMember({ ...editingMember, bio: e.target.value })}
                                        />
                                        <input
                                            type="file"
                                            className="form-control mb-2"
                                            onChange={e => setEditingMember({ ...editingMember, image: e.target.files[0] })}
                                            placeholder="Select image"
                                        />
                                        <button className="btn color-background-dark text-light btn-sm me-2 editmemberBtn"
                                            style={{width:'80px'}}
                                            onClick={() => handleSave(editingMember)}>
                                            {saving ? (
                                                <div className="spinner-border spinner-border-sm" role="status">
                                                    <span className="visually-hidden">Saving...</span>
                                                </div>
                                            ) : 'Save'}
                                        </button>
                                        <button className="btn btn-danger btn-sm" onClick={() => setEditingMember(null)}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <h5 className='color-font'>{member.name}</h5>
                                        <p className='color-font'>{member.role}</p>
                                        {expandedBio !== member._id && (
                                            <div className="mt-2 memberBioDiv" style={{ maxWidth: "350px" }}>
                                                {/* Always show a one-line preview */}
                                                <p
                                                    className="color-font"
                                                    style={{
                                                        width: "80%",
                                                        whiteSpace: expandedBio === member._id ? "normal" : "nowrap",
                                                        overflow: expandedBio === member._id ? "visible" : "hidden",
                                                        textOverflow: expandedBio === member._id ? "clip" : "ellipsis",
                                                        marginBottom: "0",
                                                    }}
                                                >
                                                    {member.bio}
                                                </p>

                                                {/* Toggle button */}
                                                <button
                                                    className="btn btn-link p-0 mt-1"
                                                    style={{ fontSize: "0.9rem" }}
                                                    onClick={() =>
                                                        setExpandedBio(expandedBio === member._id ? null : member._id)
                                                    }
                                                >
                                                    Expand
                                                </button>
                                            </div>
                                        )}
                                        {expandedBio === member._id && (
                                            <div className="mt-2" style={{ maxWidth: "70%" }}>
                                                <p className="color-font" style={{ whiteSpace: "normal" }}
                                                onClick={() =>
                                                setExpandedBio(expandedBio === member._id ? null : member._id)
                                            }>
                                                    {member.bio}
                                                </p>
                                                <button
                                                    className="btn btn-link p-0 mt-1"
                                                    style={{ fontSize: "0.9rem" }}
                                                    onClick={() =>
                                                        setExpandedBio(expandedBio === member._id ? null : member._id)
                                                    }
                                                >
                                                    Collapse
                                                </button>
                                            </div>
                                        )}
                                        <div className="d-flex align-items-center justify-content-between" style={{width: '90%'}}>
                                            <div>
                                                <button className="btn color-background-dark text-light btn-sm me-2 editmemberBtn" onClick={() => handleEdit(member)}>Edit</button>
                                                <button className="btn btn-danger btn-sm"
                                                        onClick={() => { setDeletingId(member._id); setShowConfirm(true) }}
                                                    style={{ width: '80px' }}
                                                    disabled={deletingId === member._id}>
                                                    {deletingId === member._id ? (
                                                        <div className="spinner-border spinner-border-sm" role="status">
                                                            <span className="visually-hidden">Deleting...</span>
                                                        </div>
                                                    ) : 'Delete'}
                                                </button>
                                                </div>
                                                <div>
                                                    <button
                                                        className="btn btn-sm btn-light m-2 color-background-dark text-light"
                                                        disabled={index === 0}
                                                        onClick={() => moveMember(index, index - 1)}
                                                    >
                                                        ↑
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-light m-2 color-background-dark text-light"
                                                        disabled={index === team.length - 1}
                                                        onClick={() => moveMember(index, index + 1)}
                                                    >
                                                        ↓
                                                    </button>
                                                </div>                                        
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {!addingMember ? (
                    <button className="btn mb-3 color-background-light color-font" onClick={() => setAddingMember(true)}>+ Add Member</button>
                ) : (
                        <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1000,
                        }}>
                            <div className='color-background' style={{
                                borderRadius: '10px',
                                padding: '20px',
                                width: '40%',
                                minWidth: '350px',
                                position: 'relative',
                            }}>
                                <h5>Add New Member</h5>
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Name"
                                    value={newMember.name}
                                    onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                                />
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Role"
                                    value={newMember.role || ''}
                                    onChange={e => setNewMember({ ...newMember, role: e.target.value })}
                                />
                                <textarea
                                    className="form-control mb-2"
                                    placeholder="Bio"
                                    value={newMember.bio}
                                    onChange={e => setNewMember({ ...newMember, bio: e.target.value })}
                                />
                                <label htmlFor='memberImg'>Select Image</label>
                                <input
                                    id='memberImg'
                                    type="file"
                                    className="form-control mb-3"
                                    onChange={e => setNewMember({ ...newMember, image: e.target.files[0] })}
                                />
                                <div className="d-flex justify-content-end gap-2">
                                    <button id='addBtn' className="btn color-background-dark text-light"
                                        style={{ width: '80px' }}
                                        onClick={handleAdd}>
                                        {adding ? (
                                            <div className="spinner-border spinner-border-sm" role="status">
                                                <span className="visually-hidden">Adding...</span>
                                            </div>
                                        ) : 'Add'}
                                    </button>
                                    <button className="btn btn-danger" onClick={() => { setAddingMember(false); setNewMember({ name: '', role: '', bio: '', image: null }); }}>Cancel</button>
                                </div>
                            </div>
                        </div>
                )}

                <div className="text-center my-2 d-flex justify-content-start gap-2">
                    <button className="btn color-background-dark" style={{ color: '#f2f7ff', width: '80px' }} onClick={() => navigate("/admin/edit_info")}>Back</button>
                    {orderChanged && (
                            <button
                            className="btn color-background-dark text-light"
                            style={{ width: '80px' }}
                                onClick={handleSaveOrder}
                            >
                            {ordering ? (
                                <div className="spinner-border spinner-border-sm" role="status">
                                    <span className="visually-hidden">Ordering...</span>
                                </div>
                            ) : 'Save'}
                            </button>
                    )}
                </div>
            </div>
            {
                showConfirm && (
                    <ConfirmDialog
                        message="Are you sure you want to delete this team member? This action is irreversible."
                        onConfirm={handleDelete}
                        onCancel={() => setShowConfirm(false)}
                        isLoading={deleting}
                    />
                )
            }
        </>
    );
};

export default EditOurTeam;
