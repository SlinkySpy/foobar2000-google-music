<?php
$songs = json_decode($_POST['jsonstr'],true);
$dom = new DOMDocument();
$dom->load("default.pli");
$songlist = $dom->getElementsByTagName("songList")->item(0);
foreach($songs as $id => $name){
	$songnode = $dom->CreateElement("song");
	$songid = $dom->CreateElement("id");
	$songname = $dom->CreateElement("name");
	$songid->appendChild($dom->CreateTextNode($id));
	$songname->appendChild($dom->CreateTextNode($name));
	$songnode->appendChild($songid);
	$songnode->appendChild($songname);
	$songlist->appendChild($songnode);
}
$dom->save("default.pli");
if (count($songs) ==1){
	echo "Add $name Successfully";
} else {
	echo "Add Songs Successfully";
}
?>