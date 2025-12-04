import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const platforms = ["x", "facebook", "linkedin", "instagram", "snapchat", "youtube", "tiktok"];

const SocialLinksEditor = () => {
    const [links, setLinks] = useState({});
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLinks = async () => {
            try {
                const res = await fetch(`${apiUrl}/terms_socials/social_links`);
                const data = await res.json();
                if (data.success) {
                    console.log("Fetched social links:", data.links, "Fetched subscription:", data.subscription);
                    const mapped = {};
                    data.links.forEach(l => mapped[l.platform] = l.url);
                    setLinks(mapped);
                    setSubscription(data.subscription.value.toString() );
                    console.log("Fetched payment amount:", data.subscription.value);
                }
            } catch (err) {
                toast.error(err.message || "Failed to load social links");
            } finally {
                setLoading(false);
            }
        };
        fetchLinks();
    }, [apiUrl]);

    const handleChange = (platform, value) => {
        setLinks(prev => ({ ...prev, [platform]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const formatted = platforms
                .filter(p => links[p])
                .map(p => {
                    let url = links[p].trim();
                    if (!/^https?:\/\//i.test(url)) {
                        url = "https://" + url; // default to https
                    }
                    return { platform: p, url };
                });

            console.log("Saving links:", formatted);

            const res = await fetch(`${apiUrl}/terms_socials/social_links/save`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ links: formatted, subscription: { value: Number(subscription) } }),
                credentials: "include",
            });

            const data = await res.json();
            if (data.success) {
                toast.success("Social links saved successfully");
            } else {
                console.log("Social links error:", data.error);
                toast.error(data.error || "Failed to save");
            }
        } catch (err) {
            toast.error("Server error");
            console.log("Server error:", err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div
            className="container mt-3 color-background p-3 m-2"
            style={{ borderRadius: "10px", width: "70%", maxWidth: "900px", minWidth: "350px" }}
        >
            <h5>Social Media Links</h5>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {platforms.map((platform) => (
                        <div className="mb-3" key={platform}>
                            <label className="form-label text-capitalize">
                                {platform === "x" ? "X (Twitter)" : platform}
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder={`Enter ${platform} URL`}
                                value={links[platform] || ""}
                                onChange={(e) => handleChange(platform, e.target.value)}
                            />
                        </div>
                    ))}
                        <div className="mb-3">
                            <label className="form-label text-capitalize">
                                Subscription Amount
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Enter Subscription Amount"
                                value={subscription || ""}
                                onChange={(e) => setSubscription(e.target.value)}
                            />
                        </div>
                </>
            )}

            <div className="d-flex gap-2">
                <button
                    className="btn color-background-dark text-light"
                    style={{ width: "80px" }}
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? (
                        <div className="spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Saving...</span>
                        </div>
                    ) : (
                        "Save"
                    )}
                </button>
                <button
                    className="btn color-background-dark text-light"
                    style={{ width: "80px" }}
                    onClick={() => navigate("/admin/edit_info")}
                >
                    Back
                </button>
            </div>
        </div>
    );
};

export default SocialLinksEditor;
