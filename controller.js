var url="http://dhbw.ramonbisswanger.de/calendar/"
var userID = "47";
var entryID = "1088";
var categoryID = "16";
var events;

function getEvents(callback) {
    console.log('getting Events');
    $.ajax({
        url : url + userID + "/events/",
        dataType: "json",
        contentType: "application/json",
        processData: false,
        type: "GET",
        crossDomain: true,
        success: function(res)
        {
            console.log(res);
            if(res.status == 200) {
                console.log('Successfully received events');
                callback(false,res);
                events = res;
            } else {
                callback(true, res);
            }
        },
        error: function () { callback(true, 'X', "Connection timeout, while waiting for Entries"); }
    });
}

function postEvents(callback) {
    console.log('creating Events');
    var sendEvent = {
        title: "Beispielevent",
        location: "Stuttgart",
        organizer: "bsp.bsp@bsp.de",
        webpage: "https://www.bsp.de",
        start: "2018-12-18T15:20",
        end: "2018-12-18T16:20",
        allday: false,
        status: "Busy"
    };

    $.ajax({
        url : url + userID + "/events/",
        data: JSON.stringify(sendEvent),
        dataType: "json",
        contentType: "application/json",
        processData: false,
        type: "POST",
        crossDomain: true,
        success: function(res)
        {
            console.log(res);
            if(res.status == 200) {
                console.log('Event created successfully');
                callback(false,res);
                events = res;
            } else {
                callback(true, res);
            }
        },
        error: function (res) {
            console.log(res);
            callback(true, 'X', "Connection timeout, while waiting for Entries"); }
    });
}

function putEvents(entryID, callback) {
    console.log('modify Events');

    var sendEvent = {
        title: "Beispiel",
        location: "Berlin",
        organizer: "organizer.organizer@web.de",
        webpage: "",
        start: "2018-12-18T15:20",
        end: "2018-12-18T16:20",
        allday: false,
        status: "Busy"
    };


    $.ajax({
        url : url + userID + "/events/" + entryID,
        data: JSON.stringify(sendEvent),
        dataType: "json",
        contentType: "application/json",
        processData: false,
        type: "PUT",
        crossDomain: true,
        success: function(res)
        {
            console.log(res);
            if(res.status == 200) {
                console.log('Event modified successfully');
                callback(false,res);
                events = res;
            } else {
                callback(true, res);
            }
        },
        error: function (res) {
            console.log(res);
            callback(true, 'X', "Connection timeout, while waiting for Entries"); }
    });
}

function deleteEvents(callback) {
    console.log('deleting Events');
    $.ajax({
        url : url + userID + "/events/" + entryID,
        dataType: "json",
        contentType: "application/json",
        processData: false,
        type: "DELETE",
        crossDomain: true,
        success: function(res)
        {
            console.log(res);
            if(res.status == 200) {
                console.log('Event deleted successfully');
                callback(false,res);
                events = res;
            } else {
                callback(true, res);
            }
        },
        error: function () { callback(true, 'X', "Connection timeout, while waiting for Entries"); }
    });
}

function getCategories(callback) {
    console.log('getting Categories');
    $.ajax({
        url : url + userID + "/categories/",
        dataType: "json",
        contentType: "application/json",
        processData: false,
        type: "GET",
        crossDomain: true,
        success: function(res)
        {
            console.log(res);
            if(res.status == 200) {
                console.log('Successfully received categories');
                callback(false,res);
                events = res;
            } else {
                callback(true, res);
            }
        },
        error: function () { callback(true, 'X', "Connection timeout, while waiting for categories"); }
    });
}

function postCategories(callback) {
    console.log('creating Categories');
    var sendCategory = {
        name: "Arbeit"
    };

    $.ajax({
        url : url + userID + "/categories/",
        data: JSON.stringify(sendCategory),
        dataType: "json",
        contentType: "application/json",
        processData: false,
        type: "POST",
        crossDomain: true,
        success: function(res)
        {
            console.log(res);
            if(res.status == 200) {
                console.log('Category created successfully');
                callback(false,res);
                events = res;
            } else {
                callback(true, res);
            }
        },
        error: function (res) {
            console.log(res);
            callback(true, 'X', "Connection timeout, while waiting for Entries"); }
    });
}

function deleteCategories(callback) {
    console.log('deleting Categories');
    $.ajax({
        url : url + userID + "/categories/" + categoryID,
        dataType: "json",
        contentType: "application/json",
        processData: false,
        type: "DELETE",
        crossDomain: true,
        success: function(res)
        {
            console.log(res);
            if(res.status == 200) {
                console.log('Category deleted successfully');
                callback(false,res);
                events = res;
            } else {
                callback(true, res);
            }
        },
        error: function () { callback(true, 'X', "Connection timeout, while waiting for Entries"); }
    });
}

function addCategoryToEvent(callback) {
    console.log('adding events to category');

    $.ajax({
        url : url + userID + "/category-assignment/" + categoryID + "/" + entryID,
        dataType: "json",
        contentType: "application/json",
        processData: false,
        type: "POST",
        crossDomain: true,
        success: function(res)
        {
            console.log(res);
            if(res.status == 200) {
                console.log('Event added successfully to category');
                callback(false,res);
                events = res;
            } else {
                callback(true, res);
            }
        },
        error: function (res) {
            console.log(res);
            callback(true, 'X', "Connection timeout, while waiting for Entries"); }
    });
}

function deleteCategoryFromEvent(callback) {
    console.log('delete category from Events');

    $.ajax({
        url : url + userID + "/category-assignment/" + categoryID + "/" + entryID,
        dataType: "json",
        contentType: "application/json",
        processData: false,
        type: "DELETE",
        crossDomain: true,
        success: function(res)
        {
            console.log(res);
            if(res.status == 200) {
                console.log('Successfully deleted category form event');
                callback(false,res);
                events = res;
            } else {
                callback(true, res);
            }
        },
        error: function (res) {
            console.log(res);
            callback(true, 'X', "Connection timeout, while waiting for Entries"); }
    });
}

function addImageToEvent(callback) {
    console.log('adding image to event');

    $.ajax({
        url : url + userID + "/images/" + entryID,
        data: "",
        dataType: "json",
        contentType: "application/json",
        processData: false,
        type: "POST",
        crossDomain: true,
        success: function(res)
        {
            console.log(res);
            if(res.status == 200) {
                console.log('Image added to event');
                callback(false,res);
                events = res;
            } else {
                callback(true, res);
            }
        },
        error: function (res) {
            console.log(res);
            callback(true, 'X', "Connection timeout, while waiting for Entries"); }
    });
}

function deleteImageFromEvent(callback) {
    console.log('deleting image from event');

    $.ajax({
        url : url + userID + "/images/" + entryID,
        dataType: "json",
        contentType: "application/json",
        processData: false,
        type: "DELETE",
        crossDomain: true,
        success: function(res)
        {
            console.log(res);
            if(res.status == 200) {
                console.log('Image added to event');
                callback(false,res);
                events = res;
            } else {
                callback(true, res);
            }
        },
        error: function (res) {
            console.log(res);
            callback(true, 'X', "Connection timeout, while waiting for Entries"); }
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


getCategories();