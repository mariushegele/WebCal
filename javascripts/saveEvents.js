function saveEvents() {
    eventsToBeChanged.forEach(function(event) {
        console.log('URL: ', event.imageurl);
        conditions = ['base64', 'REMOVE'];
        if(event.imageurl) {
            if(conditions.some(element => event.imageurl.includes(element))) {
                event.imagedata = event.imageurl;
                delete event.imageurl;
            }
        }

        // POST New Event
        if(event.changed === 'new') {
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
                    showBanner('POST Event succesful!', 'Event Title: ' + postEvent.title, 'success');
                },
                error: function (res) {
                    console.log('Error posting Event: ', res.status + ' ' + res.statusText);
                    console.log('Code: ', res.responseJSON.code, ', Description: ', res.responseJSON.description);
                    showBanner('Error posting Event: ' + res.status + ' ' + res.statusText,
                        'Code: ' + res.responseJSON.code
                        + ', Description: ' + res.responseJSON.description, 'error');
                }
            });

        // DELETE Event
        } else  if(event.location === 'delete') {
            console.log('Delete this event: ', event);
            $.ajax({
                url: url + userID + "/events/" + event.id,
                contentType: 'application/json',
                type: "DELETE",
                success: function (res) {
                    console.log('Status 200');
                    console.log(res);
                    showBanner('DELETE Event succesful!', 'Event Title: ' + event.title, 'success');
                },
                error: function (res) {
                    console.log('Error deleting Event: ', res.status + ' ' + res.statusText);
                    console.log('Code: ', res.responseJSON.code, ', Description: ', res.responseJSON.description);
                    showBanner('Error deleting Event: ' + res.status + ' ' + res.statusText,
                        'Code: ' + res.responseJSON.code
                        + ', Description: ' + res.responseJSON.description, 'error');
                }
            });

        // PUT New Event Values
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
                    showBanner('PUT Event succesful!', 'Event Title: ' + event.title, 'success');
                },
                error: function (res) {
                    console.log('Error putting Event: ', res.status + ' ' + res.statusText);
                    console.log('Code: ', res.responseJSON.code, ', Description: ', res.responseJSON.description);
                    showBanner('Error putting Event: ' + res.status + ' ' + res.statusText,
                        'Code: ' + res.responseJSON.code
                        + ', Description: ' + res.responseJSON.description, 'error');
                }
            });
        }
    })
}