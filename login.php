<?php
   session_start();
   $uname='Satish';
   $pin='1234';
?>
<br><br>
<!DOCTYPE html>
<html>
<head>
<title>Login</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<meta http-equiv="x-ua-compatible" content="ie=edge">
<meta name="theme-color" content="#09407f" >
<link  href="assets/libs/css/bootstrap.min.css" rel="stylesheet">
<style type="text/css">
.login-box{position:fixed;top:0;bottom:0;left:0;right:0;
background-color: #2876f9;
background-image: linear-gradient(315deg, #4b6cb7 , #182848);
z-index:9999;
display:flex;
justify-content:center;
align-items:center;
}
.login-box > form{
max-width:500px;
min-width:300px;
padding:20px;
background:rgba(255,255,255,.2);
color:#ddd;
}
.form-control{
background: rgba(0,0,0,0);color:#ddd;}
.form-control:hover,
.form-control:focus
{background:rgba(255,255,255,.01);
color:yellow;outline-color:green; box-shadow:none;
}
</style>
</head>
<body>
<?php
if(!isset($_SESSION['user'])){
echo '<div class="login-box" >
	<form action="login.php" method="post" >
	<div class="box container" >
		<center><h4>Login Form</h4></center>
		<div class="form-group" >
			<label for="user">Username</label>
			<input name="user" id="user" type="text" class="form-control" required>
		</div><!--
		<div class="form-group" >
		<label for="pin">PIN</label>
		<input name="pin" id="pin" type="password" class="form-control" required>
		</div>-->
		<br>
		<div class="form-group" >
		<input name="login" type="submit" class="btn btn-success btn-block" value="Login" >
		</div>
	</div>
	</form>
</div>';
} else {
//	header("Location:./");
echo '<script>window.location.href="./"</script>';
}

if(isset($_POST['login'])){
if($_POST['user']!==""){
	$_SESSION['user']=$_POST['user'];
	//header("Location:./");
echo '<script>window.location.href="./"</script>';
}
	/*if($_POST['user']==$uname && $_POST['pin']==$pin){
		$_SESSION['user']=$_POST['user'];
		header("Location:preview2.php");
		//echo '<script>alert("Session user not set.")</script>';
	}else{
		echo '<script>alert("Incorrect details please input correct details.")</script>';
	}*/
}

?>
</body>
</html>