import React from 'react';
import { useRouteError } from 'react-router-dom';

const ErrorPage = () => {
    const error = useRouteError();
    console.error(error);

    return (
        <div className="text-center p-4">
            <h1>Oops!</h1>
            <p>Something went wrong.</p>
            <p style={{ color: 'red' }}>
                {error.statusText || error.message}
            </p>
        </div>
    );
};

export default ErrorPage;
