
$( document ).ready(function() {
   

$('.signIn').on('click', function(){
  var userId = $('.userId').val().trim();
  var gameRef = new Firebase('https://rpsactive.firebaseio.com/');
  gameRef.once("value", function(snapshot) {
  var exists = snapshot.child(players).exists();
  var full = snapshot.child(players).child('2').exists();
  assignPlayer(userId, gameRef, exists, full);
  $('.player').html(userId);
  
});
  
});


var game = 'https://rpsactive.firebaseio.com/';
var players = 'players';
var player1 = '1';
var player2 = '2';
var turns = 'turns';
var wins = 0;
var losses = 0;
var opponentPlayerNum;
var ticker = 0;




function assignPlayer(userId, gameRef, exists, full){

  var playerNum;
  gameRef.on("value", function(snapshot) {
              $('.player2').text(snapshot.val().players[opponentPlayerNum].userId);
              $('.playerResults').text('Wins: ' + wins +' Losses: ' + losses);
              $('.oppResults').text('Wins: ' + snapshot.val().players[opponentPlayerNum].wins + ' Losses: ' + snapshot.val().players[opponentPlayerNum].losses);
             });
             
  if(exists && !full){  var playersRef = gameRef.child(players);
                        var playerRef = playersRef.child(player2);
                        playerRef.set({userId: userId, wins: wins, losses: losses});
                        playerNum = 2;
                        playerRef.onDisconnect().remove();

  }
  else if(full){
    alert('The game is full, try again later');
  }
   else{ var playersRef = gameRef.child(players);
         var playerRef = playersRef.child(player1);
         playerRef.set({userId: userId, wins: wins, losses: losses});
         playerNum = 1;
         playerRef.onDisconnect().remove();
    }


    function playGame(playerNum, playerRef, playersRef){
            var turnsRef=gameRef.child(turns);
            opponentPlayerNum = playerNum === 1 ? 2 : 1;
            var messegeRef = gameRef.child('messeges');
            messegeRef.onDisconnect().update({messege: null});
            $('.send').on('click', function(){
              messege = $('.messege').val().trim();
              messegeRef.update({messege: userId +': ' + messege})
            })
            messegeRef.on('value', function(snapshot){
              newMessege = snapshot.val().messege;
              $('.chatBox').append('<p>'+ newMessege +'</p>') 
            });

            turnsRef.set({turn:1})

            turnsRef.on("value", function(snapshot) {
              console.log(snapshot.val().turn);

              var currentTurn = snapshot.val().turn;
              function reset(){
                        $('.playerStuff').empty();
                        $('.oppStuff').empty();
                        $('.results').empty();
                        currentTurn = 1;

                        turnsRef.remove();
                        turnsRef.off();
                        playerRef.update({choice:null});
                        playGame(playerNum, playerRef, playersRef);
                      }
                      function timeUp(){
                            clearInterval(tick);
                            ticker = 0;
                              }
                      function timer(){
                          tick = setInterval(count, 1000);
                      }
                      function count(){
                              ticker++;
                              if(ticker == 3) {
                                timeUp();
                                reset();
                              }
                      }      
                    var choice;
                    if(playerNum == snapshot.val().turn){
                      $('.info').empty();
                      drawButtons();
                      $('body').on('click', '.choice', function(){
                        choice = $(this).data('text');
                        playerRef.update({choice: choice});
                        currentTurn++;
                        turnsRef.set({turn:currentTurn});
                        $('.playerStuff').html('<h1>'+ choice +'</h1>')
                      })
                    }
                    else if(snapshot.val().turn == 3){
                      $('.info').empty();
                      gameRef.once("value", function(snapshot) {
                        console.log(snapshot.val());
                        var myChoice = snapshot.val().players[playerNum].choice;
                        var oppChoice = snapshot.val().players[opponentPlayerNum].choice;
                        console.log(oppChoice);
                        var result = snapshot.val().players[playerNum];
                        console.log(myChoice);
                        if(myChoice == oppChoice){
                            $('.results').html('<h1>DRAW</h1>');
                            $('.oppStuff').html('<h1>'+ oppChoice +'</h1>')
                            timer();
                        }
                        else if(myChoice == "r" && oppChoice == "s" || myChoice == "p" && oppChoice == "r" || myChoice =="s" && oppChoice == "p"){
                          wins++;
                          playerRef.update({wins: wins});
                          $('.results').html('<h1>YOU WON</h1>');
                          $('.oppStuff').html('<h1>'+ oppChoice +'</h1>')
                          timer();
                        }
                        else if(myChoice == "r" && oppChoice == "p" || myChoice == "p" && oppChoice == "s" || myChoice =="s" && oppChoice == "r"){
                            losses++;
                            playerRef.update({losses: losses});
                            $('.results').html('<h1>'+ snapshot.val().players[opponentPlayerNum].userId +' Wins</h1>');
                            $('.oppStuff').html('<h1>'+ oppChoice +'</h1>')
                            timer();
                        }
                        });
                    }
                    else{
                      $('.info').html('Waiting for opponenet');
                      }
                      
            });
    }

  playGame(playerNum, playerRef, playersRef);
}

function drawButtons(){
           $('.playerStuff').html('<div class="list-group"><button type="button" class="list-group-item choice" data-text="r">Rock</button><button type="button" class="list-group-item choice" data-text="p">Paper</button><button type="button" class="list-group-item choice" data-text="s">Scissors</button></div>');
}

});


      

    
  