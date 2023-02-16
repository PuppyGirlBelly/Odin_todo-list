import '../scss/main.scss';
import Icon from '../img/icon.png';

function component() {
  const content = document.getElementById('content');

  content.innerText = `Hello webpack`;
  content.classList.add('invert');

  // Example of adding an image
  const myIcon = new Image();
  myIcon.src = Icon;
  content.appendChild(myIcon);

  return content;
}

document.body.appendChild(component());
