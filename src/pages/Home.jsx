import { useState, useCallback, useEffect, useRef } from "react";
import { Box, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Components
import Header from "../components/Header";
import Hero from "../components/Hero";
import MovieThumbnails from "../components/MovieThumbnails";
import Background from "../components/Background";
import FeaturedMovies from "../components/FeaturedMovies";
import CatalogSection from "../components/CatalogSection";
import TopComments from "../components/TopComments";
import CallToAction from "../components/CallToAction";
import Footer from "../components/Footer";

// Hooks
import useMovies from "../hooks/useMovies";

// Utils
import { toHero } from "../utils/imageUtils";

export default function Home() {
  const { movies } = useMovies();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeMovie = movies[activeIndex];
  const navigate = useNavigate();

  // Ẩn/hiện thumbnails khi rời Hero
  const [showThumb, setShowThumb] = useState(true);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Tham chiếu tới section Hero để đo chiều cao
  const heroRef = useRef(null);

  const handleMovieSelect = useCallback((index) => setActiveIndex(index), []);

  const handleSignUp = useCallback(() => {
    console.log("Sign up clicked");
  }, []);

  const handlePlay = useCallback(
    (movie) => {
      if (!movie?.id) return;
      navigate(`/stream/${movie.id}`);
    },
    [navigate]
  );

  const handleInfo = useCallback(
    (movie) => {
      if (!movie?.id) return;
      navigate(`/movie/${movie.id}`);
    },
    [navigate]
  );

  const handleFavorite = useCallback(async (movie) => {
    try {
      if (!movie?.id) return;
      const { addFavorite } = await import("../api/favorites.js");
      await addFavorite(movie.id);
      window.dispatchEvent(
        new CustomEvent("app:toast", {
          detail: { message: "Đã thêm vào Yêu thích", severity: "success" },
        })
      );
    } catch (err) {
      window.dispatchEvent(
        new CustomEvent("app:toast", {
          detail: { message: "Không thể thêm Yêu thích", severity: "error" },
        })
      );
    }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const heroEl = heroRef.current;
      if (!heroEl) return;

      // Lấy vị trí đáy của Hero so với viewport
      const rect = heroEl.getBoundingClientRect();
      // Khi đáy Hero đi lên khỏi viewport (<= 0) thì ẩn
      // Thêm buffer 120px để ẩn sớm, tránh đè nội dung
      const buffer = 120;
      const shouldShow = rect.bottom > buffer;

      setShowThumb(shouldShow);
    };

    // Gọi 1 lần khi mount để đồng bộ trạng thái ban đầu
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Lắng nghe sự kiện toast toàn cục
  useEffect(() => {
    const handler = (e) => {
      const detail = e?.detail || {};
      setToast({
        open: true,
        message: detail.message || "Thao tác thành công",
        severity: detail.severity || "success",
      });
    };
    window.addEventListener("app:toast", handler);
    return () => window.removeEventListener("app:toast", handler);
  }, []);

  return (
    <Box sx={{ background: "#000" }}>
      {/* Hero Section with Background */}
      <Box ref={heroRef} sx={{ position: "relative", minHeight: "100vh" }}>
        <Background backgroundImage={toHero(activeMovie?.thumb)} />
        <Header />
        <Hero
          movie={activeMovie}
          onPlay={handlePlay}
          onInfo={handleInfo}
          onFavorite={handleFavorite}
        />

        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 24,
            zIndex: 5,
            opacity: showThumb ? 1 : 0,
            pointerEvents: showThumb ? "auto" : "none",
            transform: showThumb ? "translateY(0)" : "translateY(8px)",
            transition: "opacity .25s ease, transform .25s ease",
          }}
        >
          <MovieThumbnails
            movies={movies}
            activeIndex={activeIndex}
            onMovieSelect={handleMovieSelect}
          />
        </Box>
      </Box>

      {/* Featured Movies Section */}
      <FeaturedMovies
        movies={movies}
        title="PHIM NỔI BẬT"
        subtitle="Khám phá những bộ phim hay nhất được yêu thích"
      />

      {/* Catalog sections similar to screenshot */}
      <CatalogSection
        title="Phim Hàn Quốc mới"
        movies={movies.map((m, i) => ({
          id: m.id || i + 1,
          title: m.title || `Movie ${i + 1}`,
          thumb: m.thumb,
          subtitle: m.subtitle || m.enTitle || m.engTitle,
          episode: m.ep || m.episode,
          pd: m.pd,
          tm: m.tm,
        }))}
      />

      <CatalogSection
        title="Phim Trung Quốc mới"
        movies={movies.map((m, i) => ({
          id: m.id || i + 1,
          title: m.title || `Movie ${i + 1}`,
          thumb: m.thumb,
          subtitle: m.subtitle || m.enTitle || m.engTitle,
          episode: m.ep || m.episode,
          pd: m.pd,
          tm: m.tm,
        }))}
      />

      <CatalogSection
        title="Phim US-UK mới"
        movies={movies.map((m, i) => ({
          id: m.id || i + 1,
          title: m.title || `Movie ${i + 1}`,
          thumb: m.thumb,
          subtitle: m.subtitle || m.enTitle || m.engTitle,
          episode: m.ep || m.episode,
          pd: m.pd,
          tm: m.tm,
        }))}
      />
      {/* Top Comments Section */}
      <TopComments />

      <CallToAction onSignUp={handleSignUp} />

      {/* Footer */}
      <Footer />

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
