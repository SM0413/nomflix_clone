import { motion } from "framer-motion";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getTvShows, IGetTvShowsResult } from "../api";
import { makeImagePath, TvShowTypes } from "../utils";
import { TvShowSlider } from "../Components/Sliders/Sliders";

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

function Tv() {
  const { data, isLoading } = useQuery<IGetTvShowsResult>(
    ["Tvshows", TvShowTypes.airing_today],
    () => getTvShows(TvShowTypes.airing_today)
  );
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading....</Loader>
      ) : (
        <>
          <Banner
            layoutId={String(data?.results[0].id)}
            key={data?.results[0].id}
            bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].original_name}</Title>
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
          <TvShowSlider type={TvShowTypes.airing_today} />
          <TvShowSlider type={TvShowTypes.on_the_air} />
          <TvShowSlider type={TvShowTypes.popular} />
          <TvShowSlider type={TvShowTypes.top_rated} />
        </>
      )}
    </Wrapper>
  );
}
export default Tv;
