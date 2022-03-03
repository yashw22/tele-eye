import { HOST, PORT } from "./config.js";

fetchdataJSON();

var hospName = document.getElementById("hospName");
var hospLocation = document.getElementById("hospLocation");
var hospStatus = document.getElementsByName("hospStatus");

$("#submitdata").on("click", function () {
    var i, hospData = {
        "hospName": hospName.value,
        "hospLocation": hospLocation.value,
        "hospStatus": "",
    }
    for (i = 0; i < hospStatus.length; i++) {
        if (hospStatus[i].checked) {
            hospData.hospStatus = hospStatus[i].value;
            break;
        }
    }

    if (hospName.value === "" || hospLocation.value === "" || hospData.hospStatus === "") {
        alert('Please enter all fields');
        return false;
    }
    else {
        $.ajax({
            type: 'POST',
            url: HOST + ":" + PORT + "/hospital/addhospital",
            data: hospData,
            dataType: "text",
            success: function (resultData) {
                $("#staticBackdrop").modal('hide');
                hospName.value = "";
                hospLocation.value = "";
                $('input[name="hospStatus"]').prop('checked', false);
                fetchdataJSON();
            }
        });
    }

});
$("#signoutbtn").on("click", function (event) {
    event.preventDefault();
    $.ajax({
        type: 'POST',
        url: HOST + ":" + PORT + "/auth/signout",
        success: function (res) {
            window.location.replace(HOST + ":" + PORT);
        }
    });


});

function fetchdataJSON() {
    const response = fetch(HOST + ":" + PORT + "/hospital/gethospitals")
        .then(response => response.json())
        .then(data => {
            console.log(data);
            $("#hospitalsList").empty();
            var dd = $("<div>").addClass("row gy-4").appendTo("#hospitalsList");
            for (var i = 0; i < data.length; i++) {
                var d1 = $("<div>").addClass("col-sm-4").appendTo(dd);
                var d2 = $("<div>").addClass("card h-100").appendTo(d1).attr("id", data[i]._id);
                var d3 = $("<div>").addClass("text-center").appendTo(d2);
                $("<h3>").html(data[i].hospName).appendTo(d3);
                var d4 = $("<div>").addClass("card-body").appendTo(d2);
                $("<p>").html("<b>Location</b>: " + data[i].hospLocation).appendTo(d4);
                $("<p>").html("<b>Status</b>: " + data[i].hospStatus).appendTo(d4);
                $("<p>").html("<b>No. of ICUs</b>: " + (data[i].allICUs).length).appendTo(d4);
                $("<p>").html("<b>No. of Beds</b>: " + (data[i].allBeds).length).appendTo(d4);

                var d5 = $("<div>").css("text-align", "right").appendTo(d4);
                $("<button>").addClass("btn btn-primary").html("View ICUs").attr({ "data-hid": data[i]._id, "data-hname": data[i].hospName })
                    .click(function () { window.location.href = "icus.html?hospName=" + $(this).data("hname") + "&hospID=" + $(this).data("hid"); })
                    .appendTo(d5);
                $("<span>").html(" ").appendTo(d5);
                $("<button>").addClass("btn btn-danger").html("Delete Hospital").attr({ "data-hospid": data[i]._id })
                    .on("click", function () { deleteHospBtn($(this).data("hospid")); }).appendTo(d5);
            }
        })
}

function deleteHospBtn(id) {
    var hospData = { hosp_ID: id, };
    $.ajax({ type: 'DELETE', url: HOST + ":" + PORT + "/hospital/deletehospital", data: hospData, dataType: "text" })
        .done(function (resultData) { fetchdataJSON(); })
        .fail(function (err) { alert("Unable to delete."); });
};