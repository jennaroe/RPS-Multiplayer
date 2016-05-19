
$( document ).ready(function() {
   
var dataRef = new Firebase("https://rpsactive.firebaseio.com/");
    //setting a variable 
    var rps = "https://rpsactive.firebaseio.com/"
    var playerNum;
    var players = 'players';
    var player1 = '1';
    var player2 = '2';
    var turns = 'turns';   
    var wins = 0;
    var losses = 0;
    var ticker = 0;
    
    // Onclick function
    $("#addPlayer").on("click", function(e) {
        e.preventDefault();
        var player = $('#playerinput').val().trim();
         console.log(player)
            $('#playerinput').empty;
// 
        dataRef.once("value", function(snapshot) {
            var exists = snapshot.child(players).exists();
            var full = snapshot.child(players).child('2').exists();
            assignPlayer(player, dataRef, exists, full);

        });

        return false;
    });

function assignPlayer(player, dataRef, exists, full){
var playerNum;

  if(exists && !full){
    var playersRef = dataRef.child(players)
    var player2Ref = playersRef.child(player2);
    $('player2').empty;
    player2Ref.onDisconnect().remove();
    renderButtons();
    console.log(player2Ref);

      player2Ref.set({
        player: player, 
        wins: wins, 
        losses: losses
        });
  }
  else if(full){
    alert('The game is full, try again later');
    $('#player-form').empty();
  }
   else{ 
    var playersRef = dataRef.child(players);
    var player1Ref = playersRef.child(player1);
    console.log(player1Ref);
    player1Ref.onDisconnect().remove();
    renderButtons();
      player1Ref.set({
        player: player, 
        wins: wins, 
        losses: losses
        });

    }
};


    dataRef.on("child_added", function(snapshot) {
        var user1 = snapshot.child('1').val();
        var user2= snapshot.child('2').val();
        console.log(user1)
        console.log(user2)
        playerLink(user1, user2)
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    function playerLink(player1, player2) {
        $('#player1').prepend('<p>'+ player1.player + '</p>');
        $('#scores1').html('Wins: ' + player1.wins +' Losses: ' + player1.losses);


        $('#player2').prepend('<p>'+ player2.player + '</p>');
        $('#scores2').html('Wins: ' + player2.wins +' Losses: ' + player2.losses);
    };

    function renderButtons(){
      $('.rpsButtons').empty();
      var buttons = ['Rock', 'Paper', 'Scissors']
      
      for (var i = 0; i < buttons.length; i++){

      var b = $('<button>')
      b.attr('type = button')
      b.addClass('rps list-group-item list-group-item-success');
      b.attr('data-name', buttons[i]);
      b.text(buttons[i]);
      $('.rpsButtons').append(b);
      
      };
    };
    renderButtons();
});

  
  