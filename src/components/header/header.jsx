"use client"; 
import React, { useEffect } from "react";
import "./header.css";
import Link from "next/link";
import { addUser, Logout } from "@/store/slice/user";
import { Provider, useDispatch, useSelector } from "react-redux";
import { merastore } from "@/store/store";
import axios from "axios";
import axiosInstance from "@/utils/axiosInstance";
import { jwtDecode } from "jwt-decode";
export default function Page() {
  return (
    <Provider store={merastore}>
      <Header />
    </Provider>
  );
}
function Header() {
  let dispatch = useDispatch();
  let users = useSelector((store) => store.user);

  useEffect(() => {
    let token = localStorage.getItem("token");
    console.log("token: ", token)
    if (token) {
      try {
        const decoded = jwtDecode(token);
        dispatch(addUser(decoded));
      } catch (error) {
        localStorage.removeItem("token")
        alert(error)
      }
    }
  }, []);
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <ul className="navbar-nav mr-auto">
          <Link className="navbar-brand" href="/">
            JustWatch
          </Link>
          {users.isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  onClick={() => {
                    dispatch(Logout());
                    console.log(users);
                  }}
                  href="/login"
                >
                  Logout
                </Link>
              </li>
              <li>
                <Link className="nav-link" href="/favouritesMovie">
                  WishList
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" href="/signup">
                  SignUp
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" href="/login">
                  Login
                </Link>
              </li>
            </>
          )}
        </ul>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto"></ul>
          <form className="form-inline search-form ml-auto">
            <input
              className="form-control mr-sm-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button
              className="btn btn-outline-success my-2 my-sm-0"
              type="submit"
            >
              Search
            </button>
          </form>
        </div>
      </nav>
    </div>
  );
}
