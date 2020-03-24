"use strict";

function getGraph(name, element) {
    let request = new XMLHttpRequest();
    request.onload = function() {
        let plot = JSON.parse(this.response);
        Plotly.plot(element, plot, {});
    };
    request.open("GET", `http://aws.tomvopat.com:5000/plot?selected=${name}`, true);
    request.send();
}

getGraph("gps", "plot1");
getGraph("smooth", "plot2");
//getGraph("outlier", "plot3");
getGraph("predict", "plot4");
//getGraph("predict", "plot5");