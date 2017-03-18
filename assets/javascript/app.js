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
  $('#add-user').on("click", function(event){
  	event.preventDefault();

  	trainName = $('#train-name').val().trim();
  	destination = $('#destination-input').val().trim();
  	frequency = $('#frequency-input').val().trim();
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
      var firstTrainTime = childSnapshot.val().startDate;
      var empMonthlyRate = childSnapshot.val().monthlyRate;
      var schedDateAdded = childSnapshot.val().dateAdded;
      // Created a variable to figure out how many months worked
      var empMonthsWorked = moment(schedDateAdded).diff(firstTrainTime, "months");
      // Created a variable to figure out the total billed amount
      var totalBilled = "$" + empMonthlyRate * empMonthsWorked;

      $("#schedule").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + firstTrainTime + "</td><td>" + empMonthsWorked + "</td><td>" + empMonthlyRate + "</td><td>" + totalBilled + "</td></tr>");

      }, function (errorObject) {
          console.log('The read failed' + errorObject.code);


  });

});

