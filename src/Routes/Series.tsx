import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useHistory, useRouteMatch } from "react-router-dom";
import { styled } from "styled-components";
import {
  getTopRated,
  getOnTheAir,
  getPopularSeries,
  getSeriesDetails,
  type IGetSeriesResult,
  type IGetSeriesDetailsResult,
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

function Series() {
  const history = useHistory();
  const { scrollY } = useScroll();

  const { data: dataOnTheAir, isLoading } = useQuery<IGetSeriesResult>({
    queryKey: ["tv", "onTheAir"],
    queryFn: getOnTheAir,
  });
  const { data: dataPopular, isLoading: isLoadingPopular } =
    useQuery<IGetSeriesResult>({
      queryKey: ["tv", "popular"],
      queryFn: getPopularSeries,
    });
  const { data: dataTopRated, isLoading: isLoadingTopRated } =
    useQuery<IGetSeriesResult>({
      queryKey: ["tv", "topRated"],
      queryFn: getTopRated,
    });

  const bigSeriesMatch = useRouteMatch<{ id: string }>({
    path: "/series/:id",
  });

  const clickedSeries =
    bigSeriesMatch?.isExact &&
    (dataOnTheAir?.results.find(
      (series) => series.id + "" === bigSeriesMatch.params.id
    ) ||
      dataPopular?.results.find(
        (series) => series.id + "" === bigSeriesMatch.params.id
      ) ||
      dataTopRated?.results.find(
        (series) => series.id + "" === bigSeriesMatch.params.id
      ));

  const { data: dataDetail, isLoading: isLoadingDetail } =
    useQuery<IGetSeriesDetailsResult>({
      queryKey: ["series", "detail"],
      queryFn: () => {
        if (clickedSeries) {
          return getSeriesDetails(clickedSeries.id);
        }
        return Promise.reject(new Error("No Series ID provided"));
      },
      enabled: !!clickedSeries,
    });

  const onOverlayClick = () => history.push("/series");

  return (
    <Wrapper>
      {isLoading || isLoadingPopular || isLoadingTopRated ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(
              dataOnTheAir?.results[0].backdrop_path || ""
            )}
          >
            <Title>{dataOnTheAir?.results[0].name}</Title>
            <Overview>{dataOnTheAir?.results[0].overview}</Overview>
          </Banner>
          <SliderComponent
            data={dataOnTheAir}
            title="On The Air"
            keyPrefix="series__onTheAir_"
          />
          <SliderComponent
            style={{ marginTop: "300px" }}
            data={dataPopular}
            title="Popular"
            keyPrefix="series__popular__"
          />

          <SliderComponent
            style={{ marginTop: "300px" }}
            data={dataTopRated}
            title="Top Rated"
            keyPrefix="series__topRated__"
          />

          <AnimatePresence>
            {bigSeriesMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  layoutId={bigSeriesMatch.params.id}
                  style={{ top: scrollY.get() + 80 }}
                >
                  {clickedSeries && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, #2F2F2F, transparent), url(${makeImagePath(
                            clickedSeries.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedSeries.name}</BigTitle>
                      {isLoadingDetail ? null : (
                        <Genres>
                          <Label>Genres:</Label>
                          {dataDetail?.genres
                            .map((genre) => genre.name)
                            .join(", ")}
                        </Genres>
                      )}

                      <BigOverview>{clickedSeries.overview}</BigOverview>
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

export default Series;
