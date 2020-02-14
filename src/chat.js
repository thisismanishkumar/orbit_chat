import React,{Component} from 'react'
import {Comment} from 'semantic-ui-react'

export default class chat extends Component{
    render(){
        return (
            <Comment.Group>
        <Comment>
            <Comment.Avatar as='a' src='https://react.semantic-ui.com/images/avatar/small/joe.jpg' />
            <Comment.Content>
                <Comment.Author>{this.props.latest.userId}</Comment.Author>
                <Comment.Metadata><div>on {this.props.latest.date} at {this.props.latest.time}</div></Comment.Metadata>
                <Comment.Text>
                    <p>
                        {this.props.latest.msg}
                    </p>
                </Comment.Text>
                
            </Comment.Content>
        </Comment>
        </Comment.Group>
        );
    }
    
}

