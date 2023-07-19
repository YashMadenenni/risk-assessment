
//global value that stores all forms 
var globalForms = [];

async function getAllHistoryForms() {
      

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
            var userEmail = element._id;
             
            activity.forEach(element=>{
                globalForms.push(element);

                const activityIndexInGlobal = globalForms.indexOf(element);
                const elementActivity = element;
                var approved = "Pending";
                if (elementActivity.approval) {
                    approved = "Approved"
                }
                document.getElementById("submittedFormsTable").innerHTML += `<tr onclick="viewForm('${activityIndexInGlobal}','${userEmail}')"><td  class="col-3">` + elementActivity.activityName + `</td><td  class="col-3">` + elementActivity.date + `</td><td  class="col-4">` + elementActivity.description + `</td><td class='${approved.toLowerCase()}  col-2'>` + approved + `</td></tr>`;
            })
            
            
            

            console.log(activity);
            console.log(globalForms)

           
        }
    })
        .catch(error => {
            console.log("error" + error);
        });
}

async function viewForm(activityThisIndex,userName) {



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
                displayForm(element,userName);
                
    
                if ( respone.isAdmin == false) {
                    document.getElementById("approveBtn").style.display = "none";
                }
                else if(element.approval == "true"){
                    document.getElementById("approveBtn").setAttribute("disabled", "disabled")
                }
            // }
        // })
    // });



    //    loadRisksContent(); //invoke the method in helper.js 
//getRisksSuggestion(); //invoke suggestions in home.js
    

}

function displayForm(formData,userName) {
    var activity = formData.activityName;
    var date = formData.date;
    var description = formData.description;
    var risksArray = formData.risks;
    //reset

    document.getElementById("activity").value = activity;
    document.getElementById("formDate").value = date;
    document.getElementById("formDescription").innerHTML = description;
    document.getElementById("author").innerHTML = userName;

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
    var userEmail =  document.getElementById("author").innerHTML;

    var request = await fetch(`/forms/approve`, { method: "POST", body: JSON.stringify({
        formName:formName,
        userEmail:userEmail
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }})
    var response = await request.json()
    console.log(response);
    if (response.message == "Successful") {
        window.alert("Approved");
        document.getElementById("approveBtn").setAttribute("disabled", "disabled")
    }
}

window.onload = () => createHeader(getAllHistoryForms,"history")