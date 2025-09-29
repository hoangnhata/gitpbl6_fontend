import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  CardMedia,
  CardActions,
  CardHeader,
  Stack,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Dashboard as DashboardIcon,
  TrendingUp as TrendingIcon,
  Person as PersonIcon,
  Movie as MovieIcon,
  ArrowBack as ArrowBackIcon,
  LocalMovies as MoviesIcon,
  People as UsersIcon,
  Assessment as StatisticsIcon,
  Report as ReportsIcon,
} from "@mui/icons-material";
import * as adminAPI from "../api/admin";
import AdminRoute from "../components/AdminRoute";
import { useNavigate } from "react-router-dom";

// Tab panel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Movie creation form component
function MovieCreationForm({
  onSuccess,
  onCancel,
  initialData = null,
  isEdit = false,
}) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    synopsis: initialData?.synopsis || "",
    year: initialData?.year || new Date().getFullYear(),
    categories: initialData?.categories?.join(",") || "",
    actors: initialData?.actors?.join(",") || "",
    directors: initialData?.directors?.join(",") || "",
    country: initialData?.country || "",
    language: initialData?.language || "",
    ageRating: initialData?.ageRating || "",
    isAvailable: initialData?.isAvailable ?? true,
  });

  const [files, setFiles] = useState({
    poster: null,
    thumbnail: null,
    video: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field) => (event) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field) => (event) => {
    const file = event.target.files[0];
    setFiles((prev) => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const movieData = {
        ...formData,
        ...files,
      };

      if (isEdit && initialData?.id) {
        await adminAPI.updateMovie(initialData.id, movieData);
      } else {
        await adminAPI.createMovie(movieData);
      }
      onSuccess?.();
    } catch (err) {
      setError(
        err.message || `Failed to ${isEdit ? "update" : "create"} movie`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {isEdit ? "Edit Movie" : "Create New Movie"}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={handleInputChange("title")}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Year"
                type="number"
                value={formData.year}
                onChange={handleInputChange("year")}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Synopsis"
                multiline
                rows={4}
                value={formData.synopsis}
                onChange={handleInputChange("synopsis")}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Categories (comma-separated)"
                value={formData.categories}
                onChange={handleInputChange("categories")}
                placeholder="drama,comedy,action"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Actors (comma-separated)"
                value={formData.actors}
                onChange={handleInputChange("actors")}
                placeholder="Tom Hanks,Robin Wright"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Directors (comma-separated)"
                value={formData.directors}
                onChange={handleInputChange("directors")}
                placeholder="Robert Zemeckis"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Country"
                value={formData.country}
                onChange={handleInputChange("country")}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Language"
                value={formData.language}
                onChange={handleInputChange("language")}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Age Rating</InputLabel>
                <Select
                  value={formData.ageRating}
                  onChange={handleInputChange("ageRating")}
                  label="Age Rating"
                >
                  <MenuItem value="G">G</MenuItem>
                  <MenuItem value="PG">PG</MenuItem>
                  <MenuItem value="PG-13">PG-13</MenuItem>
                  <MenuItem value="R">R</MenuItem>
                  <MenuItem value="NC-17">NC-17</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="poster-upload"
                type="file"
                onChange={handleFileChange("poster")}
              />
              <label htmlFor="poster-upload">
                <Button variant="outlined" component="span" fullWidth>
                  {files.poster ? files.poster.name : "Upload Poster"}
                </Button>
              </label>
            </Grid>

            <Grid item xs={12} md={4}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="thumbnail-upload"
                type="file"
                onChange={handleFileChange("thumbnail")}
              />
              <label htmlFor="thumbnail-upload">
                <Button variant="outlined" component="span" fullWidth>
                  {files.thumbnail ? files.thumbnail.name : "Upload Thumbnail"}
                </Button>
              </label>
            </Grid>

            <Grid item xs={12} md={4}>
              <input
                accept="video/*"
                style={{ display: "none" }}
                id="video-upload"
                type="file"
                onChange={handleFileChange("video")}
              />
              <label htmlFor="video-upload">
                <Button variant="outlined" component="span" fullWidth>
                  {files.video ? files.video.name : "Upload Video"}
                </Button>
              </label>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isAvailable}
                    onChange={handleInputChange("isAvailable")}
                  />
                }
                label="Available for streaming"
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button onClick={onCancel} disabled={loading}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={
                    loading ? <CircularProgress size={20} /> : <AddIcon />
                  }
                >
                  {loading
                    ? isEdit
                      ? "Updating..."
                      : "Creating..."
                    : isEdit
                    ? "Update Movie"
                    : "Create Movie"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}

// Movies management component
function MoviesManagement() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "table"
  const [editingMovie, setEditingMovie] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    movie: null,
  });

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getMovies();
      // API trả về array trực tiếp hoặc object có property content
      setMovies(Array.isArray(response) ? response : response.content || []);
    } catch (err) {
      setError(err.message || "Failed to load movies");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    loadMovies();
  };

  const handleEditMovie = (movie) => {
    setEditingMovie(movie);
  };

  const handleDeleteMovie = (movie) => {
    setDeleteDialog({ open: true, movie });
  };

  const confirmDeleteMovie = async () => {
    try {
      await adminAPI.deleteMovie(deleteDialog.movie.id);
      setDeleteDialog({ open: false, movie: null });
      loadMovies();
    } catch (err) {
      console.error("Failed to delete movie:", err);
    }
  };

  const handleEditSuccess = () => {
    setEditingMovie(null);
    loadMovies();
  };

  if (showCreateForm) {
    return (
      <MovieCreationForm
        onSuccess={handleCreateSuccess}
        onCancel={() => setShowCreateForm(false)}
      />
    );
  }

  if (editingMovie) {
    return (
      <MovieCreationForm
        initialData={editingMovie}
        onSuccess={handleEditSuccess}
        onCancel={() => setEditingMovie(null)}
        isEdit={true}
      />
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <MovieIcon color="primary" />
          Movies Management
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Button
            variant={viewMode === "grid" ? "contained" : "outlined"}
            size="small"
            onClick={() => setViewMode("grid")}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === "table" ? "contained" : "outlined"}
            size="small"
            onClick={() => setViewMode("table")}
          >
            Table
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowCreateForm(true)}
          >
            Add Movie
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : viewMode === "grid" ? (
        <Grid container spacing={3}>
          {movies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition:
                    "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: (theme) => theme.shadows[8],
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="300"
                  image={
                    movie.posterUrl ||
                    movie.thumbnailUrl ||
                    "/api/placeholder/300/400"
                  }
                  alt={movie.title}
                  sx={{
                    objectFit: "cover",
                    background:
                      "linear-gradient(45deg, #f0f0f0 30%, #e0e0e0 90%)",
                  }}
                />
                <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom noWrap>
                    {movie.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {movie.year}
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    {movie.genres?.slice(0, 2).map((genre, index) => (
                      <Chip
                        key={index}
                        label={genre}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                    {movie.genres?.length > 2 && (
                      <Chip
                        label={`+${movie.genres.length - 2}`}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                        color="default"
                        variant="outlined"
                      />
                    )}
                  </Box>
                  <Chip
                    label={movie.isAvailable ? "Available" : "Unavailable"}
                    color={movie.isAvailable ? "success" : "default"}
                    size="small"
                    sx={{ mb: 1 }}
                  />
                </CardContent>
                <CardActions
                  sx={{ justifyContent: "space-between", px: 2, pb: 2 }}
                >
                  <Tooltip title="View Details">
                    <IconButton size="small" color="primary">
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Movie">
                    <IconButton
                      size="small"
                      color="secondary"
                      onClick={() => handleEditMovie(movie)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Movie">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteMovie(movie)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Poster</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Categories</TableCell>
                <TableCell>Available</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {movies.map((movie) => (
                <TableRow key={movie.id} hover>
                  <TableCell>
                    <Avatar
                      src={movie.posterUrl || movie.thumbnailUrl}
                      alt={movie.title}
                      variant="rounded"
                      sx={{ width: 60, height: 80 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {movie.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {movie.synopsis?.substring(0, 50)}...
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{movie.year}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {movie.genres?.slice(0, 2).map((genre, index) => (
                        <Chip
                          key={index}
                          label={genre}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                      {movie.genres?.length > 2 && (
                        <Chip
                          label={`+${movie.genres.length - 2}`}
                          size="small"
                          color="default"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={movie.isAvailable ? "Available" : "Unavailable"}
                      color={movie.isAvailable ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <Tooltip title="View Details">
                        <IconButton size="small" color="primary">
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Movie">
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={() => handleEditMovie(movie)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Movie">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteMovie(movie)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, movie: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete &quot;{deleteDialog.movie?.title}
            &quot;? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, movie: null })}>
            Cancel
          </Button>
          <Button
            onClick={confirmDeleteMovie}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// Users management component
function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "table"
  const [setEditingUser] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers();
      // API trả về array trực tiếp hoặc object có property content
      setUsers(Array.isArray(response) ? response : response.content || []);
    } catch (err) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  const handleDeleteUser = (user) => {
    setDeleteDialog({ open: true, user });
  };

  const confirmDeleteUser = async () => {
    try {
      await adminAPI.deleteUser(deleteDialog.user.id);
      setDeleteDialog({ open: false, user: null });
      loadUsers();
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <PersonIcon color="primary" />
          Users Management
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Button
            variant={viewMode === "grid" ? "contained" : "outlined"}
            size="small"
            onClick={() => setViewMode("grid")}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === "table" ? "contained" : "outlined"}
            size="small"
            onClick={() => setViewMode("table")}
          >
            Table
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : viewMode === "grid" ? (
        <Grid container spacing={3}>
          {users.map((user) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition:
                    "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: (theme) => theme.shadows[8],
                  },
                }}
              >
                <CardHeader
                  avatar={
                    <Avatar
                      src={user.avatarUrl}
                      sx={{
                        width: 60,
                        height: 60,
                        background: user.avatarUrl
                          ? "transparent"
                          : "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                        color: user.avatarUrl ? "transparent" : "#000",
                        fontWeight: 700,
                        fontSize: "1.2rem",
                      }}
                    >
                      {!user.avatarUrl &&
                        getInitials(user.fullName || user.username)}
                    </Avatar>
                  }
                  title={
                    <Typography variant="h6" component="div" noWrap>
                      {user.fullName || user.username}
                    </Typography>
                  }
                  subheader={
                    <Typography variant="body2" color="text.secondary" noWrap>
                      @{user.username}
                    </Typography>
                  }
                />
                <CardContent sx={{ flexGrow: 1, pt: 0 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {user.email}
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    {user.roles?.map((role, index) => (
                      <Chip
                        key={index}
                        label={role}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                        color={role === "ADMIN" ? "error" : "primary"}
                        variant="outlined"
                      />
                    ))}
                  </Box>
                  <Chip
                    label={user.enabled ? "Active" : "Inactive"}
                    color={user.enabled ? "success" : "default"}
                    size="small"
                    sx={{ mb: 1 }}
                  />
                </CardContent>
                <CardActions sx={{ justifyContent: "center", px: 2, pb: 2 }}>
                  <Tooltip title="View Profile">
                    <IconButton size="small" color="primary">
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit User">
                    <IconButton
                      size="small"
                      color="secondary"
                      onClick={() => handleEditUser(user)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete User">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteUser(user)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Avatar</TableCell>
                <TableCell>User Info</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Roles</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Avatar
                      src={user.avatarUrl}
                      sx={{
                        width: 50,
                        height: 50,
                        background: user.avatarUrl
                          ? "transparent"
                          : "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                        color: user.avatarUrl ? "transparent" : "#000",
                        fontWeight: 700,
                      }}
                    >
                      {!user.avatarUrl &&
                        getInitials(user.fullName || user.username)}
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {user.fullName || user.username}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      @{user.username}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{user.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {user.roles?.map((role, index) => (
                        <Chip
                          key={index}
                          label={role}
                          size="small"
                          color={role === "ADMIN" ? "error" : "primary"}
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.enabled ? "Active" : "Inactive"}
                      color={user.enabled ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <Tooltip title="View Profile">
                        <IconButton size="small" color="primary">
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit User">
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={() => handleEditUser(user)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete User">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteUser(user)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, user: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user &quot;
            {deleteDialog.user?.username}
            &quot;? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, user: null })}>
            Cancel
          </Button>
          <Button onClick={confirmDeleteUser} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// Dashboard Analytics component
function DashboardAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      // Try to get analytics data
      let analyticsData = null;
      try {
        analyticsData = await adminAPI.getAdminStatistics();
        console.log("Analytics API Response:", analyticsData);
      } catch (apiError) {
        console.error("Analytics API Error:", apiError);
        // Create fallback data if API fails
        analyticsData = {
          stats: {
            totalMovies: 5,
            totalUsers: 12,
            totalComments: 23,
            totalReports: 2,
            pendingReports: 1,
            pendingComments: 3,
            activeUsers: 10,
            disabledUsers: 2,
            averageRating: 4.2,
            totalViews: 156,
            monthlyStats: null,
          },
          recentReports: [],
          pendingComments: [],
          recentUsers: null,
          topMovies: null,
        };
      }

      // Try to get trending data
      let trendingData = [];
      try {
        trendingData = await adminAPI.getTrendingContent();
        console.log("Trending API Response:", trendingData);
      } catch (trendingError) {
        console.error("Trending API Error:", trendingError);
        trendingData = [];
      }

      setAnalytics(analyticsData);
      setTrending(
        Array.isArray(trendingData) ? trendingData : trendingData.content || []
      );
    } catch (err) {
      console.error("General Analytics Error:", err);
      setError(err.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
      >
        <DashboardIcon color="primary" />
        Dashboard Analytics
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: "center", p: 2 }}>
            <Typography variant="h4" color="primary" gutterBottom>
              {analytics?.stats?.totalMovies ?? 0}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Total Movies
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {analytics?.stats?.totalComments ?? 0} total comments
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: "center", p: 2 }}>
            <Typography variant="h4" color="secondary" gutterBottom>
              {analytics?.stats?.totalUsers ?? 0}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Total Users
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {analytics?.stats?.activeUsers ?? 0} active users
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: "center", p: 2 }}>
            <Typography variant="h4" color="success.main" gutterBottom>
              {analytics?.stats?.totalViews ?? 0}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Total Views
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {analytics?.stats?.averageRating ?? 0} avg rating
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: "center", p: 2 }}>
            <Typography variant="h4" color="warning.main" gutterBottom>
              {analytics?.stats?.totalReports ?? 0}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Total Reports
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {analytics?.stats?.pendingReports ?? 0} pending
            </Typography>
          </Card>
        </Grid>

        {/* Trending Content */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader
              title={
                <Typography
                  variant="h6"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <TrendingIcon color="primary" />
                  Trending Content
                </Typography>
              }
            />
            <CardContent>
              {trending && trending.length > 0 ? (
                <Stack spacing={2}>
                  {trending.slice(0, 5).map((item, index) => (
                    <Box
                      key={index}
                      sx={{ display: "flex", alignItems: "center", gap: 2 }}
                    >
                      <Typography variant="h6" color="primary">
                        #{index + 1}
                      </Typography>
                      <Avatar
                        src={item.posterUrl || item.thumbnailUrl}
                        variant="rounded"
                        sx={{ width: 50, height: 70 }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.totalViews || 0} views
                        </Typography>
                      </Box>
                      <Chip
                        label={item.genres?.[0] || "Unknown"}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography color="text.secondary" variant="body1">
                    No trending content available
                  </Typography>
                  <Typography
                    color="text.secondary"
                    variant="body2"
                    sx={{ mt: 1 }}
                  >
                    Check back later for popular content
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Recent Activity" />
            <CardContent>
              <Stack spacing={2}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: "success.main" }}>
                    <AddIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      New movie added
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      2 hours ago
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      New user registered
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      4 hours ago
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: "warning.main" }}>
                    <TrendingIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      Trending content updated
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      1 day ago
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

// Reports Management component
function ReportsManagement() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getReports();
      // API trả về array trực tiếp hoặc object có property content
      setReports(Array.isArray(response) ? response : response.content || []);
    } catch (err) {
      setError(err.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const handleResolveReport = async (reportId) => {
    try {
      await adminAPI.resolveReport(reportId);
      loadReports();
    } catch (err) {
      console.error("Failed to resolve report:", err);
    }
  };

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
      >
        <TrendingIcon color="primary" />
        Reports Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Reporter</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      #{report.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={report.reportType || "Unknown"}
                      size="small"
                      color={report.reportType === "SPAM" ? "error" : "warning"}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                      {report.reason || "No description"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {report.reporter?.username || "Unknown"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        report.status === "RESOLVED" ? "Resolved" : "Pending"
                      }
                      color={
                        report.status === "RESOLVED" ? "success" : "default"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {report.status !== "RESOLVED" && (
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => handleResolveReport(report.id)}
                      >
                        Resolve
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

// Main Admin Management component
export default function AdminManagement() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <AdminRoute>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBackToHome}
            sx={{
              borderColor: "primary.main",
              color: "primary.main",
              "&:hover": {
                backgroundColor: "primary.main",
                color: "white",
              },
            }}
          >
            Back to Home
          </Button>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            Admin Management
          </Typography>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab
              icon={<MoviesIcon />}
              label="Movies"
              iconPosition="start"
              sx={{
                minHeight: 48,
                "&.Mui-selected": {
                  color: "primary.main",
                },
              }}
            />
            <Tab
              icon={<UsersIcon />}
              label="Users"
              iconPosition="start"
              sx={{
                minHeight: 48,
                "&.Mui-selected": {
                  color: "primary.main",
                },
              }}
            />
            <Tab
              icon={<StatisticsIcon />}
              label="Statistics"
              iconPosition="start"
              sx={{
                minHeight: 48,
                "&.Mui-selected": {
                  color: "primary.main",
                },
              }}
            />
            <Tab
              icon={<ReportsIcon />}
              label="Reports"
              iconPosition="start"
              sx={{
                minHeight: 48,
                "&.Mui-selected": {
                  color: "primary.main",
                },
              }}
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <MoviesManagement />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <UsersManagement />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <DashboardAnalytics />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <ReportsManagement />
        </TabPanel>
      </Container>
    </AdminRoute>
  );
}
