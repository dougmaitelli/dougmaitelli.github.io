import "semantic-ui-css/semantic.min.css";
import "../css/style.css";

import DigitalMatrix from "digitalmatrix";

document.addEventListener("DOMContentLoaded", () => {
  var matrix = new DigitalMatrix("matrix");

  window.onresize = () => {
    matrix.resize();
  };

  matrix.startPulsate();
});
