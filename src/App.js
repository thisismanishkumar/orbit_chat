import './App.css';
import Orbit from '../src/worker';
import React, {Component} from 'react';
import { Form,Input,Button } from 'semantic-ui-react'
import Chat from '../src/chat';
import { animateScroll as scroll} from 'react-scroll'

let Obj,db;
class App extends Component {

  state = {
    userId : '',
    msg : '',
    Latest : null,
    loading :true,
    count:0
  };
  constructor(props){
    super(props)
    Obj = new Orbit();
    // this.state={db:null}
  }
  async componentDidMount(){
    console.log('%%%%%')
    
    console.log('orbit instantiated'+Obj)
    console.log('&&&')

    try{
      this.setState({loading : true})
      console.log('Starting ipfs')
      Obj.startingIPFS().then((obj) => {
        db=obj
        // console.log(db)
        const latest = db.iterator({ limit: -1 }).collect()
        this.setState({ Latest: latest,loading : false,userId:Obj.gettingId() });
        // this.setState({loading : false})
        // console.log('TTTT'+Obj.gettingId())
        // this.setState({userId:Obj.gettingId()})
        console.log("DB Instantiated"+db)
      }).catch((err) => {
        console.log(err)
      });
    }catch(err)
    {
      console.error(err)
    } 
  }

  onReplication = () => {
    
        // console.log("hello###"+db)
        db.events.on('replicated',()=>{
        
        // console.log('Replication fired!!!')
        const latest = db.iterator({ limit: -1 }).collect()
        if(latest.length>this.state.count)
        {
          console.log(latest.length)
          console.log('Replication fired and setting state')
          this.setState({ Latest: latest ,count:latest.length});
          scroll.scrollToBottom();
        }
        
        // this.setState({ Latest: latest})
        
        // setInterval(this.setLatest(latest),1000*15)
        
    })
    // setInterval(,1000*5)
  }
  // setLatest=(result)=>{
  //   console.log('Replication fired and setting state')
    
  // }

  renderComment(){
    return this.state.Latest.map((e)=>{
        return <Chat latest = {e.payload.value}/>
    })
  }
  onSubmit = async(event) => {
    event.preventDefault();
    var today = new Date();
    var date = today.getDate()+'/'+today.getMonth()+'/'+today.getFullYear();
    var time = today.getHours()+':'+today.getMinutes()+':'+today.getSeconds();
    console.log(date+' '+time)
    console.log('on submit%%%')
    const entry={userId:this.state.userId, msg:this.state.msg, date:date, time:time}
    // console.log(entry)
    // const entry1 = Obj.addingToDB(entry)
    this.setState({msg:''})
    
    Obj.addingToDB(entry).then((result) => {
      
      console.log('result is '+result)
      // const output = result.reverse().map((e) => e.payload.value.userId + ' | ' + e.payload.value.avatar + ')').join('\n') + `\n`
      // console.log(output)
      this.setState({Latest:result})
      scroll.scrollToBottom();
    }).catch((err) => {
      console.log(err)
    });
  }
  render() {
    if(!this.state.loading){
      console.log('***')
    this.onReplication()
    if(this.state.Latest!==null){
  return (
    <div >
      <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />
      <header >
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
      </header>
      <body>{this.renderComment()}</body>
        <footer>
            <Form onSubmit={this.onSubmit}>
              <Input
                value={this.state.msg}
                onChange={event => this.setState({msg: event.target.value})}
                placeholder='Enter some Text'
              /> 
              <Button primary >Send</Button>
            </Form>
        </footer>
      
    </div>
  );
    }
    else{
      return(
        <div >
          <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />
      <header >
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
      </header>
      <body><p>No such Messages</p></body>
        <footer>
            <Form onSubmit={this.onSubmit}>
              <Input
                value={this.state.msg}
                onChange={event => this.setState({msg: event.target.value})}
                placeholder='Enter some Text'
              /> 
              <Button primary >Send</Button>
            </Form>
        </footer>
      
    </div>
      );
    }
  }
    else{
      return(<h1>Hello</h1>);
    }
  }
}

export default App;
