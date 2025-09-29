import { memo } from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";

const MovieCard = styled("button")(({ size }) => ({
  width: size,
  height: size,
  borderRadius: 12,
  overflow: "hidden",
  cursor: "pointer",
  border: "1px solid rgba(255,255,255,.22)",
  padding: 0,
  background: "transparent",
  boxShadow: "0 2px 8px rgba(0,0,0,.28)",
  transition: "transform .18s ease, box-shadow .18s ease, opacity .18s ease",
  "&:hover": {
    transform: "translateY(-2px) scale(1.03)",
    boxShadow: "0 8px 18px rgba(0,0,0,.35)",
  },
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
}));

const MovieCardComponent = memo(({ movie, isActive, onClick, size }) => {
  const handleImageError = (e) => {
    e.currentTarget.src = `https://via.placeholder.com/${size}x${size}/333/fff?text=${encodeURIComponent(
      movie.title
    )}`;
  };

  return (
    <MovieCard
      onClick={onClick}
      aria-label={`Chọn phim ${movie.title}`}
      size={size}
      style={{
        outline: isActive ? "3px solid #FFD700" : "none",
        outlineOffset: isActive ? 2 : 0,
        opacity: isActive ? 1 : 0.75,
      }}
    >
      <img
        src={movie.thumb}
        alt={movie.title}
        loading="lazy"
        onError={handleImageError}
      />
    </MovieCard>
  );
});

MovieCardComponent.displayName = "MovieCard";

MovieCardComponent.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    thumb: PropTypes.string.isRequired,
  }).isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  size: PropTypes.number.isRequired,
};

export default MovieCardComponent;
