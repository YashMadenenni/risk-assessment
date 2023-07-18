
//global value that stores all forms 
var globalForms = [];

async function getAllHistoryForms() {
    //set href for saved forms
    //get user 
    // var currentUrl = window.location.href;

    // //get query string from URL 
    // var queryString = currentUrl.split('?')[1];
    // var params = new URLSearchParams(queryString);
    // var userEmail = params.get("user");

    // console.log(userEmail);

    // document.getElementById("home").href = "./home.html?user=" + userEmail;
    // document.getElementById("userEmail").innerHTML += userEmail;

    
    // console.log("Email ", respone.userEmail);
    // document.getElementById("userEmail").innerHTML += respone.userEmail;
    

    fetch(`/forms/submitted`, { method: 'GET' }).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            console.log("error");
        }
    }).then(data => {
        //console.log(data.saved);
        var savedFormsArray = data.submitted;
        for (let index = 0; index < savedFormsArray.length; index++) {
            const element = savedFormsArray[index];
            //console.log(element); //each risk

            var activity = element.activity;

            activity.forEach(element=>{
                globalForms.push(element);

                const activityIndexInGlobal = globalForms.indexOf(element);
                const elementActivity = element;
                var approved = "Pending";
                if (elementActivity.approval) {
                    approved = "Approved"
                }
                document.getElementById("submittedFormsTable").innerHTML += `<tr onclick="viewForm('${activityIndexInGlobal}')"><td  class="col-3">` + elementActivity.activityName + `</td><td  class="col-3">` + elementActivity.date + `</td><td  class="col-4">` + elementActivity.description + `</td><td class='${approved.toLowerCase()}  col-2'>` + approved + `</td></tr>`;

            })
            
            
            

            console.log(activity);
            console.log(globalForms)

            // for (let activityIndex = 0; activityIndex < activity.length; activityIndex++) {
            //     const elementActivity = activity[activityIndex]; //each activity
            //     console.log(elementActivity);
            //     var approved = "Pending";
            //     if (elementActivity.approval) {
            //         approved = "Approved"
            //     }
            //     document.getElementById("submittedFormsTable").innerHTML += `<tr onclick="viewForm('${activityIndexInGlobal}')"><td>` + elementActivity.activityName + `</td><td>` + elementActivity.date + `</td><td>` + elementActivity.description + `</td><td class='${approved.toLowerCase()}'>` + approved + `</td></tr>`;

            // }

        }
    })
        .catch(error => {
            console.log("error" + error);
        });
}

async function viewForm(activityThisIndex) {



    // var selectedActivity = activityThis;
    // console.log(selectedActivity);
    console.log(globalForms);
    const request = await fetch(`/user/email`);
    const respone = await (request.json());

    const element = globalForms[activityThisIndex];

    // globalForms.forEach(element => {
        // element.forEach(element => {

            // if (element.activityName == selectedActivity) {
                console.log(element);
                displayForm(element);
                
    
                if ( respone.isAdmin == false) {
                    document.getElementById("approveBtn").style.display = "none";
                }
                else if(element.approval == "true"){
                    document.getElementById("approveBtn").setAttribute("disabled", "disabled")
                }
            // }
        // })
    // });



    loadRisksContent(); //invoke the method in helper.js 

    

}

function displayForm(formData) {
    var activity = formData.activityName;
    var date = formData.date;
    var description = formData.description;
    var risksArray = formData.risks;
    //reset

    document.getElementById("activity").value = activity;
    document.getElementById("formDate").value = date;
    document.getElementById("formDescription").innerHTML = description;

    document.getElementById("p-activity").innerHTML = activity;
    document.getElementById("p-date").innerHTML = date;
    document.getElementById("p-description").innerHTML = description;

    risksArray.forEach(element => {
        console.log(element.riskName);
        const newRow = ' <tr ><td><label type="text">' + element.riskName + '</td>' + '<td><label type="text">' + element.casualties + '</td>' + '<td><label type="text">' + element.probability + '</td>' + '<td><label type="text">' + element.severity + '</td>' + '<td><label type="text">' + element.riskLevel + '</td>' + '<td><label type="text">' + element.controlMeasure + '</td></tr>'
        document.getElementById("table-risk-body").innerHTML += newRow;

    });

    document.getElementById("formDisplayBody").style = "display:block";
    document.getElementById("submittedForms").style = "display:none";
    
}

function backToList() {
    // document.getElementById("formDisplayBody").style = "display:none";
    // document.getElementById("submittedForms").style = "display:block";
    location.reload();
    //resetForm();

}

async function approveForm() {
    var formName = document.getElementById('activity').value;
    var request = await fetch(`/forms/approve/${formName}`, { method: "POST" })
    var response = await request.json()
    console.log(response);
    if (response.message == "Successful") {
        window.alert("Approved");
        document.getElementById("approveBtn").setAttribute("disabled", "disabled")
    }
}

window.onload = () => createHeader(getAllHistoryForms,"history")