import { styled } from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { makeImagePath } from "../utils";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import type { IGetMoviesResult, IGetNowPlayingResult } from "../api";

interface ISliderProps {
  data: IGetMoviesResult | IGetNowPlayingResult | undefined;
  title: string;
  style?: React.CSSProperties;
  keyPrefix: string;
}

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

const Category = styled.h2`
  margin-left: 60px;
  margin-bottom: 10px;
  font-size: 32px;
`;

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

const NextBtn = styled(motion.button)`
  position: absolute;
  z-index: 10;
  height: 200px;
  width: 60px;
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
  border: 0;
  right: 0;
  font-size: 32px;
`;

const PrevBtn = styled(motion.button)`
  position: absolute;
  z-index: 10;
  height: 200px;
  width: 60px;
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
  border: 0;
  font-size: 32px;
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

const Slider = styled.div`
  position: relative;
  top: -400px;
`;

const btnVariants = {
  hover: {
    scale: 1.3,
  },
};

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

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
    },
  },
};

const rowVariants = {
  hidden: (isBack: boolean) => ({
    x: isBack ? -window.outerWidth - 5 : window.outerWidth + 5,
  }),
  visible: { x: 0 },
  exit: (isBack: boolean) => ({
    x: isBack ? window.outerWidth - 5 : -window.outerWidth + 5,
  }),
};

function SliderComponent({ data, title, keyPrefix }: ISliderProps) {
  const history = useHistory();
  const onBoxClicked = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };
  const [isBack, setIsBack] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [index, setIndex] = useState(0);
  const offset = 6;

  const increaseIndex = () => {
    if (data) {
      setIsBack(false);
      if (leaving) return;
      setLeaving(true);
      const totalMovieLen = data.results.length - 1;
      const maxPage = Math.floor(totalMovieLen / offset) - 1;
      setIndex((prev) => (prev === maxPage ? 0 : prev + 1));
    }
  };

  const decreaseIndex = () => {
    if (data) {
      setIsBack(true);
      if (leaving) return;
      setLeaving(true);
      const totalMovieLen = data.results.length - 1;
      const maxPage = Math.floor(totalMovieLen / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxPage : prev - 1));
    }
  };

  return (
    <>
      <Slider style={{ marginTop: "300px" }}>
        <Category>{title}</Category>
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
            key={keyPrefix + index}
          >
            {data?.results
              .slice(offset * index, offset * index + offset)
              .map((movie) => (
                <Box
                  layoutId={keyPrefix + movie.id}
                  onClick={() => onBoxClicked(movie.id)}
                  variants={boxVariants}
                  whileHover="hover"
                  initial="init"
                  bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                  key={keyPrefix + movie.id}
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
    </>
  );
}

export default SliderComponent;
