import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useAtomValue } from "jotai";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { styled } from "styled-components";
import {
  type IGetMovieDetailsResult,
  type IGetSeriesDetailsResult,
  type IMovie,
  type ISeries,
  getMovieDetails,
  getSeriesDetails,
} from "../api";
import { clickedItemAtom, isHomeAtom } from "../Atoms";
import { makeImagePath } from "../utils";

interface IDetail {
  data: false | IMovie | ISeries | undefined;
}

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

function Detail({ data }: IDetail) {
  const isHome = useAtomValue(isHomeAtom);
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");

  const bigSeriesMatch = useRouteMatch<{ id: string }>({
    path: "/series/:id",
  });
  const bigMovieMatch = useRouteMatch<{ movieId: string }>({
    path: "/movies/:movieId",
  });
  const bigSearchMatch = useRouteMatch<{ id: string }>({
    path: "/search?keyword=" + keyword + "/:id",
  });

  const { scrollY } = useScroll();
  const history = useHistory();
  const onOverlayClick = () =>
    isHome ? history.push("") : history.push("/series");
  const clickedItem = useAtomValue(clickedItemAtom);

  const { data: dataDetail, isLoading: isLoadingDetail } = useQuery<
    IGetSeriesDetailsResult | IGetMovieDetailsResult
  >({
    queryKey: ["detail"],
    queryFn: () => {
      if (data) {
        return bigSeriesMatch
          ? getSeriesDetails(clickedItem?.id as number)
          : getMovieDetails(clickedItem?.id as number);
      }
      return Promise.reject(new Error("No Series ID provided"));
    },
    enabled: !!data,
  });

  return (
    <>
      <AnimatePresence>
        {bigSeriesMatch || bigMovieMatch || bigSearchMatch ? (
          <>
            <Overlay
              onClick={onOverlayClick}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            <BigMovie
              layoutId={
                bigSeriesMatch
                  ? clickedItem?.sliderType + bigSeriesMatch?.params.id
                  : bigSearchMatch
                    ? clickedItem?.sliderType + bigSearchMatch.params.id
                    : clickedItem
                      ? clickedItem?.sliderType + bigMovieMatch?.params.movieId
                      : ""
              }
              style={{ top: scrollY.get() + 80 }}
            >
              {data && (
                <>
                  <BigCover
                    style={{
                      backgroundImage: `linear-gradient(to top, #2F2F2F, transparent), url(${makeImagePath(
                        data.backdrop_path,
                        "w500"
                      )})`,
                    }}
                  />
                  <BigTitle>
                    {"title" in data ? data.title : data.name}
                  </BigTitle>
                  {isLoadingDetail ? (
                    "Loading"
                  ) : (
                    <Genres>
                      <Label>Genres:</Label>
                      {dataDetail?.genres.map((genre) => genre.name).join(", ")}
                    </Genres>
                  )}

                  <BigOverview>{data.overview}</BigOverview>
                </>
              )}
            </BigMovie>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default Detail;
