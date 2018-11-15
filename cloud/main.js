
Parse.Cloud.define("verifyToken", async (req) => {
  var userId = req.params.userId;
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
  return result;
});

Parse.Cloud.define("beginStream", async (req) => {
  var userId = req.params.userId;
  var userQuery = new Parse.Query(Parse.User);
  userQuery.equalTo("objectId", userId);
  let user = userQuery.first({ useMasterKey:true }).then(function(user) {
    return user;
  }).catch(function(error) {
    console.error("Got an error " + error.code + " : " + error.message);
    return "error";
  });
  if (user != "error") {
    var Post = Parse.Object.extend("Post");
    var post = new Post();
    post.set("user", user);
    post.set("isVisible", True);
    post.set("isLive", True);
    post.set("isVisibleAt", new Date());
    post.set("mediaType", "live");
    let result = post.save().then((post) => {
      console.log("Created post with Id: " + post.id);
      return "success";
    }, (error) => {
      console.log("Error creating post! " + error.message);
      return "error";
    });
    return result;
  } else {
    return "error";  
  }
});
