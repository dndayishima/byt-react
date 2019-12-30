import React from "react";
import PropTypes from "prop-types";

import {
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
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
import CloseIcon from "@material-ui/icons/Close";

import _ from "lodash";
import DateFnsUtils from "@date-io/date-fns";
import frLocale from "date-fns/locale/fr";
import enLocale from "date-fns/locale/en-US";

import { ModalPhoto, Title } from "../../lib";
import emptyImage from "../../empty-image.png";

import { dictionnary } from "../Langs/langs";

export default class Register extends React.Component {
  static propTypes = {
    client: PropTypes.any.isRequired,
    lang: PropTypes.string,
    edition: PropTypes.bool,
    user: PropTypes.object,
    onCancel: PropTypes.func,
    onEdition: PropTypes.func,
    onRegistration: PropTypes.func
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
    modalPhoto: false,
    openSnackBar: false,
    error: false,
    errorMessage: "",
    dialogType: null, // success en cas de succès et error dans le cas contraire
    loading: false
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

  register = () => {
    if (!this.checkValidity()) {
      let lang = _.toUpper(this.props.lang);
      let invalidForm = _.get(dictionnary, lang + ".invalidForm");
      this.setState({ 
        openSnackBar: true,
        error: true, errorMessage: _.upperFirst(invalidForm),
        loading: false
      });
      return;
    }

    let params = {};
    params.login = this.state.login;
    params.password = this.state.password;
    params.lastname = this.state.lastname;
    params.firstname = this.state.firstname;
    params.birthday = this.state.birthday;
    params.email = _.isEmpty(this.state.email) ? null : this.state.email;
    params.photo = _.isEmpty(this.state.photo) ? null : this.state.photo;

    let t = _.filter(this.state.telephones, tel => tel !== "");
    params.telephones = _.isEmpty(t) ? null : t;

    this.props.client.User.register(
      params,
      result => {
        //console.log(result);
        this.setState({ dialogType: 1, loading: false });
      },
      error => {
        //console.log(error);
        this.setState({ 
          dialogType: _.isUndefined(error) ? 3 : 2, // 3 = Réseau
          loading: false
        });
      }
    );
  };

  // TODO : Gérer le lockRevision
  save = () => {
    let lang = _.toUpper(this.props.lang);
    if (!this.checkValidity()) {
      let invalidForm = _.get(dictionnary, lang + ".invalidForm");
      this.setState({
        openSnackBar: true,
        error: true, errorMessage: _.upperFirst(invalidForm),
        loading: false
      });
      return;
    }

    let params = {};
    params.id = this.props.user.id
    params.lastname = this.state.lastname;
    params.firstname = this.state.firstname;
    params.birthday = this.state.birthday;
    params.email = _.isEmpty(this.state.email) ? null : this.state.email;

    // TODO sur le back end, permettre de mettre à jour quelques champs à null 
    params.photo = _.isEmpty(this.state.photo) ? null : this.state.photo;
    
    let t = _.filter(this.state.telephones, tel => tel !== "");
    params.telephones = _.isEmpty(t) ? null : t;

    if (!this.state.changeLoginInformations) {
      this.props.client.User.update(
        params,
        result => {
          //console.log(result);
          if (this.props.onEdition) {
            this.props.onEdition(result.data.jwt, result.data.user);
          }
        },
        error => {
          //console.log(error);
          this.setState({
            openSnackBar: true,
            error: true,
            errorMessage: _.upperFirst(_.get(dictionnary, lang + ".errorOccurredMessage")),
            loading: false
          });
        }
      );
    } else {
      // cas de changement des informations de connexion
      this.props.client.User.login(
        this.state.login,
        this.state.oldPassword,
        result => {
          // faire la mise à jour de l'utilisateur alors
          params.password = this.state.password;
          this.props.client.User.update(
            params,
            result => {
              if (this.props.onEdition) {
                this.props.onEdition(result.data.jwt, result.data.user);
              }
            },
            error => {
              this.setState({
                openSnackBar: true,
                error: true,
                errorMessage: _.upperFirst(_.get(dictionnary, lang + ".errorOccurredMessage")),
                loading: false
              });
            }
          );
        },
        error => {
          //console.log(error);
          // mettre ici un autre type d'erreur
          this.setState({
            openSnackBar: true,
            error: true,
            errorMessage: _.upperFirst(_.get(dictionnary, lang + ".oldPasswordWrong")),
            loading: false
          });
        }
      );
    }
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
                  //format={this.props.lang === "en" ? "MM/dd/yyyy" : "dd/MM/yyyy"}
                  format="dd/MM/yyyy"
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

          {/* Loader après l'appui sur Enregistrer - Modifier */}
          {this.state.loading
            ? <Grid container={true} spacing={2} justify="center">
                <Grid item={true}>
                  <CircularProgress />
                </Grid>
              </Grid>
            : null
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
                  this.setState({ loading: true });
                  if (this.props.edition) {
                    this.save();
                  } else {
                    this.register();
                  }
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
              {_.upperFirst(_.get(dictionnary, lang + ".register"))}
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
                  if (this.props.onRegistration) {
                    this.props.onRegistration();
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
    );
  }
}