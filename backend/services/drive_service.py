from config import GOOGLE_DRIVE_FOLDER_ID

# This service talks to the Google Drive API.
# Photos taken on the device are uploaded here and the returned URL
# is stored in the item's photo_url field.

def upload_photo(file_bytes, filename, mime_type="image/jpeg"):
    """
    Upload a photo to the configured Drive folder.
    Returns the public URL of the uploaded file.
    """
    # TODO: implement with google-api-python-client
    raise NotImplementedError


def delete_photo(file_id):
    """Delete a photo from Drive by its file ID."""
    # TODO: implement with google-api-python-client
    raise NotImplementedError