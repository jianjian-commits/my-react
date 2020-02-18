import React from 'react';

export default class ComponentBox extends React.Component {
    render() {
        return (
            <div className={this.props.className}
                onClick={this.props.editModeOn.bind(this.props.parent, this.props.data)}
            >
                {this.props.content}
            </div>
        );
    }
}
