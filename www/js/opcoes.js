const userData = JSON.parse(localStorage.getItem("userData"));
if (userData.Admin == false) {
    document.getElementById("addA").style.display = "none";
    document.getElementById("agendaN").style.display = "none";}