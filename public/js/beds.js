const params = new URLSearchParams(window.location.search);
const hospID = params.get("hospID");
$("#page_header").html(params.get("hospName"));

fetchdataJSON();

var bedName = document.getElementById("bedName");
var bedStatus = document.getElementById("bedStatus");
var devices = []
var navbar = document.getElementById("navbar");
var navpanel = document.getElementById("navpanel");

var table = document.getElementById("tableval");
var deviceName = document.getElementById("deviceName");
var deviceURL = document.getElementById("deviceURL");
var deviceStatus = document.getElementById("deviceStatus");


$("#addDevice").on("click", function () {
    var deviceData = {
        "deviceName": deviceName.value,
        "deviceURL": deviceURL.value,
        "deviceStatus": deviceStatus.value
    };
    deviceName.value = "";
    deviceURL.value = "";
    deviceStatus.value = "";
    devices.push(deviceData);
    //console.log(deviceData)

    var tbRow = "";
    for (var i = 0; i < devices.length; i++) {
        tbRow += "<tr><td>" + devices[i].deviceName + "</td><td>" + devices[i].deviceStatus + "</td><td>" + devices[i].deviceURL + "</td></tr>";
    }
    $(table).html(tbRow);
});

$("#submitdata").on("click", function () {
    var dataAjax = {}
    dataAjax.bedName = bedName.value;
    dataAjax.hospID = hospID;
    dataAjax.bedStatus = bedStatus.value;
    dataAjax.devices = devices;
    //console.log(dataAjax);

    if (bedName.value === "" || bedStatus.value === "") {
        alert("Please enter Bed details.");
        return false;
    }
    else if (!devices.length) {
        alert("please enter device details");
        return false;
    }
    else {
        console.log(dataAjax);
        $.ajax({
            type: 'POST',
            url: "http://localhost:8080/bed/addbed",
            data: dataAjax,
            dataType: "text",
            success: function (resultData) {
                bedName.value = "";
                devices = [];
                bedStatus = "";
                table.remove();

                navbar.html("");
                navpanel.html("");

                $('#modal').modal('hide');
                //alert(resultData);
                fetchdataJSON();
            }
        });

    }
})

function fetchdataJSON() {

    const response = fetch("http://localhost:8080/bed/getbeds?hospID=" + hospID)
        .then(response => response.json())
        .then(data => {
            //console.log(data);
            for (var i = 0; i < data.length; i++) {
                var act1 = "", act2 = "";
                if (i == 0) {
                    act1 = "active";
                    act2 = "show active";
                }
                $("<button>")
                    .addClass("nav-link " + act1)
                    .attr({ "id": "url-tab-" + i, "data-bs-toggle": "pill", "data-bs-target": "#url-" + i, "type": "button", "role": "tab", "aria-controls": "url-" + i, "aria-selected": "true" })
                    .html(data[i].bedName)
                    .appendTo("#navbar");

                var i1 = $("<div>")
                    .addClass("tab-pane fade " + act2)
                    .attr({ "id": "url-" + i, "role": "tabpanel", "aria-labelledby": "url-tab-" + i })
                    .appendTo("#navpanel");

                var devicesData = data[i].devices;
                var dd0 = $("<div>").addClass("row").appendTo(i1);
                for (var j = 0; j < devicesData.length; j++) {
                    var dd1 = $("<div>").addClass("col-md-6").appendTo(dd0);
                    $("<h4>").html(devicesData[j].deviceName).appendTo(dd1);
                    $("<iframe>").attr({ "src": devicesData[j].deviceURL, "width": "700", "height": "550" }).appendTo(dd1);
                }
            }

        })
    return response;
}