angularjs-drag-n-drop
=====================

A drag and drop directive for easy file uploading.

partial.html

    <div
  		ng-file-upload="/contactgroup/import"
  		data-complete='uploadComplete()'
  		data-error="uploadError()"></div>

controller.js

    controllers.controller('ContactGroupCtrl', function($scope){
    	$scope.uploadComplete = function() {
    		alert('s');
    	}
    
    	$scope.uploadError = function() {
    		alert('e');
    	}
    });
