$(document).ready(function() {
    $('#calendar').fullCalendar({
        customButtons: {
            save: {
                text: 'save',
                click: function() {
                    var clientEvents = $('#calendar').fullCalendar('clientEvents');
                    console.log('All events', clientEvents);

                    eventsToBeChanged.forEach(function(event) {
                        event.log();
                        //event.title = "Test";
                        delete event.changed;
                        console.log('Puttin Event: ', JSON.stringify(event));
                        $.ajax({
                            url: url + userID + "/events/" + event.id,
                            contentType: 'application/json',
                            type: "PUT",
                            data: JSON.stringify(JSON.stringify(event)),
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

                    /*
                    clientEvents.forEach(function(calEvent) {
                        event = new Event();
                        event.setCalValues(calEvent);
                        if(event.changed) {
                            console.log('Puttin Event: ', JSON.stringify(event));
                            $.ajax({
                                url: url + userID + "/events/" + event.id,
                                contentType: 'application/json',
                                type: "PUT",
                                data: JSON.stringify(JSON.stringify(event)),
                                success: function (res) {
                                    console.log('Status 200');
                                    console.log(res);
                                },
                                error: function (res) {
                                    console.log('Error getting Events: ', res.status + ' ' + res.statusText);
                                    console.log('Code: ', res.responseJSON.code, ', Description: ', res.responseJSON.description);
                                }
                            });
                        }
                    })
                    */
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
        eventClick: function(data, event, view) {

            if($('.event-form').length > 0) {
                //if a form has actually already been opened
                var formEvent = new Event();
                formEvent.setFormValues();
                formEvent.changed = true;
                formEvent.storeEvent();

                var clientEvents = $('#calendar').fullCalendar('clientEvents');

                clientEvents.forEach(function(calEvent) {
                    event = new Event();
                    event.setCalValues(calEvent);
                    if(event.id == formEvent.id) {
                        event.log();
                    }

                })
            }

            //console.log('Event values: ', data);
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
                'position.target': this,
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

            /*


            $( ".event-form").children().each( function(index, element ){
                $(element).keyup(function() {
                    if(!$(element).is('textarea')) {
                        tooltip.hide()
                    }
                })
            });

            */

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