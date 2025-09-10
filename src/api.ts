const API_KEY = "d84e3334d7009c8df59202f762ce3017";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMoive {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetNowPlayingResult extends IGetMoviesResult {
  dates: { maximum: string; minimum: string };
}

export interface IGetMoviesResult {
  page: number;
  results: IMoive[];
  total_pages: number;
  total_results: number;
}

export function getNowPlaying() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getPopular() {
  return fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
