const API_KEY = "d84e3334d7009c8df59202f762ce3017";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}
interface IGenres {
  id: number;
  name: string;
}
export interface IGetNowPlayingResult extends IGetMoviesResult {
  dates: { maximum: string; minimum: string };
}

export interface IGetMoviesResult {
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}
export interface IGetDetailsResult {
  genres: IGenres[];
  release_date: string;
  runtime: number;
}
export function getMovieDetails(movie_id: number) {
  return fetch(`${BASE_PATH}/movie/${movie_id}?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
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
