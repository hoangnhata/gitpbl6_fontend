import PropTypes from "prop-types";
import { memo, useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Chip,
  IconButton,
  Button,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import FavoriteIcon from "@mui/icons-material/Favorite";
import InfoIcon from "@mui/icons-material/Info";
import { addFavorite as addFavoriteApi } from "../../api/favorites";

/* ===================== Khối nền & layout ===================== */
const SectionContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(5, 0),
  background: "linear-gradient(135deg, #0b0b0c 0%, #151518 50%, #0b0b0c 100%)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(1000px 400px at 20% 10%, rgba(255,215,0,.06), transparent 60%)",
    pointerEvents: "none",
  },
}));

const Layout = styled(Box)(() => ({
  display: "grid",
  gridTemplateColumns: "280px 1fr",
  alignItems: "stretch",
  gap: 16,
  /* Mobile: đưa sidebar lên trên */
  "@media (max-width: 900px)": {
    gridTemplateColumns: "1fr",
    gap: 12,
  },
}));

const Sidebar = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  minHeight: 220,
  padding: 8,
}));

const SectionTitle = styled(Typography)(() => ({
  fontWeight: 900,
  fontSize: "2rem",
  lineHeight: 1.1,
  background: "linear-gradient(135deg, #B388FF 0%, #FFD54F 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}));

const ViewAll = styled(Box)(() => ({
  color: "#FFD700",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  cursor: "pointer",
  fontWeight: 800,
  fontSize: "0.95rem",
  opacity: 0.85,
  "&:hover": { opacity: 1 },
}));

/* ===================== Card phim ===================== */
/* Chiếm đúng 1/5 chiều rộng hàng để luôn hiển thị 5 card đầy đủ */
const MovieCard = styled(Card)(() => ({
  background: "#0f1013",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 14,
  overflow: "hidden",
  width: "var(--cardW)",
  flex: "0 0 var(--cardW)",
  position: "relative",
  transition:
    "transform .22s ease, box-shadow .22s ease, border-color .22s ease, opacity .22s ease",
  "&:hover": {
    transform: "translateY(-3px) scale(1.015)",
    boxShadow: "0 16px 36px rgba(0,0,0,0.45)",
    borderColor: "rgba(255,215,0,0.35)",
  },
}));

/* Hover Card */
const HoverCard = styled(Box)(({ position }) => ({
  position: "fixed",
  top: position?.top || "50%",
  left: position?.left || "50%",
  transform: "translate(-50%, -50%)",
  width: "450px",
  maxWidth: "80vw",
  background: "#0f1013",
  borderRadius: 12,
  overflow: "hidden",
  zIndex: 1000,
  boxShadow: "0 15px 40px rgba(0,0,0,0.9)",
  border: "1px solid rgba(255,215,0,0.4)",
  opacity: 0,
  visibility: "hidden",
  transition: "opacity 0.25s ease, visibility 0.25s ease, transform 0.25s ease",
  "&.visible": {
    opacity: 1,
    visibility: "visible",
    transform: "translate(-50%, -50%) scale(1.05)",
  },
}));

/* Hover Card Poster */
const HoverPoster = styled(Box)(() => ({
  position: "relative",
  height: "280px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
}));

const HoverPosterImage = styled(CardMedia)(() => ({
  width: "100%",
  height: "100%",
  objectFit: "cover",
}));

const PosterOverlay = styled(Box)(() => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
  padding: "16px",
  zIndex: 2,
}));

const OverlayTitle = styled(Typography)(() => ({
  color: "#fff",
  fontSize: "1.3rem",
  fontWeight: 900,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  lineHeight: 1.2,
}));

/* Hover Card Content */
const HoverInfo = styled(Box)(() => ({
  padding: "20px",
  background: "#0f1013",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
}));

const HoverTitle = styled(Typography)(() => ({
  color: "#fff",
  fontSize: "1.3rem",
  fontWeight: 700,
  marginBottom: "6px",
}));

const HoverSubtitle = styled(Typography)(() => ({
  color: "#FFD700",
  fontSize: "1rem",
  fontWeight: 500,
  marginBottom: "12px",
}));

/* Action buttons */
const ActionButtons = styled(Stack)(() => ({
  flexDirection: "row",
  gap: "10px",
  marginBottom: "12px",
}));

const WatchButton = styled(Button)(() => ({
  background: "#FFD700",
  color: "#000",
  fontWeight: 700,
  fontSize: "0.9rem",
  padding: "10px 20px",
  borderRadius: "6px",
  minWidth: "auto",
  flex: 1,
  "&:hover": {
    background: "#FFC107",
  },
}));

const ActionButton = styled(Button)(() => ({
  background: "rgba(255,255,255,0.1)",
  color: "#fff",
  minWidth: "auto",
  padding: "10px",
  borderRadius: "6px",
  "&:hover": {
    background: "rgba(255,255,255,0.2)",
  },
}));

/* Metadata */
const Metadata = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginBottom: "10px",
  flexWrap: "wrap",
}));

const MetadataItem = styled(Typography)(() => ({
  color: "#fff",
  fontSize: "0.9rem",
  fontWeight: 500,
}));

const RatingBadge = styled(Chip)(() => ({
  background: "rgba(0,0,0,0.75)",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.2)",
  height: "24px",
  fontSize: "0.8rem",
  fontWeight: 700,
}));

/* Genres */
const Genres = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  flexWrap: "wrap",
}));

const GenreItem = styled(Typography)(() => ({
  color: "#fff",
  fontSize: "0.8rem",
  fontWeight: 400,
  "&:not(:last-child)::after": {
    content: '"•"',
    marginLeft: "10px",
    color: "rgba(255,255,255,0.5)",
  },
}));

/* 16:9 – dùng aspectRatio (có fallback) */
const Poster = styled(CardMedia)(() => ({
  aspectRatio: "16 / 9",
  /* Fallback nếu trình duyệt cũ */
  "@supports not (aspect-ratio: 16 / 9)": {
    paddingTop: "56.25%",
  },
}));

const Title = styled(Typography)(() => ({
  color: "#fff",
  fontSize: "1.06rem",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
}));

const Subtitle = styled(Typography)(() => ({
  color: "rgba(255,255,255,0.75)",
  fontSize: "0.86rem",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
}));

const Badges = styled(Box)(() => ({
  position: "absolute",
  top: 8,
  left: 8,
  display: "flex",
  gap: 6,
  "& > *": {
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: 12,
    padding: "2px 8px",
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#fff",
    background: "rgba(0,0,0,0.75)",
  },
}));

/* ===================== Hàng cuộn ngang ===================== */
const ScrollWrap = styled(Box)(() => ({
  position: "relative",
  overflow: "hidden", // prevent row from expanding page width
}));

const ScrollRow = styled(Box)(() => ({
  "--gap": "16px",
  "--cardW": "calc((100% - (var(--gap,16px)) * (5 - 1)) / 5)",
  display: "flex",
  gap: "var(--gap)",
  overflowX: "auto",
  scrollBehavior: "smooth",
  padding: 0,
  scrollSnapType: "x proximity",
  "& > *": { scrollSnapAlign: "start" },
  /* Hide scrollbar (cross-browser) */
  msOverflowStyle: "none", // IE/Edge
  scrollbarWidth: "none", // Firefox
  "&::-webkit-scrollbar": { display: "none" }, // Chrome/Safari
}));

const NavBtn = styled(IconButton)(() => ({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 2,
  background: "rgba(0,0,0,0.8)",
  color: "#FFD700",
  border: "2px solid rgba(255,215,0,0.35)",
  boxShadow: "0 8px 24px rgba(0,0,0,.5)",
  "&:hover": {
    background: "rgba(255,215,0,0.12)",
    border: "2px solid rgba(255,215,0,0.65)",
  },
}));

/* ===================== Component chính ===================== */
const CatalogSection = memo(function CatalogSection({
  title,
  movies = [],
  onViewAll,
}) {
  const navigate = useNavigate();
  const rowRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [hoveredMovie, setHoveredMovie] = useState(null);
  const [showHoverCard, setShowHoverCard] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({
    top: "50%",
    left: "50%",
  });
  const hoverTimeoutRef = useRef(null);

  const updateArrows = useCallback(() => {
    const el = rowRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 0);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = rowRef.current;
    if (!el) return;
    const onScroll = () => updateArrows();
    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
      // Cleanup timeout khi component unmount
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [updateArrows]);

  const scrollPage = (dir = 1) => {
    const el = rowRef.current;
    if (!el) return;
    const gap = 16;
    const delta = el.clientWidth - gap; // trượt gần bằng 1 "trang"
    el.scrollBy({ left: dir * delta, behavior: "smooth" });
  };

  const handleMovieHover = (movie, event) => {
    // Clear timeout cũ nếu có
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    setHoveredMovie(movie);
    setHoverPosition({
      top: `${centerY}px`,
      left: `${centerX}px`,
    });

    // Delay 2 giây trước khi hiển thị hover card
    hoverTimeoutRef.current = setTimeout(() => {
      setShowHoverCard(true);
    }, 500);
  };

  const handleMovieLeave = () => {
    // Clear timeout nếu chuột rời khỏi card trước khi hết 2 giây
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    setShowHoverCard(false);
    // Delay để tránh flicker khi di chuyển chuột
    setTimeout(() => {
      if (!showHoverCard) {
        setHoveredMovie(null);
      }
    }, 300);
  };

  return (
    <SectionContainer>
      <Container maxWidth="xl">
        <Layout>
          <Sidebar>
            <SectionTitle>{title}</SectionTitle>
            <ViewAll
              onClick={() => {
                if (onViewAll) {
                  onViewAll();
                }
              }}
            >
              Xem toàn bộ ›
            </ViewAll>
          </Sidebar>

          <ScrollWrap>
            {canPrev && (
              <NavBtn
                onClick={() => scrollPage(-1)}
                size="small"
                sx={{ left: 8 }}
              >
                <ChevronLeftIcon />
              </NavBtn>
            )}

            <ScrollRow ref={rowRef}>
              {movies.map((m) => (
                <MovieCard
                  key={m.id}
                  onClick={() => navigate(`/movie/${m.id}`)}
                  onMouseEnter={(e) => handleMovieHover(m, e)}
                  onMouseLeave={handleMovieLeave}
                >
                  <Box sx={{ position: "relative" }}>
                    <Poster image={m.thumb} />
                    <Badges>
                      <Box component="span">
                        {m.pd
                          ? `PD. ${m.pd}`
                          : m.episode
                          ? `PD. ${m.episode}`
                          : null}
                        {m.tm ? ` | TM. ${m.tm}` : null}
                      </Box>
                    </Badges>
                  </Box>

                  <CardContent sx={{ p: 1.5 }}>
                    <Title title={m.title}>{m.title}</Title>
                    {m.subtitle && (
                      <Subtitle title={m.subtitle}>{m.subtitle}</Subtitle>
                    )}
                  </CardContent>
                </MovieCard>
              ))}
            </ScrollRow>

            {canNext && (
              <NavBtn
                onClick={() => scrollPage(1)}
                size="small"
                sx={{ right: 8 }}
              >
                <ChevronRightIcon />
              </NavBtn>
            )}
          </ScrollWrap>
        </Layout>
      </Container>

      {/* Hover Card */}
      <HoverCard
        className={showHoverCard ? "visible" : ""}
        position={hoverPosition}
        onMouseEnter={() => setShowHoverCard(true)}
        onMouseLeave={handleMovieLeave}
      >
        {hoveredMovie && (
          <>
            <HoverPoster>
              <HoverPosterImage
                image={hoveredMovie.thumb}
                alt={hoveredMovie.title}
              />
              <PosterOverlay>
                <OverlayTitle>{hoveredMovie.title}</OverlayTitle>
              </PosterOverlay>
            </HoverPoster>

            <HoverInfo>
              <HoverTitle>{hoveredMovie.title}</HoverTitle>
              {hoveredMovie.subtitle && (
                <HoverSubtitle>{hoveredMovie.subtitle}</HoverSubtitle>
              )}

              <ActionButtons>
                <WatchButton
                  startIcon={<PlayArrowIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/stream/${hoveredMovie.id}`, {
                      state: { episode: 1, audioMode: "sub" },
                    });
                  }}
                >
                  Xem ngay
                </WatchButton>
                <ActionButton
                  onClick={async (e) => {
                    e.stopPropagation();
                    try {
                      await addFavoriteApi(hoveredMovie.id);
                      window.dispatchEvent(
                        new CustomEvent("app:toast", {
                          detail: {
                            message: "Đã thêm vào Yêu thích",
                            severity: "success",
                          },
                        })
                      );
                    } catch (err) {
                      window.dispatchEvent(
                        new CustomEvent("app:toast", {
                          detail: {
                            message: "Không thể thêm Yêu thích",
                            severity: "error",
                          },
                        })
                      );
                    }
                  }}
                >
                  <FavoriteIcon />
                </ActionButton>
                <ActionButton
                  onClick={() => navigate(`/movie/${hoveredMovie.id}`)}
                >
                  <InfoIcon />
                </ActionButton>
              </ActionButtons>

              <Metadata>
                <RatingBadge label="T18" />
                <MetadataItem>2025</MetadataItem>
                <MetadataItem>Phần 1</MetadataItem>
                <MetadataItem>Tập 12</MetadataItem>
              </Metadata>

              <Genres>
                <GenreItem>Chính Kịch</GenreItem>
                <GenreItem>Hình Sự</GenreItem>
                <GenreItem>Khoa Học</GenreItem>
                <GenreItem>Tâm Lý</GenreItem>
              </Genres>
            </HoverInfo>
          </>
        )}
      </HoverCard>
    </SectionContainer>
  );
});

CatalogSection.propTypes = {
  title: PropTypes.string.isRequired,
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      thumb: PropTypes.string.isRequired,
      subtitle: PropTypes.string,
      episode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      pd: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      tm: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  onViewAll: PropTypes.func,
};

export default CatalogSection;
