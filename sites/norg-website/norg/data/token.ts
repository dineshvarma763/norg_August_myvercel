export async function getTokenRemoteNorg(secret_key:string) {
    try {
      
      console.log("secret_key BACKEND", secret_key)

      const resp = await fetch("https://api.norg.ai/api/v1/public/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "secret-key": `${secret_key}`,
        },
        body: JSON.stringify({
            "requires_login": false
        }),
      })
    
      const response = resp.json();
      return response;
    } catch (error) {
      console.error(error)
      return false;
    }
  }