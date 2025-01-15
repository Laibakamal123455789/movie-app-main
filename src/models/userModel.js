import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    otp: String,
    otpExpiry: Date,

    favouriteMovies: [
      {
        movieId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Movie",
        },
        title: {
          type: String,
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
        imageUrl: { 
          type: String,
           required: false,
         default: "https://via.placeholder.com/150" }, 
        originalId: {
          type: String,
          default: "",
          required:false
        }
      },
    ],
  },
  { timestamps: true }
);

export const User = mongoose.models.user || mongoose.model("user", userSchema);
