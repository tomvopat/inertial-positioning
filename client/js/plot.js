"use strict";

const url = "http://localhost:5000";

function getGraph(name, element) {
    let request = new XMLHttpRequest();
    request.onload = function() {
        let plot = JSON.parse(this.response);
        Plotly.plot(element, plot, {});
    };
    request.open("GET", `${url}/plot?selected=${name}`, true);
    request.send();
}

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
    });

    $(".example-button").on("click", function() {
        let mainId = $(this).closest(".row-content").attr("id");

        let activeExample = $("#" + mainId + " .example-button.btn-primary").attr("data-example");
        let newExample = $(this).attr("data-example");
        if(activeExample === newExample) {
            return;
        }
        $("#" + newExample).show();
        $("#" + activeExample).hide();

        $("#" + mainId + " .example-button.btn-primary").toggleClass("btn-primary btn-outline-primary");
        $(this).toggleClass("btn-primary btn-outline-primary");
    });
});

//getGraph("gps", "plot1");