import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { useRouteMatch } from "react-router-dom";
import {
  getAiringTodaySeries,
  getOnTheAir,
  getPopularSeries,
  getTopRatedSeries,
  type IGetSeriesResult,
} from "../api";
import { routeStateAtom } from "../Atoms";
import Detail from "../Components/Detail";
import Slider from "../Components/Slider";
import { Banner, Loader, Overview, Title, Wrapper } from "../styled.d";
import { makeImagePath } from "../utils";
import { shortOverview } from "./Home";

function Series() {
  const setrouteState = useSetAtom(routeStateAtom);
  setrouteState("series");

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
      queryFn: getTopRatedSeries,
    });

  const { data: datAiringToday, isLoading: isLoadingAiringToday } =
    useQuery<IGetSeriesResult>({
      queryKey: ["tv", "airingToday"],
      queryFn: getAiringTodaySeries,
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
      ) ||
      datAiringToday?.results.find(
        (series) => series.id + "" === bigSeriesMatch.params.id
      ));

  return (
    <Wrapper>
      {isLoading ||
      isLoadingPopular ||
      isLoadingTopRated ||
      isLoadingAiringToday ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(
              dataOnTheAir?.results[0].backdrop_path || ""
            )}
          >
            <Title>{dataOnTheAir?.results[0].name}</Title>
            <Overview>
              {shortOverview(dataOnTheAir?.results[0].overview)}
            </Overview>
          </Banner>

          <Slider
            data={datAiringToday}
            title="Airing Today"
            keyPrefix="series__airingToday_"
          />

          <Slider
            data={dataOnTheAir}
            title="On The Air"
            keyPrefix="series__onTheAir_"
          />
          <Slider
            style={{ marginTop: "300px" }}
            data={dataPopular}
            title="Popular"
            keyPrefix="series__popular__"
          />

          <Slider
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
