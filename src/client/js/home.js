window.onload = async function () {

    // const request = await fetch(`/user/email`, { method: "GET", });
    // const respone = await (request.json());
    // console.log(respone);

    // Risks fetch request for filling suggestions
    const risksRequest = await fetch('/risks/all', { method: "GET" });
    const responseRisks = await (risksRequest.json());
    console.log(responseRisks);

    responseRisks.forEach(element => {
        console.log(element.riskname);
        const newRow = ' <tr ><td><label type="text">' + element.riskname + '</td>' + '<td><label type="text">' + element.risks + '</td>' + '<td><label type="text">' + element.probability + '</td>' + '<td><label type="text">' + element.severity + '</td>' + '<td><label type="text">' + element.riskLevel + '</td>' + '<td><label type="text"></td>' + '<td><button class="btn btn-outline-success sug-add" onclick="addRowToMain(this)">Add</button></td></tr>'
        document.getElementById("suggestions").innerHTML += newRow;

    });
}

// Add event listeners to the add function

function addRowToMain(thisButton) {
    var thisRow = thisButton.parentNode.parentNode;
    console.log(thisRow)
    var newRow = createNewRow(thisRow);

    // add new button for remove row
    var dataCell = document.createElement('td');
    dataCell.innerHTML += '<button class="btn btn-danger" onclick="deleteRowFromMain(this)"> X </button>'
    newRow.appendChild(dataCell);

    // append the new row to main table
    document.getElementById("table-risk-body").appendChild(newRow);
    // console.log(rowData);

    // delete row from current table
    document.getElementById("suggestions").deleteRow(thisRow);
}

function deleteRowFromMain(thisButton) {
    var currentRow = thisButton.parentNode.parentNode;
    var newRow = createNewRow(currentRow);


    // add new button for remove row
    var dataCell = document.createElement('td');
    dataCell.innerHTML += '<button class="btn btn-outline-success" onclick="addRowToMain(this)"> Add </button>'
    newRow.appendChild(dataCell);

    if (thisButton.id != "custom") {
        // append the new row to main table
        document.getElementById("suggestions").appendChild(newRow);
        // console.log(rowData);
    }

    // delete row from current table
    document.getElementById("table-risk-body").deleteRow(currentRow);
}



//helper method to create new row
function createNewRow(thisRow) {
    // console.log(thisRow);

    var rowData = []; // to collect all data cell
    var cells = thisRow.getElementsByTagName('td');
    //console.log(cells)
    for (var j = 0; j < cells.length; j++) {
        rowData.push(cells[j].innerText);
    }


    var newRow = document.createElement('tr');
    // create new element row

    // append all values of array
    for (let index = 0; index < rowData.length - 1; index++) {
        const element = rowData[index];
        var dataCell = document.createElement('td');
        dataCell.innerHTML = '<label type="text">' + element;
        newRow.appendChild(dataCell);
    }

    return newRow;
}


//function to add additional text field for casualties and control measures.
function addTextField(type) {
    var newTextfield;

    if (type === "casual") {
        newTextfield = document.createElement("input");

    }
    else {
        newTextfield = document.createElement("textarea");
    }
    newTextfield.className = "form-control me-2";
    newTextfield.type = "text";
    newTextfield.style = "margin-top:4px; margin-right";

    // var buttonRemove = document.createElement("button");
    // buttonRemove.innerHTML ="-";
    // buttonRemove.type="button"
    // buttonRemove.className ="btn btn-info rounded-5"
    // buttonRemove.onclick = removeTextField(this);



    var newDiv = document.createElement('div');
    newDiv.appendChild(newTextfield);
    // newDiv.appendChild(buttonRemove);
    newDiv.innerHTML += '<button class="btn btn-info rounded-5" onclick="removeTextField(this)"> - </button>'
    newDiv.className = "d-flex";



    //Check if the column is casual or control measures
    if (type === "casual") {
        var currentNode = document.getElementById("casual");
        currentNode.append(newDiv);

    }
    else {
        var currentNode = document.getElementById("cntrlMeasures");
        currentNode.append(newDiv);
    }
}

//Function to remove the text field
function removeTextField(thisTextField) {
    var parentDiv = thisTextField.parentNode;
    parentDiv.remove();
}

//function to add custom row
function addCustomRow(addButton) {
    var row = addButton.parentNode.parentNode;

    // Get the values from the input fields
    var riskName = row.querySelector('input[type="text"]').value;

    var possibleCasualties = [];
    var casualtiesInputs = row.querySelector('#casual').querySelectorAll('input');
    for (var i = 0; i < casualtiesInputs.length; i++) {
        possibleCasualties.push(casualtiesInputs[i].value);
    }

    var probability = row.querySelector('#occurance').value;
    var severity = row.querySelector('#severity').value;
    var riskLevel = row.querySelector('#riskLevel').value;

    var controlMeasures = [];
    var controlMeasuresTextareas = row.querySelector('#cntrlMeasures').querySelectorAll('textarea');
    for (var j = 0; j < controlMeasuresTextareas.length; j++) {
        controlMeasures.push(controlMeasuresTextareas[j].value);
    }
    // Create a new row in the other table with the collected data
    var newRow = document.createElement('tr');
    newRow.innerHTML =
        '<td>' + riskName + '</td>' +
        '<td>' + possibleCasualties.join(', ') + '</td>' +
        '<td>' + probability + '</td>' +
        '<td>' + severity + '</td>' +
        '<td>' + riskLevel + '</td>' +
        '<td>' + controlMeasures.join(', ') + '</td>' +
        '<td><button class="btn btn-danger " onclick="deleteRowFromMain(this)" id="custom"> X </button></td>';
    //   var newRow = createNewRow(tableRow);
    // append the new row to main table
    document.getElementById("table-risk-body").appendChild(newRow);
}

//function to submit form 
function submitForm(button) {

    //get user 
    var currentUrl = window.location.href;

    //get query string from URL 
    var queryString = currentUrl.split('?')[1];
    var params = new URLSearchParams(queryString);
    var userEmail = params.get("user");

    console.log(userEmail);

    var activityName = document.getElementById("activity").value;
    var date = document.getElementById("formDate").value;
    var description = document.getElementById("formDescription").value;

    //get table values
    var table = document.getElementById("table-risk");
    var tbody = table.getElementsByTagName("tbody")[0];
    var rows = tbody.getElementsByTagName("tr");
    var riskData = [];

    for (let index = 0; index < rows.length; index++) {
        const elementrow = rows[index];
        var riskName = elementrow.cells[0].querySelector('label').innerHTML;
        var casualties = elementrow.cells[1].querySelector('label').innerHTML;
        var probability = elementrow.cells[2].querySelector('label').innerHTML;
        var severity = elementrow.cells[3].querySelector('label').innerHTML;
        var riskLevel = elementrow.cells[4].querySelector('label').innerHTML;
        var controlMeasure = elementrow.cells[5].querySelector('label').innerHTML;


        var risk = {
            riskName: riskName,
            casualties: casualties,
            probability: probability,
            severity: severity,
            riskLevel: riskLevel,
            controlMeasure: controlMeasure
        }

        riskData.push(risk);
    }

    var formData = {
        userEmail:userEmail,
        activity: activityName,
        date: date,
        description: description,
        risks: riskData
    }

    console.log(formData);

    if (button == 'submit') {
        //POST submit Request 
    fetch("/forms/submit",{
        method:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        body:JSON.stringify(formData)
    }).then(response => {
        if (response.ok) {
            window.alert("Submitted Successfully");
        } else {
            window.alert("Error Submitting");
        }
    }).catch(error=>{
        console.log("Error in sending request",error);
    });
    }else{
        //POST save Request 
    fetch("/forms/save",{
        method:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        body:JSON.stringify(formData)
    }).then(response => {
        if (response.ok) {
            window.alert("Saved Successfully");
        } else {
            window.alert("Error Saving");
        }
    }).catch(error=>{
        console.log("Error in request",error);
    });
    }
}