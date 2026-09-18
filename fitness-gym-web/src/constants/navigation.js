import {
    LayoutDashboard,
    User,
    CreditCard,
    CalendarDays,
    CalendarCheck,
    Dumbbell,
    TrendingUp,
    ClipboardCheck,
    Users,
    UserCog,
    BadgeCheck,
    WalletCards,
    BarChart3,
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
            icon: CalendarCheck,
        },
        {
            label: "Workouts",
            path: "/member/workouts",
            icon: Dumbbell,
        },
        {
            label: "Progress",
            path: "/member/progress",
            icon: TrendingUp,
        },
        {
            label: "Attendance",
            path: "/member/attendance",
            icon: ClipboardCheck,
        },
    ],

    TRAINER: [
        {
            label: "Dashboard",
            path: "/trainer/dashboard",
            icon: LayoutDashboard,
        },
        {
            label: "My Clients",
            path: "/trainer/clients",
            icon: Users,
        },
        {
            label: "Schedule",
            path: "/trainer/schedule",
            icon: CalendarDays,
        },
        {
            label: "Training Sessions",
            path: "/trainer/sessions",
            icon: CalendarCheck,
        },
        {
            label: "Workout Plans",
            path: "/trainer/workout-plans",
            icon: Dumbbell,
        },
        {
            label: "Client Progress",
            path: "/trainer/progress",
            icon: TrendingUp,
        },
        {
            label: "Attendance",
            path: "/trainer/attendance",
            icon: ClipboardCheck,
        },
    ],

    ADMIN: [
        {
            label: "Dashboard",
            path: "/admin/dashboard",
            icon: LayoutDashboard,
        },
        {
            label: "User Management",
            path: "/admin/users",
            icon: Users,
        },
        {
            label: "Member Management",
            path: "/admin/members",
            icon: Users,
        },
        {
            label: "Trainer Management",
            path: "/admin/trainers",
            icon: UserCog,
        },
        {
            label: "Membership Plans",
            path: "/admin/membership-plans",
            icon: CreditCard,
        },
        {
            label: "Subscriptions",
            path: "/admin/subscriptions",
            icon: BadgeCheck,
        },
        {
            label: "Payments",
            path: "/admin/payments",
            icon: WalletCards,
        },
        {
            label: "Class Management",
            path: "/admin/classes",
            icon: CalendarDays,
        },
        {
            label: "Bookings",
            path: "/admin/bookings",
            icon: CalendarCheck,
        },
        {
            label: "Attendance",
            path: "/admin/attendance",
            icon: ClipboardCheck,
        },
        {
            label: "Equipment",
            path: "/admin/equipment",
            icon: Dumbbell,
        },
        {
            label: "Reports & Analytics",
            path: "/admin/reports",
            icon: BarChart3,
        },
    ],
};