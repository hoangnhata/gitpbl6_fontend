import { memo } from "react";
import PropTypes from "prop-types";
import { Box, Typography, IconButton, keyframes } from "@mui/material";
import { styled } from "@mui/material/styles";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const CardContainer = styled(Box)(({ theme }) => ({
  minWidth: 300,
  maxWidth: 350,
  background: "#0a0a0a",
  borderRadius: 16,
  padding: theme.spacing(2.5),
  position: "relative",
  border: "1px solid rgba(255,215,0,0.1)",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "translateY(-8px) scale(1.02)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.6), 0 0 20px rgba(255,215,0,0.2)",
    border: "1px solid rgba(255,215,0,0.4)",
  },
}));

const UserSection = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),
  position: "relative",
}));

const Avatar = styled(Box)(() => ({
  width: 40,
  height: 40,
  borderRadius: "50%",
  backgroundSize: "cover",
  backgroundPosition: "center",
  border: "2px solid rgba(255,215,0,0.3)",
  flexShrink: 0,
}));

const UserInfo = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: 6,
  flex: 1,
}));

const Username = styled(Typography)(() => ({
  color: "#fff",
  fontSize: "1rem",
  fontWeight: 700,
  lineHeight: 1.2,
  background: "linear-gradient(45deg, #fff, #FFD700)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}));

const GenderSymbol = styled(Typography)(() => ({
  color: "#FFD700",
  fontSize: "0.8rem",
  fontWeight: 700,
}));

const MovieThumbnail = styled(Box)(() => ({
  position: "absolute",
  top: -8,
  right: 12,
  width: 60,
  height: 45,
  borderRadius: 6,
  backgroundSize: "cover",
  backgroundPosition: "center",
  border: "2px solid rgba(255,255,255,0.2)",
  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
  zIndex: 2,
}));

const CommentText = styled(Typography)(({ theme }) => ({
  color: "rgba(255,255,255,0.9)",
  fontSize: "0.9rem",
  lineHeight: 1.5,
  marginBottom: theme.spacing(1.5),
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
  fontWeight: 400,
}));

const InteractionsSection = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  paddingTop: theme.spacing(1),
  borderTop: "1px solid rgba(255,255,255,0.1)",
}));

const InteractionButton = styled(IconButton)(() => ({
  display: "flex",
  alignItems: "center",
  gap: 4,
  color: "rgba(255,255,255,0.7)",
  padding: "6px 10px",
  borderRadius: 8,
  fontSize: "0.8rem",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "rgba(255,215,0,0.1)",
    color: "#FFD700",
    border: "1px solid rgba(255,215,0,0.3)",
    transform: "scale(1.05)",
  },
  "& .MuiSvgIcon-root": {
    fontSize: "1.1rem",
  },
}));

const InteractionCount = styled(Typography)(() => ({
  fontSize: "0.8rem",
  fontWeight: 600,
  color: "inherit",
}));

const CommentCard = memo(({ comment, index }) => {
  const handleImageError = (e) => {
    e.currentTarget.style.display = "none";
  };

  return (
    <CardContainer
      sx={{
        animation: `${fadeInUp} 0.6s ease-out ${index * 0.1}s both`,
      }}
    >
      <UserSection>
        <Avatar
          sx={{
            backgroundImage: `url(${comment.user.avatar})`,
          }}
          onError={handleImageError}
        />

        <UserInfo>
          <Username>{comment.user.name}</Username>
          <GenderSymbol>{comment.user.gender}</GenderSymbol>
        </UserInfo>

        <MovieThumbnail
          sx={{
            backgroundImage: `url(${comment.movieThumbnail})`,
          }}
          onError={handleImageError}
        />
      </UserSection>

      <CommentText>{comment.comment}</CommentText>

      <InteractionsSection>
        <InteractionButton size="small">
          <ThumbUpIcon />
          <InteractionCount>{comment.interactions.upvotes}</InteractionCount>
        </InteractionButton>

        <InteractionButton size="small">
          <ThumbDownIcon />
          <InteractionCount>{comment.interactions.downvotes}</InteractionCount>
        </InteractionButton>

        <InteractionButton size="small">
          <ChatBubbleOutlineIcon />
          <InteractionCount>{comment.interactions.replies}</InteractionCount>
        </InteractionButton>
      </InteractionsSection>
    </CardContainer>
  );
});

CommentCard.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.number.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
      gender: PropTypes.string.isRequired,
    }).isRequired,
    movieThumbnail: PropTypes.string.isRequired,
    comment: PropTypes.string.isRequired,
    interactions: PropTypes.shape({
      upvotes: PropTypes.number.isRequired,
      downvotes: PropTypes.number.isRequired,
      replies: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

CommentCard.displayName = "CommentCard";

export default CommentCard;
