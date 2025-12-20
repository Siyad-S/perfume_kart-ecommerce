export interface UploadResult {
  url: string;
  public_id: string;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
}

export interface UploadOptions {
  folder?: string;
  transformation?: any[];
  resourceType?: "auto" | "image" | "video" | "raw";
  [key: string]: any;
}