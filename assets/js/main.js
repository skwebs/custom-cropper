"use strict";
// 
var imgForCropSection = $('#img_for_crop_section');
var imgForCrop = $('#img_for_crop');
var imgPreviewSection = $("#img_preview_section");
var imageInput = document.getElementById('image-input');
var processing = $(".processing");
var processingText = $(".processing p");
var fileName = $("#file_name");
var fileSize = $("#file_size");
var fileLabel = $('.custom-file-label');
var cropBtn = $("#cropBtn");
//	var cancelBtn = $(".cancelEdit");
var labelImg = $("#label_image");
var response = $("#response");
var mimeType = '';

//	 IMAGE LOAD SECTION ================================
imageInput.addEventListener('change', (event) => {
	cancelEdit();
	showProcees('image loading for crop...');
	console.time('FileOpen');
	var files = event.target.files;
	if (files && files[0]) {
		var file = files[0];
		var fileReaderForDataURL = new FileReader();
		fileReaderForDataURL.onloadend = function(e) {
			imgForCrop.attr('src', e.target.result);
			
			imgPreviewSection.fadeOut(()=>{
				imgForCropSection.fadeIn();
				editImage();
				hideProcess();
			});
			
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

//	IMAGE MIME SECTION ==================================
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

//	CROPPER PLUGIN SECTION =========================
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
	var cropCanvas = imgForCrop.cropper('getCroppedCanvas', {
		width: 600,
		height: 690,
		fillColor: '#fff',
		imageSmoothingQuality: 'high'
	}).toDataURL(mimeType);
	$.ajax({
		type: 'POST',
		url: 'upload.php',
		dataType:'json', // what type of data do we expect back from the server
		encode 	: true, 
		data: {
			croppedImageFile: cropCanvas,
			fileExt: mimeType.slice(6)
		},
		beforeSend: () => {
			showProcees('image cropping and uploading ...');
		},
		success: (res) => {
			console.timeEnd("Image cropped.")
			console.log('response:'+JSON.stringify(res))
			imgForCropSection.fadeOut(()=>{
				imgPreviewSection.fadeIn();
				hideProcess();
				cancelEdit();
			});
			fileLabel.html("Choose image");
			
			if(res.success){
				//	change image of label image
				labelImg.attr("src",res.imgPath);
				response.removeClass("alert-danger").addClass("alert-success").html(res.msg+"<br/>"+res.imgName)
				
				//	let imgPreview = new Image(300,345);imgPreview.src = res.imgPath;document.getElementById("response").appendChild(imgPreview);
			}else{
				response.removeClass("alert-success").addClass("alert-danger").html(res.msg)
			}
		},
		error: (res, stat) => {
			hideProcess();
			cancelEdit();
			response.html(res + "<br>" + stat)
		}
	})
}

//	OTHER SUPPORTING FUNCTIONS ==================================
function editImage() {
	imgForCrop.cropper(cropperOptions);
	cropBtn.removeClass('d-none').addClass('d-block')
	//cancelBtn.removeClass('d-none').addClass('d-block')
}

function cancelEdit() {
	imgForCrop.cropper('destroy');
	cropBtn.removeClass('d-block').addClass('d-none')
//	cancelBtn.removeClass('d-block').addClass('d-none')
	imgForCrop.attr('src', './assets/img/select-an-image.jpg');
	//	fileLabel.html("Choose image");
	//	fileSize.html("");
}

function showProcees(msg) {
	processing.removeClass('d-none').addClass('d-flex');
	processingText.html(msg);
}

function hideProcess() {
	processingText.html('');
	processing.removeClass('d-flex').addClass('d-none');
}