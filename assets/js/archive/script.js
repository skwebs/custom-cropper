"use strict";
const imageContainer = $('#image');
// check real mime type of a file script from here.
// create a const of a object because a constant
// value cannot change but can change a value of a object 
// so I created a const object named SELECTED_FILE
//const SELECTED_FILE = {mimeType: 'image/jpeg'};

var mimeType = 'image/jpeg';
// imageInput select image file
const imageInput = document.getElementById('imgInp');
imageInput.addEventListener('change', (event) => {
	// action after image selection
	console.time('FileOpen');
	// assigned selected file data in file const
	const FILES = event.target.files[0];
	var FILE="";
	if(FILES && FILES.length > 0){
	FILE = FILES[0];
	const FILE_READER = new FileReader();
	FILE_READER.onloadend = function(evt) {
		// common
		if(evt.target.readyState === FileReader.DONE) {
			const UINT8ARRAY = new Uint8Array(evt.target.result);
			let bytes = [];
			UINT8ARRAY.forEach((byte) => {
				bytes.push(byte.toString(16));
			});
			const HEX = bytes.join('').toUpperCase();
			//SELECTED_FILE.mimeType = checkMimeType(HEX);
			mimeType = checkMimeType(HEX);
			//showMtype();
		}
		console.timeEnd('FileOpen');
	};
	$('.custom-file-label').html(FILE.name);
	//$("#file_name").html("File: " + FILE.name);
	$("#file_size").html("Size: " + ((FILE.size / 1024).toFixed(2)) + "KB;&nbsp&nbsp");
	const BLOB = FILE.slice(0, 4);
	FILE_READER.readAsArrayBuffer(BLOB);
}
});

const checkMimeType = (signature) => {
	switch(signature) {
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
			return 'Unknown filetype';
	}
};
// get Mime Type
const GET_mimeType = function() {
	return mimeType;
};
const GET_FILE_EXTENSION = function() {
	return mimeType.slice(6);
};
const CROPPER_OPTIONS = {
	viewMode: 3, //3
	dragMode: 'move',
	aspectRatio: 20 / 23,
	autoCropArea: 1,
	restore: false,
	modal: false,
	//guides: false,
	highlight: false,
	cropBoxMovable: false,
	cropBoxResizable: false,
	toggleDragModeOnDblclick: false,
};

function readURL(input) {
	if(input.files && input.files[0]) {
		
		
		
		
		var reader = new FileReader();
		reader.onloadend = function(e) {
			imageContainer.attr('src', e.target.result); //.cropper(CROPPER_OPTIONS);
			editImage();
			$(".processing p").html('');
			$(".processing").removeClass('d-flex').addClass('d-none');
		};
		reader.readAsDataURL(input.files[0]);
	}
}
$("#imgInp").change(function() {
	readURL(this);
	$(".processing").removeClass('d-none').addClass('d-flex');
	$(".processing p").html('image loading for crop...');
});

function crop() {
	var cropcanvas = $('#image-container').cropper('getCroppedCanvas', {
		width: 600,
		height: 690,
		fillColor: '#fff',
		imageSmoothingQuality: 'high'
	}).toDataURL(GET_mimeType());
	$.ajax({
		type: 'POST',
		url: 'uploadData.php',
		data: {
			croppedImage: cropcanvas,
			filename: 'test.png',
			fileExt: GET_FILE_EXTENSION()
		},
		beforeSend: function() {
			$(".processing").removeClass('d-none').addClass('d-flex');
			$(".processing p").html('image cropping and uploading ...');
			$('#container--box').css("opacity", ".1");
			$('#process').css("display", "block");
		},
		success: function(result, status, xhr) {
			$("#cropBox").removeClass('d-block').addClass('d-none');
			//$("#imgInput").removeClass('sr-only');
			$("#response").removeClass('d-none').addClass('d-block');
			$(".processing").removeClass('d-flex').addClass('d-none');
			if(status == "success") {
				//$image.cropper('destroy');
				cancelEdit();
				$(".processing p").html('');
				//	$("#cropimageModal").modal();
				$("#response").html(result);
			}
			$('#process').css("display", "none");
			$('#container--box').css("opacity", "1");
			var res = ("Result :" + result);
			var stat = ("Status :" + status);
			var rt = ("xhr :" + xhr.responseText);
			//$("#res--msg").html(stat);
		},
		error: ()=> {
			$('#process').css("display", "none");
			$('#container--box').css("opacity", "1");
			$("#response").html(res + "<br>" + stat);
		},
	});
}
// Get the Cropper.js instance after initialized
//var cropper = $image.data('cropper');
function editImage() {
	imageContainer.cropper(CROPPER_OPTIONS);
	//$('.editImage').removeClass('d-block').addClass('d-none');
	//$('.cancelEdit').removeClass('d-none').addClass('d-block');
	$("#cropBtn").removeClass('d-none').addClass('d-block');
}

function cancelEdit() {
	imageContainer.cropper('destroy');
	imageContainer.attr('src', './assets/img/select-an-image.jpg'); //.cropper(CROPPER_OPTIONS);
	$('.custom-file-label').html("Choose image");
	$("#file_size").html("");
	//$('.editImage').removeClass('d-none').addClass('d-block');
	//$('.cancelEdit').removeClass('d-block').addClass('d-none');
	$("#cropBtn").removeClass('d-block').addClass('d-none');
}