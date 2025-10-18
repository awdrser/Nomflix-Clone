import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useAtomValue } from "jotai";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { styled } from "styled-components";
import {
  type IGetMovieDetailsResult,
  type IGetSeriesDetailsResult,
  type IMovie,
  type ISearch,
  type ISeries,
  getMovieDetails,
  getSeriesDetails,
} from "../api";
import { clickedItemAtom, routeStateAtom } from "../Atoms";
import { makeImagePath } from "../utils";

interface IDetail {
  data: false | IMovie | ISeries | undefined | ISearch;
}

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
`;

const BigMovie = styled(motion.div)`
  min-height: 500px;
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
  z-index: 200;
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
  max-width: 25vw;
  top: -120px;
  color: ${(props) => props.theme.white.lighter};
  line-height: 30px;
  font-weight: bolder;
  margin-bottom: -120px;
`;

const CategoryContainer = styled.div`
  position: absolute;
  right: 0;
  max-width: 15vw;
  margin-top: -95px;
`;
const Category = styled.p`
  display: flex;
  padding-right: 20px;
  font-size: 15px;
  font-weight: bolder;
  margin-bottom: 10px;
`;

const Label = styled.span`
  font-weight: lighter;
  font-size: 15px;
  display: flex;
  vertical-align: middle;
  margin-right: 10px;
`;

function Detail({ data }: IDetail) {
  const routeState = useAtomValue(routeStateAtom);
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");

  const bigSeriesMatch = useRouteMatch<{ id: string }>({
    path: "/series/:id",
  });
  const bigMovieMatch = useRouteMatch<{ movieId: string }>({
    path: "/movies/:movieId",
  });
  const bigSearchMatch = useRouteMatch<{ id: string }>("/search/:id"); // 쿼리 파라미터(keyword)는 경로에 영향을 주지 않고 별도로 처리됨

  const { scrollY } = useScroll();
  const history = useHistory();
  const onOverlayClick = () => {
    if (routeState == "home") {
      history.push("/");
    } else if (routeState == "search") {
      history.push(`/search?keyword=${keyword}`);
    } else {
      history.push("/series");
    }
  };

  const clickedItem = useAtomValue(clickedItemAtom);

  const { data: dataDetail, isLoading: isLoadingDetail } = useQuery<
    IGetSeriesDetailsResult | IGetMovieDetailsResult
  >({
    queryKey: ["detail", clickedItem?.id],
    queryFn: () => {
      if (data) {
        return routeState === "series"
          ? getSeriesDetails(clickedItem?.id as number)
          : routeState === "home"
            ? getMovieDetails(clickedItem?.id as number)
            : "media_type" in data && data.media_type === "tv"
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
                    <CategoryContainer>Loading...</CategoryContainer>
                  ) : (
                    <>
                      <CategoryContainer>
                        <Category>
                          <Label>Genres:</Label>
                          {dataDetail?.genres
                            .map((genre) => genre.name)
                            .join(", ")}
                        </Category>
                        <Category>
                          <Label>Rate:</Label>
                          {dataDetail?.vote_average.toFixed(1)} / 10
                        </Category>
                        {dataDetail && "number_of_episodes" in dataDetail ? (
                          <Category>
                            <Label>Episodes:</Label>
                            {dataDetail?.number_of_episodes}
                          </Category>
                        ) : null}
                        {dataDetail && "runtime" in dataDetail ? (
                          <Category>
                            <Label>Runtime:</Label>
                            {dataDetail?.runtime} min
                          </Category>
                        ) : null}
                      </CategoryContainer>
                    </>
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
