#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import sys
import json
import requests

API_KEY = ''
PROJECT_ALIAS = 'norg-website'

# This mapping will store old IDs as keys and new IDs as values
id_mapping = {}

def update_content(node_id, content, headers):
    url = f'https://api.umbraco.io/content/{node_id}'
    print(f"Updating content at URL: {url}")
    isdraft = True if (content["_currentVersionState"]["$invariant"]
                       == "DRAFT") else False
    try:
        # print(f'Request: URL: {url}, Node ID: {node_id}, Content: {json.dumps(content)}.')
        response = requests.put(url, headers=headers, data=json.dumps(content))
        print(f"Update response for Node ID {node_id}: {response.status_code}")
        if (response.status_code == 200):
            # publish or unpublish based on DRAFT status
            if isdraft:
                url = f"{url}/unpublish"
            else:
                url = f"{url}/publish"
            # print(f"Caling URL: {url}")
            response = requests.put(url, headers=headers)
            if response.status_code != 200:
                print(f"Unable to ", end='')
                print("unpublish", end='') if isdraft else print("publish", end='')
                print(f" the url : {url}")
            else:
                print("Unpublished", end='') if isdraft else print("Published", end='')
                print(f" URL: {url} successfully!")

            response.raise_for_status()
        response.raise_for_status()
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
                # publish or unpublish based on DRAFT status
                if isdraft:
                    url = f"https://api.umbraco.io/content/{new_id}/unpublish"
                else:
                    url = f"https://api.umbraco.io/content/{new_id}/publish"

                # print(f"URL: {url}")
                response = requests.put(url, headers=headers)
                if response.status_code != 200:
                    print(f"Unable to ", end='')
                    print("unpublish", end='') if isdraft else print("publish", end='')
                    print(f" the url : {url}")
                    # print(f"Unable to publish the url : {url}")
                else:
                    print("Unpublished", end='') if isdraft else print("Published", end='')
                    print(f" URL: {url} successfully!")
                    # print(f"Published URL: {url} successfully!")
            except requests.exceptions.HTTPError as err:
                print(f'HTTP error occurred when creating new content node for original ID {node_id}: {err}')
        else:
            print(f'HTTP error occurred for node_id {node_id}: {err}')

def traverse_and_restore(file_list, headers):
    for filename in file_list:
        with open(filename, 'r') as f:
            content = json.load(f)
            node_id = content['_id']
            update_content(node_id, content, headers)
        print(f"Restoring content from file: {filename}")

def sort_and_restore_content(dir_name, headers, node_id=None):
    json_data_list = []
    if node_id:
        print(f"Node ID specified: {node_id}")
        filename = node_id + ".json"
        file_path = os.path.join(dir_name, filename)
        print(f"File path for Node ID is : {file_path}")
        try:
            with open(file_path, 'r') as file:
                data = json.load(file)
                json_data_list.append((file_path, data))
        except:
            print(f"Error opening file {file_path}, please make sure that the file exists and is readable")
            return
    else:
        print(f"No specific Node ID specified. Processing all nodes in the directory: {dir_name}")
        for filename in os.listdir(dir_name):
            if filename.endswith('.json'):
                file_path = os.path.join(dir_name, filename)
                with open(file_path, 'r') as file:
                    data = json.load(file)
                    json_data_list.append((file_path, data))

    json_data_list.sort(key=lambda x: x[1].get('sortOrder', float('inf')))
    sorted_filenames = [filename for filename, _ in json_data_list]
    traverse_and_restore(sorted_filenames, headers)

    # if restoring only a specific node, only descend into its
    # directory and not others
    if node_id:
        # print(f"Node ID: {node_id}, Dirname: {dir_name}")
        file_path = os.path.join(dir_name, node_id)
        print(f"Descending into directory: {file_path}")
        sort_and_restore_content(file_path, headers)
    else:
        # else target all subdirectories and nodes
        for filename in os.listdir(dir_name):
            file_path = os.path.join(dir_name, filename)
            if os.path.isdir(file_path) and not filename.endswith('.json'):
                print(f"Descending into directory: {file_path}")
                sort_and_restore_content(file_path, headers)

if __name__ == "__main__":
    headers = {
        'Api-Key': API_KEY,
        'umb-project-alias': PROJECT_ALIAS,
        'Content-Type': 'application/json',
    }

    node_id = sys.argv[1] if len(sys.argv) > 1 else None
    if node_id:
        print(f"Starting restoration process for Node ID: {node_id}")
    else:
        print(f"Starting restoration process")
    sort_and_restore_content('content', headers, node_id=node_id)
    print("Restoration process completed.")
