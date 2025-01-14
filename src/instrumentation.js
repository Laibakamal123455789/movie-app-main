import { connectKaro } from "./app/db/db";

export function register() {
  connectKaro();
  console.log("Register function executed");
}
