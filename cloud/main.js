
Parse.Cloud.define('hello', function(req, res) {
  var userId = req.params.userId;
  console.log(userId);
  var queryUser = new Parse.Query(Parse.User);
  queryUser.get(userId, { useMasterKey:true }).then(function(user) {
      var key = user.get("apiKey");
      return key;
    })
    .catch(function(error) {
      console.error("Got an error " + error.code + " : " + error.message);
      return "error";
    });
});
