import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from './ConfirmDialog';

const EditPartners = () => {
    const [partners, setPartners] = useState([]);
    const [editingPartner, setEditingPartner] = useState(null);
    const [addingPartner, setAddingPartner] = useState(false);
    const [newPartner, setNewPartner] = useState({ name: '', website: '', logo: null });
    const [saving, setSaving] = useState(false);
    const [adding, setAdding] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    // Fetch partners
    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const res = await fetch(`${apiUrl}/partners`, { credentials: 'include' });
                const data = await res.json();
                if (data.success) {
                    setPartners(data.partners);
                } else {
                    toast.error(data.error || 'Failed to fetch partners');
                }
            } catch (err) {
                toast.error('Server error');
                console.error(err);
            }
        };
        fetchPartners();
    }, [apiUrl]);

    const handleEdit = (partner) => setEditingPartner(partner);

    const handleSave = async (partner) => {
        setSaving(true);
        const formData = new FormData();
        formData.append('name', partner.name);
        formData.append('website', partner.website);
        if (partner.logo instanceof File) formData.append('logo', partner.logo);

        try {
            const res = await fetch(`${apiUrl}/partners/update_partner/${partner._id}`, {
                method: 'PUT',
                body: formData,
                credentials: 'include',
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Partner updated');
                setPartners(partners.map(p => (p._id === partner._id ? data.partner : p)));
                setEditingPartner(null);
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
        setDeleting(true);
        try {
            const res = await fetch(`${apiUrl}/partners/delete_partner/${deletingId}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Partner deleted');
                setPartners(partners.filter(p => p._id !== deletingId));
            } else {
                toast.error(data.error || 'Delete failed');
            }
        } catch (err) {
            toast.error('Server error');
        } finally {
            setDeletingId(null);
            setShowConfirm(false);
            setDeleting(false);
        }
    };

    const handleAdd = async () => {
        if (!newPartner.name.trim()) {
            toast.error('Name is required');
            return;
        }
        if (!(newPartner.logo instanceof File)) {
            toast.error('Logo is required');
            return;
        }

        setAdding(true);
        const formData = new FormData();
        formData.append('name', newPartner.name);
        formData.append('logo', newPartner.logo);

        // Only append website if it's not empty
        if (newPartner.website && newPartner.website.trim()) {
            formData.append('website', newPartner.website);
        }

        try {
            const res = await fetch(`${apiUrl}/partners/add_partner`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Partner added');
                setPartners([...partners, data.partner]);
                setNewPartner({ name: '', website: '', logo: null });
                setAddingPartner(false);
            } else {
                toast.error(data.error || 'Failed to add');
            }
        } catch (err) {
            toast.error('Server error');
        } finally {
            setAdding(false);
        }
    };

    return (
        <>
            <div className="container my-3 color-background" style={{ color: '#f2f7ffff', width: '50%', minWidth: '350px', borderRadius: '10px', height: 'fit-content', overflow: 'auto' }}>
                <h3 className="mb-3 w-100 text-center py-3" style={{ borderBottom: '1px solid #526072ff' }}>Edit Partners</h3>
                <div className='my-2 p-2' style={{ width: '100%', border: '1px solid #f7ffff', borderRadius: '5px', padding: '5px', overflowY: 'auto', height: '50vh' }}>
                    {partners.length === 0 && <p>No partners added yet.</p>}

                    {partners.map((partner, index) => (
                        <div key={partner._id} className="d-flex justify-content-start align-items-start border rounded p-3 mb-3" style={{ background: '#f2f7ff', width: '100%' }}>
                            {partner.logoUrl && (
                                <img
                                    src={partner.logoUrl}
                                    alt={partner.name}
                                    className="rounded me-3"
                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                />
                            )}
                            <div className="flex-grow-1 d-flex flex-column">
                                {editingPartner && editingPartner._id === partner._id ? (
                                    <>
                                        <input
                                            type="text"
                                            className="form-control mb-2"
                                            value={editingPartner.name}
                                            onChange={e => setEditingPartner({ ...editingPartner, name: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            className="form-control mb-2"
                                            placeholder="Website"
                                            value={editingPartner.website || ''}
                                            onChange={e => setEditingPartner({ ...editingPartner, website: e.target.value })}
                                        />
                                        <input
                                            type="file"
                                            className="form-control mb-2"
                                            onChange={e => setEditingPartner({ ...editingPartner, logo: e.target.files[0] })}
                                            placeholder="Select logo"
                                        />
                                        <div className="d-flex gap-2">
                                            <button className="btn color-background-dark text-light btn-sm" onClick={() => handleSave(editingPartner)}>
                                                {saving ? 'Saving...' : 'Save'}
                                            </button>
                                            <button className="btn btn-danger btn-sm" onClick={() => setEditingPartner(null)}>Cancel</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h5 className='color-font'>{partner.name}</h5>
                                        {partner.website && <p className='color-font'>{partner.website}</p>}
                                        <div className="d-flex align-items-center gap-2 mt-2">
                                            <button className="btn color-background-dark text-light btn-sm" onClick={() => handleEdit(partner)}>Edit</button>
                                            <button className="btn btn-danger btn-sm"
                                                onClick={() => {setShowConfirm(true); setDeletingId(partner._id)}}
                                                disabled={deletingId === partner._id}>
                                                {deletingId === partner._id ? 'Deleting...' : 'Delete'}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {!addingPartner ? (
                    <button className="btn mb-3 color-background-light color-font" onClick={() => setAddingPartner(true)}>+ Add Partner</button>
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
                            <h5>Add New Partner</h5>
                            <input
                                type="text"
                                className="form-control mb-2"
                                placeholder="Name"
                                value={newPartner.name}
                                onChange={e => setNewPartner({ ...newPartner, name: e.target.value })}
                            />
                            <input
                                type="text"
                                className="form-control mb-2"
                                placeholder="Website"
                                value={newPartner.website || ''}
                                onChange={e => setNewPartner({ ...newPartner, website: e.target.value })}
                            />
                            <label htmlFor='partnerLogo'>Select Logo</label>
                            <input
                                id='partnerLogo'
                                type="file"
                                className="form-control mb-3"
                                onChange={e => setNewPartner({ ...newPartner, logo: e.target.files[0] })}
                            />
                            <div className="d-flex justify-content-end gap-2">
                                <button className="btn color-background-dark text-light"
                                    style={{ width: '80px' }}
                                    onClick={handleAdd}>
                                    {adding ? 'Adding...' : 'Add'}
                                </button>
                                <button className="btn btn-danger" onClick={() => { setAddingPartner(false); setNewPartner({ name: '', website: '', logo: null }); }}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="text-center my-2">
                    <button className="btn color-background-dark" style={{ color: '#f2f7ff', width: '80px' }} onClick={() => navigate("/admin/edit_info")}>Back</button>
                </div>
            </div>
            {
            showConfirm && (
                <ConfirmDialog
                    message="Are you sure you want to delete this partner? This action is irreversible."
                    onConfirm={handleDelete}
                    onCancel={() => setShowConfirm(false)}
                    isLoading={deleting}
                />
            )
        }
        </>
    );
};

export default EditPartners;
