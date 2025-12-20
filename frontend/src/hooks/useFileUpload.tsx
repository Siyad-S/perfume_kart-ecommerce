// src/hooks/useFileUpload.ts
import { useState } from "react";
import { uploadFile, UploadResponse } from "../redux/services/file.service";

export function useFileUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (formData: FormData): Promise<UploadResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const res = await uploadFile(formData);
      return res;
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to upload file");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { upload, loading, error };
}
