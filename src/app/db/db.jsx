import mongoose from "mongoose";

export function connectKaro() {
  if (mongoose.connection.readyState >= 1) {
    console.log("DB is already connected");
    return;
  }

  mongoose
    .connect("mongodb://localhost:27017/userDetails", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((connect) => {
      console.log("DB connected:", connect.connection.name);
    })
    .catch((err) => {
      console.error("DB connection error:", err.message);
    });
}
