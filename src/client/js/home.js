//function to call create header function
// callbackfunction in header.js
window.onload = () => createHeader(checkForUrlParams) 


//function to check if home page was redirected with params
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
    displayForm(formDetails);
  }

  getRisksSuggestion();

   //loadChatGPT();
  
}


//Function to display form
function displayForm(formData) {
  var activity = formData.activityName;
  var date = formData.date;
  var description = formData.description;
  var risksArray = formData.risks;
  var activityIndexInServer = formData.id
  //reset

  document.getElementById("activity").value = activity;
  document.getElementById("formDate").value = date;
  document.getElementById("formDescription").innerHTML = description;


  risksArray.forEach(element => {
    console.log(element.controlMeasure);

    const newRow = ' <tr ><td><label type="text">' + element.riskName + '</td>' + '<td><label type="text">' + element.casualties + '</td>' + '<td><label type="text">' + element.probability + '</td>' + '<td><label type="text">' + element.severity + '</td>' + '<td><label type="text">' + element.riskLevel + '</td>' + '<td><label type="text">' + element.controlMeasure + '</td><td><button class="btn  " onclick="deleteRowFromMain(this)" id="custom">  <i class="fa-solid fa-trash-can" style="color: #ff1f0f;"></i>  </button>' +
      '<button class="btn  my-3" onclick="editRowInMain(this)" id="custom"> <i class="fa-solid fa-pen-to-square"></i> </button>'
    '</td></tr>'
    document.getElementById("table-risk-body").innerHTML += newRow;

  });
}