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
import { useSetAtom } from "jotai";
import { isHomeAtom } from "../Atoms";
import Detail from "../Components/Detail";
import { Banner, Loader, Overview, Title, Wrapper } from "../styled.d";

function Series() {
  const history = useHistory();
  const { scrollY } = useScroll();
  const setIsHome = useSetAtom(isHomeAtom);
  setIsHome(false);

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

          <Detail data={clickedSeries}></Detail>
        </>
      )}
    </Wrapper>
  );
}

export default Series;
