<?php
if (isset($_POST['name'])){
	unlink("ownlist/".$_POST['name']);
	echo "Delete Playlist Successfully";
}
?>