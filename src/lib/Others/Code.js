import React from "react";
import PropTypes from "prop-types";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText, 
  TextField,
  Typography
} from "@material-ui/core";

import MuiDialogTitle from "@material-ui/core/DialogTitle";

//import { ModalMessage } from "../../lib";
import _ from "lodash";

import { dictionnary } from "../Langs/langs";

const styles = {
  input: {
    marginTop: "10px",
    marginBottom: "10px"
  }
};

export default class Code extends React.Component {
  static propTypes = {
    client: PropTypes.any.isRequired,
    jwt: PropTypes.string,
    lang: PropTypes.string,
  };

  static defaultProps = {
    lang: "fr"
  };

  state = {
    price: 0,
    errorMessage: "",
    errorType: null,
    code: "",
    messageType: null,
    dialogOpen: false
  };

  generateCode = () => {
    this.props.client.Code.create(
      this.props.jwt,
      { value: this.state.price },
      result => {
        //console.log(result);
        this.setState({
          code: result.data.code,
          messageType: "success",
          dialogOpen: true
        });
      },
      error => {
        console.log(error);
        let lang = _.toUpper(this.props.lang);
        if (_.isUndefined(error)) {
          this.setState({
            code: "",
            errorMessage: _.upperFirst(_.get(dictionnary, lang + ".errorMessageNetwork")),
            errorType: 1,
            messageType: "error",
            dialogOpen: true
          });
        } else if (error.status === 401) {
          this.setState({
            code: "",
            errorMessage: _.upperFirst(_.get(dictionnary, lang + ".errorMessageAuthentication")),
            errorType: 2,
            messageType: "error",
            dialogOpen: true
          });
        } else {
          this.setState({
            code: "",
            errorMessage: _.upperFirst(_.get(dictionnary, lang + ".errorMessageCodeGeneration")),
            errorType: 3,
            messageType: "error",
            dialogOpen: true
          });
        }
      }
    );
  };

  render() {
    let lang = _.toUpper(this.props.lang);
    return (
      <React.Fragment>
        <div
          style={{ 
            margin: "0 auto",
            maxWidth: "500px",
            display: "flex",
            flexDirection: "column",
            width: "Auto"
          }}
        >
          <div style={styles.input}>
            <TextField
              fullWidth={true}
              label={_.upperFirst(_.get(dictionnary, lang + ".price"))}
              type="number"
              required={true}
              variant="outlined"
              value={this.state.price}
              onChange={e => {
                this.setState({ 
                  price: _.isEmpty(e.target.value) ? 0 : Number(e.target.value)
                });
              }}
            />
          </div>

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => {
                if (this.state.price !== 0) {
                  this.generateCode();
                }
              }}
            >
              {_.get(dictionnary, lang + ".createCode")}
            </Button>
          </div>

          <Dialog open={this.state.dialogOpen}>
            <MuiDialogTitle disableTypography={true}>
              <Typography
                variant="h6"
                color={this.state.messageType === "success" ? "primary" : "error"}
              >
                {_.upperFirst(_.get(dictionnary, lang + ".code"))}
              </Typography>
            </MuiDialogTitle>
            <DialogContent>
              <DialogContentText>
                {this.state.messageType === "success"
                  ? <span>
                      <span>
                        {_.upperFirst(_.get(dictionnary, lang + ".codeGenerationMessage"))}
                      </span>
                      <br />
                      <span>
                        {_.upperFirst(_.get(dictionnary, lang + ".code"))}
                        &nbsp;:&nbsp; 
                        <strong>{this.state.code}</strong>
                      </span> <br />
                      <span>
                        {_.upperFirst(_.get(dictionnary, lang + ".price"))}
                        &nbsp;&nbsp;
                        <strong>{this.state.price}</strong>
                      </span>
                    </span>
                  : <span>
                      {this.state.errorMessage}
                    </span>
                }
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                color={this.state.messageType === "success" ? "primary" : "default" }
                onClick={() => {
                  if (this.state.errorType === 2) {
                    // déconnexion
                    localStorage.setItem("jwt", "");
                    window.location.reload();
                  } else {
                    this.setState({
                      errorMessage: "",
                      errorType: null,
                      code: "",
                      messageType: null,
                      dialogOpen: false
                    });
                  }
                }}
              >
                <strong> OK </strong>
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </React.Fragment>
    )
  }
}