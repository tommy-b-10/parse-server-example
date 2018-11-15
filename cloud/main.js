
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
	var streamKey = req.params.streamKey;
	var userQuery = new Parse.Query(Parse.User);
	userQuery.equalTo("objectId", userId);
	let result = userQuery.first({ useMasterKey:true }).then(function(user) {
		//Find if there is an existing post and edit
		var Post = Parse.Object.extend("Post");
		var postQuery = new Parse.Query(Post);
		postQuery.equalTo("user", user);
		postQuery.equalTo("liveKey", streamKey);
		postQuery.equalTo("mediaType", "live");
		var res = postQuery.first({ useMasterKey:true }).then(function(post) {
			post.set("isLive", true);
			post.save();
			console.log("Edited post with Id: " + post.id);
		      	return "success";
		}).catch(function(error) {
			console.error("Got an error " + error.code + " : " + error.message);
			return "error";
		});
		if (res == "success") {
			return res;
		} else {
		  //If no existing, then create new
		    var Post = Parse.Object.extend("Post");
		    var post = new Post();
		    post.set("user", user);
		    post.set("isVisible", true);
		    post.set("isLive", true);
		    post.set("isVisibleAt", new Date());
		    post.set("mediaType", "live");
		    post.set("liveKey", streamKey);
		    let result = post.save().then((post) => {
		      console.log("Created post with Id: " + post.id);
		      return "success";
		    }, (error) => {
		      console.log("Error creating post! " + error.message);
		      return "error";
		    });
		}
		return result;
	}).catch(function(error) {
		console.error("Got an error " + error.code + " : " + error.message);
		return "error";
	});
	return result;
});

Parse.Cloud.define("endStream", async (req) => {
  var userId = req.params.userId;
  var streamKey = req.params.streamKey;
  var userQuery = new Parse.Query(Parse.User);
  userQuery.equalTo("objectId", userId);
  let result = userQuery.first({ useMasterKey:true }).then(function(user) {
    var Post = Parse.Object.extend("Post");
    var postQuery = new Parse.Query(Post);
    postQuery.equalTo("user", user);
    postQuery.equalTo("liveKey", streamKey);
    postQuery.equalTo("isLive", true);
    postQuery.equalTo("mediaType", "live");
    var res = postQuery.find({ useMasterKey:true }).then(function(posts) {
	for (var i = 0; i < posts.length; i++) {
		var post = posts[i];
		post.set("isLive", false);
		post.unset("liveKey");
		post.set("mediaType", "dvr");
		post.save();
     	}
      return "success";
		}).catch(function(error) {
			console.error("Got an error " + error.code + " : " + error.message);
      return "error";
    });
    return res;
  }).catch(function(error) {
    console.error("Got an error " + error.code + " : " + error.message);
    return "error";
  });
  return result;
});
