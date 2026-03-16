import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { logout } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sparkles, LogOut, LayoutDashboard, User, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
    const { isAuthenticated, user } = useAppSelector((s) => s.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    return (
        <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6">
            <div className="glass-panel mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 py-3 sm:px-5">
                <Link
                    to="/"
                    className="flex items-center gap-3 transition-opacity hover:opacity-80"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/30 bg-primary/18 text-primary shadow-[0_10px_30px_-20px_rgba(88,110,255,0.9)]">
                        <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                        <span className="block text-base font-extrabold tracking-tight sm:text-lg">
                            PrepEdge
                        </span>
                        <span className="hidden font-mono text-[0.62rem] uppercase tracking-[0.24em] text-muted-foreground sm:block">
                            Interview Intelligence
                        </span>
                    </div>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden items-center gap-2 md:flex">
                    <Link to="/jobs">
                        <Button variant="ghost" size="sm">
                            Browse Jobs
                        </Button>
                    </Link>

                    {!isAuthenticated ? (
                        <div className="ml-4 flex items-center gap-2">
                            <Link to="/login">
                                <Button variant="ghost" size="sm">
                                    Sign In
                                </Button>
                            </Link>
                            <Link to="/signup">
                                <Button size="sm">Get Started</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="ml-4 flex items-center gap-2">
                            <Link to="/dashboard">
                                <Button variant="ghost" size="sm">
                                    <LayoutDashboard className="mr-1.5 h-4 w-4" />
                                    Dashboard
                                </Button>
                            </Link>
                            {user?.role === "RECRUITER" && (
                                <Link to="/recruiter/jobs">
                                    <Button variant="ghost" size="sm">
                                        My Jobs
                                    </Button>
                                </Link>
                            )}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="ml-2 gap-2"
                                    >
                                        <User className="h-4 w-4" />
                                        <span className="max-w-24 truncate">
                                            {user?.email}
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-48"
                                >
                                    <DropdownMenuItem
                                        disabled
                                        className="text-xs text-muted-foreground"
                                    >
                                        {user?.role}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="text-destructive"
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Sign Out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}
                </nav>

                {/* Mobile hamburger */}
                <button
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-white/[0.04] text-foreground md:hidden"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    {mobileOpen ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <Menu className="h-5 w-5" />
                    )}
                </button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="glass-panel mx-auto mt-3 max-w-7xl rounded-[1.75rem] px-4 pb-4 pt-3 md:hidden">
                    <div className="flex flex-col gap-2">
                        <Link to="/jobs" onClick={() => setMobileOpen(false)}>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start"
                            >
                                Browse Jobs
                            </Button>
                        </Link>
                        {!isAuthenticated ? (
                            <>
                                <Link
                                    to="/login"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full justify-start"
                                    >
                                        Sign In
                                    </Button>
                                </Link>
                                <Link
                                    to="/signup"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    <Button size="sm" className="w-full">
                                        Get Started
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/dashboard"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full justify-start"
                                    >
                                        Dashboard
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start text-destructive"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sign Out
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
