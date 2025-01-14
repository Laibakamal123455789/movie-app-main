"use client";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { merastore } from "@/store/store"; // Import store
import { Provider } from "react-redux";

export default function Page() {
  return (
    <Provider store={merastore}>
      <Users />
    </Provider>
  );
}

function Users() {
  const [users, setUsers] = useState([]);
  const currentUser = useSelector((state) => state.user.currentUser); 
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
      return;
    }
    axios
      .get("/api/auth")
      .then((resp) => {
        setUsers(resp.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, [currentUser, router]); 

  return (
    <div>
      <h1>Welcome, {currentUser?.email}</h1>
      <table border="1">
        <thead>
          <tr>
            <th>Email</th>
            <th>Password</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.email}</td>
              <td>{user.password}</td>
              <td>
                <button
                  onClick={async () => {
                    try {
                      if (confirm("Are you sure you want to delete this?")) {
                  
                        const resp = await axios.delete(`/api/auth?anc=${user._id}`);
                        if (resp.data.success) {
                          setUsers(users.filter((cUser) => cUser._id !== user._id));
                        } else {
                          alert("Failed to delete the user.");
                        }
                      }
                    } catch (e) {
                      console.log(e);
                      alert("An error occurred while trying to delete the user.");
                    }
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
