import {
    LayoutDashboard,
    User,
    CreditCard,
    CalendarDays,
} from "lucide-react";

export const navigationConfig = {
    MEMBER: [
        {
            label: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard,
        },

        {
            label: "My Profile",
            path: "/member/profile",
            icon: User,
        },

        {
            label: "Membership",
            path: "/member/membership",
            icon: CreditCard,
        },

        {
            label: "Classes",
            path: "/member/classes",
            icon: CalendarDays,
        },
    ],

    TRAINER: [
        {
            label: "Dashboard",
            path: "/trainer/dashboard",
            icon: LayoutDashboard,
        },

        {
            label: "Class Management",
            path: "/trainer/classes",
            icon: CalendarDays,
        },
    ],

    ADMIN: [
        {
            label: "Dashboard",
            path: "/admin/dashboard",
            icon: LayoutDashboard,
        },

        {
            label: "Class Management",
            path: "/admin/classes",
            icon: CalendarDays,
        },
    ],
};