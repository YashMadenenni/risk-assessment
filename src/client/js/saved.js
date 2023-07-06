
//global value that stores all forms 
var globalForms=[];

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
    document.getElementById("userEmail").innerHTML += userEmail;

    fetch(`/forms/saved/${userEmail}`, { method: 'GET' }).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            console.log("error");
        }
    }).then(data => {
        //console.log(data.saved);
        var savedFormsArray = data.saved;
        for (let index = 0; index < savedFormsArray.length; index++) {
            const element = savedFormsArray[index]; 
           //console.log(element); //each risk

            var activity = element.activity;

            globalForms.push(activity);

            //console.log(activity);

            for (let activityIndex = 0; activityIndex < activity.length; activityIndex++) {
                const elementActivity = activity[activityIndex]; //each activity
                console.log(elementActivity);

                document.getElementById("savedFormsTable").innerHTML += `<tr onclick="viewForm('${elementActivity.activityName}')"><td>`+elementActivity.activityName+`</td><td>`+elementActivity.date+`</td><td>`+elementActivity.description+`</td></tr>`;
                
            }

        }
    })
        .catch(error => {
            console.log("error" + error);
        });
}

function viewForm(activityThis) {
    var selectedActivity = activityThis;
    console.log(selectedActivity);
    console.log(globalForms);
   globalForms.forEach(element =>{
    element.forEach(element =>{
        
    if(element.activityName == selectedActivity){
        console.log(element);
        displayForm(element);
    }
    })
   })

}

function displayForm(formData){
    var activity = formData.activityName;
    var date = formData.date;
    var description = formData.description;
    var risksArray = formData.risks;

    document.getElementById("activity").value = activity;
    document.getElementById("formDate").value = date;
    document.getElementById("formDescription").innerHTML = description;
    
    risksArray.forEach(element => {
        console.log(element.riskName);
        const newRow = ' <tr ><td><label type="text">' + element.riskName + '</td>' + '<td><label type="text">' + element.casualties + '</td>' + '<td><label type="text">' + element.probability + '</td>' + '<td><label type="text">' + element.severity + '</td>' + '<td><label type="text">' + element.riskLevel + '</td>' + '<td><label type="text">'+element.controlMeasure+'</td></tr>'
        document.getElementById("table-risk-body").innerHTML += newRow;

    });

    document.getElementById("formDisplayBody").style = "display:block";
    document.getElementById("savedForms").style = "display:none";
}

function backToList() {
    document.getElementById("formDisplayBody").style = "display:none";
    document.getElementById("savedForms").style = "display:block";
}