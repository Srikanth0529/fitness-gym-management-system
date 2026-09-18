import { z } from "zod";

export const profileSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(1, "First name is required")
        .max(100, "First name cannot exceed 100 characters"),

    lastName: z
        .string()
        .trim()
        .min(1, "Last name is required")
        .max(100, "Last name cannot exceed 100 characters"),

    phone: z
        .string()
        .trim()
        .max(20, "Phone cannot exceed 20 characters")
        .optional()
        .or(z.literal("")),

    dateOfBirth: z
        .string()
        .optional()
        .or(z.literal("")),

    gender: z
        .string()
        .max(20, "Gender cannot exceed 20 characters")
        .optional()
        .or(z.literal("")),

    address: z
        .string()
        .trim()
        .max(500, "Address cannot exceed 500 characters")
        .optional()
        .or(z.literal("")),
});