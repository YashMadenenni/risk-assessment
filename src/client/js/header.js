// Funtion that is called to create header 
async function createHeader(callback,navItem) {

    const request = await fetch(`/user/email`);
    const respone = await (request.json());

   let header =  document.createElement('nav');
   header.className = 'navbar navbar-expand-sm navbar-dark bg-dark'
   header.innerHTML = `
   <div class="container-fluid">
       <a class="navbar-brand" href="./home.html">Risk Assessment</a>
       <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
           <span class="navbar-toggler-icon"></span>
         </button>
         <div class="collapse navbar-collapse" id="mynavbar">
           <ul class="navbar-nav flex col-12">
               <li class="nav-item ">
                   <a class="nav-link active" href="./home.html" id="newForm"><i class="fa-sharp fa-solid fa-plus"></i> New</a>
               </li>
               <li class="nav-item">
                   <a class="nav-link" href="./savedForms.html" id="saved"><i class="fa-sharp fa-solid fa-floppy-disk"></i> Saved </a>
               </li>
               <li class="nav-item">
                   <a class="nav-link" href="./history.html" id="history"><i class="fa-sharp fa-solid fa-right-to-bracket"></i> Submitted</a>
               </li>
               <li class="nav-item" id="addRisksLi">
                            <a class="nav-link" href="./addRisks.html" id="addRisks"><i class="fa-regular fa-lightbulb"></i> Risk Suggestions</a>
                        </li>
               <li class="nav-item">
                            <a class="nav-link" href="./report.html" id="report"><i class="fa-sharp fa-solid fa-flag"></i> Report</a>
                        </li>
               <li class="nav-item dropdown profile " >
                   <a class="nav-link dropdown-toggle  " role="button"
                       data-bs-toggle="dropdown" href="#"><i class="fa-solid fa-user"></i></a>
                   <ul class="dropdown-menu  dropstart" >
                   <li><div class="form-floating px-2">
                   <input type="text" class="form-control border-0 " id="pwd" placeholder="Enter password" name="pswd" value="${respone.userEmail}" disabled> 
                   <label for="pwd">${respone.userName}</label>
                 </div></li>
                    <!--    <li><a class="dropdown-item" href="#" id="userEmail">${respone.userEmail}</a></li>-->
                       <li><a class="dropdown-item" href="./index.html" >Logout</a></li>
                   </ul>
               </li>
           </ul>
         </div>
   </div>`
    document.getElementsByTagName('body')[0].insertBefore(header,document.getElementsByTagName('body')[0].firstChild);

    
    if(navItem == "history"){
        document.getElementById("history").classList.add("active");
        document.getElementById("saved").classList.remove("active");
        document.getElementById("newForm").classList.remove("active");
        document.getElementById("report").classList.remove("active");
    }else if (navItem=="saved") {
        document.getElementById("saved").classList.add("active");
        document.getElementById("history").classList.remove("active");
        document.getElementById("newForm").classList.remove("active");
        document.getElementById("report").classList.remove("active");
    }else if (navItem=="report") {
        document.getElementById("saved").classList.remove("active");
        document.getElementById("history").classList.remove("active");
        document.getElementById("newForm").classList.remove("active");
        document.getElementById("addRisks").classList.remove("active");
        document.getElementById("report").classList.add("active");
    }else if (navItem=="addRisk") {
        document.getElementById("saved").classList.remove("active");
        document.getElementById("history").classList.remove("active");
        document.getElementById("newForm").classList.remove("active");
        document.getElementById("report").classList.remove("active");
        document.getElementById("addRisks").classList.add("active");
    }

    if (respone.isAdmin == false) {
        document.getElementById("addRisksLi").style.display="none";
    }

     if (callback != undefined) {
        callback();
     }

     if (respone.userEmail == undefined) {
        if (window.confirm("Server Restarted, Login Again :)")) {
           document.location.href = "/index.html"
        }
     }
}
