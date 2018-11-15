
Parse.Cloud.define("verifyToken", async (req) => {
  var userId = req.params.userId;
  var userQuery = new Parse.Query(Parse.User);
  userQuery.equalTo("objectId", userId);
  var res = userQuery.first({ useMasterKey:true }).then(function(user) {
    var key = user.get("apiKey");
    return key;
  })
  .catch(function(error) {
    console.error("Got an error " + error.code + " : " + error.message);
    return "error";
  });
  console.log("Here! " + res);
  return res;
});

Parse.Cloud.define("beginStream", async (req) => {
  var userId = req.params.userId;
  var userQuery = new Parse.Query(Parse.User);
  userQuery.equalTo("objectId", userId);
  userQuery.first({ useMasterKey:true }).then(function(user) {
    var Post = Parse.Object.extend("Post");
    var post = new Post();
    post.set("user", user);
    post.set("isVisible", True);
    post.set("isLive", True);
    post.set("isVisibleAt", new Date());
    post.set("mediaType", "live");
    post.save().then((post) => {
      console.log("Created post with Id: " + post.id);
      return "success";
    }, (error) => {
      console.log("Error creating post! " + error.message);
      return "error";
    });
  }).catch(function(error) {
    console.error("Got an error " + error.code + " : " + error.message);
    return "error";
  });
});
