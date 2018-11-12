
Parse.Cloud.define('hello', function(req, res) {
  var userId = req.params.userId;
  console.log(userId);
  var queryUser = new Parse.Query(Parse.User);
  queryUser.get(userId, { useMasterKey:true,
      success: function(user) {
          response.success(user.get("apiKey"));
      },
      error: function(error) {
          response.success("fail");
      }
   });
});
