"use strict";

//const url = "http://localhost:5000";
const url = "http://aws.tomvopat.com:5000";

let loadedPlots = new Set();

function getGraph(name, element) {
    $(document).ready(function () {
        $("#" + element).html("<div class=\"loader\"></div>");
    });
    let request = new XMLHttpRequest();
    request.onload = function() {
        let plot = JSON.parse(this.response);
        document.getElementById(element).innerHTML = "";
        Plotly.plot(element, plot, {});
    };
    request.open("GET", `${url}/plot?selected=${name}`, true);
    request.send();
}

function drawPlot(name) {
    if(loadedPlots.has(name)) return;
    else loadedPlots.add(name);

    switch(name) {
        case "example4":
            getGraph("compare1", name + "-content");
            break;
        case "example5":
            getGraph("compare2", name + "-content");
            break;
        case "example6":
            getGraph("compare3", name + "-content");
            break;
        case "example1":
        case "example2":
        case "example3":
        default:
            getGraph("bar", name + "-content");
            break;
    }
}

// outliers graph
Plotly.newPlot(
    "outliers-plot",
    [{
        values: [23382, 3189],
        labels: ["Correctly classified", "Misclassified"],
        type: "pie",
        hoverinfo: "label"
    }],
    {
        showlegend: false,
    });

$(document).ready(function() {
    $(".example-button.btn-outline-primary").each(function () {
        let example = $(this).attr("data-example");
        $("#" + example).hide();
    });

    $(".content-button").on("click", function() {
        let contentId = $(this).attr("data-content");
        $(`#${contentId}`).slideToggle(400);
        $(this).toggleClass("btn-primary btn-secondary");
        if($(this).hasClass("btn-secondary")) {
            $(this).html("Hide");
        } else {
            $(this).html("Show more");
        }
        $(`#${contentId} .btn-group .btn-primary`).trigger("click");
    });

    $(".example-button").on("click", function() {
        let mainId = $(this).closest(".row-content").attr("id");

        let activeExample = $("#" + mainId + " .example-button.btn-primary").attr("data-example");
        let newExample = $(this).attr("data-example");
        drawPlot(newExample);

        if(activeExample === newExample) {
            return;
        }
        $("#" + newExample).show();
        $("#" + activeExample).hide();

        $("#" + mainId + " .example-button.btn-primary").toggleClass("btn-primary btn-outline-primary");
        $(this).toggleClass("btn-primary btn-outline-primary");
    });
});