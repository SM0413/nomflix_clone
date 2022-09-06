import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  getMoviestype,
  getTvShows,
  IGetMoviesResult,
  IGetTvShowsResult,
} from "../../api";
import { makeImagePath, MovieTypes, TvShowTypes } from "../../utils";

const Slider = styled.div`
  position: relaaive;
  height: 200px;
  top: -100px;
  margin-bottom: 80px;
`;

const Type = styled.div`
  font-size: 40px;
  font-weight: bolder;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  font-weight: bolder;
  padding-top: 170px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
  position: relative;
  opacity: 0;

  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;
const rowVariants = {
  hidden: ({ isNext }: { isNext: boolean }) => {
    return {
      x: isNext ? window.outerWidth + 5 : -window.outerWidth - 5,
    };
  },
  visible: {
    x: 0,
  },
  exit: ({ isNext }: { isNext: boolean }) => {
    return {
      x: isNext ? -window.outerWidth - 5 : window.outerWidth + 5,
    };
  },
};

const ArrowBTN = styled.div<{ isPrev: boolean }>`
  left: ${(prev) => prev.isPrev && 0};
  right: ${(prev) => !prev.isPrev && 0};
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  background-color: rgba(255, 255, 255, 0.5);
  height: 21.5%;
  width: 2%;
  z-index: 1;
  cursor: pointer;
`;

const BoxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.5,
    y: -50,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 3;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  right: 0;
  left: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
  z-index: 4;
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  padding: 10px;
  font-size: 36px;
  position: relative;
  top: -60px;
`;

const BigOverview = styled.p`
  padding: 20px;
  top: -60px;
  position: relative;
  color: ${(props) => props.theme.white.lighter};
  span {
    font-weight: bolder;
    font-size: 20px;
  }
  margin-bottom: -50px;
`;

const BigDiv = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const BigLanguage = styled.div`
  color: ${(props) => props.theme.white.lighter};
  img {
  }
  span {
    font-size: 20px;
    font-weight: bolder;
  }
`;

const BigVoteAVG = styled.div`
  color: ${(props) => props.theme.white.lighter};
  span {
    font-size: 20px;
    font-weight: bolder;
  }
`;

const BigPopularity = styled.div`
  color: ${(props) => props.theme.white.lighter};
  span {
    font-size: 20px;
    font-weight: bolder;
  }
`;

const BigReleaseDate = styled.div`
  color: ${(props) => props.theme.white.lighter};
  span {
    font-size: 20px;
    font-weight: bolder;
  }
`;

const offset = 6;

export function NowPlayingSlider({ type }: { type: MovieTypes }) {
  const { data } = useQuery<IGetMoviesResult>(["movies", type], () =>
    getMoviestype(type)
  );
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [isNext, setIsNext] = useState(true);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const incraseIndexNext = () => {
    if (data) {
      if (leaving) return;
      setIsNext(true);
      toggleLeaving();
      const totalMovies = data.results.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const incraseIndexPrev = () => {
    if (data) {
      if (leaving) return;
      setIsNext(false);
      toggleLeaving();
      const totalMovies = data.results.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const onBoxClicked = (movieId: number) => {
    navigate(`/nomflix_clone/movies/${type}/${movieId}`);
  };

  const bigMovieMatch = useMatch(`/nomflix_clone/movies/${type}/:movieId`);
  const { scrollY } = useScroll();
  const onOverlayClick = () => navigate("/nomflix_clone");
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie) => String(movie.id) === bigMovieMatch.params.movieId
    );
  return (
    <>
      <Slider>
        <Type>
          {type === MovieTypes.now_playing && "NOW PLAYING"}
          {type === MovieTypes.popular && "POPULAR"}
          {type === MovieTypes.top_rated && "TOP RATED"}
          {type === MovieTypes.upcoming && "UP COMMING"}
        </Type>
        <AnimatePresence
          custom={{ isNext }}
          initial={false}
          onExitComplete={toggleLeaving}
        >
          <Row
            custom={{ isNext }}
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 1 }}
            key={index}
          >
            {data?.results
              .slice(1)
              .slice(offset * index, offset * index + offset)
              .map((movie) => (
                <>
                  <Box
                    layoutId={type + String(movie.id)}
                    key={type + movie.id}
                    whileHover="hover"
                    initial="normal"
                    variants={BoxVariants}
                    onClick={() => {
                      onBoxClicked(movie.id);
                    }}
                    transition={{ type: "tween" }}
                    bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                  >
                    <Info variants={infoVariants}>
                      <h4>{movie.title}</h4>
                    </Info>
                  </Box>
                </>
              ))}
          </Row>
        </AnimatePresence>

        <ArrowBTN onClick={incraseIndexPrev} isPrev={true}>
          <img alt="left" src={require("../../img/arrowLeft.PNG")} />
        </ArrowBTN>
        <ArrowBTN onClick={incraseIndexNext} isPrev={false}>
          <img alt="right" src={require("../../img/arrowRight.PNG")} />
        </ArrowBTN>
      </Slider>

      <AnimatePresence>
        {bigMovieMatch && (
          <>
            <Overlay
              onClick={onOverlayClick}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            <BigMovie
              style={{ top: scrollY.get() + 100 }}
              layoutId={type + bigMovieMatch.params.movieId}
            >
              {clickedMovie && (
                <>
                  <BigCover
                    style={{
                      backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                        clickedMovie.backdrop_path,
                        "w500"
                      )})`,
                    }}
                  />
                  <BigTitle>{clickedMovie.title}</BigTitle>
                  <BigOverview>
                    <span key="e">Overview</span>
                    <br />
                    {!clickedMovie.overview
                      ? "none"
                      : clickedMovie.overview.length > 300
                      ? `${clickedMovie.overview.slice(0, 300)}...`
                      : clickedMovie.overview}
                  </BigOverview>
                  <BigDiv>
                    <BigLanguage>
                      <span>Language</span>
                      <img
                        alt="1"
                        src={require(`../../img/${clickedMovie.original_language}.png`)}
                      />
                      <br />
                      {clickedMovie.original_language === "en"
                        ? "English"
                        : clickedMovie.original_language === "ko"
                        ? "Korean"
                        : clickedMovie.original_language === "ja"
                        ? "Japanese"
                        : clickedMovie.original_language === "cn" ||
                          clickedMovie.original_language === "zh"
                        ? "China"
                        : clickedMovie.original_language === "fr"
                        ? "France"
                        : clickedMovie.original_language === "it"
                        ? "Italy"
                        : clickedMovie.original_language === "es"
                        ? "Spain"
                        : clickedMovie.original_language === "hi"
                        ? "India"
                        : clickedMovie.original_language === "pt"
                        ? "Portugal"
                        : clickedMovie.original_language === "tl"
                        ? "Democratic Republic of Timor-Leste"
                        : clickedMovie.original_language === "tr"
                        ? "Turkey"
                        : null}
                    </BigLanguage>
                    <BigVoteAVG>
                      <span>VoteAVG</span>
                      <br />✮{clickedMovie.vote_average}
                    </BigVoteAVG>
                    <BigPopularity>
                      <span>Poupularity</span>
                      <br />
                      👍{clickedMovie.popularity.toFixed(0)}
                    </BigPopularity>
                    <BigReleaseDate>
                      <span>Release Date</span>
                      <br />
                      {clickedMovie.release_date}
                    </BigReleaseDate>
                  </BigDiv>
                </>
              )}
            </BigMovie>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export function TvShowSlider({ type }: { type: TvShowTypes }) {
  const { data } = useQuery<IGetTvShowsResult>(["TvShow", type], () =>
    getTvShows(type)
  );
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [isNext, setIsNext] = useState(true);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const incraseIndexNext = () => {
    if (data) {
      if (leaving) return;
      setIsNext(true);
      toggleLeaving();
      const totalTvshows = data.results.length;
      const maxIndex = Math.floor(totalTvshows / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const incraseIndexPrev = () => {
    if (data) {
      if (leaving) return;
      setIsNext(false);
      toggleLeaving();
      const totalMovies = data.results.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const onBoxClicked = (tvid: number) => {
    navigate(`/nomflix_clone/tv/${type}/${tvid}`);
  };

  const bigMovieMatch = useMatch(`/nomflix_clone/tv/${type}/:id`);
  const { scrollY } = useScroll();
  const onOverlayClick = () => navigate("/nomflix_clone/tv");
  const clickedTvshows =
    bigMovieMatch?.params.id &&
    data?.results.find(
      (tvshow) => String(tvshow.id) === bigMovieMatch.params.id
    );
  return (
    <>
      <Slider>
        <Type>
          {type === TvShowTypes.airing_today && "AIRING TODAY"}
          {type === TvShowTypes.on_the_air && "ON THE AIR"}
          {type === TvShowTypes.popular && "POPULAR"}
          {type === TvShowTypes.top_rated && "TOP RATED"}
        </Type>
        <AnimatePresence
          custom={{ isNext }}
          initial={false}
          onExitComplete={toggleLeaving}
        >
          <Row
            custom={{ isNext }}
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 1 }}
            key={index}
          >
            {data?.results
              .slice(1)
              .slice(offset * index, offset * index + offset)
              .map((tvshows) => (
                <>
                  <Box
                    layoutId={type + String(tvshows.id)}
                    key={type + tvshows.id}
                    whileHover="hover"
                    initial="normal"
                    variants={BoxVariants}
                    onClick={() => {
                      onBoxClicked(tvshows.id);
                    }}
                    transition={{ type: "tween" }}
                    bgPhoto={makeImagePath(tvshows.backdrop_path, "w500")}
                  >
                    <Info variants={infoVariants}>
                      <h4>{tvshows.original_name}</h4>
                    </Info>
                  </Box>
                </>
              ))}
          </Row>
        </AnimatePresence>

        <ArrowBTN onClick={incraseIndexPrev} isPrev={true}>
          <img alt="left" src={require("../../img/arrowLeft.PNG")} />
        </ArrowBTN>
        <ArrowBTN onClick={incraseIndexNext} isPrev={false}>
          <img alt="right" src={require("../../img/arrowRight.PNG")} />
        </ArrowBTN>
      </Slider>

      <AnimatePresence>
        {bigMovieMatch && (
          <>
            <Overlay
              onClick={onOverlayClick}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            <BigMovie
              style={{ top: scrollY.get() + 100 }}
              layoutId={type + bigMovieMatch.params.id}
            >
              {clickedTvshows && (
                <>
                  <BigCover
                    style={{
                      backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                        clickedTvshows.backdrop_path,
                        "w500"
                      )})`,
                    }}
                  />
                  <BigTitle>{clickedTvshows.original_name}</BigTitle>
                  <BigOverview>
                    <span key="e">Overview</span>
                    <br />
                    {clickedTvshows.overview.length > 300
                      ? `${clickedTvshows.overview.slice(0, 300)}...`
                      : clickedTvshows.overview}
                  </BigOverview>
                  <BigDiv>
                    <BigLanguage>
                      <span>Language</span>
                      <img
                        alt="1"
                        src={require(`../../img/${clickedTvshows.original_language}.png`)}
                      />
                      <br />
                      {clickedTvshows.original_language === "en"
                        ? "English"
                        : clickedTvshows.original_language === "ko"
                        ? "Korean"
                        : clickedTvshows.original_language === "ja"
                        ? "Japanese"
                        : clickedTvshows.original_language === "cn" ||
                          clickedTvshows.original_language === "zh"
                        ? "China"
                        : clickedTvshows.original_language === "fr"
                        ? "France"
                        : clickedTvshows.original_language === "it"
                        ? "Italy"
                        : clickedTvshows.original_language === "es"
                        ? "Spain"
                        : clickedTvshows.original_language === "hi"
                        ? "India"
                        : clickedTvshows.original_language === "pt"
                        ? "Portugal"
                        : clickedTvshows.original_language === "tl"
                        ? "Democratic Republic of Timor-Leste"
                        : clickedTvshows.original_language === "tr"
                        ? "Turkey"
                        : null}
                    </BigLanguage>
                    <BigVoteAVG>
                      <span>VoteAVG</span>
                      <br />✮{clickedTvshows.vote_average}
                    </BigVoteAVG>
                    <BigPopularity>
                      <span>Poupularity</span>
                      <br />
                      👍{clickedTvshows.popularity.toFixed(0)}
                    </BigPopularity>
                    <BigReleaseDate>
                      <span>Release Date</span>
                      <br />
                      {clickedTvshows.first_air_date}
                    </BigReleaseDate>
                  </BigDiv>
                </>
              )}
            </BigMovie>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
