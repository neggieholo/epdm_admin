import React, { useState } from 'react'
import { toast } from 'react-toastify';

const projectFieldMappings = {
    projectName: "Project Name",
    location: "Location",
    capacity: "Capacity",
    client: "Client",
    clientHomeCounty: "Client Home Country",
    projectPartnersStakeholders: "Project Partners/Stakeholders",
    mainContractor: "Main Contractor",
    estimatedBudget: "Estimated Budget",
    contractValue: "Contract Value",
    localSpending: "Local Spending",
    foreignSpending: "Foreign Spending",
    projectScope: "Project Scope",
    awardDate: "Award Date",
    projectStartUpDate: "Project Start-up Date",
    projectCompletionDate: "Project Completion Date",
    projectStatus: "Project Status",
    projectSchedule: "Project Schedule",
    localContentPlans: "Local Content Plans",
    majorMilestones: "Major Milestones",
    projectOverview: "Project Overview",
    classification: "Classification",
    projectFinance: "Project Finance",
    businessOpportunities: 'Business Opportunities',
    projectSize: 'Project Size',
    subContractors: "Sub-Contractors",
    section: "Section",

    // Client-side project manager details
    projectManagerNameClient: "Project Manager Name (Client)",
    projectManagerTelephoneClient: "Project Manager Telephone (Client)",
    projectManagerEmailClient: "Project Manager Email (Client)",
    projectCoordinatorNameClient: "Project Coordinator Name (Client)",
    projectCoordinatorTelephoneClient: "Project Coordinator Telephone (Client)",
    projectCoordinatorEmailClient: "Project Coordinator Email (Client)",
    projectProcurementManagerNameClient: "Project Procurement Manager Name (Client)",
    projectProcurementManagerTelephoneClient: "Project Procurement Manager Telephone (Client)",
    projectProcurementManagerEmailClient: "Project Procurement Manager Email (Client)",
    projectLocalContentManagerClient: "Project Local Content Manager(Client)",

    // Main contractor project manager details
    projectManagerNameMainContractor: "Project Manager Name (Main Contractor)",
    projectManagerTelephoneMainContractor: "Project Manager Telephone (Main Contractor)",
    projectManagerEmailMainContractor: "Project Manager Email (Main Contractor)",
    projectCoordinatorNameMainContractor: "Project Coordinator Name (Main Contractor)",
    projectCoordinatorTelephoneMainContractor: "Project Coordinator Telephone (Main Contractor)",
    projectCoordinatorEmailMainContractor: "Project Coordinator Email (Main Contractor)",
    projectProcurementManagerNameMainContractor: "Project Procurement Manager Name (Main Contractor)",
    projectProcurementManagerTelephoneMainContractor: "Project Procurement Manager Telephone (Main Contractor)",
    projectProcurementManagerEmailMainContractor: "Project Procurement Manager Email (Main Contractor)",
    projectLocalContentManagerMainContractor: "Project Local Content Manager (MainContractor)",
};


export const fetchProject = async (id) => {
    const apiUrl = import.meta.env.VITE_API_URL;

    try {
        const response = await fetch(`${apiUrl}/new-project/findProject/${id}`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.project) {
            const filtered = data.project; // fix undefined `filtered`
            const id = data.project.projectId
            const renamed = {}; // must initialize

            for (const [backendKey, displayKey] of Object.entries(projectFieldMappings)) {
                renamed[displayKey] = filtered[backendKey] ?? "";
                // fallback to "" if backend didn’t provide it
            }
            return { project: renamed, projectId: id  };
        } else {
            return { error: data.error || "Project not found" };
        }

    } catch (error) {
        console.error('Failed to fetch project:', error);
        return { error: error.message || "An error occurred" };
    }
};

export const convertProjectKeysForBackend = (updateData) => {
    const reverseMap = {};
    for (const key in projectFieldMappings) {
        reverseMap[projectFieldMappings[key]] = key;
    }

    const converted = {};
    for (const displayKey in updateData) {
        const dbKey = reverseMap[displayKey] || displayKey;
        converted[dbKey] = updateData[displayKey];
    }

    return converted;
};

export async function deleteProject(id) {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
        const response = await fetch(`${apiUrl}/new-project/delete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ projectId: id })
        });

        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }

        const result = await response.json();
        console.log("Project deleted successfully:", result);
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.error);
        }
    } catch (error) {
        console.error("Error deleting project:", error);
        toast.error(error)
    }

}

export const cleanUserData = (users) => {
    return users.map(user => ({
        Username: user.username,
        Email: user.email,
        "Phone Number": user.phone,
        Company: user.company || "",
        "Nature of Business": user.nature,
        Position: user.position,
        Address: user.address
    }));
};

export function formatUser(user) {
    if (!user) return null;

    const mapping = {
        username: "Username",
        email: "Email",
        phone: "Phone",
        position: "Position",
        company: "Company",
        address: "Address",
        nature: "Nature",
        subscribed: "Subscribed",
        subscriptionExpiry: "Subscription Expiry",
        favProjects: "Favourite Projects",
        subscribedProjects: "Subscribed Projects",
        emailVerified: "Email Verified",
        createdAt: "Registered At",
        updatedAt: "Last Updated"
    };

    const cleanUser = {};

    // Keep raw ID for internal usage
    if (user._id) {
        cleanUser._id = user._id;
    }

    Object.keys(mapping).forEach((key) => {
        if (user[key] !== undefined && user[key] !== null) {
            let value = user[key];

            // ✅ Handle ISO date strings or Date objects
            if (
                typeof value === "string" &&
                /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
            ) {
                value = new Date(value).toLocaleString();
            } else if (value instanceof Date) {
                value = value.toLocaleString();
            }

            // ✅ Handle arrays
            if (Array.isArray(value)) {
                value = value.length ? value.join(", ") : "None";
            }

            // ✅ Handle booleans nicely
            if (typeof value === "boolean") {
                value = value ? "Yes" : "No";
            }

            cleanUser[mapping[key]] = value;
        }
    });

    return cleanUser;
}

