// var app = angular.module('hw8', ['ngMaterial']);
var SERVER_URL = "http://localhost:8080"; 

angular.module('stockApp', ['ngMaterial', 'ngAnimate']).controller('mainController', function ($http, $scope){

    this.querySearch = querySearch;
    $scope.disableButton = false;
    $scope.slide = false;
    $scope.priceVolume = {};
    $scope.tableInfo = [];
    $scope.showFav = true; 

    function parseObj(responseArray){
        var rst = new Array();
        for (var j = 0; j < responseArray.length; j++){
            rst.push(
                {
                    symbol: responseArray[j].Symbol,
                    outlook: responseArray[j].Symbol + ' - ' + responseArray[j].Name + ' -  (' + responseArray[j].Exchange + ")"
                }
            );

            if(rst.length >= 5) {
                break;
            }
        }
        return rst;
    }


    function querySearch(query) { 
        return $http({
            method: "GET",
            url: SERVER_URL,
            params: {"autoComplete": query}
        }).then(function success(response) {
            return parseObj(response.data);
        }, function myError(response) {
        });
    }

    $scope.disable = function (){
        return $scope.disableButton;
    }

    $scope.toggleFav = function () {
        $scope.showFav = false;
    }

    $scope.clear = function() {
        $scope.selectedItem = null;
        $scope.searchText = "";
        $scope.priceVolume = {};
    }


});

function getChangePercent(changeNum, lastDay){
    return (changeNum * 100 / lastDay).toFixed(2);
}

function getChange(today, lastDay) {
    return today - lastDay;
}

function drawChangePercent(changeNum, changePercent) {
    if (parseFloat(changeNum) < 0) {
        return '<tr><th width="50%">' + 'Change (Change Percent)' + '</th>' + '<td style="color: red" width="50%">' +
            changeNum + ' (' + changePercent + ')' + '</td></tr>';
    }

    return '<tr><th width="50%">' + 'Change (Change Percent)' + '</th>' + '<td style="color: greenyellow" width="50%">' +
        changeNum + ' (' + changePercent + ')' + '</td></tr>';
}

function updateInfoTable(priceVolume) {
    $('#symbol').text(priceVolume.symbol);
    $('#lastPrice').text(priceVolume.lastPirce);
    $('#change').text(priceVolume.change);
    $('#volume').text(priceVolume.volume);
    $('#timeStamp').text(priceVolume.timeStamp);
    $('#open').text(priceVolume.open);
    $('#close').text(priceVolume.close);
    $('#range').text(priceVolume.priceRange);
    $('#progressBarTable').css("display", "none");
    $( "#infoTable" ).css("display", "table");
}

function drawPriceVolume(priceVolume, subtitle) {
    var symbol = priceVolume.symbol;
    console.log(priceVolume.prices.reverse());
    var radius = 2;
     new Highcharts.chart('stockChart', {
        chart: {
            zoomType: 'x'
        },
        title: {
            text: symbol + " Stock Price and Volume"
        },
        subtitle: {
            text: subtitle,
            useHTML: true
        },

        xAxis: {
            tickInterval: 5,
            categories: priceVolume.date.reverse()
        },

        yAxis: [{
            title: {
                text: 'Stock Price'
            },
            min: priceVolume.minPirce / 2,
            max: priceVolume.maxPrice,
            tickInterval: 5
            },

            {
                gridLineWidth: 0,
                title: {
                    text: 'Volume'
                },
                opposite: true,
                min: priceVolume.minVolume,
                max: priceVolume.maxVolume * 3
            }
        ],

        plotOptions: {
            area: {
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: radius
                },
                threshold: null,

                tooltip: {
                    valueDecimals: 2
                },


            },

            series: {
                fillColor: "#E0DEFF"
            },

            column: {
                pointWidth: 3
            }

        },

        legend: {
            // layout: 'vertical',
            align: 'center',
            verticalAlign: 'bottom'
        },

        series: [{
            name: symbol,
            data: priceVolume.prices.reverse(),
            type: 'area',
            color: '#415bf4'
            },

            {
            name: symbol + ' Volume',
            data: priceVolume.volumes.reverse(),
            type: 'column',
            yAxis: 1,
            color: '#ff363b'
            }
        ]
    });
}

function drawOneSet(data, subtitle, name) {
    var radius = 2;
    var symbol = data.symbol;
    new Highcharts.chart('stockChart', {
        chart: {
            type: 'spline',
            zoomType: 'x'
        },

        title: {
            text: data.indicator
        },
        subtitle: {
            text: subtitle,
            useHTML: true
        },

        xAxis: {
            tickInterval: 5,
            categories: data['date'].reverse()
        },

        yAxis: {
            title: {
                text: name,
            },
            min: data.min,
            max: data.max,
            // tickInterval: 2.5
        },
        tooltip: {
            valueDecimals: 3
        },

        plotOptions: {
            spline: {
                marker: {
                    enabled: false,
                    symbol: 'square',
                    radius: radius
                },
                animation: false,
                threshold: null
            }
        },
        legend: {
            align: 'center',
            verticalAlign: 'bottom'
        },

        series: [{
            name: symbol,
            data: data.prices.reverse(),
            color: '#ff001b',
            lineWidth: 0.5
        }]

    });
}

function drawTwoset(data, subtitle, name, legendOne, legendTwo) {
    var radius = 2;
    var symbol = data.symbol;
    new Highcharts.chart('stockChart', {
        chart: {
            type: 'spline',
            zoomType: 'x'
        },

        title: {
            text: data.indicator
        },
        subtitle: {
            text: subtitle,
            useHTML: true
        },

        xAxis: {
            tickInterval: 5,
            categories: data['date'].reverse()
        },

        yAxis: {
            title: {
                text: name,
            },
            min: data.min,
            max: data.max,
            // tickInterval: 2.5
        },
        tooltip: {
            valueDecimals: 3
        },

        plotOptions: {
            spline: {
                marker: {
                    enabled: false,
                    symbol: 'square',
                    radius: radius
                },
                animation: false,
                threshold: null
            }
        },
        legend: {
            align: 'center',
            verticalAlign: 'bottom'
        },

        series: [
            {
            name: symbol + " " + legendOne,
            data: data.priceOne.reverse(),
            color: '#ff001b',
            lineWidth: 0.5
            },

            {
            name: symbol + " " + legendTwo,
            data: data.priceTwo.reverse(),
            color: '#0714ff',
            lineWidth: 0.5
            }
        ]

    });
}

function drawThreeset(data, subtitle, name, legendOne, legendTwo, legendThree) {
    var radius = 2;
    var symbol = data.symbol;
    new Highcharts.chart('stockChart', {
        chart: {
            type: 'spline',
            zoomType: 'x'
        },

        title: {
            text: data.indicator
        },
        subtitle: {
            text: subtitle,
            useHTML: true
        },

        xAxis: {
            tickInterval: 5,
            categories: data['date'].reverse()
        },

        yAxis: {
            title: {
                text: name,
            },
            min: data.min,
            max: data.max,
            tickInterval: 5
        },
        tooltip: {
            valueDecimals: 3
        },

        plotOptions: {
            spline: {
                marker: {
                    enabled: false,
                    symbol: 'square',
                    radius: radius
                },
                animation: false,
                threshold: null
            }
        },
        legend: {
            align: 'center',
            verticalAlign: 'bottom'
        },

        series: [
            {
                name: symbol + " " + legendOne,
                data: data.priceOne.reverse(),
                color: '#1c9b17',
                lineWidth: 0.5
            },

            {
                name: symbol + " " + legendTwo,
                data: data.priceTwo.reverse(),
                color: '#1472ff',
                lineWidth: 0.5
            },
            {
                name: symbol + " " + legendThree,
                data: data.priceThree.reverse(),
                color: '#0b050a',
                lineWidth: 0.5
            }
        ]

    });
}

function drawhistoricalChart(info, subtitle) {

     Highcharts.stockChart('historicalData', {

         chart: {
             zoomType: 'x'
         },
        title: {
            text: info.symbol + " Stock Value"
        },

        subtitle: {
            text: subtitle,
            useHTML: true
        },

         tooltip: {
             split: false,
             style:{
                 fontSize: "9px",
                 textAlign: "center"
             }
         },
 

         rangeSelector: {
             buttons: [{
                 type: 'week',
                 count: 1,
                 text: '1w'
             },{
                 type: 'month',
                 count: 1,
                 text: '1m'
             }, {
                 type: 'month',
                 count: 3,
                 text: '3m'
             }, {
                 type: 'month',
                 count: 6,
                 text: '6m'
             }, {
                 type: 'ytd',
                 text: 'YTD'
             }, {
                 type: 'year',
                 count: 1,
                 text: '1y'
             }, {
                 type: 'all',
                 text: 'All'
             }],

             selected: 0
         },

        series: [{
            name: info.symbol + ' Stock Price',
            data: info['chartData'],
            type: 'area',
            threshold: null,

            tooltip: {
                valueDecimals: 2

            }
        }]
    });
}

function drawNewsTable(data) {
    $('#newsTable').html("");
    // var news = "";
    var itemList = data['rss']['channel'][0]['item'];
    var counter = 0;
    for (var i = 0; i < itemList.length; i++){

        if (itemList[i]['link'][0].includes("article")){
            counter++;
            $('#newsTable').append(
                '<div class = "well"> <p class="newsP"><a target="_blank" href=' + '"' + itemList[i]['link'][0] +'">' +itemList[i]["title"] + '</a></p>' +
                '<b>' + itemList[i]['sa:author_name'] +'</b><br>' +
                '<b>' + itemList[i]['pubDate'][0].substring(0, itemList[i]['pubDate'][0].length-5) + ' EDT</b></div>'
            )
            if (counter == 5){
                break;
            }
        }
    }
}

function historicalData(priceResponse) {
    var data = [];

    var timeSeries = priceResponse['Time Series (Daily)'];
    var counter = 0;
    for (var day in timeSeries){
        var oneDataPair = [];
        var dateObj = Date.parse(day);
        oneDataPair.push(dateObj);
        oneDataPair.push(parseFloat(timeSeries[day]['4. close']));
        data.push(oneDataPair);
        counter++;
        if(counter > 999) {
            break;
        }
    }
    return {
        symbol: priceResponse["Meta Data"]["2. Symbol"],
        chartData: data.reverse()
    }
}

function parsePriceVolume(data){
    var date = new Array();
    var prices = new Array();
    var shortDate = new Array();
    var volumes = new Array();
    var timeSeries = data['Time Series (Daily)'];
    var timeZone = data["Meta Data"]['5. Time Zone'];
    var counter = 0;
    for (var day in timeSeries){
        date.push(day);
        prices.push(parseFloat(timeSeries[day]['4. close']));
        volumes.push(parseInt(timeSeries[day]["5. volume"]));
        counter++;
        if(counter > 131) {
            break;
        }
    }
    var today = date[0];
    if (data["Meta Data"]['3. Last Refreshed'].length > 10){
        var timeStamp = data["Meta Data"]['3. Last Refreshed'] + ' EDT';
    }
    else {
        var timeStamp = data["Meta Data"]['3. Last Refreshed'] + ' 16:00:00 EDT';
    }

    var changeNum = getChange(parseFloat(close), parseFloat(timeSeries[date[1]]['4. close']));
    return {
        symbol: data["Meta Data"]["2. Symbol"],
        prices: prices,
        volumes: volumes,
        minVolume: Math.min(...volumes),
        maxVolume: Math.max(...volumes),
        minPirce: Math.min(...prices),
        maxPrice: Math.max(...prices),
        open: parseFloat(timeSeries[today]['1. open']).toFixed(2),
        close: parseFloat(timeSeries[today]['4. close']).toFixed(2),
        change: changeNum.toFixed(2),
        changePercent: getChangePercent(parseFloat(changeNum),parseFloat(timeSeries[date[1]]['4. close'])),
        low: timeSeries[today]['3. low'],
        high: timeSeries[today]['2. high'],
        volume: parseInt(timeSeries[today]['5. volume']).toLocaleString(),
        lastPirce: parseFloat(timeSeries[date[1]]['4. close']).toFixed(2),
        timeStamp: timeStamp,
        date: date,
        dateShort: shortDate,
        priceRange: parseFloat(timeSeries[today]['3. low']).toFixed(2) + " - " + parseFloat(timeSeries[today]['2. high']).toFixed(2)
    }
}

function parseOneSet(data, indicator) {
    var date = [];
    var prices = [];
    var counter = 0;
    var Indicator = data["Meta Data"]["2: Indicator"];
    var name = indicator;
    var tempKey = "Technical Analysis: " + indicator;
    for (var day in data[tempKey]){
        counter ++;
        date.push(formatDate(day));
        prices.push(parseFloat(data[tempKey][day][indicator]));
        if (counter > 131) {
            break;
        }
    }
    return {
        symbol: data["Meta Data"]["1: Symbol"],
        indicator: Indicator,
        date: date,
        prices: prices,
        min: Math.min(...prices),
        max: Math.max(...prices)
    }

}

function parseTwoSet(data, indicator, indicatorOne, indicatorTwo){
    var date = [];
    var priceOne = [];
    var priceTwo = [];
    var counter = 0;
    var Indicator = data["Meta Data"]["2: Indicator"];
    var tempKey = "Technical Analysis: " + indicator;
    for (var day in data[tempKey]){
        counter ++;
        date.push(formatDate(day));
        priceOne.push(parseFloat(data[tempKey][day][indicatorOne]));
        priceTwo.push(parseFloat(data[tempKey][day][indicatorTwo]));
        if (counter > 131) {
            break;
        }
    }


    return {
        symbol: data["Meta Data"]["1: Symbol"],
        indicator: Indicator,
        date: date,
        priceOne: priceOne,
        priceTwo: priceTwo,
        min: Math.min(Math.min(...priceOne), Math.min(...priceTwo)),
        max: Math.max(Math.max(...priceOne), Math.max(...priceTwo))
}
}

function parseThreeSet(data, indicator, indicatorOne, indicatorTwo, indicatorThree){
    var date = [];
    var priceOne = [];
    var priceTwo = [];
    var priceThree = [];
    var counter = 0;
    var Indicator = data["Meta Data"]["2: Indicator"];
    var tempKey = "Technical Analysis: " + indicator;
    for (var day in data[tempKey]){
        counter ++;
        date.push(formatDate(day));
        priceOne.push(parseFloat(data[tempKey][day][indicatorOne]));
        priceTwo.push(parseFloat(data[tempKey][day][indicatorTwo]));
        priceThree.push(parseFloat(data[tempKey][day][indicatorThree]));
        if (counter > 131) {
            break;
        }
    }


    return {
        symbol: data["Meta Data"]["1: Symbol"],
        indicator: Indicator,
        date: date,
        priceOne: priceOne,
        priceTwo: priceTwo,
        priceThree: priceThree,
        min: Math.min(Math.min(...priceOne), Math.min(...priceTwo), Math.min(...priceThree)),
        max: Math.max(Math.max(...priceOne), Math.max(...priceTwo), Math.max(...priceThree))
    }
}

function formatDate(dateString){
    var temp = dateString.split("-");
    return temp[temp.length - 2] + "/" + temp[temp.length - 1];
}

function checkInput(input) {
    return input.trim().length > 0;
}

function checkOnBlur() {
    if(!checkInput($('#input-0').val())){
        $( "#autoComplete" ).addClass("has-error");
    }
    else{
        if ($( "#autoComplete" ).hasClass("has-error")){
            console.log("remove has-error");
            $( "#autoComplete" ).removeClass("has-error");
        }
    }
}


var emptyStar = true;
var subtitle = '<a class = "source" id="subtitle" target = "_blank" href="https://www.alphavantage.co/"> Source:Alpha Vantage </a>';

$( document ).ready(function() {

    var stockChartData, PriceData, SMAData, EMAData, STOCHData, RSIData, ADXData, CCIData, BBANDSData, MACDData;

    $( "#input-0" ).addClass("form-control");

    $("#input-0").attr("onblur","checkOnBlur()");
    $("#input-0").attr("onkeyup","checkOnBlur()");
    $("#input-0").attr("onfocus","checkOnBlur()");

    $('#toggleStarButton').click(function(){

        if( $( "#starSpan" ).attr('class') == "glyphicon glyphicon-star"){
            $( "#starSpan" ).removeAttr('style');
            $( "#starSpan" ).removeClass("glyphicon glyphicon-star");
            $( "#starSpan" ).attr('class', 'glyphicon glyphicon-star-empty');
        }
        else if($( "#starSpan" ).attr('class') == "glyphicon glyphicon-star-empty") {
            $( "#starSpan" ).css('color', '#FFCB4A');
            $( "#starSpan" ).attr('class', 'glyphicon glyphicon-star');
        }
    });

    $('#getQuote').click(function() {

        $('#progressBarTable').css("display", "block");
        $('#progressBarChart').css("display", "block");
        $('#progressBarhistoricalData').css("display", "block");
        $('#progressBarnewsTable').css("display", "block");

        $( "#infoTable" ).css("display", "none");
        $( "#stockChart" ).css("display", "none");
        $( "#historicalData" ).css("display", "none");
        $( "#newsTable" ).css("display", "none");


        var symbol = $('#input-0').val();
  
        $.ajax({
            type: 'GET',
            url: SERVER_URL,
            data: {
            "symbol": symbol
            },
            success: function(response) {
                // var priceVolume = parsePriceVolume(JSON.parse(response));
                // console.log(url);
                $( "#progressBarTable" ).css("display", "none");
                $( "#progressBarChart" ).css("display", "none");
                $( "#infoTable" ).css("display", "block");
                $( "#stockChart" ).css("display", "block");

                var priceResponse = JSON.parse(response);
                PriceData = parsePriceVolume(priceResponse);
                updateInfoTable(PriceData);
                drawPriceVolume(PriceData, subtitle);
                stockChartData = historicalData(priceResponse);
                console.log("stockChartData");
                console.log(stockChartData);
            }
        });

        //SMA
        $.ajax({
            type: 'GET',
            url: SERVER_URL,
            data: {
                "symbol": symbol,
                "indicator": "SMA"
            },

            success: function(response) {
                var SMAObj = JSON.parse(response);
                console.log(typeof(SMAObj));
                console.log(SMAObj);
                SMAData = parseOneSet(SMAObj, "SMA");
            }
        });


        //EMA
        $.ajax({
            type: 'GET',
            url: SERVER_URL,
            data: {
                "symbol": symbol,
                "indicator": "EMA"
            },

            success: function(response) {
                var EMAObj = JSON.parse(response);
                console.log("EMA response");
                console.log(typeof(EMAObj));
                console.log(EMAObj);
                EMAData = parseOneSet(EMAObj, "EMA");
            }
        });


        //STOCH
        $.ajax({
            type: 'GET',
            url: SERVER_URL,
            data: {
                "symbol": symbol,
                "indicator": "STOCH"
            },

            success: function(response) {
                var STOCHObj = JSON.parse(response);
                console.log("STOCH response");
                console.log(typeof(STOCHObj));
                console.log(STOCHObj);
                // function parseTwoSet(data, indicator, indicatorOne, indicatorTwo){
                STOCHData = parseTwoSet(STOCHObj, "STOCH", "SlowD", "SlowK");
            }
        });


        //RSI
        $.ajax({
            type: 'GET',
            url: SERVER_URL,
            data: {
                "symbol": symbol,
                "indicator": "RSI"
            },

            success: function(response) {
                var RSIObj = JSON.parse(response);
                console.log("RSI response");
                console.log(typeof(RSIObj));
                console.log(RSIObj);
                RSIData = parseOneSet(RSIObj, "RSI");
            }
        });


        //ADX
        $.ajax({
            type: 'GET',
            url: SERVER_URL,
            data: {
                "symbol": symbol,
                "indicator": "ADX"
            },

            success: function(response) {
                var ADXObj = JSON.parse(response);
                console.log("ADX response");
                console.log(typeof(ADXObj));
                console.log(ADXObj);
                ADXData = parseOneSet(ADXObj, "ADX");
            }
        });


        //CCI
        $.ajax({
            type: 'GET',
            url: SERVER_URL,
            data: {
                "symbol": symbol,
                "indicator": "CCI"
            },

            success: function(response) {
                var CCIObj = JSON.parse(response);
                console.log("CCI response");
                console.log(typeof(CCIObj));
                console.log(CCIObj);
                CCIData = parseOneSet(CCIObj, "CCI");
            }
        });

        //BBANDS
        $.ajax({
            type: 'GET',
            url: SERVER_URL,
            data: {
                "symbol": symbol,
                "indicator": "BBANDS"
            },

            success: function(response) {
                var BBANDSObj = JSON.parse(response);
                console.log("BBANDS response");
                console.log(typeof(BBANDSObj));
                console.log(BBANDSObj);
                BBANDSData = parseThreeSet(BBANDSObj, "BBANDS", "Real Lower Band", "Real Upper Band",
                    "Real Middle Band" );
            }
        });

        //MACD
        $.ajax({
            type: 'GET',
            url: SERVER_URL,
            data: {
                "symbol": symbol,
                "indicator": "MACD"
            },

            success: function(response) {
                var MACDObj = JSON.parse(response);
                console.log("MACD response");
                console.log(typeof(MACDObj));
                console.log(MACDObj);
                MACDData = parseThreeSet(MACDObj, "MACD", "MACD_Signal", "MACD_Hist",
                    "MACD" );
            }
        });


        //NEWS
        $.ajax({
            type: 'GET',
            url: SERVER_URL,
            data: {
                "symbol": symbol,
                "news": "yes"
            },

            success: function(response) {

                var newsJson = response;
                console.log("newsJson");
                console.log(typeof(newsJson));
                console.log(newsJson);
                $('#progressBarnewsTable').css("display", "none");
                $( "#newsTable" ).css("display", "block");

                drawNewsTable(newsJson);

            }
        });
    });


    $('#Price').click(function() {
        $('#Price').addClass('active');
        $('#SMA').removeClass('active');
        $('#EMA').removeClass('active');
        $('#STOCH').removeClass('active');
        $('#RSI').removeClass('active');
        $('#ADX').removeClass('active');
        $('#CCI').removeClass('active');
        $('#BBANDS').removeClass('active');
        $('#MACD').removeClass('active');
 
        drawPriceVolume(PriceData, subtitle);
    });


    $('#SMA').click(function() {
        $('#SMA').addClass('active');
        $('#Price').removeClass('active');
        $('#EMA').removeClass('active');
        $('#STOCH').removeClass('active');
        $('#RSI').removeClass('active');
        $('#ADX').removeClass('active');
        $('#CCI').removeClass('active');
        $('#BBANDS').removeClass('active');
        $('#MACD').removeClass('active');

        console.log("SMAData");
        console.log(SMAData);
        drawOneSet(SMAData, subtitle, "SMA");
    });


    $('#EMA').click(function() {
        $('#EMA').addClass('active');
        $('#Price').removeClass('active');
        $('#SMA').removeClass('active');
        $('#STOCH').removeClass('active');
        $('#RSI').removeClass('active');
        $('#ADX').removeClass('active');
        $('#CCI').removeClass('active');
        $('#BBANDS').removeClass('active');
        $('#MACD').removeClass('active');

        console.log("EMAData");
        console.log(EMAData);
        drawOneSet(EMAData, subtitle, "EMA");
    });

    $('#STOCH').click(function() {
        $('#EMA').removeClass('active');
        $('#Price').removeClass('active');
        $('#SMA').removeClass('active');
        $('#STOCH').addClass('active');
        $('#RSI').removeClass('active');
        $('#ADX').removeClass('active');
        $('#CCI').removeClass('active');
        $('#BBANDS').removeClass('active');
        $('#MACD').removeClass('active');

        console.log("STOCHData");
        console.log(STOCHData);
        drawTwoset(STOCHData, subtitle, "STOCH", "SlowD", "SlowK");
    });

    $('#RSI').click(function() {
        $('#EMA').removeClass('active');
        $('#Price').removeClass('active');
        $('#SMA').removeClass('active');
        $('#STOCH').removeClass('active');
        $('#RSI').addClass('active');
        $('#ADX').removeClass('active');
        $('#CCI').removeClass('active');
        $('#BBANDS').removeClass('active');
        $('#MACD').removeClass('active');

        console.log("RSIData");
        console.log(RSIData);
        drawOneSet(RSIData, subtitle, "RSI");
    });

    $('#ADX').click(function() {
        $('#EMA').removeClass('active');
        $('#Price').removeClass('active');
        $('#SMA').removeClass('active');
        $('#STOCH').removeClass('active');
        $('#RSI').removeClass('active');
        $('#ADX').addClass('active');
        $('#CCI').removeClass('active');
        $('#BBANDS').removeClass('active');
        $('#MACD').removeClass('active');

        console.log("ADXData");
        console.log(ADXData);
        drawOneSet(ADXData, subtitle, "ADX");
    });

    $('#CCI').click(function() {
        $('#EMA').removeClass('active');
        $('#Price').removeClass('active');
        $('#SMA').removeClass('active');
        $('#STOCH').removeClass('active');
        $('#RSI').removeClass('active');
        $('#ADX').removeClass('active');
        $('#CCI').addClass('active');
        $('#BBANDS').removeClass('active');
        $('#MACD').removeClass('active');

        console.log("CCIData");
        console.log(CCIData);
        drawOneSet(CCIData, subtitle, "CCI");
    });

    $('#BBANDS').click(function() {
        $('#EMA').removeClass('active');
        $('#Price').removeClass('active');
        $('#SMA').removeClass('active');
        $('#STOCH').removeClass('active');
        $('#RSI').removeClass('active');
        $('#ADX').removeClass('active');
        $('#CCI').removeClass('active');
        $('#BBANDS').addClass('active');
        $('#MACD').removeClass('active');

        console.log("BBANDSData");
        console.log(BBANDSData);
        drawThreeset(BBANDSData, subtitle, "BBANDS", "Real Lower Band", "Real Upper Band", "Real Middle Band");
    });

    $('#MACD').click(function() {
        $('#EMA').removeClass('active');
        $('#Price').removeClass('active');
        $('#SMA').removeClass('active');
        $('#STOCH').removeClass('active');
        $('#RSI').removeClass('active');
        $('#ADX').removeClass('active');
        $('#CCI').removeClass('active');
        $('#BBANDS').removeClass('active');
        $('#MACD').addClass('active');

        console.log("MACDData");
        console.log(MACDData);
        drawThreeset(MACDData, subtitle, "MACD", "MACD_Signal", "MACD_Hist", "MACD");
    });


    $('#historicalDataTab').click(function() {
        console.log("historicalDataTab");
        console.log(stockChartData);
        $('#progressBarhistoricalData').css("display", "none");
        $( "#historicalData" ).css("display", "block");
        drawhistoricalChart(stockChartData);
    });
});
