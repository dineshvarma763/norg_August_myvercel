#!/usr/bin/env python
# -*- coding: utf-8 -*-

API_KEY = ''
PROJECT_ALIAS = 'norg-website'

import os
import json
import requests
import sys  # Import sys to handle command-line arguments

def get_content(url, headers):
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
    except requests.exceptions.HTTPError as err:
        print(f"Error getting data from url {url}, response code {response.status_code}")
        return
    except:
        print(f"Error getting data from url {url}")
    return response.json()

def process_node(content_node, path, headers):
    node_id = content_node['_id']
    print(f"\nProcessing node {node_id}  {content_node['name'].get('$invariant')}...\n")
    url = f'https://api.umbraco.io/content/{node_id}'
    content = get_content(url, headers)
    with open(os.path.join(path, f'{node_id}.json'), 'w') as f:
        json.dump(content, f)

    if content_node['_hasChildren']:
        child_url = content_node['_links']['children']['href'].replace('{id}', node_id)
        child_url = child_url + "?pagesize=1000"
        children = get_content(child_url, headers)
        child_path = os.path.join(path, node_id)
        if not os.path.exists(child_path):
            os.makedirs(child_path)
        traverse_and_save(children, child_path, headers)

def traverse_and_save(node, path, headers):
    content_list = node['_embedded']['content']
    for content_node in content_list:
        process_node(content_node, path, headers)

# Main program - can be called with node id as optional param
if __name__ == "__main__":
    # Check for command line arguments for node ID
    node_id = sys.argv[1] if len(sys.argv) > 1 else None

    headers = {
        'Api-Key': API_KEY,
        'umb-project-alias': PROJECT_ALIAS,
        'Content-Type': 'application/json',
    }

    # Set initial URL based on the presence of node ID
    if node_id:
        initial_url = f'https://api.umbraco.io/content/{node_id}'
    else:
        initial_url = 'https://api.umbraco.io/content'

    path = os.path.join('content')

    # Fetch initial content
    content = get_content(initial_url, headers)
    if content == None:
        exit(1)

    # Print the contents of the node JSON data
    # print(json.dumps(content, indent=4))  # Pretty print the JSON data

    # Ensure the content storage directory presence
    if not os.path.exists(path):
        os.makedirs(path)

    if node_id:
        process_node(content, path , headers)
    else:
        traverse_and_save(content, path, headers)
