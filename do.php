<?php
function start_python($url) {
	$pid = file_get_contents("pid");
	exec("taskkill /pid $pid /t /f");
	pclose(popen("start google_music_web.pyw \"$url\"","r"));
}
if (isset($_POST["playlist"])) {
	start_python($_POST["playlist"]);
}
?>