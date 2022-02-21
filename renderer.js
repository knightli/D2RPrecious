// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const { ipcRenderer } = require('electron')

function refreshOnTopBtn(isTop){
  if(isTop) {
    document.getElementById('_win_btn_always_top').classList.add('is-top')
  }
  else{
    document.getElementById('_win_btn_always_top').classList.remove('is-top')
  }
}


ipcRenderer.on('is-top', function(e, isTop){
  refreshOnTopBtn(isTop)
})

document.getElementById('_win_btn_always_top').addEventListener("click", function(){
  console.log('btn: _win_btn_always_top is clicked!');

  if(document.getElementById('_win_btn_always_top').classList.contains('is-top')) {
    ipcRenderer.send('disable-top')
  }
  else{
    ipcRenderer.send('enable-top')
  }

  ipcRenderer.on('always-on-top-changed', function(e, isAlwaysOnTop){
    refreshOnTopBtn(isAlwaysOnTop)
  })
  
})

document.getElementById('_win_btn_close_win').addEventListener("click", function(){
  console.log('btn: _win_btn_close_win is clicked!');
  ipcRenderer.send('close-win')
})

