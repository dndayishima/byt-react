import React from "react";
import PropTypes from "prop-types";

import {
  Button,
  IconButton,
  Snackbar,
  TextField
} from "@material-ui/core";

import CloseIcon from "@material-ui/icons/Close";

import _ from "lodash";

import { dictionnary } from "../Langs/langs";

//import { getJWTPayload } from "../Helpers/Helpers";

export default class Connexion extends React.Component {
  static propTypes = {
    client: PropTypes.any.isRequired,
    lang: PropTypes.string,
    onSuccess: PropTypes.func
  }

  static defaultProps = {
    lang: "fr"
  };

  state = {
    login: "",
    password: "",
    error: false,
    errorMessage: "",
    openSnackBar: false
  };

  handleChangeInput = (event, name) => {
    let state = this.state;
    _.set(state, name, event.target.value);
    this.setState({...state});
  };

  valideForm = () => {
    return (!_.isEmpty(this.state.login) && !_.isEmpty(this.state.password));
  };

  connexion = () => {
    if (!this.valideForm()) {
      let lang = _.toUpper(this.props.lang);
      let errorMessage = _.get(dictionnary, lang + ".errorMessageLogin");
      this.setState({
        error: true,
        errorMessage: _.upperFirst(errorMessage),
        openSnackBar: true
      });
      return;
    }

    this.props.client.User.login(
      this.state.login,
      this.state.password,
      result => {
        //console.log(result);
        //getJWTPayload(result.data.jwt);
        if (this.props.onSuccess) {
          this.props.onSuccess(result.data.jwt);
        }
      },
      error => {
        //console.log(error);
        let lang = _.toUpper(this.props.lang);
        this.setState({
          error: true,
          errorMessage: _.isUndefined(error)
            ? _.upperFirst(_.get(dictionnary, lang + ".errorMessageLogin3"))
            : _.upperFirst(_.get(dictionnary, lang + ".errorMessageLogin2")),
          openSnackBar: true
        });
      }
    );
  };

  render() {
    let lang = _.toUpper(this.props.lang);
    let login = _.get(dictionnary, lang + ".login");
    let password = _.get(dictionnary, lang + ".password");
    let signIn = _.get(dictionnary, lang + ".signIn");
    return (
      <React.Fragment>
        <form
          noValidate={true}
          autoComplete="off"
        >
          <div>
            <TextField
              autoFocus={true}
              error={this.state.error}
              fullWidth={true}
              label={_.upperFirst(login)}
              margin="normal"
              name="login"
              onChange={e => this.handleChangeInput(e, "login")}
              required={true}
              value={this.state.login}
              variant="outlined"
            />
          </div>
          <div>
            <TextField
              error={this.state.error}
              fullWidth={true}
              label={_.upperFirst(password)}
              margin="normal"
              name="password"
              onChange={e => this.handleChangeInput(e, "password")}
              required={true}
              type="password"
              value={this.state.password}
              variant="outlined"
            />
          </div>
        </form>
        <div>
          <div>
            <Button
              style={{ marginTop: "20px" }}
              color="primary"
              fullWidth={true}
              onClick={this.connexion}
              size="large"
              variant="contained"
            >
              {_.upperFirst(signIn)}
            </Button>
          </div>
        </div>

        <Snackbar 
          anchorOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
          open={this.state.openSnackBar}
          autoHideDuration={2000}
          onClose={() => this.setState({ openSnackBar: false })}
          message={this.state.errorMessage}
          variant="warning"
          action={
            <IconButton
              key="close"
              aria-label="Close"
              onClick={() => this.setState({ openSnackBar: false })}
              color="inherit"
            >
              <CloseIcon />
            </IconButton>
          }
        />
      </React.Fragment>
    );
  }
}