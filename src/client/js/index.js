

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
