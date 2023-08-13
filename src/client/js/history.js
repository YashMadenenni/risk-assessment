
//global value that stores all forms 
var globalForms = [];


//Function to check for any URL params, if its redirected from report.html page there is id of the selected form in url
async function checkForUrlParams() {
  const currentURL = window.location.href;

  const urlSearchParams = new URLSearchParams(window.location.search);

  if (urlSearchParams && urlSearchParams.has("userEmail") && urlSearchParams.has("formID")) {
    const userEmail = urlSearchParams.get("userEmail");
    const formID = urlSearchParams.get("formID");

    var request = await fetch(`/forms/${userEmail}/${formID}`);
    var response = await request.json();
    console.log(response);
    var formDetails = response.activity[0].activity[0];
    //var userEmail = response.activity[0].activity[0]._id;
    console.log(formDetails)
    displayForm(formDetails,userEmail);
  }

  getAllHistoryForms();

   
  
}

//Function to get all the submitted forms
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

      activity.forEach(element => {
        globalForms.push(element);

        const activityIndexInGlobal = globalForms.indexOf(element);
        const elementActivity = element;
        var approved = "Pending";
        if (elementActivity.approval == "yes") {
          approved = "Approved"
        }else if (elementActivity.approval == "no") {
          approved = "Rejected"
        }
        document.getElementById("submittedFormsTable").innerHTML += `<tr onclick="viewForm('${activityIndexInGlobal}','${userEmail}')"><td  class="col-3">` + elementActivity.activityName + `</td><td  class="col-2">` + elementActivity.date + `</td><td  class="col-2">` + userEmail + `</td><td class='${approved.toLowerCase()}  col-1'>` + approved + `</td><td  class="col-4">` + elementActivity.description + `</td></tr>`;
      })




      console.log(activity);
      console.log(globalForms)


    }
  })
    .catch(error => {
      console.log("error" + error);
    });
}


//Function to view selected from from table
async function viewForm(activityThisIndex, userName) {

  var elementBody = document.getElementsByTagName("body")[0];
  elementBody.classList.toggle("bg-black");


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
  displayForm(element, userName);


  if (respone.isAdmin == false) {
    document.getElementById("approveBtn").style.display = "none";
    document.getElementById("rejectBtn").style.display = "none";
  }
  else if (element.approval == "yes") {
    document.getElementById("approveBtn").setAttribute("disabled", "disabled")
  }
  else if (element.approval == "no") {
    document.getElementById("rejectBtn").setAttribute("disabled", "disabled")
  }



}


//Helper method to display form
function displayForm(formData, userName) {
  var activity = formData.activityName;
  var date = formData.date;
  var description = formData.description;
  var risksArray = formData.risks;
  var formID = formData.id;

  //reset

  document.getElementById("activity").value = activity;
  document.getElementById("formDate").value = date;
  document.getElementById("formDescription").innerHTML = description;

  document.getElementById("p-activity").innerHTML = activity;
  document.getElementById("p-date").innerHTML = date;
  document.getElementById("p-description").innerHTML = description;
  document.getElementById("author").value = userName;
  document.getElementById("formID").innerHTML = formID;


  risksArray.forEach(element => {
    console.log(element.riskName);
    const newRow = ' <tr ><td><label type="text">' + element.riskName + '</td>' + '<td><label type="text">' + element.casualties + '</td>' + '<td><label type="text">' + element.probability + '</td>' + '<td><label type="text">' + element.severity + '</td>' + '<td><label type="text">' + element.riskLevel + '</td>' + '<td><label type="text">' + element.controlMeasure + '</td></tr>'
    document.getElementById("table-risk-body").innerHTML += newRow;

  });

  document.getElementById("formDisplayBody").style = "display:block";
  document.getElementById("submittedForms").style = "display:none";

}



function backToList() {

  location.reload();


}

//Function to send useTamplete request to server - redirects to home page with params
async function useTemplate() {
  var formID = document.getElementById('formID').innerHTML;
  var userEmail = document.getElementById("author").value;

  var request = await fetch(`/forms/template/${formID}/${userEmail}`);
  if(request.redirected){
    window.location.href = request.url;
  }
}

//Function to send fetch request to approve form
async function approveForm(value) {
  var formID = document.getElementById('formID').innerHTML;
  var userEmail = document.getElementById("author").value;
  var formValue = value;

  var request = await fetch(`/forms/approve`, {
    method: "POST", body: JSON.stringify({
      formID: formID,
      userEmail: userEmail,
      formValue: formValue
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
  var response = await request.json()
  console.log(response);
  if (response.message == "yes") {
    window.alert("Approved");
    document.getElementById("approveBtn").setAttribute("disabled", "disabled")
    document.getElementById("rejectBtn").removeAttribute("disabled", "disabled")
  }else if (response.message == "no") {
    window.alert("Rejected");
    document.getElementById("rejectBtn").setAttribute("disabled", "disabled")
    document.getElementById("approveBtn").removeAttribute("disabled", "disabled")
  }
}

//Code form: w3schools. (n.d.). How To Sort a Table. W3Schools. https://www.w3schools.com/howto/howto_js_sort_table.asp
//Function to sort the table 
function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("tableSubmitted");
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

//function for search suggestion
$(document).ready(function () {
  $("#myInput").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#submittedFormsTable tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});

window.onload = () => createHeader(checkForUrlParams, "history")