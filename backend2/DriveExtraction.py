import gdown
import exifread
import os

def download_images_from_drive(folder_url: str, output_dir: str):
    print("Downloading images from Google Drive folder...")
    gdown.download_folder(folder_url, output=output_dir, quiet=False, use_cookies=False)
    print("Download completed.")

def convert_to_decimal(gps_coord, ref):
    try:
        d = gps_coord[0].num / gps_coord[0].den
        m = gps_coord[1].num / gps_coord[1].den
        s = gps_coord[2].num / gps_coord[2].den
        decimal = d + (m / 60.0) + (s / 3600.0)
        if ref in ['S', 'W']:
            decimal = -decimal
        return round(decimal, 6)
    except:
        return None


def get_image_location(image_path: str) -> dict:
    #Extracts GPS location from an image. Returns {'latitude': float, 'longitude': float} or None.

    with open(image_path, 'rb') as f:
        tags = exifread.process_file(f)

        lat_tag = tags.get('GPS GPSLatitude')
        lat_ref = tags.get('GPS GPSLatitudeRef')
        lon_tag = tags.get('GPS GPSLongitude')
        lon_ref = tags.get('GPS GPSLongitudeRef')

        if lat_tag and lon_tag and lat_ref and lon_ref:
            lat = convert_to_decimal(lat_tag.values, lat_ref.values)
            lon = convert_to_decimal(lon_tag.values, lon_ref.values)

            return {'latitude': lat, 'longitude': lon}
