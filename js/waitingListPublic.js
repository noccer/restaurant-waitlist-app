var apiURL = 'https://niall-waitlist-app-backend-old.herokuapp.com/';
// var apiURL = 'http://localhost:3000/';

$(document).ready(function() {
  var dataSortedByETA = [];
  var restaurantNameSuburb = "";
  console.log(window.location);

  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&``#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
  restaurantNameSuburb = getParameterByName('r_id');
  console.log(restaurantNameSuburb);
  $.getJSON(apiURL + restaurantNameSuburb, function(data) {

    var title = $('<h2>').text('australian-job-carlton');
    $('#restaurantTitle').append(title);
    $.each(data, function() {
      var dataSortedByETA = _.sortBy(data, 'finishedWaiting'); // Underscore magic!
      console.log("data:"); //check data before
      console.log(data);
      console.log("dataSortedByETA:"); // check data after sorting
      console.log(dataSortedByETA);
      console.log("reshuffle data commencing:");
      data = dataSortedByETA; // overwrite the data so it is SortedByETA
      console.log("shuffle complete!"); // BOOM! We're sorted by ETA
    });

    $.each(data, function(i) {
      var customerRef = data[i];
      var customerRow = $('<tr>').addClass('customer-row');
      var customerHeads = $('<td>').addClass('heads public')
        .attr('width', '10px')
        .text(customerRef.heads);
      var customerName = $('<td>')
        .attr('width', '300px')
        .addClass('name')
        .text(customerRef.customerName);

      // insert time tracking

      var now = new Date();
      var momentNow = moment(now);
      var waitingArray = [];
      $.each(customerRef, function() {
        var delta =
          (moment(customerRef.finishedWaiting).valueOf() - momentNow.valueOf()) / 60000;
        waitingArray.push(delta);
      });
      var eta = Math.max.apply(Math, waitingArray).toFixed(0);
      if (eta < 1 && data[i].length !== 0) {
        eta = "Due";
      } else if (data[i].length === 0) {
        eta = "--";
      }
      console.log(waitingArray);
      console.log(eta);
      var customerTimer = $('<td>')
        .attr('width', '10px')
        .text(eta)
        .addClass('timer');
      // end time tracking

      $(customerRow).append(
        customerHeads,
        customerName,
        customerTimer
      );


      $('#customerListAdmin').append(customerRow);

    });
  });
});
