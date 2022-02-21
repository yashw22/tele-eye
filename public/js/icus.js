import { HOST, PORT } from "./config.js";

const params = new URLSearchParams(window.location.search);
$("#page_header").html(params.get("hospName") + " - ICU List");
const hospID = params.get("hospID");

fetchdataJSON();

var icuName = document.getElementById("icuName");
var icuStatus = document.getElementsByName("icuStatus");

$("#submitdata").on("click", function () {
    var i, icuData = {
        "icuName": icuName.value,
        "icuStatus": "",
        "hospID": hospID,
    }
    for (i = 0; i < icuStatus.length; i++) {
        if (icuStatus[i].checked) {
            icuData.icuStatus = icuStatus[i].value;
            break;
        }
    }

    if (icuName.value === "" || icuData.icuStatus === "") {
        alert('Please enter all fields');
        return false;
    }
    else {
        $.ajax({
            type: 'POST',
            url: HOST + ":" + PORT + "/icu/addicu",
            data: icuData,
            dataType: "text",
            success: function (resultData) {
                $("#staticBackdrop").modal('hide');
                icuName.value = "";
                $('input[name="icuStatus"]').prop('checked', false);
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
    const response = fetch(HOST + ":" + PORT + "/icu/geticus?hospID=" + hospID)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            $("#icusList").empty();
            var dd = $("<div>").addClass("row gy-4").appendTo("#icusList");
            for (var i = 0; i < data.length; i++) {
                var d1 = $("<div>").addClass("col-sm-4").appendTo(dd);
                var d2 = $("<div>").addClass("card h-100").appendTo(d1).attr("id", data[i]._id);
                var d3 = $("<div>").addClass("text-center").appendTo(d2);
                var d4 = $("<div>").addClass("card-body")
                    .attr({ "data-icuid": data[i]._id, "data-icuname": data[i].icuName, "data-hospid": hospID })
                    .click(function () {
                        window.location.href = "beds.html?icuName=" + $(this).data("icuname") + "&icuID=" + $(this).data("icuid") + "&hospID=" + $(this).data("hospid");
                    }).appendTo(d2);
                $("<h3>").html(data[i].icuName).appendTo(d3);
                $("<p>").html("<b>Status</b>: " + data[i].icuStatus).appendTo(d4);
                $("<p>").html("<b>No. of Beds</b>: " + (data[i].allBeds).length).appendTo(d4);
                // $("<a>").html("View Beds").addClass("btn btn-success btn-sm")
                // .attr({ "href": "/beds.html?hospName=" + data[i].hospName + "&hospID=" + data[i]._id }).appendTo(d4);
            }
        })
}
