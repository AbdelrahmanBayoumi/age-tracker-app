/**
 * Shared image handling utilities.
 * Consolidates repeated image logic from components.
 */

export interface ImageFile {
  fileURL: string;
  fileObject?: File;
}

/**
 * Check if an ImageFile has a valid image URL.
 */
export function hasImage(image: ImageFile | null | undefined): boolean {
  return !!(image && image.fileURL !== '' && image.fileURL !== null && image.fileURL !== undefined);
}

/**
 * Get the display URL for an image, with fallback.
 */
export function getImageUrl(image: ImageFile | null | undefined, fallback = '/assets/images/no-image.png'): string {
  return hasImage(image) ? image!.fileURL : fallback;
}

/**
 * Check if the image is a newly selected file (not yet uploaded).
 */
export function isNewImage(image: ImageFile): boolean {
  return image.fileObject != null && image.fileObject !== undefined;
}

/**
 * Check if the image is an existing URL (already uploaded).
 */
export function isExistingImage(image: ImageFile): boolean {
  return image.fileURL != null && image.fileURL !== undefined && image.fileURL !== '' && !isNewImage(image);
}

/**
 * Convert a Blob to a File object.
 */
export function blobToFile(blob: Blob, fileName: string): File {
  return new File([blob], fileName, { type: blob.type });
}

/**
 * Create an empty ImageFile object.
 */
export function createEmptyImage(): ImageFile {
  return {
    fileURL: '',
    fileObject: undefined,
  };
}

/**
 * Validate file size (default max: 2MB).
 */
export function isFileSizeValid(file: File, maxSizeBytes = 2 * 1024 * 1024): boolean {
  return file.size <= maxSizeBytes;
}
