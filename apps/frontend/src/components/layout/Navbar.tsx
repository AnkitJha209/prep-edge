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
        <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
                <Link
                    to="/"
                    className="flex items-center gap-2 transition-opacity hover:opacity-80"
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                        <Sparkles className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span className="text-lg font-bold tracking-tight">
                        PrepEdge
                    </span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden items-center gap-1 md:flex">
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
                    className="md:hidden"
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
                <div className="border-t border-border/50 bg-background px-4 pb-4 pt-2 md:hidden">
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
