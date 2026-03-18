export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "text/csv",
  "text/plain",
  "image/png",
  "image/jpeg",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const ALLOWED_EXTENSIONS = [
  ".pdf",
  ".csv",
  ".txt",
  ".png",
  ".jpg",
  ".jpeg",
  ".ppt",
  ".pptx",
  ".doc",
  ".docx",
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const validateFile = (
  file: Express.Multer.File,
): { valid: boolean; error?: string } => {
  if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    return { valid: false, error: "File type not allowed" };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "File size exceeds 10MB limit" };
  }

  return { valid: true };
};
