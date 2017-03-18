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
    firstTrainTime = $('#firstTrain-input').val().trim();
  	//store values of global variables to firebase
  	database.ref('/schedule').push({
  		trainName: trainName,
  		destination: destination,
  		frequency: frequency,
      firstTrainTime: firstTrainTime,
      // TIMESTAMP records when data was added around the globe according to the server time
  		dateAdded: firebase.database.ServerValue.TIMESTAMP
  	});
  });

  database.ref('/schedule').on("child_added", function(childSnapshot) {

      var trainName = childSnapshot.val().trainName;
      var destination = childSnapshot.val().destination;
      var frequency = childSnapshot.val().frequency;
      
      
      //Convert the train time string into a moment object
      var firstTrainTime = moment(childSnapshot.val().firstTrainTime,"HH:mm");

      //Try to do math on the time now compared to the first train time - doesn't work :-(
      var hoursSinceFirstTrain = moment().subtract(firstTrainTime).hours(); //this doesn't work as it thinks firstTrainTime is midnight always
      var minutesSinceFirstTrain = moment().subtract(firstTrainTime).minutes(); //this doesn't work as it thinks firstTrainTime is midnight always
      var totalMinutesSinceFirstTrain = 60*(hoursSinceFirstTrain) + minutesSinceFirstTrain;
      // Created a variable to figure out when the next arrival is
      var nextArrivalTotalMinutesFromFirstTrain = frequency * (Math.floor(totalMinutesSinceFirstTrain / frequency) + 1) //this should get minutes from the original train that the next arrival is happening
      var nextArrivalHour = Math.floor(nextArrivalTotalMinutesFromFirstTrain/60);
      var nextArrivalMinutes = nextArrivalTotalMinutesFromFirstTrain - nextArrivalHour*60
      var nextArrivalTime = nextArrivalHour + ":" + nextArrivalMinutes
      
      // Created a variable to figure out how many minutes away the next arrival is
      var minutesAway = nextArrivalTotalMinutesFromFirstTrain - totalMinutesSinceFirstTrain


      $("#schedule").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextArrivalTime + "</td><td>" + minutesAway + "</td><td>");

      }, function (errorObject) {
          console.log('The read failed' + errorObject.code);


  });

});

