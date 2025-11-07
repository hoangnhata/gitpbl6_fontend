import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Stack,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { getUpcomingMovies } from "../api/streaming";

const SectionHeading = ({ title, subtitle, icon }) => (
  <Stack spacing={1.5} alignItems="center" textAlign="center" sx={{ mb: 5 }}>
    <Stack direction="row" spacing={1} alignItems="center">
      {icon}
      <Typography
        variant="h3"
        sx={{
          fontWeight: 900,
          letterSpacing: "-0.5px",
          background: "linear-gradient(45deg, #FFD700, #FFA500)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textTransform: "uppercase",
        }}
      >
        {title}
      </Typography>
    </Stack>
    {subtitle && (
      <Typography
        variant="body1"
        sx={{ color: "rgba(255,255,255,0.72)", maxWidth: 720 }}
      >
        {subtitle}
      </Typography>
    )}
  </Stack>
);

const createMovieCardData = (movie, index = 0) => {
  if (!movie) return null;
  const title = movie.title || movie.englishTitle || movie.name || `Movie ${
    index + 1
  }`;
  let posterUrl =
    movie.posterUrl ||
    movie.thumbnail ||
    movie.thumbnailUrl ||
    movie.thumb ||
    movie.imageUrl ||
    "";

  if (
    posterUrl &&
    !posterUrl.startsWith("http") &&
    !posterUrl.startsWith("/api") &&
    !posterUrl.startsWith("/")
  ) {
    posterUrl = `/api${posterUrl}`;
  }

  if (!posterUrl) {
    posterUrl = `https://via.placeholder.com/400x550/111/fff?text=${encodeURIComponent(
      title
    )}`;
  }

  return {
    id: movie.id ?? `${title}-${index}`,
    title,
    thumb: posterUrl,
    rating:
      movie.imdbRating?.toString() ||
      movie.averageRating?.toString() ||
      movie.rating?.toString() ||
      "8.5",
    year: movie.year?.toString() ||
      (movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : "2024"),
    genres: movie.categories || movie.genres || [],
    synopsis: movie.synopsis || movie.description || "",
    releaseDate: movie.releaseDate,
    duration: movie.duration || movie.runtime,
  };
};

export default function Showtime() {
  const navigate = useNavigate();
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);
  const [errorUpcoming, setErrorUpcoming] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadUpcoming = async () => {
      setLoadingUpcoming(true);
      try {
        const data = await getUpcomingMovies(12);
        if (cancelled) return;
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
          ? data.content
          : Array.isArray(data?.data)
          ? data.data
          : [];
        const transformed = list
          .map((movie, index) => createMovieCardData(movie, index))
          .filter(Boolean);
        setUpcomingMovies(transformed);
        setErrorUpcoming(transformed.length === 0 ? "" : "");
      } catch (err) {
        if (!cancelled) {
          setErrorUpcoming(
            err?.message || "Không thể tải danh sách phim sắp chiếu"
          );
          setUpcomingMovies([]);
        }
      } finally {
        if (!cancelled) setLoadingUpcoming(false);
      }
    };

    loadUpcoming();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", background: "#050505", color: "#fff" }}>
      <Header />

      <Box sx={{ pt: { xs: 6, md: 8 } }}>
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 8 } }}>
          <SectionHeading
            title="Phim sắp chiếu"
            subtitle="Đặt lời nhắc để không bỏ lỡ những bom tấn sắp ra mắt"
            icon={<CalendarMonthIcon sx={{ color: "#FFD700", fontSize: 40 }} />}
          />

          {loadingUpcoming ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress color="warning" />
            </Box>
          ) : errorUpcoming ? (
            <Typography
              variant="body1"
              sx={{ textAlign: "center", color: "rgba(255,255,255,0.72)" }}
            >
              {errorUpcoming}
            </Typography>
          ) : upcomingMovies.length === 0 ? (
            <Typography
              variant="body1"
              sx={{ textAlign: "center", color: "rgba(255,255,255,0.72)" }}
            >
              Hiện chưa có phim sắp chiếu nào được công bố.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {upcomingMovies.map((movie) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
                  <Card
                    sx={{
                      background: "rgba(15,15,15,0.9)",
                      borderRadius: 3,
                      border: "1px solid rgba(255,215,0,0.15)",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      '&:hover': {
                        transform: "translateY(-4px)",
                        borderColor: "rgba(255,215,0,0.45)",
                        boxShadow:
                          "0 16px 30px rgba(0,0,0,0.45), 0 0 15px rgba(255,215,0,0.25)",
                      },
                    }}
                    onClick={() => navigate(`/movie/${movie.id}`)}
                  >
                    <CardMedia
                      component="img"
                      image={movie.thumb}
                      alt={movie.title}
                      sx={{
                        height: 340,
                        objectFit: "cover",
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Stack spacing={1.5}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            lineHeight: 1.4,
                            color: "#fff",
                          }}
                        >
                          {movie.title}
                        </Typography>
                        {movie.releaseDate && (
                          <Chip
                            icon={<CalendarMonthIcon sx={{ color: "#FFD700" }} />}
                            label={new Date(movie.releaseDate).toLocaleDateString(
                              "vi-VN",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )}
                            sx={{
                              bgcolor: "rgba(255,215,0,0.12)",
                              color: "#FFD700",
                              alignSelf: "flex-start",
                              borderRadius: 2,
                            }}
                          />
                        )}
                        {movie.duration && (
                          <Typography
                            variant="body2"
                            sx={{ color: "rgba(255,255,255,0.7)" }}
                          >
                            Thời lượng: {movie.duration} phút
                          </Typography>
                        )}
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {movie.genres?.slice(0, 3).map((genre) => (
                            <Chip
                              key={genre}
                              label={genre}
                              size="small"
                              sx={{
                                bgcolor: "rgba(255,215,0,0.08)",
                                color: "#FFD700",
                              }}
                            />
                          ))}
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}


