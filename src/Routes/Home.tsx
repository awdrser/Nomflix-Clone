import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useScroll } from "framer-motion";
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

const Wrapper = styled.div`
  background-color: rgb(30, 30, 30);
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image:
    linear-gradient(rgba(0, 0, 0, 0), rgba(30, 30, 30, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.5);
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
  height: auto;
  margin-bottom: 0;
  padding-bottom: 0;
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
  font-weight: bold;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  max-width: 50vh;
  top: -120px;
  color: ${(props) => props.theme.white.lighter};
  line-height: 30px;
  font-weight: bolder;
  margin-bottom: -120px;
`;

const Genres = styled.p`
  position: absolute;
  display: flex;
  right: 0;
  max-width: 40vh;
  margin-top: -95px;
  padding-right: 20px;
  font-size: 15px;
  font-weight: bolder;
`;

const Label = styled.span`
  font-weight: lighter;
  font-size: 15px;
  display: flex;
  vertical-align: middle;
  margin-right: 10px;
`;

function Home() {
  const history = useHistory();
  const { scrollY } = useScroll();
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

  const { data: dataDetail, isLoading: isLoadingDetail } =
    useQuery<IGetMovieDetailsResult>({
      queryKey: ["movies", "detail"],
      queryFn: () => {
        if (clickedMovie) {
          return getMovieDetails(clickedMovie.id);
        }
        return Promise.reject(new Error("No movie ID provided"));
      },
      enabled: !!clickedMovie,
    });

  const onOverlayClick = () => history.push("/");

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

          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  layoutId={bigMovieMatch.params.movieId}
                  style={{ top: scrollY.get() + 100 }}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, #2F2F2F, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      {isLoadingDetail ? null : (
                        <Genres>
                          <Label>Genres:</Label>
                          {dataDetail?.genres
                            .map((genre) => genre.name)
                            .join(", ")}
                        </Genres>
                      )}

                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Home;
