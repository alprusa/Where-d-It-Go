//Key elements of this part of the program comes from  http://www.jqueryflottutorial.com/
//For the Charts
var userData = [];
var stochData = [];
var profitData = [];
var incrPoints = 0;
var numPoints = (function () {
    return function () {
        ++incrPoints;
        return incrPoints;
    }
})();
incrPoints = 0;
    
var chartDataSet = [
    {
        label: "User Values",
        data: userData,
        color: "red",
        points: {fillColor: "red", show: true},
        lines: {show: true}
    },
    {
        label: "Stoch Values",
        data: stochData,
        color: "blue",
        points: {fillColor: "blue", show: true},
        lines: {show: true}
    }
];

var profitDataSet = [
    {
        label: "Profit Values",
        data: profitData,
        color: "green",
        points: {fillColor: "green", show: true},
        lines: {show: true}
    },
];

var options = [{
    yaxis: {
        color: "black",
        tickDecimals: 12,
        axisLabel: "User Defined Values Over Time",
        axisLabelUseCanvas: true,
        axisLabelFontSizePixels: 12,
        axisLabelFontFamily: 'Arial',
        axisLabelPadding: 5
    },

    xaxis: {
        color: "black",
        timeformat: "%sec",
        tickSize: [incrPoints, "sec"],
        axisLabel: "Values Given Over Time",
        axisLabelUseCanvas: true,
        axisLabelFontSizePixels: 12,
        axisLabelFontFamily: 'Arial',
        axisLabelPadding: 5,
        mode: "time"
    }
}];
    
function timeInt(sec) {
    var theTime = new Date(sec);
    return theTime.getTime();
}

/*$("#getChart").on("click", function (event) {
    $.plot($("#inputValuesChart"), chartDataSet, options);
})

$("#getProfitsChart").on("click", function (event) {
    $.plot($("#profitValuesChart"), profitDataSet, options);
})*/

function inputsChart(){
    $.plot($("#inputValuesChart"), chartDataSet, options);
}

function profitsChart(){
    $.plot($("#profitValuesChart"), profitDataSet, options);
}

setInterval(inputsChart, 1000);
setInterval(profitsChart, 1000);
