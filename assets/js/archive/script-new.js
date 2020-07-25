"use strict";
// 
var imageContainer = $('#image-container');
var mimeType = '';
var imageInput = document.getElementById('image-input');
imageInput.addEventListener('change', (event) => {
	$(".processing").removeClass('d-none').addClass('d-flex');
	$(".processing p").html('image loading for crop...');
	console.time('FileOpen');
	var files = event.target.files;
	if (files && files[0]) {
		var file = files[0];
		var fileReaderForDataURL = new FileReader();
		fileReaderForDataURL.onloadend = function(e) {
			imageContainer.attr('src', e.target.result);
			editImage();
			$(".processing p").html('');
			$(".processing").removeClass('d-flex').addClass('d-none')
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
		$('.custom-file-label').html(file.name);
		$("#file_name").html("File: " + file.name);
		$("#file_size").html("Size: " + ((file.size / 1024).toFixed(2)) + "KB;&nbsp&nbsp");
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
	var cropcanvas = $('#image-container').cropper('getCroppedCanvas', {
		width: 600,
		height: 690,
		fillColor: '#fff',
		imageSmoothingQuality: 'high'
	}).toDataURL(mimeType);
	$.ajax({
		type: 'POST',
		url: 'uploadData.php',
		data: {
			croppedImage: cropcanvas,
			filename: 'test.png',
			fileExt: mimeType.slice(6)
		},
		beforeSend: ()=> {
			$(".processing").removeClass('d-none').addClass('d-flex');
			$(".processing p").html('image cropping and uploading ...');
			$('#container--box').css("opacity", ".1");
			$('#process').css("display", "block")
		},
		success: (result, status, xhr) => {
			$("#cropBox").removeClass('d-block').addClass('d-none');
			$("#response").removeClass('d-none').addClass('d-block');
			$(".processing").removeClass('d-flex').addClass('d-none');
			if (status == "success") {
				cancelEdit();
				$(".processing p").html('');
				$("#response").html(result)
			}
			$('#process').css("display", "none");
			$('#container--box').css("opacity", "1");
			var res = ("Result :" + result);
			var stat = ("Status :" + status);
			var rt = ("xhr :" + xhr.responseText)
		},
		error:()=> {
			$('#process').css("display", "none");
			$('#container--box').css("opacity", "1");
			$("#response").html(res + "<br>" + stat)
		}
	})
}

function editImage() {
	imageContainer.cropper(cropperOptions);
	$("#cropBtn").removeClass('d-none').addClass('d-block')
}

function cancelEdit() {
	imageContainer.cropper('destroy');
	imageContainer.attr('src', './assets/img/select-an-image.jpg');
	$('.custom-file-label').html("Choose image");
	$("#file_size").html("");
	$("#cropBtn").removeClass('d-block').addClass('d-none')
}