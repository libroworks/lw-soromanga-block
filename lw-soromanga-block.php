<?php
/**
 * Plugin Name:       Lw Soromanga Block
 * Description:       Example block written with ESNext standard and JSX support – build step required.
 * Requires at least: 5.7
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       lw-soromanga-block
 *
 * @package           create-block
 */


$replacelist = [
	[
		"f" => "/===[=]*/u",
		"r" => '<div class="manga_container">'
	],
	[
		"f" => "/@divend/u",
		"r" => "</div>"
	],
	[
		"f" => "/@frame:([a-z|0-9 ]+)/u",
		"r" => '<div class="frame $1"><div class="serif">'
	],
	[
		"f" => "/@fend/u",
		"r" => "</div></div>"
	],
	[
		"f" => "/@センセ「([a-z|0-9 ]+)/u",
		"r" => "@「yuki $1"
	],
	[
		"f" => "/@デシ「([a-z|0-9 ]+)/u",
		"r" => "@「alice $1"
	],
	[
		"f" => "/@「([a-z|0-9 ]+)/u",
		"r" => '<div class="frame $1"><div class="serif">'
	],
	[
		"f" => "/@」/u",
		"r" => "</div></div>"
	],
	[
		"f" => "/!\[(.*?)\]\((.*?)\)/u",
		"r" => '<img alt="$1" src="$2">'
	],
	[
		"f" => "/【センセ(.*?)】(.*)/u",
		"r" => '<p class="kaiwa yuki $1"><span class="kaiwaborder">$2</span></p>'
	],
	[
		"f" => "/【デシ(.*?)】(.*)/u",
		"r" => '<p class="kaiwa alice $1"><span class="kaiwaborder">$2</span></p>'
	],
];

function render_manga($attributes, $content, $block ){
	global $replacelist;
	// 改行で分割
	$content = str_replace(["\r\n", "\r", "\n"], "\n", $content);
	$lcontent = explode("\n", $content);
	$testresult = '';
	$error_flag = false;
	foreach($replacelist as $line){
		$result = preg_replace($line['f'], $line['r'], $lcontent);
		if($result != null){
			$lcontent = $result;
		} else {
			$error_flag = true;
			$testresult = $testresult . $line['f'] . $line['r'] . '<br>';
		}
	}
	$content = implode("\n", $lcontent);
	if($error_flag == false){
		return $content;
	} else {
		return $content . 'Error<br>' . $testresult;
	}
}


/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/block-editor/tutorials/block-tutorial/writing-your-first-block-type/
 */
function create_block_lw_soromanga_block_block_init() {
	register_block_type_from_metadata( __DIR__ ,array(
		'render_callback' => 'render_manga'
	));
}
add_action( 'init', 'create_block_lw_soromanga_block_block_init' );
