import {useNavigate} from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const PrivateRoute = ({ children }: { children: any }) => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (isAuthenticated === null) return <div>Loading...</div>;
    if (!isAuthenticated) return navigate("/");
    return children;
};