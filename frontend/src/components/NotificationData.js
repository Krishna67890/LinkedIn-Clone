// src/components/Notifications/notificationData.js
import dp from "../assets/dp.webp";

export const notificationTemplates = [
  {
    type: "connection_request",
    title: "Connection Request",
    messageTemplates: [
      "{name} wants to connect with you",
      "{name} sent you a connection request",
      "Connect with {name} to expand your network"
    ],
    actionRequired: true,
    icon: "👥",
    color: "blue"
  },
  {
    type: "post_like",
    title: "Post Liked",
    messageTemplates: [
      "{name} liked your post",
      "{name} appreciated your recent post",
      "Your post got a like from {name}"
    ],
    actionRequired: false,
    icon: "❤️",
    color: "red"
  },
  {
    type: "comment",
    title: "New Comment",
    messageTemplates: [
      "{name} commented on your post",
      "{name} replied to your post",
      "New comment from {name} on your article"
    ],
    actionRequired: false,
    icon: "💬",
    color: "green"
  },
  {
    type: "mention",
    title: "You were mentioned",
    messageTemplates: [
      "{name} mentioned you in a post",
      "{name} tagged you in their update",
      "You were referenced by {name}"
    ],
    actionRequired: false,
    icon: "📍",
    color: "purple"
  },
  {
    type: "connection_accepted",
    title: "Connection Accepted",
    messageTemplates: [
      "{name} accepted your connection request",
      "You're now connected with {name}",
      "{name} confirmed your connection"
    ],
    actionRequired: false,
    icon: "✅",
    color: "green"
  },
  {
    type: "job_recommendation",
    title: "Job Recommendation",
    messageTemplates: [
      "New job matching your profile: {randomJob}",
      "Recommended position: {randomJob}",
      "Job opportunity: {randomJob}"
    ],
    actionRequired: false,
    icon: "💼",
    color: "orange"
  },
  {
    type: "message",
    title: "New Message",
    messageTemplates: [
      "{name} sent you a message",
      "You have a new message from {name}",
      "{name} wants to chat with you"
    ],
    actionRequired: false,
    icon: "✉️",
    color: "blue"
  },
  {
    type: "event",
    title: "Event Invitation",
    messageTemplates: [
      "{name} invited you to an event",
      "You're invited to {randomEvent} by {name}",
      "Event invitation from {name}"
    ],
    actionRequired: true,
    icon: "📅",
    color: "yellow"
  }
];

export const userNames = [
  { firstName: "Alex", lastName: "Thompson", profileImage: dp },
  { firstName: "Maria", lastName: "Garcia", profileImage: dp },
  { firstName: "James", lastName: "Wilson", profileImage: dp },
  { firstName: "Sophia", lastName: "Chen", profileImage: dp },
  { firstName: "Ryan", lastName: "Miller", profileImage: dp },
  { firstName: "Emma", lastName: "Davis", profileImage: dp },
  { firstName: "Michael", lastName: "Brown", profileImage: dp },
  { firstName: "Sarah", lastName: "Johnson", profileImage: dp }
];

export const randomEvents = [
  "Tech Conference 2024",
  "Networking Meetup",
  "Workshop on AI",
  "Team Building Activity",
  "Product Launch",
  "Industry Summit",
  "Career Fair",
  "Hackathon Event"
];

export const randomJobs = [
  "Senior Frontend Developer at TechCorp",
  "Product Manager at InnovateInc",
  "Data Scientist at DataWorks",
  "UX Designer at CreativeLabs",
  "Full Stack Developer at StartupXYZ",
  "DevOps Engineer at CloudSystems",
  "Machine Learning Engineer at AI Labs",
  "Technical Lead at Enterprise Solutions"
];

export const randomComments = [
  "Great post!",
  "Interesting perspective",
  "Thanks for sharing this",
  "I completely agree",
  "This is very helpful",
  "Well said!",
  "Great insights!",
  "Looking forward to more"
];