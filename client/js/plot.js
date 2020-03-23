"use strict";

function getGraph(name, element) {
    let request = new XMLHttpRequest();
    request.onload = function() {
        let plot = JSON.parse(this.response);
        Plotly.plot(element, plot, {});
    };
    request.open("GET", `http://localhost:5000/plot?selected=${name}`, true);
    request.send();
}

getGraph("bar", "plot1");
getGraph("cat", "plot2");
getGraph("lion", "plot3");
getGraph("lion", "plot4");
getGraph("lion", "plot5");