// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const { ipcRenderer } = require('electron')

function refreshOnTopBtn(isTop) {
  if(isTop) {
    document.getElementById('_win_btn_always_top').classList.add('is-top')
  }
  else{
    document.getElementById('_win_btn_always_top').classList.remove('is-top')
  }
}

function refreshClickThroughBtn(isTop) {
  if(isTop) {
    document.getElementById('_win_btn_click_through').classList.add('is-click-through')
  }
  else{
    document.getElementById('_win_btn_click_through').classList.remove('is-click-through')
  }
}

ipcRenderer.on('is-top', function(e, isTop){
  refreshOnTopBtn(isTop)
})
ipcRenderer.send('is-top')

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


let _is_click_trough_enable = false
const _CLICK_THROUGH_OPACITY = 0.4
const _DEFAULT_OPACITY = 0.9

const elements = document.getElementsByClassName('ignore-click-through')

Array.prototype.forEach.call(elements, el => {
  el.addEventListener('mouseenter', () => {
    if(_is_click_trough_enable) {
      ipcRenderer.send('set-ignore-mouse-events', false)
      ipcRenderer.send('set-opacity', _DEFAULT_OPACITY)
    }
  })
  el.addEventListener('mouseleave', () => {
    if(_is_click_trough_enable) {
      ipcRenderer.send('set-ignore-mouse-events', true, { forward: true })
      ipcRenderer.send('set-opacity', _CLICK_THROUGH_OPACITY)
    }
  })
});

document.getElementById('_win_btn_click_through').addEventListener("click", function(){
  console.log('btn: _win_btn_click_through is clicked!');

  if(document.getElementById('_win_btn_click_through').classList.contains('is-click-through')) {
    _is_click_trough_enable = false
    refreshClickThroughBtn(false)
  }
  else{
    _is_click_trough_enable = true
    refreshClickThroughBtn(true)
  }
  
})

