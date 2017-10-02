var data = [];

function getpostrequest(daypicker, monthpicker) {
    var daypicker = daypicker;
    var monthpicker = monthpicker;
    var inputdata = {
        "endpoint": "getRouterTrafficById",
        "router_id": "r00103",
        "year": 2017,
        "month": monthpicker,
        "date_from": daypicker,
        "to": daypicker,
    };
    $.ajax({
        url: 'http://rwifi.r2h2hk.com/a',
        type: 'post',
        crossDomain: true,
        data: JSON.stringify(inputdata),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(content) {
            console.log("The JSON has benen retrived!");
            ///GET THE RESULT OBJECT//////
            count = new Array(24).fill(0);
            hourlabel = ["00", "01", "02", "03", "04", "05", "06", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"]

            //  foreach total number of records
            //  foreach logs of each record
            content.data.forEach(function(aRecord) {
                aRecord.logs.forEach(function(aLog, index) {
                    //count the no. of "init"
                    //console.log(aLog.ref_id);
                    if (aLog.ref_id == "init") {
                        //console.log(aLog.created_at); //show the time created
                        var myDate = new Date(aLog.created_at);
                        var myHour = myDate.getHours(); //show the hour created
                        count[myHour]++; //count the no. of "init"
                        //console.log(count);
                        //console.log(myHour); //display the hour clock
                        data.push({
                            labels: hourlabel,
                            datasets: [{
                                data: count,
                                label: "Traffic",
                                type: "line",
                                lineTension: 0,
                                borderWidth: 3,
                                //borderColor: "#3e95cd",
                                backgroundColor: "#3e95cd",
                                fill: 1,
                            }]
                        })
                    }
                })
            })
            console.log("data[0]", data);

            ///////plot graph///////
            var ctx = document.getElementById("myChart").getContext("2d");
            var myChart = new Chart(ctx, {
                data: data[0],
                options: {
                    scales: {
                        xAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'Hour'
                            }
                        }],
                        yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'No. of connection'},
                                ticks: {
                                  stepSize: 1
                                }
                        }]
                    }
                }
            });
            //////end of graph plotting////////
        }
    })
}


getpostrequest(13, 9); //call the function with month and day parameters

///////datepicker init///////
$(function() {
    $('input[name="choosedate"]').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true
    }, function(start, end, label) {
      data = [];
        var date1 = new Date(start);
        moment(date1).toDate();
        monthpicker = date1.getMonth() + 1;
        daypicker = date1.getDate();
        console.log("This is the month and day");
        console.log(monthpicker); //show the month
        console.log(daypicker); //show the day
        getpostrequest(daypicker,monthpicker);
    });
})
