var express = require('express');
var url = require("url");
var https = require("https");
var http = require("http");
var parsingXML = require("xml2js");


var urlGeneral = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=full&symbol=";

var lookUpUrl = "http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input=";
var apiKey = "&apikey=1U0LNTNHEUS2H70C";

var app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


function requestData(fetchURL, res){
    var data = "";
    https.get(fetchURL, function (response) {
        response.on("data",function (responseData) {
            data += responseData ;
        });

        response.on("end",function () {
            res.send(data);
            res.end();
        });
    });
}




app.get("/",function (req,res) {
    var queryData = url.parse(req.url, true).query;
    var data = "";
    if (queryData.symbol && !(queryData.indicator) && !(queryData.news) && !(queryData.short)) {
        var symbol = queryData.symbol;

        requestData(urlGeneral + symbol + apiKey, res);
    }
    else if (queryData.short == 'yes' && queryData.symbol && !(queryData.indicator) && !(queryData.news)){
        console.log("short data");
        var symbol = queryData.symbol;
        requestData("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + symbol + apiKey, res);
    }
    else if (queryData.symbol && queryData.indicator){
        var indicatorUrl = 'https://www.alphavantage.co/query?function=' + queryData.indicator + '&symbol='+ queryData.symbol +'&interval=daily&time_period=10&series_type=open&apikey=1U0LNTNHEUS2H70C';
        if (queryData.indicator === "BBANDS"){
            indicatorUrl = indicatorUrl + '&nbdevdn=3&nbdevup=3';
        }
        requestData(indicatorUrl, res);
    }

    else if (!(queryData.symbol) && !(queryData.indicator) && queryData.autoComplete){
        // requestData(lookUpUrl+queryData.autoComplete, res);
        var data = "";
        http.get(lookUpUrl+queryData.autoComplete, function (response) {
            response.on("data",function (responseData) {
                data += responseData ;
            });

            response.on("end",function () {
                res.send(data);
                res.end();
            });
        });
    }

    else if (queryData.symbol && (queryData.news === 'yes')){
        // requestData('https://seekingalpha.com/api/sa/combined/' + queryData.symbol + '.xml', res);
        var data = "";
        var newsUrl = 'https://seekingalpha.com/api/sa/combined/' + queryData.symbol.toUpperCase() + '.xml';
        console.log(newsUrl);
        https.get(newsUrl, function (response) {
            response.on("data",function (responseData) {
                data += responseData ;
            });

            response.on("end",function () {
                console.log(data);
                parsingXML.parseString(data, function (err, xmlStr) {
                    res.send(xmlStr);
                    res.end();
                });
            });
        });
    }
    else {
    }
});

//app.listen(8080);
 app.listen(process.env.PORT);
