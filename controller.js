var url = "http://dhbw.ramonbisswanger.de/calendar/"
var userID="47";

function getEvents(callback) {
    $.ajax({
        url: url + userID + "/events",
        dataType: 'json',
        type: "GET",
        success: function (res) {
            console.log(res);
            console.log('Status 200');
            callback(false, res);
        },
        error: function () {
            callback(true, res);
            /*
            callback(true, {
                code: 'X',
                description: "Connection timeout, while waiting for Entries"
            });
            */
        }
    });
}


/*
console.log('getting Events');
$.ajax({
    url: url + userID + "/events",
    dataType: "json",
    type: "GET",
    success: function(res) {
        console.log(res);
        if(res.status == 200) {
            console.log('Status 200');
            callback(false,res);
        } else {
            callback(true, res);
        }
    },
    error: function () { callback(true, 'X', "Connection timeout, while waiting for Entries"); }
});
*/

function formatEvents(requestType, eventsArr, callback) {
    switch(requestType) {
        case 'GET':
            var modEvents = [];
            eventsArr.forEach(function(event) {
                var modEvent = {
                    "title": event.title,
                    "allDay": event.allday,
                    "start": event.start,
                    "end": event.end,
                    "id": event.id,
                    "location": event.location,
                    "description": {
                        "id": event.id,
                        "organizer": event.organizer,
                        "imageurl": event.imageurl,
                        "status": event.status,
                        "webpage": event.webpage,
                        "categories": event.categories
                    }
                };
                modEvents.push(modEvent);
            });

            console.log('Modified Events Array: ', modEvents);

            callback(modEvents);

            break;
    }
}

function handleChange(obj) {
    console.log('handle this change', obj);
    console.log('ID: ', obj.id, ' new Property: ', $(obj).val());
}

$(document).ready(function() {
    //setup qtip
    var tooltip = $('<div/>').qtip({
        id: 'fullcalendar',
        prerender: true,
        content: {
            text: ' ',
            title: {
                button: true
            }
        },
        position: {
            my: 'bottom center',
            at: 'top center',
            target: 'mouse',
            viewport: $('#fullcalendar'),
            adjust: {
                mouse: false,
                scroll: false
            }
        },
        show: false,
        hide: false,
        style: 'qtip-light'
    }).qtip('api');



    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        defaultView: 'month',
        editable: true,
        selectable: true,
        timezone: 'local',
        weekNumberTitle: 'W',
        locale: 'de',
        eventClick: function(data, event, view) {
            var content =
                '<input type="text" class="form-input" id="' + data.id + '" value="' + data.title + '" onchange="handleChange(this)">'
                + '<p><b>Start:</b> '+ moment(data.start).format('HH:mm')+'<br />'
                + (data.end && '<p><b>End:</b> '+ moment(data.end).format('HH:mm') +'</p>' || '')
                + (data.location && '<p><b>Location:</b> '+ data.location +'</p>' || '')
                + '<p><b>Description:</b> '+ JSON.stringify(data.description) +'</p>';

            tooltip.set({
                'position.target': this,
                'content.text': content
            })
                .reposition(event).show(event);
        },
        dayClick: function() { tooltip.hide() },
        eventResizeStart: function() { tooltip.hide() },
        eventDragStart: function() { tooltip.hide() },
        viewDisplay: function() { tooltip.hide() },
        events: [
            {
                "title": 'testtitle',
                "allDay": false,
                "start": '2017-12-20T16:20',
                "end": '2017-12-20T16:20',
                "id": '890',
                "description": {
                    "id": '890',
                    "organizer": 'testorganizer',
                    "imageurl": 'testimageurl',
                    "status": 'teststatus',
                    "webpage": 'testwebpage',
                    "categories": 'testcategories'
                }
            }
            // more events here
        ],
    })

    getEvents(function(err, res) {
        console.log('Im called');
        if(err == true) {
            console.log(res.code + ': ' + res.description);
        } else {
            console.log('Success getting entries: ', res);

            //format events
            formatEvents('GET', res, function(events) {
                $('#calendar').fullCalendar( 'renderEvents', events)
            });
        }
    })

    //set default date
    //$('#month').val(moment().format('MMM YY'));

    //fill calendar
    //create 5 trs (5 weeks)33

    /*
    for(var i = 1; i < 6; i++) {
        var tr = document.createElement('tr');
        tr.setAttribute('id', 'R' + i);
        document.getElementById('calendarBody').appendChild(tr);
    }



    //check for startDate and set property
    moment().startOf('month').weekday();

    moment().startOf('month').format('DD');
    moment().endOf('month').format('DD');

    getEvents(function(err, res) {
       if(err == true) {
           console.log(res.code + ': ' + res.description);
       } else {
           console.log('Success getting entries: ', res);
       }
   })

   */
});