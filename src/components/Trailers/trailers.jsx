"use client";
import { useState, useEffect } from "react";
import "./Trailers.css";
import { BASE_URL,API_KEY } from "@/lib/apiConfig";

export default function Trailers() {
  const [trailers, setTrailers] = useState([]);
  const [selectedTrailer, setSelectedTrailer] = useState(null);

  const fetchTrailers = async () => {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}`
    );
    const movies = await response.json();
    const trailerPromises = movies.results.slice(0, 10).map(async (movie) => {
      const res = await fetch(
        `${BASE_URL}/movie/${movie.id}/videos?api_key=${API_KEY}`
      );
      const data = await res.json();
      const trailer = data.results.find((video) => video.type === "Trailer");
      return trailer
        ? {
            id: movie.id,
            title: movie.title,
            url: `https://www.youtube.com/embed/${trailer.key}`,
            thumbnail: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          }
        : null;
    });

    const trailersData = (await Promise.all(trailerPromises)).filter(Boolean);
    setTrailers(trailersData);
    setSelectedTrailer(trailersData[0]); 
  };

  useEffect(() => {
    fetchTrailers();
  }, []);

  if (!trailers.length) return <div>Loading Trailers...</div>;

  return (
    <div className="main">
      <h2>Trailers</h2>
      <hr style={{width:"350px" , justifyContent: "center ", margin: "auto" , marginBottom :"40px"}}></hr>

    <div className="trailers-container">

      <div className="trailers-list">
        {trailers.map((trailer) => (
          <div
            key={trailer.id}
            className={`trailer-thumbnail ${
              selectedTrailer?.id === trailer.id ? "active" : ""
            }`}
            onClick={() => setSelectedTrailer(trailer)}
          >
            <img src={trailer.thumbnail} alt={trailer.title} />
          </div>
        ))}
      </div>

      
      <div className="main-trailer">
        {selectedTrailer && (
          <iframe
            src={`${selectedTrailer.url}?autoplay=1`}
            title={selectedTrailer.title}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
        )}
        <h2 className="trailer-title">{selectedTrailer?.title}</h2>
      </div>
    </div>
   </div>
  );
}
