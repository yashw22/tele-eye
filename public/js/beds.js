import { HOST, PORT } from "./config.js";

const params = new URLSearchParams(window.location.search);
const hospID = params.get("hospID");
$("#page_header").html(params.get("hospName"));

fetchdataJSON();

var totalBeds;
var bedName = document.getElementById("bedName");
var bedStatus = document.getElementsByName("bedStatus");
var devices = []

var table = document.getElementById("tableval");
var deviceName = document.getElementById("deviceName");
var deviceURL = document.getElementById("deviceURL");
var deviceStatus = document.getElementsByName("deviceStatus");

$("#addDevice").on("click", function () {
    var deviceData = {
        "deviceName": deviceName.value,
        "deviceURL": deviceURL.value,
        "deviceStatus": "",
    };
    for (let i = 0; i < deviceStatus.length; i++) {
        if (deviceStatus[i].checked) {
            deviceData.deviceStatus = deviceStatus[i].value;
            break;
        }
    }
    if (deviceName.value === "" || deviceURL.value === "" || deviceData.deviceStatus === "") {
        alert('Please enter all fields');
        return false;
    }
    deviceName.value = "";
    deviceURL.value = "";
    $('input[name="deviceStatus"]').prop('checked', false);
    devices.push(deviceData);

    var tbRow = "";
    for (var i = 0; i < devices.length; i++) {
        tbRow += "<tr><td>" + devices[i].deviceName + "</td><td>" + devices[i].deviceStatus + "</td><td>" + devices[i].deviceURL + "</td></tr>";
    }
    $(table).html(tbRow);
});

$("#submitdata").on("click", function () {
    var bedData = {
        "bedName": bedName.value,
        "hospID": hospID,
        "devices": devices,
        "bedStatus": "",
    }
    for (let i = 0; i < bedStatus.length; i++) {
        if (bedStatus[i].checked) {
            bedData.bedStatus = bedStatus[i].value;
            break;
        }
    }
    if (bedName.value === "" || bedData.bedStatus === "") {
        alert("Please enter Bed details.");
        return false;
    }
    else if (!devices.length) {
        alert("No devices added. Enter atleast one device details.");
        return false;
    }
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
                table.remove();
                $('#modal').modal('hide');
                clearActiveNav();
                addNewBedToHTML(bedData, true, totalBeds);
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

function fetchdataJSON() {
    const response = fetch(HOST + ":" + PORT + "/bed/getbeds?hospID=" + hospID)
        .then(response => response.json())
        .then(data => {
            totalBeds = data.length;
            for (var i = 0; i < totalBeds; i++) {
                if (i == 0) addNewBedToHTML(data[i], true, i + 1);
                else addNewBedToHTML(data[i], false, i + 1);
            }
        })
}

function addNewBedToHTML(data, currDisplay, idx) {
    var act1 = "", act2 = "";
    if (currDisplay) { act1 = "active"; act2 = "show active"; }
    var btn = $("<button>")
        .addClass("nav-link " + act1)
        .attr({ "id": "url-tab-" + idx, "data-bs-toggle": "pill", "data-bs-target": "#url-" + idx, "type": "button", "role": "tab", "aria-controls": "url-" + idx, "aria-selected": "true" })
        .html(data.bedName)
        .appendTo("#navbar");
    // $("<h6>").html(data.bedStatus).appendTo("#navbar");

    var devicesData = data.devices;
    var disp = $("<div>")
        .addClass("tab-pane fade " + act2)
        .attr({ "id": "url-" + idx, "role": "tabpanel", "aria-labelledby": "url-tab-" + idx })
        .appendTo("#navpanel");
    var dd0 = $("<div>").addClass("row").appendTo(disp);
    for (var j = 0; j < devicesData.length; j++) {
        var dd1 = $("<div>").addClass("col-md-6").appendTo(dd0);
        var dd2 = $("<h4>").html(devicesData[j].deviceName).appendTo(dd1);
        $("<span>").addClass("badge bg-secondary").html(devicesData[j].deviceStatus).appendTo(dd2);
        $("<iframe>").attr({ "src": devicesData[j].deviceURL, "width": "400", "height": "300" }).appendTo(dd1);
    }
}

function clearActiveNav() {
    var navbar = document.getElementsByClassName("nav-link");
    var navpanel = document.getElementsByClassName("tab-pane");
    for (var i = 0; i < navbar.length; i++) {
        navbar[i].classList.remove("active");
        navpanel[i].classList.remove("active", "show");
    }
}