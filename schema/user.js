/* eslint-disable no-unused-vars */
const userProfile = {
    _id: "xk4id0u3j4", // mandatory & auto-generated
    uuid: "93499849382929838", // mandatory & auto-generated
    first_name: "Bassam", // mandatory
    last_name: "mutairi", // optional
    bio: "Self-sufficient and reliable professional with 6 years of experience in software development. Successfully led various teams to build technological products, focusing on mobile and web applications.", // optional
    username: "mutairibassam", // mandatory
    email: "mutairibassam@gmail.com", // mandatory
    mobile: "0511111111", // optional
    external_links: {
        // all optional
        linkedin: "https://...",
        github: "https://...",
        twitter: "https://...",
        portfolio: "https://...",
    },
    createdAt: "19/02/2039", // mandatory & auto-generated,
    updatedAt: "20/02/2039", // mandatory & auto-generated,
};

const userPost = {
    _id: "s9d8f79s", // mandatory & auto-generated
    username: "ref:username -> mutairibassam", // mandatory
    location: "ref:shopId -> 1", // mandatory
    interest: ["nodejs", "ci/cd", "python"], // mandatory
    date: "19/03/2039", // mandatory
    from: "09:00 PM", // mandatory
    to: "10:00 PM", // mandatory
    slots: "3", // mandatory
    occupied: "0", // mandatory & default to 0 & can't be more than slots
    status: "1", // mandatory -> [1 open, 2 deleted, 3 expired]
    createdAt: "19/02/2039", // mandatory & auto-generated,
    updatedAt: "20/02/2039", // mandatory & auto-generated,
};
