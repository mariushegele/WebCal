fetchCategories(function() {
    fillCatTable();
    hideCatLoad();
    updateCategoryColors();
});

$(document).ready(function() {
    $('.fc-center').append($('<h2>').attr('hidden', true).text('Categories'));
    var catSettings = $('#catSettings-template').html();
    $('body').append(catSettings);
    $('#categories-button').mousedown(function() {
        $(this).css('box-shadow', 'inset 0 2px 4px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.05)');
    });
});

function fetchCategories(callback) {
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

            showBanner('GET all Categories successful', 'No. of Categories: ' + res.length, 'success');
            categories = res;

            callback();
        },
        error: function (res) {
            let text;
            console.log('Error getting Categories: ', res );
            if(res.status === 0) text = 'Internet disconnected';
            else text = 'Code: ' + res.responseJSON.code
                + ', Description: ' + res.responseJSON.description;
            showBanner('Error getting all Categories', text, 'error');

        }
    });
}

function toggleCatSettings() {
    catEditMode = !catEditMode;

    if($('#qtip-fullcalendar').is(':visible')) { //hide tooltip and store input values
        var formEvent = new Event();
        formEvent.setFormValues();
        formEvent.storeEvent();
        formEvent.updateCalEvent();
        tooltip.hide()
    }

    $('.fc-center > h2').toggle();
    $('.fc-view-container').toggle();
    $('.fc-button-group').toggle();
    $('.fc-today-button').toggle();
    $('#catSettings').toggle();

}

function createNewCategoryRow() {
    $('#catTableBody').append($('<tr id=newRow"' + newRowCounter + '">')
        .append('<td class="cat_id">')
        .append($('<td class="cat_name">')
            .append('<input class="cat_name_val" type="text">')
        )
        .append($('<td class="cat_color">')
            .append('<input class="cat_color_val" type="color">')
        )
    );
    newRowCounter++;
}

function fillCatTable() {
    //empty the table besides add row button
    $.each($('#catTableBody').children(), function(i, tr){
        if(tr.id !== 'addCatRowButton' && tr.id !== 'loadingCatsRow') $(this).remove();
    });

    //insert database categories
    categories.forEach(function (category) {
        $('#catTableBody').append('<tr id="' + category.id + '">');
        for (let prop in category) {
            if (prop === 'name' || prop === 'color') {
                let type = 'text';
                if (prop === 'color') type = 'color';
                $('#' + category.id)
                    .append($('<td>')
                        .attr('class', 'cat_' + prop)
                        .append($('<input>')
                            .attr('class', 'cat_' + prop + '_val')
                            .attr('type', type)
                            .val(category[prop])
                            .change(function () {
                                $(this).attr('changed', true);
                            })
                        )
                    )
            } else { //if its any other property, e.g. catId
                $('#' + category.id).append($('<td>')
                    .attr('class', 'cat_' + prop)
                    .text(category[prop])
                );
            }
        }

        //for each add a td with a delete button
        $('#' + category.id).append($('<td>')
            .attr('class', 'cat_delete')
            .append($('<input>')
                .attr('type', 'image')
                .attr('src', '../images/ic_delete_black_24dp_2x.png')
                .attr('alt', 'Delete Category')
                .click(function() {
                    deleteCategory(category.id);
                })
            )
        );
    });
}

function deleteCategory(id) {
    console.log('Deleting category ', id);
    $('#' + id)
        .attr('changed', 'delete')
        .hide();
}

function showCatLoad() {
    //hide category table and show loading gif
    $('#catTableBody').hide();
    $('#loadingCatsRow').show();
}

function hideCatLoad() {
    //show category table and hide loading gif
    $('#loadingCatsRow').hide();
    $('#catTableBody').show();
}

function updateCategoryColors(category) {
    var clientEvents = $('#calendar').fullCalendar('clientEvents');
    clientEvents.forEach(function(calEvent) {
        console.log('Category: ', category);
        console.log('inArray: ', $.inArray(category.name, calEvent.description.categories));

        calEvent.description.categories.forEach(function(calCategory) {
          if(calCategory.id == category.id) {
              calEvent["backgroundColor"] = category.color;
              calEvent["borderColor"] = category.color;
              //console.log('CalEvent to be updated: ', calEvent);
              $('#calendar').fullCalendar('updateEvent', calEvent);
              console.log('Updated calendar event: ', calEvent);
          }
        })
    })
}