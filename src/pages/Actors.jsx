import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Container,
  Grid,
  InputBase,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate, useSearchParams } from "react-router-dom";
import { listActors } from "../api/actors";
import Header from "../components/Header";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const PageContainer = styled(Box)(() => ({
  minHeight: "100vh",
  background: "linear-gradient(180deg, #0b1220 0%, #0a0f1a 50%, #0b0d13 100%)",
  color: "#fff",
  paddingTop: 96,
}));

const SearchBar = styled(Paper)(() => ({
  display: "flex",
  alignItems: "center",
  padding: "10px 16px",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: 28,
  backdropFilter: "blur(8px)",
}));

const ActorCard = styled(Box)(() => ({
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 16,
  overflow: "hidden",
  cursor: "pointer",
  transition: "all .28s ease",
  backdropFilter: "blur(10px)",
  position: "relative",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
    borderColor: "rgba(255,215,0,0.45)",
  },
}));

export default function Actors() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const pageRef = useRef(0);
  const q = params.get("q") || "";

  const debouncedQuery = useDebounce(q, 300);

  useEffect(() => {
    load(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  async function load(page) {
    try {
      setLoading(true);
      setError("");
      const data = await listActors({ q: debouncedQuery, page, size: 24 });
      const list = Array.isArray(data?.content)
        ? data.content
        : Array.isArray(data)
        ? data
        : [];
      setItems(list);
      pageRef.current = page;
    } catch (e) {
      setError(e?.message || "Không thể tải danh sách diễn viên");
    } finally {
      setLoading(false);
    }
  }

  const handleOpen = (id) => navigate(`/actor/${id}`);

  return (
    <PageContainer>
      <Header />
      <Container maxWidth="xl" sx={{ pt: 2, pb: 6 }}>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#fff",
              mb: 2,
              textShadow: "0 2px 8px rgba(0,0,0,0.8)",
            }}
          >
            Diễn viên
          </Typography>
          <SearchBar>
            <InputBase
              placeholder="Tìm diễn viên…"
              fullWidth
              value={q}
              onChange={(e) => setParams({ q: e.target.value })}
            />
          </SearchBar>
        </Box>

        {error && (
          <Typography sx={{ color: "#ff6b6b", mt: 2 }}>{error}</Typography>
        )}

        <Grid container spacing={3} sx={{ mt: 1 }}>
          {items.map((a) => (
            <Grid item xs={6} sm={4} md={3} lg={2.4} xl={2} key={a.id}>
              <ActorCard onClick={() => handleOpen(a.id)}>
                <Box
                  component="img"
                  src={a.imageUrl || a.image || a.avatarUrl}
                  alt={a.name}
                  onError={(e) => {
                    e.currentTarget.src = `https://via.placeholder.com/400x500/333/fff?text=${encodeURIComponent(
                      a.name || "Actor"
                    )}`;
                  }}
                  sx={{
                    width: "100%",
                    height: 320,
                    objectFit: "cover",
                    display: "block",
                  }}
                />

                {/* overlay actions */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1.5,
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%)",
                    opacity: 0,
                    transition: "opacity .25s ease",
                    "&:hover": { opacity: 1 },
                  }}
                >
                  <Tooltip title="Xem chi tiết">
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpen(a.id);
                      }}
                      sx={{
                        background: "rgba(255,215,0,0.9)",
                        color: "#000",
                        "&:hover": { background: "#FFD700" },
                      }}
                    >
                      <InfoOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* optional badges */}
                {!!a.movieCount && (
                  <Chip
                    label={`${a.movieCount} phim`}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      background: "rgba(255,215,0,0.9)",
                      color: "#000",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                    }}
                  />
                )}
                <Box sx={{ p: 1.5 }}>
                  <Typography sx={{ fontWeight: 700 }} noWrap>
                    {a.name}
                  </Typography>
                </Box>
              </ActorCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </PageContainer>
  );
}

function useDebounce(value, delayMs) {
  const [val, setVal] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setVal(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return val;
}
