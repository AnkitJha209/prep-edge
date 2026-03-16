import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function RootLayout() {
    return (
        <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground">
            <div className="pointer-events-none fixed inset-x-0 top-[-12rem] z-0 h-[30rem] bg-[radial-gradient(circle_at_center,rgba(89,112,255,0.24),transparent_58%)] blur-3xl" />
            <div className="pointer-events-none fixed inset-x-0 top-[18rem] z-0 h-[24rem] bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.1),transparent_56%)] blur-3xl" />
            <Navbar />
            <main className="relative z-10 flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
