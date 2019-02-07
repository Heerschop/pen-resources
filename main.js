function onOverlayClick(value) {
  console.log('onOverlayClick: ', value);
  window.location = value + '/index.html';
}

function onPenClick(value) {
  console.log('onPenClick: ', value);
  window.open('https://codepen.io/heerschop/pen/' + value);
}