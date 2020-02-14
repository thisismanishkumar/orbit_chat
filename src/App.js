import './App.css';
import Orbit from '../src/worker';
import React, {Component} from 'react';
import { Form,Input,Button } from 'semantic-ui-react'
import Chat from '../src/chat';

let Obj,db;
class App extends Component {

  state = {
    userId : '',
    msg : '',
    Latest : null,
    loading :true
    
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
        console.log(db)
        const latest = db.iterator({ limit: -1 }).collect()
        this.setState({ Latest: latest });
        this.setState({loading : false})
        console.log('TTTT'+Obj.gettingId())
        this.setState({userId:Obj.gettingId()})
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
    
        console.log("hello###"+db)
        db.events.on('replicated',()=>{
        // console.log('Replication fired!!!')
        const latest = db.iterator({ limit: -1 }).collect()
        this.setState({ Latest: latest });
    })
  }

  renderComment(){
    return this.state.Latest.map((e)=>{
        return <Chat latest = {e.payload.value}/>
    })
  }
  onSubmit = async(event) => {
    event.preventDefault();
    console.log('on submit%%%')
    const entry={userId:this.state.userId, msg:this.state.msg}
    console.log(entry)
    // const entry1 = Obj.addingToDB(entry)

    
    Obj.addingToDB(entry).then((result) => {
      
      console.log('result is '+result)
      const output = result.reverse().map((e) => e.payload.value.userId + ' | ' + e.payload.value.avatar + ')').join('\n') + `\n`
      console.log(output)
      this.setState({Latest:result})
    }).catch((err) => {
      console.log(err)
    });
  }
  render() {
    if(!this.state.loading){
      // console.log('***')
    this.onReplication()
    if(this.state.Latest!==null){
  return (
    <div >
      <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />
      <header >
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
      </header>
      <body><p>{this.renderComment()}</p></body>
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
