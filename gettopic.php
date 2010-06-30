<?php
$start = isset($_GET['start'])?$_GET['start']:0;

$page_data = file_get_contents("http://www.google.cn/music/topiclistingdir?cat=song&start=$start");
preg_match_all("/(?<=<a class=\"topic_title\" href=\"\/music\/url\?q\=%2Fmusic%2Ftopiclisting%3Fq%3D)(.*?)(?:%26cat.*?\">)(.*?)(?:<\/a>.*?(?:<div>(.*?)<\/div>|<div title=\")(.*?)(?=\"))/s",$page_data,$topics);

echo "<table>";
$i = 0;
foreach($topics[1] as $topic) {
	$color = ($i%2)?"#cccccc":"#bbbbbb";
	$id = $topic;
	$name = $topics[2][$i];
	if($topics[3][$i]){
		$title = $topics[3][$i];
	} else {
		$title = $topics[4][$i];
	}

	echo "<tr><td bgcolor='$color'><a href='http://www.google.cn/music/topiclisting?q=$id&cat=song&output=xml' style='display:block' title='$title' onclick='a_onclick(this);return false;' onmouseover='showtitle(this);return false;' onmouseout='cleartitle();return false;' onmousemove='movetitle(event);'>$name</a></td><td><span style='font-size:12px;background-color:#666;color:#bbb;float:right;display:block;padding:2px;cursor:pointer;' onclick='loadsonglist(\"playlist=$id\",\"$name\",{\"pageY\":event.pageY?event.pageY:event.y,\"clientX\":event.clientX});'>详情</span></td></tr>";
	$i++;
}
echo "</table>";


echo "<br /><br /><table><tr bgcolor='#cccccc'>";
preg_match_all("/(?<=page_link_)\d+/",$page_data,$pages);
foreach($pages[0] as $page) {
	$page_links[$page] = 1;
}
preg_match("/(?<=currentpage\">)\d+/",$page_data,$page);
$page_links[$page[0]] = 0;

ksort($page_links);
foreach ($page_links as $key => $page_link) {
	$start = ($key - 1) * 14;
	if ($page_link == 0) {
		echo "<td><span style='display:block; color:#333333;font-weight:bold; width:14px; text-align:center;'>$key</span></td>";
	} else {
		echo "<td><span onclick='gettopic($start)' style='display:block; cursor:pointer;color:#333333; width:14px; text-align:center;'>$key</span></td>";
	}
}
echo "</tr></table>";
?>
