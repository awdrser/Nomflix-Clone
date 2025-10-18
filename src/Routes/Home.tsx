import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { useRouteMatch } from "react-router-dom";
import {
  getNowPlayingMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  type IGetMoviesResult,
  type IGetNowPlayingResult,
} from "../api";
import { routeStateAtom } from "../Atoms";
import Detail from "../Components/Detail";
import Slider from "../Components/Slider";
import { Banner, Loader, Overview, Title, Wrapper } from "../styled.d";
import { makeImagePath } from "../utils";

export function shortOverview(text: string | undefined) {
  if (!text) return null;
  const maxLen = 120;
  return text.length > maxLen ? text.slice(0, maxLen) + "..." : text;
}

function Home() {
  const setRouteState = useSetAtom(routeStateAtom);
  setRouteState("home");

  const { data: dataNow, isLoading } = useQuery<IGetNowPlayingResult>({
    queryKey: ["movies", "nowPlaying"],
    queryFn: getNowPlayingMovies,
  });
  const { data: dataTopRated, isLoading: isLoadingTopRated } =
    useQuery<IGetMoviesResult>({
      queryKey: ["movies", "topLated"],
      queryFn: getTopRatedMovies,
    });
  const { data: dataUpcoming, isLoading: isLoadingUpcoming } =
    useQuery<IGetNowPlayingResult>({
      queryKey: ["movies", "upcoming"],
      queryFn: getUpcomingMovies,
    });

  const bigMovieMatch = useRouteMatch<{ movieId: string }>({
    path: "/movies/:movieId",
  });

  const clickedMovie =
    bigMovieMatch?.isExact &&
    (dataNow?.results.find(
      (movie) => movie.id + "" === bigMovieMatch.params.movieId
    ) ||
      dataTopRated?.results.find(
        (movie) => movie.id + "" === bigMovieMatch.params.movieId
      ) ||
      dataUpcoming?.results.find(
        (movie) => movie.id + "" === bigMovieMatch.params.movieId
      ));

  return (
    <Wrapper>
      {isLoading || isLoadingTopRated || isLoadingUpcoming ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(dataNow?.results[0].backdrop_path || "")}
          >
            <Title>{dataNow?.results[0].title}</Title>
            <Overview>{shortOverview(dataNow?.results[0].overview)}</Overview>
          </Banner>
          <Slider data={dataNow} title="Now Playing" keyPrefix="now_" />
          <Slider
            style={{ marginTop: "300px" }}
            data={dataTopRated}
            title="Top Rated"
            keyPrefix="topRated__"
          />

          <Slider
            style={{ marginTop: "300px" }}
            data={dataUpcoming}
            title="Upcoming"
            keyPrefix="upcoming__"
          />

          <Detail data={clickedMovie}></Detail>
        </>
      )}
    </Wrapper>
  );
}
export default Home;
