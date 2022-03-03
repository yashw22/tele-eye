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

var totalBeds, devicesData, currentIdx, currBedData;

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

                addBedtoNavbar(bedData, totalBeds - 1);
                displayNavPanel(bedData, totalBeds - 1);
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

function fetchBedsData(idx = 0) {
    fetch(HOST + ":" + PORT + "/bed/getbeds?icuID=" + icuID)
        .then(response => response.json())
        .then(data => {
            totalBeds = data.length;
            $("#navbar").html("");
            for (var i = 0; i < totalBeds; i++)
                addBedtoNavbar(data[i], i);
            if (totalBeds > 0) displayNavPanel(data[idx], idx);
            else document.getElementById("navpanel").innerHTML = "No beds in " + params.get("icuName");
        })
}
function addBedtoNavbar(data, i) {
    var btn = $("<button>")
        .addClass("nav-link").html(data.bedName).attr({ "id": "url-tab-" + i, "data-bs-toggle": "pill", "type": "button", "role": "tab", "aria-selected": "true" })
        .click(function () { displayNavPanel(data, i); })
        .appendTo("#navbar");
}
function displayNavPanel(data, idx) {
    currentIdx = idx;
    $("#navpanel").html("");
    var navbarList = document.getElementsByClassName("nav-link");
    for (var i = 0; i < totalBeds; i++) navbarList[i].classList.remove("active");
    $(navbarList[idx]).addClass("active");

    devicesData = data.devices;
    var topDiv = $("<div>").addClass("m-2").css("text-align", "right").appendTo("#navpanel");
    $("<button>").addClass("btn btn-danger").html("Delete " + data.bedName).attr({ "data-bedid": data._id })
        .on("click", function () { deleteBedBtn($(this).data("bedid")); }).appendTo(topDiv);

    var d0 = $("<div>").addClass("row").appendTo("#navpanel");
    for (var j = 0; j < devicesData.length; j++) {
        var dd = $("<div>").addClass("col-md-6").appendTo(d0);
        var dcard = $("<div>").addClass("card m-1 p-2").appendTo(dd);
        var dd1 = $("<div>").addClass("row mb-1").appendTo(dcard);

        var dd1c1 = $("<div>").addClass("col-sm-8").appendTo(dd1);
        $("<h4>").css("float", "left").html(devicesData[j].deviceName + " ").appendTo(dd1c1);
        var stat = $("<span>").css("float", "left").html(devicesData[j].deviceStatus).appendTo(dd1c1);
        if (devicesData[j].deviceStatus === "active") stat.addClass("badge bg-success m-1");
        else stat.addClass("badge bg-danger m-1");

        var dd1c2 = $("<div>").addClass("col-sm-4").css("text-align", "right").appendTo(dd1);
        $("<button>").addClass("btn btn-danger btn-sm").html("Delete device")
            .attr({ "data-bedid": data._id, "data-deviceid": devicesData[j]._id })
            .on("click", function () { deleteDeviceBtn($(this).data("bedid"), $(this).data("deviceid")); })
            .appendTo(dd1c2);

        if (devicesData[j].deviceName == "Patient Monitor") {
            var div = $("<div>").addClass("container").attr({ "id": "carousel-container-" + devicesData[j].deviceID }).appendTo(dcard);
            fetchImages(div, devicesData[j].deviceID);
            continue;
        }
        $("<iframe>").attr({ "src": devicesData[j].deviceID, "width": "100%" }).appendTo(dcard);
    }
}

function fetchImages(div, deviceID) {
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
            if (res.length > 0) createCarousel(div, res, deviceID);
            else $("<div>").html("No image available.").appendTo(div);
        });
}
function createCarousel(div, data, deviceID) {
    var d0 = $("<div>").addClass("carousel slide").attr({ "id": "carousel-" + deviceID, "data-interval": "false" }).appendTo(div);
    var db1 = $("<button>").addClass("carousel-control-prev")
        .attr({ "type": "button", "data-bs-target": "#carousel-" + deviceID, "data-bs-slide": "prev" })
        .appendTo(d0);
    $("<span>").addClass("carousel-control-prev-icon").attr({ "aria-hidden": "true" }).appendTo(db1);
    var db2 = $("<button>").addClass("carousel-control-next")
        .attr({ "type": "button", "data-bs-target": "#carousel-" + deviceID, "data-bs-slide": "next" })
        .appendTo(d0);
    $("<span>").addClass("carousel-control-next-icon").attr({ "aria-hidden": "true" }).appendTo(db2);
    var dd1 = $("<div>").addClass("carousel-indicators").appendTo(d0);
    var dd2 = $("<div>").addClass("carousel-inner").appendTo(d0);

    for (var i = data.length - 1, j = 0; i >= 0; i--, j++) {
        var indicator = $("<button>")
            .attr({ "type": "button", "data-bs-target": "#carousel-" + deviceID, "data-bs-slide-to": j, "aria-label": "Slide" + (j + 1) })
            .appendTo(dd1);

        var d1 = $("<div>").addClass("carousel-item").appendTo(dd2);
        $("<img>").attr({ "src": data[i].directory }).width("100%").addClass("d-block w-100").appendTo(d1);
        var d2 = $("<div>").addClass("carousel-caption d-none d-md-block").appendTo(d1);
        $("<p>").html(formateDate(new Date(data[i].date))).appendTo(d2);

        if (i == 0) {
            d1.addClass("active");
            indicator.addClass("active").attr({ "aria-current": "true" });
        }
    }
}


function deleteBedBtn(id) {
    var bedData = { bed_ID: id, };
    $.ajax({ type: 'DELETE', url: HOST + ":" + PORT + "/bed/deletebed", data: bedData, dataType: "text" })
        .done(function (resultData) { fetchBedsData(); })
        .fail(function (err) { alert("Unable to delete."); });
};
function deleteDeviceBtn(bed_id, id) {
    var deviceData = { bed_ID: bed_id, device_ID: id };
    $.ajax({ type: 'DELETE', url: HOST + ":" + PORT + "/bed/deletedevice", data: deviceData, dataType: "text" })
        .done(function (resultData) { fetchBedsData(currentIdx); })
        .fail(function (err) { alert("Unable to delete."); });
};

var socket = io("/esp32");
socket.on('img_upload', function (data) {
    var deviceID = data.deviceID;
    for (var i = 0; i < devicesData.length; i++) {
        if (devicesData[i].deviceID === deviceID) {
            console.log("update to ...");
            var div = document.getElementById("carousel-container-" + deviceID);
            div.innerHTML = "";
            fetchImages(div, deviceID)
            // fetchImages(deviceID, dd1, dd2);
        }
    }
});
function addZero(number) {
    if (number <= 9) return "0" + number;
    else return number;
}
function formateDate(date) {
    return (addZero(date.getDate())) + "/" + (addZero(date.getMonth() + 1)) + "/" +
        date.getFullYear() + " " + addZero(date.getHours()) + ":" +
        addZero(date.getMinutes()) + ":" + addZero(date.getSeconds());
}