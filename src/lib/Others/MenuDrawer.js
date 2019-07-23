import React from "react";
import PropTypes from "prop-types";

import { Drawer } from "@material-ui/core";

export default class MenuDrawer extends React.Component {
  static propTypes = {
    lang: PropTypes.string,
    onChangeSelection: PropTypes.func,
    open: PropTypes.bool
  };
  static defaultProps = {
    lang: "fr",
    open: false
  };
  render () {
    return (
      <Drawer
        anchor="left"
        open={this.props.open}
      >

      </Drawer>
    )
  }
}