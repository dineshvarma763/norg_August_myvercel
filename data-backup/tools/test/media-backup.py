import os
import json
import requests
from tqdm import tqdm

API_KEY = 'Q8T75Su5pQaWQb2crkHv'
PROJECT_ALIAS = 'danny-conversion-digital-sandbox-heartcore'


def get_content(node_id):
    if node_id.startswith('http'):
        url = node_id
    else:
        url = f'https://api.umbraco.io/media/{node_id}'  # Include the base URL
    headers = {
        'Api-Key': API_KEY,
        'umb-project-alias': PROJECT_ALIAS,
    }
    response = requests.get(url, headers=headers)
    response.raise_for_status()  # Throw an exception if the request failed
    return response.json()


def get_children_links(node_id):
    if node_id.startswith('http'):
        url = node_id
    else:
        url = f'https://api.umbraco.io/media/{node_id}/children'  # Include the base URL
    print(f'get_children_links {url}.')
    content = get_content(url)
    links = content['_links']
    print(f'get_children_links  content {links}.')
    if 'media' in content['_links']:
        media_link = content['_links']['media']
        if isinstance(media_link, list):
            children_links = [link['href'] for link in media_link]
        elif isinstance(media_link, dict):
            children_links = [media_link['href']]
        else:
            print(f"Expected a list or dict but got {type(media_link)}")
            return []
        return children_links
    else:
        return []

    
def download_file(src, file_path):
    url = f"https://danny-conversion-digital-sandbox-heartcore.euwest01.umbraco.io{src}"
    headers = {
        'Api-Key': API_KEY,
        'Umb-Project-Alias': PROJECT_ALIAS,
    }
    response = requests.get(url, headers=headers)
    response.raise_for_status()  # Throw an exception if the request failed
    
    # Extract the filename from the URL
    filename = src.split('/')[-1]
    
    # Create the necessary directories
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    
    # Set the filename for the downloaded file
    file_path = os.path.join(os.path.dirname(file_path), filename)
    
    with open(file_path, 'wb') as file:
        file.write(response.content)



def traverse_and_backup(node_id, path):
    content = get_content(node_id)

    os.makedirs(path, exist_ok=True)

    # Save the content to a file
    with open(os.path.join(path, 'content.json'), 'w') as file:
        json.dump(content, file)

    # Download the file if it exists and the content is not a Folder
    if 'umbracoFile' in content and content.get('mediaTypeAlias') != 'Folder':
        if isinstance(content['umbracoFile'], dict):
            download_file(content['umbracoFile']['src'], os.path.join(path, 'file'))
        else:
            download_file(content['umbracoFile'], os.path.join(path, 'file'))

    # Recurse on the children
    if '_links' in content and 'children' in content['_links']:
        print(f'Links found {node_id}.')
        children_links = get_children_links(content['_links']['children']['href'])
        for child_link in children_links:
            print(f'child_link found {child_link}.')
            traverse_and_backup(child_link.split('/')[-1], os.path.join(path, child_link.split('/')[-1]))



# Get the list of all media items
url = 'https://api.umbraco.io/media'
headers = {
    'Api-Key': API_KEY,
    'umb-project-alias': PROJECT_ALIAS,
}
response = requests.get(url, headers=headers)
response.raise_for_status()  # Throw an exception if the request failed

# Call traverse_and_backup for each media item
for media_item in response.json()["_embedded"]["media"]:
    traverse_and_backup(media_item["_id"], os.path.join('media', media_item["_id"]))
