import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled(motion.div)`
  margin: 150px 60px 0px 90px;
`;

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");

  return <Wrapper>{keyword}</Wrapper>;
}
export default Search;
