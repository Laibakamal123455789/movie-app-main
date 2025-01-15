"use client";
import { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {addToFavourites,setFavourites, removeFromFavourites,} from "@/store/slice/moviesFavourite";
import { useRouter } from "next/navigation";
import { merastore } from "@/store/store";
import Image from "next/image";
import "./fav.css";
import Link from "next/link";
import { toast } from "react-toastify";

export default function Page() {
  return (
    <Provider store={merastore}>
      <Wishlist />
    </Provider>
  );
}

function Wishlist() {
  const { favouriteMovies } = useSelector((state) => state.movieSlice);
  const isAuthenticated = useSelector((store) => store.user.isAuthenticated);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      const fetchWishlist = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            console.error("Token not found in localStorage");
            return;
          }

          const response = await axios.get("/api/auth/wishlist", {
            headers: { Authorization: `Bearer ${token}` },
          });

          dispatch(setFavourites(response.data.favouriteMovies || []));
        } catch (error) {
          console.error("Error fetching wishlist:", error);
        }
      };

      fetchWishlist();
    }
  }, [isAuthenticated, dispatch]);

  const handleDeleteFromWishlist = async (movieId) => {
    if (!isAuthenticated) {
      alert("Please log in to manage your wishlist.");
      router.push("/login");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token not found in localStorage");
        alert("No valid token found.");
        return;
      }

      const response = await axios.delete("/api/auth/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: { movieId },
      });

      if (response.status === 200) {
        dispatch(removeFromFavourites(movieId));
        toast.success("Movie deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting movie:", error);
      if (error.response) {
        alert(error.response.data.message || "Failed to delete the movie.");
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="my-wishlist-container">
      <h1 className="my-wishlist-header">Your Wishlist</h1>
      <div className="my-movie-grid">
        {favouriteMovies.length > 0 ? (
          favouriteMovies.map((movie) => (
            <div key={movie.movieId} className="my-movie-card">
              <button
                className="my-remove-button"
                onClick={() => handleDeleteFromWishlist(movie.movieId)}
              >
                X
              </button>
              <Link key={movie.id} href={`/movies/${movie.originalId}`}>
                <Image
                  src={`https://image.tmdb.org/t/p/original${movie.imageUrl}`}
                  alt={movie.title || "No Title Available"}
                  width={150}
                  height={200}
                  unoptimized={true}
                  className="my-movie-image"
                />
              </Link>
              <h3 className="my-movie-title">{movie.title || "Unknown Title"}</h3>
              <p className="my-movie-details">
                <strong>USER:</strong> {movie.addedBy || "Unknown"}
              </p>
            </div>
          ))
        ) : (
          <p className="my-empty-wishlist-message">
            No movies in your wishlist yet.
          </p>
        )}
      </div>
    </div>
  );
}
