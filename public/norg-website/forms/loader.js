// Use window object to keep track of interval ID
if (!window.checkIntervalId) {

  function checkAndLoadScript() {
    console.log('Form recapthca loading running checks...')
    // Get the element
    var element = document.getElementById("site-key-holder");

    // Check if 'data-script-file-loaded' attribute is set to 'true'
    if (element && element.getAttribute('data-script-file-loaded') !== 'true') {
      // Create new script element
      var script = document.createElement('script');
      script.src = '/norg-website/forms/recaptcha.js';

      // When the script loads, set 'data-script-file-loaded' to 'true'
      script.onload = function() {
        element.setAttribute('data-script-file-loaded', 'true');
      };

      // Append the script to the body (or head, depending on your needs)
      document.body.appendChild(script);
    }
  }

  // Clear the existing interval if one exists
  if (window.checkIntervalId) {
    clearInterval(window.checkIntervalId);
  }

  // Use setTimeout to call checkAndLoadScript every 5000 milliseconds (5 seconds)
  // Store the interval ID on the window object
  window.checkIntervalId = setInterval(checkAndLoadScript, 5000);
}
