AngularJS Directive File Drag-n-Drop Upload
=====================

A drag and drop directive for easy file uploading.

![AngularJS File Drag-n-Drop Upload](http://screencloud.net//img/screenshots/bb10add924b908197ef6cc3d4ec67418.png)

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

controller.php (Laravel Framework)

	<?php

	class Contact_Controller extends Base_Controller
	{
		
		public function post_import()
		{
			try {
				$allowed = array('csv', 'xls', 'xlsx');
				$file = Input::file('file');
				$file_ext = String::lower(File::extension($file['name']));
				$filename = Str::random(32) . uniqid() . '.' . $file_ext;

				if (is_array($file) && isset($file['error']) && $file['error'] == 0) {
					if(! in_array($file_ext, $allowed))
						throw new Exception("Invalid file type.");

					if (Input::upload('file', 'storage/work', $filename))
						return Response::json('{"status":"success"}');
				}

				throw new Exception('Could not upload file.');
			} catch (Exception $e) {
				return $e->getMessage();
			}
		}
	}
	
ugly.php (From mini-upload-form.zip)

	<?php

	$allowed = array('png', 'jpg', 'gif','zip');

	if(isset($_FILES['upl']) && $_FILES['upl']['error'] == 0){

		$extension = pathinfo($_FILES['upl']['name'], PATHINFO_EXTENSION);

		if(!in_array(strtolower($extension), $allowed)){
			echo '{"status":"error"}';
			exit;
		}

		if(move_uploaded_file($_FILES['upl']['tmp_name'], 'uploads/'.$_FILES['upl']['name'])){
			echo '{"status":"success"}';
			exit;
		}
	}

	echo '{"status":"error"}';
	exit;
