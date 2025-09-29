import PropTypes from "prop-types";
import { Box, Typography, keyframes } from "@mui/material";
import { styled } from "@mui/material/styles";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import MovieIcon from "@mui/icons-material/Movie";

// Animations
const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const fadeInOut = keyframes`
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
`;

const LoadingContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  background: "linear-gradient(135deg, #000 0%, #1a1a1a 50%, #000 100%)",
  color: "#fff",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "radial-gradient(circle at 50% 50%, rgba(255,215,0,0.1) 0%, transparent 70%)",
    animation: `${fadeInOut} 3s ease-in-out infinite`,
  },
}));

const MovieIconContainer = styled(Box)(() => ({
  position: "relative",
  marginBottom: "2rem",
  "& .movie-icon": {
    fontSize: "4rem",
    color: "#FFD700",
    animation: `${pulse} 2s ease-in-out infinite`,
    filter: "drop-shadow(0 0 20px rgba(255,215,0,0.5))",
  },
  "& .play-icon": {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "1.5rem",
    color: "#000",
    animation: `${rotate} 3s linear infinite`,
  },
}));

const LoadingText = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  color: "rgba(255,255,255,0.9)",
  fontSize: "1.2rem",
  fontWeight: 600,
  textAlign: "center",
  letterSpacing: "0.5px",
  textShadow: "0 2px 4px rgba(0,0,0,0.5)",
}));

const SubText = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(0.5),
  color: "rgba(255,255,255,0.6)",
  fontSize: "0.9rem",
  textAlign: "center",
  fontStyle: "italic",
}));

const ProgressDots = styled(Box)(() => ({
  display: "flex",
  gap: "0.5rem",
  marginTop: "1.5rem",
  "& .dot": {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#FFD700",
    animation: `${fadeInOut} 1.5s ease-in-out infinite`,
    "&:nth-of-type(2)": {
      animationDelay: "0.2s",
    },
    "&:nth-of-type(3)": {
      animationDelay: "0.4s",
    },
  },
}));

const Loading = ({ message = "Đang tải phim..." }) => {
  return (
    <LoadingContainer>
      <MovieIconContainer>
        <MovieIcon className="movie-icon" />
        <PlayArrowIcon className="play-icon" />
      </MovieIconContainer>

      <LoadingText variant="h6">{message}</LoadingText>
      <SubText variant="body2">PhimNhaLam - Phim hay nhà dịch</SubText>

      <ProgressDots>
        <div className="dot" />
        <div className="dot" />
        <div className="dot" />
      </ProgressDots>
    </LoadingContainer>
  );
};

Loading.propTypes = {
  message: PropTypes.string,
};

Loading.defaultProps = {
  message: "Đang tải...",
};

export default Loading;
