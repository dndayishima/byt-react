import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Snackbar,
  TextField,
  Typography
} from "@material-ui/core";

import {
  Add,
  Close,
  Delete
} from "@material-ui/icons";

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

import {
  useHistory,
  useParams
} from "react-router-dom";

import { ModalMessage, ModalPhoto } from "../../lib";
import PriceViewer from "../Price/PriceViewer";
import PriceEditor from "../Price/PriceEditor";

import emptyImage from "../../images/others/empty-image.png";
import { dictionnary } from "../Langs/langs";
import { getValueOfOptionalString, userIsAdmin, userIsSeller } from "../Helpers/Helpers";

const EventEditor = props => {
  // state de l'événement à créer ou à modifier
  const [code, setCode] = useState("");
  const [date, setDate] = useState(moment());
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [prices, setPrices] = useState([]);
  const [tags, setTags] = useState([]);
  const [venue, setVenue] = useState({});
  const [lockRevision, setLockRevision] = useState(null);

  const [modalPhoto, setModalPhoto] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorTitle, setErrorTitle] = useState("");
  const [errorType, setErrorType] = useState(null);
  const [priceToEdit, setPriceToEdit] = useState(null); // si vide {}, c'est la création d'un nouveau prix
  const [priceToEditIndex, setPriceToEditIndex] = useState(null);
  
  // state de chargement
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const history = useHistory();
  const { eventCode } = useParams();

  useEffect(() => {
    if (eventCode) {
      setLoading(true);
      props.client.Event.readByCode(
        props.jwt,
        eventCode,
        result => {
          let event = result.data.event;
          // On permet l'accès à l'éditeur d'événements
          // si l'utilisateur est le créateur de l'événement (donc un SELLER)
          // ou si l'utilisateur est un ADMIN
          if (
            userIsAdmin(props.user.roles) ||
            (userIsSeller(props.user.roles) && event.seller === props.user.code)
          ) {
            setCode(event.code);
            setName(event.name);
            setDescription(_.isEmpty(event.description) ? "" : event.description);
            setTags(_.isEmpty(event.tags) ? [] : event.tags);
            setDate(moment(event.date));
            setVenue(_.isEmpty(event.venue) ? {} : event.venue);
            setPrices(_.get(event, "prices", []));
            setPhoto(_.get(event, "photo", ""));
            setLockRevision(event.lockRevision);
            setLoading(false);
          } else {
            history.push("/plateform/events");
          }
        },
        error => {
          console.log(error);
          history.push("/plateform/events");
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventCode]);

  const handleChangeVenue = (event, name) => {
    let stateVenue = _.isNull(venue) ? {} : _.clone(venue);
    stateVenue[name] = event.target.value;
    setVenue(stateVenue);
  };

  const checkValidity = () => {
    return (!_.isEmpty(name) && !_.isNull(date) && !_.isEmpty(prices));
  };

  const handleError = error => {
    let lang = _.toUpper(props.lang);
    if (_.isUndefined(error)) {
      setErrorType("NETWORK_ERROR");
      setErrorTitle(_.upperFirst(_.get(dictionnary, lang + ".events")));
      setErrorMessage(_.upperFirst(_.get(dictionnary, lang + ".errorMessageNetwork")));
    } else {
      setErrorType("AUTHENTICATION");
      setErrorTitle(_.upperFirst(_.get(dictionnary, lang + ".authentication")));
      setErrorMessage(_.upperFirst(_.get(dictionnary, lang + ".errorMessageAuthentication")));
    }
  };

  // Lors de l'envoie de la requête de modification ou sauvegarde,
  // on met à NULL les champs vides
  const formatedVenue = venue => {
    let formatVenue = venue;
    _.forEach(formatVenue, (value, key) => {
      if (_.isEmpty(value)) {
        _.unset(formatVenue, key);
      }
    });
    return _.isEmpty(formatVenue) ? null : formatVenue;
  };

  // j'arrive ICI
  const update = () => {
    if (!checkValidity()) {
      invalidForm();
      setBtnLoading(false)
      return;
    }

    props.client.Event.readByCode(
      props.jwt,
      code,
      result => {
        let event = result.data.event;
        if (event.lockRevision === lockRevision) {
          let params = {};
          params.id = event.id;
          params.name = name;
          params.date = date.format("YYYY-MM-DDTHH:mm:ss");
          params.description = _.isEmpty(description) ? null : description;
          params.prices = prices;

          let t = _.filter(tags, tag => tag !== "");
          params.tags = _.isEmpty(t) ? null : t;
          params.venue = formatedVenue();
          params.photo = _.isEmpty(photo) ? null : photo;
          
          props.client.Event.update(
            props.jwt,
            params,
            result => {
              history.push("/plateform/events");
            },
            error => {
              handleError(error);
            }
          );
        } else {
          // demander de recharger
          let lang = _.toUpper(props.lang);
          setErrorType("LOCK_REVISION");
          setErrorTitle(_.upperFirst(_.get(dictionnary, lang + ".events")));
          setErrorMessage(_.upperFirst(_.get(dictionnary, lang + ".errorMessageLockRevision")));
        }
      },
      error => {
        //console.log(error);
        handleError(error);
      }
    );
  };

  const save = () => {
    if (!checkValidity()) {
      invalidForm();
      setBtnLoading(false);
      return;
    }

    // mettre les champs vides à NULL
    let formatVenue = () => {
      let stateVenue = venue;
      _.forEach(stateVenue, (value, key) => {
        if (_.isEmpty(value)) {
          stateVenue[key] = null;
        }
      });
      return stateVenue;
    };

    let params = {};
    params.name = name;
    params.date = date.format("YYYY-MM-DDTHH:mm:ss");
    params.prices = prices;
    params.description = _.isEmpty(description) ? null : description;
    
    let t = _.filter(tags, tag => tag !== "");
    params.tags = _.isEmpty(t) ? null : t;
    params.venue = formatVenue();
    params.photo = _.isEmpty(photo) ? null : photo;

    props.client.Event.create(
      props.jwt,
      params,
      result => {
        history.push("/plateform/events");
      },
      error => {
        console.log(error);
        handleError(error);
      }
    );
  };

  const invalidForm = () => {
    let lang = _.toUpper(props.lang);
    setOpenSnackBar(true);
    setErrorMessage(_.upperFirst(_.get(dictionnary, lang + ".invalidForm")));
  };

  const lang = _.toUpper(props.lang);

  // Rendu de l'édition d'un prix
  if (!_.isNull(priceToEdit)) {
    return (
      <PriceEditor
        lang={props.lang}
        price={priceToEdit}
        onCancel={() => {
          setPriceToEdit(null);
          setPriceToEditIndex(null);
        }}
        onChange={price => {
          let statePrices = prices;
          if (_.isNull(priceToEditIndex)) { // nouveau prix
            statePrices.push(price);
          } else {
            statePrices[priceToEditIndex] = price;
          }
          setPrices(statePrices);
          setPriceToEdit(null);
          setPriceToEditIndex(null);
        }}
      />
    )
  }

  if (loading) {
    return (
      <Container maxWidth="md" style={{ marginBottom: "25px" }}>
        <div style={{ textAlign: "center", marginTop: "15px" }}>
          <CircularProgress
            size={25}
          />
        </div>
      </Container>
    );
  }

  return (
    <React.Fragment>
      <Container maxWidth="md" style={{ marginBottom: "15px" }}>
        <Grid container={true} spacing={2} justify="center">
          <Grid item={true} xs={8}>
            <img
              onClick={() => setModalPhoto(true)}
              src={_.isEmpty(photo)? emptyImage : photo} 
              alt="Affiche" 
              height="100%" 
              width="100%"
            />
          </Grid>
          <Grid item={true} xs={12} md={6}>
            <TextField
              disabled={true}
              fullWidth={true}
              label={_.upperFirst(_.get(dictionnary, lang + ".eventCode"))}
              variant="outlined"
              value={code}
            />
          </Grid>
          <Grid item={true} xs={12} md={6}>
            <TextField
              fullWidth={true}
              label={_.upperFirst(_.get(dictionnary, lang + ".eventName"))}
              required={true}
              variant="outlined"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </Grid>
          
          {/* Date + Heure */}
          <MuiPickersUtilsProvider
            utils={DateFnsUtils}
            locale={lang === "en" ? enLocale : frLocale}
          >
            <Grid item={true} xs={12} md={6}>
              <KeyboardDatePicker
                fullWidth={true}
                autoOk={true}
                inputVariant="outlined"
                //format={this.props.lang === "en" ? "MM/dd/yyyy" : "dd/MM/yyyy"}
                format="dd/MM/yyyy"
                label={_.upperFirst(_.get(dictionnary, lang + ".date"))}
                required={true}
                value={date.toDate()}
                onChange={newDate => {
                  let prev = date;
                  if (!_.isNull(newDate) && !_.isNaN(newDate.getDay())) {
                    let selectedDay = moment(newDate);
                    selectedDay.hour(prev.get("hour"));
                    selectedDay.minute(prev.get("minute"));
                    setDate(selectedDay);
                  }
                }}
              />
            </Grid>
            <Grid item={true} xs={12} md={6}>
              <KeyboardTimePicker
                fullWidth={true}
                inputVariant="outlined"
                ampm={lang === "en"}
                label={_.upperFirst(_.get(dictionnary, lang + ".time"))}
                required={true}
                value={date.toDate()}
                onChange={newDate => {
                  let prev = date;
                  if (!_.isNull(newDate) && !_.isNaN(newDate.getDay())) {
                    let selectedTime = moment(newDate);
                    selectedTime.year(prev.get("year"));
                    selectedTime.month(prev.get("month"));
                    selectedTime.date(prev.get("date"));
                    setDate(selectedTime);
                  }
                }}
              />
            </Grid>
          </MuiPickersUtilsProvider>

          {/* Description */}
          <Grid item={true} xs={12}>
            <TextField
              fullWidth={true}
              label={_.upperFirst(_.get(dictionnary, lang + ".description"))}
              multiline={true}
              rowsMax="6"
              variant="outlined"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </Grid>
        </Grid>

        {/* Prix + Places */}
        <Typography variant="h6" style={{ marginTop: "25px", marginBottom: "15px", textAlign: "center" }}>
          <strong>{_.upperFirst(_.get(dictionnary, lang + ".price")) + " *"}</strong>
        </Typography>
        <Grid container={true} spacing={2}>
          {_.map(prices, (price, index) => 
            <Grid item={true} key={index} xs={12} sm={6} md={4}>
              <PriceViewer
                lang={lang}
                edition={true}
                price={price}
                onClickModification={price => {
                  setPriceToEdit(price);
                  setPriceToEditIndex(index);
                }}
              />
            </Grid>
          )}
          <Grid item={true} xs={12} sm={6} md={4} direction="column" justify="center" container={true}>
            <Card style={{ height: "100%"}}>
              <CardContent style={{ textAlign: "center" }}>
                <IconButton
                  onClick={() => {
                    setPriceToEdit({});
                    setPriceToEditIndex(null);
                  }}
                >
                  <Add />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Adresse - Venue */}
        <Typography variant="h6" style={{ marginTop: "25px", marginBottom: "15px", textAlign: "center" }}>
          <strong>{_.upperFirst(_.get(dictionnary, lang + ".venue"))}</strong>
        </Typography>
        <Grid container={true} spacing={2}>
          <Grid item={true} xs={6}>
            <TextField 
              fullWidth={true}
              label={_.upperFirst(_.get(dictionnary, lang + ".numero"))}
              variant="outlined"
              value={
                !_.isNull(venue)
                  ? getValueOfOptionalString(venue.number)
                  : ""
              }
              onChange={e => handleChangeVenue(e, "number")}
            />
          </Grid>
          <Grid item={true} xs={6}>
            <TextField 
              fullWidth={true}
              label={_.upperFirst(_.get(dictionnary, lang + ".road"))}
              variant="outlined"
              value={
                !_.isNull(venue)
                  ? getValueOfOptionalString(venue.road)
                  : ""
              }
              onChange={e => handleChangeVenue(e, "road")}
            />
          </Grid>
          <Grid item={true} xs={6}>
            <TextField 
              fullWidth={true}
              label={_.upperFirst(_.get(dictionnary, lang + ".city"))}
              variant="outlined"
              value={
                !_.isNull(venue)
                  ? getValueOfOptionalString(venue.city)
                  : ""
              }
              onChange={e => handleChangeVenue(e, "city")}
            />
          </Grid>
          <Grid item={true} xs={6}>
            <TextField 
              fullWidth={true}
              label={_.upperFirst(_.get(dictionnary, lang + ".country"))}
              variant="outlined"
              value={
                !_.isNull(venue)
                  ? getValueOfOptionalString(venue.country)
                  : ""
              }
              onChange={e => handleChangeVenue(e, "country")}
            />
          </Grid>
          <Grid item={true} xs={12}>
            <TextField 
              fullWidth={true}
              label={_.upperFirst(_.get(dictionnary, lang + ".details"))}
              variant="outlined"
              value={
                !_.isNull(venue)
                  ? getValueOfOptionalString(venue.details)
                  : ""
              }
              onChange={e => handleChangeVenue(e, "details")}
            />
          </Grid>
        </Grid>
        
        {/* Tags */}
        <Typography variant="h6" style={{ marginTop: "25px", marginBottom: "15px", textAlign: "center" }}>
          <strong>{_.upperFirst(_.get(dictionnary, lang + ".tag"))}</strong>
        </Typography>
        <Grid container={true} spacing={2}>
          {_.map(tags, (tag, index) => 
            <Grid item={true} xs={12} md={4} key={index}>
              <div style={{ display: "flex", flexGrow: 1 }}>
                <TextField 
                  fullWidth={true}
                  label={_.upperFirst(_.get(dictionnary, lang + ".tag"))}
                  name="tag"
                  variant="outlined"
                  value={tag}
                  onChange={e => {
                    let stateTags = _.clone(tags);
                    stateTags[index] = e.target.value;
                    setTags(stateTags);
                  }}
                />
                <IconButton
                  style={{ marginLeft: "8px" }}
                  onClick={() => {
                    let stateTags = _.clone(tags);
                    stateTags.splice(index, 1);
                    setTags(stateTags);
                  }}
                >
                  <Delete />
                </IconButton>
              </div>
            </Grid>  
          )}
        </Grid>

        {/* Button add Tag */}
        <Grid item={true} xs={12} style={{ marginTop: "10px" }}>
          <span style={{ textAlign: "center" }}>
            <Typography variant="body1" gutterBottom={true}>
              {_.upperFirst(_.get(dictionnary, lang + ".tag"))}
              <IconButton
                style={{ marginLeft: "8px" }}
                onClick={() => {
                  let stateTags = _.clone(tags);
                  stateTags.push("");
                  setTags(stateTags);
                }}
              >
                <Add />
              </IconButton>
            </Typography>
          </span>
        </Grid>

        {/* loader */}
        {btnLoading
          ? <Grid container={true} style={{ marginTop: "25px", marginBottom: "25px" }}>
              <Grid item={true} xs={12} style={{ textAlign: "center" }}>
                <CircularProgress
                  size={25}
                />
              </Grid>
            </Grid>
          : null
        }

        {/* Buttons Annuler - Enregistrer - Modifier */}
        <Grid container={true} spacing={1}>
          <Grid item={true} xs={12} md={6}>
            <Button
              variant="contained"
              fullWidth={true}
              size="large"
              onClick={() => {
                history.push("/plateform/events");
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
                setBtnLoading(true);
                if (_.isEmpty(code)) {
                  save();
                } else {
                  update();
                }
              }}
            >
              {_.isEmpty(code)
                ? _.upperFirst(_.get(dictionnary, lang + ".save"))
                : _.upperFirst(_.get(dictionnary, lang + ".modify"))
              }
            </Button>
          </Grid>
        </Grid>
      </Container>

      {/* Modal de changement de la photo */}
      <ModalPhoto
        lang={props.lang}
        open={modalPhoto}
        photo={photo}
        onClose={() => setModalPhoto(false)}
        onModify={photo => setPhoto(photo)}
      />

      {/* Message d'erreur form non valide */}
      <Snackbar 
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
        open={openSnackBar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackBar(false)}
        message={errorMessage}
        action={
          <IconButton
            key="close"
            aria-label="Close"
            onClick={() => setOpenSnackBar(false)}
            color="inherit"
          >
            <Close />
          </IconButton>
        }
      />

      {/* Message d'erreur Authentification, lockRevision ou Réseau */}
      <ModalMessage 
        open={!_.isNull(errorType)}
        title={errorTitle}
        message={errorMessage}
        type="error"
        onAction={() => {
          if (errorType === "LOCK_REVISION" || errorType === "NETWORK_ERROR") { // lockRevision
            history.push("/plateform/events");
          } else if (errorType === "AUTHENTICATION") {
            if (props.onSignOut) {
              props.onSignOut();
            }
          }
        }}
      />
    </React.Fragment>
  );
};

EventEditor.propTypes = {
  client: PropTypes.any.isRequired,
  jwt: PropTypes.string,
  lang: PropTypes.string,
  event: PropTypes.object,
  onEdition: PropTypes.func,
  onCancel: PropTypes.func,
  onSignOut: PropTypes.func,
  user: PropTypes.object
};

EventEditor.defaultProps = {
  event: {},
  lang: "fr"
};

export default EventEditor;