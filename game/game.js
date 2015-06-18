'use strict';

var rpsAppGame = angular.module('rpsApp.game', [])

   /**
    * Game Manager
    */

   .service( 'rpsManager', ['$filter', function($filter) {

      // Set players
      var players = [
         { id: 'human', name: 'Player', chosen: null },
         { id: 'robot', name: 'Machine', chosen: null }
      ];

      // Set moves
      var moves = {
         'rock' : { id: 'rock', name: 'Rock', chosen: false, defeats: [
            { verb: 'crushes', id: 'scissors' }
         ]},
         'paper' : { id: 'paper', name: 'Paper', chosen: false, defeats: [
            { verb: 'covers', id: 'rock' },
         ]},
         'scissors' : { id: 'scissors', name: 'Scissors', chosen: false, defeats: [
            { verb: 'cut', id: 'paper' },
         ]}
         
      };

      // Set initial scores
      var scores = {
         humanWins: 0,
         draws: 0,
         robotWins: 0
      };

      // Get the array of player data
      this.getPlayerData = function() {
         return players;
      }

      // Get the array of moves data
      this.getMoveData = function() {
         return moves;
      }

      // Get the array of scores data
      this.getScoreData = function() {
         return scores;
      }

      // Get the human player's selected move
      this.humanChoice = null;

      this.getHumanMove = function() {
         this.moveData = this.getMoveData();
         this.humanChoiceObject = this.moveData[this.humanChoice];

         return this.humanChoiceObject;
      }

      // Set a random move for the robot player
      this.getRobotMove = function() {
         this.possibleMoves = this.getMoveData();
         this.tempMovesList = Object.keys(this.possibleMoves);
         this.getRandomMove = this.tempMovesList[Math.floor(Math.random() * this.tempMovesList.length)];
         this.robotMoveObject = this.possibleMoves[this.getRandomMove];

         return this.robotMoveObject;
      }

      // Set round winner the and update score
      this.getWinner = function( humanMove, robotMove ) {
         this.moveData = this.getMoveData();
         this.roundWinner = null;
         this.infoText = "Select your first move below:";

         if ( humanMove.id == robotMove.id ) {
            this.roundWinner = 'draw';
            this.infoText = 'That\'s a draw!';
         } else {
            var humanWin = $filter('arrayContains')(humanMove.defeats, robotMove.id);

            if ( humanWin ) {
               this.roundWinner = 'human';
               this.infoText = 'You win! ' + humanMove.name + ' ' + humanWin.verb + ' ' + humanWin.id + '.';
            } else {
               var robotWin = $filter('arrayContains')(robotMove.defeats, humanMove.id);
               this.roundWinner = 'robot';
               this.infoText = 'Robot wins! ' + robotMove.name + ' ' + robotWin.verb + ' ' + robotWin.id + '.';
            }
         }

         return { winner: this.roundWinner, text: this.infoText };
      }
   }])

   // Create a general purpose filter for finding keys in objects
   .filter('arrayContains', function() {
      return function(input, id) {
         for (var i=0; i<input.length; i++) {
            if (input[i].id == id) {
               return input[i];
            }
         }
         return false;
      }
   })

   /**
    * Game
    */

   .controller('gameController', ['rpsManager', '$scope', '$timeout', function(rpsManager, $scope, $timeout) {
      this.game = rpsManager;
      $scope.instructions = "Go with your first move below:";
      $scope.firstMove = true;
      $scope.isActive = false;

      this.playMove = function(element){

         // Get players array
         $scope.players = this.game.getPlayerData();

         // Get scores data
         $scope.scoreData = this.game.getScoreData();

         // Get each players' chosen move
         $scope.robotMove = this.game.getRobotMove();
         $scope.humanMove = this.game.getHumanMove();
         $scope.results = this.game.getWinner( $scope.humanMove, $scope.robotMove );

         // Clear the players' previous move choices
         angular.forEach( $scope.players, function( value, index ) {
            value.chosen = null;
         })

         // Game animation, get the winner, and update the score
         $scope.instructions = "One, two, three...";
         $scope.firstMove = false;
         $scope.isActive = true;

         $timeout( function(){
            $scope.isActive = false;

            angular.forEach( $scope.players, function( value, index ) {
               if ( value.id == 'human' ) {
                  value.chosen = $scope.humanMove.id;
               } else if ( value.id == 'robot' ) {
                  value.chosen = $scope.robotMove.id;
               }
            })

            if ( $scope.results.winner == 'draw' ) {
               $scope.scoreData.draws += 1;
            } else {
               if ( $scope.results.winner == 'human' ) {
                  $scope.scoreData.humanWins += 1;
               } else {
                  $scope.scoreData.robotWins += 1;
               }
            }
            $scope.instructions = $scope.results.text;

         }, 3000 );
      }
   }])

   /**
    * Declare Players Controller
    */

   .controller('playerController', ['rpsManager', function(rpsManager) {
      this.players = rpsManager.getPlayerData();
   }])

   /**
    * Declare Moves Controller
    */

   .controller('moveController', ['rpsManager', function(rpsManager) {
      this.moves = rpsManager.getMoveData();
   }])
   
   /**
    * Manage Player moves by a new route call (move.html)
    */

   .directive('playerMoves', function() {
      return {
         restrict: 'E',
         templateUrl: 'moves.html',
         scope: true
      };
   })

   /**
    * Declare Scores Controller
    */

   .controller('scoreController', ['rpsManager', function(rpsManager) {
      this.scores = rpsManager.getScoreData();
   }]);
