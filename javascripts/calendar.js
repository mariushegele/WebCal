$(document).ready(function() {
    $('#calendar').fullCalendar({
        customButtons: {
            save: {
                text: 'save',
                click: function() {
                    eventsToBeChanged.forEach(function(event) {
                        console.log('To Be Put: ', JSON.stringify(event));
                        //event.title = "Test";
                        delete event.changed;
                        var start = moment(event.start);
                        var end = moment(event.end);
                        event.start = start.format('YYYY-MM-DD')  + 'T' + start.format('HH:mm');
                        event.end = end.format('YYYY-MM-DD')  + 'T' + end.format('HH:mm');
                        console.log('Puttin Event: ', JSON.stringify(event));
                        $.ajax({
                            url: url + userID + "/events/" + event.id,
                            contentType: 'application/json',
                            type: "PUT",
                            data: JSON.stringify(event),
                            success: function (res) {
                                console.log('Status 200');
                                console.log(res);
                            },
                            error: function (res) {
                                console.log('Error getting Events: ', res.status + ' ' + res.statusText);
                                console.log('Code: ', res.responseJSON.code, ', Description: ', res.responseJSON.description);
                            }
                        });
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
                var formEvent = new Event();
                formEvent.setFormValues();
                formEvent.storeEvent();
                formEvent.updateCalEvent();
            }

            console.log('Event values: ', data);
            //console.log('View type: ', view);
            //console.log('Event: ', event);
            //console.log("Position: ", event.pageX);

            var content = "<div id='" + data._id + "'>" + $('#eventForm-template').html() + "</div>";

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

            if(data.description.categories.length > 0) {
                $('.category').val(data.description.categories);
            }

            if(data.allDay) {
                data.end.subtract('1', 'minute');
            }

            $('.start-date').val(data.start.format('YYYY-MM-DD'));
            $('.end-date').val(data.end.format('YYYY-MM-DD'));

            $('.start-time').val(data.start.format('HH:mm'));
            $('.end-time').val(data.end.format('HH:mm'));

            $('.location').val(data.location);
            $('.organizer').val(data.description.organizer);
            $('.webpage').val(data.description.webpage);
            $('.imageurl').val(data.description.imageurl);




        },
        dayClick: function() {
            tooltip.hide()
        },
        eventDrop: function( event, delta, revertFunc, jsEvent, ui, view ) {
            var droppedEvent = new Event();
            droppedEvent.setCalValues(event);
            droppedEvent.log();
            if(droppedEvent.allday) {
                //var startHelper = event.start.format('YYYY-MM-DD')  + 'T' + event.start.format('HH:mm');
                var startHelper = event.start.format('YYYY-MM-DDTHH:mm');
                var endHelper = event.end.format('YYYY-MM-DD')  + 'T' + event.end.format('HH:mm');
                event.start = startHelper;
                event.end = endHelper;
            }
            droppedEvent.storeEvent();
            droppedEvent.updateCalEvent();
        },
        eventResize: function(event, delta, revertFunc) {
            var resizedEvent = new Event();
            resizedEvent.setCalValues(event);
            resizedEvent.storeEvent();
            resizedEvent.updateCalEvent();

        },
        eventResizeStart: function() { tooltip.hide() },
        eventDragStart: function() { tooltip.hide() },
        viewDisplay: function() { tooltip.hide() },
        events: function(start, end, timezone, callback) {
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
                        //if(event.sortByInterval(start, end)) sortedEvents.push(event);
                        event.changed = false;
                        if (moment(event.start).isBetween(start, end)) calEvents.push(event.formatForCal());
                    })

                    console.log('Cal: ', calEvents);
                    callback(calEvents);
                },
                error: function (res) {
                    console.log('Error getting Events: ', res );
                    callback();
                    //callback(true, res);
                    /*
                    callback(true, {
                        code: 'X',
                        description: "Connection timeout, while waiting for Entries"
                    });
                    */
                }
            });
        }
    })
})