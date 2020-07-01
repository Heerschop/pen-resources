const markdown = window.markdownit({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<div class="code-block">' + hljs.highlight(lang, str).value + '</div>';
      } catch (__) { }
    }

    return ''; // use external default escaping
  }
});

function onOverlayClick(name) {
  window.location = name + '/index.html';
}

function onCheckboxDocClick(checked, name) {
  document.getElementById('checkbox-css-' + name).checked = false;
  document.getElementById('checkbox-html-' + name).checked = false;

  toggleFileContent(name, checked, 'README.md');
}

function onCheckboxHtmlClick(checked, name) {
  document.getElementById('checkbox-doc-' + name).checked = false;
  document.getElementById('checkbox-css-' + name).checked = false;

  toggleFileContent(name, checked, 'index.html');
}

function onCheckboxCssClick(checked, name) {
  document.getElementById('checkbox-doc-' + name).checked = false;
  document.getElementById('checkbox-html-' + name).checked = false;

  toggleFileContent(name, checked, 'index.css');
}

function onPenClick(value) {
  window.open('https://codepen.io/heerschop/pen/' + value);
}

function toggleFileContent(name, checked, file) {
  const elementId = 'frame-overlay-' + name;
  const path = name + '/' + file;
  const element = document.getElementById(elementId);

  element.contentEditable = file !== 'README.md';

  if (!checked) {
    element.className = 'frame-overlay';
    element.innerHTML = null;
    element.onclick = () => onOverlayClick(name);
    return;
  }

  const http = new XMLHttpRequest();

  http.onreadystatechange = function () {
    if (this.readyState == 4) {
      element.className = 'frame-overlay-text';
      element.onclick = null;

      if (this.status == 200) {

        if (!path.toLowerCase().endsWith('.md')) {
          element.innerHTML = '<?prettify?><xmp class="prettyprint">' + this.responseText + '</xmp>';;
          PR.prettyPrint()
        } else {
          element.innerHTML = markdown.render(this.responseText);
        }
      }

      if (this.status == 404) {
        element.innerHTML = "File not found: " + path;
      }
    }

  }

  http.open("GET", path, true);
  http.send();
}

function onKeydown() {
  const allowedKeys = [
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'Home',
    'End',
    'PageUp',
    'PageDown'
  ];

  return event.ctrlKey || allowedKeys.includes(event.code);
}
