import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { styled } from "styled-components";
import {
  getNowPlaying,
  getPopular,
  type IGetMoviesResult,
  type IGetNowPlayingResult,
} from "../api";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background-color: black;
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
    linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
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

const Slider = styled.div`
  position: relative;
  top: -100px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
  padding-left: 60px;
  padding-right: 60px;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;

const rowVariants = {
  hidden: (isBack: boolean) => ({
    x: isBack ? -window.outerWidth : window.outerWidth,
  }),
  visible: { x: 0 },
  exit: (isBack: boolean) => ({
    x: isBack ? window.outerWidth : -window.outerWidth,
  }),
};

const offset = 6;

const boxVariants = {
  init: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
    },
  },
};

const Info = styled(motion.div)`
  padding: 10px;
  bottom: 0;
  position: absolute;
  opacity: 0;
  width: 100%;
  background-color: ${(props) => props.theme.black.lighter};
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;

  background-color: ${(props) => props.theme.black.lighter};
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
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

const PrevBtn = styled(motion.button)`
  position: absolute; // 부모 Slider 안에서 절대 위치 지정
  z-index: 10;
  height: 200px;
  width: 60px;
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
  border: 0;
  font-size: 32px;
`;

const NextBtn = styled(motion.button)`
  position: absolute; // 부모 Slider 안에서 절대 위치 지정
  z-index: 10;
  height: 200px;
  width: 60px;
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
  border: 0;
  right: 0;
  font-size: 32px;
`;

const btnVariants = {
  hover: {
    scale: 1.3,
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
    },
  },
};

function Home() {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const history = useHistory();
  const { scrollY } = useScroll();
  const { data: dataNow, isLoading } = useQuery<IGetNowPlayingResult>({
    queryKey: ["movies", "nowPlaying"],
    queryFn: getNowPlaying,
  });

  const [isBack, setIsback] = useState(false);
  const { data: dataPopular, isLoading: isLoadingPopular } =
    useQuery<IGetMoviesResult>({
      queryKey: ["movies", "popular"],
      queryFn: getPopular,
    });

  console.log(dataPopular);

  const bigMovieMatch = useRouteMatch<{ movieId: string }>({
    path: "/movies/:movieId",
  });

  const onBoxClicked = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };

  const clickedMovie =
    bigMovieMatch?.isExact &&
    dataNow?.results.find(
      (movie) => movie.id + "" === bigMovieMatch.params.movieId
    );

  const increaseIndex = () => {
    if (dataNow) {
      setIsback(false);
      if (leaving) return;
      setLeaving(true);
      const totalMovieLen = dataNow.results.length - 1;
      const maxPage = Math.floor(totalMovieLen / offset) - 1;
      setIndex((prev) => (prev === maxPage ? 0 : prev + 1));
    }
  };

  const decreaseIndex = () => {
    if (dataNow) {
      setIsback(true);
      if (leaving) return;
      setLeaving(true);
      const totalMovieLen = dataNow.results.length - 1;
      const maxPage = Math.floor(totalMovieLen / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxPage : prev - 1));
    }
  };
  const onOverlayClick = () => history.push("/");
  return (
    <Wrapper>
      {isLoading || isLoadingPopular ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(dataNow?.results[0].backdrop_path || "")}
          >
            <Title>{dataNow?.results[0].title}</Title>
            <Overview>{dataNow?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence
              initial={false}
              onExitComplete={() => setLeaving(false)}
              custom={isBack}
            >
              <PrevBtn
                onClick={decreaseIndex}
                variants={btnVariants}
                whileHover="hover"
              >
                {"<"}
              </PrevBtn>
              <Row
                custom={isBack}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {dataNow?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id.toString()}
                      onClick={() => onBoxClicked(movie.id)}
                      variants={boxVariants}
                      whileHover="hover"
                      initial="init"
                      bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                      key={movie.id}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
              <NextBtn
                onClick={increaseIndex}
                variants={btnVariants}
                whileHover="hover"
              >
                {">"}
              </NextBtn>
            </AnimatePresence>
          </Slider>

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
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
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
