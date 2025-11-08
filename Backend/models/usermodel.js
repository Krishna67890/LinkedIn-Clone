import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    profileImage: {
        type: String,
        default: ""
    },
    coverImage: {
        type: String,
        default: ""
    },
    headline: {
        type: String,
        default: ""
    },
    location: {
        type: String,
        default: "India"
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        default: "other"
    },
    skills: [{
        type: String
    }],
    education: [{
        college: {
            type: String
        },
        degree: {
            type: String
        },
        fieldOfStudy: {
            type: String
        }
    }],
    experience: [{
        title: {
            type: String
        },
        company: {
            type: String
        },
        description: {
            type: String
        }
    }],
    connections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }]
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);

export default User;