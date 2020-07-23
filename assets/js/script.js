const $IMAGE = $('#image');

//check real mime type of a file
const SELECTED_FILE = {
	mimeType: 'image/jpeg'
}
const FILE_SELECTOR = document.getElementById('imgInp')
FILE_SELECTOR.addEventListener('change', (event) => {
// action after image selection
		
	console.time('FileOpen')
	
	// assigned selected file data in file const
	const FILE = event.target.files[0]
	const FILE_READER = new FileReader()
	FILE_READER.onloadend = function(evt) {
		//alert(evt.target.result);

		if (evt.target.readyState === FileReader.DONE) {
			const UINT = new Uint8Array(evt.target.result)
			let bytes = []
			UINT.forEach((byte) => {
				bytes.push(byte.toString(16))
			})
			const HEX = bytes.join('').toUpperCase()
			SELECTED_FILE.mimeType = CHECK_MIME_TYPE(HEX);
			//showMtype();
		}

		console.timeEnd('FileOpen')
	}
	$('.custom-file-label').html(FILE.name);
	//$("#file_name").html("File: " + FILE.name);
	$("#file_size").html("Size: " + ((FILE.size / 1024).toFixed(2)) + "KB;&nbsp&nbsp");
	const BLOB = FILE.slice(0, 4);
	FILE_READER.readAsArrayBuffer(BLOB);
});

const CHECK_MIME_TYPE = (signature) => {
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
const GET_MIME_TYPE = function() {
	return SELECTED_FILE.mimeType
};
const GET_FILE_EXTENSION = function() {
	return SELECTED_FILE.mimeType.slice(6)
};

//function showMtype(){document.getElementById('mime').innerHTML =GET_MIME_TYPE()+" Ext : "+ GET_FILE_EXTENSION();}




const OPTIONS = {
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
			$IMAGE.attr('src', e.target.result); //.cropper(OPTIONS);
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
	var croppng = cropcanvas.toDataURL(GET_MIME_TYPE());
	$.ajax({
		type: 'POST',
		url: 'uploadData.php',
		data: {
			croppedImage: croppng,
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
	$IMAGE.cropper(OPTIONS);
	//$('.editImage').removeClass('d-block').addClass('d-none');
	//$('.cancelEdit').removeClass('d-none').addClass('d-block');
	$("#cropBtn").removeClass('d-none').addClass('d-block');
}

function cancelEdit() {
	$IMAGE.cropper('destroy');
	$IMAGE.attr('src', './assets/img/select-an-image.jpg'); //.cropper(OPTIONS);
	$('.custom-file-label').html("Choose image");
	$("#file_size").html("");
	//$('.editImage').removeClass('d-none').addClass('d-block');
	//$('.cancelEdit').removeClass('d-block').addClass('d-none');
	$("#cropBtn").removeClass('d-block').addClass('d-none');
}