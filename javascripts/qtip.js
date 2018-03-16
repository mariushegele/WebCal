//setup qtip for event form
var tooltip = $('<div/>').qtip({
    id: 'fullcalendar',
    prerender: true,
    content: {
        text: ' ',
        title: {
            button: true
        }
    },
    position: {
        my: 'right center',
        at: 'left center',
        target: 'mouse',
        viewport: $('#fullcalendar'),
        adjust: {
            mouse: false,
            scroll: false
        }
    },
    show: {
        solo: true
    },
    hide: false,
    style: 'qtip-light',
    events: {
        hide: function() {
            //console.log('Hide Event');
        }
    }
}).qtip('api');

//setup qtip for response banners
var banner = $('<div/>').qtip({
    id: 'banner',
    prerender: true,
    content: {
        text: ' ',
    },
    position: {
        target: [$('body').width() * 0.5, 15],
        viewport: $('#fullcalendar'),
        adjust: {
            mouse: false,
            scroll: false
        }
    },
    show: false,
    hide: false,
    style: 'qtip-light',
    events: {
        hide: {
            event: false,
            inactive: 5000
        }
    }
}).qtip('api');


// Create a jGrowl
window.showBanner = function(title, text, type, persistent) {
    var target = $('.qtip.jgrowl:visible:last');
    let color;
    let lifespan = 5000;

    if(type === 'error') {
        color = 'red';
        lifespan = 10000;
    }
    else if(type === 'success') color = 'green';

    $('<div/>').qtip({
        content: {
            text: text,
            title: {
                text: title,
                button: true
            }
        },
        position: {
            target: [0,0],
            container: $('#qtip-growl-container')
        },
        show: {
            event: false,
            ready: true,
            effect: function() {
                $(this).stop(0, 1).animate({ height: 'toggle' }, 400, 'swing');
            },
            persistent: persistent,
            delay: 0,
        },
        hide: {
            event: false,
            effect: function(api) {
                $(this).stop(0, 1).animate({ height: 'toggle' }, 400, 'swing');
            }
        },
        events: {
            render: function(event, api) {
                if(!api.options.show.persistent) {
                    $(this).bind('mouseover mouseout', function(e) {
                        clearTimeout(api.timer);
                        if (e.type !== 'mouseover') {
                            api.timer = setTimeout(function() { api.hide(e) }, lifespan);
                        }
                    })
                        .triggerHandler('mouseout');
                }
            }
        },
        style: {
            width: 250,
            classes: 'qtip-' + color + ' jgrowl',
            tip: false
        }
    });
};




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
                    data.description.categories.forEach(function (category) {
                        idArr.push(category.id);
                    });
                    console.log(idArr);
                    catSelect.multipleSelect("setSelects", idArr);
                } else if (prop === 'imageurl') {
                    if (data.description[prop] !== 'REMOVE') $('.image-container').attr('src', data.description[prop]);
                    $('.image-figure').show();
                    $('.imageurl').hide();
                }
            }
        }
    });

    /*
    $('.image-container').ready(function(){
        var image = $('.image-container');
        console.log('Image: ', image);
        var colorThief = new ColorThief();
        var dominantColor = colorThief.getColor(image[0]);
        console.log('Dominant: ', dominantColor);
        var brightValues = 0;
        dominantColor.forEach(function(rgbValue) {
            if(rgbValue > 90) brightValues++;
        });
        if(brightValues > 1) {
            $('.image-container').css('filter', 'invert(100%');
        }
    });
    */

    /*
    if(data.description.categories.length > 0) $('.category').val(data.description.categories);
    if(data.description.hasOwnProperty('location')) $('.location').val(data.location);
    if(data.description.hasOwnProperty('webpage')) $('.webpage').val(data.description.webpage);
    if(data.description.hasOwnProperty('imageurl')) $('.imageurl').val(data.description.imageurl);
    */

    $('.title').select();
}

function setImage(input){
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            let imageBase64 = e.target.result;
            $('.image-container').attr('src', imageBase64);
            $('.image-figure').show();
        };

        reader.readAsDataURL(input.files[0]);
    }
}

function removeImage() {
    $('.imageurl').show();
    $('.image-figure').hide();
    $('.image-container').attr('remove', true);
}