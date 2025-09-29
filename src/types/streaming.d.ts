// Streaming domain types for the movie app
// These declarations are globally visible to JS/TS consumers in this Vite project.

/* eslint-disable @typescript-eslint/consistent-type-definitions */

declare namespace StreamingAPI {
  /** Video quality options supported by the service */
  type VideoQuality =
    | "240p"
    | "360p"
    | "480p"
    | "720p"
    | "1080p"
    | "1440p"
    | "4K";

  /** Subtitle format */
  type SubtitleFormat = "srt" | "vtt" | "ass" | "sub";

  /** Encoding for subtitle files */
  type SubtitleEncoding = "UTF-8" | "UTF-16" | "ISO-8859-1" | "Windows-1252";

  interface Subtitle {
    language: string; // e.g., "English", "Vietnamese"
    languageCode?: string; // e.g., "en", "vi"
    url: string;
    format: SubtitleFormat;
    encoding?: SubtitleEncoding;
    fileSizeBytes?: number;
    isDefault?: boolean;
  }

  interface StreamingInfo {
    movieId: number;
    title: string;
    posterUrl?: string;
    trailerUrl?: string;
    durationSeconds: number;
    availableQualities: VideoQuality[];
    availableSubtitles: Subtitle[];
    currentQuality?: VideoQuality;
    currentSubtitleLanguage?: string;
    subtitleEnabled?: boolean;
    currentPositionSeconds: number;
    isCompleted: boolean;
    lastWatchedAt?: string; // ISO string
  }

  interface StartStreamingRequest {
    movieId: number;
    quality: VideoQuality;
    subtitleLanguage?: string;
    subtitleEnabled?: boolean;
    startPosition?: number; // seconds
    autoPlay?: boolean;
  }

  interface StartStreamingResponse {
    movieId: number;
    streamingUrl: string;
    drm?: {
      licenseUrl?: string;
      certificateUrl?: string;
      scheme?: "widevine" | "fairplay" | "playready";
    };
    availableQualities: VideoQuality[];
    availableSubtitles: Subtitle[];
    selectedQuality: VideoQuality;
    selectedSubtitleLanguage?: string;
    downloadUrl?: string;
  }

  /** Response after updating quality or subtitle options */
  interface UpdateQualityResponse {
    movieId: number;
    streamingUrl: string; // potentially updated manifest URL
    availableQualities: VideoQuality[];
    availableSubtitles: Subtitle[];
    selectedQuality: VideoQuality;
    selectedSubtitleLanguage?: string;
    drm?: {
      licenseUrl?: string;
      certificateUrl?: string;
      scheme?: "widevine" | "fairplay" | "playready";
    };
  }

  interface UpdateQualityRequest {
    movieId: number;
    quality: VideoQuality;
    subtitleLanguage?: string;
    subtitleEnabled?: boolean;
    startPosition?: number; // seek to seconds
    autoPlay?: boolean;
  }

  interface UpdatePositionRequest {
    movieId: number;
    currentPosition: number; // seconds
    isCompleted?: boolean;
  }

  interface StopStreamingRequest {
    movieId: number;
    currentPosition?: number; // seconds
    isCompleted?: boolean;
  }

  /** Response after stopping streaming and saving history */
  interface StopStreamingResponse {
    movieId: number;
    durationSeconds: number;
    currentPosition: number; // seconds
    progressPercent: number; // 0-100
    isCompleted: boolean;
    lastWatchedAt: string; // ISO string
  }

  interface ProgressResponse {
    movieId: number;
    currentPosition: number; // seconds
    durationSeconds: number;
    progressPercent: number; // 0-100
    isCompleted: boolean;
  }

  interface StreamingStatistics {
    totalWatchTimeSeconds: number;
    numberOfMoviesWatched: number;
    numberOfMoviesCompleted: number;
    mostWatchedGenres: { genre: string; watchTimeSeconds: number }[];
    preferredQuality?: VideoQuality;
    preferredSubtitleLanguage?: string;
    numberOfSessions: number;
    averageSessionLengthSeconds: number;
    lastActiveAt?: string; // ISO string
  }

  /** Subtitles list for a movie */
  type SubtitlesResponse = Subtitle[];
}

export {}; // ensure this file is treated as a module
