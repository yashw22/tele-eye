import { HOST, PORT } from "./config.js";

var carouselBody = document.getElementById("carousel-inner");
var carouselIndicators = document.getElementById("carousel-indicators");
// var progBar = document.getElementById("carousel-progress-bar");

const params = new URLSearchParams(window.location.search);
const deviceID = params.get("deviceID")
$("#pageTitle").html(params.get("deviceName"));

fetchData()
setInterval(invokeEvery30Sec, 30000);

async function invokeEvery30Sec() {
    $(carouselBody).html("");
    $(carouselIndicators).html("");
    fetchData();
 }

function fetchData() {
    var ajaxData = {
        "deviceID": deviceID,
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
            createCarousel(res);
        });
}

function createCarousel(data) {
    console.log(data);

    // aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style="width:50%" 
    // $("#carousel-progBar").css("width", "50%").attr({ "aria-valuenow": "70" });
    // console.log(progressBar.style)

    for (var i = data.length - 1, j = 0; i >= 0; i--, j++) {
        //console.log("Inside for lop. i = " + i);
        var imgDate = new Date(data[i].date);
        var dispDate = imgDate.getDate() + "/" + imgDate.getMonth() + "/" +
            imgDate.getFullYear() + " " + imgDate.getHours() + ":" +
            imgDate.getMinutes() + ":" + imgDate.getSeconds();

        var indicator = $("<button>").appendTo(carouselIndicators)
            .attr({ "type": "button", "data-bs-target": "#carouselExampleCaptions", "data-bs-slide-to": j, "aria-label": "Slide" + (j + 1) });

        var d1 = $("<div>").addClass("carousel-item").appendTo(carouselBody);
        $("<img>").attr({ "src": data[i].directory }).width("100%").appendTo(d1).addClass("d-block w-100");
        var d2 = $("<div>").addClass("carousel-caption d-none d-md-block").appendTo(d1);
        $("<p>").html(dispDate).appendTo(d2);

        if (i == 0) {
            d1.addClass("active");
            indicator.addClass("active").attr({ "aria-current": "true" });
        }
    }
}