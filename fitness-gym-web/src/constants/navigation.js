import {
    LayoutDashboard,
    User,
    CreditCard,
    CalendarDays,
    ClipboardList,
    Users,
    UserCog,
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

        {
            label: "My Bookings",
            path: "/member/bookings",
            icon: ClipboardList,
        },

    ],


    TRAINER: [

        {
            label: "Dashboard",
            path: "/trainer/dashboard",
            icon: LayoutDashboard,
        },

        {
            label: "My Profile",
            path: "/trainer/profile",
            icon: User,
        },

        {
            label: "Class Management",
            path: "/trainer/classes",
            icon: CalendarDays,
        },

        {
            label: "My Clients",
            path: "/trainer/clients",
            icon: Users,
        },

        {
            label: "Bookings",
            path: "/trainer/bookings",
            icon: ClipboardList,
        },

    ],


    ADMIN: [

        {
            label: "Dashboard",
            path: "/admin/dashboard",
            icon: LayoutDashboard,
        },

        {
            label: "My Profile",
            path: "/admin/profile",
            icon: User,
        },

        {
            label: "Members",
            path: "/admin/members",
            icon: Users,
        },

        {
            label: "Trainers",
            path: "/admin/trainers",
            icon: UserCog,
        },

        {
            label: "Class Management",
            path: "/admin/classes",
            icon: CalendarDays,
        },

        {
            label: "Bookings",
            path: "/admin/bookings",
            icon: ClipboardList,
        },

    ],
};