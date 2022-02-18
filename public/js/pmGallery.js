import { HOST, PORT } from "./config.js";

fetchData()

$("#loadMoreBtn").on("click", function (event) {
    fetchData();
});

function fetchData() {
    var ajaxData = {
        "deviceID": "test1",
        "date": new Date(),
        "limit": 10
    };
    fetch(HOST + ":" + PORT + "/devices/pm/getimages", {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(ajaxData)
    })
        .then((res) => res.json())
        .then((res) => {
            createGrid(res);
        });
}

function createGrid(data) {
    console.log(data);
    var dd = document.getElementById("pmRow");
    for (var i = data.length - 1; i >= 0; i--) {
        //console.log("Inside for lop. i = " + i);
        var imgDate = new Date(data[i].date);
        var dispDate = imgDate.getDate() + "/" + imgDate.getMonth() + "/" +
            imgDate.getFullYear() + " " + imgDate.getHours() + ":" +
            imgDate.getMinutes() + ":" + imgDate.getSeconds();
        var d1 = $("<div>").addClass("col-sm-4").appendTo(dd);
        var d2 = $("<div>").addClass("card h-100").appendTo(d1);
        var d3 = $("<div>").addClass("text-center").appendTo(d2);
        var d4 = $("<div>").addClass("card-body").appendTo(d2);
        $("<h3>").html(dispDate).appendTo(d3);
        $("<img>").attr({ "src": data[i].directory }).appendTo(d4).width("100%");
    }
}

