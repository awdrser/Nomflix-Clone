import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { isHomeAtom } from "../Atoms";
import { useHistory, useRouteMatch } from "react-router-dom";
import { styled } from "styled-components";
import {
  getMovieDetails,
  getNowPlayingMovies,
  getPopularMovies,
  getUpcomingMovies,
  type IGetMovieDetailsResult,
  type IGetMoviesResult,
  type IGetNowPlayingResult,
} from "../api";
import { makeImagePath } from "../utils";
import SliderComponent from "../Components/Slider";
import Detail from "../Components/Detail";
import { Banner, Loader, Overview, Title, Wrapper } from "../styled.d";

function Home() {
  const setIsHome = useSetAtom(isHomeAtom);

  setIsHome(true);

  const { data: dataNow, isLoading } = useQuery<IGetNowPlayingResult>({
    queryKey: ["movies", "nowPlaying"],
    queryFn: getNowPlayingMovies,
  });
  const { data: dataPopular, isLoading: isLoadingPopular } =
    useQuery<IGetMoviesResult>({
      queryKey: ["movies", "popular"],
      queryFn: getPopularMovies,
    });
  const { data: dataUpcoming, isLoading: isLoadingUpcoming } =
    useQuery<IGetNowPlayingResult>({
      queryKey: ["movies", "upcoming"],
      queryFn: getUpcomingMovies,
    });

  console.log(dataPopular);

  const bigMovieMatch = useRouteMatch<{ movieId: string }>({
    path: "/movies/:movieId",
  });

  const clickedMovie =
    bigMovieMatch?.isExact &&
    (dataNow?.results.find(
      (movie) => movie.id + "" === bigMovieMatch.params.movieId
    ) ||
      dataPopular?.results.find(
        (movie) => movie.id + "" === bigMovieMatch.params.movieId
      ) ||
      dataUpcoming?.results.find(
        (movie) => movie.id + "" === bigMovieMatch.params.movieId
      ));

  return (
    <Wrapper>
      {isLoading || isLoadingPopular || isLoadingUpcoming ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(dataNow?.results[0].backdrop_path || "")}
          >
            <Title>{dataNow?.results[0].title}</Title>
            <Overview>{dataNow?.results[0].overview}</Overview>
          </Banner>
          <SliderComponent
            data={dataNow}
            title="Now Playing"
            keyPrefix="now_"
          />
          <SliderComponent
            style={{ marginTop: "300px" }}
            data={dataPopular}
            title="Popular"
            keyPrefix="popular__"
          />

          <SliderComponent
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
