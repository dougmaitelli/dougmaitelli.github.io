var ghpages = require("gh-pages");

ghpages.publish(
  "build",
  {
    branch: "master"
  },
  function(err) {
    console.log(err);
  }
);
