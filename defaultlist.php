<?php
$dom = new DOMDocument();
$dom->load("default.pli");
$songs = $dom->getElementsByTagName("song");
echo "<from id='songlistform'><table width='100%' cellspacing='0' style='padding:4px 10px 0px 0px;'>";
if ($songs->length != 1){
	$border ="border-bottom:1px solid #aaa;";
}
$i = 0;
if ($songs->length == 0) echo "<span style='font-size:12px'>还没有添加任何歌曲</span>";
foreach($songs as $song){
	$color = ($i%2)?"#999":"#888";
	$name = $song->getElementsByTagName("name")->item(0)->nodeValue;
	$id = $song->getElementsByTagName("id")->item(0)->nodeValue;
	echo "<tr style='background-color:$color'><td width='20'><input type='checkbox' name='$id'/></td><td style='font-size:12px;$border;'>$name</td><td width='15'><span style='cursor:pointer;font-weight:bold;' title='删除此曲目' onclick='deleteonesong(\"$id\");'>×</span></td></tr>";
	$border = "border-top:1px solid #aaa;border-bottom:1px solid #aaa;";
	$i++;
	if ($i == $songs->length-1) $border = "border-top:1px solid #aaa;";
}

echo "</table></form>";
?>