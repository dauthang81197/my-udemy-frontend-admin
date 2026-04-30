export type VideoStatus = 'ACTIVE' | 'DELETED';

export interface VideoFile {
  id: string;
  name: string;
  originalFilename: string;
  contentType: string;
  fileSize: number;
  publicUrl: string;
  presignedUrl: string;
  status: VideoStatus;
  createdAt: string;
}
