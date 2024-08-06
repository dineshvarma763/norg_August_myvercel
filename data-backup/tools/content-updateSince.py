import json
import requests
from datetime import datetime
import os

API_KEY = ''
PROJECT_ALIAS = 'dev-ata-automation'


from datetime import datetime
import http.client

import pytz

def print_update_after(node_id, content, url):
    if content.get('_updateDate', {}).get('$invariant', "") != "":
        # Parse updateDate into a datetime object
        updateDate = datetime.strptime(content.get('_updateDate', {}).get('$invariant', ""), "%Y-%m-%dT%H:%M:%S.%fZ")

        # Convert updateDate to AEST
        updateDate = updateDate.replace(tzinfo=pytz.UTC).astimezone(pytz.timezone('Australia/Sydney'))

        # Create a datetime object for Friday 30th June at 2:00pm AEST
        compareDate = datetime.strptime("2023-06-30T14:00:00", "%Y-%m-%dT%H:%M:%S")
        compareDate = compareDate.replace(tzinfo=pytz.timezone('Australia/Sydney'))

        # Compare updateDate to compareDate
        if updateDate >= compareDate:
            print("FOUND >> ", node_id, content['name'].get('$invariant'))  


def get_contenta(url):
    url = url.replace('https://api.umbraco.io', '')
    #print("get_contenta", url)
    conn = http.client.HTTPSConnection("api.umbraco.io")
    payload = ''
    headers = {
    'Umb-Project-Alias': PROJECT_ALIAS,
    'Api-Key': API_KEY
    }
    #print("get_contenta headers ", headers)
    conn.request("GET", url, payload, headers)
    res = conn.getresponse()
    data = res.read()
    #print(data.decode("utf-8"))
    data_str = data.decode("utf-8")
    # return the data as a Python dictionary (JSON)
    return json.loads(data_str)

def get_children(url):
    #response = requests.get(url, headers=headers)
    #print('get children', url)
    return get_contenta(url)

def traverse_and_save(node, path, field, function):
    #print(node)
    for content_node in node['_embedded']['content']:
        node_id = content_node['_id']
        url = f'/content/{node_id}'
        content = get_contenta(url)
        print("scrolling over node >> ", node_id, content.get('contentTypeAlias'), content['name'].get('$invariant'))
        # Check if this is a "subComponentsPage"
        if (content.get('contentTypeAlias') != "productPage") and (content.get('contentTypeAlias') != "subComponentsPage") and (content.get('contentTypeAlias') != "homepage"):
            #print("skipping >> ", node_id, content.get('contentTypeAlias'))
            continue

        if field == "_updateDate":
            function(node_id, content, url)

        if content_node['_hasChildren']:
            child_url = content_node['_links']['children']['href'].replace('{id}', node_id)
            children = get_children(child_url)
            child_path = os.path.join(path, node_id)
            # if not os.path.exists(child_path):
            #     os.makedirs(child_path)
            traverse_and_save(children, child_path, field, function)

if __name__ == "__main__":

    #US
    root_content = get_contenta('/content/ee578f5f-df50-4dc7-818f-00b57c69c960/children')
    #print(root_content)
    traverse_and_save(root_content, 'content', field="_updateDate", function=print_update_after)

    #AU
    root_content = get_contenta('https://api.umbraco.io/content/e58b4d2e-c149-4d50-9210-7132b75e7939/children')
    #print(root_content)
    traverse_and_save(root_content, 'content', field="_updateDate", function=print_update_after)
