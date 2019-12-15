import React from "react";
import PropTypes from "prop-types";

import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Snackbar,
  Switch,
  TextField,
  Typography
} from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";

import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import CloseIcon from "@material-ui/icons/Close";

import _ from "lodash";
import DateFnsUtils from "@date-io/date-fns";
import frLocale from "date-fns/locale/fr";
import enLocale from "date-fns/locale/en-US";

import moment from "moment";

import { ModalPhoto, Title } from "../../lib";
import emptyImage from "../../empty-image.png";

import { dictionnary } from "../Langs/langs";

const styles = {
  input: {
    marginTop: "10px",
    marginBottom: "10px"
  }
};

export default class Register extends React.Component {
  static propTypes = {
    client: PropTypes.any.isRequired,
    lang: PropTypes.string,
    edition: PropTypes.bool,
    user: PropTypes.object,
    onCancel: PropTypes.func
    //onSuccess: PropTypes.func
  };

  static defaultProps = {
    lang: "fr"
  };

  state = {
    login: _.get(this.props.user, "login", ""),
    password: "",
    confirmPassword: "",
    oldPassword: "",
    firstname: _.get(this.props.user, "firstname", ""),
    lastname: _.get(this.props.user, "lastname", ""),
    birthday: _.get(this.props.user, "birthday", null),
    email: _.get(this.props.user, "email", ""),
    photo: _.get(this.props.user, "photo", ""),
    telephones: _.get(this.props.user, "telephones", []),
    changeLoginInformations: false,
    modalPhoto: false
  };

  emailValidity = () => {
    let regex = /\S+@\S+\.\S+/;
    return (_.isEmpty(this.state.email) || regex.test(this.state.email));
  };

  loginInformationsValidity = () => {
    let p = !this.props.edition 
      ? !_.isEmpty(this.state.password) &&
        (this.state.password === this.state.confirmPassword)
      : this.state.changeLoginInformations
        ? !_.isEmpty(this.state.oldPassword) &&
          !_.isEmpty(this.state.password) &&
          (this.state.password === this.state.confirmPassword)
        : true
    return (
      !_.isEmpty(this.state.login) && p
    );
  };

  checkValidity = () => {
    return (
      !_.isEmpty(this.state.lastname) &&
      !_.isEmpty(this.state.firstname) &&
      this.emailValidity() &&
      this.loginInformationsValidity()
    );
  };

  render () {
    let lang = _.toUpper(this.props.lang);
    return (
      <React.Fragment>
        <Container maxWidth="md" style={{ marginBottom: "15px", marginTop: "10px" }}>
          {this.props.edition
            ? <Title 
                title={_.upperFirst(_.get(dictionnary, lang + ".profile"))}
              />
            : <Title 
                title={_.upperFirst(_.get(dictionnary, lang + ".register"))}
              />
          }
          <Grid container={true} spacing={2} justify="center">
            {/* Photo */}
            <Grid item={true} xs={8}>
              <img
                onClick={() => this.setState({ modalPhoto: true })}
                src={
                  _.isEmpty(this.state.photo)
                    ? emptyImage
                    : this.state.photo
                }
                alt="profile"
                height="100%"
                width="100%"
              />
            </Grid>

            {/* Code de l'utilisateur */}
            {this.props.user
              ? <Grid item={true} xs={12}>
                  <TextField 
                    fullWidth={true}
                    label={_.upperFirst(_.get(dictionnary, lang + ".code"))}
                    value={this.props.user.code}
                    variant="outlined"
                    disabled={true}
                  />
                </Grid>
              : null
            }

            {/* Nom & prénom */}
            <Grid item={true} xs={12} md={6}>
              <TextField 
                fullWidth={true}
                label={_.upperFirst(_.get(dictionnary, lang + ".lastname"))}
                name="lastname"
                onChange={e => this.setState({ lastname: e.target.value })}
                value={this.state.lastname}
                required={true}
                variant="outlined"
              />
            </Grid>
            <Grid item={true} xs={12} md={6}>
              <TextField 
                fullWidth={true}
                label={_.upperFirst(_.get(dictionnary, lang + ".firstname"))}
                name="firstname"
                onChange={e => this.setState({ firstname: e.target.value })}
                value={this.state.firstname}
                required={true}
                variant="outlined"
              />
            </Grid>

            {/* Date de naissance & Email */}
            <Grid item={true} xs={12} md={6}>
              <MuiPickersUtilsProvider
                locale={this.props.lang === "en" ? enLocale : frLocale}
                utils={DateFnsUtils}
              >
                <KeyboardDatePicker
                  autoOk={true}
                  inputVariant="outlined"
                  format={this.props.lang === "en" ? "MM/dd/yyyy" : "dd/MM/yyyy"}
                  label={_.upperFirst(_.get(dictionnary, lang + ".birthday"))}
                  fullWidth={true}
                  value={this.state.birthday}
                  required={true}
                  onChange={date => {
                    if (!_.isNull(date) && !_.isNaN(date.getDay())) {
                      this.setState({ birthday: date });
                    }
                  }}
                  invalidDateMessage=""
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item={true} xs={12} md={6}>
              <TextField
                error={!this.emailValidity()}
                fullWidth={true}
                label={_.upperFirst(_.get(dictionnary, lang + ".email"))}
                value={_.isNull(this.state.email) ? "" : this.state.email}
                onChange={e => this.setState({ email: e.target.value })}
                variant="outlined"
              />
            </Grid>
          </Grid>

          {/* Téléphones */}
          <Typography variant="h6" style={{ marginTop: "25px", marginBottom: "15px", textAlign: "center" }}>
            <strong>{_.upperFirst(_.get(dictionnary, lang + ".phones"))}</strong>
          </Typography>
          <Grid container={true} spacing={2}>
            {_.map(this.state.telephones, (telephone, index) =>
              <React.Fragment key={index}>
                <Grid item={true} xs={6}>
                  <TextField
                    //error={!this.phoneValidity(tel)}
                    fullWidth={true}
                    label={_.upperFirst(_.get(dictionnary, lang + ".phone")) + " " + (index + 1)}
                    onChange={e => {
                      let telephones = this.state.telephones;
                      telephones[index] = e.target.value;
                      this.setState({ telephones: telephones });
                    }}
                    value={this.state.telephones[index]}
                    variant="outlined"
                  />
                </Grid>
                <Grid item={true} xs={3}>
                  <IconButton
                    style={{ marginLeft: "8px" }}
                    onClick={() => {
                      let telephones = this.state.telephones;
                      telephones.splice(index, 1);
                      this.setState({ telephones: telephones });
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Grid>
              </React.Fragment>
            )}

            {/* Button add Telephone */}
            <Grid item={true} xs={12} style={{ marginTop: "10px" }}>
              <span style={{ textAlign: "center" }}>
                <Typography variant="body1" gutterBottom={true}>
                  {_.upperFirst(_.get(dictionnary, lang + ".phone"))}
                  <IconButton
                    style={{ marginLeft: "8px" }}
                    onClick={() => {
                      let tels = _.isNull(this.state.telephones) ? [] : this.state.telephones;
                      tels.push("");
                      this.setState({ telephones: tels });
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Typography>
              </span>
            </Grid>
          </Grid>

          {/* Informations de connexion + Mot de passe */}
          {this.props.edition
            ? <Grid container={true} spacing={2}>
                <Grid item={true} xs={12}>
                  <FormControlLabel 
                    control={
                      <Switch 
                        checked={this.state.changeLoginInformations}
                        color="primary"
                        onChange={() => this.setState({ changeLoginInformations: !this.state.changeLoginInformations })}
                      />
                    }
                    label={_.upperFirst(_.get(dictionnary, lang + ".changeLoginInformations"))}
                    labelPlacement="end"
                    style={{ marginTop: "15px", marginBottom: "15px" }}
                  />
                </Grid>
              </Grid>
            : null
          }

          {this.props.edition && !this.state.changeLoginInformations
            ? null
            : <Grid container={true} spacing={2}>
                <Grid item={true} xs={12} md={this.state.changeLoginInformations ? 6 : 4}>
                  <TextField 
                    fullWidth={true}
                    label={_.upperFirst(_.get(dictionnary, lang + ".login"))}
                    onChange={e => this.setState({ login: e.target.value })}
                    value={this.state.login}
                    variant="outlined"
                    required={true}
                    disabled={this.state.changeLoginInformations}
                  />
                </Grid>
                {this.state.changeLoginInformations
                  ? <Grid item={true} xs={12} md={6}>
                      <TextField 
                        fullWidth={true}
                        label={_.upperFirst(_.get(dictionnary, lang + ".oldPassword"))}
                        onChange={e => this.setState({ oldPassword: e.target.value })}
                        value={this.state.oldPassword}
                        variant="outlined"
                        required={true}
                        type="password"
                      />
                    </Grid>
                  : null
                }
                <Grid item={true} xs={12} md={this.state.changeLoginInformations ? 6 : 4}>
                  <TextField 
                    fullWidth={true}
                    label={_.upperFirst(_.get(dictionnary, lang + ".password"))}
                    onChange={e => this.setState({ password: e.target.value })}
                    value={this.state.password}
                    variant="outlined"
                    required={true}
                    type="password"
                  />
                </Grid>
                <Grid item={true} xs={12} md={this.state.changeLoginInformations ? 6 : 4}>
                  <TextField
                    error={
                      !_.isEmpty(this.state.confirmPassword) &&
                      this.state.confirmPassword !== this.state.password
                    }
                    fullWidth={true}
                    label={_.upperFirst(_.get(dictionnary, lang + ".confirmPassword"))}
                    onChange={e => this.setState({ confirmPassword: e.target.value })}
                    value={this.state.confirmPassword}
                    variant="outlined"
                    required={true}
                    type="password"
                  />
                </Grid>
              </Grid>
          }

          {/* Buttons Annuler - Enregistrer - Modifier */}
          <Grid container={true} spacing={1} style={{ marginTop: "10px" }}>
            <Grid item={true} xs={12} md={6}>
              <Button
                variant="contained"
                fullWidth={true}
                size="large"
                onClick={() => {
                  if (this.props.onCancel) {
                    this.props.onCancel();
                  }
                }}
              >
                {_.upperFirst(_.get(dictionnary, lang + ".cancel"))}
              </Button>
            </Grid>
            <Grid item={true} xs={12} md={6}>
              <Button 
                variant="contained"
                fullWidth={true}
                color="primary"
                size="large"
                onClick={() => {
                  /*if (_.isEmpty(this.props.event)) {
                    this.save();
                  } else {
                    this.update();
                  }*/
                }}
              >
                {this.props.edition
                  ? _.upperFirst(_.get(dictionnary, lang + ".modify"))
                  : _.upperFirst(_.get(dictionnary, lang + ".save"))
                }
              </Button>
            </Grid>
          </Grid>
        </Container>

        {/* Modal Changement de la photo */}
        <ModalPhoto 
          lang={this.props.lang}
          open={this.state.modalPhoto}
          photo={this.state.photo}
          onClose={() => this.setState({ modalPhoto: false })}
          onModify={photo => this.setState({ photo: photo })}
        />
      </React.Fragment>
    );
  }
}

class Registerrrrr extends React.Component {
  static propTypes = {
    client: PropTypes.any.isRequired,
    lang: PropTypes.string,
    onSuccess: PropTypes.func
  };
  static defaultProps = {
    lang: "fr"
  };

  state = {
    login: "",
    password: "",
    confirmPassword: "",
    firstname: "",
    lastname: "",
    birthday: null,
    telephones: [],
    email: "",
    roles: ["USER"],
    error: false,
    errorMessage: "",
    openSnackBar: false,
    dialogType: null // success en cas de succès et error dans le cas contraire
  };

  // l'index sera défini au moment où on voudra modifier 
  // le numéro de téléphone
  handleChangeInput = (event, name, index) => {
    if (!_.isUndefined(index)) { // on est sur les téléphones
      let tel = this.state.telephones;
      tel[index] = event.target.value;
      this.setState({ telephones: tel });
    } else {
      let state = this.state;
      _.set(state, name, event.target.value);
      this.setState({...state});
    }
  };

  changeSellerRole = () => {
    let roles = this.state.roles;
    let sellerIndex = _.findIndex(roles, role => role === "SELLER");
    if (sellerIndex === -1) {
      roles.push("SELLER");
    } else {
      roles.splice(sellerIndex, 1);
    }
    this.setState({ roles: roles });
  };

  emailValidity = () => {
    let regex = /\S+@\S+\.\S+/;
    return (_.isEmpty(this.state.email) || regex.test(this.state.email));
  };

  // numéros du burundi seulement
  phoneValidity = phone => {
    let regex = new RegExp("^(\\+|00|[0-9])[0-9]+$");
    return (_.isEmpty(phone) || (phone.length >= 8 && phone.length <= 13 && regex.test(phone)));    
  };

  checkPhones = () => {
    let bool = true;
    _.forEach(this.state.telephones, tel => {
      if (!this.phoneValidity(tel)) {
        bool = false;
      }
    });
    return bool;
  };


  checkValidity = () => {
    return (
      !_.isEmpty(this.state.lastname) &&
      !_.isEmpty(this.state.firstname) &&
      !_.isNull(this.state.birthday) &&
      !_.isEmpty(this.state.login) &&
      !_.isEmpty(this.state.password) &&
      (this.state.password === this.state.confirmPassword) &&
      this.emailValidity() &&
      this.checkPhones()
    );
  };

  register = () => {
    if (!this.checkValidity()) {
      let lang = _.toUpper(this.props.lang);
      let invalidForm = _.get(dictionnary, lang + ".invalidForm");
      this.setState({ openSnackBar: true, error: true, errorMessage: _.upperFirst(invalidForm) });
      return;
    }
    let params = {
      login: this.state.login,
      password: this.state.password,
      lastname: this.state.lastname,
      firstname: this.state.firstname,
      birthday: moment(this.state.birthday).format("YYYY-MM-DD"),
      telephones: this.state.telephones,
      email: this.state.email,
      roles: this.state.roles
    };
    this.props.client.User.register(
      params,
      result => {
        //console.log("success");
        //console.log(result);
        this.setState({ dialogType: 1 });
      },
      error => {
        //console.log("error");
        //console.log(error);
        this.setState({ 
          dialogType: _.isUndefined(error) ? 3 : 2 // 3 = Réseau
        });
      }
    )
  };

  render() {
    let lang = _.toUpper(this.props.lang);
    let lastname = _.get(dictionnary, lang + ".lastname");
    let firstname = _.get(dictionnary, lang + ".firstname");
    let birthday = _.get(dictionnary, lang + ".birthday");
    let email = _.get(dictionnary, lang + ".email");
    let phone = _.get(dictionnary, lang + ".phone");
    let login = _.get(dictionnary, lang + ".login");
    let password = _.get(dictionnary, lang + ".password");
    let confirmPassword = _.get(dictionnary, lang + ".confirmPassword");
    let seller = _.get(dictionnary, lang + ".seller");
    let createAccount = _.get(dictionnary, lang + ".createAccount");
    let register = _.get(dictionnary, lang + ".register");
    //console.log(_.isNull(this.state.birthday) ? "null" : moment(this.state.birthday).format("YYYY-MM-DD"));
    //console.log(this.state.birthday.getDate());
    return (
      <React.Fragment>
        <form noValidate={true} autoComplete="off">
          <div style={styles.input}>
            <TextField
              autoFocus={true}
              fullWidth={true}
              label={_.upperFirst(lastname)}
              name="lastname"
              onChange={e => {
                this.handleChangeInput(e, "lastname");
              }}
              value={this.state.lastname}
              required={true}
              variant="outlined"
            />
          </div>
          <div style={styles.input}>
            <TextField 
              fullWidth={true}
              label={_.upperFirst(firstname)}
              name="firstname"
              onChange={e => this.handleChangeInput(e, "firstname")}
              value={this.state.firstname}
              required={true}
              variant="outlined"
            />
          </div>
          <div style={styles.input}>
            <MuiPickersUtilsProvider
              locale={this.props.lang === "en" ? enLocale : frLocale}
              utils={DateFnsUtils}
            >
              <KeyboardDatePicker
                autoOk={true}
                inputVariant="outlined"
                format={this.props.lang === "en" ? "MM/dd/yyyy" : "dd/MM/yyyy"}
                label={_.upperFirst(birthday)}
                fullWidth={true}
                value={this.state.birthday}
                required={true}
                onChange={date => {
                  if (!_.isNull(date) && !_.isNaN(date.getDay())) {
                    this.setState({ birthday: date });
                  }
                }}
                invalidDateMessage=""
              />
            </MuiPickersUtilsProvider>
          </div>
          <div style={styles.input}>
            <TextField
              error={!this.emailValidity()}
              fullWidth={true}
              label={_.upperFirst(email)}
              name="email"
              value={this.state.email}
              onChange={e => this.handleChangeInput(e, "email")}
              variant="outlined"
            />
          </div>
          {_.map(this.state.telephones, (tel, index) => 
            <div style={styles.input} key={index}>
              <div style={{ display: "flex" }}>
                <TextField
                  error={!this.phoneValidity(tel)}
                  fullWidth={true}
                  label={_.upperFirst(phone) + " " + (index + 1)}
                  name="phone"
                  onChange={e => {
                    this.handleChangeInput(e, "telephones", index);
                  }}
                  value={this.state.telephones[index]}
                  variant="outlined"
                />
                <IconButton
                  style={{ marginLeft: "8px" }}
                  onClick={() => {
                    let tel = this.state.telephones;
                    tel.splice(index, 1);
                    this.setState({ telephones: tel });
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </div>  
          )}
          <div style={styles.input}>
            <span style={{ textAlign: "center" }}>
              <Typography variant="body1" gutterBottom={true}>
                {_.upperFirst(phone)}
                <IconButton
                  style={{ marginLeft: "8px" }}
                  onClick={() => {
                    let tel = this.state.telephones;
                    tel.push("");
                    this.setState({ telephones: tel });
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Typography>
            </span>
          </div>
          <Divider light={true} variant="middle" style={{ marginTop: "20px", marginBottom: "20px" }}/>
          <div style={styles.input}>
            <TextField 
              fullWidth={true}
              label={_.upperFirst(login)}
              name="login"
              onChange={e => this.handleChangeInput(e, "login")}
              value={this.state.login}
              variant="outlined"
              required={true}
            />
          </div>
          <div style={styles.input}>
            <TextField 
              fullWidth={true}
              label={_.upperFirst(password)}
              name="password"
              onChange={e => this.handleChangeInput(e, "password")}
              value={this.state.password}
              variant="outlined"
              required={true}
              type="password"
            />
          </div>
          <div style={styles.input}>
            <TextField
              error={
                !_.isEmpty(this.state.confirmPassword) &&
                this.state.confirmPassword !== this.state.password
              }
              fullWidth={true}
              label={_.upperFirst(confirmPassword)}
              name="confirmation"
              onChange={e => this.handleChangeInput(e, "confirmPassword")}
              value={this.state.confirmPassword}
              variant="outlined"
              required={true}
              type="password"
            />
          </div>
          <FormControlLabel 
            control={
              <Switch 
                checked={_.includes(this.state.roles, "SELLER")}
                color="primary"
                onChange={() => this.changeSellerRole()}
              />
            }
            label={_.upperFirst(seller)}
            labelPlacement="end"
          />
          <div style={styles.input}>
            <Button 
              color="primary"
              fullWidth={true}
              onClick={this.register}
              size="large"
              variant="contained"
            >
              {_.upperFirst(createAccount)}
            </Button>
          </div>
        </form>

        {/* message d'erreur */}
        <Snackbar 
          anchorOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
          open={this.state.openSnackBar}
          autoHideDuration={2000}
          onClose={() => this.setState({ openSnackBar: false })}
          message={this.state.errorMessage}
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

        {/* Dialogue, retour inscription (success ou error) */}
        <Dialog open={!_.isNull(this.state.dialogType)}>
          <MuiDialogTitle disableTypography={true}>
            <Typography
              variant="h4"
              color={
                this.state.dialogType === 1
                ? "primary"
                : "error"
              }
            >
              {_.upperFirst(register)}
            </Typography>
          </MuiDialogTitle>
          <DialogContent>
            <DialogContentText>
              {this.state.dialogType === 1
                ? _.upperFirst(_.get(dictionnary, lang + ".successRegister"))
                : this.state.dialogType === 2
                  ? _.upperFirst(_.get(dictionnary, lang + ".errorRegister2"))
                  : this.state.dialogType === 3
                    ? _.upperFirst(_.get(dictionnary, lang + ".errorRegister3"))
                    : null
              }
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              color={this.state.dialogType === 1 ? "primary" : "default"}
              onClick={() => {
                if (this.state.dialogType === 1) {
                  if (this.props.onSuccess) {
                    this.props.onSuccess();
                  }
                } else {
                  this.setState({ dialogType: null });
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

