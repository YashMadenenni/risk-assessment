window.onload = () => createHeader(getRiskCustom, "addRisk")

function getRiskCustom() {
    getRisksSuggestions("editRisk")
}

//Function to get all risks for suggestions table 
async function getRisksSuggestions(caller) {

    // Risks fetch request for filling suggestions
    const risksRequest = await fetch('/risks/all', { method: "GET" });
    const responseRisks = await (risksRequest.json());
    console.log(responseRisks);
    getAllRisksNew(responseRisks, caller) //helper method to get all pre filled risks


}

//Funtion to display all risks 
//@Param caller checks if the function is called from displaySuggestion to prevent redisplay of dropdown options
async function getAllRisksNew(responseRisks, caller) {

    responseRisks.forEach(element => {
        console.log(element.riskname);
        var newRow;
        if(caller!= "deleteRisk"){
            newRow = ' <tr ><td><label type="text">' + element.riskname + '</td>' + '<td><label type="text">' + element.risks + '</td>' + '<td><label type="text">' + element.probability + '</td>' + '<td><label type="text">' + element.severity + '</td>' + '<td><label type="text">' + element.riskLevel + '</td>' + '<td><label type="text" id="' + element.riskname + '"></td>' + '<td><button class="btn btn-warning text-white sug-add" onclick="select(this,'+element._id+')" data-bs-toggle="modal" data-bs-target="#myModal">Select</button></td></tr>'

        }else{
            newRow = ' <tr ><td><label type="text">' + element.riskname + '</td>' + '<td><label type="text">' + element.risks + '</td>' + '<td><label type="text">' + element.probability + '</td>' + '<td><label type="text">' + element.severity + '</td>' + '<td><label type="text">' + element.riskLevel + '</td>' + '<td><label type="text" id="' + element.riskname + '"></td>' + '<td><button class="btn  sug-add" onclick="deleteRisk(this,'+element._id+')" ><i class="fa-solid fa-trash fa-l" style="color: #ec4b22;"></i></button></td></tr>'

        }
       


        document.getElementById("suggestions").innerHTML += newRow;

        //append control measures 
        var controlList = document.createElement('ul')
        var controlListArray = element.precautions;
        controlListArray.forEach(controlMeasure => {
            var ul = document.createElement('li');
            ul.innerHTML = controlMeasure;
            controlList.append(ul);
        })
        var controlListCell = document.getElementById(element.riskname);
        controlListCell.appendChild(controlList);

    });
}

 function getAllRiskValues() {
    var riskName = document.getElementById("addRiskName").value
    var probability = document.getElementById("addOccurance").value
    // var riskName = document.getElementById("addRiskName").innerHTML
    var severity = document.getElementById("addSeverity").value
    var riskLevel = document.getElementById("addRiskLevel").value

    var possibleCasualties = [];
    var casualtiesInputs = document.querySelector('#addRisk').querySelectorAll('input');
    for (var i = 0; i < casualtiesInputs.length; i++) {
        possibleCasualties.push(casualtiesInputs[i].value);
    }

    var controlMeasures = [];
    var controlMeasuresTextareas = document.querySelector('#cntrlMeasures').querySelectorAll('textarea');
    for (var j = 0; j < controlMeasuresTextareas.length; j++) {
        controlMeasures.push(controlMeasuresTextareas[j].value);
    }

    var risk = {
        riskName: riskName,
        casualties: possibleCasualties,
        probability: probability,
        severity: severity,
        riskLevel: riskLevel,
        controlMeasure: controlMeasures
    }

    return risk;

}



async function addRisk() {

    var riskData = [];

    var risk = getAllRiskValues() //get all risk values
    riskData.push(risk);


    var formData = {
        risksArray: riskData
    }

    console.log(formData);

    var request = await fetch('/risks/addRisk', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }, body: JSON.stringify(formData)
    });
    var response = await request.json();

    if (request.ok) {
        window.alert(response.message);
        location.reload();
    } else {
        window.alert(response.message);
    }

}

async function editRisk() {
    var id = document.getElementById("riskIDEdit").innerHTML; //get the risk id
    var risk = getAllRiskValues() //get all risk values
    risk.id = parseInt(id); // add the risk id to risk object 

    var request = await fetch('/risks/editRisk', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }, body: JSON.stringify(risk)
    });
    var response = await request.json();

    if (request.ok) {
        window.alert(response.message);
        location.reload();
    } else {
        window.alert(response.message);
    }


}

async function deleteRisk(currentRow,Id) {
   

    var request = await fetch(`/risks/delete/${Id}`, {
        method: "DELETE"});
    var response = await request.json();

    if (request.ok) {
        window.alert(response.message);
        location.reload();
    } else {
        window.alert(response.message);
    }
    
}
 
//funtion to get seleted risk details and add to edit placeholders in modal
function select(thisButton,id) {

    var currentRow = thisButton.parentNode.parentNode;

    document.getElementById("riskIDEdit").innerHTML = id; //set the risk id 

    // console.log(currentRow);
    var rowData = [];
    var rowCells = currentRow.getElementsByTagName('td');
    for (var j = 0; j < rowCells.length; j++) {
        rowData.push(rowCells[j].innerText);
    }

    var controlMeasures = [];
    var controlMeasuresTextareas = rowCells[5].querySelector('label').querySelector('ul').querySelectorAll('li');
    document.getElementById("addControlMeasures").value = controlMeasuresTextareas[0].innerHTML // put the first value to exsisting textarea
    for (var j = 1; j < controlMeasuresTextareas.length; j++) {
       
        controlMeasures.push(controlMeasuresTextareas[j].innerHTML);


        //add new text feild
        var newTextfield = document.createElement("textarea");
        newTextfield.className = "form-control me-2";
        newTextfield.type = "text";
        newTextfield.style = "margin-top:4px; margin-right";
        newTextfield.cols="40";
        newTextfield.innerHTML = controlMeasuresTextareas[j].innerHTML //append the value 

        var newDiv = document.createElement('div');
        newDiv.appendChild(newTextfield);
        // newDiv.appendChild(buttonRemove);
        newDiv.innerHTML += '<button class="btn  rounded-5" onclick="removeTextField(this)"> <i class="fa-solid fa-trash-can" style="color: #ff1f0f;"></i> </button>'
        newDiv.className = "d-flex";

        var currentNode = document.getElementById("cntrlMeasures");

        currentNode.append(newDiv);

    }

     //set values to custom row in main
     document.getElementById("addRiskName").value = rowData[0]
     document.getElementById("addRiskHazards").value = rowData[1]
     document.getElementById("addOccurance").value = rowData[2]
     document.getElementById("addSeverity").value = rowData[3]
     document.getElementById("addRiskLevel").value = rowData[4]
     
    
}


function addRiskBody() {
    // resetModal()
    document.getElementById("addRiskButton").style.display = "block"
    document.getElementById("editRiskBody").style.display = "none"
    document.getElementById("editRiskButton").style.display = "none"
    document.getElementById("modalTitle").innerHTML = "Add Risk"
}

function editRiskBody() {
    // resetModal()
    
    document.getElementById("suggestions").innerHTML =""
    getRiskCustom()
     document.getElementById("addRiskButton").style.display = "none"
    document.getElementById("editRiskBody").style.display = "block"
    document.getElementById("editRiskButton").style.display = "block"
    document.getElementById("modalTitle").innerHTML = "Edit Risk"
    
}

function removeRiskBody() {
   
    document.getElementById("suggestions").innerHTML =""
         getRisksSuggestions("deleteRisk");
    document.getElementById("editRiskBody").style.display = "block"
    document.getElementById("modalTitle").innerHTML = "Delete Risk"

}

