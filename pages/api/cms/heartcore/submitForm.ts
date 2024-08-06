export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {

      // Log the request payload
      console.log('Request payload:', req.body);

      // Create a new headers object from the request headers
      const headers = new Headers({
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        //'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9',
        'Content-Type': 'application/x-www-form-urlencoded',
        //'Origin': 'https://ata-git-staging-conversion-digital.vercel.app',
        //'Referer': 'https://ata-git-staging-conversion-digital.vercel.app/',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'cross-site',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        //'Host': 'bndgroup--sit.sandbox.my.salesforce.com',
        // More headers if needed...
      });

      if(req.body.formPostUrl.indexOf('sandbox') > -1){
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
      }

      // Forward the request to Salesforce
      const response = await fetch(req.body.formPostUrl, {
        method: 'POST',
        headers: Object.fromEntries(headers),
        body: req.body
      });
      
      console.log("Response", response);

      // If the request was successful
      if (response.ok) {
        // Parse the response body
        const data = await response.text();

        // Log the response payload
        console.log('Response payload:', data);

        // Send the response back to the client
        res.status(200).send(data);
      } else {
        // If the request failed, throw an error
        throw new Error(`Request failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred while processing your request' });
    }
  } else {
    // Handle any requests that aren't POST
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  }
}
