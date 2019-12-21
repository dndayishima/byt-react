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
import moment from "moment";

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
    onSelection: PropTypes.func,
    user: PropTypes.object
  };

  static defaultProps = {
    lang: "fr"
  };

  state = {
    edit: false, // new
    selectedEvent: {}, // new
    events: [],
    errorType: null, // 1 : session expirée - 2 : connexion
    errorTitle: "",
    errorMessage: "",
    loading: true,
    switch: "all",
    reloadParams: {}
  };

  componentDidMount() {
    this.reload(this.state.reloadParams);
  };

  onSwitch = value => {
    let params = this.state.reloadParams;
    if (value === "myevents") {
      _.set(params, "seller", this.props.user.code);
    } else {
      _.unset(params, "seller");
    }
    this.setState({ switch: value, loading: true, reloadParams: params });
    this.reload(params);
  };

  reload = params => {
    this.props.client.Event.readAll(
      this.props.jwt,
      params,
      result => {
        let res = result.results.content.sort((e1, e2) => {
          if (moment(e1.date).isBefore(moment(e2.date))) {
            return -1;
          } else if (moment(e1.date).isAfter(moment(e2.date))) {
            return 1;
          } else {
            return 0;
          }
        });
        this.setState({
          events: res,
          loading: false
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
          this.setState({ edit: false, selectedEvent: {}, loading: true });
          this.reload(this.state.reloadParams);
        }}
        onCancel={() => {
          this.setState({ edit: false, selectedEvent: {}, loading: true });
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
            onSelection={event => {
              if (this.props.onSelection) {
                this.props.onSelection(event);
              }
            }}
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
        {/* Loader */}
        {this.state.loading
          ? <div style={{ textAlign: "center", marginTop: "40px" }}>
              <CircularProgress />
            </div>
          : <div>
              {this.state.edit
                ? editor
                : !_.isEmpty(this.state.selectedEvent)
                  ? <EventViewer 
                      lang={this.props.lang}
                      event={this.state.selectedEvent}
                      onCancel={() => {
                        this.setState({ edit: false, selectedEvent: {}, loading: true });
                        this.reload(this.state.reloadParams);
                      }}
                      jwt={this.props.jwt}
                      user={this.props.user}
                      client={this.props.client}
                    />
                  : events
              }
            </div>
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