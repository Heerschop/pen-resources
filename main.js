function onOverlayClick(name) {
  window.location = name + '/index.html';
}

function onCheckboxHtmlClick(checked, name) {
  const element = document.getElementById('checkbox-css-' + name);

  element.checked = false;

  toggleFileContent(name, checked, 'index.html');
}
function onCheckboxCssClick(checked, name) {
  const element = document.getElementById('checkbox-html-' + name);

  element.checked = false;

  toggleFileContent(name, checked, 'index.css');
}

function toggleFileContent(name, checked, file) {
  const elementId = 'frame-overlay-' + name;
  const path = name + '/' + file;
  const element = document.getElementById(elementId);

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
        element.innerHTML = '<xmp class="prettyprint">' + this.responseText + '</xmp>';;
        PR.prettyPrint()
      }

      if (this.status == 404) {
        element.innerHTML = "File not found: " + path;
      }
    }

  }

  http.open("GET", path, true);
  http.send();
}


function onPenClick(value) {
  window.open('https://codepen.io/heerschop/pen/' + value);
}


function includeHTML() {
  const elements = document.getElementsByTagName("*");

  //for (const element of document.getElementsByTagName("*")) {
  for (let index = 0; index < elements.length; index++) {
    const element = elements[index];
    const file = element.getAttribute("include-html");

    if (file) {
      const http = new XMLHttpRequest();

      http.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            let innerHTML = this.responseText;

            for (let index = 0; index < element.attributes.length; index++) {
              const attribute = element.attributes.item(index);
              const matches = attribute.name.match(/^\[(.*)\]$/);

              if (matches !== null) {
                const attributeName = matches[1];
                const expression = new RegExp('{{' + attributeName + '}}', 'g');

                innerHTML = innerHTML.replace(expression, attribute.value);
              }
            }

            element.innerHTML = innerHTML;
          }

          if (this.status == 404) { element.innerHTML = "Page not found."; }

          element.removeAttribute("include-html");

          includeHTML();
        }
      }

      http.open("GET", file, true);
      http.send();

      return;
    }
  }
}
