

async function login(userEmail,userName,userPassword,userType) {
    var email ;
    var password ;
    var isAdmin;
    if (userEmail && userName && userPassword) {
         email = userEmail;
         password = userPassword;
         isAdmin = userType;
    }else{
         email = document.getElementById("email").value;
         password = document.getElementById("password").value;
         isAdmin = document.getElementById("loginAdmin").checked;
        console.log(isAdmin);
    }
   


    console.log(email + " " + password);
    if (email == "" || password == "") {
        window.alert("Enter all values")
    } else {
        
        const request = await fetch(`/user/login`, { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userEmail: email, password: password,isAdmin:isAdmin }) });

         //const respone = await (request.json());
        // console.log(respone.message);
        if (request.redirected) {
            window.location.href = request.url;
            
          } else {
            const response = await request.json();
            console.log(response.message);
            window.alert("Login Failed")
          }
        
        // if (request.ok) {
        //     window.location.href = `http://localhost:8000/home.html?user=`+encodeURIComponent(email);
        // }
    }


}

async function registerUser() {
    const userEmail = document.getElementById('email-r').value;
    const userName = document.getElementById('name-r').value;
    const password = document.getElementById('password-r').value;

    if (userName == "" || userEmail == "" || password == "") {
        window.alert("Enter all values")
    } else {
        const request = await fetch('/user/register', { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userEmail: userEmail, userName: userName, password: password }) });

        const respone = request.json();

        console.log(request.message);

        if (request.ok) {
            console.log("Registered Login Now");
            login(userEmail,userName,password,false);
        }else{
            window.alert("Register Failed")
        }
    }


}

function forgottenPswrdBody() {
    document.getElementById("loginBody").classList.toggle("d-none")
    document.getElementById("forgottenPswBody").classList.toggle("d-none")
}

async function forgottenPswrd() {
   var userEmail = document.getElementById("email-fgtn").value;
   var password = document.getElementById("password-fgtn").value;
    var verify = comparePswd();
    if(verify){

        const request = await fetch(`/user/reset`, { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userEmail: userEmail, password: password }) });
        const response = await request.json();

        if (request.ok) {
            window.alert(response.message);
        }else{
            window.alert("Error Try Again")
        }
    }else{
        window.alert("Password Missmatch")
    }

}

function comparePswd() {
    var password = document.getElementById("password-fgtn").value;
    var password2 =  document.getElementById("password2-fgtn").value;

    if (password != password2) {
        document.getElementById("password2-fgtn").classList.add("border-danger")
        return false;
    }else{
        document.getElementById("password2-fgtn").classList.remove("border-danger")
        return true;
    }
}



