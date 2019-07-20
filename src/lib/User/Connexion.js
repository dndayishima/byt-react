import React from "react";
import PropTypes from "prop-types";

import {
    Button,
    FormControlLabel,
    IconButton,
    Snackbar,
    Switch,
    TextField
} from "@material-ui/core";

import CloseIcon from "@material-ui/icons/Close";

import _ from "lodash";

const styles = {
  grid: {
    container: {
      marginTop: "10px"
    }
  },
  input: {
    marginLeft: "5%",
    marginRight: "5%"
  },
  button: {
    marginBottom: "15px",
  }
};

export default class Connexion extends React.Component {
  static propTypes = {
    client: PropTypes.any.isRequired,
    onSuccess: PropTypes.func,
    onError: PropTypes.func
  }

  static defaultProps = {};

  state = {
    username: "",
    password: "",
    vendeur: false,
    error: false,
    errorMessage: "",
    utilisateur: {},
    openSnackBar: false
  };

  changeUsername = e => {
    this.setState({
      username: e.target.value
    });
  };

  changePassword = e => {
    this.setState({
      password: e.target.value
    });
  };

  changeVendeur = () => {
    this.setState({
      vendeur: !this.state.vendeur
    });
  };

  valideForm = () => {
    return !(_.isEmpty(this.state.username) || _.isEmpty(this.state.password));
  };

  connexion = () => {
    if (!this.valideForm()) {
      this.setState({
        error: true,
        errorMessage: "Renseigner l'identifiant et le mot de passe",
        openSnackBar: true
      });
      return;
    }

    this.props.client.User.login(
      this.state.username, // from state
      this.state.password, // from state
      result => {
        if (this.props.onSuccess) {
          this.props.onSuccess(result);
        }
      },
      error => {
        if (this.props.onError) {
          this.props.onError(error);
        }
      }
    );
  };

  onCloseSnackBar = () => {
    this.setState({ openSnackBar: false });
  }

  render() {
    return (
      <React.Fragment>
        <form
          noValidate={true}
          autoComplete="off"
        >
          <div style={styles.input}>
            <TextField
              autoFocus={true}
              error={this.state.error}
              fullWidth={true}
              label="Identifiant"
              margin="normal"
              name="username"
              onChange={(e) => this.changeUsername(e)}
              required={true}
              value={this.state.username}
              variant="outlined"
            />
          </div>
          <div style={styles.input}>
            <TextField
              error={this.state.error}
              fullWidth={true}
              label="Mot de passe"
              margin="normal"
              name="password"
              onChange={(e) => this.changePassword(e)}
              required={true}
              type="password"
              value={this.state.password}
              variant="outlined"
            />
          </div>
          <FormControlLabel
            control={
              <Switch
                checked={this.state.vendeur}
                color="primary"
                onChange={(e, c) => this.changeVendeur()}
              />
            }
            label="Vous êtes vendeur de tickets"
            style={styles.input}
          /> 
        </form>
        <div>
          <div style={styles.input}>
            <Button
              color="primary"
              fullWidth={true}
              onClick={this.connexion}
              size="large"
              style={styles.button}
              variant="contained"
            >
              CONNEXION
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
          onClose={this.onCloseSnackBar}
          message={this.state.errorMessage}
          action={
            <IconButton
              key="close"
              aria-label="Close"
              onClick={this.onCloseSnackBar}
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