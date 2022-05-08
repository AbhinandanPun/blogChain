const PostList = artifacts.require("PostList");

module.exports = function(deployer) {
  deployer.deploy(PostList);
};