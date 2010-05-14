<?php
if (isset($_POST['name'])){
	while(true){
		$filename = "ownlist/".md5(time()+rand()).".pli";
		if (!file_exists($filename)) break;
	}
	$doc = new DOMDocument();
	$doc->load("default.pli");
	$doc->getElementsByTagName("listname")->item(0)->nodeValue = $_POST['name'];
	$doc->save($filename);
	echo "Saved as {$_POST['name']} Successfully";
}
?>