export function makeImagePath(id: string, format?: string) {
  return `https://image.tmdb.org/t/p/${format ? format : "original"}${id}`;
}

export enum MovieTypes {
  "now_playing" = "now_playing",
  "top_rated" = "top_rated",
  "popular" = "popular",
  "upcoming" = "upcoming",
}

export enum TvShowTypes {
  "airing_today" = "airing_today",
  "on_the_air" = "on_the_air",
  "popular" = "popular",
  "top_rated" = "top_rated",
}
