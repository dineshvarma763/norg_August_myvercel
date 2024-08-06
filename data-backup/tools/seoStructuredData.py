import seoDescriptions
import json
import requests


API_KEY = ''
PROJECT_ALIAS = 'norg-website'
GPT4_API_KEY = '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'  # Replace with your GPT-3 API Key
GPT4_API_URL = 'https://api.openai.com/v1/chat/completions'  # URL for GPT-3 model


def generate_structured_data(text_input):
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {GPT4_API_KEY}',
    }
    data = {
        "model": "gpt-4",
        "messages": [
            {"role": "system", "content": "You are a helpful SEO assistant that is a specialt in producing structured data markup in JSON."}, 
            {"role": "user", "content": f"Produce JSON OUTPUT that is structured data markup in  JSON-LD structured data snippet based on this input: {text_input}"}
        ]
    }
    response = requests.post(GPT4_API_URL, headers=headers, json=data)
    response_json = response.json()

    if 'choices' in response_json and len(response_json['choices']) > 0:
        return response_json['choices'][0]['message']['content']
    else:
        print(f"Error with GPT-4 API call: {response_json}")
        return ""

def write_structurd_to_api(node_id, content, headers, url):
        # Check if description field is empty
    print("checking >> ", node_id, content['name'].get('$invariant'), content.get('structuredData', {}).get('$invariant', ""))
    if content.get('structuredData', {}).get('$invariant', "") == "":
        # Generate new description using GPT3
        text_input = seoDescriptions.get_components_text(content, node_id, headers)

        if text_input == "":
            print("skipping >> ", node_id, "no text input")
            return

        structured_data = generate_structured_data(GPT4_API_KEY, text_input).replace('"', '')
        
        # Update the content with new description
        content['structuredData'] = {'$invariant': structured_data}
        print("new description > ", structured_data)
        response = seoDescriptions.update_content(url, headers, content)
        
    else:
        print("skipping >> ", node_id, "structured data already exists", content['name'].get('$invariant'))


if __name__ == "__main__":
    headers = {
        'Api-Key': API_KEY,
        'umb-project-alias': PROJECT_ALIAS,
        'Content-Type': 'application/json',
    }

    #US
    root_content = seoDescriptions.get_content('https://api.umbraco.io/content/ee578f5f-df50-4dc7-818f-00b57c69c960/children', headers)
    seoDescriptions.traverse_and_save(root_content, 'content', headers, field="structureddata", function=write_structurd_to_api)

    #AU
    root_content = seoDescriptions.get_content('https://api.umbraco.io/content/e58b4d2e-c149-4d50-9210-7132b75e7939/children', headers)
    seoDescriptions.traverse_and_save(root_content, 'content', headers, field="structureddata", function=write_structurd_to_api)
