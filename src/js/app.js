import "semantic-ui-css/semantic.min.css";
import "../css/style.css";

import $ from "jquery";
import DigitalMatrix from "digitalmatrix";

$(document).ready(() => {
  var matrix = new DigitalMatrix(".matrix");

  $(window).resize(() => {
    $(".matrix").empty();
    matrix.generateNumbers(".matrix");
  });

  matrix.startPulsate();
});
