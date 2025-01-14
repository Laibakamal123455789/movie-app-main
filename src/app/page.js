import ActionMovies from "@/components/movies/Action-movies/action";
import HeroSection from "@/components/Hero-section/section";
import Movie from "@/components/movies/movie";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TrendsNow from "@/components/TrendsNow/TrendsNow";
import Trailers from "@/components/Trailers/trailers";


export default function Page() {
  return (
    <div>
      <HeroSection/>
      <Movie/>
      <TrendsNow />
      <Trailers/>
    </div>
  )
}
