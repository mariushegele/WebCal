var categories = [];
var catEditMode = false;
var colorLibrary = ['#00884b', '#e3bc13', '#aa231f', '#9320a2', '#5a3ec8', '#188291', '#047cc0', '#008673', '#fe8500', '#73a22c', '#e39d14', '#c45433', '#dc267f', '#777677'];
var newRowCounter = 1;

$(document).ready(function() {
    $('.fc-center').append($('<h2>').attr('hidden', true).text('Categories'));
    var catSettings = $('#catSettings-template').html();
    $('body').append(catSettings);
});


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

        //for each add a td with a delte button
        $('#' + category.id).append($('<td>')
            .attr('class', 'cat_delete')
            .append($('<input>')
                .attr('type', 'image')
                .attr('src', '../images/ic_delete_black_24dp_2x.png')
                .attr('alt', 'Delete Category')
                .click(function() {
                    deleteEvent(category.id);
                })
            )
        );
    });
}

function deleteEvent(id) {
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