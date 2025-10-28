import { AnimatePresence, motion } from "framer-motion";
import { useSetAtom } from "jotai";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { styled } from "styled-components";
import type {
  IGetMoviesResult,
  IGetNowPlayingResult,
  IGetSeriesResult,
} from "../api";
import { clickedItemAtom } from "../Atoms";
import { Box, Info, Row } from "../styled.d";
import { makeImagePath } from "../utils";

interface ISliderProps {
  data?: IGetMoviesResult | IGetNowPlayingResult | IGetSeriesResult;
  title?: string;
  style?: React.CSSProperties;
  keyPrefix: string;
}

const Category = styled.h2`
  margin-left: 60px;
  position: absolute;
  font-size: 2vw;
  font-weight: bolder;
  top: 40px;
`;

const NextBtn = styled(motion.button)`
  position: absolute;
  z-index: 10;
  height: 150px;
  width: 60px;
  background-color: rgba(0, 0, 0, 0);
  color: white;
  border: 0;
  right: 0;
  font-size: 32px;
  transform-origin: right center;
`;

const PrevBtn = styled(motion.button)`
  position: absolute;
  z-index: 10;
  height: 150px;
  width: 60px;
  background-color: rgba(0, 0, 0, 0);
  color: white;
  border: 0;
  font-size: 32px;
  transform-origin: left center;
`;

const SliderContainer = styled.div`
  position: relative;
`;

const btnVariants = {
  hover: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
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
    zIndex: 100,
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

const OuterContainer = styled.div`
  overflow-x: hidden;
  position: relative;
  width: 100%;
  height: 300px;
  overflow-y: hidden;
  padding-top: 100px;
`;

function Slider({
  data = {
    page: 1,
    dates: { maximum: "", minimum: "" },
    results: [],
    total_pages: 0,
    total_results: 0,
  },
  title,
  keyPrefix,
}: ISliderProps) {
  const history = useHistory();
  const onBoxClicked = (id: number) => {
    if (!data) return null;
    setClickedItem({ sliderType: keyPrefix, id });
    if ("title" in data.results[0]) {
      history.push(`/movies/${id}`);
    } else if ("name" in data.results[0]) {
      history.push(`/series/${id}`);
    }
  };
  const [isBack, setIsBack] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [index, setIndex] = useState(0);
  const offset = 6;
  const setClickedItem = useSetAtom(clickedItemAtom);

  const increaseIndex = () => {
    if (data) {
      setIsBack(false);
      if (leaving) return;
      setLeaving(true);
      const totalDataLen = data.results.length - 1;
      const maxPage = Math.floor(totalDataLen / offset) - 1;
      setIndex((prev) => (prev === maxPage ? 0 : prev + 1));
    }
  };

  const decreaseIndex = () => {
    if (data) {
      setIsBack(true);
      if (leaving) return;
      setLeaving(true);
      const totalDataLen = data.results.length - 1;
      const maxPage = Math.floor(totalDataLen / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxPage : prev - 1));
    }
  };

  return (
    <>
      <SliderContainer style={{ top: "-150px" }}>
        <Category>{title}</Category>
        <OuterContainer>
          <AnimatePresence
            initial={false}
            onExitComplete={() => setLeaving(false)}
            custom={isBack}
          >
            {
              <PrevBtn
                onClick={decreaseIndex}
                variants={btnVariants}
                whileHover="hover"
              >
                {"<"}
              </PrevBtn>
            }
            <Row
              custom={isBack}
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "tween", duration: 0.75 }}
              key={keyPrefix + index}
            >
              {data?.results.slice(offset * index, offset * index + offset).map(
                (item) =>
                  item.backdrop_path && (
                    <Box
                      layoutId={keyPrefix + item.id}
                      onClick={() => onBoxClicked(item.id)}
                      variants={boxVariants}
                      whileHover="hover"
                      initial="init"
                      bgPhoto={makeImagePath(item.backdrop_path, "w500")}
                      key={keyPrefix + item.id}
                    >
                      <Info variants={infoVariants}>
                        <h4>{"title" in item ? item.title : item.name}</h4>
                      </Info>
                    </Box>
                  )
              )}
            </Row>
            <NextBtn
              onClick={increaseIndex}
              variants={btnVariants}
              whileHover="hover"
            >
              {">"}
            </NextBtn>
          </AnimatePresence>
        </OuterContainer>
      </SliderContainer>
    </>
  );
}

export default Slider;
