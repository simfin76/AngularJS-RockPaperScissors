'use strict';

var rpsAppInfo = angular.module('rpsApp.info', [])

   /**
    * Footer Info Manager
    */

   .service( 'infoManager', function() {
      var modals = [
         { id: 'author', title: 'Author info', url: 'route/author.html' },
         { id: 'credits', title: 'Credits', url: 'route/credits.html' },
         { id: 'about', title: 'About RPS', url: 'route/about.html' }
      ];

      // Get the array of player data
      this.getModalContent = function() {
         return modals;
      }
   })

   /**
    * Modal Info
    */

   .controller( 'infoController', ['infoManager', function(infoManager) {
      this.modalContent = infoManager.getModalContent();
   }]);
