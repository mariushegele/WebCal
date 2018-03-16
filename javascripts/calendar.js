$(document).ready(function() {
    var c = 0;
    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today save',
            center: 'title',
            right: 'month,agendaWeek,agendaDay,listAll settings'
        },
        views: {
            listAll: {    //edit such that it lists past 10 years
                type: 'list',
                title: 'YYYY-MM',
                buttonText: 'list',
                timeFormat: 'HH:mm',
                visibleRange: function(currentDate) {
                    return {
                        start: currentDate.clone().subtract(15, 'years'),
                        end: currentDate.clone().add(10, 'years') // exclusive end, so 3
                    };
                },
            }
        },
        customButtons: {
            settings: {
                today: {
                    text: 'today',
                    click: function () {
                        $('#calendar').fullCalendar('today');
                    }
                },
                text: ' ',
                click: function () {
                    console.log('Toggle context menu');
                    if (c === 0) {
                        var settingsTemplate = $('#settings-template').html();
                        $('.fc-clear')
                            .append(settingsTemplate)
                            .css("padding-top", "10px")
                            .css("margin-bottom", "45px")
                            .css("clear", "none");
                        $('#settings').css("float", "right");
                    }
                    ;
                    c++;
                    $('.fc-clear').toggle();
                }
            },
            save: {
                text: 'save',
                click: function () {
                    if (catEditMode) {
                        saveCategories();
                    } else {
                        saveEvents();
                    }
                }
            }
        },
        defaultView: 'month',
        visibleRange: function(currentDate) {
            return {
                start: currentDate.clone().startOf('month'),
                end: currentDate.clone().endOf('month') // exclusive end, so 3
            };
        },
        viewRender: function(view) {
            if(view.name === 'listAll') {
                window.setTimeout(function(){
                    $("#calendar").find('.fc-toolbar > div > h2')
                        .empty().append("All Events");
                },0);
            }
        },
        eventBackgroundColor: '#047cc0',
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
                if($('.event-div').parent().attr('id') !== 'delete') {
                    // if it is not an array thats to be deleted
                    var formEvent = new Event();
                    formEvent.setFormValues();
                    formEvent.storeEvent();
                    formEvent.updateCalEvent();
                }
            }

            //console.log('Event values: ', data);
            //console.log('View type: ', view);
            //console.log('Event: ', event);

            toggleTooltip(data, event);


        },
        dayClick: function(date, jsEvent, view) {
            //Hide tooltip and store input values
            if($('#qtip-fullcalendar').is(':visible')) {
                var formEvent = new Event();
                formEvent.setFormValues();
                formEvent.storeEvent();
                formEvent.updateCalEvent();
                tooltip.hide()
            //Create a New Event
            } else {
                var newEvent = new Event();
                newEvent.setDefault();
                newEventIterator++;
                newEvent.id = 'New' + newEventIterator;
                newEvent.changed = 'new';
                var clickedDate = moment(date).format(dateFormat) + 'T' + moment(date).format(timeFormat);
                var end = moment(date).format(dateFormat) + 'T' + moment(date).add('1', 'hour').format(timeFormat);
                newEvent.start = clickedDate;
                newEvent.end = end;
                if(view.name === 'month' || view.name === 'listAll' ) {
                    newEvent.allday = true;
                    newEvent.end = moment(date).format(dateFormat) + 'T23:59';
                } else if(view.name === 'day' || view.name === 'week') {
                    newEvent.allday = false;
                }
                newEvent.storeEvent();
                var calEvent = newEvent.formatForCal();
                $('#calendar').fullCalendar( 'renderEvent', calEvent);
                toggleTooltip(calEvent, jsEvent);
            }
        },
        eventDrop: function( event, delta, revertFunc, jsEvent, ui, view ) {
            var droppedEvent = new Event();
            droppedEvent.setCalValues(event);
            droppedEvent.log();
            if(droppedEvent.allday) {
                droppedEvent.start = event.start.format('YYYY-MM-DD') + 'T' + event.start.format('HH:mm');
                droppedEvent.end = event.end.format('YYYY-MM-DD')  + 'T' + event.end.format('HH:mm');
            }
            droppedEvent.storeEvent();
            droppedEvent.updateCalEvent();
        },
        eventResize: function(event, delta, revertFunc) {
            var resizedEvent = new Event();
            resizedEvent.setCalValues(event);
            if(resizedEvent.allday) {
                resizedEvent.start = event.start.format('YYYY-MM-DD') + 'T' + event.start.format('HH:mm');
                resizedEvent.end = event.end.format('YYYY-MM-DD')  + 'T' + event.end.format('HH:mm');
            }
            resizedEvent.storeEvent();
            resizedEvent.updateCalEvent();

        },
        eventResizeStart: function() { tooltip.hide() },
        eventDragStart: function() { tooltip.hide() },
        viewDisplay: function() { tooltip.hide() },
        events: function(start, end, timezone, callback) {
            // Define Event API to be called on each refresh and page/view swap
            $.ajax({
                url: url + userID + "/events",
                dataType: 'json',
                type: "GET",
                success: function (res) {
                    console.log(res);
                    console.log('Status 200');
                    let calEvents = [];

                    res.forEach(function (dbEvent) {
                        let event = new Event(dbEvent);
                        event.changed = false;
                        /*
                        event.categories.forEach(function(dbCategory) {
                            categories.forEach(function(localCategory) {
                                if(dbCategory.id === localCategory.id) dbCategory['color'] = localCategory.color;
                            })
                        });
                        */
                        if (moment(event.start).isBetween(start, end)) calEvents.push(event.formatForCal());
                    });

                    console.log('Cal: ', calEvents);
                    showBanner('GET all Events successful', 'No. of Events: ' + res.length, 'success');
                    callback(calEvents);
                },
                error: function (res) {
                    let text;
                    console.log('Error getting Events: ', JSON.stringify(res) );
                    if(res.status === 0) text = 'Internet disconnected';
                    else text = 'Code: ' + res.responseJSON.code
                        + ', Description: ' + res.responseJSON.description;
                    showBanner('Error getting all Events', text, 'error');
                }
            });
        }
    })
})