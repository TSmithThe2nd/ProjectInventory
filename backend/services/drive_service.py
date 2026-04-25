import io
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload
from config import GOOGLE_DRIVE_FOLDER_ID


def _service(creds):
    return build("drive", "v3", credentials=creds)


def upload_photo(file_bytes, filename, mime_type, creds):
    svc = _service(creds)
    media = MediaIoBaseUpload(io.BytesIO(file_bytes), mimetype=mime_type)
    file_meta = {"name": filename, "parents": [GOOGLE_DRIVE_FOLDER_ID]}
    uploaded = svc.files().create(body=file_meta, media_body=media, fields="id").execute()
    file_id = uploaded["id"]
    svc.permissions().create(
        fileId=file_id,
        body={"role": "reader", "type": "anyone"},
        fields="id",
    ).execute()
    return f"https://drive.usercontent.google.com/download?id={file_id}&export=view"


def delete_photo(file_id, creds):
    try:
        _service(creds).files().delete(fileId=file_id).execute()
    except Exception:
        pass
