import { z } from "zod/v4";

export const signUpSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["CANDIDATE", "RECRUITER"]).optional(),
});

export const signInSchema = z.object({
    email: z.email("Please enter a valid email"),
    password: z.string().min(1, "Password is required"),
});

export const createJobSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z
        .string()
        .min(20, "Description must be at least 20 characters"),
    requirements: z.string().min(3, "Enter at least one requirement"),
    location: z.string().optional(),
    salary: z.string().optional(),
    type: z.enum([
        "FULL_TIME",
        "PART_TIME",
        "CONTRACT",
        "INTERNSHIP",
        "FREELANCE",
    ]),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type CreateJobInput = z.infer<typeof createJobSchema>;
