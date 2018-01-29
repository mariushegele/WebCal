//setup qtip
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
    show: false,
    hide: false,
    style: 'qtip-light',
    events: {
        hide: function() {
            //console.log('Hide Event');
        }
    }
}).qtip('api');