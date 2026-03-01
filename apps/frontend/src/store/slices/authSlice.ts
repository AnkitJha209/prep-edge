import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User, UserRole } from "@/types";

interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
}

// Decode JWT payload (without verifying)
function decodeToken(
    token: string,
): { id: string; email: string; role: UserRole } | null {
    try {
        const payload = token.split(".")[1];
        if (!payload) return null;
        return JSON.parse(atob(payload));
    } catch {
        return null;
    }
}

function getInitialState(): AuthState {
    const token = localStorage.getItem("token");
    if (token) {
        const decoded = decodeToken(token);
        if (decoded) {
            return {
                token,
                user: {
                    id: decoded.id,
                    email: decoded.email,
                    role: decoded.role,
                    firstName: "",
                    lastName: "",
                    createdAt: "",
                    updatedAt: "",
                },
                isAuthenticated: true,
            };
        }
    }
    return { token: null, user: null, isAuthenticated: false };
}

const authSlice = createSlice({
    name: "auth",
    initialState: getInitialState(),
    reducers: {
        setCredentials(
            state,
            action: PayloadAction<{ token: string; user?: User }>,
        ) {
            const { token, user } = action.payload;
            state.token = token;
            localStorage.setItem("token", token);

            if (user) {
                state.user = user;
            } else {
                const decoded = decodeToken(token);
                if (decoded) {
                    state.user = {
                        id: decoded.id,
                        email: decoded.email,
                        role: decoded.role,
                        firstName: "",
                        lastName: "",
                        createdAt: "",
                        updatedAt: "",
                    };
                }
            }
            state.isAuthenticated = true;
        },
        logout(state) {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem("token");
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
