<?php
$url = "http://www.google.cn/music/artist?id=".$_POST['id'];
$pagedata = file_get_contents($url);
//
//
$reg = "/player_iframe%3Fid%3D(\w+).*?\">([^<].*?)</";
preg_match_all($reg,$pagedata,$hotsongs,PREG_SET_ORDER);
$dom = new DOMDocument('1.0','utf-8');
$playlistNode = $dom->CreateElement("playlist");
$dom->appendChild($playlistNode);
$listnameNode = $dom->CreateElement("listname");
$listnameNode->appendChild($dom->CreateTextNode("temp"));
$playlistNode->appendChild($listnameNode);
$songListNode = $dom->CreateElement("songList");
$playlistNode->appendChild($songListNode);

foreach($hotsongs as $song){
	$name = html_entity_decode($song[2],ENT_COMPAT,"utf-8");
	$songNode = $dom->CreateElement("song");
	$songid = $dom->CreateElement("id");
	$songname = $dom->CreateElement("name");
	$songid->appendChild($dom->CreateTextNode($song[1]));
	$songname->appendChild($dom->CreateTextNode($name));
	$songNode->appendChild($songid);
	$songNode->appendChild($songname);
	$songListNode->appendChild($songNode);
}
$dom->save("ownlist/temp.pli");
//
//
preg_match("/(?<=width=\"100%\" align=\"left\">)[^<]+/",$pagedata,$artistname);

preg_match_all("/left\"><a href=\"\/music\/url\?q=%2Fmusic%2Falbum%3Fid%3D(\w+).*?《([^》]*)/u",$pagedata,$results,PREG_SET_ORDER);

echo "<span style='font-weight:bold;background-color:#999;color:#555;padding:0px 10px 0px 10px;margin-left:2px;'>{$artistname[0]}的专辑列表</span><table>";

echo "<tr><td bgcolor='#cccccc'><a href='ownlist/temp.pli' style='display:block'  onclick='a_onclick(this);return false;'>热门歌曲_{$artistname[0]}</a></td><td><span style='font-size:12px;background-color:#666;color:#bbb;float:right;display:block;padding:2px;cursor:pointer;width:24px;' onclick='globalevent=event;loadsonglist(\"playlist=temp.pli\",\"热门歌曲_{$artistname[0]}\");'>详情</span></td></tr>";

$i = 0;
foreach ($results as $result){
	$color = ($i%2)?"#cccccc":"#bbbbbb";
	$id = $result[1];
	$name = $result[2];
	$name_special = htmlspecialchars($name);
	echo "<tr><td bgcolor='$color'><a href='http://www.google.cn/music/album?id=$id&output=xml' style='display:block'  onclick='a_onclick(this);return false;'>$name</a></td><td><span style='font-size:12px;background-color:#666;color:#bbb;float:right;display:block;padding:2px;cursor:pointer;width:24px;' onclick='globalevent=event;loadsonglist(\"playlist=$id&cat=ablum\",\"$name_special\");'>详情</span></td></tr>";
	$i++;
}

echo "</table>";
?>