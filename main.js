function onOverlayClick(value) {
  window.location = value + '/index.html';
}


function onHtmlClick(value) {
  const elementId = 'frame-overlay-' + value;
  const file = value + '/index.html';

  loadFileContent(elementId, file);
}

function onCssClick(value) {
  const elementId = 'frame-overlay-' + value;
  const file = value + '/index.css';

  loadFileContent(elementId, file);
}

function loadFileContent(elementId, file) {
  const element = document.getElementById(elementId);
  const http = new XMLHttpRequest();

  element.className = "frame-overlay-text";

  http.onreadystatechange = function () {
    element.innerHTML = '<xmp class="prettyprint">' + this.responseText + '</xmp>';
    PR.prettyPrint()
  };

  http.open("GET", file, true);
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
