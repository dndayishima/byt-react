import React from "react";
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

import EventsList from "./EventsList";

import { ModalMessage } from "../../lib";
import EventEditor from "./EventEditor";
import EventViewer from "./EventViewer";

import { dictionnary } from "../Langs/langs";

export default class Events extends React.Component {
  static propTypes = {
    client: PropTypes.any.isRequired,
    jwt: PropTypes.string,
    lang: PropTypes.string,
    onSignOut: PropTypes.func,
    user: PropTypes.object,
    cache: PropTypes.array,
    onCacheReload: PropTypes.func
  };

  static defaultProps = {
    lang: "fr"
  };

  state = {
    edit: false,
    selectedEvent: {},
    events: [],
    errorType: null, // 1 : session expirée - 2 : connexion
    errorTitle: "",
    errorMessage: "",
    loading: true,
    switch: "all",
    reloadParams: { sortBy: "date" }, // le plus proche apparaît avant
    // gestion des relecture | cache
    totalEvents: 0,
    totalLoadedEvents: 0
  };

  // si le composant est démonté avant que toutes les promesses soient
  // résolues, celle qui font un setState, provoqueront une erreur dans le 
  // sens où il y aura un setState sur un composant qui n'est pas monté.
  // sur ce genre de promesses, avant de faire un setState, vérifier que le 
  // composant est monté.
  mounted = false;

  componentDidMount() {
    this.mounted = true;
    this.reload(this.state.reloadParams);
  };

  componentWillUnmount() {
    this.mounted = false;
  };

  onSwitch = value => {
    let params = this.state.reloadParams;
    if (value === "myevents") {
      _.set(params, "seller", this.props.user.code);
    } else {
      _.unset(params, "seller");
    }
    this.setState({
      switch: value,
      loading: true,
      reloadParams: params,
      totalLoadedEvents: 0
    });
    this.reload(params);
  };

  // chercher les événements, en demandant des informations assez simplifiées
  reload = params => {
    this.props.client.Event.simpleEvents(
      this.props.jwt,
      params,
      result => {
        this.setState({
          events: result.results.content,
          totalEvents: result.results.numberOfElements,
          loading: _.isEmpty(result.results.content) ? false : this.state.loading
        });
        _.forEach(result.results.content, event => {
          // event in cache
          let eic = _.filter(this.props.cache, e => e.id === event.id)[0];
          if (!eic || eic.lockRevision !== event.lockRevision) {
            this.props.client.Event.read(
              this.props.jwt,
              event.id,
              result => {
                // no perform any setState if component
                // is unmounted
                if (!this.mounted) {
                  return;
                }
                let indexToChange = _.findIndex(this.state.events, ev => ev.id === event.id);
                let events = this.state.events;
                events[indexToChange] = result.data.event;
                if (this.state.totalEvents === (this.state.totalLoadedEvents + 1)) {
                  // recharger dans le cache
                  this.props.onCacheReload(events);
                }
                this.setState({
                  totalLoadedEvents: this.state.totalLoadedEvents + 1,
                  events: events,
                  loading: this.state.totalEvents !== (this.state.totalLoadedEvents + 1)
                });
              },
              error => {
                console.log(error);
              }
            )
          } else {
            let indexToChange = _.findIndex(this.state.events, ev => ev.id === event.id);
            let events = this.state.events;
            events[indexToChange] = eic; // event venant du cash
            if (this.state.totalEvents === (this.state.totalLoadedEvents + 1)) {
              // recharger dans le cache
              this.props.onCacheReload(events);
            }
            this.setState({
              totalLoadedEvents: this.state.totalLoadedEvents + 1,
              events: events,
              loading: this.state.totalEvents !== (this.state.totalLoadedEvents + 1)
            });
          }
        });
      },
      error => {
        if (_.isUndefined(error)) {
          this.authError(2);
        } else {
          this.authError(1);
        }
      }
    );
  };

  authError = errorType => {
    let lang = _.toUpper(this.props.lang);
    this.setState({
      errorType: errorType,
      errorTitle: _.upperFirst(_.get(dictionnary, lang + ".authentication")),
      errorMessage: errorType === 1
        ? _.upperFirst(_.get(dictionnary, lang + ".errorMessageAuthentication"))
        : _.upperFirst(_.get(dictionnary, lang + ".errorMessageNetwork")),
      loading: false
    })
  };

  render () {
    let isSeller = _.includes(this.props.user.roles, "SELLER");

    const editor = (
      <EventEditor
        client={this.props.client}
        jwt={this.props.jwt}
        event={this.state.selectedEvent}
        lang={this.props.lang}
        onEdition={() => {
          this.setState({
            edit: false,
            selectedEvent: {},
            loading: true,
            totalLoadedEvents: 0
          });
          this.reload(this.state.reloadParams);
        }}
        onCancel={() => {
          this.setState({
            edit: false,
            selectedEvent: {},
            loading: true,
            totalLoadedEvents: 0
          });
          this.reload(this.state.reloadParams);
        }}
        onSignOut={() => {
          if (this.props.onSignOut) {
            this.props.onSignOut();
          }
        }}
        user={this.props.user}
      />
    );

    const events = (
      <React.Fragment>
        {isSeller
          ? <Switcher
              lang={this.props.lang}
              value={this.state.switch}
              onChange={value => {
                this.onSwitch(value);
              }}
            />
          : null
        }
        <div style={{ marginTop: "15px" }}>
          <EventsList
            lang={this.props.lang}
            events={this.state.events}
            user={this.props.user}
            onEdit={event => this.setState({ edit: true, selectedEvent: event })}
            onView={event => this.setState({ selectedEvent: event })}
          />
        </div>

        {/* Bouton ajout d'un nouvel événement */}
        {isSeller && this.state.switch === "myevents"
          ? <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}>
              <Fab
                color="primary"
                onClick={() => this.setState({ edit: true, selectedEvent: {} })}
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
        {this.state.loading
          ? <div style={{ textAlign: "center", marginTop: "15px" }}>
              <CircularProgress
                size={25}
              />
            </div>
          : null
        }

        {this.state.edit
          ? editor
          : !_.isEmpty(this.state.selectedEvent)
            ? <EventViewer 
                lang={this.props.lang}
                event={this.state.selectedEvent}
                onCancel={() => {
                  this.setState({
                    edit: false,
                    selectedEvent: {},
                    loading: true,
                    totalLoadedEvents: 0
                  });
                  this.reload(this.state.reloadParams);
                }}
                jwt={this.props.jwt}
                user={this.props.user}
                client={this.props.client}
              />
            : events
        }

        {/* Modal Session expired */}
        <ModalMessage 
          open={!_.isNull(this.state.errorType)}
          title={this.state.errorTitle}
          message={this.state.errorMessage}
          type="error"
          onAction={() => {
            if (this.props.onSignOut) {
              this.props.onSignOut();
            }
          }}
        />
      </React.Fragment>
    )
  }
}


class Switcher extends React.Component {
  static propTypes = {
    lang: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
  };

  static defaultProps = {
    lang: "fr"
  };

  render () {
    let lang = _.toUpper(this.props.lang);
    return (
      <React.Fragment>
        <FormControl variant="outlined" fullWidth={true}>
          <Select
            value={this.props.value}
            onChange={e => {
              if (this.props.onChange) {
                this.props.onChange(e.target.value);
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
  }
}