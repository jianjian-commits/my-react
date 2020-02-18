import React from 'react';
import PropTypes from 'prop-types';

export default class PlaceHolder extends React.Component {
  render() {
    let classes = "place-text";
    return (
      this.props.show &&
      <div id={"formPlaceHolder"} >
        <div className={classes}>{this.props.text}</div>
      </div>
    );
  }
}

PlaceHolder.propTypes = {
  text: PropTypes.string,
  show: PropTypes.bool,
};

PlaceHolder.defaultProps = {
  text: 'Drop a item here....',
  show: false,
};
