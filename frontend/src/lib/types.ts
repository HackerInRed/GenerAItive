
export interface VideoInput {
  type: 'url' | 'file';
  source: string | File;
  query?: string;
  aspectRatio: '1:1' | '16:9' | '9:16';
  captions: boolean;
}

export interface ProcessingStatus {
  progress: number;
  stage: string;
  isComplete: boolean;
}

export interface VideoOutput {
  url: string;
  title: string;
  thumbnailUrl?: string;
  duration?: number;
}

export interface JobStatusType {
  job_id?: string;
  status: string;
  progress: number;
  message: string;
  error?: string;
  filename?: string;
  video_path?: string;
  output_video?: string;
  srt_path?: string;
  timestamp?: number;
}
