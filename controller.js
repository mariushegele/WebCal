var url="http://dhbw.ramonbisswanger.de/calendar/"
var userID="1";

function getEvents(callback) {
    console.log('getting Events');
    var events;
    $.ajax({
        url : url + '/' + userID + "/" + entryID,
        dataType: "json",
        type: "GET",
        success: function(res)
        {
            console.log(res);
            if(res.status == 200) {
                console.log('Status 200');
                callback(false,res);
                events = res;
            } else {
                callback(true, res);
            }
        },
        error: function () { callback(true, 'X', "Connection timeout, while waiting for Entries"); }
    });
}

$(document).ready(function() {
   getEvents(function(err, res) {
       if(err) {
           console.log(res.code + ': ' + res.description);
       } else {
           console.log('Success getting entries: ', res);
       }
   })
});
