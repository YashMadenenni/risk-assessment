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
if(rows.length>1 || button == 'submitSaved'){
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
        userEmail:userEmail,
        activity: activityName,
        date: date,
        description: description,
        risks: riskData
    }

    console.log(formData);

    if (button == 'submit'||button == 'submitSaved') {
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
}else{
    window.alert("insert atleast one row");
}
    
}

