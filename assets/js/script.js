const $image = $('#image');

//check real mime type of a file
const selected_file = {
	mimeType: 'image/jpeg'
}
const fileSelector = document.getElementById('imgInp')
fileSelector.addEventListener('change', (event) => {
	//$("#cropBtn").removeClass('d-none').addClass('d-block');
	// $("#cropBox").removeClass('d-none').addClass('d-block');
	//$("#imgInput").addClass('sr-only');
	//$("#response").removeClass('d-block').addClass('d-none');
	console.time('FileOpen')
	const file = event.target.files[0]
	const filereader = new FileReader()
	filereader.onloadend = function(evt) {
		//alert(evt.target.result);

		if (evt.target.readyState === FileReader.DONE) {
			const uint = new Uint8Array(evt.target.result)
			let bytes = []
			uint.forEach((byte) => {
				bytes.push(byte.toString(16))
			})
			const hex = bytes.join('').toUpperCase()
			selected_file.mimeType = checkMimeType(hex);
			//showMtype();
		}

		console.timeEnd('FileOpen')
	}
	$("#file_name").html("File: " + file.name);
	$("#file_size").html("Size: " + ((file.size / 1024).toFixed(2)) + "KB;&nbsp&nbsp");
	const blob = file.slice(0, 4);
	filereader.readAsArrayBuffer(blob);
});

const checkMimeType = (signature) => {
	switch (signature) {
		case '89504E47':
			return 'image/png'
		case '47494638':
			return 'image/gif'
		case '25504446':
			return 'application/pdf'
		case 'FFD8FFDB':
		case 'FFD8FFE0':
		case 'FFD8FFE1':
			return 'image/jpeg'
		case '504B0304':
			return 'application/zip'
		default:
			return 'Unknown filetype'
	}
}
// get Mime Type
const getMimeType = function() {
	return selected_file.mimeType
};
const getFileExt = function() {
	return selected_file.mimeType.slice(6)
};

//function showMtype(){document.getElementById('mime').innerHTML =getMimeType()+" Ext : "+ getFileExt();}




const options = {
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
	if (input.files && input.files[0]) {
		var reader = new FileReader();

		reader.onloadend = function(e) {
			$image.attr('src', e.target.result); //.cropper(options);
			editImage();
			$(".processing p").html('');
			$(".processing").removeClass('d-flex').addClass('d-none');
		}

		reader.readAsDataURL(input.files[0]);
	}
}

$("#imgInp").change(function() {
	readURL(this);
	$(".processing").removeClass('d-none').addClass('d-flex');
	$(".processing p").html('image loading for crop...');
});




function crop() {
	var cropcanvas = $('#image').cropper('getCroppedCanvas', {
		width: 600,
		height: 690,
		fillColor: '#fff',
		imageSmoothingQuality: 'high'
	});
	var croppng = cropcanvas.toDataURL(getMimeType());
	$.ajax({
		type: 'POST',
		url: 'uploadData.php',
		data: {
			croppedImage: croppng,
			filename: 'test.png',
			fileExt: getFileExt()
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

			if (status == "success") {
				//$image.cropper('destroy');
				cancelEdit();
				$(".processing p").html('');
				//	$("#cropimageModal").modal();
				$("#response").html(result);
			};
			$('#process').css("display", "none");
			$('#container--box').css("opacity", "1");
			var res = ("Result :" + result);
			var stat = ("Status :" + status);
			var rt = ("xhr :" + xhr.responseText);
			//$("#res--msg").html(stat);
		},
		error() {
			$('#process').css("display", "none");
			$('#container--box').css("opacity", "1");
			$("#response").html(res + "<br>" + stat);
		},
	});
};
// Get the Cropper.js instance after initialized
//var cropper = $image.data('cropper');
function editImage() {
	$image.cropper(options);
	$('.editImage').removeClass('d-block').addClass('d-none');
	$('.cancelEdit').removeClass('d-none').addClass('d-block');
	$("#cropBtn").removeClass('d-none').addClass('d-block');
}

function cancelEdit() {
	$image.cropper('destroy');
	$('.editImage').removeClass('d-none').addClass('d-block');
	$('.cancelEdit').removeClass('d-block').addClass('d-none');
	$("#cropBtn").removeClass('d-block').addClass('d-none');
}