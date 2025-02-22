import { SidebarLink } from "@/types";

export const themes = [
    { value: "light", label: "Light", icon: "/assets/icons/sun.svg" },
    { value: "dark", label: "Dark", icon: "/assets/icons/moon.svg" },
    { value: "system", label: "System", icon: "/assets/icons/computer.svg" },
];

export const sidebarLinks: SidebarLink[] = [
    {
        imgURL: "/assets/icons/home.svg",
        route: "/",
        label: "Home",
    },
    {
        imgURL: "/assets/icons/users.svg",
        route: "/community",
        label: "Community",
    },
    {
        imgURL: "/assets/icons/star.svg",
        route: "/collection",
        label: "Collections",
    },
    {
        imgURL: "/assets/icons/suitcase.svg",
        route: "/jobs",
        label: "Find Jobs",
    },
    {
        imgURL: "/assets/icons/tag.svg",
        route: "/tags",
        label: "Tags",
    },
    {
        imgURL: "/assets/icons/user.svg",
        route: "/profile",
        label: "Profile",
    },
    {
        imgURL: "/assets/icons/question.svg",
        route: "/ask-question",
        label: "Ask a question",
    },
];

export const BADGE_CRITERIA = {
    QUESTION_COUNT: {
        BRONZE: 10,
        SILVER: 50,
        GOLD: 100,
    },
    ANSWER_COUNT: {
        BRONZE: 10,
        SILVER: 50,
        GOLD: 100,
    },
    QUESTION_UPVOTES: {
        BRONZE: 10,
        SILVER: 50,
        GOLD: 100,
    },
    ANSWER_UPVOTES: {
        BRONZE: 10,
        SILVER: 50,
        GOLD: 100,
    },
    TOTAL_VIEWS: {
        BRONZE: 1000,
        SILVER: 10000,
        GOLD: 100000,
    },
};

export const questions = [
    {
        _id: "1",
        title: "Cascading Deletes in SQLAlchemy",
        tags: [
            { _id: "1", name: "python" },
            { _id: "2", name: "sql" },
        ],
        author: {
            _id: "1",
            name: "John Doe",
            picture: "john-doe.jpg",
        },
        upvotes: 10,
        views: 500552,
        answers: [],
        createdAt: new Date("2021-09-01T12:00:00.000Z"),
    },
    {
        _id: "2",
        title: "How to center a div?",
        tags: [
            { _id: "3", name: "css" },
            { _id: "4", name: "html" },
        ],
        author: {
            _id: "2",
            name: "Jane Smith",
            picture: "jane-smith.jpg",
        },
        upvotes: 5,
        views: 50,
        answers: [],
        createdAt: new Date("2021-09-02T10:30:00.000Z"),
    },
];
