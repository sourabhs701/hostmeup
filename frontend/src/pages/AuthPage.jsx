import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';


const AuthPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");

        if (token) {
            localStorage.setItem("token", token);
            navigate("/dashboard");
        } else {
            navigate("/");
        }
    }, [location.search]);

    return (<></>
    )
}

export default AuthPage