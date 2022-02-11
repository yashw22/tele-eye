function fetchdataJSON() {
    console.log("From style.js");

    const response = fetch("http://localhost:8080/hospital/gethospitals")
        .then(response => response.json())
        .then(data => {
            console.log("after fetch", data);
            $("#hospitalslist").empty();

            var dd = $("<div>").addClass("row gy-4").appendTo("#hospitalslist");
            for (var i = 0; i < data.length; i++) {
                console.log("hi");
                var d1 = $("<div>").addClass("col-sm-4").appendTo(dd);
                var d2 = $("<div>").addClass("card h-100").appendTo(d1);
                var d3 = $("<div>").addClass("text-center").appendTo(d2);
                var d4 = $("<div>").addClass("card-body").appendTo(d2);
                $("<h3>").html(data[i].hospName).appendTo(d3);
                $("<p>").html(data[i].hospLocation).appendTo(d4);
                $("<a>").attr({ "href": data[i].hospUrl }).html(data[i].hospUrl).appendTo(d4);

            }
        })
    return response;
}

//fetchdataJSON();
var hospName = document.getElementById("hospName");
var hospLocation = document.getElementById("hospLocation");
var hospUrl = document.getElementById("hospURL");

$("#submitdata").on("click", function () {
    var dataAjax = {};
    dataAjax.hospName = hospName.value;
    dataAjax.hospLocation = hospLocation.value;
    dataAjax.hospUrl = hospUrl.value;
    console.log(dataAjax);


    if (hospName.value === "" || hospLocation.value === "" || hospUrl.value === "") {
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
                hospUrl.value = "";
                fetchdataJSON();
                // $('#modal').modal('hide');
            }
        });
    }

});



