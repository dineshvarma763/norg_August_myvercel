var element = document.getElementById("site-key-holder");
element.setAttribute('data-script-file-loaded', 'true');

var isCaptchaLoaded = false;
var onloadCallback = function() {
  loadCaptcha();
};
function loadCaptcha() {              
  if(isCaptchaLoaded) {
    return;
  }              
  var ataCaptcha = document.getElementById("ataRecaptcha");      
  if(ataCaptcha && typeof ataCaptcha !== "undefined" && typeof grecaptcha !== "undefined" && typeof grecaptcha.render === 'function') {
    var element = document.getElementById("site-key-holder");
    var siteKey = element.getAttribute("data-value");
    grecaptcha.render('ataRecaptcha', {
      'sitekey' : siteKey
    });
    isCaptchaLoaded = true;
  }
}
function timestamp() {
  loadCaptcha();
  var response = document.getElementById("g-recaptcha-response");
  var settingsElement = document.getElementsByName("captcha_settings")[0];

  if(settingsElement && settingsElement.value) {
    var elems = JSON.parse(settingsElement.value);
    elems["ts"] = JSON.stringify(new Date().getTime());
    settingsElement.value = JSON.stringify(elems);
    setTimeout(timestamp, 500);
    if (response == null || response.value.trim() == "" || typeof settingsElement === "undefined") {
        return;
    } 
  }else {
    setTimeout(timestamp, 500);
  }

}
setTimeout(timestamp, 500);