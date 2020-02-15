import React, { Component } from 'react'
import { Comment, Grid, Form, Button, Checkbox } from 'semantic-ui-react'
import { Collapse } from 'react-collapse';
import Worker from './worker'

let wk;
export default class chat extends Component {

    state = {
        isOpen: false,
        msg: ''
    };

    constructor(props) {
        super(props)
        wk = new Worker()
    }

    toggle = () => {
        this.setState({ isOpen: !this.state.isOpen })
    }

    checkUser = () => {
        console.log('&&& msg user id  ' + this.props.latest.userId + ' curr userid ' + this.props.userId)
        if (this.props.latest.userId === this.props.userId)
            return true
        else 
        return false

    }

    onSubmit = async (event) => {
        event.preventDefault();
        var today = new Date();
        var date = today.getDate() + '/' + today.getMonth() + '/' + today.getFullYear();
        var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
        if(this.state.msg!==''){
        const entry = { reply: true, replyOfUserId: this.props.latest.userId, replyOfMsg: this.props.latest.msg, replyOfMsgDate: this.props.latest.date, replyOfMsgTime: this.props.latest.time, userId: this.props.userId, msg: this.state.msg, date: date, time: time }
        
        wk.addingToDB(entry).then((result) => {
            console.log('result is ' + result)
            this.setState({isOpen:false,msg:''})
            this.props.callback(result)
            // scroll.scrollToBottom();
        }).catch((err) => {
            console.log(err)
        });
    }
    }
    render() {
        if (this.props.latest.reply) {
            console.log('@@@msg user id  ' + this.props.latest.userId + ' curr userid ' + this.props.userId)
            return (
                <Grid>
                    <Grid.Column floated={this.checkUser() ? 'right':'left'} width={5}>
                        <Comment.Group>
                            <Comment key={this.props.latest.time + this.props.latest.date + this.props.latest.userId + this.props.latest.msg}>
                                <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg' />
                                <Comment.Content>
                                    <Comment.Author>{this.props.latest.replyOfUserId}</Comment.Author>
                                    <Comment.Metadata>
                                        <div>on {this.props.latest.replyOfMsgDate} at {this.props.latest.replyOfMsgTime}</div>
                                    </Comment.Metadata>
                                    <Comment.Text>
                                        {this.props.latest.replyOfMsg}
                                    </Comment.Text>
                                </Comment.Content>
                                <Comment.Group>
                                    <Comment>
                                        <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/jenny.jpg' />
                                        <Comment.Content>
                                            <Comment.Author>{this.props.latest.userId}</Comment.Author>
                                            <Comment.Metadata>
                                                <div>on {this.props.latest.date} at {this.props.latest.time}</div>
                                            </Comment.Metadata>
                                            <Comment.Text>{this.props.latest.msg}</Comment.Text>
                                            <Comment.Actions>
                                                <Comment.Action><Checkbox toggle onChange={this.toggle} /></Comment.Action>
                                            </Comment.Actions>
                                        </Comment.Content>
                                    </Comment>
                                    <Collapse isOpened={this.state.isOpen}>
                                        <div>
                                            <Form reply onSubmit={this.onSubmit}>
                                                <Form.TextArea value={this.state.msg}
                                                    onChange={event => this.setState({ msg: event.target.value })} />
                                                <Button content='Add Reply' labelPosition='left' icon='edit' primary />
                                            </Form>
                                        </div>
                                    </Collapse>
                                </Comment.Group>
                            </Comment>
                        </Comment.Group>
                    </Grid.Column>
                </Grid>
            );
        } else {
            console.log('msg user id' + this.props.latest.userId + ' curr userid ' + this.props.userId)
            return (
                <Grid>
                    <Grid.Column floated={this.checkUser() ? 'right':'left'} width={5}>
                        <Comment.Group>
                            <Comment key={this.props.latest.time + this.props.latest.date + this.props.latest.userId + this.props.latest.msg}>
                                <Comment.Avatar as='a' src='https://react.semantic-ui.com/images/avatar/small/joe.jpg' />
                                <Comment.Content>
                                    <Comment.Author>{this.props.latest.userId}</Comment.Author>
                                    <Comment.Metadata><div>on {this.props.latest.date} at {this.props.latest.time}</div></Comment.Metadata>
                                    <Comment.Text>
                                        {this.props.latest.msg}
                                    </Comment.Text>
                                    <Comment.Actions>
                                        <Comment.Action><Checkbox toggle onChange={this.toggle} /></Comment.Action>
                                    </Comment.Actions>
                                </Comment.Content>
                            </Comment>
                            <Collapse isOpened={this.state.isOpen}>
                                <div>
                                    <Form reply onSubmit={this.onSubmit}>
                                        <Form.TextArea value={this.state.msg}
                                            onChange={event => this.setState({ msg: event.target.value })} />
                                        <Button content='Add Reply' labelPosition='left' icon='edit' primary />
                                    </Form>
                                </div>
                            </Collapse>
                        </Comment.Group>
                    </Grid.Column>
                </Grid>
            );
        }
    }
}

