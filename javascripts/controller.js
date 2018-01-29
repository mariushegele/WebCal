var url = "http://dhbw.ramonbisswanger.de/calendar/";
var userID="47";
var dummyMail = "test@test.de";
var eventsToBeChanged = [];
var defaultOrganizer = "organizer@domain.de";
var dateFormat = 'YYYY-MM-DD';
var timeFormat = 'HH:mm';
var newEventIterator = 0;

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

    setDefault() {
        this.title = 'New Event';
        this.allday = false;
        this.start = moment();
        this.end = moment().add('1', 'hour');
        this.organizer = defaultOrganizer;
        this.status = 'Busy';
        this.changed = true;
    }

    //sorts by Interval [start, end] and formats event into an fullCalendar compatible json
    formatForCal(changed) {
        var endDate;
        if(this.allday) {   //respect that fullcalendar expects allday events to end at 0:00
            endDate = moment(this.end).add('1', 'day').format('YYYY-MM-DD');
            this.end = endDate + 'T00:00';
        } /* else if(!this.allday && changed) {
            endDate = moment(this.end).subtract('1', 'day').format('YYYY-MM-DD');
            this.end = endDate + 'T23:59';
        } */


        var calEvent = {
            "title": this.title,
            "allDay": this.allday,
            "start": moment(this.start),
            "end": moment(this.end),
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
        if(calInput.allDay) {   //respect that database expects allday events to end at 23:59
            var endDate = moment(calInput.allDay).subtract('1', 'day').format('YYYY-MM-DD');
            calInput.allDay = endDate + 'T23:59';
        }
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
        var id = $('.event-div').parent().attr('id');
        this.id = $('.event-div').parent().attr('id');
        this.title = $('.title').val();
        this.allday = false;
        if ($('.allday').is(':checked')) this.allday = true;
        this.start = moment($('.start-date').val()).format('YYYY-MM-DD')  + 'T' + $('.start-time').val();
        this.end = moment($('.end-date').val()).format('YYYY-MM-DD')  + 'T' + $('.end-time').val();
        if(!$('.location').val().length > 0) this.location = $('.location').val();
        this.status = $('.status').val();
        this.categories = [];          //to be done
        this.organizer = $('.organizer').val();
        this.webpage = $('.webpage').val();
        if(id.startsWith('New')) {
            this.changed = 'new';
        } else {
            this.changed = true;
        }

        //console.log('Form values set: ', this);
    }

    storeEvent() {
        var updatedEvent = this;
        eventsToBeChanged.forEach(function(storedEvent) {
            if(storedEvent.id == updatedEvent.id) {
                //event already has been stored -> delete and overwrite with current values
                eventsToBeChanged.splice(eventsToBeChanged.indexOf(storedEvent));
            } else {
                console.log('Event to be stored is a new event');
            }
        })
        eventsToBeChanged.push(updatedEvent);

        console.log('Event stored: ', JSON.stringify(updatedEvent));
        console.log('Storage: ', JSON.stringify(eventsToBeChanged));
    }

    updateCalEvent() {

        event = new Event(this);
        var clientEvents = $('#calendar').fullCalendar('clientEvents');
        //console.log('Client Events: ', clientEvents);
        clientEvents.forEach(function(calEvent) {
            if(calEvent._id === event.id) {
                var changedAllday = true;
                if(calEvent.allDay === event.allday) changedAllday = false;
                var formattedEvent = event.formatForCal(changedAllday);
                for (var prop in formattedEvent) calEvent[prop] = formattedEvent[prop];
                //console.log('CalEvent to be updated: ', calEvent);
                $('#calendar').fullCalendar('updateEvent', calEvent);
                console.log('Updated calendar event: ', calEvent);
            }
        })

    }

}

/*
function saveChanges() {

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
*/

function auto_grow(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight)+"px";
}