
//global value that stores all forms 
var globalForms=[];

// window.onload = 


async function getSavedForms() {
    globalForms=[]
    document.getElementById("savedFormsTable").innerHTML=""
    // const request = await fetch(`/user/email`);
    // const respone = await (request.json());
    // console.log("Email ", respone.userEmail);
    // document.getElementById("userEmail").innerHTML += respone.userEmail;

    fetch(`/forms/saved/`, { method: 'GET' }).then(response => {
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

           

            //console.log(activity);

            for (let activityIndex = 0; activityIndex < activity.length; activityIndex++) {
                const elementActivity = activity[activityIndex]; //each activity
                globalForms.push(elementActivity);
                console.log(elementActivity);
                //${elementActivity.activityName}
                document.getElementById("savedFormsTable").innerHTML += `<tr ><td  class="col-3" onclick="viewForm('${activityIndex}')">`+elementActivity.activityName+`</td><td  class="col-3" onclick="viewForm('${activityIndex}')">`+elementActivity.date+`</td><td  class="col-5" onclick="viewForm('${activityIndex}')">`+elementActivity.description+`</td><td class="col-1"><button class="btn btn-light" onclick="deleteForm('${elementActivity.id}')"><i class="fa-solid fa-trash-can" style="color: #ff1f0f;"></i></button></td></tr>`;
                
            }

        }
    })
        .catch(error => {
            console.log("error" + error);
        });
}

function viewForm(activityIndex) {

    var activityThis = globalForms[activityIndex];

    var selectedActivity = activityThis;
    console.log(selectedActivity);
    console.log(globalForms);

    var element = document.getElementsByTagName("body")[0];
  element.classList.toggle("bg-black");
//    globalForms.forEach(element =>{
//     element.forEach(element =>{
        
//     if(element.activityName == selectedActivity){
//         console.log(element);
//         displayForm(element);
//     }
//     })
//    });
displayForm(selectedActivity)

//    loadRisksContent(); //invoke the method in helper.js 
getRisksSuggestion(); //invoke suggestions in home.js

}

function displayForm(formData){
    var activity = formData.activityName;
    var date = formData.date;
    var description = formData.description;
    var risksArray = formData.risks;
    var activityIndexInServer = formData.id
    //reset

    document.getElementById("activity").value = activity;
    document.getElementById("formDate").value = date;
    document.getElementById("formDescription").innerHTML = description;
    document.getElementById("activityIndexInServer").innerHTML = activityIndexInServer;
    
    risksArray.forEach(element => {
        console.log(element.controlMeasure);
        
        const newRow = ' <tr ><td><label type="text">' + element.riskName + '</td>' + '<td><label type="text">' + element.casualties + '</td>' + '<td><label type="text">' + element.probability + '</td>' + '<td><label type="text">' + element.severity + '</td>' + '<td><label type="text">' + element.riskLevel + '</td>' + '<td><label type="text">'+element.controlMeasure+'</td><td><button class="btn  " onclick="deleteRowFromMain(this)" id="custom"> <i class="fa-solid fa-trash-can" style="color: #ff1f0f;"></i> </button>'+
        '<button class="btn  my-3" onclick="editRowInMain(this)" id="custom"> <i class="fa-solid fa-pen-to-square"></i> </button>'
        '</td></tr>'
        document.getElementById("table-risk-body").innerHTML += newRow;

    });

    document.getElementById("formDisplayBody").style = "display:block";
    document.getElementById("savedForms").style = "display:none";
}

async function deleteForm(activityIndex) {
    var request = await fetch(`forms/remove/${activityIndex}`,{method:"DELETE"})
    if(request.ok){
        getSavedForms()
    }
}

function backToList() {

location.reload()


}

window.onload = () => createHeader(getSavedForms,"saved");