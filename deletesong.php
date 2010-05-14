<?php
$ids = split("nabice",$_POST['id']);
$dom = new DOMDocument();
$dom->load("default.pli");
$songlist = $dom->getElementsByTagName("songList")->item(0);
$songs = $songlist->getElementsByTagName("song");
for($i=0;$i<$songs->length;$i++){
	if (in_array($songs->item($i)->getElementsByTagName("id")->item(0)->nodeValue,$ids)){
		$songlist->removeChild($songs->item($i));
		$i = $i - 1;
	}
}
$dom->save("default.pli");
echo "Delete Songs Successfully";
?>