import "../../semantic-theme/semantic.less";
import "devicon/devicon.min.css";
import "../css/style.css";

import DigitalMatrix from "digitalmatrix";

document.addEventListener("DOMContentLoaded", () => {
  var matrix = new DigitalMatrix("matrix");

  window.onresize = () => {
    document.getElementById("matrix").innerHTML = "";
    matrix.regenerateNumbers();
  };

  matrix.startPulsate();
});
