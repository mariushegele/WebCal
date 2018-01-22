var url = "http://dhbw.ramonbisswanger.de/calendar/"
var userID="47";
var dummyMail = "test@test.de";
var eventsToBeChanged = [];

/*
Object.setPrototypeOf({ a: 1 }, Foo.prototype)
 */

class Event {
    constructor(eventDefault) {
        for (var prop in eventDefault) this[prop] = eventDefault[prop];
    }


    log() {
        console.log(this);
    }

    //sorts by Interval [start, end] and formats event into an fullCalendar compatible json
    formatForCal() {
        var calEvent = {
            "title": this.title,
            "allDay": this.allday,
            "start": this.start,
            "end": this.end,
            "_id": this.id,
            "location": this.location,
            "description": {
                "organizer": this.organizer,
                "imageurl": this.imageurl,
                "status": this.status,
                "webpage": this.webpage,
                "categories": this.categories,
                "changed": this.changed
            }
        };

        return calEvent;
    }

    setCalValues(calInput) {
        this.id = calInput._id;
        this.title = calInput.title;
        this.allday = calInput.allDay;
        this.start = calInput.start;
        this.end = calInput.end;
        this.location = calInput.location;
        this.status = calInput.description.status;
        this.webpage = calInput.description.webpage;
        this.organizer = calInput.description.organizer;
        this.imageurl = calInput.description.imageurl;
        this.categories = calInput.description.categories;
        this.changed = calInput.description.changed;
    }

    //Takes the Values from the event form thats currently open and stores them as attributes
    setFormValues() {
        console.log('Setting Form values');

        this.id = $('.event-div').parent().attr('id');
        this.title = $('.title').val();
        this.allday = false;
        if ($('.allday').is(':checked')) this.allday = true;
        this.start = moment($('.start-date').val()).format('YYYY-MM-DD')  + 'T' + $('.start-time').val();
        this.end = moment($('.end-date').val()).format('YYYY-MM-DD')  + 'T' + $('.end-time').val();
        this.location = $('.location').val();
        this.status = $('.status').val();
        this.categories = [],           //to be done
        this.organizer = $('.organizer').val();
        this.webpage = $('.webpage').val();
        this.changed = true;
    }

    storeEvent() {
        console.log('Storing event');

        var updatedEvent = this;
        eventsToBeChanged.forEach(function(storedEvent) {
            if(storedEvent.id == updatedEvent.id) {
                //event already has been stored -> delete and overwrite with current values
                eventsToBeChanged.splice(eventsToBeChanged.indexOf(storedEvent));
            }
        })

        eventsToBeChanged.push(updatedEvent);
    }

}

/*
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
                    "_id": event.id,
                    "location": event.location,
                    "description": {
                        "organizer": event.organizer,
                        "imageurl": event.imageurl,
                        "status": event.status,
                        "webpage": event.webpage,
                        "categories": event.categories,
                        "changed": false
                    }
                };
                modEvents.push(modEvent);
            });

            console.log('Modified Events Array: ', modEvents);

            callback(modEvents);

            break;
        case 'PUT':
            var modEvents = [];
            eventsArr.forEach(function(event) {
                var modEvent = {
                    "changed": event.description.changed,
                    "data": {
                        "title": event.title,
                        "allday": event.allDay,
                        "start": event.start,
                        "end": event.end,
                        "id": event._id,
                        "location": event.location,
                        "organizer": event.description.organizer,
                        "imageurl": event.description.imageurl,
                        "status": event.description.status,
                        "webpage": event.description.webpage,
                        "categories": event.description.categories,
                    }
                }

                modEvents.push(modEvent);
            });

            console.log('Modified Events Array: ', modEvents);

            callback(modEvents);

            break;
    }
}

*/

function saveChanges() {
    console.log('processing Form');

    /*
    var formEvent = {
        "_id": $('.event-div').parent().attr('id'),
        "title": $('.title').val(),
        "allDay": false,
        "start": moment($('.start-date').val()).format('YYYY-MM-DD')  + 'T' + $('.start-time').val(),
        "end": moment($('.end-date').val()).format('YYYY-MM-DD')  + 'T' + $('.end-time').val(),
        "description": {
            "location": $('.location').val(),
            "status": $('.status').val(),
            "categories": [],
            "organizer": $('.organizer').val(),
            "webpage": $('.webpage').val(),
            "imageurl": $('.imageurl').val(),
            "changed": true,
        }
    }


    if ($('.allday').is(':checked')) formEvent.allDay = true;

    */

    var clientEvents = $('#calendar').fullCalendar('clientEvents');

    clientEvents.forEach(function(clientEvent) {
        if (clientEvent._id == formEvent._id) {
            console.log('Corresponding Event: ', clientEvent);
            var combinedEvent = Object.assign({}, clientEvent, formEvent);
            console.log('Combined: ', combinedEvent);

            $('#calendar').fullCalendar('updateEvent', combinedEvent);
        }
    })
}

function auto_grow(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight)+"px";
}