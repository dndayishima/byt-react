import React from "react";
import PropTypes from "prop-types";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  Snackbar,
  TextField,
  Typography
} from "@material-ui/core";

import MuiDialogTitle from "@material-ui/core/DialogTitle";

import { Image } from "@material-ui/icons";

import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardTimePicker
} from "@material-ui/pickers";

import _ from "lodash";
import moment from "moment";
import DateFnsUtils from "@date-io/date-fns";
import frLocale from "date-fns/locale/fr";
import enLocale from "date-fns/locale/en-US";

import { ModalMessage } from "../../lib";

import emptyImage from "../../empty-image.png";

import { dictionnary } from "../Langs/langs";

import { imageHasPrefix } from "../Helpers/Helpers";

const styles = {
  input: {
    marginTop: "10px",
    marginBottom: "10px"
  }
};

export default class EventEditor extends React.Component {
  static propTypes = {
    client: PropTypes.any.isRequired,
    jwt: PropTypes.string,
    lang: PropTypes.string,
    event: PropTypes.object,
    onEdition: PropTypes.func,
    onCancel: PropTypes.func,
    onSignOut: PropTypes.func,
    user: PropTypes.object
  };

  static defaultProps = {
    event: {},
    lang: "fr"
  };

  state = {
    date: _.isEmpty(this.props.event) 
      ? moment()
      : moment(this.props.event.date),
    description: _.get(this.props.event, "description", ""),
    name: _.get(this.props.event, "name", ""),
    photo: _.get(this.props.event, "photo", ""),
    price: _.get(this.props.event, "price", 0),
    tags: _.get(this.props.event, "tags", []),
    venue: _.get(this.props.event, "venue", ""),
    codesMarchands: _.get(this.props.event, "codesMarchands", []),
    modalPhoto: false,
    openSnackBar: false,
    errorMessage: "",
    errorTitle: "",
    errorType: null
  };

  // l'index sera défini au moment où on voudra modifier
  // le tag
  handleChangeInput = (event, name, index) => {
    if (!_.isUndefined(index)) { // on est sur les tags
      let tags = this.state.tags;
      tags[index] = event.target.value;
      this.setState({ tags: tags });
    } else {
      let state = this.state;
      _.set(state, name, event.target.value);
      this.setState({...state});
    }
  };

  handleChangePrice = price => {
    this.setState({
      price: _.isEmpty(price) ? 0 : Number(price)
    });
  };

  checkValidity = () => {
    return (
      !_.isEmpty(this.state.name) &&
      !_.isNull(this.state.date) &&
      (this.state.price > 0)
    );
  };

  handleError = error => {
    let lang = _.toUpper(this.props.lang);
    if (_.isUndefined(error)) {
      this.setState({
        errorType: 3,
        errorTitle: _.upperFirst(_.get(dictionnary, lang + ".events")),
        errorMessage: _.upperFirst(_.get(dictionnary, lang + ".errorMessageNetwork"))
      });
    } else {
      this.setState({
        errorType: 2,
        errorTitle: _.upperFirst(_.get(dictionnary, lang + ".authentication")),
        errorMessage: _.upperFirst(_.get(dictionnary, lang + ".errorMessageAuthentication"))
      });
    }
  };

  update = () => {
    if (!this.checkValidity()) {
      this.invalidForm();
      return;
    }
    this.props.client.Event.read(
      this.props.jwt,
      this.props.event.id,
      result => {
        //console.log(result);
        let event = result.data;
        if (event.lockRevision === this.props.event.lockRevision) {
          let params = {};
          params.name = this.state.name;
          params.date = this.state.date.format("YYYY-MM-DDTHH:mm:ss");
          params.description = this.state.description;
          params.price = this.state.price;
          params.tags = _.filter(this.state.tags, tag => tag !== "");
          params.venue = this.state.venue;
          params.codesMarchands = 
            _.filter(this.state.codesMarchands, cm => !_.isEmpty(cm.operator) && !_.isEmpty(cm.numero));

          if (imageHasPrefix(this.state.photo)) {
            params.photo = this.state.photo;
          }

          this.props.client.Event.update(
            this.props.jwt,
            this.props.event.id,
            params,
            result => {
              // success
              if (this.props.onEdition) {
                this.props.onEdition();
              }
            },
            error => {
              // error
              //console.log(error);
              this.handleError(error);
            }
          );
        } else {
          // demander de recharger
          let lang = _.toUpper(this.props.lang);
          this.setState({
            errorType: 1, // lockRevision
            errorTitle: _.upperFirst(_.get(dictionnary, lang + ".events")),
            errorMessage: _.upperFirst(_.get(dictionnary, lang + ".errorMessageLockRevision"))
          });
        }
      },
      error => {
        //console.log(error);
        this.handleError(error);
      }
    );
  };

  save = () => {
    if (!this.checkValidity()) {
      this.invalidForm();
      return;
    }
    let params = {};
    params.name = this.state.name;
    params.date = this.state.date.format("YYYY-MM-DDTHH:mm:ss");
    params.description = this.state.description;
    params.price = this.state.price;
    params.tags = _.filter(this.state.tags, tag => tag !== "");
    params.venue = this.state.venue;
    params.photo = this.state.photo;
    params.codesMarchands = 
      _.filter(this.state.codesMarchands, cm => !_.isEmpty(cm.operator) && !_.isEmpty(cm.numero));

    this.props.client.Event.create(
      this.props.jwt,
      params,
      result => {
        // TODO : faire des retours utilisateurs
        if (this.props.onEdition) {
          this.props.onEdition();
        }
      },
      error => {
        console.log(error);
        this.handleError(error);
      }
    );
  };

  invalidForm = () => {
    let lang = _.toUpper(this.props.lang);
    this.setState({
      openSnackBar: true,
      errorMessage: _.upperFirst(_.get(dictionnary, lang + ".invalidForm"))
    })
  };
  

  render() {
    let lang = _.toUpper(this.props.lang);
    //console.log(this.state.date._d);
    return (
      <React.Fragment>
        <div style={{ 
          margin: "0 auto",
          maxWidth: "700px",
          display: "flex",
          flexDirection: "column",
          width: "Auto"
          }}
        >

          <div
            style={{ 
              marginTop: "15px",
              marginBottom: "15px",
              textAlign: "center"
            }}
          >            
            <img
              onClick={() => this.setState({ modalPhoto: true })}
              src={
                _.isEmpty(this.state.photo) 
                  ? emptyImage
                  : imageHasPrefix(this.state.photo)
                    ? this.state.photo
                    : "data:image/png;base64," + this.state.photo
              } 
              alt="Affiche" 
              height="150" 
              width="auto"
            />
          </div>

          {!_.isEmpty(this.props.event)
            ? <div style={styles.input}>
                <TextField
                  disabled={true}
                  fullWidth={true}
                  label={_.upperFirst(_.get(dictionnary, lang + ".eventCode"))}
                  variant="outlined"
                  value={this.props.event.code}
                />
              </div>
            : null
          }
          
          <div style={styles.input}>
            <TextField
              fullWidth={true}
              label={_.upperFirst(_.get(dictionnary, lang + ".eventName"))}
              required={true}
              variant="outlined"
              value={this.state.name}
              onChange={e => this.handleChangeInput(e, "name")}
            />
          </div>

          {/* Date + heure*/}
          <MuiPickersUtilsProvider
            utils={DateFnsUtils}
            locale={this.props.lang === "en" ? enLocale : frLocale}
          >
            <Grid container={true} justify="space-between">
              <KeyboardDatePicker 
                autoOk={true}
                inputVariant="outlined"
                format={this.props.lang === "en" ? "MM/dd/yyyy" : "dd/MM/yyyy"}
                label={_.upperFirst(_.get(dictionnary, lang + ".date"))}
                required={true}
                style={styles.input}
                value={this.state.date.toDate()}
                onChange={date => {
                  let prev = this.state.date;
                  if (!_.isNull(date) && !_.isNaN(date.getDay())) {
                    let selectedDay = moment(date);
                    selectedDay.hour(prev.get("hour"));
                    selectedDay.minute(prev.get("minute"));
                    this.setState({ date: selectedDay });
                  }
                }}
              />
              <KeyboardTimePicker 
                inputVariant="outlined"
                ampm={this.props.lang === "en"}
                label={_.upperFirst(_.get(dictionnary, lang + ".time"))}
                style={styles.input}
                required={true}
                value={this.state.date.toDate()}
                onChange={date => {
                  //console.log(date);
                  let prev = this.state.date;
                  if (!_.isNull(date) && !_.isNaN(date.getDay())) {
                    let selectedTime = moment(date);
                    selectedTime.year(prev.get("year"));
                    selectedTime.month(prev.get("month"));
                    selectedTime.date(prev.get("date"));
                    this.setState({ date: selectedTime });
                  }
                }}
              />
            </Grid>
          </MuiPickersUtilsProvider>

          <div style={styles.input}>
            <TextField
              fullWidth={true}
              label={_.upperFirst(_.get(dictionnary, lang + ".price"))}
              type="number"
              required={true}
              variant="outlined"
              value={this.state.price}
              onChange={e => this.handleChangePrice(e.target.value)}
            />
          </div>
          <div style={styles.input}>
            <TextField
              fullWidth={true}
              label={_.upperFirst(_.get(dictionnary, lang + ".description"))}
              multiline={true}
              rowsMax="6"
              variant="outlined"
              value={this.state.description}
              onChange={e => this.handleChangeInput(e, "description")}
            />
          </div>

          <div style={styles.input}>
            <TextField
              fullWidth={true}
              label={_.upperFirst(_.get(dictionnary, lang + ".venue"))}
              variant="outlined"
              value={this.state.venue}
              onChange={e => this.handleChangeInput(e, "venue")}
            />
          </div>

          {/* Tags ici */}
          {_.map(this.state.tags, (tag, index) =>
            <div style={styles.input} key={index}>
              <div style={{ display: "flex", flexGrow: 1 }}>
                <TextField 
                  fullWidth={true}
                  label={_.upperFirst(_.get(dictionnary, lang + ".tag"))}
                  name="tag"
                  variant="outlined"
                  value={tag}
                  onChange={e => this.handleChangeInput(e, "tags", index)}
                />
                <IconButton
                  style={{ marginLeft: "8px" }}
                  onClick={() => {
                    let tags = this.state.tags;
                    tags.splice(index, 1);
                    this.setState({ tags: tags });
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
                {_.upperFirst(_.get(dictionnary, lang + ".tag"))}
                <IconButton
                  style={{ marginLeft: "8px" }}
                  onClick={() => {
                    let tags = this.state.tags;
                    tags.push("");
                    this.setState({ tags: tags });
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Typography>
            </span>
          </div>

          {/* Codes marchands */}
          {_.map(this.state.codesMarchands, (cm, index) =>
            <Grid container={true} justify="space-between" key={index}>
              <TextField
                label={_.upperFirst(_.get(dictionnary, lang + ".operator"))}
                style={styles.input}
                variant="outlined"
                value={cm.operator}
                onChange={e => {
                  let codes = this.state.codesMarchands;
                  codes[index].operator = e.target.value;
                  this.setState({ codesMarchands: codes });
                }} 
              />
              <TextField
                label={_.upperFirst(_.get(dictionnary, lang + ".numero"))}
                style={styles.input}
                variant="outlined"
                value={cm.numero}
                onChange={e => {
                  let codes = this.state.codesMarchands;
                  codes[index].numero = e.target.value;
                  this.setState({ codesMarchands: codes });
                }}
              />
              <IconButton
                style={{ marginLeft: "8px" }}
                onClick={() => {
                  let codes = this.state.codesMarchands;
                  codes.splice(index, 1);
                  this.setState({ codesMarchands: codes });
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          )}

          <div style={styles.input}>
            <span style={{ textAlign: "center" }}>
              <Typography variant="body1" gutterBottom={true}>
                {_.upperFirst(_.get(dictionnary, lang + ".codeMarchand"))}
                <IconButton
                  style={{ marginLeft: "8px" }}
                  onClick={() => {
                    let codes = this.state.codesMarchands;
                    codes.push({ operator: "", numero: "" });
                    this.setState({ codesMarchands: codes });
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Typography>
            </span>
          </div>

          {/* Boutons */}
          <div style={{ display: "flex", marginTop: "15px", marginBottom: "15px", justifyContent: "center" }}>
            <Button
              variant="contained"
              style={{ marginRight: "5px"}}
              size="large"
              onClick={() => {
                if (this.props.onCancel) {
                  this.props.onCancel();
                }
              }}
            >
              {_.upperFirst(_.get(dictionnary, lang + ".cancel"))}
            </Button>

            {!_.isEmpty(this.props.event)
              ? <Button
                  variant="contained"
                  style={{ marginRight: "5px", color: "white", backgroundColor: "red" }}
                  size="large"
                  onClick={() => console.log("delete")}
                >
                  {_.upperFirst(_.get(dictionnary, lang + ".delete"))}
                </Button>
              : null
            }
            
            <Button 
              variant="contained"
              color="primary"
              size="large"
              onClick={() => {
                if (_.isEmpty(this.props.event)) {
                  this.save();
                } else {
                  this.update();
                }
              }}
            >
              {_.isEmpty(this.props.event)
                ? _.upperFirst(_.get(dictionnary, lang + ".save"))
                : _.upperFirst(_.get(dictionnary, lang + ".modify"))
              }
            </Button>
          </div>
        </div>

        {/* Modal de changement de la photo */}
        <ModalPhoto
          lang={this.props.lang}
          open={this.state.modalPhoto}
          photo={this.state.photo}
          onClose={() => this.setState({ modalPhoto: false })}
          onModify={photo => {
            this.setState({ photo: photo });
          }}
        />

        {/* Message d'erreur form non valide */}
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

        {/* Message d'erreur Authentification, lockRevision ou Réseau */}
        <ModalMessage 
          open={!_.isNull(this.state.errorType)}
          title={this.state.errorTitle}
          message={this.state.errorMessage}
          type="error"
          onAction={() => {
            if (this.state.errorType === 1) { // lockRevision
              if (this.props.onCancel) {
                this.props.onCancel();
              }
            } else {
              if (this.props.onSignOut) {
                this.props.onSignOut();
              }
            }
          }}
        />
      </React.Fragment>
    )
  }
}

class ModalPhoto extends React.Component {
  static defaultProps = {
    lang: "fr"
  };

  state = {
    photo: this.props.photo
  };

  componentWillReceiveProps(next) {
    this.setState({ photo: next.photo })
  };

  getBase64Image = file => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      //console.log(reader.result);
      this.setState({ photo: reader.result });
    };
    reader.onerror = error => {
      console.log("error " + error);
    };
  };

  render() {
    let lang = _.toUpper(this.props.lang);
    return (
      <React.Fragment>
        <Dialog
          open={this.props.open}
          onClose={() => {
            if (this.props.onClose) {
              this.props.onClose();
            }
          }}
        >
          <MuiDialogTitle disableTypography={true}>
            <Typography
              variant="h6"
              color="primary"
            >
              <strong>
                {_.upperFirst(_.get(dictionnary, lang + ".image"))}
              </strong>
            </Typography>
          </MuiDialogTitle>
          <DialogContent dividers={true}>
            <div
              style={{ textAlign: "center" }}
            >
              <img
                src={
                  _.isEmpty(this.state.photo)
                    ? emptyImage
                    : imageHasPrefix(this.state.photo)
                      ? this.state.photo
                      : "data:image/png;base64," + this.state.photo
                }
                height="auto"
                width="100%"
                alt="Affiche"
              />
            </div>

            <div style={{ marginTop: "10px", display: "flex", justifyContent: "center" }}>
              <IconButton
                onClick={() => {
                  document.getElementById("file").click();
                }}
              >
                <Image />
              </IconButton>
              <IconButton
                onClick={() => this.setState({ photo: "" })}
              >
                <DeleteIcon />
              </IconButton>
            </div>
            <input
              id="file"
              type="file"
              accept="image/*"
              hidden={true}
              onChange={e => {
                if (_.get(e.target.files, "length") !== 0) {
                  let file = _.get(e.target.files, "0");
                  this.getBase64Image(file);
                }
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              color="primary"
              onClick={() => {
                if (this.props.onClose) {
                  this.props.onClose();
                }
              }}
            >
              <strong>
                {_.upperFirst(_.get(dictionnary, lang + ".cancel"))}
              </strong>
            </Button>
            <Button
              color="primary"
              onClick={() => {
                if (this.props.onModify) {
                  this.props.onModify(this.state.photo);
                }
                if (this.props.onClose) {
                  this.props.onClose();
                }
              }}
            >
              <strong>
                {_.upperFirst(_.get(dictionnary, lang + ".modify"))}
              </strong>
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}