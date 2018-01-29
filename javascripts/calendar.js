$(document).ready(function() {
    $('#calendar').fullCalendar({
        customButtons: {
            save: {
                text: 'save',
                click: function() {
                    eventsToBeChanged.forEach(function(event) {
                        if(event.changed === 'new') {
                            if (event.allday === true) {
                                var end = moment(event.end);
                                event.end = end.subtract('1', 'day').format('YYYY-MM-DD') + 'T23:59';
                            }
                            var postEvent = event;
                            delete postEvent.changed;
                            delete postEvent.id;
                            console.log('To Be Posted: ', JSON.stringify(postEvent));
                            $.ajax({
                                url: url + userID + "/events",
                                contentType: 'application/json',
                                type: "POST",
                                data: JSON.stringify(postEvent),
                                success: function (res) {
                                    console.log('Status 200');
                                    console.log(res);
                                    eventsToBeChanged.splice(eventsToBeChanged.indexOf(event));
                                },
                                error: function (res) {
                                    console.log('Error posting Event: ', res.status + ' ' + res.statusText);
                                    console.log('Code: ', res.responseJSON.code, ', Description: ', res.responseJSON.description);
                                }
                            });
                        } else  if(event.changed === 'delete') {
                            console.log('Delete this event: ', event);
                            $.ajax({
                                url: url + userID + "/events/" + event.id,
                                contentType: 'application/json',
                                type: "DELETE",
                                success: function (res) {
                                    console.log('Status 200');
                                    eventsToBeChanged.splice(eventsToBeChanged.indexOf(event));
                                },
                                error: function (res) {
                                    console.log('Error posting Event: ', res.status + ' ' + res.statusText);
                                    console.log('Code: ', res.responseJSON.code, ', Description: ', res.responseJSON.description);
                                }
                            });

                        } else if(event.changed === true){
                            delete event.changed;

                            console.log('Puttin Event: ', JSON.stringify(event));
                            console.log('ID: ', event.id);
                            $.ajax({
                                url: url + userID + "/events/" + event.id,
                                contentType: 'application/json',
                                type: "PUT",
                                data: JSON.stringify(event),
                                success: function (res) {
                                    console.log('Status 200');
                                    console.log(res);
                                    eventsToBeChanged.splice(eventsToBeChanged.indexOf(event));
                                },
                                error: function (res) {
                                    console.log('Error putting Event: ', res.status + ' ' + res.statusText);
                                    console.log('Code: ', res.responseJSON.code, ', Description: ', res.responseJSON.description);
                                }
                            });
                        }
                    })
                }
            },
            today: {
                text: 'today',
                click: function() {
                    $('#calendar').fullCalendar('today');
                }
            }
        },
        header: {
            left: 'prev,next today save',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        defaultView: 'month',
        editable: true,
        selectable: true,
        timezone: 'local',
        weekNumberTitle: 'W',
        locale: 'de',
        timeFormat: 'HH(:mm)',
        defaultAllDayEventDuration: {23:59},
        eventClick: function(data, event, view) {

            if($('.event-form').length > 0) {
                //if a form has actually already been opened
                if($('.event-div').parent().attr('id') !== 'delete') { // if it is not an array thats to be deleted
                    var formEvent = new Event();
                    formEvent.setFormValues();
                    formEvent.storeEvent();
                    formEvent.updateCalEvent();
                }
            }

            console.log('Event values: ', data);
            //console.log('View type: ', view);
            console.log('Event: ', event);
            //console.log("Position: ", event.pageX);

            var content = "<div id='" + data._id + "'>" + $('#eventForm-template').html() + "</div>";



            toggleTooltip(data, event);

            /*

            $(function() {
                $( ".start-date" ).datepicker({dateFormat: 'yy-mm-dd'});
                $(".end-date").datepicker({dateFormat: 'yy-mm-dd'});
                $( ".start-time" ).timepicker({ 'timeFormat': 'H:i' });
                $(".end-time").timepicker({ 'timeFormat': 'H:i' });
            });

            tooltip.set({
                'position.target': [event.clientX, event.clientY],
                'content.text': content,
                'position.my': 'right center',
                'position.at': 'left center'
            })

            if(event.pageX < 1.7 * $('.event-div').width()) {
                tooltip.set({
                    'position.my': 'left center',
                    'position.at': 'right center'
                })
            }

            tooltip.reposition(event)
                .show(event);

            $( ".event-form").children().each( function(index, element ){
                $(element).keypress(function(e) {
                    if(e.which == 13 && !$(element).is('textarea')){
                            tooltip.hide()
                    }
                })
            });

            $('.allday').change(function() {
                //allday events must start and finish at specific time
                if(this.checked) {
                    $('.start-time').val('00:00').prop('disabled', true);
                    $('.end-time').val('23:59').prop('disabled', true);
                } else {
                    //default non allday events to this period
                    $('.start-time').val('12:00').prop('disabled', false);
                    $('.end-time').val('13:00').prop('disabled', false);
                }
            })

            //Fill Event Form

            $('.title').val(data.title);

            if(data.allDay) {
                $('.allday').prop('checked', true);
            } else {
                $('.allday').prop('checked', false);
            }

            $('.status').val(data.description.status);

            if(data.description.hasOwnProperty('categories')) $('.category').val(data.description.categories);

            if(data.allDay) {
                data.end.subtract('1', 'minute');
            }

            $('.start-date').val(data.start.format('YYYY-MM-DD'));
            $('.end-date').val(data.end.format('YYYY-MM-DD'));

            $('.start-time').val(data.start.format('HH:mm'));
            $('.end-time').val(data.end.format('HH:mm'));

            if(data.description.hasOwnProperty('categories')) $('.location').val(data.location);
            if(data.description.hasOwnProperty('categories')) $('.organizer').val(data.description.organizer);
            if(data.description.hasOwnProperty('categories')) $('.webpage').val(data.description.webpage);
            if(data.description.hasOwnProperty('categories')) $('.imageurl').val(data.description.imageurl);

            */


        },
        dayClick: function(date, jsEvent, view) {
            if($('#qtip-fullcalendar').is(':visible')) { //hide tooltip else create new event
                var formEvent = new Event();
                formEvent.setFormValues();
                formEvent.storeEvent();
                formEvent.updateCalEvent();
                tooltip.hide()
            } else { //Create a New Event
                var newEvent = new Event();
                newEvent.setDefault();
                newEventIterator++;
                newEvent.id = 'New' + newEventIterator;
                newEvent.changed = 'new';
                var clickedDate = moment(date).format(dateFormat) + 'T' + moment(date).format(timeFormat);
                var end = moment(date).format(dateFormat) + 'T' + moment(date).add('1', 'hour').format(timeFormat);
                newEvent.start = clickedDate;
                newEvent.end = end;
                if(view.name = 'month') {
                    newEvent.allday = true;
                    newEvent.end = moment(date).format(dateFormat) + 'T23:59';
                }
                newEvent.storeEvent();
                console.log('Created Event: ', JSON.stringify(newEvent));
                $('#calendar').fullCalendar( 'renderEvent', newEvent.formatForCal());
                toggleTooltip(newEvent.formatForCal(), jsEvent);
            }
        },
        eventDrop: function( event, delta, revertFunc, jsEvent, ui, view ) {
            var droppedEvent = new Event();
            droppedEvent.setCalValues(event);
            droppedEvent.log();
            if(droppedEvent.allday) {
                //var startHelper = event.start.format('YYYY-MM-DD')  + 'T' + event.start.format('HH:mm');
                droppedEvent.start = event.start.format('YYYY-MM-DD') + 'T' + event.start.format('HH:mm');
                droppedEvent.end = event.end.format('YYYY-MM-DD')  + 'T' + event.end.format('HH:mm');
            }
            droppedEvent.changed = true;
            droppedEvent.storeEvent();
            droppedEvent.updateCalEvent();
        },
        eventResize: function(event, delta, revertFunc) {
            var resizedEvent = new Event();
            resizedEvent.setCalValues(event);
            if(resizedEvent.allday) {
                //var startHelper = event.start.format('YYYY-MM-DD')  + 'T' + event.start.format('HH:mm');
                resizedEvent.start = event.start.format('YYYY-MM-DD') + 'T' + event.start.format('HH:mm');
                resizedEvent.end = event.end.format('YYYY-MM-DD')  + 'T' + event.end.format('HH:mm');
            }
            resizedEvent.changed = true;
            resizedEvent.storeEvent();
            resizedEvent.updateCalEvent();

        },
        eventResizeStart: function() { tooltip.hide() },
        eventDragStart: function() { tooltip.hide() },
        viewDisplay: function() { tooltip.hide() },
        events: function(start, end, timezone, callback) {

            /*
            var offlineEvents = [
                {
                    "id": 1202,
                    "title": " Christmas Feast",
                    "location": "Stuttgart",
                    "organizer": "dhbw@bisswanger.de",
                    "start": "2018-01-24T18:00",
                    "end": "2018-01-24T23:30",
                    "status": "Busy",
                    "allday": false,
                    "webpage": "http://www.bisswanger.de/",
                    "imagedata": "data:ContentType;base64,ImageContent",
                    "categories": [
                        {
                            "id": 3
                        }
                    ]

                },


                {
                    "id": 1201,
                    "title": " Christmas Feast",
                    "location": "Stuttgart",
                    "organizer": "dhbw@bisswanger.de",
                    "start": "2018-01-22T00:00",
                    "end": "2018-01-22T23:59",
                    "status": "Busy",
                    "allday": true,
                    "webpage": "http://www.bisswanger.de/",
                    "imagedata": "data:ContentType;base64,ImageContent",
                    "categories": [
                        {
                            "id": 3
                        }
                    ]

                },

                {"id":1200,"title":"dvf","location":"sc","organizer":"test@dsad.com","start":"2018-01-24T01:00","end":"2018-01-24T02:00","status":"Busy","allday":false,"webpage":"google.de"}



            ];

            var calEvents = [];

            offlineEvents.forEach(function (dbEvent) {
                var event = new Event(dbEvent);
                //if(event.sortByInterval(start, end)) sortedEvents.push(event);
                event.changed = false;
                if (moment(event.start).isBetween(start, end)) calEvents.push(event.formatForCal());
            })

            console.log('Cal: ', calEvents);
            callback(calEvents);

            */

            $.ajax({
                url: url + userID + "/events",
                dataType: 'json',
                type: "GET",
                success: function (res) {
                    console.log(res);
                    console.log('Status 200');
                    var calEvents = [];

                    res.forEach(function (dbEvent) {
                        var event = new Event(dbEvent);
                        event.changed = false;
                        if (moment(event.start).isBetween(start, end)) calEvents.push(event.formatForCal());
                    })

                    console.log('Cal: ', calEvents);
                    callback(calEvents);
                },
                error: function (res) {
                    console.log('Error getting Events: ', res );
                    callback();
                }
            });
        }
    })
})

function toggleTooltip(data, jsEvent) {
    var content = "<div id='" + data._id + "'>" + $('#eventForm-template').html() + "</div>";

    $(function() {
        $( ".start-date" ).datepicker({dateFormat: 'yy-mm-dd'});
        $(".end-date").datepicker({dateFormat: 'yy-mm-dd'});
        $( ".start-time" ).timepicker({ 'timeFormat': 'H:i' });
        $(".end-time").timepicker({ 'timeFormat': 'H:i' });
    });

    tooltip.set({
        'position.target': [jsEvent.clientX, jsEvent.clientY],
        'content.text': content,
        'position.my': 'right center',
        'position.at': 'left center'
    })

    //console.log('Position tooltip at: ', jsEvent.clientX, 'relative to Page width: ', $('.event-div').width());

    if(jsEvent.clientX < 1.7 * $('.event-div').width()) {
        tooltip.set({
            'position.my': 'left center',
            'position.at': 'right center'
        })
    }

    tooltip.reposition(event)
        .show(event);

    $( ".event-form").children().each( function(index, element ){
        $(element).keypress(function(e) {
            if(e.which == 13 && !$(element).is('textarea')){
                tooltip.hide()
            }
        })
        $("input[type='text']").click(function () {
            $(this).select();
        });
    });

    $('.allday').change(function() {
        //allday events must start and finish at specific time
        if(this.checked) {
            $('.start-time').val('00:00').prop('disabled', true);
            $('.end-time').val('23:59').prop('disabled', true);
        } else {
            //default non allday events to this period
            $('.start-time').val('12:00').prop('disabled', false);
            $('.end-time').val('13:00').prop('disabled', false);
        }
    })

    //Fill Event Form

    $('.title').val(data.title);

    if(data.allDay) {
        $('.allday').prop('checked', true);
    } else {
        $('.allday').prop('checked', false);
    }

    $('.status').val(data.description.status);

    if(data.description.hasOwnProperty('categories')) $('.category').val(data.description.categories);

    if(data.allDay) {
        data.end.subtract('1', 'minute');
    }

    $('.start-date').val(data.start.format('YYYY-MM-DD'));
    $('.end-date').val(data.end.format('YYYY-MM-DD'));

    $('.start-time').val(data.start.format('HH:mm'));
    $('.end-time').val(data.end.format('HH:mm'));

    if(data.description.hasOwnProperty('categories')) $('.location').val(data.location);
    if(data.description.hasOwnProperty('categories')) $('.organizer').val(data.description.organizer);
    if(data.description.hasOwnProperty('categories')) $('.webpage').val(data.description.webpage);
    if(data.description.hasOwnProperty('categories')) $('.imageurl').val(data.description.imageurl);

    $('.title').select();
}