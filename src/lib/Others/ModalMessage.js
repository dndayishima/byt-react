import React from "react";
import PropTypes from "prop-types";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography
} from "@material-ui/core";

import MuiDialogTitle from "@material-ui/core/DialogTitle";

export default class ModalMessage extends React.Component {
  static propTypes = {
    //lang: PropTypes.string,
    open: PropTypes.bool,
    onAction: PropTypes.func,
    message: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string // success | error
  };
  static defaultProps = {
    //lang: "fr",
    open: false,
    message: "",
    title: "",
    type: "success"
  };
  render () {
    return (
      <React.Fragment>
        <Dialog open={this.props.open}>
          <MuiDialogTitle disableTypography={true}>
            <Typography
              variant="h6"
              color={this.props.type === "success" ? "primary" : "error"}
            >
              {this.props.title}
            </Typography>
          </MuiDialogTitle>
          <DialogContent>
            <DialogContentText>
              {this.props.message}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              color={this.props.type === "success" ? "primary" : "default" }
              onClick={() => {
                if (this.props.onAction) {
                  this.props.onAction();
                }
              }}
            >
              <strong>OK</strong>
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}