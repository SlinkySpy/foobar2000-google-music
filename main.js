// main.js
var timer;
var playing_topic;
var status_tran = 1;
var status_timer;
var offsetX;
var offsetY;
document.onkeydown = function(event){
	o = event?event:window.event;
	if(o.keyCode == 27) document.getElementById("songlist").style.display = "none";
}
document.onmouseup = function(){
	if(document.documentElement.releaseCapture){
		document.documentElement.releaseCapture();
	}
	document.onmousemove = null;
}
function do_links(){
	for (i=0;i<document.links.length;i++) {
		document.links[i].onclick = a_onclick;
	}
	var oxmlhttp5 = new XMLHttpRequest();
	oxmlhttp5.open("get","percent.txt",true);
	oxmlhttp5.onreadystatechange = function() {
		if ((oxmlhttp5.readyState == 4) && (oxmlhttp5.status == 200)){
			timer = setInterval("getpercent()",1000);
		}
	}
	oxmlhttp5.send(null);
	gettopic(0);
	ajax("ownlist.php","",ownlistresponse);
}
function a_onclick(o) {
	if (this.style)
	{
		o = this;
	}
	if (playing_topic) playing_topic.style.fontWeight = "";
	playing_topic = o;
	o.style.fontWeight = "bold";
	document.title = o.innerHTML;
	var postStr = "playlist="+escape(o.href);
	var url = "do.php"
	var oxmlhttp1 = new XMLHttpRequest();
	oxmlhttp1.open("POST",url,true);
	oxmlhttp1.onreadystatechange = function() {
		if ((oxmlhttp1.readyState == 4) && (oxmlhttp1.status ==200)){
			clearInterval(timer);
			timer = setInterval("getpercent()",1000);
		}
	}
	oxmlhttp1.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	oxmlhttp1.send(postStr);
	return false;
}

var percent_flag = 0;
function getpercent() {
	document.getElementById("percentlayer").innerHTML="Loading,Please Wait...<span id='percent'></span>";
	document.getElementById("percentlayer").style.display = "";
	var oxmlhttp2 = new XMLHttpRequest();
	oxmlhttp2.open("get","percent.txt",true);
	oxmlhttp2.onreadystatechange = function() {
		if((oxmlhttp2.readyState == 4) && (oxmlhttp2.status == 404) && (percent_flag == 1)){
			clearInterval(timer);
			document.getElementById("percentlayer").innerHTML="Now Playing...<span id='percent'></span>";
		}
		if ((oxmlhttp2.readyState == 4) && (oxmlhttp2.status == 200)){
			if (oxmlhttp2.responseText != "1"){
				percent_flag = 1;
				document.getElementById("percent").innerHTML=oxmlhttp2.responseText;
			} else {
				clearInterval(timer);
				document.getElementById("percentlayer").innerHTML="Now Playing...<span id='percent'></span>";
			}
		}
	}
	oxmlhttp2.send(null);
}
function play(action) {
	if (action == "quit" || action == "kill") {
		clearInterval(timer);
	}
	var url = "play.php?action="+action;
	var oxmlhttp3 = new XMLHttpRequest();
	oxmlhttp3.open("get",url,true);
	oxmlhttp3.onreadystatechange = function() {
		if ((oxmlhttp3.readyState == 4) && (oxmlhttp3.status ==200)){
			document.getElementById("percentlayer").innerHTML="Successfully "+action.slice(0,1).toUpperCase()+action.slice(1)+"<span id='percent'></span>";
			document.getElementById("percentlayer").style.display = "";
			clearInterval(status_timer);
			status_tran = 1;
			status_timer = setInterval(statuslayer,200);
		}
	}
	oxmlhttp3.send(null);
}

function gettopic(start) {
	var url = "gettopic.php?start="+start;
	var oxmlhttp4 = new XMLHttpRequest();
	oxmlhttp4.open("get",url,true);
	oxmlhttp4.onreadystatechange = function() {
		if ((oxmlhttp4.readyState == 4) && (oxmlhttp4.status == 200)){
			document.getElementById("oldtopics").innerHTML = oxmlhttp4.responseText;
		}
	}
	oxmlhttp4.send(null);
}

function showtitle(o){
	titlelayer = document.getElementById("title");
	if (o.title != ""){
		o.oldtitle = o.title;
	}
	o.title = ""
	titlelayer.innerHTML = o.oldtitle;
	titlelayer.style.display = "";
	return true;

}

function cleartitle(){
	titlelayer = document.getElementById("title");
	titlelayer.style.display = "none";
	titlelayer.innerHTML = "";
	return true;
}

function movetitle(o){
	var pageX = o.pageX?o.pageX:o.x;
	var pageY = o.pageY?o.pageY:o.y;
	var titlelayer = document.getElementById("title");
	if (titlelayer.innerHTML == ""){
		return true;
	}
	titlelayer.style.left = pageX+20+'px';
	titlelayer.style.top = pageY+'px';
	if (titlelayer.clientHeight+o.clientY > document.documentElement.clientHeight) titlelayer.style.top = pageY - titlelayer.clientHeight+"px";
	return true;
}

function saveas_response(result){
	document.getElementById("percentlayer").innerHTML=result+"<span id='percent'></span>";
	document.getElementById("percentlayer").style.display = "";
	clearInterval(status_timer);
	status_tran = 1;
	status_timer = setInterval(statuslayer,200);
	document.getElementById("saveas").style.display="none";
	document.getElementById("saveasform").elements['name'].value = "";
	ajax("ownlist.php","",ownlistresponse);
}

function ownlistresponse(result){
	document.getElementById("ownlist").innerHTML = result;
}

function delownlistresponse(result){
	document.getElementById("percentlayer").innerHTML=result+"<span id='percent'></span>";
	document.getElementById("percentlayer").style.display = "";
	clearInterval(status_timer);
	status_tran = 1;
	status_timer = setInterval(statuslayer,200);
	ajax("ownlist.php","",ownlistresponse);
}

function songlistresponse(result,param){
	var reg = /<script[^>]*>(.+)<\/script>/im;
	var match = result.match(reg);
	if (match){
		var importjs = match[1];
		eval(importjs);
	}
	var html = result.replace(reg,"");
	var songlist = document.getElementById("songlist");
	document.getElementById("songlistcontent").innerHTML=html;
	if(param){
		var pageY = param.pageY;
		var clientX = param.clientX;
		songlist.style.left = clientX+20+"px";
		songlist.style.top = pageY-50+"px";
		if (pageY>300) songlist.style.top = pageY/2+"px";
		if (document.documentElement.clientHeight - songlist.clientHeight < parseInt(songlist.style.top)) songlist.style.top = document.documentElement.clientHeight - songlist.clientHeight +"px";
		if (document.documentElement.clientWidth -508 < parseInt(songlist.style.left)) songlist.style.left = document.documentElement.clientWidth -508 +"px";
	}
	songlist.style.display = "";
}

function ajax(url,poststr,callback,param){
	var oxmlhttp = new XMLHttpRequest();
	oxmlhttp.open("POST",url,true);
	oxmlhttp.onreadystatechange = function(){
		if((oxmlhttp.readyState == 4) && (oxmlhttp.status == 200)){
			callback(oxmlhttp.responseText,param);
		}
	}
	oxmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	oxmlhttp.send(poststr);
}

function selectall(type){
	var songlistcontent = document.getElementById('songlistcontent');
	var checkbox = songlistcontent.getElementsByTagName("input");
	for (var i=0;i<checkbox.length;i++){
		checkbox[i].checked=type;
	}
}

function addsonglist(){
	var flag = 0;
	var songlistcontent = document.getElementById('songlistcontent');
	var checkbox = songlistcontent.getElementsByTagName("input");
	var jsonstr = "{";
	for (var i=0;i<checkbox.length;i++){
		if(checkbox[i].checked){
			flag = 1;
			jsonstr += "\""+checkbox[i].name+"\":\""+encodeURIComponent(songs_obj[checkbox[i].name])+"\",";
		}
	}
	if (flag == 0) return false;
	jsonstr = jsonstr.slice(0,-1);
	jsonstr += "}";
	ajax("addsongs.php","jsonstr="+jsonstr,aslresponse);
}

function addonesong(id){
	jsonstr = "{\""+id+"\":\""+encodeURIComponent(songs_obj[id])+"\"}";
	ajax("addsongs.php","jsonstr="+jsonstr,aslresponse);
}

function aslresponse(result){
	document.getElementById("percentlayer").innerHTML=result;
	document.getElementById("percentlayer").style.display="";
	clearInterval(status_timer);
	status_tran = 1;
	status_timer = setInterval(statuslayer,200);
}

function loadsonglist(poststr,title,param){
	document.getElementById("songlisttitle").innerHTML=title;
	document.getElementById("button_multi_use").innerHTML="添加到默认播放列表";
	document.getElementById("button_multi_use").onclick = addsonglist;
	ajax("songlist.php",poststr,songlistresponse,param);
}

function loaddefaultlist(param){
	document.getElementById("songlisttitle").innerHTML="默认播放列表";
	document.getElementById("button_multi_use").innerHTML="删除选择曲目";
	document.getElementById("button_multi_use").onclick = deletesongs;
	ajax("defaultlist.php","",songlistresponse,param);
}

function deletesongs(){
	var flag = 0;
	var songlistcontent = document.getElementById('songlistcontent');
	var checkbox = songlistcontent.getElementsByTagName("input");
	var id = "";
	for (var i=0;i<checkbox.length;i++){
		if(checkbox[i].checked){
			flag = 1;
			id += checkbox[i].name+"nabice";
		}
	}
	if (flag == 0) return false;
	id = id.slice(0,-6);
	deleteonesong(id);
}
function deleteonesong(id){
	ajax("deletesong.php","id="+id,dsresponse);
}
function dsresponse(result,param){
	document.getElementById("percentlayer").innerHTML=result;
	document.getElementById("percentlayer").style.display="";
	loaddefaultlist(param);
	clearInterval(status_timer);
	status_tran = 1;
	status_timer = setInterval(statuslayer,200);
}
function statuslayer(){
	status_tran -= 0.1;
	document.getElementById("percentlayer").style.opacity=status_tran;
	if (status_tran < 0.05) {
		setTimeout(displaystatus,5000);
		clearInterval(status_timer);
	}
}
function displaystatus(){
	document.getElementById("percentlayer").style.opacity=status_tran;
	temptimer = setTimeout(displaystatus,500);
	status_tran += 0.1;
	if (status_tran>1) clearTimeout(temptimer);
}

function playlistmove(event){
	event = event?event:window.event;
	var songlist = document.getElementById("songlist");
	var pageY = event.pageY?event.pageY:event.y;
	if (event.clientX-offsetX > document.documentElement.clientWidth-508){
		songlist.style.left = document.documentElement.clientWidth-508+"px";
	}else{
		songlist.style.left = (event.clientX-offsetX)+"px";
	}
	if(pageY-offsetY > document.documentElement.scrollHeight - songlist.clientHeight){
		songlist.style.top = document.documentElement.scrollHeight -songlist.clientHeight+"px";
	}else{
		songlist.style.top = (pageY-offsetY)+"px";
	}
	return false;
}

function mousedownfunc(o){
	document.onmousemove = playlistmove;
	if(document.documentElement.setCapture){
		document.documentElement.setCapture();
	}
	var pageY = o.pageY?o.pageY:o.y;
	offsetX = o.clientX-parseInt(document.getElementById("songlist").style.left);
	offsetY = pageY-parseInt(document.getElementById("songlist").style.top);
	return false;
}

function loadartistresponse(result){
	document.getElementById("artist_name").innerHTML=result;
}

function loadalbumsresponse(result){
	document.getElementById("albums").innerHTML=result;
}