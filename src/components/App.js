import React, { Component} from 'react';
import Web3 from 'web3';
import './App.css';
import Identicon from 'identicon.js';
import SocialNetwork from '../abis/PostList.json';

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      account: '',
      socialNetwork: null,
      postCount: 0,
      posts: [],
      loading:true
    }
    this.tipPost = this.tipPost.bind(this);
    this.createPost = this.createPost.bind(this);
  }

  createPost(content){
    this.setState({loading: true})
    this.state.socialNetwork.methods.createPost(content).send({from: this.state.account}).once('receipt',(receipt)=>{
      this.setState({loading: false})
      console.log("done");
    })
    setTimeout(()=>{this.setState({loading: false})}, 10000);
  }

  tipPost(id, tipAmount){
    this.setState({loading: true})
    this.state.socialNetwork.methods.tipPost(id).send({from: this.state.account, value: tipAmount})
    .once('receipt',(receipt)=>{
      this.setState({loading: false})
    })

  }

  async componentWillMount(){
      await this.loadWeb3();
      await this.loadBlockchainData();
  }

  async loadWeb3(){
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable()
    }
    else if(window.web3){
      window.web3 = new Web3(window.web3.curretProvider())
    }
    else{
      window.alert("Non ethereuem browser");
    }
  }
  
  // load blockchain data
  async loadBlockchainData(){
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    // Request account access if needed
    // console.log(accounts);
    this.setState({account:accounts[0]});
    // networkId
    const networkId = await web3.eth.net.getId();
    // console.log(`the netID : ${networkId}`);
    // console.log(SocialNetwork.networks[networkId]);;
    var netData = SocialNetwork.networks[networkId];
    console.log(netData);
    if(netData){
      // fetch the smartcontract from the network id of ganache blockchain and set the contract of website to fetched contract
      const socialNetwork = web3.eth.Contract(SocialNetwork.abi, netData.address);
      this.setState({socialNetwork});
      const postCount = await socialNetwork.methods.postCount().call();
      this.setState({postCount});

      for(var i=1;i<=postCount;i++){
        const post = await socialNetwork.methods.posts(i).call()
        this.setState({
          // addds the fetched post to end of the array
          posts: [...this.state.posts, post]
        })
        this.setState({
          posts: this.state.posts.sort((a,b)=>b.tipAmount-a.tipAmount)
        })
        this.setState({loading:false})
        console.log(this.state.posts);
      }
      
    }else{
      window.alert("Provide a Network ID")
    }   
  }

  render() {
    return (
      <div>
        <nav className="navbar  navbar-dark fixed-top bg-light flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h4 style={{color:"#7209b7"}}>BLOGchain</h4>
          </a>
        <span>
        <small className='navbar-brand1' >User: {this.state.account}</small>
        {this.state.account?
          <img className='image' width='30' height='30' src = {`data:image/png;base64,${new Identicon(this.state.account, 30).toString()}`}/>:<span/>
        }
        </span>
            
        </nav>
        <div className='form-group'>
          <form onSubmit={(e)=>{
            e.preventDefault()
            this.createPost(this.postContent.value)
          }}>
            <input ref={(input)=>{this.postContent = input}} id='postCount' type="textarea" className='form-control' placeholder='Enter your content here!'/>
            <br></br>
            <button className='btn1' type='submit'>
               Post Blog
            </button>
          </form>
          
        </div>
        {this.state.loading?
        <div id = "loader" style={{color:"#7209b7"}} className='text-center mt-5'><p>Loading...</p></div>
            :
        <div>
          <main role="main" className="col-lg-12 ml-auto mr-auto">
            {this.state.posts.map((post, key)=>{
            return(
              <div class="card" width="20" key={key}>
                <div class="card-body">
                <span>
                  <row>
                  <h5 class="card-title">
                  <img className='imageHead' width='30' height='30' src = {`data:image/png;base64,${new Identicon(post.author, 30).toString()}`}/>

                    <div className='head'>{post.author}</div>
                    </h5>
                  </row>
                </span>
                  <hr></hr>
                  <p class="card-text">{post.content}</p>
                  <hr></hr>
                  <span key={key} className="float-left mt-1 text-muted">
                    Donations : {window.web3.utils.fromWei(post.tipAmount.toString(), 'Ether')}
                  </span>
                  <button 
                  name={post.id}
                  onClick={(event)=>{
                    event.preventDefault();
                    let tipAmount = window.web3.utils.toWei('1.0', 'Ether')

                    this.tipPost(event.target.name, tipAmount)
                  }}
                  className='btn btn-link btn-sm float-right pt-0' style={{color:"#0a9396"}}>
                      Upvote with ETH : 1.0 ETH
                  </button>
                </div>
              </div>
            )
          })}
          </main>
          
        </div>
      }
      </div>
    );
  }
}

export default App;

















          {/* <p>&nbsp;</p> */}



  /////////////////////////////////////////method2 to connect the dapp with ethereum accounts
  // import l from '../l.png';
  // <img src={l} height="130" alt='logo'/>
  // async connectWallet(){
  //   try {
  //     const { ethereum } = window;

  //     if (!ethereum) {
  //       alert("Please install MetaMask!");
  //       return;
  //     }

  //     const accounts = await ethereum.request({
  //       method: "eth_requestAccounts",
  //     });

  //     console.log("Connected", accounts[0]);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  
        /* <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h3>A decentralized blogging platform for content creators</h3>
              </div>
            </main>
          </div>
        </div> */


        
        //require valid content
        //incrementing posts
        //adding posts to the list of posts
        //trigger event

        
        //validate the id
        // fetch the post based on id and increment the tip amount of the desired author
        // transfer the amount of paid ether to author
        // increment tip amount reflected on website
        // update the post with incremented tip amount