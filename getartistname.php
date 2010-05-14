<?php
$url = "http://www.google.cn/music/artistlibrary?region=cn&type=".$_POST['cat'];
$pagedata = file_get_contents($url);
preg_match_all("/initial\">(.).*?<\/table>/s",$pagedata,$results,PREG_SET_ORDER);

echo "<table>";
$j = 0;
foreach ($results as $result){
	$color_out = $j%2?"#ccc":"#aaa";
	echo "<tr style='background-color:$color_out;'><td style='background-color:#666;color:#FFF;'><strong>{$result[1]}</strong></td><td><table cellpadding='3' cellspacing='3' style='font-size:12px;'><tr>";
	preg_match_all("/(?<=id%3D)(\w*?)&.*?>(.*?)</s",$result[0],$matches,PREG_SET_ORDER);
	$i=1;
	$h=0;
	$len = count($matches);
	foreach ($matches as $match){
		$color_in = $h%2?"#b0b0b0":"#c1c1c1";
		echo "<td style='background-color:$color_in;'><span style='cursor:pointer;' onclick='ajax(\"getalbums.php\",\"id={$match[1]}\",loadalbumsresponse);'>{$match[2]}<span></td>";
		if ($i%6 == 0 && $i != $len) {
			echo "</tr><tr>";
			$h++;
		}
		$i++;
		$h++;
	}
	echo "</tr></table></td></tr>";
	$j++;
}
echo "</table>";
?>