<?php
$ownlists = scandir(dirname("__FILE__")."/ownlist");
$ownlists = array_slice($ownlists,2);

$output = "<span id='saveas' style='display:none;position:absolute;height:14px;line-height:14px;font-size:12px;left:176px;top:146px;'><form id='saveasform' method='post' onsubmit='if(this.elements[\"name\"].value==\"\") return false;ajax(\"saveas.php\",\"name=\"+this.elements[\"name\"].value,saveas_response);return false;'><input type='text' name='name' style='height:12px;'/><input class='button' type='submit' style='padding:0px;height:16px; ' value='保存' /></form></span><table><tr><td bgcolor='#cccccc'><a href='default.pli' style='display:block; float:left;' onclick='a_onclick(this);return false;'>默认播放列表</a>&nbsp;&nbsp;<span style='font-size:12px;background-color:#333;color:#999;float:right;display:block;padding:2px;cursor:pointer;' onclick='if(document.getElementById(\"saveas\").style.display == \"\") document.getElementById(\"saveas\").style.display=\"none\"; else {document.getElementById(\"saveas\").style.display=\"\";document.getElementById(\"saveasform\").elements[\"name\"].focus();}'>列表另存为</span></td><td><span style='font-size:12px;background-color:#666;color:#bbb;float:right;display:block;padding:2px;cursor:pointer;' onclick='loaddefaultlist({\"pageY\":event.pageY?event.pageY:event.y,\"clientX\":event.clientX});'>编辑</span></td></tr>";
$i = 0;
foreach($ownlists as $ownlist) {
	if ($ownlist == "temp.pli") continue;
	$doc = new DOMDocument();
	$doc->load("ownlist/".$ownlist);
	$ownlist_name = $doc->getElementsByTagName("listname")->item(0)->nodeValue;
	$color = ($i%2)?"#cccccc":"#bbbbbb";
	$output .= "<tr><td bgcolor='$color'><a href='ownlist/$ownlist' style='display:block;float:left;' onclick='a_onclick(this);return false;'>$ownlist_name</a>&nbsp;&nbsp;<span style='font-size:12px;background-color:#333;color:#999;float:right;display:block;padding:2px;cursor:pointer;' onclick='ajax(\"delownlist.php\",\"name=$ownlist\",delownlistresponse);'>删除</span></td><td><span style='font-size:12px;background-color:#666;color:#bbb;float:right;display:block;padding:2px;cursor:pointer;' onclick='loadsonglist(\"playlist=$ownlist\",\"$ownlist_name\",{\"pageY\":event.pageY?event.pageY:event.y,\"clientX\":event.clientX});'>详情</span></td></tr>";
	$i++;
}
$output .= "</table>";
echo $output;
?>