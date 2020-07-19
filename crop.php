<?php
session_start();
if(!isset($_SESSION['user'])){
   //header("Location : login.php");
   echo '<script>alert("Session user not set.")</script>';
	echo '<script>location.href= "login.php";</script>';
}
$user = $_SESSION['user'];
$fol="cropped_img/";
$pngimg = $fol.$user.'_profile-image.png';
$jpgimg = $fol.$user.'_profile-image.jpg';
$img;
if(file_exists($pngimg)){
	$img = $pngimg;
	}else 
	if(file_exists($jpgimg)){
	$img = $jpgimg;
	}else{
	$img = 'assets/images/selectImage.jpg';
	}
	$_SESSION['img']=$img;
?>
<!DOCTYPE html>
<html>
<head>
<title>Custom Cropper</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<meta http-equiv="x-ua-compatible" content="ie=edge">
<meta name="theme-color" content="#09407f" >
<link  href="assets/libs/css/bootstrap.min.css" rel="stylesheet">
<link  href="assets/libs/css/cropper.css" rel="stylesheet">
<style type="text/css">
*{
margin:0;
padding:0;
box-sizing:border-box;
}
.img-container{
margin:0 auto;
width:300px;
height:400px;
}
/* Limit image width to avoid overflow the container */
img {
  max-width: 100%; /* This rule is very important, please do not ignore this! */
}

#response{
min-width:280px;
margin:10px auto;
padding:20px;
}
#response img{
	width:100%;
	border:2px solid grey;
	border-radius:5px;
}
#cropBtn{
margin:0 40%;
padding:5px 10px;
text-align:center;
}
.processing{
position:fixed;
display:flex;
flex-direction: column;
justify-content:center;
align-items:center;
left:0;
right:0;top:0;bottom:0;
z-index:1200;
display:flex;
background:#fff;
}
.processing img{width:;}
.processing p{margin-top:20px;}
file_property span{display:inline-block; white-space:nowrap;}
#change_image span{white-space:nowrap;color:#000;}
</style>
</head>
<!-- Wrap the image or canvas element with a block element (container) -->
<body>
<div class="processing d-none" >
<img src="assets/images/loader.gif" >
<p>Processing...</div>

<br>
<div class="container" >
<h3>Crop image and upload.</h3>
<a class="btn btn-danger ml-5 my-2" href="logout.php" >Logout</a> 
<div class="img-container border" >
  <img id="image" src="<?php echo $img; ?>" alt="your image" />
  </div>
  <br>
  
  <label>
  <input class="sr-only" type="file"  id="imgInp" accept=".jpeg, .png, .jpg" />
  <p class="border border-primary text-primary px-2" id="change_image" >Change Image <span id="file_name" ></span></p>
  </label>
  
<br><button class="editImage btn btn-warning d-block"  onclick="editImage()">Edit Image</button>
<button class="d-none btn btn-danger cancelEdit" onclick="cancelEdit()">Cancel Edit</button>
</p><p id="file_size" ></p>
<button id="cropBtn" class="d-none"  onclick="crop()">Crop</button>
<div id="response" ></div>
<br>
</div>
<script src="assets/libs/js/jquery.min.js"></script><!-- jQuery is required -->
<script src="assets/libs/js/cropper.js"></script>
<script type="text/javascript">


const $image = $('#image');

//check real mime type of a file
			const selected_file ={mimeType:'File not found.'}
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
			    $("#file_name").html("File: "+file.name);
			    $("#file_size").html("Size: "+((file.size/1024).toFixed(2))+"KB;&nbsp&nbsp");
			    const blob = file.slice(0, 4);
			    filereader.readAsArrayBuffer(blob);
			})
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
			const getMimeType = function(){
				return selected_file.mimeType
			};
			const getFileExt = function(){
			return selected_file.mimeType.slice(6)
			};
			
			//function showMtype(){document.getElementById('mime').innerHTML =getMimeType()+" Ext : "+ getFileExt();}





const options={
  viewMode: 3,
  dragMode: 'move',
  aspectRatio:3/4,
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
      $image.attr('src', e.target.result);//.cropper(options);
    editImage();
    $("#cropBtn").removeClass('d-none').addClass('d-block');
    $(".processing").removeClass('d-flex').addClass('d-none');
    }
    
    reader.readAsDataURL(input.files[0]);
  }
}

$("#imgInp").change(function(){
  readURL(this);
$(".processing").removeClass('d-none').addClass('d-flex');
$(".processing p").html('image loading for crop.');
});




function crop(){
var cropcanvas = $('#image').cropper('getCroppedCanvas',{width:600,height:690});
var croppng = cropcanvas.toDataURL(getMimeType());
$.ajax({
	type: 'POST',
	url: 'uploadData.php',
	data: {
		croppedImage: croppng,
		filename: 'test.png',
		fileExt: getFileExt()
	},
	beforeSend:function(){
		$(".processing").removeClass('d-none').addClass('d-flex');
		$('#container--box').css("opacity",".1");
		$('#process').css("display","block");
	},
	success: function(result,status,xhr) {
		$("#cropBtn").removeClass('d-block').addClass('d-none');
//		$("#cropBox").removeClass('d-block').addClass('d-none');
		//$("#imgInput").removeClass('sr-only');
		$("#response").removeClass('d-none').addClass('d-block');
		$(".processing").removeClass('d-flex').addClass('d-none');
		
		if(status=="success"){
		//$image.cropper('destroy');
		cancelEdit();
		//	$("#cropimageModal").modal();
			$("#response").html(result);
		};
	$('#process').css("display","none");
	$('#container--box').css("opacity","1");
	var res = ("Result :"+result);
	var stat= ("Status :"+status);
	var rt = ("xhr :"+xhr.responseText);
	//$("#res--msg").html(stat);
	},
	error() {
	$('#process').css("display","none");
	$('#container--box').css("opacity","1");
	$("#response").html(res+"<br>"+stat);
	},
});
};
// Get the Cropper.js instance after initialized
//var cropper = $image.data('cropper');
function editImage(){
$image.cropper(options);
$('.editImage').removeClass('d-block').addClass('d-none');
$('.cancelEdit').removeClass('d-none').addClass('d-block');
}
function cancelEdit(){
$image.cropper('destroy');
$('.editImage').removeClass('d-none').addClass('d-block');
$('.cancelEdit').removeClass('d-block').addClass('d-none');
}
</script>
</body>
</html>