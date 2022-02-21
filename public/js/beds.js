import { HOST, PORT } from "./config.js";

const params = new URLSearchParams(window.location.search);
$("#page_header").html(params.get("icuName") + " - Bed List");
const icuID = params.get("icuID");
const hospID = params.get("hospID");

fetchBedsData();

var bedName = document.getElementById("bedName");
var bedStatus = document.getElementsByName("bedStatus");
var devices = []

var table = document.getElementById("tableval");
var deviceName = document.getElementById("deviceName");
var deviceIDtag = document.getElementById("deviceID");
var deviceStatus = document.getElementsByName("deviceStatus");


var totalBeds, devicesData;

$("#addDevice").on("click", function () {
    var deviceData = {
        "deviceName": deviceName.value,
        "deviceID": deviceIDtag.value,
        "deviceStatus": "",
    };
    for (let i = 0; i < deviceStatus.length; i++) {
        if (deviceStatus[i].checked) {
            deviceData.deviceStatus = deviceStatus[i].value;
            break;
        }
    }
    if (deviceName.value === "" || deviceIDtag.value === "" || deviceData.deviceStatus === "") {
        alert('Please enter all fields');
        return false;
    }
    $(deviceName).html("Select Device");
    deviceName.value = "";
    deviceIDtag.value = "";
    $('input[name="deviceStatus"]').prop('checked', false);
    devices.push(deviceData);

    var tbRow = "";
    for (var i = 0; i < devices.length; i++) {
        tbRow += "<tr><td>" + devices[i].deviceName + "</td><td>" + devices[i].deviceStatus + "</td><td>" + devices[i].deviceID + "</td></tr>";
    }
    $(table).html(tbRow);
});

$("#submitdata").on("click", function () {
    var bedData = {
        "bedName": bedName.value,
        "icuID": icuID,
        "hospID": hospID,
        "devices": devices,
        "bedStatus": "",
    }
    for (let i = 0; i < bedStatus.length; i++) {
        if (bedStatus[i].checked) { bedData.bedStatus = bedStatus[i].value; break; }
    }
    if (bedName.value === "" || bedData.bedStatus === "") { alert("Please enter Bed details."); return false; }
    else if (!devices.length) { alert("No devices added. Enter atleast one device details."); return false; }
    else {
        $.ajax({
            type: 'POST',
            url: HOST + ":" + PORT + "/bed/addbed",
            data: bedData,
            dataType: "text",
            success: function (resultData) {
                totalBeds = totalBeds + 1;
                bedName.value = "";
                $('input[name="bedStatus"]').prop('checked', false);
                devices = [];
                table.innerHTML = " ";
                $('#modal').modal('hide');

                addBedtoHtml(bedData, totalBeds - 1);
                displayNavPanel(bedData, totalBeds - 1);
                //clearActiveNav();
                //addNewBed(bedData, true, totalBeds);
            }
        });
    }
})

$("#signoutbtn").on("click", function (event) {
    event.preventDefault();
    $.ajax({
        type: 'POST',
        url: HOST + ":" + PORT + "/auth/signout",
        success: function (res) { window.location.replace(HOST + ":" + PORT); }
    });
});


function fetchBedsData() {
    fetch(HOST + ":" + PORT + "/bed/getbeds?icuID=" + icuID)
        .then(response => response.json())
        .then(data => {
            totalBeds = data.length;
            for (var i = 0; i < totalBeds; i++) {
                addBedtoHtml(data[i], i);
            }
            if (totalBeds) displayNavPanel(data[0], 0);
        })
}

function addBedtoHtml(data, i) {
    var btn = $("<button>")
        .addClass("nav-link").html(data.bedName).attr({ "id": "url-tab-" + i, "data-bs-toggle": "pill", "type": "button", "role": "tab", "aria-selected": "true" })
        .click(function () { displayNavPanel(data, i); })
        .appendTo("#navbar");
    if (i == 0) btn.addClass("active");
}

function displayNavPanel(data, idx) {
    document.getElementById("navpanel").innerHTML = "";
    var navbarList = document.getElementsByClassName("nav-link");
    for (var i = 0; i < totalBeds; i++) navbarList[i].classList.remove("active");
    $(navbarList[idx]).addClass("active");

    devicesData = data.devices;
    var dd0 = $("<div>").addClass("row").appendTo("#navpanel");
    for (var j = 0; j < devicesData.length; j++) {
        var dd1 = $("<div>").addClass("col-md-6").appendTo(dd0);
        var dd2 = $("<h4>").html(devicesData[j].deviceName + " ").appendTo(dd1);
        var dd3 = $("<span>").html(devicesData[j].deviceStatus).appendTo(dd1);
        if (devicesData[j].deviceStatus === "active") dd3.addClass("badge bg-success");
        else dd3.addClass("badge bg-danger");
        $("<br>").appendTo(dd1)

        if (devicesData[j].deviceName == "Patient Monitor") {
            var div = $("<div>").addClass("container").appendTo(dd1);
            createCarousel(div, devicesData[j].deviceID);
            // fetchImages(div, devicesData[j].deviceID);
            continue;
        }
        $("<iframe>").attr({ "src": devicesData[j].deviceID, "width": "400", "height": "300" }).appendTo(dd1);
    }
}



function createCarousel(div, deviceID) {
    var d0 = $("<div>").addClass("carousel slide").attr({ "id": "carousel-" + deviceID, "data-interval": "false" }).appendTo(div);
    var dd1 = $("<div>").addClass("carousel-indicators").attr({ "id": "carousel-indicators-" + deviceID }).appendTo(d0);
    var dd2 = $("<div>").addClass("carousel-inner").attr({ "id": "carousel-inner-" + deviceID }).appendTo(d0);
    var db1 = $("<button>").addClass("carousel-control-prev")
        .attr({ "type": "button", "data-bs-target": "#carousel-" + deviceID, "data-bs-slide": "prev" })
        .appendTo(d0);
    $("<span>").addClass("carousel-control-prev-icon").attr({ "aria-hidden": "true" }).appendTo(db1);
    var db2 = $("<button>").addClass("carousel-control-next")
        .attr({ "type": "button", "data-bs-target": "#carousel-" + deviceID, "data-bs-slide": "next" })
        .appendTo(d0);
    $("<span>").addClass("carousel-control-next-icon").attr({ "aria-hidden": "true" }).appendTo(db2);

    fetchImages(deviceID, dd1, dd2);
    // displayImages(data, dd1, dd2);

}

function fetchImages(deviceID, dd1, dd2) {
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
            if (res.length) displayImages(res, dd1, dd2);
            else $("<div>").html("No image available.").appendTo(div);
        });
}

function displayImages(data, carouselIndicators, carouselBody) {
    var deviceID = data[0].deviceID;

    //console.log(data);
    for (var i = data.length - 1, j = 0; i >= 0; i--, j++) {
        var imgDate = new Date(data[i].date);
        var dispDate = imgDate.getDate() + "/" + imgDate.getMonth() + "/" +
            imgDate.getFullYear() + " " + imgDate.getHours() + ":" +
            imgDate.getMinutes() + ":" + imgDate.getSeconds();

        var indicator = $("<button>")
            .attr({ "type": "button", "data-bs-target": "#carousel-" + deviceID, "data-bs-slide-to": j, "aria-label": "Slide" + (j + 1) })
            .appendTo(carouselIndicators);

        var d1 = $("<div>").addClass("carousel-item").appendTo(carouselBody);
        $("<img>").attr({ "src": data[i].directory }).width("100%").addClass("d-block w-100").appendTo(d1);
        var d2 = $("<div>").addClass("carousel-caption d-none d-md-block").appendTo(d1);
        $("<p>").html(dispDate).appendTo(d2);

        if (i == 0) {
            d1.addClass("active");
            indicator.addClass("active").attr({ "aria-current": "true" });
        }
    }
}

var socket = io();
socket.on('broadcast', function (data) {
    var deviceID = data.deviceID;

    for (var i = 0; i < devicesData.length; i++) {
        if (devicesData[i].deviceID === deviceID) {
            console.log("update to ...");
            var dd1 = document.getElementById("carousel-indicators-" + deviceID);
            var dd2 = document.getElementById("carousel-inner-" + deviceID);
            dd1.innerHTML = "";
            dd2.innerHTML = "";
            fetchImages(deviceID, dd1, dd2);
        }
    }
});
