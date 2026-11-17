// Photos are shrunk before saving: everything lives in this browser's storage, about 5 MB (S-02).
const MAX_SIDE = 800
const QUALITY = 0.7

// File from the camera or the gallery -> small JPEG as a data URL.
export async function shrinkPhoto(file) {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  return canvas.toDataURL('image/jpeg', QUALITY)
}
