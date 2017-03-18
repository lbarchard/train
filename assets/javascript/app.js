$( document ).ready(function() {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCTduvBwUD_mK-8auB_SPyf8a9XsC4qyQc",
    authDomain: "train-schedule-fc75d.firebaseapp.com",
    databaseURL: "https://train-schedule-fc75d.firebaseio.com",
    storageBucket: "train-schedule-fc75d.appspot.com",
    messagingSenderId: "865956855521"
  };
  firebase.initializeApp(config);
  //handshake with firebase
  var database = firebase.database();
  //default values for global vars
  var trainName = "";
  var destination = "";
  var frequency = "";
  //on submit button click, store field values to firebase database as new schedule
  $('#add-train').on("click", function(event){
  	event.preventDefault();

  	trainName = $('#train-name').val().trim();
  	destination = $('#destination').val().trim();
  	frequency = $('#frequency').val().trim();
  	//store values of global variables to firebase
  	database.ref('/schedule').push({
  		trainName: trainName,
  		destination: destination,
  		frequency: frequency,
      // TIMESTAMP records when data was added around the globe according to the server time
  		dateAdded: firebase.database.ServerValue.TIMESTAMP
  	});
  });

  database.ref('/schedule').on("child_added", function(childSnapshot) {

      var trainName = childSnapshot.val().trainName;
      var destination = childSnapshot.val().destination;
      var frequency = childSnapshot.val().frequency;
      // var now = now();
      console(now);
      // Created a variable to figure out when the next arrival is
      var nextArrival = "tbd"
      // Created a variable to figure out how many minutes away the next arrival is
      var minutesAway = "tbd"


      $("#schedule").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td><td>");

      }, function (errorObject) {
          console.log('The read failed' + errorObject.code);


  });

});

