
$( document ).ready(function() {
   
var dataRef = new Firebase("https://rpsactive.firebaseio.com/");
    //setting a variable 
    var rps = "https://rpsactive.firebaseio.com/"
    var players = 'players';
    var player1 = '1';
    var player2 = '2';
    var turns = 'turns';   
    var wins = 0;
    var losses = 0;
    var opponentPlayerNum;
    var ticker = 0;
    
    // Onclick function
    $("#addPlayer").on("click", function(e) {
        e.preventDefault();
    var player = $('#playerinput').val().trim();
     console.log(player)

    $('.player1').html(player);
    $('.player2').html(player);
    
    dataRef.once("value", function(snapshot) {
    var exists = snapshot.child(players).exists();
    var full = snapshot.child(players).child('2').exists();
      assignPlayer(player, dataRef, exists, full);

});
    return false;
    });

function assignPlayer(player, dataRef, exists, full){
var playerNum;
  dataRef.on("value", function(snapshot) {
              $('.player2').text(snapshot.val().players[opponentPlayerNum].userId);
              $('#scoreBox').text('Wins: ' + wins +' Losses: ' + losses);
            $('#scores2').text('Wins: ' + snapshot.val().players[opponentPlayerNum].wins + ' Losses: ' + snapshot.val().players[opponentPlayerNum].losses);
             });

  if(exists && !full){
    var playersRef = dataRef.child(players);

    var player2Ref = playersRef.child(player2);

    $('.player2').html(player2Ref.player);

      player2Ref.set({
        player: player, 
        wins: wins, 
        losses: losses
        });

      playerNum = 2;
      playerRef.onDisconnect().remove();
  }
  else if(full){
    alert('The game is full, try again later');
  }
   else{ 
    var playersRef = dataRef.child(players);
    var player1Ref = playersRef.child(player1);

    
      player1Ref.set({
        player: player, 
        wins: wins, 
        losses: losses
        });
      playerNum = 1;

       $('.player1').html(player1Ref.player);
    }
};


    // dataRef.on("value", function(snapshot, assignPlayer) {

    //       var playersRef = rps.dataRef.child(rps.players);

    //       var player1Ref = playersRef.child(rps.player1);

    //       var player2Ref = playersRef.child(rps.player2);
function drawButtons(){
           $('#rpsButtons').html('<div class="list-group"><button type="button" class="list-group-item choice" data-text="r">Rock</button><button type="button" class="list-group-item choice" data-text="p">Paper</button><button type="button" class="list-group-item choice" data-text="s">Scissors</button></div>');
}
        
    //     console.log(player1Ref)},
      function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });



});


      

    
  