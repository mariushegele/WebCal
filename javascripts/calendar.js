$(document).ready(function() {
    var c = 0;
    $('#calendar').fullCalendar({
        customButtons: {
            settings: {
                text: ' ',
                click: function() {
                    console.log('Toggle context menu');
                    if(c === 0) {
                        var settingsTemplate = $('#settings-template').html();
                        $('.fc-clear').append(settingsTemplate).css("padding-top", "10px").css("margin-bottom", "45px").css("clear", "none");
                        $('#settings').css("float", "right");
                    };
                    c++;
                    $('.fc-clear').toggle();
                }
            },
            save: {
                text: 'save',
                click: function() {
                    if(catEditMode) {
                        $.each($('#catTableBody').children(), function(i, tr) {
                            let catId = this.id;
                            let input = $('input.cat_name_val', tr);
                            let colorInput = $('input.cat_color_val', tr);
                            let catName = input.val();

                            //validate category Name
                            if($(tr).attr('changed') === 'delete') {
                                console.log('Deleting category: ' + catId + ' ' + catName);
                                //DELETE old category
                                showCatLoad();
                                $.ajax({
                                    url: url + userID + "/categories/" + catId,
                                    contentType: 'application/json',
                                    type: "DELETE",
                                    success: function (res) {
                                        console.log('Status 200');
                                        console.log(res);
                                        $('#calendar').fullCalendar('refetchEvents');
                                    },
                                    error: function (res) {
                                        console.log('Error posting Event: ', res.status + ' ' + res.statusText);
                                        console.log('Code: ', res.responseJSON.code, ', Description: ', res.responseJSON.description);
                                    }
                                });

                            }
                            else if(catName.length < 3) {
                                console.log('Raise the banners: Invalid catName length!')
                            } else {
                                //if its a newly created category
                                if (catId.startsWith('newRow')) {
                                    console.log('Posting category: ', catName);
                                    showCatLoad();
                                    $.ajax({
                                        url: url + userID + "/categories",
                                        contentType: 'application/json',
                                        type: "POST",
                                        data: JSON.stringify({"name": catName}),
                                        success: function (res) {
                                            console.log('Status 200');
                                            console.log(res);
                                            $('#calendar').fullCalendar('refetchEvents');
                                        },
                                        error: function (res) {
                                            console.log('Error posting Event: ', res.status + ' ' + res.statusText);
                                            console.log('Code: ', res.responseJSON.code, ', Description: ', res.responseJSON.description);
                                        }
                                    });
                                } else if(input.attr('changed') === 'true') {    //if its a category that has been edited
                                    console.log('Deleting and reposting category: ' + catId + ' ' + catName);
                                    //DELETE old category
                                    showCatLoad();
                                    $.ajax({
                                        url: url + userID + "/categories/" + catId,
                                        contentType: 'application/json',
                                        type: "DELETE",
                                        success: function (res) {
                                            console.log('Status 200');
                                            console.log(res);

                                            // then POST as a new category
                                            $.ajax({
                                                url: url + userID + "/categories",
                                                contentType: 'application/json',
                                                type: "POST",
                                                data: JSON.stringify({"name": catName}),
                                                success: function (res) {
                                                    console.log('Status 200');
                                                    console.log(res);
                                                    //refetch events and categories
                                                    $('#calendar').fullCalendar('refetchEvents');
                                                },
                                                error: function (res) {
                                                    console.log('Error posting Event: ', res.status + ' ' + res.statusText);
                                                    console.log('Code: ', res.responseJSON.code, ', Description: ', res.responseJSON.description);
                                                }
                                            });
                                        },

                                        error: function (res) {
                                            console.log('Error posting Event: ', res.status + ' ' + res.statusText);
                                            console.log('Code: ', res.responseJSON.code, ', Description: ', res.responseJSON.description);
                                        }
                                    });

                                } else if(colorInput.attr('changed')) { //if only the color has been changed
                                    categories.forEach(function(category) {
                                        if(category.id == catId) {
                                            console.log('Category found: ', category);
                                            console.log('Lets update by ', colorInput.val());
                                            category.color = colorInput.val();
                                        }
                                    })
                                }
                            }

                        });


                    } else {
                        eventsToBeChanged.forEach(function(event) {
                            console.log('To Be Posted: ', JSON.stringify(postEvent));
                            if(event.changed === 'new') {
                                /*
                                if (event.allday === true) {
                                    var end = moment(event.end);
                                    event.end = end.subtract('1', 'day').format('YYYY-MM-DD') + 'T23:59';
                                }
                                */
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
        defaultView: 'month',
        visibleRange: function(currentDate) {
            return {
                start: currentDate.clone().startOf('month'),
                end: currentDate.clone().endOf('month') // exclusive end, so 3
            };
        },
        viewRender: function(view) {
            console.log(view);
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
        eventAfterAllRender: function (view) {
            //refill category table
            console.log('eventAfterAllRender');

            //if the category table hasnt been inserted yet
            if(!$('#catSettings').length > 0) {
                var catSettings = $('#catSettings-template').html();
                $('body').append(catSettings);
            }
            fillCatTable();
            hideCatLoad();
        },
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

            console.log('Event values: ', data);
            //console.log('View type: ', view);
            console.log('Event: ', event);
            //console.log("Position: ", event.pageX);

            var content = "<div id='" + data._id + "'>"
                + $('#eventForm-template').html() + "</div>";



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
            if($('#qtip-fullcalendar').is(':visible')) { //hide tooltip and store input values
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
                if(view.name === 'month' || view.name === 'listAll' ) {
                    newEvent.allday = true;
                    //console.log(moment(date).format(dateFormat) + 'T23:59');
                    newEvent.end = moment(date).format(dateFormat) + 'T23:59';
                } else if(view.name === 'day' || view.name === 'week') {
                    newEvent.allday = false;
                }
                newEvent.storeEvent();
                //console.log('Created Event: ', JSON.stringify(newEvent));
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
                //var startHelper = event.start.format('YYYY-MM-DD')  + 'T' + event.start.format('HH:mm');
                droppedEvent.start = event.start.format('YYYY-MM-DD') + 'T' + event.start.format('HH:mm');
                droppedEvent.end = event.end.format('YYYY-MM-DD')  + 'T' + event.end.format('HH:mm');
            }
            //droppedEvent.changed = true;
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
            //resizedEvent.changed = true;
            resizedEvent.storeEvent();
            resizedEvent.updateCalEvent();

        },
        eventResizeStart: function() { tooltip.hide() },
        eventDragStart: function() { tooltip.hide() },
        viewDisplay: function() { tooltip.hide() },
        events: function(start, end, timezone, callback) {

            console.log('Start: ', start);
            console.log('End: ', end);

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
            //get all categories from database
            $.ajax({
                url: url + userID + "/categories",
                dataType: 'json',
                type: "GET",
                success: function (res) {
                    console.log('Status 200');
                    console.log('All categories: ', res);
                    //map a corresponding color
                    let i = 0;
                    res.forEach(function(category) {
                        category['color'] = colorLibrary[i];
                        i++;
                        if(i > colorLibrary.length - 1) i = 0;
                    });
                    categories = res;
                },
                error: function (res) {
                    console.log('Error getting Categories: ', res );
                }
            });

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

    if(jsEvent.clientX < 0.4 * $('body').width()) {
        if(jsEvent.clientY < 0.4 * $('body').height()) {    //top left
                console.log('top left');
            tooltip.set({
                'position.my': 'top left',
                'position.at': 'bottom right'
            })
        } else {
            tooltip.set({                                       //center left
                'position.my': 'left center',
                'position.at': 'right center'
            })
        }
    } else {
        if(jsEvent.clientY < 1 * $('.event-div').height()) {    //top right
            tooltip.set({
                'position.my': 'top right',
                'position.at': 'bottom left'
            })
        } else {
            tooltip.set({                                       //center right
                'position.my': 'right center',
                'position.at': 'left center'
            })
        }
    }

    tooltip.reposition(jsEvent)
        .show(jsEvent);

    $( ".event-form").children().each( function(index, element ){
        $(element).keypress(function(e) {
            if(e.which == 13 && !$(element).is('textarea')){
                e.preventDefault();
                var formEvent = new Event();
                formEvent.setFormValues();
                formEvent.storeEvent();
                formEvent.updateCalEvent();
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


    //push categories to event-form select
    $.each(categories, function (index, category) {
        $('.categories').append($('<option>', {
            value: category.id,
            text : category.name
        }));
    });

    const catSelect = $('.categories').multipleSelect({
        placeholder: "Select categories...",
        width: 130,
        styler: function(value) {
            categories.forEach(function(category){
                if(value === category.id) {

                }
            })
        }
    });

    if(data.allDay) {
        data.end.subtract('1', 'minute');
    }

    $('.start-date').val(data.start.format('YYYY-MM-DD'));
    $('.end-date').val(data.end.format('YYYY-MM-DD'));

    $('.start-time').val(data.start.format('HH:mm'));
    $('.end-time').val(data.end.format('HH:mm'));

    $('.organizer').val(data.description.organizer);

    //set value for multiple select


    //fill Form with all these optional values
    var optionalValues = ['categories', 'location', 'webpage', 'imageurl'];
    optionalValues.forEach(function(prop) {
        if(data.description.hasOwnProperty(prop)) {
            if(data.description[prop]) {
                if (prop === 'categories') {
                    var idArr = [];
                    data.description.categories.forEach(function(category) {
                        idArr.push(category.id);
                    });
                    console.log(idArr);
                    catSelect.multipleSelect("setSelects", idArr);
                } else {
                    $('.' + prop).val(data.description[prop]);
                }
            }
        }
    });


    /*
    if(data.description.categories.length > 0) $('.category').val(data.description.categories);
    if(data.description.hasOwnProperty('location')) $('.location').val(data.location);
    if(data.description.hasOwnProperty('webpage')) $('.webpage').val(data.description.webpage);
    if(data.description.hasOwnProperty('imageurl')) $('.imageurl').val(data.description.imageurl);
    */

    $('.title').select();
}