

window.onload = async function () {
   
    const request = await fetch(`/user/email`, { method: "GET",});
    const respone = await (request.json());
    console.log(respone);

    const risksRequest = await fetch('/risks/',{method:"GET"});
    const responseRisks = await (risksRequest.json());
    console.log(responseRisks);
}

