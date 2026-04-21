import io
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload, MediaIoBaseDownload
from config import GOOGLE_DRIVE_FOLDER_ID


def _service(creds):
    return build("drive", "v3", credentials=creds)


def upload_photo(creds, file_bytes, filename, mime_type="image/jpeg"):
    """Upload a photo to the configured Drive folder. Returns the public URL."""
    svc = _service(creds)
    media = MediaIoBaseUpload(io.BytesIO(file_bytes), mimetype=mime_type)
    file_meta = {"name": filename, "parents": [GOOGLE_DRIVE_FOLDER_ID]}

    uploaded = svc.files().create(
        body=file_meta, media_body=media, fields="id"
    ).execute()
    file_id = uploaded["id"]

    return f"/api/image/{file_id}"


def get_photo(creds, file_id):
    svc = _service(creds)
    meta = svc.files().get(fileId=file_id, fields="mimeType").execute()
    mime_type = meta.get("mimeType", "image/jpeg")
    fh = io.BytesIO()
    downloader = MediaIoBaseDownload(fh, svc.files().get_media(fileId=file_id))
    done = False
    while not done:
        _, done = downloader.next_chunk()
    fh.seek(0)
    return fh.read(), mime_type


def delete_photo(creds, file_id):
    _service(creds).files().delete(fileId=file_id).execute()