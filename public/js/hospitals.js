fetchdataJSON();

var hospName = document.getElementById("hospName");
var hospLocation = document.getElementById("hospLocation");
var hospStatus = document.getElementById("hospStatus");

$("#submitdata").on("click", function () {
    var dataAjax = {};
    dataAjax.hospName = hospName.value;
    dataAjax.hospLocation = hospLocation.value;
    dataAjax.hospStatus = hospStatus.value;
    //console.log(dataAjax);

    if (hospName.value === "" || hospLocation.value === "" || hospStatus.value === "") {
        alert('Please enter all fields');
        return false;
    }
    else {
        $.ajax({
            type: 'POST',
            url: "http://localhost:8080/hospital/addhospital",
            data: dataAjax,
            dataType: "text",
            success: function (resultData) {
                $("#staticBackdrop").modal('hide');
                //$(".container-fluid").css({ display: "block" });
                hospName.value = "";
                hospLocation.value = "";
                hospStatus.value = "";
                fetchdataJSON();
                // $('#modal').modal('hide');
            }
        });
    }

});

function fetchdataJSON() {

    const response = fetch("http://localhost:8080/hospital/gethospitals")
        .then(response => response.json())
        .then(data => {
            $("#hospitalsList").empty();

            var dd = $("<div>").addClass("row gy-4").appendTo("#hospitalsList");
            for (var i = 0; i < data.length; i++) {
                var d1 = $("<div>").addClass("col-sm-4").appendTo(dd);
                var d2 = $("<div>").addClass("card h-100").appendTo(d1).attr("id", data[i]._id);
                var d3 = $("<div>").addClass("text-center").appendTo(d2);
                var d4 = $("<div>").addClass("card-body").appendTo(d2);
                $("<h3>").html(data[i].hospName).appendTo(d3);
                $("<p>").html("Location: " + data[i].hospLocation).appendTo(d4);
                $("<p>").html("Status: " + data[i].hospStatus).appendTo(d4);
                $("<a>").html("ext link.").appendTo(d4)
                    .attr({ "href": "/beds.html?hospName=" + data[i].hospName + "&hospID=" + data[i]._id });

            }
        })
    return response;
}
