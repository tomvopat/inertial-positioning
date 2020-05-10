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
});

//getGraph("gps", "plot1");