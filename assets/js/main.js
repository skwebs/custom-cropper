"use strict";
// 
var imageContainer = $('#image-container');
var imageInput = document.getElementById('image-input');
var processing = $(".processing");
var processingText = $(".processing p");
var fileName = $("#file_name");
var fileSize = $("#file_size");
var fileLabel = $('.custom-file-label');
var cropBtn = $("#cropBtn");
var response = $("#response");
var mimeType = '';

imageInput.addEventListener('change', (event) => {
	cancelEdit();
	showProcees('image loading for crop...');
	console.time('FileOpen');
	var files = event.target.files;
	if (files && files[0]) {
		var file = files[0];
		var fileReaderForDataURL = new FileReader();
		fileReaderForDataURL.onloadend = function(e) {
			imageContainer.attr('src', e.target.result);
			editImage();
			hideProcess();
			console.log(e.target.result)
		};
		fileReaderForDataURL.readAsDataURL(file);
		var fileReaderForArrayBuffer = new FileReader();
		fileReaderForArrayBuffer.onloadend = function(evt) {
			if (evt.target.readyState === FileReader.DONE) {
				var uInt8Array = new Uint8Array(evt.target.result);
				let bytes = [];
				uInt8Array.forEach((byte) => {
					bytes.push(byte.toString(16))
				});
				var hex = bytes.join('').toUpperCase();
				mimeType = checkMimeType(hex);
			}
			console.timeEnd('FileOpen')
		};
		fileLabel.html(file.name);
		fileName.html("File: " + file.name);
		fileSize.html("Size: " + ((file.size / 1024).toFixed(2)) + "KB;&nbsp&nbsp");
		var BLOB = file.slice(0, 4);
		fileReaderForArrayBuffer.readAsArrayBuffer(BLOB)
	}
});
var checkMimeType = (signature) => {
	switch (signature) {
		case '89504E47':
			return 'image/png';
		case '47494638':
			return 'image/gif';
		case '25504446':
			return 'application/pdf';
		case 'FFD8FFDB':
		case 'FFD8FFE0':
		case 'FFD8FFE1':
			return 'image/jpeg';
		case '504B0304':
			return 'application/zip';
		default:
			return 'Unknown filetype'
	}
};
var cropperOptions = {
	viewMode: 3,
	dragMode: 'move',
	aspectRatio: 20 / 23,
	autoCropArea: 1,
	restore: !1,
	modal: !1,
	highlight: !1,
	cropBoxMovable: !1,
	cropBoxResizable: !1,
	toggleDragModeOnDblclick: !1,
};

function crop() {
	console.time("Image cropped.")
	var cropcanvas = imageContainer.cropper('getCroppedCanvas', {
		width: 600,
		height: 690,
		fillColor: '#fff',
		imageSmoothingQuality: 'high'
	}).toDataURL(mimeType);
	$.ajax({
		type: 'POST',
		url: 'uploadData.php',
		data: {
			croppedImageFile : cropcanvas,
			fileExt : mimeType.slice(6)
		},
		beforeSend: ()=> {
			showProcees('image cropping and uploading ...');
		},
		success: (result, status, xhr) => {
			console.timeEnd("Image cropped.")
			if (status == "success") {
				hideProcess();
				cancelEdit();
				response.html(result)
			}
		},
		error:(res,stat)=> {
			hideProcess();
			cancelEdit();
			response.html(res + "<br>" + stat)
		}
	})
}

function editImage() {
	imageContainer.cropper(cropperOptions);
	cropBtn.removeClass('d-none').addClass('d-block')
}

function cancelEdit() {
	imageContainer.cropper('destroy');
	cropBtn.removeClass('d-block').addClass('d-none')
//	imageContainer.attr('src', './assets/img/select-an-image.jpg');
//	fileLabel.html("Choose image");
//	fileSize.html("");
}
function showProcees(msg){
	processing.removeClass('d-none').addClass('d-flex');
	processingText.html(msg);
}
function hideProcess(){
	processingText.html('');
	processing.removeClass('d-flex').addClass('d-none');
}