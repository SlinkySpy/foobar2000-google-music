<?php
if(substr($_POST['playlist'],-4) == ".pli"){
	$playlisturl = "ownlist/{$_POST['playlist']}";
} elseif(isset($_POST['cat']) && $_POST['cat'] == "ablum"){
	$playlisturl = "http://www.google.cn/music/album?id={$_POST['playlist']}&output=xml";
} else {
	$playlisturl = "http://www.google.cn/music/topiclisting?q={$_POST['playlist']}&cat=song&output=xml";
}
$dom = new DOMDocument();
$dom->load($playlisturl);
$songs = $dom->getElementsByTagName("song");
echo "<from id='songlistform'><table width='100%' cellspacing='0' style='padding:4px 10px 0px 0px;'>";
if ($songs->length != 1){
	$border ="border-bottom:1px solid #aaa;";
}
$i = 0;
$songs_json = array();
if ($songs->length == 0) echo "<span style='font-size:12px'>此列表没有任何歌曲</span>";
foreach($songs as $song){
	$color = ($i%2)?"#999":"#888";
	$name = $song->getElementsByTagName("name")->item(0)->nodeValue;
	$id = $song->getElementsByTagName("id")->item(0)->nodeValue;
	$songs_json[$id] = $name;
	echo "<tr style='background-color:$color'><td width='20'><input type='checkbox' name='$id'/></td><td style='font-size:12px;$border;'>$name</td><td width='15'><span style='cursor:pointer;font-weight:bold;' title='添加到默认播放列表' onclick='addonesong(\"$id\");'>+</span></td></tr>";
	$border = "border-top:1px solid #aaa;border-bottom:1px solid #aaa;";
	$i++;
	if ($i == $songs->length-1) $border = "border-top:1px solid #aaa;";
}

echo "</table></form>";
$songs_jsonstring = json_encode($songs_json);
echo "<script language='javascript'>songs_obj = eval($songs_jsonstring);</script>";
?>