<?php
if (isset($_GET['action'])) {
	$pid = file_get_contents("pid");
	if ($_GET['action'] == 'quit' || $_GET['action'] == 'kill') {
		if ($_GET['action'] == 'quit') pclose(popen("start d:/foobar2000/foobar2000 /exit","r"));
		exec("taskkill /pid $pid /t /f");
	} elseif ($_GET['action'] == 'next') {
		pclose(popen("start d:/foobar2000/foobar2000 /next","r"));
	} elseif ($_GET['action'] == 'pause') {
		pclose(popen("start d:/foobar2000/foobar2000 /pause","r"));
	}
}
	
?>