<?php
session_start();
if (!isset($_SESSION['user'])) {
    //header("Location : login.php");
    // echo '<script>alert("Session user not set.")</script>';
    //	echo '<script>alert("Please login first.")</script>';
    echo '<script>window.location.href= "login.php";</script>';
}
$user = $_SESSION['user'];
$fol = "cropped_img/";
$pngimg = $fol . $user . '_profile-image.png';
$jpgimg = $fol . $user . '_profile-image.jpg';
$img;
$selectImgBtn;
if (file_exists($pngimg)) {
    $img = $pngimg;
    $selectImgBtn = "Change Image.";
} else if (file_exists($jpgimg)) {
    $img = $jpgimg;
    $selectImgBtn = "Change Image.";
} else {
    $img = 'assets/images/selectImage.jpg';
    $selectImgBtn = "Select Image.";
}
$_SESSION['img'] = $img;
?>


<!DOCTYPE html>
<html>
	<head>
		<title>Custom Cropper</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=10 shrink-to-fit=no">
		<meta http-equiv="x-ua-compatible" content="ie=edge">
		<meta name="theme-color" content="#09407f" >
		<link  href="assets/libs/css/bootstrap.min.css" rel="stylesheet">
		<link  href="assets/libs/css/cropper.css" rel="stylesheet">
		<link  href="assets/css/style.css" rel="stylesheet">
		<style type="text/css"></style>
	</head>
	<!-- Wrap the image or canvas element with a block element (container) -->
	<body>
		<div class="processing d-none" >
			<img src="assets/images/loader.gif" >
			<p>Processing...</p>
		</div>
		<br>
		<div class="container" >
			<h3>Crop image and upload.</h3>
			<a class="btn btn-danger ml-5 my-2" href="logout.php" >Logout</a> 
			<div class="img-container border" >
				<img id="image" src="<?php echo $img.'?i='.time(); ?>" alt="your image" />
			</div>
			<br>
			<label>
				<input class="sr-only" type="file"  id="imgInp" accept=".jpeg, .png, .jpg" />
				<p class="border border-primary text-primary px-2" id="change_image" ><? echo $selectImgBtn; ?> <span id="file_name" ></span></p>
			</label>
			<br>
			<div class="d-flex" >
				<button class="editImage btn btn-warning d-block"  onclick="editImage()">Edit Image</button>
				<button class="d-none btn btn-danger cancelEdit" onclick="cancelEdit()">Cancel Edit</button>
				<button id="cropBtn" class="d-none"  onclick="crop()">Crop</button>
			</div>
			<p id="file_size" ></p>
			<div id="response" ></div>
			<br>
		</div>
		<script src="assets/libs/js/jquery.min.js"></script><!-- jQuery is required -->
		<script src="assets/libs/js/cropper.js"></script>
		<script src="assets/js/script.js"></script>
	</body>
</html>