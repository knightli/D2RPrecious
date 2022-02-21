// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

(function(){
  document.getElementById('_win_btn_always_top').addEventListener("click", function(){
    console.log('btn: _win_btn_always_top is clicked!');
  })

  document.getElementById('_win_btn_close_win').addEventListener("click", function(){
    console.log('btn: _win_btn_close_win is clicked!');
  })
})();