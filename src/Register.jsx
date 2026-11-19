import { useRef, useState } from 'react'
import { copy } from './copy.js'
import { todayKey } from './date.js'
import { photoFitsMoment } from './moments.js'
import { shrinkPhoto } from './photo.js'

const t = copy.register

// Note (required) and one photo (optional) for a moment (B-10, S-02).
// Camera only, no gallery: the photo records the moment, not the past (founder, 2026-11-19).
export default function Register({ momentDay, onRegister, onSkip, skipLabel = t.skip }) {
  const [note, setNote] = useState('')
  const [photo, setPhoto] = useState(null)
  const [photoError, setPhotoError] = useState(null) // null | 'error' | 'old'
  const cameraInput = useRef(null)

  const pick = async (e) => {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    // On a computer the camera button opens the files, so the file date is checked too.
    const photoDay = todayKey(new Date(file.lastModified))
    if (!photoFitsMoment(photoDay, momentDay, todayKey())) {
      setPhotoError('old')
      return
    }
    try {
      setPhoto(await shrinkPhoto(file))
      setPhotoError(null)
    } catch {
      setPhotoError('error')
    }
  }

  return (
    <div className="mt-4 text-left">
      <label className="block text-sm font-semibold" htmlFor="moment-note">
        {t.question}
      </label>
      <textarea
        id="moment-note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
        placeholder={t.placeholder}
        className="mt-1 w-full rounded-lg border border-ink/20 p-2"
      />

      {photo ? (
        <div className="mt-2">
          <img src={photo} alt="" className="max-h-48 rounded-lg" />
          <button onClick={() => setPhoto(null)} className="mt-1 text-sm text-muted underline">
            {t.removePhoto}
          </button>
        </div>
      ) : (
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            onClick={() => cameraInput.current.click()}
            className="rounded-full border border-ink/20 px-4 py-2 text-sm"
          >
            {t.takePhoto}
          </button>
        </div>
      )}
      {photoError && (
        <p className="mt-1 text-sm text-muted">{photoError === 'old' ? t.photoOld : t.photoError}</p>
      )}
      {/* On a phone, capture opens the camera straight away; on a computer it opens the files. */}
      <input
        ref={cameraInput}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={pick}
        className="hidden"
      />

      <div className="mt-4 flex flex-col gap-2">
        <button
          disabled={!note.trim()}
          onClick={() => onRegister({ note, photo })}
          className="rounded-full bg-accent py-2 font-semibold text-paper disabled:opacity-40"
        >
          {t.save}
        </button>
        <button onClick={onSkip} className="rounded-full border border-ink py-2">
          {skipLabel}
        </button>
      </div>
    </div>
  )
}
