import { memo } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Container,
  Typography,
  IconButton,
  Chip,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import FavoriteIcon from "@mui/icons-material/Favorite";
import InfoIcon from "@mui/icons-material/Info";

const ActionButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "variant",
})(({ variant = "ghost" }) => ({
  width: variant === "primary" ? 74 : 58,
  height: variant === "primary" ? 74 : 58,
  borderRadius: "50%",
  background:
    variant === "primary"
      ? "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)"
      : "rgba(255,255,255,.16)",
  color: variant === "primary" ? "#000" : "#fff",
  border: variant === "primary" ? "none" : "2px solid rgba(255,255,255,.34)",
  backdropFilter: "blur(12px)",
  boxShadow:
    variant === "primary"
      ? "0 8px 22px rgba(255,215,0,.42)"
      : "0 6px 16px rgba(0,0,0,.32)",
  transition: "all .22s ease",
  "&:hover": {
    transform: "scale(1.06)",
    background:
      variant === "primary"
        ? "linear-gradient(135deg, #FFEE60 0%, #FFB84D 100%)"
        : "rgba(255,215,0,.22)",
    borderColor: variant === "primary" ? "transparent" : "#FFD700",
    color: variant === "primary" ? "#000" : "#FFD700",
  },
}));

const Hero = memo(({ movie, onPlay, onFavorite, onInfo }) => {
  if (!movie) return null;

  return (
    <Box sx={{ position: "relative", zIndex: 1 }}>
      <Container maxWidth={false} sx={{ pt: 14, px: { xs: 2, md: 4, lg: 6 } }}>
        <Box sx={{ position: "relative", minHeight: "90vh" }}>
          <Grid container sx={{ minHeight: "90vh" }}>
            <Grid
              item
              xs={12}
              lg={5}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                pr: { lg: 6 },
                py: 8,
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  color: "#fff",
                  fontWeight: 900,
                  mb: 2,
                  fontSize: { xs: "2.6rem", md: "3.8rem" },
                  lineHeight: 1.08,
                  letterSpacing: "-.4px",
                  textShadow: "0 4px 12px rgba(0,0,0,.7)",
                }}
              >
                {movie.title}
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  background:
                    "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 4,
                  fontSize: { xs: "1.35rem", md: "1.85rem" },
                  fontWeight: 700,
                  letterSpacing: ".4px",
                  textShadow: "0 2px 8px rgba(255,215,0,.28)",
                }}
              >
                {movie.englishTitle}
              </Typography>

              {/* Tags */}
              <Box sx={{ display: "flex", gap: 1.2, mb: 3, flexWrap: "wrap" }}>
                <Chip
                  label={
                    movie.imdbRating
                      ? `IMDb ${movie.imdbRating.toFixed(1)}`
                      : "IMDb"
                  }
                  sx={{
                    background:
                      "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                    color: "#000",
                    fontWeight: 800,
                    boxShadow: "0 4px 12px rgba(255,215,0,.38)",
                  }}
                />
                <Chip
                  label={movie.year}
                  sx={{
                    background: "rgba(255,255,255,.18)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,.36)",
                    backdropFilter: "blur(10px)",
                    fontWeight: 600,
                  }}
                />
                <Chip
                  label={movie.duration ? `${movie.duration} phút` : "Duration"}
                  sx={{
                    background: "rgba(255,255,255,.18)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,.36)",
                    backdropFilter: "blur(10px)",
                    fontWeight: 600,
                  }}
                />
              </Box>

              {/* Genres */}
              <Typography
                sx={{
                  color: "rgba(255,255,255,.9)",
                  mb: 3,
                  fontSize: "1rem",
                }}
              >
                {movie.genres.join(" • ")}
              </Typography>

              {/* Synopsis */}
              <Typography
                sx={{
                  color: "rgba(255,255,255,.9)",
                  mb: 4,
                  lineHeight: 1.7,
                  fontSize: "1.06rem",
                  maxWidth: 680,
                  textShadow: "0 2px 4px rgba(0,0,0,.3)",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {movie.synopsis}
              </Typography>

              {/* Actions */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <ActionButton
                  variant="primary"
                  aria-label="Phát"
                  onClick={() => onPlay && onPlay(movie)}
                >
                  <PlayArrowIcon sx={{ fontSize: 30 }} />
                </ActionButton>
                <ActionButton
                  aria-label="Yêu thích"
                  onClick={() => onFavorite && onFavorite(movie)}
                >
                  <FavoriteIcon />
                </ActionButton>
                <ActionButton
                  aria-label="Thông tin"
                  onClick={() => onInfo && onInfo(movie)}
                >
                  <InfoIcon />
                </ActionButton>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
});

Hero.displayName = "Hero";

Hero.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    englishTitle: PropTypes.string.isRequired,
    rating: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    genres: PropTypes.arrayOf(PropTypes.string).isRequired,
    synopsis: PropTypes.string.isRequired,
    thumb: PropTypes.string.isRequired,
    imdbRating: PropTypes.number,
  }),
  onPlay: PropTypes.func,
  onFavorite: PropTypes.func,
  onInfo: PropTypes.func,
};

export default Hero;
