import { HOST, PORT } from "./config.js";

var username = document.getElementById("username");
var password = document.getElementById("password");

console.log("Login page displayed.");

$("#loginbtn").on("click", function (event) {
    event.preventDefault();

    var loginData = {};
    loginData.username = username.value;
    loginData.password = password.value;

    if (username.value === "" || password.value === "") {
        alert('Please enter all fields');
        return false;
    }
    else {
        $.ajax({
            type: 'POST',
            url: HOST + ":" + PORT + "/auth/signin",
            data: loginData,
            dataType: "text",
            success: function (res) {
                window.location.replace(HOST + ":" + PORT + "/hospitals");
            },
            error: (err) => {
                //username.value = "";
                password.value = "";
                $("#invalid_login").html("Login failed.");
            }
        });
    }

});