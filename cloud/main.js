
Parse.Cloud.define("hello", async (req) => {
  var userId = req.params.userId;
  console.log(userId);
  var userQuery = new Parse.Query(Parse.User);
  userQuery.equalTo("objectId", userId);
  var result = userQuery.first({ useMasterKey:true }).then(function(user) {
      var key = user.get("apiKey");
      return key;
    })
    .catch(function(error) {
      console.error("Got an error " + error.code + " : " + error.message);
      return "error";
    });
  console.log(result);
  return result;
});
