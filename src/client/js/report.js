window.onload = () => createHeader(previewImage,"report") 


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
    
    if(respone.isAdmin){
        document.getElementById("allReports").classList.remove("d-none");
        document.getElementById("reportForm").classList.add("d-none");

        getAllReports()
    }
}

async function getAllReports() {
    
    const request = await fetch("/incident/report",{method:'GET'});
    const response =await request.json();

    console.log(response)

    response.forEach(element => {
        var imageSRC =  'data:image/png;base64,' + element.incidentImage.data;
        var incidentName = element.incident;
        var incidentDate = element.incidentDate;
        var incidentDescription = element.incidentDescription;

        document.getElementById("allIncidents").innerHTML += `<div class="m-3 col-xs-3 col-sm-3 col-md-3 col-lg-3 card ">
        <div class="card-title text-center">
            <h5>${incidentName}</h5>
            <h8>${incidentDate}</h8>
        </div>
        
            <img class="card-img-top " id="image" src="${imageSRC}" alt="">
        
        <div class="card-footer">
            ${incidentDescription}
        </div>
    </div>`
    });

   

}
