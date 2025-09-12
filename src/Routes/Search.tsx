import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const history = useHistory();
  return (
    <>
      {useEffect(() => {
        if (keyword && keyword.length > 1) {
          // 검색어가 2자 이상일 때 페이지 이동 또는 결과 fetch
          history.push(`/search?keyword=${keyword}`);
          // 또는 fetch를 직접 호출해 상태로 결과 띄우기 가능
        }
      }, [keyword, history])}
    </>
  );
}

export default Search;
