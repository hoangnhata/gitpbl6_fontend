import { memo } from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";

const FullScreenBackground = styled("div", {
  shouldForwardProp: (prop) => prop !== "bg",
})(({ bg }) => ({
  position: "absolute",
  inset: 0,
  backgroundImage: `url("${bg}")`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  filter: "brightness(1.08) contrast(1.08) saturate(1.04)",
  zIndex: 0,
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(90deg, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.30) 32%, rgba(0,0,0,0.12) 62%, rgba(0,0,0,0.04) 100%)",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.36) 100%)",
  },
}));

const Background = memo(({ backgroundImage }) => {
  return <FullScreenBackground bg={backgroundImage} />;
});

Background.displayName = "Background";

Background.propTypes = {
  backgroundImage: PropTypes.string.isRequired,
};

export default Background;
