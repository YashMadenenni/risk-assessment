const { response } = require("express")

window.onload = function () {

    fetch('/forms/saved',{method:'GET'}).then(response =>{
        if (response.ok) {
           var respone =  response.json();
            
        } else {
            console.log(error)
        }
    })
}