angular.module("drag-drop-upload", [])
.filter('bytes', function() {
	return function(bytes, precision) {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
		if (typeof precision === 'undefined') precision = 1;
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
	};
})
.directive('dragDropUpload', ['$filter', function($filter) {
	return {
		restrict: 'A',
		scope: {
			action: '=',
			onComplete: '&',
			onProgress: '&',
			onError: '&'
		},
		link: function(scope, elem, attr, ctrl) {
			var dragForm = "<form class='file-upload' method='post' action='" + scope.action + "' enctype='multipart/form-data'> \
				<div class='drop'> \
					Drop Here<br> \
					<a>Browse</a> \
					<input type='file' name='file' multiple /> \
				</div> \
				<ul></ul> \
			</form>";

			elem.html(dragForm);

			var ul = $(elem).find('.file-upload ul');

			$(document).on('click', '.drop a', function() {
				// Simulate a click on the file input button
				// to show the file browser dialog
				$(this).parent().find('input').click();
			});

			// Initialize the jQuery File Upload plugin
			$(elem).find('.file-upload').fileupload({
				// This element will accept file drag/drop uploading
				dropZone: $(elem).find('.drop'),

				// This function is called when a file is added to the queue;
				// either via the browse button, or via drag/drop:
				add: function (e, data) {
					var tpl = $('<li class="working"><input type="text" value="0" data-width="48" data-height="48"'+
						' data-fgColor="#0788a5" data-readOnly="1" data-bgColor="#3e4043" /><div class="file"><p class="filename"></p></div><span class="cancel"></span><div class="clearfix"></div></li>');

					// Append the file name and file size
					tpl.find('p.filename').text(data.files[0].name)
						.append('<i class="size">' + $filter("bytes")(data.files[0].size) + '</i>');

					// Add the HTML to the UL element
					data.context = tpl.appendTo(ul);

					// Initialize the knob plugin
					tpl.find('input').knob();

					// Listen for clicks on the cancel icon
					tpl.find('.cancel').click(function(){
						if(tpl.hasClass('working')){
							jqXHR.abort();
						}

						tpl.fadeOut(function(){
							tpl.remove();
						});
					});

					// Automatically upload the file once it is added to the queue
					var jqXHR = data.submit();
				},

				done: function(e, data) {
					if (attr.clearOnComplete == 'true')
						data.context.remove();

					scope.$apply(function(s) {
						scope.onComplete({ e: e, data: data });
					});
				},

				progress: function(e, data){
					// data loaded is the amount uploaded
					var progress = parseInt(data.loaded / data.total * 100, 10);

					// Update the hidden input field and trigger a change
					// so that the jQuery knob plugin knows to update the dial
					data.context.find('input').val(progress).change();

					if(progress == 100)
						data.context.removeClass('working');

					scope.$apply(function(s) {
						scope.onProgress({ progress: progress, e: e, data: data });
					});
				},

				fail:function(e, data){
					scope.$apply(function(s) {
						scope.onError({ e: e, data: data });
					});

					data.context.addClass('error');
				}
			});

			// Prevent the default action when a file is dropped on the window
			$(document).on('dragover', function (e) {
				e.preventDefault();
				$(elem).find('.drop').addClass('active');
			});

			$(document).on('drop dragleave', function (e) {
				e.preventDefault();
				$(elem).find('.drop').removeClass('active');
			});
		}
	};
}]);
