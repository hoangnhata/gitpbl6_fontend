import { memo } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import MovieCard from "./MovieCard";
import { THUMB_SIZE } from "../../constants";

const ThumbnailsContainer = styled(Box)(({ theme }) => ({
  position: "absolute", // chỉ trong hero section
  right: 20, // cách mép phải
  bottom: 28, // cách mép dưới
  display: "flex",
  gap: theme.spacing(1),
  overflowX: "auto",
  padding: theme.spacing(0.5),
  zIndex: 2, // giảm z-index
  "&::-webkit-scrollbar": { height: 6 },
  "&::-webkit-scrollbar-thumb": {
    background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
    borderRadius: 999,
  },
  // responsive: cách mép phải rộng hơn ở màn hình lớn
  [theme.breakpoints.up("md")]: {
    right: 40,
  },
}));

const MovieThumbnails = memo(({ movies, activeIndex, onMovieSelect }) => {
  return (
    <ThumbnailsContainer>
      {movies.map((movie, index) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isActive={index === activeIndex}
          onClick={() => onMovieSelect(index)}
          size={THUMB_SIZE}
        />
      ))}
    </ThumbnailsContainer>
  );
});

MovieThumbnails.displayName = "MovieThumbnails";

MovieThumbnails.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      thumb: PropTypes.string.isRequired,
    })
  ).isRequired,
  activeIndex: PropTypes.number.isRequired,
  onMovieSelect: PropTypes.func.isRequired,
};

export default MovieThumbnails;
