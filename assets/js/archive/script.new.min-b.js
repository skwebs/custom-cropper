"use strict";
var imageContainer = $("#image"),
	mimeType = "",
	imageInput = document.getElementById("imgInp");
imageInput.addEventListener("change", e => {
	$(".processing").removeClass("d-none").addClass("d-flex"), $(".processing p").html("image loading for crop..."), console.time("FileOpen");
	var a = e.target.files;
	if (a && a[0]) {
		var s = a[0],
			o = new FileReader;
		o.onloadend = function(e) {
			imageContainer.attr("src", e.target.result), editImage(), $(".processing p").html(""), $(".processing").removeClass("d-flex").addClass("d-none")
		}, o.readAsDataURL(s);
		var n = new FileReader;
		n.onloadend = function(e) {
			if (e.target.readyState === FileReader.DONE) {
				var a = new Uint8Array(e.target.result);
				let o = [];
				a.forEach(e => {
					o.push(e.toString(16))
				});
				var s = o.join("").toUpperCase();
				mimeType = checkMimeType(s), alert(mimeType.slice(6))
			}
			console.timeEnd("FileOpen")
		}, $(".custom-file-label").html(s.name), $("#file_name").html("File: " + s.name), $("#file_size").html("Size: " + (s.size / 1024).toFixed(2) + "KB;&nbsp&nbsp");
		var r = s.slice(0, 4);
		n.readAsArrayBuffer(r)
	}
});
var checkMimeType = e => {
		switch (e) {
			case "89504E47":
				return "image/png";
			case "47494638":
				return "image/gif";
			case "25504446":
				return "application/pdf";
			case "FFD8FFDB":
			case "FFD8FFE0":
			case "FFD8FFE1":
				return "image/jpeg";
			case "504B0304":
				return "application/zip";
			default:
				return "Unknown filetype"
		}
	},
	cropperOptions = {
		viewMode: 3,
		dragMode: "move",
		aspectRatio: 20 / 23,
		autoCropArea: 1,
		restore: !1,
		modal: !1,
		highlight: !1,
		cropBoxMovable: !1,
		cropBoxResizable: !1,
		toggleDragModeOnDblclick: !1
	};

function crop() {
	var e = $("#image").cropper("getCroppedCanvas", {
		width: 600,
		height: 690,
		fillColor: "#fff",
		imageSmoothingQuality: "high"
	}).toDataURL(mimeType);
	$.ajax({
		type: "POST",
		url: "uploadData.php",
		data: {
			croppedImage: e,
			filename: "test.png",
			fileExt: mimeType.slice(6)
		},
		beforeSend: () => {
			$(".processing").removeClass("d-none").addClass("d-flex"), $(".processing p").html("image cropping and uploading ..."), $("#container--box").css("opacity", ".1"), $("#process").css("display", "block")
		},
		success: (e, a, s) => {
			$("#cropBox").removeClass("d-block").addClass("d-none"), $("#response").removeClass("d-none").addClass("d-block"), $(".processing").removeClass("d-flex").addClass("d-none"), "success" == a && (cancelEdit(), $(".processing p").html(""), $("#response").html(e)), $("#process").css("display", "none"), $("#container--box").css("opacity", "1");
			s.responseText
		},
		error:()=> {
			$("#process").css("display", "none"), $("#container--box").css("opacity", "1"), $("#response").html(res + "<br>" + stat)
		}
	})
}

function editImage() {
	imageContainer.cropper(cropperOptions), $("#cropBtn").removeClass("d-none").addClass("d-block")
}

function cancelEdit() {
	imageContainer.cropper("destroy"), imageContainer.attr("src", "./assets/img/select-an-image.jpg"), $(".custom-file-label").html("Choose image"), $("#file_size").html(""), $("#cropBtn").removeClass("d-block").addClass("d-none")
}