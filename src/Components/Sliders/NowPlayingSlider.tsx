import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../../api";
import { makeImagePath } from "../../utils";

const Slider = styled.div`
  display: grid;
  position: relative;
  top: -50px;
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

const ArrowLeft = styled.div`
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  background-color: rgba(255, 255, 255, 0.05);
  height: 100%;
  width: 2%;
  cursor: pointer;
`;

const ArrowRight = styled.div`
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  background-color: rgba(255, 255, 255, 0.05);
  height: 100%;
  width: 2%;
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

const offset = 6;

function NowPlayingSlider() {
  const { data } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
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
    navigate(`/movies/${movieId}`);
  };
  return (
    <Slider>
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
                <ArrowLeft onClick={incraseIndexPrev}>
                  <img
                    alt={movie.poster_path}
                    src={require("../../img/arrowLeft.PNG")}
                  />
                </ArrowLeft>
                <Box
                  layoutId={String(movie.id)}
                  key={movie.id}
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
                <ArrowRight onClick={incraseIndexNext}>
                  <img
                    alt={movie.poster_path}
                    src={require("../../img/arrowRight.PNG")}
                  />
                </ArrowRight>
              </>
            ))}
        </Row>
      </AnimatePresence>
      <NowPlayingSlider />
    </Slider>
  );
}

export default NowPlayingSlider;
