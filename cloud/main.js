
Parse.Cloud.define('hello', function(req, res) {
  var user = req["userId"];
  console.log(user);
  var result = ["key":"tbrereton9"];
  res.success(result);
});
