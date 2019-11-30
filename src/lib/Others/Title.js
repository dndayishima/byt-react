import React from "react";

import { Typography } from "@material-ui/core";

import _ from "lodash";

export default class Title extends React.Component {
  static defaultProps = {
    title: ""
  };
  render() {
    return(
      <React.Fragment>
        {_.isEmpty(this.props.title)
          ? null
          : <div style={{ marginBottom: "20px" }}> 
              <Typography 
                color="primary"
                //style={{ color: "red" }}
                variant="h4"
              >
                {this.props.title}
              </Typography>
            </div>
        }
      </React.Fragment>
    );
  } 
}