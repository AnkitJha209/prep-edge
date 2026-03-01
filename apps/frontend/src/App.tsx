import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootLayout from "@/components/layout/RootLayout";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import Jobs from "@/pages/Jobs";
import JobDetail from "@/pages/JobDetail";
import Apply from "@/pages/Apply";
import InterviewRoom from "@/pages/InterviewRoom";
import InterviewReport from "@/pages/InterviewReport";
import RecruiterJobs from "@/pages/RecruiterJobs";
import CreateJob from "@/pages/CreateJob";
import NotFound from "@/pages/NotFound";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<RootLayout />}>
                    {/* Public */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/jobs" element={<Jobs />} />
                    <Route path="/jobs/:jobId" element={<JobDetail />} />

                    {/* Authenticated */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route
                            path="/report/:reportId"
                            element={<InterviewReport />}
                        />
                    </Route>

                    {/* Candidate only */}
                    <Route
                        element={
                            <ProtectedRoute allowedRoles={["CANDIDATE"]} />
                        }
                    >
                        <Route path="/apply/:jobId" element={<Apply />} />
                        <Route path="/interview" element={<InterviewRoom />} />
                    </Route>

                    {/* Recruiter only */}
                    <Route
                        element={
                            <ProtectedRoute allowedRoles={["RECRUITER"]} />
                        }
                    >
                        <Route
                            path="/recruiter/jobs"
                            element={<RecruiterJobs />}
                        />
                        <Route
                            path="/recruiter/jobs/create"
                            element={<CreateJob />}
                        />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
