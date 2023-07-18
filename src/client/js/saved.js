
//global value that stores all forms 
var globalForms=[];

// window.onload = 


async function getSavedForms() {
    
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

            globalForms.push(activity);

            //console.log(activity);

            for (let activityIndex = 0; activityIndex < activity.length; activityIndex++) {
                const elementActivity = activity[activityIndex]; //each activity
                console.log(elementActivity);

                document.getElementById("savedFormsTable").innerHTML += `<tr onclick="viewForm('${elementActivity.activityName}')"><td  class="col-3">`+elementActivity.activityName+`</td><td  class="col-3">`+elementActivity.date+`</td><td  class="col-6">`+elementActivity.description+`</td></tr>`;
                
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
   });

   loadRisksContent(); //invoke the method in helper.js 

}

function displayForm(formData){
    var activity = formData.activityName;
    var date = formData.date;
    var description = formData.description;
    var risksArray = formData.risks;
    //reset

    document.getElementById("activity").value = activity;
    document.getElementById("formDate").value = date;
    document.getElementById("formDescription").innerHTML = description;
    
    risksArray.forEach(element => {
        console.log(element.controlMeasure);
        
        const newRow = ' <tr ><td><label type="text">' + element.riskName + '</td>' + '<td><label type="text">' + element.casualties + '</td>' + '<td><label type="text">' + element.probability + '</td>' + '<td><label type="text">' + element.severity + '</td>' + '<td><label type="text">' + element.riskLevel + '</td>' + '<td><label type="text">'+element.controlMeasure+'</td><td><button class="btn btn-danger " onclick="deleteRowFromMain(this)" id="custom"> X </button>'+
        '<button class="btn btn-info my-3" onclick="editRowInMain(this)" id="custom"> Edit </button>'
        '</td></tr>'
        document.getElementById("table-risk-body").innerHTML += newRow;

    });

    document.getElementById("formDisplayBody").style = "display:block";
    document.getElementById("savedForms").style = "display:none";
}

function backToList() {
    // document.getElementById("formDisplayBody").style = "display:none";
    // document.getElementById("savedForms").style = "display:block";
location.reload()
    //resetForm();

}

// function resetForm() {
//     document.getElementById("suggestions").innerHTML = "";
//     document.getElementById("selectRiskName").innerHTML = '<option value="all">All</option>';


//     document.getElementById('table-risk-body').innerHTML = '<tr id="customRow" > '+
//     '<td><input type="text" class="form-control" id="customRiskName"></td>'+
//     '<td class="d-flex flex-column" id="casual">'+
//         '<div class="d-flex flex-row">'+
//          '   <input type="text" class="form-control" id="customRiskHazards">'+
//         '<button class="btn btn-info mx-1 rounded-5" onclick="addTextField("casual")">+</button>'+
//         '</div>'+
//     '</td>'+
//     '<td><select class="form-select" id="occurance">'+
//             '<option>1</option>'+
//             '<option>2</option>'+
//             '<option>3</option>'+

//         '</select></td>'+
//     '<td><select class="form-select" id="severity">'+
//             '<option>1</option>'+
//             '<option>2</option>'+
//             '<option>3</option>'+

//         '</select></td>'+
//     '<td><select class="form-select" id="riskLevel">'+
//             '<option>1</option>'+
//             '<option>2</option>'+
//             '<option>3</option>'+

//         '</select></td>'+
//     '<td class="d-flex flex-column" id="cntrlMeasures">'+
//     '<div class="d-flex">'+
//         '<textarea type="text" class="form-control overflow-auto" id="customControlMeasures"></textarea>'+
//         '<button class="btn btn-info rounded-5 mx-1" onclick="addTextField()">+</button>'+
//     '</div>    '+
//     '</td>'+

//         '<td>'+
//             '<button class="btn btn-outline-success" onclick="addCustomRow(this)">Add</button>'+
//         '</td>'+
// '</tr>'

// }

window.onload = () => createHeader(getSavedForms,"saved");