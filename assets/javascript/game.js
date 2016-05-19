$( document ).ready(function() {
   

$('.signIn').on('click', function(){
  
  var userId = $('.userId').val().trim();
  var gameRef = new Firebase('https://rpsactive.firebaseio.com/');

  gameRef.once("value", function(snapshot) {
                var p1exists = snapshot.child(players).child('1').exists();
                var p2exists = snapshot.child(players).child('2').exists();

                assignPlayer(userId, gameRef, p1exists, p2exists);

                $('.player').html(userId);

                var messegeRef = gameRef.child('messeges');
                var timeRef = gameRef.child('timeStamp');

                timeRef.onDisconnect().remove();
                messegeRef.onDisconnect().update({messege: null});

                $('.send').on('click', function(){
                                
                                messege = $('.messege').val().trim();
                                messegeRef.update({messege: userId +': ' + messege})
                                timeRef.push({time: Firebase.ServerValue.TIMESTAMP})
                                

                });

                messegeRef.on('value', function(snapshot){
                                newMessege = snapshot.val().messege;
                                $('.chatBox').append('<p>'+ newMessege +'</p>')                 
                });

                timeRef.on('child_added', function(snapshot){
                            timeSt = snapshot.val().time;
                            newTime = moment(timeSt).format('LT');
                            $('.chatBox').append('<p class="time">'+ newTime +'</p>') 
                });
  
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

function getGif(status){
  var random = Math.floor(Math.random() * 80);
  var api = 'http://api.giphy.com/v1/gifs/search?q='+ status +'&limit=1&offset='+ random +'&api_key=dc6zaTOxFJmzC';
         $.ajax({
              url: api,
              method: 'GET'
              }).done(function(response) {
                  console.log(response);
                    var URL = response.data[0].images.fixed_height.url;                   
                    var giff = $('<div>')
                    var img = $('<img>').addClass('image').attr('src', URL);
                    giff.append(img)
                    $('.results').append(giff);        
         });
}

function assignPlayer(userId, gameRef, p1exists, p2exists){
        var playerNum;
        gameRef.on("value", function(snapshot) {
                    $('.player2').text(snapshot.val().players[opponentPlayerNum].userId);
                    $('.playerResults').text('Wins: ' + wins +' Losses: ' + losses);
                    $('.oppResults').text('Wins: ' + snapshot.val().players[opponentPlayerNum].wins + ' Losses: ' + snapshot.val().players[opponentPlayerNum].losses);
        });

        if(p1exists && !p2exists){  
            var playersRef = gameRef.child(players);
            var playerRef = playersRef.child(player2);
            playerRef.set({userId: userId, wins: wins, losses: losses});
            playerNum = 2;
            playerRef.onDisconnect().remove();
        }

        else if(p1exists && p2exists){
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
turnsRef.onDisconnect().remove();
opponentPlayerNum = playerNum === 1 ? 2 : 1;
turnsRef.set({turn:1})

turnsRef.on("value", function(snapshot) {
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
                if(ticker == 5) {
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
                              var myChoice = snapshot.val().players[playerNum].choice;
                              var oppChoice = snapshot.val().players[opponentPlayerNum].choice;                                                  
                              var result = snapshot.val().players[playerNum];
                              
                              if(myChoice == oppChoice){
                                  $('.results').html('<h1>DRAW</h1>');
                                  $('.oppStuff').html('<h1>'+ oppChoice +'</h1>')

                                    timer();
                              }

                              else if(myChoice == "Rock" && oppChoice == "Scissors" || myChoice == "Paper" && oppChoice == "Rock" || myChoice =="Scissors" && oppChoice == "Paper"){
                                      wins++;
                                      playerRef.update({wins: wins});
                                      $('.info').html('<h1>YOU WON</h1>');
                                      $('.oppStuff').html('<h1>'+ oppChoice +'</h1>')
                                      getGif('winner');
                                      timer();
                              }

                              else if(myChoice == "Rock" && oppChoice == "Paper" || myChoice == "Paper" && oppChoice == "Scissors" || myChoice =="Scissors" && oppChoice == "Rock"){
                                      losses++;
                                      playerRef.update({losses: losses});
                                      $('.info').html('<h1>'+ snapshot.val().players[opponentPlayerNum].userId +' Wins</h1>');
                                      $('.oppStuff').html('<h1>'+ oppChoice +'</h1>')
                                      getGif('loser');
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
        $('.playerStuff').html('<div class="list-group rps"><button type="button" class="list-group-item choice" data-text="Rock">Rock</button><button type="button" class="list-group-item choice" data-text="Paper">Paper</button><button type="button" class="list-group-item choice" data-text="Scissors">Scissors</button></div>');
}

});