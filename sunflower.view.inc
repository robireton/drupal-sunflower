<?php

function sunflower_view() {
  $module_path = drupal_get_path('module', 'sunflower');
  drupal_add_css( "{$module_path}/sunflower.css" );
  drupal_add_js(  "{$module_path}/sunflower.js"  );
  $button = [
    'begin' => file_create_url("{$module_path}/media-skip-backward.svg"),
    'start' => file_create_url("{$module_path}/media-playback-start.svg"),
    'pause' => file_create_url("{$module_path}/media-playback-pause.svg"),
    'end'   => file_create_url("{$module_path}/media-skip-forward.svg"),
  ];
  return <<<END_OF_TEXT
  <article id="sunflower">
  <canvas id="canvas" width="580" height="580"></canvas>
  <div id="controls">
  <input id="controlStep" type="range" min="0" max="0" step="0" value="0">
  <div id="buttons">
  <img id="controlBegin" src="{$button['begin']}" width="48" height="48" alt="beginning" title="move to beginning">
  <img id="controlStart" src="{$button['start']}" width="48" height="48" alt="start"     title="start animation">
  <img id="controlPause" src="{$button['pause']}" width="48" height="48" alt="pause"     title="pause animation">
  <img id="controlEnd"   src="{$button['end']}"   width="48" height="48" alt="end"       title="move to end">
  </div>
  </div>
  </article>
END_OF_TEXT;
}
