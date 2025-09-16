const API_KEY = "d84e3334d7009c8df59202f762ce3017";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}
export interface ISeries {
  name: string;
  id: number;
  overview: string;
  backdrop_path: string;
}

interface IGenres {
  id: number;
  name: string;
}

export interface ISearch {
  id: number;
  backdrop_path: string;
  genre_ids: number[];
  media_type: string;
  name?: string;
  title?: string;
  overview: string;
}

export interface IGetSearchResult {
  page: number;
  results: IMovie[] | ISeries[];
  total_pages: number;
  total_results: number;
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

export interface IGetSeriesResult {
  page: number;
  results: ISeries[];
  total_pages: number;
  total_results: number;
}

export interface IGetMovieDetailsResult {
  genres: IGenres[];
  release_date: string;
  runtime: number;
}

export interface IGetSeriesDetailsResult {
  genres: IGenres[];
  release_date: string;
}
export function getMovieDetails(movie_id: number) {
  return fetch(`${BASE_PATH}/movie/${movie_id}?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getSeriesDetails(series_id: number) {
  return fetch(`${BASE_PATH}/tv/${series_id}?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getNowPlayingMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getPopularMovies() {
  return fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getUpcomingMovies() {
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getOnTheAir() {
  return fetch(`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getPopularSeries() {
  return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}

export function getTopRated() {
  return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getSearch(keyword: string) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkODRlMzMzNGQ3MDA5YzhkZjU5MjAyZjc2MmNlMzAxNyIsIm5iZiI6MTc1NzE2NzE1Mi4yMzMsInN1YiI6IjY4YmMzZTMwZTFjODBkMTE1NDk0NmVlMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.deh9jujcKlvb-kFZUefoG-SkIX3rRz7oNiYqAN4hQBg",
    },
  };

  return fetch(
    `${BASE_PATH}/search/multi?query=${keyword}&include_adult=false&language=en-US`,
    options
  ).then((res) => res.json());
}
