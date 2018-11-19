
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
	var result = userQuery.first({ useMasterKey:true }).then(function(user) {
		//Find if there is an existing post and edit to show streaming
		var Post = Parse.Object.extend("Post");
		var postQuery = new Parse.Query(Post);
		postQuery.equalTo("user", user);
		postQuery.equalTo("liveKey", streamKey);
		postQuery.equalTo("mediaType", "live");
		var res = postQuery.first({ useMasterKey:true }).then(function(post) {
			if (post != null) {
				post.set("isLive", true);
				post.set("isVisible", true);
				post.save();
				console.log("Edited post with Id: " + post.id);
				return "success";
			} else {
			  console.log("Error creating post! " + error.message);
			  return "error";
			}
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

Parse.Cloud.define("endStream", async (req) => {
  var userId = req.params.userId;
  var streamKey = req.params.streamKey;
  var userQuery = new Parse.Query(Parse.User);
  userQuery.equalTo("objectId", userId);
  var result = userQuery.first({ useMasterKey:true }).then(function(user) {
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

Parse.Cloud.define("addStreamDVR", async (req) => {
  var userId = req.params.userId;
  var streamKey = req.params.streamKey;
  var vodURL = req.params.vodURL;
  var vodKey = vodURL.split(streamKey)[1];
  var userQuery = new Parse.Query(Parse.User);
  userQuery.equalTo("objectId", userId);
  var result = userQuery.first({ useMasterKey:true }).then(function(user) {
    var Post = Parse.Object.extend("Post");
    var postQuery = new Parse.Query(Post);
    postQuery.equalTo("user", user);
    postQuery.equalTo("isLive", false);
	postQuery.equalTo("liveKey", streamKey);
    postQuery.equalTo("mediaType", "dvr");
    var res = postQuery.find({ useMasterKey:true }).then(function(posts) {
		for (var i = 0; i < posts.length; i++) {
			var post = posts[i];
			post.set("liveKey", vodKey);
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
