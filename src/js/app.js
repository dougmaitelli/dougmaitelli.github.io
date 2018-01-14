import "semantic-ui-css/semantic.min.css";
import "../css/style.css";

import $ from "jquery";
import Matrix from "digitalmatrix";

$(document).ready(() => {
  Matrix.generateNumbers(".matrix");

  $(window).resize(() => {
    $(".matrix").empty();
    Matrix.generateNumbers(".matrix");
  });

  Matrix.startPulsate();
});
