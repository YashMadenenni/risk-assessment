//Function to perform Chat GPT interactions
async function loadChatGPT() {

    const OPENAI_API_KEY = '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';

    var userQuestion = document.getElementById("askPromt").value;

    console.log(userQuestion);

    document.getElementById("aiResponse").innerHTML = '<span class="spinner-border spinner-border-sm"></span>Loading..'


    const data = {
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: userQuestion }
        ]
    };

    const headers = {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
    };

    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    };



    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', requestOptions);
        const result = await response.json();
        console.log(result.choices[0].message);

        var answerAI = result.choices[0].message.content;
        document.getElementById("aiResponse").style.height = "300px";
        document.getElementById("aiResponse").innerHTML = '<pre>' + answerAI + '</pre>';

    } catch (error) {
        console.error('Error:', error);
    }
}


//Function to get all risks for suggestions table 
async function getRisksSuggestion(caller) {

    // Risks fetch request for filling suggestions
    const risksRequest = await fetch('/risks/all', { method: "GET" });
    const responseRisks = await (risksRequest.json());
    console.log(responseRisks);
    getAllRisks(responseRisks, caller) //helper method to get all pre filled risks


}

//Funtion to display all risks 
//@Param caller checks if the function is called from displaySuggestion to prevent redisplay of dropdown options
function getAllRisks(responseRisks, caller) {

    responseRisks.forEach(element => {
        console.log(element.riskname);
        var newRow;

        newRow = ' <tr ><td><label type="text">' + element.riskname + '</td>' + '<td><label type="text">' + element.risks + '</td>' + '<td><label type="text">' + element.probability + '</td>' + '<td><label type="text">' + element.severity + '</td>' + '<td><label type="text">' + element.riskLevel + '</td>' + '<td><label type="text" id="' + element.riskname + '"></td>' + '<td><button class="btn btn-success sug-add" onclick="addRowToMain(this)">Select</button></td></tr>'



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

        //Suggestions append option
        // if (caller != "all") {
        //     const newOption = ' <option value="' + element.riskname + '" >' + element.riskname + '</option>';
        //     document.getElementById("selectRiskName").innerHTML += newOption;
        // }
    });
}

// Add event listeners to the add function

function addRowToMain(thisButton) {

    var thisRow = thisButton.parentNode.parentNode;
    console.log(thisRow)
    var newRow = createNewRow(thisRow);

    // add new button for remove row
    var dataCell = document.createElement('td');
    dataCell.innerHTML += '<button class="btn " onclick="deleteRowFromMain(this)"> <i class="fa-solid fa-trash-can" style="color: #ff1f0f;"></i> </button>'
    dataCell.innerHTML += '<button class="btn   my-3" onclick="editRowInMain(this)"> <i class="fa-solid fa-pen-to-square"></i> </button>'
    newRow.appendChild(dataCell);

    // append the new row to main table
    document.getElementById("table-risk-body").appendChild(newRow);
    // console.log(rowData);

    // delete row from current table
    // document.getElementById("suggestions").deleteRow(thisRow);

    // delete row from current table
    var tableBody = document.getElementById("suggestions");
    var rowIndex = thisRow.rowIndex;
    tableBody.deleteRow(rowIndex - 1);
}


//Function to edit row in main function
function editRowInMain(thisButton) {
    document.getElementById("cntrlMeasures").innerHTML = '<div class="d-flex">' +
        '<textarea type="text" class="form-control overflow-auto" id="customControlMeasures"></textarea>' +
        '<button class="btn  rounded-5 mx-1" onclick="addTextField()"><i class="fa-sharp fa-solid fa-plus"></i></button>' +
        '</div>';
    var currentRow = thisButton.parentNode.parentNode;
    console.log(currentRow);

    // delete row from current table
    var tableBody = document.getElementById("table-risk-body");
    var rowIndex = currentRow.rowIndex;
    tableBody.deleteRow(rowIndex - 1); // substract 1 because table rows starts from 0, whereas the rowIndex property returns the index starting from 1

    var rowData = [];
    var rowCells = currentRow.getElementsByTagName('td');
    for (var j = 0; j < rowCells.length; j++) {
        rowData.push(rowCells[j].innerText);
    }

    var controlMeasures = [];
    var controlMeasuresTextareas = rowCells[5].querySelector('label').querySelector('ul').querySelectorAll('li');
    document.getElementById("customControlMeasures").value = controlMeasuresTextareas[0].innerHTML // put the first value to exsisting textarea

    for (var j = 1; j < controlMeasuresTextareas.length; j++) {

        controlMeasures.push(controlMeasuresTextareas[j].innerHTML);


        //add new text feild
        var newTextfield = document.createElement("textarea");
        newTextfield.className = "form-control me-2";
        newTextfield.type = "text";
        newTextfield.style = "margin-top:4px; margin-right";
        newTextfield.innerHTML = controlMeasuresTextareas[j].innerHTML //append the value 

        var newDiv = document.createElement('div');
        newDiv.appendChild(newTextfield);
        // newDiv.appendChild(buttonRemove);
        newDiv.innerHTML += '<button class="btn  rounded-5" onclick="removeTextField(this)"> <i class="fa-solid fa-trash-can" style="color: #ff1f0f;"></i> </button>'
        newDiv.className = "d-flex";

        var currentNode = document.getElementById("cntrlMeasures");

        currentNode.append(newDiv);

    }

    console.log(controlMeasures)



    console.log(rowData);
    //set values to custom row in main
    document.getElementById("customRiskName").value = rowData[0]
    document.getElementById("customRiskHazards").value = rowData[1]
    document.getElementById("occurance").value = rowData[2]
    document.getElementById("severity").value = rowData[3]
    document.getElementById("riskLevel").value = rowData[4]

    // document.getElementById()


}


//Funtion to delete row from main risks table
function deleteRowFromMain(thisButton) {
    var currentRow = thisButton.parentNode.parentNode;
    console.log(currentRow);
    var newRow = createNewRow(currentRow);


    // add new button for remove row
    var dataCell = document.createElement('td');
    dataCell.innerHTML += '<button class="btn btn-success" onclick="addRowToMain(this)"> Select </button>'
    newRow.appendChild(dataCell);

    if (thisButton.id != "custom") {
        // append the new row to main table
        document.getElementById("suggestions").appendChild(newRow);
        // console.log(rowData);
    }

    // delete row from current table
    var tableBody = document.getElementById("table-risk-body");
    var rowIndex = currentRow.rowIndex;
    tableBody.deleteRow(rowIndex - 1); // substract 1 because table rows starts from 0, whereas the rowIndex property returns the index starting from 1
}



//helper method to create new row with selected row
function createNewRow(thisRow) {
    // console.log(thisRow);

    var rowData = []; // to collect all data cell
    var cells = thisRow.getElementsByTagName('td');
    //console.log(cells)
    for (var j = 0; j < cells.length; j++) {
        rowData.push(cells[j].innerHTML);
    }


    var newRow = document.createElement('tr');
    // create new element row

    // append all values of array
    for (let index = 0; index < rowData.length - 1; index++) {
        const element = rowData[index];
        var dataCell = document.createElement('td');
        dataCell.innerHTML += element;

        newRow.appendChild(dataCell);
    }

    return newRow;
}


//function to add additional text field for hazards/casualties and control measures.
function addTextField(type) {
    var newTextfield;

    if (type === "casual" || type === "addRisk") {
        newTextfield = document.createElement("input");

    }
    else {
        newTextfield = document.createElement("textarea");
    }
    newTextfield.className = "form-control me-2";
    newTextfield.type = "text";
    newTextfield.style = "margin-top:4px; margin-right";

    var newDiv = document.createElement('div');
    newDiv.appendChild(newTextfield);
    // newDiv.appendChild(buttonRemove);
    newDiv.innerHTML += '<button class="btn  rounded-5" onclick="removeTextField(this)"> <i class="fa-solid fa-trash-can" style="color: #ff1f0f;"></i> </button>'
    newDiv.className = "d-flex";

    //Check if the column is casual or control measures
    if (type === "casual") {
        var currentNode = document.getElementById("casual");
        currentNode.append(newDiv);

    } else if (type === "addRisk") {
        var currentNode = document.getElementById("addRisk");
        currentNode.append(newDiv);
    }
    else {
        var currentNode = document.getElementById("cntrlMeasures");
        currentNode.append(newDiv);
    }
}

//Function to remove the text field
function removeTextField(thisTextField) {
    var padeleteRowFromMainrentDiv = thisTextField.parentNode;
    padeleteRowFromMainrentDiv.remove();
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

    var controlMeasuresList = '';
    for (var j = 0; j < controlMeasuresTextareas.length; j++) {
        controlMeasuresList += '<li>' + controlMeasuresTextareas[j].value + '</li>';
    }


    // Create a new row in the other table with the collected data
    var newRow = document.createElement('tr');
    newRow.innerHTML =
        '<td><label>' + riskName + '</label></td>' +
        '<td><label>' + possibleCasualties.join(', ') + '</label></td>' +
        '<td><label>' + probability + '</label></td>' +
        '<td><label>' + severity + '</label></td>' +
        '<td><label>' + riskLevel + '</label></td>' +
        '<td><label><ul>' + controlMeasuresList + '</ul></label></td>' +
        '<td><button class="btn " onclick="deleteRowFromMain(this)" id="custom"> <i class="fa-solid fa-trash-can" style="color: #ff1f0f;"></i> </button>' +
        '<button class="btn  my-3" onclick="editRowInMain(this)" id="custom"> <i class="fa-solid fa-pen-to-square"></i> </button>'
    '</td>';
    //   var newRow = createNewRow(tableRow);
    // append the new row to main table
    document.getElementById("table-risk-body").appendChild(newRow);

    //Reset custom row
    document.getElementById("customRow").innerHTML = `<td><input type="text" class="form-control" id="customRiskName"></td>
    <td class="d-flex flex-column" id="casual">
        <div class="d-flex flex-row">
            <input type="text" class="form-control" id="customRiskHazards">
        <button class="btn  mx-1 rounded-5" onclick="addTextField('casual')"><i class="fa-sharp fa-solid fa-plus"></i></button>
        </div>
    </td>
    <td><select class="form-select" id="occurance">
            <option>1</option>
            <option>2</option>
            <option>3</option>

        </select></td>
    <td><select class="form-select" id="severity">
            <option>1</option>
            <option>2</option>
            <option>3</option>

        </select></td>
    <td><select class="form-select" id="riskLevel">
            <option>1</option>
            <option>2</option>
            <option>3</option>

        </select></td>
    <td class="d-flex flex-column" id="cntrlMeasures">
    <div class="d-flex">
        <textarea type="text" class="form-control overflow-auto" id="customControlMeasures"></textarea>
        <button class="btn  rounded-5 mx-1" onclick="addTextField()"><i class="fa-sharp fa-solid fa-plus"></i></button>
    </div>    
    </td>

        <td>
            <button class="btn btn-success" onclick="addCustomRow(this)">Add</button>
        </td>`
}

//function to submit form 
function submitForm(button, page) {

    var activityName = document.getElementById("activity").value;
    var date = document.getElementById("formDate").value;
    var description = document.getElementById("formDescription").value;

    //get table values
    var table = document.getElementById("table-risk");
    var tbody = table.getElementsByTagName("tbody")[0];
    var rows = tbody.getElementsByTagName("tr");
    var riskData = [];

    if (activityName != "") {
        if (date != "") {
            if (description != "") {
                if (rows.length > 1) {
                    for (let index = 1; index < rows.length; index++) {
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
                        //  userEmail: userEmail,
                        activity: activityName,
                        date: date,
                        description: description,
                        risks: riskData
                    }


                    if (page == "fromSavedSave") {
                        formData.formID = parseInt(document.getElementById("activityIndexInServer").innerHTML)
                    }

                    console.log(formData);

                    if (button == 'submit') {
                        //POST submit Request 
                        fetch("/forms/submit", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(formData)
                        }).then(response => {
                            if (response.ok) {
                                window.alert("Submitted Successfully");
                                location.reload();
                            } else {
                                window.alert("Error Submitting");
                            }
                        }).catch(error => {
                            console.log("Error in sending request", error);
                        });
                    } else {
                        //POST save Request 
                        fetch("/forms/save", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(formData)
                        }).then(response => {
                            // window.alert("Saved Response");
                            if (response.ok) {
                                window.alert("Saved Successfully");

                            } else {
                                window.alert("Error Saving");
                            }
                        }).catch(error => {
                            console.log("Error in request", error);
                        });
                    }
                } else {
                    window.alert("Enter atleast one Risk Managment")
                }
            } else {
                window.alert(" Enter Description")
            }
        } else {
            window.alert("Enter Date")
        }
    } else {
        window.alert("Enter Activity Name")
    }

}

// async function displaySuggestion(optionSelect) {
//     // Risks fetch request for  suggestions
//     const risksRequest = await fetch('/risks/all', { method: "GET" });
//     const responseRisks = await (risksRequest.json());

//     var rowsArray = responseRisks;
//     document.getElementById("suggestions").innerHTML = ""
//     if (optionSelect != "all") {


//         rowsArray.forEach(element => {

//             if (element.riskname == optionSelect) {
//                 console.log(element);
//                 const newRow = ' <tr ><td><label type="text">' + element.riskname + '</td>' + '<td><label type="text">' + element.risks + '</td>' + '<td><label type="text">' + element.probability + '</td>' + '<td><label type="text">' + element.severity + '</td>' + '<td><label type="text">' + element.riskLevel + '</td>' + '<td><label type="text" id=""></td>' + '<td><button class="btn btn-success sug-add" onclick="addRowToMain(this)">Add</button></td></tr>'
//                 document.getElementById("suggestions").innerHTML += newRow;
//                 //append control measures 
//                 var controlList = document.createElement('ul')
//                 var controlListArray = element.precautions;
//                 controlListArray.forEach(controlMeasure => {
//                     var ul = document.createElement('li');
//                     ul.innerHTML = controlMeasure;
//                     controlList.append(ul);
//                 })
//                 var controlListCell = document.getElementById(element.riskname);
//                 controlListCell.appendChild(controlList);
//             }

//         })
//     } else {
//         getAllRisks(responseRisks, "all");
//     }
// }


//function for search suggestion
$(document).ready(function () {
    $("#myInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#suggestionsTable tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});