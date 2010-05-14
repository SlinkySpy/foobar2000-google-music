// main.js
var timer;
var playing_topic;
var status_tran = 1;
var status_timer;
var mousedown;
var offsetX;
var offsetY;
window.onkeydown = function(event){
	if(event.keyCode == 27) document.getElementById("songlist").style.display = "none";
}
window.onmousemove = playlistmove;
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

function getpercent() {
	document.getElementById("percentlayer").innerHTML="Loading,Please Wait...<span id='percent'></span>";
	document.getElementById("percentlayer").style.display = "";
	var oxmlhttp2 = new XMLHttpRequest();
	oxmlhttp2.open("get","percent.txt",true);
	oxmlhttp2.onreadystatechange = function() {
		if((oxmlhttp2.readyState == 4) && (oxmlhttp2.status == 404)){
			clearInterval(timer);
			document.getElementById("percentlayer").innerHTML="Now Playing...<span id='percent'></span>";
		}
		if ((oxmlhttp2.readyState == 4) && (oxmlhttp2.status == 200)){
			if (oxmlhttp2.responseText != "1"){
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
	titlelayer = document.getElementById("title");
	if (titlelayer.innerHTML == ""){
		return true;
	}
	titlelayer.style.left = o.pageX+20+'px';
	titlelayer.style.top = o.pageY+'px';
	if (titlelayer.clientHeight+o.clientY > document.documentElement.clientHeight) titlelayer.style.top = o.pageY - titlelayer.clientHeight+"px";
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

function songlistresponse(result){
	var reg = /<script[^>]*>(.+)<\/script>/im;
	var match = result.match(reg);
	if (match){
		var importjs = match[1];
		eval(importjs);
	}
	var html = result.replace(reg,"");
	var songlist = document.getElementById("songlist");
	document.getElementById("songlistcontent").innerHTML=html;
	songlist.style.left = globalevent.clientX+20+"px";
	songlist.style.top = globalevent.pageY-50+"px";
	if (globalevent.pageY>300) songlist.style.top = globalevent.pageY/2+"px";
	if (document.documentElement.clientHeight - songlist.clientHeight < parseInt(songlist.style.top)) songlist.style.top = document.documentElement.clientHeight - songlist.clientHeight +"px";
	if (document.documentElement.clientWidth -508 < parseInt(songlist.style.left)) songlist.style.left = document.documentElement.clientWidth -508 +"px";
	songlist.style.display = "";
}

function ajax(url,poststr,callback){
	var oxmlhttp = new XMLHttpRequest();
	oxmlhttp.open("POST",url,true);
	oxmlhttp.onreadystatechange = function(){
		if((oxmlhttp.readyState == 4) && (oxmlhttp.status == 200)){
			callback(oxmlhttp.responseText);
		}
	}
	oxmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	oxmlhttp.send(poststr);
}

function selectall(type){
	var frm = document.getElementById('songlistform');
	var checkbox = frm.getElementsByTagName("input");
	for (var i=0;i<checkbox.length;i++){
		checkbox[i].checked=type;
	}
}

function addsonglist(){
	var flag = 0;
	var frm = document.getElementById('songlistform');
	var checkbox = frm.getElementsByTagName("input");
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

function loadsonglist(poststr,title){
	document.getElementById("songlisttitle").innerHTML=title;
	document.getElementById("button_multi_use").innerHTML="添加到默认播放列表";
	document.getElementById("button_multi_use").onclick = addsonglist;
	ajax("songlist.php",poststr,songlistresponse);
}

function loaddefaultlist(){
	document.getElementById("songlisttitle").innerHTML="默认播放列表";
	document.getElementById("button_multi_use").innerHTML="删除选择曲目";
	document.getElementById("button_multi_use").onclick = deletesongs;
	ajax("defaultlist.php","",songlistresponse);
}

function deletesongs(){
	var flag = 0;
	var frm = document.getElementById('songlistform');
	var checkbox = frm.getElementsByTagName("input");
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
function dsresponse(result){
	document.getElementById("percentlayer").innerHTML=result;
	document.getElementById("percentlayer").style.display="";
	loaddefaultlist();
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
	var songlist = document.getElementById("songlist");
	if(!mousedown) return false;
	if (event.clientX-offsetX > document.documentElement.clientWidth-508){
		songlist.style.left = document.documentElement.clientWidth-508+"px";
	}else{
		songlist.style.left = (event.clientX-offsetX)+"px";
	}
	if(event.pageY-offsetY > document.documentElement.scrollHeight - songlist.clientHeight){
		songlist.style.top = document.documentElement.scrollHeight -songlist.clientHeight+"px";
	}else{
		songlist.style.top = (event.pageY-offsetY)+"px";
	}
	return true;
}

function mousedownfunc(o){
	offsetX = o.clientX-parseInt(document.getElementById("songlist").style.left);
	offsetY = o.pageY-parseInt(document.getElementById("songlist").style.top);
	mousedown = true;
	return true;
}

function loadartistresponse(result){
	document.getElementById("artist_name").innerHTML=result;
}

function loadalbumsresponse(result){
	document.getElementById("albums").innerHTML=result;
}