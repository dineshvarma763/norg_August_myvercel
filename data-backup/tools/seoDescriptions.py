import os
import json
import requests
import json
from bs4 import BeautifulSoup
import re

API_KEY = ''
PROJECT_ALIAS = 'norg-website'
GPT4_API_KEY = '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'  # Replace with your GPT-4 API Key
GPT4_API_URL = 'https://api.openai.com/v1/chat/completions'  # URL for GPT-4 model

from collections import OrderedDict

def limit_words_remove_duplicates(text, max_words=500):
    """Limit the text to a certain number of words and remove duplicates."""
    words = text.split()
    limited_words = list(OrderedDict.fromkeys(words))[:max_words]
    return ' '.join(limited_words)

def get_content(url, headers):
    response = requests.get(url, headers=headers)
    return response.json()

def get_children(url, headers):
    response = requests.get(url, headers=headers)
    return response.json()

def update_content(url, headers, data):
    response = requests.put(url, headers=headers, data=json.dumps(data))
    return response.json()


def is_guid(s):
    guid_regex = re.compile(r'^\{?[a-f\d]{8}-(?:[a-f\d]{4}-){3}[a-f\d]{12}\}?$')
    return bool(guid_regex.match(s))

def is_url(s):
    url_regex = re.compile(
        r'^(?:http|ftp)s?://'  # http:// or https://
        r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|'  # domain...
        r'localhost|'  # localhost...
        r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|'  # ...or ip
        r'\[?[A-F0-9]*:[A-F0-9:]+\]?)'  # ...or ipv6
        r'(?::\d+)?'  # optional port
        r'(?:/?|[/?]\S+)$', re.IGNORECASE)
    return bool(url_regex.match(s))

def is_date(s):
    date_regex = re.compile(r'\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3}Z)?)?')
    return bool(date_regex.match(s))

def is_zero(s):
    return s == '0'

def is_keyword(s):
    keywords = ['PUBLISHED']
    return s in keywords

def extract_text_from_json(json_data):
    # Removing "contentTypeAlias" field from the data
    json_data.pop('contentTypeAlias', None)

    words = []
    for key, value in json_data.items():
        if isinstance(value, dict):
            words += extract_text_from_json(value)
        elif isinstance(value, str):
            # Check if the string is not a GUID, URL, date, '0', or a keyword
            if not (is_guid(value) or is_url(value) or is_date(value) or is_zero(value) or is_keyword(value)):
                # Create a soup object and get the text
                soup = BeautifulSoup(value, "html.parser")
                text = soup.get_text()
                words.append(text)
    return words


def get_components_text(content, node_id, headers):
    # The input string for text gathered from each component
    text_input = ""
    print(f"\nProcessing node {node_id}  {content['name'].get('$invariant')}...\n")

    # Check if the node has children
    if content['_hasChildren']:
        # Build the URL for getting children

        child_url = retrieve_href(content)
        children = get_content(child_url, headers)

        #print(f"get_components_text child_url: {child_url}")

        if '_links' in children and 'content' in children['_links']:
            if isinstance(children['_links']['content'], list):
                for child in children['_links']['content']:
                    text_input += process_child_link(retrieve_href(child), headers, node_id)
            else:
                text_input += process_child_link(retrieve_href(children), headers, node_id)
        else:
            text_input += process_child_link(retrieve_href(children), headers, node_id)

    return text_input


def process_child_link(child_url, headers, node_id):
        text_input = ""
        #print(f"process_child_link child_url: {child_url}")
        # Get the content of children nodes
        child = get_content(child_url, headers)

        # Loop through the children
        #for child in children['_links']['content']:
            # Get the content of the current child node
            
        #aHref = retrieve_href(child)
        #print(f"checking child aHref: {node_id} {child_url}")
        #child_content = get_content(aHref, headers)

        # Check if the name of the child node is "_components"
        if 'name' in child and child['name'].get('$invariant') == "_components":
            print(f"Found _components in child node {child['name'].get('$invariant')}  children:  {child['_hasChildren']}")

            # If this child node has further children
            if child['_hasChildren']:

                # Get the children of this _components node
                component_children_url = retrieve_href(child)
                #print(f"component_children_url: {component_children_url}")
                #print(f"component_children_url: {component_children_url}")
                component_children = get_content(component_children_url, headers)

                #print(f"component_children: {component_children}")

                # Loop through each component child node
                # Check if '_links' and 'content' are present in component_children, and 'href' is present in 'content'
                #print(f"component_children: {component_children}")

                if '_links' in component_children and 'content' in component_children['_links']:
                    if isinstance(component_children['_links']['content'], list):
                        for child in component_children['_links']['content']:
                            comp_child_href = retrieve_href(child)
                            comp_child_content = get_content(comp_child_href, headers)
                            #print(f"component_children text addition href: {comp_child_href}")
                            text_input += " ".join(extract_text_from_json(comp_child_content)) + " "

                # href = retrieve_href(component_children)
                # print(f"component_children href: {href}")
                # comp_child_content = get_content(href, headers)
                # text_input += " ".join(extract_text_from_json(comp_child_content)) + " "
                        
        print(f"Text collected from node {node_id}: {text_input}\n")
        return text_input.strip()

def retrieve_href(contentX):
    href = ""
    content = {}
    #print(f"contentX: {contentX}")
    if '_links' in contentX and 'content' in contentX['_links']:
        content = contentX['_links']['content']
        
    if not content and '_links' in contentX and 'children' in contentX['_links']:
        content = contentX['_links']['children']

    if not content and 'href' in contentX:
        return contentX['href']

    if isinstance(content, list):
        for item in content:
            if 'href' in item:
                href = item['href']
                
    elif isinstance(content, dict):
        if 'href' in content:
            href = content['href']

    return href

def generate_description(text_input):
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {GPT4_API_KEY}',
    }
    data = {
        "model": "gpt-4",
        "messages": [
            {"role": "system", "content": "You are a helpful SEO assistant."}, 
            {"role": "user", "content": f"Produce a nicely formatted SEO description (no more than 160 characters) and remove any bad characters or fluff, based on the input: {text_input}"}
        ]
    }
    response = requests.post(GPT4_API_URL, headers=headers, json=data)
    response_json = response.json()

    if 'choices' in response_json and len(response_json['choices']) > 0:
        return response_json['choices'][0]['message']['content'].strip()
    else:
        print(f"Error with GPT-4 API call: {response_json}")
        return ""

def traverse_and_save(node, path, headers, field, function):
    for content_node in node['_embedded']['content']:
        node_id = content_node['_id']
        url = f'https://api.umbraco.io/content/{node_id}'
        content = get_content(url, headers)
        print("node >> ", node_id, content.get('contentTypeAlias'), content['name'].get('$invariant'))
        # Check if this is a "subComponentsPage"
        if (content.get('contentTypeAlias') != "productPage") and (content.get('contentTypeAlias') != "subComponentsPage") and (content.get('contentTypeAlias') != "homepage"):
            print("skipping >> ", node_id, content.get('contentTypeAlias'))
            continue

        if field == "description":
            write_description_to_api(node_id, content, headers, url)
        if field == "structureddata":
            function(node_id, content, headers, url)

        if content_node['_hasChildren']:
            child_url = content_node['_links']['children']['href'].replace('{id}', node_id)
            children = get_children(child_url, headers)
            child_path = os.path.join(path, node_id)
            # if not os.path.exists(child_path):
            #     os.makedirs(child_path)
            traverse_and_save(children, child_path, headers, field, function)

def write_description_to_api(node_id, content, headers, url, field="description"):
        # Check if description field is empty
    if content.get('sEODescription', {}).get('$invariant', "") == "":
        # Generate new description using GPT3
        text_input = get_components_text(content, node_id, headers)

        if text_input == "":
            print("skipping >> ", node_id, "no text input")
            return

        raw_description = generate_description(text_input).replace('"', '')
        
        # Limit words and remove duplicates
        new_description = limit_words_remove_duplicates(raw_description)

        # Update the content with new description
        content['sEODescription'] = {'$invariant': new_description}
        content['ogDescription'] = {'$invariant': new_description}
        print("new description > ", new_description)
        response = update_content(url, headers, content)
        
    else:
        print("skipping >> ", node_id, "description already exists", content['name'].get('$invariant'))



def print_instanceof(value):
    if isinstance(value, int):
        print("The value is an integer.")
    elif isinstance(value, str):
        print("The value is a string.")
    elif isinstance(value, float):
        print("The value is a float.")
    elif isinstance(value, list):
        print("The value is a list.")
    elif isinstance(value, dict):
        print("The value is a dictionary.")
    else:
        print("The value has an unknown type.")

if __name__ == "__main__":
    headers = {
        'Api-Key': API_KEY,
        'umb-project-alias': PROJECT_ALIAS,
        'Content-Type': 'application/json',
    }

    #US
    root_content = get_content('https://api.umbraco.io/content/ee578f5f-df50-4dc7-818f-00b57c69c960/children', headers)
    traverse_and_save(root_content, 'content', headers)

    #AU
    root_content = get_content('https://api.umbraco.io/content/e58b4d2e-c149-4d50-9210-7132b75e7939/children', headers)
    traverse_and_save(root_content, 'content', headers)
