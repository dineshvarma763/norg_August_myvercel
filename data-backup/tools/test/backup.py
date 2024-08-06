
API_KEY = 'Q8T75Su5pQaWQb2crkHv'
PROJECT_ALIAS = 'danny-conversion-digital-sandbox-heartcore'

import os
import json
import requests

def get_content(url, headers):
    response = requests.get(url, headers=headers)
    return response.json()

def get_children(url, headers):
    response = requests.get(url, headers=headers)
    return response.json()

def traverse_and_save(node, path, headers):
    for content_node in node['_embedded']['content']:
        node_id = content_node['_id']
        print(node_id)
        url = f'https://api.umbraco.io/content/{node_id}'
        content = get_content(url, headers)
        with open(os.path.join(path, f'{node_id}.json'), 'w') as f:
            json.dump(content, f)

        if content_node['_hasChildren']:
            child_url = content_node['_links']['children']['href'].replace('{id}', node_id)
            children = get_children(child_url, headers)
            child_path = os.path.join(path, node_id)
            if not os.path.exists(child_path):
                os.makedirs(child_path)
            traverse_and_save(children, child_path, headers)

if __name__ == "__main__":
    headers = {
        'Api-Key': API_KEY,
        'umb-project-alias': PROJECT_ALIAS,
        'Content-Type': 'application/json',
    }
    root_content = get_content('https://api.umbraco.io/content', headers)
    if not os.path.exists('content'):
        os.makedirs('content')
    traverse_and_save(root_content, 'content', headers)
