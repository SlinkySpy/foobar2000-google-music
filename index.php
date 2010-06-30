<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>音乐播放</title>
<style>

a:link {TEXT-DECORATION: none; color:#434643}
a:visited {TEXT-DECORATION: none; color:#434643}
a:active {TEXT-DECORATION: none; color:#434643}
a:hover {TEXT-DECORATION: none; color:#888888}
body
{
	background-color:#DDDDDD;
	font-size:14px;
}
.button
{
	background-color:#333333;
	color:#cccccc;
	padding:3px 3px 3px 3px;
	cursor:pointer;
	border:1px solid #333333;
	text-decoration:none
}
#artist_cat span{
	background-color:#999;color:#333;margin-right:5px;cursor:pointer;
}
html *{-moz-user-select: none;}
</style>
</head>
<script language="javascript" src="main.js"></script>
<body onLoad="do_links()" onselectstart="return false;">
<span style="font-weight:bold; background-color:#aaaaaa">音乐榜单:</span><br /><br />
<table><tr><td bgcolor="#bbbbbb">

<a href="http://www.google.cn/music/chartlisting?q=chinese_songs_cn&cat=song&output=xml">华语热歌</a></td><td bgcolor="#cccccc">
<a href="http://www.google.cn/music/chartlisting?q=chinese_new_songs_cn&cat=song&output=xml">华语新歌</a></td><td bgcolor="#bbbbbb">
<a href="http://www.google.cn/music/chartlisting?q=ea_songs_cn&cat=song&output=xml">欧美热歌</a></td><td bgcolor="#cccccc">
<a href="http://www.google.cn/music/chartlisting?q=ea_new_songs_cn&cat=song&output=xml">欧美新歌</a></td></tr></table>
<br /><br /><br />
<span style="font-weight:bold; background-color:#aaaaaa">我的列表:</span><br /><br />

<div id="ownlist"></div>
<br />
<a id="quit" class="button" onclick="play('quit');return false">Quit</a>
<a id="quit_python" class="button" onclick="play('kill');return false">KillPython</a>
<a id="next" class="button" onclick="play('next');return false">Next</a>
<a id="pause" class="button" onclick="play('pause');return false">Pause</a><br /><br />
<div id="percentlayer" style="display:none">Loading,Please Wait...<span id="percent"></span></div>
<br /><br /><br />
<span style="font-weight:bold; background-color:#aaaaaa">专题列表:</span><br /><br />
<div id="oldtopics"></div>
<div id="title" style="display:none;position:absolute;width:300px;background-color:#999999;opacity:0.7;z-index:999"></div>

<div style="position:absolute; top:10px; left:400px; width:500px;"><span style="font-weight:bold; background-color:#aaaaaa">歌手库:</span><div id="artist_cat" style="margin-top:10px;"><span onclick="ajax('getartistname.php','cat=female',loadartistresponse);">女歌手</span><span onclick="ajax('getartistname.php','cat=male',loadartistresponse);">男歌手</span><span onclick="ajax('getartistname.php','cat=bandgroup',loadartistresponse);">乐队组合</span></div>
<div id="artist_name" style="height:300px; width:500px; overflow:auto; margin-top:5px;"></div>
<div id="albums" style="height:300px;width:500px; overflow:auto; margin-top:15px;"></div>

</div>


<div id="songlist" style="display:none;position:absolute;opacity:0.8;background-color:#777;width:508px; "><div id="songlistclose" align="right" style="background-color:#555;height:16px;cursor:move;" onmousedown="mousedownfunc(event);return false;"><span id="songlisttitle" style="font-size:12px;float:left;line-height:18px;margin-left:6px;color:#999"></span><span style="font-size:12px;background-color:#111;color:#777;cursor:pointer;" onclick="document.getElementById('songlist').style.display='none';">Close</span></div><div id="songlistcontent" style="background-color:#999;overflow-Y:auto;width:500px;;max-height:400px;margin:2px 4px 4px 4px;"></div>

<div style="padding:4px 0px 5px 30px;background-color:#444;cursor:move;" onmousedown="mousedownfunc(event);return false;"><span style='font-size:12px;background-color:#111;color:#bbb;cursor:pointer;padding:2px;margin-right:10px;' onclick="selectall('checked');">全部选择</span><span style='font-size:12px;background-color:#111;color:#bbb;cursor:pointer;padding:2px;margin-right:10px;' onclick="selectall('');">全部取消</span><span id="button_multi_use" style='font-size:12px;background-color:#111;color:#bbb;cursor:pointer;padding:2px;'></span></div>
</div>
</body>
</html>