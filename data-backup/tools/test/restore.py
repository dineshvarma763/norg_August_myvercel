API_KEY = 'Q8T75Su5pQaWQb2crkHv'
PROJECT_ALIAS = 'danny-conversion-digital-sandbox-heartcore'
import os
import json
import requests

# This mapping will store old IDs as keys and new IDs as values
id_mapping = {}

def update_content(node_id, content, headers):
    url = f'https://api.umbraco.io/content/{node_id}'
    try:
        response = requests.put(url, headers=headers, data=json.dumps(content))
        print(f'response {node_id} {response.status_code}.')
        response.raise_for_status()  # Throw an exception if the request failed
    except requests.exceptions.HTTPError as err:
        if response.status_code == 404:  # If the content node does not exist
            # Remove the ID from the content so that a new one will be generated
            originalId = content['_id'];
            del content['_id']
            # If the content has a parent ID and that parent ID has a corresponding new ID, update the parent ID
            if 'parentId' in content and content['parentId'] in id_mapping:
                previousId = content['parentId']
                print(f'{originalId} parent id was {previousId}.')
                content['parentId'] = id_mapping[content['parentId']]
                newParentId = content['parentId'];
                print(f'{originalId} parent id set to {newParentId}.')
            # Make a POST request to create a new content node
            response = requests.post('https://api.umbraco.io/content', headers=headers, data=json.dumps(content))
            try:
                response.raise_for_status()  # Throw an exception if the request failed
                new_id = response.json()["_id"]
                # Store the new ID in the mapping
                id_mapping[node_id] = new_id
                print(f'Created new content node for original ID {node_id}. New ID is {new_id}.')
            except requests.exceptions.HTTPError as err:
                print(f'HTTP error occurred when creating new content node for original ID {node_id}: {err}')
        else:
            print(f'HTTP error occurred for node_id {node_id}: {err}')


def traverse_and_restore(dir_name, headers):
    # First, handle all JSON files in the directory
    for filename in os.listdir(dir_name):
        file_path = os.path.join(dir_name, filename)
        if filename.endswith(".json"):
            with open(file_path, 'r') as f:
                content = json.load(f)
                node_id = content['_id']
                update_content(node_id, content, headers)
    
    # Next, traverse all child directories
    for filename in os.listdir(dir_name):
        file_path = os.path.join(dir_name, filename)
        if os.path.isdir(file_path):  # If the file is actually a directory, go through it
            traverse_and_restore(file_path, headers)

if __name__ == "__main__":
    headers = {
        'Api-Key': API_KEY,
        'umb-project-alias': PROJECT_ALIAS,
        'Content-Type': 'application/json',
    }
    traverse_and_restore('content', headers)
