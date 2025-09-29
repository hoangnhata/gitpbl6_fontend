import { memo, useState, useRef, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  IconButton,
  keyframes,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import BoltIcon from "@mui/icons-material/Bolt";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import LocalMoviesOutlinedIcon from "@mui/icons-material/LocalMoviesOutlined";
import CommentCard from "./CommentCard";

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

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

const SectionHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(3),
  gap: theme.spacing(1),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: "#fff",
  fontSize: "2.5rem",
  fontWeight: 900,
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  background: "linear-gradient(45deg, #FFD700, #FFA500, #FFD700)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  textShadow: "0 0 30px rgba(255, 215, 0, 0.5)",
  animation: `${fadeInUp} 0.8s ease-out`,
}));

const CommentsContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
}));

const ScrollContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  overflowX: "auto",
  scrollBehavior: "smooth",
  padding: theme.spacing(1),
  "&::-webkit-scrollbar": {
    height: 6,
  },
  "&::-webkit-scrollbar-track": {
    background: "rgba(255,255,255,0.1)",
    borderRadius: 3,
  },
  "&::-webkit-scrollbar-thumb": {
    background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
    borderRadius: 3,
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "linear-gradient(135deg, #FFA500 0%, #FFD700 100%)",
  },
}));

const NavButton = styled(IconButton)(() => ({
  background: "rgba(0,0,0,0.8)",
  color: "#FFD700",
  width: 48,
  height: 48,
  border: "2px solid rgba(255,215,0,0.3)",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "rgba(255,215,0,0.1)",
    border: "2px solid rgba(255,215,0,0.6)",
    transform: "scale(1.1)",
    boxShadow: "0 4px 12px rgba(255,215,0,0.3)",
  },
  "&:disabled": {
    background: "rgba(0,0,0,0.3)",
    color: "rgba(255,255,255,0.3)",
    border: "2px solid rgba(255,255,255,0.1)",
  },
}));

// Recent comments styles
const RecentSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
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

// Dữ liệu mẫu cho comments
const sampleComments = [
  {
    id: 1,
    user: {
      name: "Psycho",
      avatar: "https://i.pravatar.cc/150?img=1",
      gender: "♂",
    },
    movieThumbnail:
      "https://upload.wikimedia.org/wikipedia/en/7/7e/Wednesday_Netflix_series_poster.png",
    comment:
      "hoá ra bà ngoại nhốt ì Ophelia trong ngục tối. SS3 sẽ là cuộc phiêu lưu củ...",
    interactions: {
      upvotes: 5,
      downvotes: 0,
      replies: 0,
    },
  },
  {
    id: 2,
    user: {
      name: "Terry",
      avatar: "https://i.pravatar.cc/150?img=2",
      gender: "♂",
    },
    movieThumbnail: "https://via.placeholder.com/80x60/4ECDC4/fff?text=Boys+II",
    comment:
      "t cảm giác khi Sang Won debut thì idol nổi tiếng nhất gen 5 sẽ ra đời.",
    interactions: {
      upvotes: 4,
      downvotes: 1,
      replies: 2,
    },
  },
  {
    id: 3,
    user: {
      name: "yui",
      avatar: "https://i.pravatar.cc/150?img=3",
      gender: "∞",
    },
    movieThumbnail: "https://via.placeholder.com/80x60/FF6B6B/fff?text=Movie",
    comment:
      "tụi bây khen thằnh n9 nhiều lên 🫠, một cái thằng dính nhiều scanda...",
    interactions: {
      upvotes: 2,
      downvotes: 0,
      replies: 0,
    },
  },
  {
    id: 4,
    user: {
      name: "Ái Vy",
      avatar: "https://i.pravatar.cc/150?img=4",
      gender: "♀",
    },
    movieThumbnail: "https://via.placeholder.com/80x60/96CEB4/fff?text=Forest",
    comment: "Trùi ui hayyyyyyyy qă",
    interactions: {
      upvotes: 0,
      downvotes: 0,
      replies: 5,
    },
  },
  {
    id: 5,
    user: {
      name: "Scor_16th",
      avatar: "https://i.pravatar.cc/150?img=5",
      gender: "∞",
    },
    movieThumbnail:
      "https://via.placeholder.com/80x60/45B7D1/fff?text=PEACEMAKER",
    comment:
      "Thực ra cái earth 2 này phải là the worst dimension ever. Nếu để ý thì...",
    interactions: {
      upvotes: 2,
      downvotes: 0,
      replies: 6,
    },
  },
  {
    id: 6,
    user: {
      name: "MovieFan",
      avatar: "https://i.pravatar.cc/150?img=6",
      gender: "♂",
    },
    movieThumbnail: "https://via.placeholder.com/80x60/FFEAA7/fff?text=Action",
    comment:
      "Phim này hay quá! Diễn viên diễn xuất rất tự nhiên và cốt truyện hấp dẫn.",
    interactions: {
      upvotes: 8,
      downvotes: 1,
      replies: 3,
    },
  },
];

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
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  // Auto-scroll for recent comments
  const recentViewportRef = useRef(null);
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

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      const newScrollLeft =
        scrollRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
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
        <SectionHeader>
          <SectionTitle variant="h3">
            <EmojiEventsIcon sx={{ fontSize: "2rem", color: "#FFD700" }} />
            TOP BÌNH LUẬN
          </SectionTitle>
        </SectionHeader>

        <CommentsContainer>
          <NavButton
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            size="small"
          >
            <KeyboardArrowLeftIcon />
          </NavButton>

          <ScrollContainer
            ref={scrollRef}
            onScroll={handleScroll}
            sx={{ flex: 1 }}
          >
            {sampleComments.map((comment, index) => (
              <CommentCard key={comment.id} comment={comment} index={index} />
            ))}
          </ScrollContainer>

          <NavButton
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            size="small"
          >
            <KeyboardArrowRightIcon />
          </NavButton>
        </CommentsContainer>

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
            ref={recentViewportRef}
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
