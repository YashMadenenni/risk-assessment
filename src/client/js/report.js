window.onload = () => createHeader(previewImage, "report")

//Function to preview uploaded image
async function previewImage() {
    document.getElementById("incidentImage").addEventListener("change", () => {
        const fileInput = document.getElementById("incidentImage").files[0];

        const fileReader = new FileReader();

        fileReader.onload = () => {
            document.getElementById("preview").innerHTML = '<img class="preview" src=' + fileReader.result + '>'
        }
        fileReader.readAsDataURL(fileInput);
    });

    const request = await fetch(`/user/email`);
    const respone = await (request.json());

    if (respone.isAdmin) {
        document.getElementById("allReports").classList.remove("d-none");
        document.getElementById("reportForm").classList.add("d-none");

        getAllReports()
    }
}

//Function to send fetch request to get all reported incidents
async function getAllReports() {

    //document.getElementById("allIncidents").innerHTML=""

    const request = await fetch("/incident/report", { method: 'GET' });
    const response = await request.json();

    console.log(response)

    response.forEach(element => {
        var imageSRC = 'data:image/png;base64,' + element.incidentImage.data;
        var incidentName = element.incident;
        var activityName = element.activity;
        var incidentDate = element.incidentDate;
        var incidentDescription = element.incidentDescription;

        document.getElementById("allIncidents").innerHTML += `<div class="m-3 col-xs-3 col-sm-3 col-md-3 col-lg-3 card ">
        <div class="card-title text-center">
            <h5>${incidentName}</h5>
            <h5>${activityName}</h5>
            <h8>${incidentDate}</h8>
        </div>
        
            <img class="card-img-top " id="image" src="${imageSRC}" alt="">
            <div class="card-body">
      ${incidentDescription}
      </div>
        
        <div class="card-footer text-center">
        
        <!--<a class="btn" data-bs-toggle="collapse" href="#collapse${response.indexOf(element)}">
        Description
      </a>-->
      <button type="button" class="btn btn-warning text-white my-1" data-bs-toggle="modal" data-bs-target="#myModal" onclick="modalOpen('${activityName}')">
  Open Risk Assessmeent
</button>
    </div>
    <!-- <div id="collapse${response.indexOf(element)}" class="collapse " data-bs-parent="#accordion">-->
      
    
            
      <!-- </div> -->
        


    </div>`

    });
    getRelatedRsiskAssessment();


}

//Function to send fetch request to get related risk assessments for an incident
async function getRelatedRsiskAssessment() {
    var globalForms = [];

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
                const formIDServer = element.id;
                var approved = "Pending";
                if (elementActivity.approval) {
                    approved = "Approved"
                }
                document.getElementById("submittedFormsTable").innerHTML += `<tr onclick="viewFormReport('${formIDServer}','${userEmail}')"><td  class="col-3">` + elementActivity.activityName + `</td><td  class="col-3">` + elementActivity.date + `</td><td  class="col-4">` + elementActivity.description + `</td><td class='${approved.toLowerCase()}  col-2'>` + approved + `</td></tr>`;
            })




            console.log(activity);
            console.log(globalForms)


        }
    })
        .catch(error => {
            console.log("error" + error);
        });



}



function modalOpen(riskName) {
    // document.getElementById("myInput").value = "Approved";
    var value = riskName.toLowerCase();
    $("#submittedFormsTable tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
    console.log(riskName)
}

//Function to send fetch request to view related risk assessment for an incident
async function viewFormReport(formID,userEmail) {
  
    console.log(formID,userEmail)
    var request = await fetch(`/forms/related-risk/${formID}/${userEmail}`);
    if(request.redirected){
      window.location.href = request.url;
    }
  }