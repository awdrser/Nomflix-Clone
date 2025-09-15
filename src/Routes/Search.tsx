import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { getSearch, type IGetSearchResult } from "../api";
import { clickedItemAtom } from "../Atoms";
import Detail from "../Components/Detail";
import { Box, Info, Loader, Row, Wrapper } from "../styled.d";
import { makeImagePath } from "../utils";

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

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const history = useHistory();
  const setClickedItem = useSetAtom(clickedItemAtom);

  const { data, isLoading } = useQuery<IGetSearchResult>({
    queryKey: ["search", keyword],
    queryFn: () => getSearch(keyword as string),
    enabled: keyword !== "", // keyword가 빈 문자열일 때는 쿼리 실행 안 함 (선택사항)
  });
  console.log(data);

  const onBoxClicked = (id: number) => {
    setClickedItem({ sliderType: "search", id });
    history.push(`/search/${id}?keyword=${keyword}`);
  };

  const bigItemMatch = useRouteMatch<{ id: string }>("/search/:id");

  const clickedItem =
    bigItemMatch?.isExact &&
    data?.results.find((i) => i.id.toString() === bigItemMatch.params.id);

  return (
    <>
      <Wrapper>
        {isLoading ? (
          <Loader>Loading</Loader>
        ) : (
          <>
            <Row style={{ top: "25vh", gridRowGap: "10vh" }}>
              {data?.results.map(
                (item) =>
                  item.title &&
                  item.backdrop_path && (
                    <Box
                      layoutId={"search" + item.id}
                      onClick={() => onBoxClicked(item.id)}
                      variants={boxVariants}
                      whileHover="hover"
                      initial="init"
                      bgPhoto={makeImagePath(item.backdrop_path, "w500")}
                      key={item.id}
                    >
                      <Info variants={infoVariants}>
                        <h4>{item.title}</h4>
                      </Info>
                    </Box>
                  )
              )}
            </Row>
            <Detail data={clickedItem} />
          </>
        )}
      </Wrapper>
    </>
  );
}

export default Search;
