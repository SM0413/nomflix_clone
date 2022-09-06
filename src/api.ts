import { MovieTypes, TvShowTypes } from "./utils";

const API_KEY = "07697c9dadb7cdb9483eb67914ebc1e2";
const BASE_PATH = "https://api.themoviedb.org/3";
interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  original_language: string;
  popularity: number;
  vote_average: number;
  release_date: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface ITvshows {
  origin_country: string;
  backdrop_path: string;
  first_air_date: string;
  id: number;
  name: string;
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
}

export interface IGetTvShowsResult {
  page: number;
  results: ITvshows[];
  total_pages: number;
  total_results: number;
}

export interface IGetSearchMoviesResult {
  backdrop_path: string;
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
}

export function getMoviestype(type: MovieTypes) {
  return fetch(`${BASE_PATH}/movie/${type}?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getTvShows(type: TvShowTypes) {
  return fetch(`${BASE_PATH}/tv/${type}?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}

export function getSearchMovies(query?: string) {
  return fetch(
    `${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${query}`
  ).then((response) => response.json());
}
export function getSearchTvShows(query?: string) {
  return fetch(`${BASE_PATH}/search/tv?api_key=${API_KEY}&query=${query}`).then(
    (response) => response.json()
  );
}
