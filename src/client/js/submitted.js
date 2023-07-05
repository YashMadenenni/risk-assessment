window.onload = function () {
    //set href for saved forms
    //get user 
    var currentUrl = window.location.href;

    //get query string from URL 
    var queryString = currentUrl.split('?')[1];
    var params = new URLSearchParams(queryString);
    var userEmail = params.get("user");

    console.log(userEmail);

    document.getElementById("home").href = "./home.html?user=" + userEmail;
    document.getElementById("saved").href = "./saved.html?user=" + userEmail;


    fetch(`/forms/submitted/${userEmail}`, { method: 'GET' }).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            console.log("error")
        }
    }).then(data => {
        console.log(data);
    })
        .catch(error => {
            console.log("error" + error);
        });
}