import { HOST, PORT } from "./config.js";

$("#testbtn").on("click", function (event) {
    event.preventDefault();
    $.ajax({
        type: 'GET',
        url: HOST + ":" + PORT + "/devices/pm/getimages",
        data: { "idx": 0 },
        dataType: "text",
        success: function (res) {
            console.log(res);
            $("#testimg").attr("src", res);
        },
        error: (err) => {
            console.log("ajax Err.")
        }
    });
});