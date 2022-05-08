pragma solidity >=0.4.21 <0.6.0;

contract PostList{
    string public name; 

    uint public postCount = 0;

    mapping(uint=>Post) public posts;

    struct Post{
        uint id;
        string content;
        uint tipAmount;
        address payable author;
    }

    event PostCreated(
        uint id,
        string content,
        uint tipAmount,
        address payable author
    );
    
    event PostTipped(
        uint id,
        string content,
        uint tipAmount,
        address payable author
    );

    constructor() public{
        name = "Post Created";
    }

    function createPost(string memory _content) public{ 
        require(bytes(_content).length > 0);
        postCount++;
        posts[postCount] = Post(postCount, _content, 0, msg.sender);
       emit PostCreated(postCount, _content, 0, msg.sender);
    }

    function tipPost(uint _id) public payable{
        require(_id>0 && _id<=postCount);
        Post memory _p = posts[_id];
        address payable _author = _p.author;
        address(_author).transfer(msg.value);
        _p.tipAmount+= msg.value;
        posts[_id] = _p;
        emit PostTipped(_id, _p.content, _p.tipAmount, _author);
    }
}