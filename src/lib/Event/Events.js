import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { 
  CircularProgress,
  Fab,
  FormControl, 
  MenuItem,
  OutlinedInput,
  Select
} from "@material-ui/core";

import AddIcon from "@material-ui/icons/Add";

import _ from "lodash";

import {
  Switch,
  Route,
  useHistory,
  useRouteMatch
} from "react-router-dom";

import EventsList from "./EventsList";

import { ModalMessage } from "../../lib";
import EventEditor from "./EventEditor";
import EventViewer from "./EventViewer";

import { dictionnary } from "../Langs/langs";

const Events = props => {
  const [events, setEvents] = useState([]);
  const [errorType, setErrorType] = useState(null);
  const [errorTitle, setErrorTitle] = useState(""); // 1 : session expirée - 2 : connexion
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [switcher, setSwitcher] = useState("all");
  const [reloadParams, setReloadParams] = useState({ sortBy: "date" }); // le plus proche apparaît avant

  const history = useHistory();
  const { path } = useRouteMatch();

  useEffect(() => {
    // force le rechargement des données lorsqu'on revient sur ce 
    // composant en provenance des composants enfants de celui-ci
    if (history.location.pathname === "/plateform/events") {
      reload();
    }
    // le commentaire suivant désactive la vérification par le linter
    // sur les règles de dépendances dans les hooks
    // React Hook useEffect has a missing dependency: 'history.location.pathname'. Either include it or remove the dependency array  react-hooks/exhaustive-deps

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history.location.pathname]);

  useEffect(() => {
    if (loading) {
      let readEvents = arrayEvents => {
        if (_.isEmpty(arrayEvents)) {
          // après relecture de tous les événements, on effectue une
          // mise à jour du cache
          setLoading(false);
          props.onCacheReload(events);
        } else {
          let currentEvent = arrayEvents.shift();
          // event in cache
          let eic = props.cache[
            _.findIndex(props.cache, e => e.id === currentEvent.id)
          ];
          let stateEvents = events;
          let indexToChange = _.findIndex(stateEvents, ev => ev.id === currentEvent.id);
          if (!eic || eic.lockRevision !== currentEvent.lockRevision) {
            props.client.Event.read(
              props.jwt,
              currentEvent.id,
              res => {
                if (indexToChange === -1) {
                  stateEvents.push(res.data.event);
                } else {
                  stateEvents[indexToChange] = res.data.event;
                }
                setEvents(stateEvents);
                readEvents(arrayEvents);
              },
              err => {
                console.log(err);
                readEvents(arrayEvents);
              }
            );
          } else {
            if (indexToChange === -1) {
              stateEvents.push(eic);
            } else {
              stateEvents[indexToChange] = eic;
            }
            setEvents(stateEvents);
            readEvents(arrayEvents);
          }
        }
      };
      readEvents(_.cloneDeepWith(events));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const onSwitch = value => {
    let params = reloadParams;
    if (value === "myevents") {
      _.set(params, "seller", props.user.code);
    } else {
      _.unset(params, "seller");
    }
    _.set(
      params,
      "exfields",
      ["name", "description", "tags", "date", "venue", "seller", "photo"]
    );
    setSwitcher(value);
    setLoading(true);
    setReloadParams(params);
    reload();
  };

  const reload = () => {
    //console.log(props.jwt);
    props.client.Event.readAll(
      props.jwt,
      reloadParams,
      result => {
        setEvents(result.results.content);
        setLoading(true);
      },
      error => {
        console.log(error);
        if (_.isUndefined(error)) {
          authError(2);
        } else {
          authError(1);
        }
      }
    );
  };

  const authError = errorType => {
    let lang = _.toUpper(props.lang);
    setErrorType(errorType);
    setErrorTitle(_.upperFirst(_.get(dictionnary, lang + ".authentication")));
    setErrorMessage(
      errorType === 1
        ? _.upperFirst(_.get(dictionnary, lang + ".errorMessageAuthentication"))
        : _.upperFirst(_.get(dictionnary, lang + ".errorMessageNetwork"))
    );
    setLoading(false);
  };

  const isSeller = _.includes(_.get(props.user, "roles", []), "SELLER");

  const editor = (
    <EventEditor
      client={props.client}
      jwt={props.jwt}
      lang={props.lang}
      onSignOut={() => {
        if (props.onSignOut) {
          props.onSignOut();
        }
      }}
      user={props.user}
    />
  );

  const eventsComponent = (
    <React.Fragment>
      {isSeller
        ? <Switcher
            lang={props.lang}
            value={switcher}
            onChange={value => {
              onSwitch(value);
            }}
          />
        : null
      }
      <div style={{ marginTop: "15px" }}>
        <EventsList
          lang={props.lang}
          events={events}
          user={props.user}
          onEdit={eventCode => {
            history.push(`${path}/editor/${eventCode}`);
          }}
          onView={eventCode => {
            history.push(`${path}/reader/${eventCode}`);
          }}
        />
      </div>

      {/* Bouton ajout d'un nouvel événement */}
      {isSeller && switcher === "myevents"
        ? <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}>
            <Fab
              color="primary"
              onClick={() => history.push(`${path}/editor`)}
            >
              <AddIcon />
            </Fab>
          </div>
        : null
      }
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <Switch>
        <Route exact={true} path={path}>
          <React.Fragment>
            {loading
              ? <div style={{ textAlign: "center", marginTop: "15px" }}>
                  <CircularProgress
                    size={25}
                  />
                </div>
              : null
            }
            {eventsComponent}
          </React.Fragment>
        </Route>
        <Route path={`${path}/reader/:eventCode`}>
          <EventViewer 
            lang={props.lang}
            jwt={props.jwt}
            user={props.user}
            client={props.client}
          />
        </Route>
        <Route exact={true} path={`${path}/editor`}>
          {editor}
        </Route>
        <Route path={`${path}/editor/:eventCode`}>
          {editor}
        </Route>
      </Switch>

      {/* Modal Session expired */}
      <ModalMessage 
        open={!_.isNull(errorType)}
        title={errorTitle}
        message={errorMessage}
        type="error"
        onAction={() => {
          if (props.onSignOut) {
            props.onSignOut();
          }
        }}
      />
    </React.Fragment>
  )
};

Events.propTypes = {
  client: PropTypes.any.isRequired,
  jwt: PropTypes.string,
  lang: PropTypes.string,
  onSignOut: PropTypes.func,
  user: PropTypes.object,
  cache: PropTypes.array,
  onCacheReload: PropTypes.func
};

Events.defaultProps = {
  lang: "fr"
};

export default Events;


const Switcher = props => {
  const lang = _.toUpper(props.lang);
  return (
    <React.Fragment>
      <FormControl variant="outlined" fullWidth={true}>
        <Select
          value={props.value}
          onChange={e => {
            if (props.onChange) {
              props.onChange(e.target.value);
            }
          }}
          input={<OutlinedInput />}
        >
          <MenuItem value="all">
            {_.upperFirst(_.get(dictionnary, lang + ".allEvents"))}
          </MenuItem>
          <MenuItem value="myevents">
            {_.upperFirst(_.get(dictionnary, lang + ".myEvents"))}
          </MenuItem>
        </Select>
      </FormControl>
    </React.Fragment>
  )
};

Switcher.propTypes = {
  lang: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
};

Switcher.defaultProps = {
  lang: "fr"
};