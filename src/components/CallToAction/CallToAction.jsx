import { memo } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  keyframes,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StarIcon from "@mui/icons-material/Star";
import MovieIcon from "@mui/icons-material/Movie";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

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

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const SectionContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(12, 0),
  background:
    "linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(0,0,0,0.9) 50%, rgba(255,215,0,0.05) 100%)",
  position: "relative",
  overflow: "hidden",
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "radial-gradient(circle at 30% 20%, rgba(255,215,0,0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255,215,0,0.1) 0%, transparent 50%)",
  },
}));

const MainTitle = styled(Typography)(({ theme }) => ({
  color: "#fff",
  fontSize: "3.5rem",
  fontWeight: 900,
  textAlign: "center",
  marginBottom: theme.spacing(2),
  background: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  textShadow: "0 4px 8px rgba(0,0,0,0.5)",
  animation: `${fadeInUp} 1s ease-out`,
  [theme.breakpoints.down("md")]: {
    fontSize: "2.5rem",
  },
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  color: "rgba(255,255,255,0.9)",
  fontSize: "1.3rem",
  textAlign: "center",
  marginBottom: theme.spacing(4),
  maxWidth: 600,
  margin: "0 auto",
  animation: `${fadeInUp} 1s ease-out 0.2s both`,
  [theme.breakpoints.down("md")]: {
    fontSize: "1.1rem",
  },
}));

const CTAButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
  color: "#000",
  fontSize: "1.2rem",
  fontWeight: 700,
  padding: theme.spacing(2, 4),
  borderRadius: 50,
  textTransform: "none",
  boxShadow: "0 8px 24px rgba(255,215,0,0.4)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  animation: `${fadeInUp} 1s ease-out 0.4s both`,
  "&:hover": {
    background: "linear-gradient(135deg, #FFEE60 0%, #FFB84D 100%)",
    transform: "translateY(-2px) scale(1.05)",
    boxShadow: "0 12px 32px rgba(255,215,0,0.6)",
    animation: `${pulse} 0.6s ease-in-out`,
  },
  "& .MuiSvgIcon-root": {
    marginLeft: theme.spacing(1),
  },
}));

const FeaturesContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(8),
  animation: `${fadeInUp} 1s ease-out 0.6s both`,
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  background: "rgba(0,0,0,0.6)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 16,
  padding: theme.spacing(3),
  textAlign: "center",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-8px)",
    borderColor: "rgba(255,215,0,0.5)",
    boxShadow: "0 12px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,215,0,0.3)",
  },
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: "50%",
  background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto",
  marginBottom: theme.spacing(2),
  color: "#000",
  "& .MuiSvgIcon-root": {
    fontSize: "2.5rem",
  },
}));

const FeatureTitle = styled(Typography)(({ theme }) => ({
  color: "#fff",
  fontSize: "1.3rem",
  fontWeight: 700,
  marginBottom: theme.spacing(1),
}));

const FeatureDescription = styled(Typography)(() => ({
  color: "rgba(255,255,255,0.8)",
  fontSize: "1rem",
  lineHeight: 1.6,
}));

const StatsContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(6),
  display: "flex",
  justifyContent: "center",
  gap: theme.spacing(6),
  flexWrap: "wrap",
  animation: `${fadeInUp} 1s ease-out 0.8s both`,
}));

const StatItem = styled(Box)(() => ({
  textAlign: "center",
}));

const StatNumber = styled(Typography)(() => ({
  color: "#FFD700",
  fontSize: "2.5rem",
  fontWeight: 900,
  lineHeight: 1,
}));

const StatLabel = styled(Typography)(({ theme }) => ({
  color: "rgba(255,255,255,0.8)",
  fontSize: "1rem",
  marginTop: theme.spacing(0.5),
}));

const CallToAction = memo(({ onSignUp }) => {
  const features = [
    {
      icon: <MovieIcon />,
      title: "Hàng Nghìn Phim",
      description:
        "Khám phá thư viện phim khổng lồ với đầy đủ thể loại từ hành động đến tình cảm",
    },
    {
      icon: <StarIcon />,
      title: "Chất Lượng Cao",
      description:
        "Xem phim với chất lượng 4K, âm thanh vòm và phụ đề đa ngôn ngữ",
    },
    {
      icon: <TrendingUpIcon />,
      title: "Cập Nhật Liên Tục",
      description:
        "Phim mới được cập nhật hàng tuần, không bao giờ bỏ lỡ bộ phim hot nhất",
    },
  ];

  const stats = [
    { number: "10K+", label: "Phim & Series" },
    { number: "1M+", label: "Người Dùng" },
    { number: "99%", label: "Hài Lòng" },
    { number: "24/7", label: "Hỗ Trợ" },
  ];

  return (
    <SectionContainer>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", position: "relative", zIndex: 2 }}>
          <MainTitle variant="h1">
            Bắt Đầu Hành Trình
            <br />
            Xem Phim Của Bạn
          </MainTitle>

          <Subtitle variant="h5">
            Tham gia cộng đồng yêu phim lớn nhất Việt Nam. Xem phim không giới
            hạn với chất lượng cao nhất.
          </Subtitle>

          <CTAButton
            variant="contained"
            size="large"
            startIcon={<PlayArrowIcon />}
            onClick={onSignUp}
            sx={{ mt: 4 }}
          >
            Đăng Ký Miễn Phí Ngay
          </CTAButton>

          <FeaturesContainer>
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <FeatureCard>
                    <FeatureIcon>{feature.icon}</FeatureIcon>
                    <FeatureTitle variant="h6">{feature.title}</FeatureTitle>
                    <FeatureDescription variant="body1">
                      {feature.description}
                    </FeatureDescription>
                  </FeatureCard>
                </Grid>
              ))}
            </Grid>
          </FeaturesContainer>

          <StatsContainer>
            {stats.map((stat, index) => (
              <StatItem key={index}>
                <StatNumber variant="h3">{stat.number}</StatNumber>
                <StatLabel variant="body1">{stat.label}</StatLabel>
              </StatItem>
            ))}
          </StatsContainer>
        </Box>
      </Container>
    </SectionContainer>
  );
});

CallToAction.displayName = "CallToAction";

CallToAction.propTypes = {
  onSignUp: PropTypes.func,
};

export default CallToAction;
