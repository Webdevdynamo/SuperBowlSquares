<?php
if(!$_REQUEST['m'] || !$_REQUEST['t']){
	exit();
}
$model_id = $_REQUEST['m'];
$total_images = $_REQUEST['t'];
$total_pages = ($total_images / 24) + 1;
$url = "https://www.imagefap.com/photo/".$model_id."/?idx=24&partial=false";
$p = 1;
$i = 0;
for($p=1; $p<=$total_pages; $p++){
	
	$url = "https://www.imagefap.com/photo/".$model_id."/?idx=".$i."&partial=false";
	echo $url."<BR>";
	$i += 24;
}

?>