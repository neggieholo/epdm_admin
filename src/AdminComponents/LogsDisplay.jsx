import React from 'react';

function formatLogsToList(logs) {
    return logs.map(log => (
        <ul key={log.date} style={{ marginBottom: '1rem' }}>
            <li style={{ fontWeight: 'bold', listStyleType: 'none' }}>
                📅 {log.date}
            </li>
            {log.users.map(user => (
                <li key={user.userId}>
                    👤 {user.username} — {user.email} — {user.position}
                </li>
            ))}
        </ul>
    ));
}

const UserLogList = ({ logs }) => {
    if (!logs || logs.length === 0) return <p>No logs found.</p>;

    return (
        <div className="user-log-list">
            {logs.flatMap(log =>
                log.users.map(user => (
                    <ul key={user.userId + '-' + log.date} className="mb-3">
                        <li><strong>Date:</strong> {log.date}</li>
                        <li><strong>Username:</strong> {user.username}</li>
                        <li><strong>Email:</strong> {user.email}</li>
                        <li><strong>Position:</strong> {user.position}</li>
                        <li><strong>Phone:</strong> {user.phone}</li>
                    </ul>
                ))
            )}
        </div>
    );
};

export default UserLogList
