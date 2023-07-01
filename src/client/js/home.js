

window.onload = async function () {
   
    const request = await fetch(`/user/email`, { method: "GET",});
    const respone = await (request.json());
    console.log(respone);
    
//Risks fetch request for filling suggestions
    const risksRequest = await fetch('/risks/all',{method:"GET"});
    const responseRisks = await (risksRequest.json());
    console.log(responseRisks);

    responseRisks.forEach(element => {
        console.log(element.riskname);
        const newRow = ' <tr><td><label type="text">'+element.riskname+'</td>'+
        '<td><label type="text">'+element.risks+'</td>'+
        '<td><label type="text">'+element.probability+'</td>'+
        '<td><label type="text">'+element.severity+'</td>'+
        '<td><label type="text">'+element.riskLevel+'</td>'+
        '<td><label type="text"></td>'+
        '<td><label type="text"><button class="btn btn-outline-success">Add</button></td></tr>'
        document.getElementById("suggestions").innerHTML  += newRow;

    });
}

