import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";
import { useMatch, useNavigate } from "react-router-dom";
import NowPlayingSlider from "../Components/Sliders/NowPlayingSlider";

const Wrapper = styled.div`
  background-color: black;
  padding-bottom: 200px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled(motion.div)<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.6)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  font-weight: bolder;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  width: 50%;
  font-size: 18px;
  font-weight: bold;
  span {
    font-size: 30px;
    font-weight: bolder;
  }
`;

const Language = styled.div`
  width: 50%;
  font-size: 18px;
  font-weight: bold;
  span {
    font-size: 30px;
    font-weight: bolder;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.5);
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

function Home() {
  const navigate = useNavigate();
  const bigMovieMatch = useMatch("/movies/:movieId");
  const { scrollY } = useScroll();
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  const onOverlayClick = () => navigate("/");
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie) => String(movie.id) === bigMovieMatch.params.movieId
    );
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading....</Loader>
      ) : (
        <>
          <Banner
            onClick={() => {
              data && onBoxClicked(data?.results[0].id);
            }}
            layoutId={String(data?.results[0].id)}
            key={data?.results[0].id}
            bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>
              <span>Overview</span>
              <br />
              {data?.results[0].overview}
            </Overview>
            <br />
            <Language>
              <span>Language</span>
              <img
                alt={data?.results[0].backdrop_path}
                src={require(`../img/${data?.results[0].original_language}.png`)}
              />
              <br />
              {data?.results[0].original_language === "en"
                ? "English"
                : data?.results[0].original_language === "ko"
                ? "Korean"
                : data?.results[0].original_language === "ja"
                ? "Japanese"
                : null}
            </Language>
          </Banner>
          <div>
            <NowPlayingSlider />
          </div>
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
                  layoutId={bigMovieMatch.params.movieId}
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
                        {clickedMovie.overview}
                      </BigOverview>
                      <BigDiv>
                        <BigLanguage>
                          <span>Language</span>
                          <img
                            alt="1"
                            src={require(`../img/${clickedMovie.original_language}.png`)}
                          />
                          <br />
                          {clickedMovie.original_language === "en"
                            ? "English"
                            : clickedMovie.original_language === "ko"
                            ? "Korean"
                            : clickedMovie.original_language === "ja"
                            ? "Japanese"
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
      )}
    </Wrapper>
  );
}
export default Home;
