import { memo, useState, useRef, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import BoltIcon from "@mui/icons-material/Bolt";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import LocalMoviesOutlinedIcon from "@mui/icons-material/LocalMoviesOutlined";

const SectionContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(6, 0),
  background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)",
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
      "radial-gradient(circle at 50% 50%, rgba(255,215,0,0.05) 0%, transparent 70%)",
    pointerEvents: "none",
  },
}));


// Recent comments styles
const RecentSection = styled(Box)(({ theme }) => ({
  marginTop: 0,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

const RecentHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const RecentList = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5),
}));

const RecentItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  padding: theme.spacing(1.25, 1.5),
  height: 74,
  borderRadius: 12,
  transition: "transform 0.2s ease, background 0.2s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    background: "rgba(255,255,255,0.06)",
  },
}));

const RecentViewport = styled(Box)({
  overflow: "hidden",
  position: "relative",
  borderRadius: 12,
});

// Dữ liệu mẫu cho "Bình luận mới"
const recentComments = [
  {
    id: "r1",
    user: {
      name: "Em bông",
      avatar: "https://i.pravatar.cc/150?img=11",
      gender: "♀",
    },
    content: "Chg n ms có ph2 tr 🥲",
    movie: "Đấu Gấu Học Nhóm",
  },
  {
    id: "r2",
    user: {
      name: "maat",
      avatar: "https://i.pravatar.cc/150?img=12",
      gender: "∞",
    },
    content: "nhất hoàn hảo phần diễn diện nữa".slice(0, 80),
    movie: "Dữ Tấn Trường An",
  },
  {
    id: "r3",
    user: {
      name: "An Truong",
      avatar: "https://i.pravatar.cc/150?img=13",
      gender: "♂",
    },
    content: "ê t xem t cười quá tr",
    movie: "Điện Hạ và Phu Nhân Kamduang",
  },
  {
    id: "r4",
    user: {
      name: "chudu901",
      avatar: "https://i.pravatar.cc/150?img=14",
      gender: "♂",
    },
    content: "phim hay",
    movie: "Trung Tâm Chăm Sóc Chấn Thương",
  },
];

const TopComments = memo(() => {
  // Auto-scroll for recent comments
  const recentListRef = useRef(null);
  const [recentIndex, setRecentIndex] = useState(0);
  const [itemStep, setItemStep] = useState(0);
  const [itemHeight, setItemHeight] = useState(0);
  const [rowGap, setRowGap] = useState(0);
  const [disableTransition, setDisableTransition] = useState(false);
  const renderGenderIcon = (gender) => {
    if (gender === "♂")
      return <MaleIcon sx={{ fontSize: 16, color: "#4FC3F7" }} />;
    if (gender === "♀")
      return <FemaleIcon sx={{ fontSize: 16, color: "#F48FB1" }} />;
    if (gender === "∞")
      return <AllInclusiveIcon sx={{ fontSize: 16, color: "#FFD54F" }} />;
    return <TransgenderIcon sx={{ fontSize: 16, color: "#CE93D8" }} />;
  };

  // Measure one recent item height + row gap to compute step
  useEffect(() => {
    const measure = () => {
      const list = recentListRef.current;
      if (!list) return;
      const firstItem = list.children[0];
      if (!firstItem) return;
      const styles = window.getComputedStyle(list);
      const measuredGap = parseFloat(styles.rowGap || "0");
      const measuredItemHeight = firstItem.offsetHeight;
      const total = measuredItemHeight + measuredGap;
      setItemHeight(measuredItemHeight);
      setRowGap(measuredGap);
      setItemStep(total);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Auto advance index every few seconds
  useEffect(() => {
    if (!itemStep) return;
    const id = setInterval(() => {
      setDisableTransition(false);
      setRecentIndex((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(id);
  }, [itemStep]);

  // Seamless loop by resetting without transition when hitting end
  useEffect(() => {
    const total = recentComments.length;
    if (!total) return;
    if (recentIndex === total) {
      const timeout = setTimeout(() => {
        setDisableTransition(true);
        setRecentIndex(0);
      }, 620);
      return () => clearTimeout(timeout);
    }
  }, [recentIndex]);

  return (
    <SectionContainer>
      <Container
        maxWidth={false}
        disableGutters
        sx={{ px: { xs: 2, sm: 3, md: 6 } }}
      >
        {/* Bình luận mới */}
        <RecentSection>
          <RecentHeader>
            <Typography
              variant="h6"
              sx={{
                color: "#fff",
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <BoltIcon sx={{ color: "#FFD700" }} /> BÌNH LUẬN MỚI
            </Typography>
          </RecentHeader>

          <RecentViewport
            sx={{ height: itemHeight ? itemHeight * 4 + rowGap * 3 : "auto" }}
          >
            <RecentList
              ref={recentListRef}
              sx={{
                transform: `translateY(-${recentIndex * itemStep}px)`,
                transition: disableTransition ? "none" : "transform 600ms ease",
              }}
            >
              {[...recentComments, ...recentComments].map((item, idx) => (
                <RecentItem key={`${item.id}-${idx}`}>
                  <Avatar src={item.user.avatar} alt={item.user.name} />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#fff",
                        fontWeight: 700,
                        mb: 0.25,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.75,
                      }}
                    >
                      {item.user.name} {renderGenderIcon(item.user.gender)}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(255,255,255,0.8)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.content}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "rgba(255,255,255,0.6)",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        mt: 0.25,
                      }}
                    >
                      <LocalMoviesOutlinedIcon
                        sx={{ fontSize: 14, opacity: 0.8 }}
                      />
                      {item.movie}
                    </Typography>
                  </Box>
                </RecentItem>
              ))}
            </RecentList>
          </RecentViewport>
        </RecentSection>
      </Container>
    </SectionContainer>
  );
});

TopComments.displayName = "TopComments";

export default TopComments;
