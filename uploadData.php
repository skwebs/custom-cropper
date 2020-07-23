<?php
session_start();
//$_SESSION['user'] ='satish';
//set india timezone
date_default_timezone_set('Asia/Kolkata');
$fileExt = $_POST['fileExt'];
if($fileExt=='jpeg'){
	$fileExt = 'jpg';
}
//var_dump($_POST);
//set cropped image name
$croppedImageName = date("F_d_Y-h:i:s_A").".".$fileExt; //$_POST['fileExt'];
//set folder for store image
$folder = "./cropped_img/";
//create directory if not exist
if (!file_exists($folder)) {
    mkdir($folder, 0777, true);
}
//set image folder path
$imagePath = $folder.$croppedImageName;
//if previous image is be available
if (file_exists($imagePath)) {
	if(unlink($imagePath)){
	echo "old image deleted.";
	};
}
//from frontend
$img = $_POST['croppedImage'];
// remove data url code
$img = str_replace('data:image/'.$_POST['fileExt'].';base64,', '', $img);
// replace space to +
$img = str_replace(' ', '+', $img);
//decode base64 code
$data = base64_decode($img);
//save image in file
$image = file_put_contents($imagePath, $data);
//check image created or, not
if($image){
//if image created 
//echo $croppedImageName; 
echo '<img src="'.$imagePath.'" >';
} else {
//if image didn't created 
echo 'image did not create.';
};
echo "<script>alert('Your image saved with name : ".$croppedImageName." in database');</script>";