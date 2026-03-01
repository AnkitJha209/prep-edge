import { useAppSelector } from "@/hooks/useStore";
import { Navigate } from "react-router-dom";
import CandidateDashboard from "./CandidateDashboard";
import RecruiterDashboard from "./RecruiterDashboard";
import AdminDashboard from "./AdminDashboard";

export default function Dashboard() {
    const { user } = useAppSelector((s) => s.auth);

    if (!user) return <Navigate to="/login" replace />;

    switch (user.role) {
        case "CANDIDATE":
            return <CandidateDashboard />;
        case "RECRUITER":
            return <RecruiterDashboard />;
        case "ADMIN":
            return <AdminDashboard />;
        default:
            return <Navigate to="/" replace />;
    }
}
