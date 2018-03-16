// General settings
var url = "http://dhbw.ramonbisswanger.de/calendar/";
var userID="47";
var defaultOrganizer = "organizer@domain.de";
var dateFormat = 'YYYY-MM-DD';
var timeFormat = 'HH:mm';
var colorLibrary = ['#00884b', '#e3bc13', '#aa231f', '#9320a2', '#5a3ec8', '#188291', '#047cc0', '#008673', '#fe8500', '#73a22c', '#e39d14', '#c45433', '#dc267f', '#777677'];

// Global Variables
var eventsToBeChanged = [];
var newEventIterator = 0;

var categories = [];
var catEditMode = false;
var newRowCounter = 1;