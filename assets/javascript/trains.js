$( document ).ready(function() {

// Firebase link
var url ='https://trainsapp.firebaseio.com/'
var dataRef = new Firebase(url);
// Initial Values
var trainName = "";
var destination = "";
var trainTime = "";
var frequency = "";


// Capture Button Click
$("#addTrain").on("click", function() {
	
	trainName = $('#nameinput').val().trim();
	destination = $('#destinationinput').val().trim();
	trainTime = $('#timeinput').val().trim();
	frequency = $('#frequencyinput').val().trim();

//Time Conversions

// var enteredTime = moment(16)

	// Code for the push
	dataRef.push({
		trainName: trainName,
		destination: destination,
		trainTime: trainTime,
		frequency: frequency

	})
	// Don't refresh the page!
	return false;
});

//Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
dataRef.on("child_added", function(childSnapshot) {
	// Log everything that's coming out of snapshot
	console.log(childSnapshot.val().trainName);
	console.log(childSnapshot.val().destination);
	console.log(childSnapshot.val().trainTime);
	console.log(childSnapshot.val().frequency);

$('.table > tbody').append('<tr><td>' + childSnapshot.val().trainName + '</td><td>' + childSnapshot.val().destination + '</td><td>' + childSnapshot.val().frequency + '</td><td>' + childSnapshot.val().arrival + '</td><td>' + childSnapshot.val().minutesAway + '</td></tr>');
  

// Handle the errors
}, function(errorObject){
	//console.log("Errors handled: " + errorObject.code)
});
	
// dataRef.orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot){
// 	// Change the HTML to reflect
// 	$("#namedisplay").html(snapshot.val().name);
// 	$("#emaildisplay").html(snapshot.val().email);
// 	$("#agedisplay").html(snapshot.val().age);
// 	$("#commentdisplay").html(snapshot.val().comment);
// })




});