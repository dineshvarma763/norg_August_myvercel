API_KEY = 'Q8T75Su5pQaWQb2crkHv'
PROJECT_ALIAS = 'danny-conversion-digital-sandbox-heartcore'
import os
import json
import requests
import logging

BASE_URL = 'https://api.umbraco.io'
parent_id_map = {}

logging.basicConfig(level=logging.DEBUG)

def create_media(media_data, file_path=None):
    url = f'{BASE_URL}/media'
    headers = {
        'Api-Key': API_KEY,
        'umb-project-alias': PROJECT_ALIAS
    }
    content_type = 'application/octet-stream'  # Set default value for content_type

    if file_path and media_data.get('mediaTypeAlias') in ['umbracoMediaVectorGraphics', 'Image', 'File', 'umbracoMediaAudio', 'umbracoMediaVideo', 'umbracoMediaArticle']:
        with open(file_path, 'rb') as file:
            binary_data = file.read()
            if media_data.get('mediaTypeAlias') == 'umbracoMediaVectorGraphics':
                content_type = 'image/svg+xml'
                media_data['umbracoFile'] = os.path.basename(file_path)
            elif media_data.get('mediaTypeAlias') == 'Image':
                if media_data.get('umbracoExtension') == 'png':
                    content_type = 'image/png'
                elif media_data.get('umbracoExtension') == 'jpg' or media_data.get('umbracoExtension') == 'jpeg':
                    content_type = 'image/jpeg'
                media_data['umbracoFile'] = {"src": os.path.basename(file_path)}
            elif media_data.get('mediaTypeAlias') == 'Audio':
                if media_data.get('umbracoExtension') == 'mp3':
                    content_type = 'audio/mpeg'
                media_data['umbracoFile'] = os.path.basename(file_path)
            elif media_data.get('mediaTypeAlias') == 'Video':
                if media_data.get('umbracoExtension') == 'mp4':
                    content_type = 'video/mp4'
                media_data['umbracoFile'] = os.path.basename(file_path)
            elif media_data.get('mediaTypeAlias') == 'umbracoMediaArticle':
                if media_data.get('umbracoExtension') == 'docx':
                    content_type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                media_data['umbracoFile'] = os.path.basename(file_path)
            elif media_data.get('mediaTypeAlias') == 'File':
                if media_data.get('umbracoExtension') == 'pdf':
                    content_type = 'application/pdf'
                media_data['umbracoFile'] = os.path.basename(file_path)

            logging.debug(f"seinding file file_path: {file_path} {content_type}")

            files = {
                'content': (None, json.dumps(media_data), 'application/json'),
                'umbracoFile': (os.path.basename(file_path), binary_data, content_type)
            }
            response = requests.post(url, headers=headers, files=files)
    else:
        response = requests.post(url, headers=headers, json=media_data)

    response.raise_for_status()
    return response.json()

def create_directories_recursively(path):
    
    if 'content.json' in os.listdir(path):
        with open(os.path.join(path, 'content.json'), 'r') as json_file:
            media_data = json.load(json_file)
        if media_data.get('mediaTypeAlias') == 'Folder':
            logging.debug(f"Processing directory: {path}")
            logging.debug(f"Processing content.json for path: {os.path.join(path, 'content.json')}")
            if 'parentId' in media_data:
                media_data['parentId'] = parent_id_map.get(media_data['parentId'], media_data['parentId'])
            created_media = create_media(media_data)
            if '_id' in media_data and '_id' in created_media:
                parent_id_map[media_data['_id']] = created_media['_id']

    for entry in os.scandir(path):
        if entry.is_dir():
            create_directories_recursively(entry.path)


def process_media_items(path):
    logging.debug(f"Processing media items in directory: {path}")
    for entry in os.scandir(path):
        if entry.is_file() and entry.name != 'content.json':
            with open(os.path.join(path, 'content.json'), 'r') as json_file:
                media_data = json.load(json_file)
            if media_data.get('mediaTypeAlias') in ['umbracoMediaVectorGraphics', 'Image', 'File', 'umbracoMediaAudio', 'umbracoMediaVideo', 'umbracoMediaArticle']:
                if 'parentId' in media_data:
                    media_data['parentId'] = parent_id_map.get(media_data['parentId'], media_data['parentId'])
                file_path = None
                if isinstance(media_data['umbracoFile'], dict):
                    file_path = os.path.join(path, os.path.basename(media_data['umbracoFile']['src']))
                elif isinstance(media_data['umbracoFile'], str):
                    file_path = os.path.join(path, os.path.basename(media_data['umbracoFile']))
                logging.debug(f"Attempting to upload file at: {file_path}")
                try:
                    create_media(media_data, file_path)
                except FileNotFoundError:
                    logging.error(f"File not found: {file_path}")
        elif entry.is_dir():
            process_media_items(entry.path)

if __name__ == "__main__":
    backup_path = './media'
    create_directories_recursively(backup_path)
    process_media_items(backup_path)