var myHeaders = new Headers();
myHeaders.append("Authorization", "App 53006856e580728eba1da7cd3f11ce58-3e9f8ccf-6c3b-426b-a398-cc89ba3b4a93");
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Accept", "application/json");

var raw = JSON.stringify({
    "messages": [
        {
            "destinations": [{"to":"998907511043"}],
            "from": "ServiceSMS",
            "text": "Hello,\n\nThis is a test message from Infobip. Have a nice day!"
        }
    ]
});

var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
};

fetch("https://xlq3eg.api.infobip.com/sms/2/text/advanced", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));