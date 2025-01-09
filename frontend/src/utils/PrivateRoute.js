import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const user = localStorage.getItem("refresh");
    return user ? children : <Navigate to="/auth/login" />;
};

export default PrivateRoute;