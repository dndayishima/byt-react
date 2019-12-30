import React from "react";
import PropTypes from "prop-types";

import {
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Tab,
  Tabs,
  Typography
} from "@material-ui/core";

import {
  Event,
  Timeline,
  Search
} from "@material-ui/icons";

import _ from "lodash";

import { ModalMessage } from "../../lib";
import StatisticsView from "./StatisticsView";

import {
  displayDate,
  displayTime,
  userIsSeller,
  userIsAdmin,
  userIsTech,
  signOut
} from "../Helpers/Helpers";
import { dictionnary } from "../Langs/langs";
import bytImage from "../../favicon_byt.jpg";

export default class Statistics extends React.Component {
  static propTypes = {
    client: PropTypes.any.isRequired,
    jwt: PropTypes.string,
    user: PropTypes.object,
    lang: PropTypes.string,
    cache: PropTypes.array
  };

  static defaultProps = {
    lang: "fr"
  };

  state = {
    tab: userIsSeller(this.props.user.roles) ? "myevents" : "search",
    events: [],
    selectedEvent: {},
    reloadParams: { sortBy: "date" },
    totalEvents: 0,
    totalLoadedEvents: 0,
    loading: false,
    // gestion d'erreurs
    errorMessage: "",
    errorType: null
  };

  mounted = false;

  componentDidMount() {
    this.mounted = true;
    let params = this.state.reloadParams;
    if (this.state.tab === "myevents") {
      _.set(params, "seller", this.props.user.code);
      this.reload(params);
    } else {
      _.unset(params, "seller");
    }
    this.setState({
      reloadParams: params
    });
  };

  componentWillUnmount() {
    this.mounted = false;
  };

  reload = params => {
    this.setState({ loading: true });
    this.props.client.Event.simpleEvents(
      this.props.jwt,
      params,
      result => {
        //console.log(result.results.content);
        this.setState({
          events: result.results.content,
          totalEvents: result.results.numberOfElements
        });
        _.forEach(result.results.content, event => {
          // event in cache
          let eic = _.filter(this.props.cache, e => e.id === event.id)[0];
          if (!eic || eic.lockRevision !== event.lockRevision) {
            // on fait un read sans photo (photo pas nécessaire)
            this.props.client.Event.readByCodeSimple(
              this.props.jwt,
              event.code,
              result => {
                //console.log(result);
                // no perform any setState if component
                // is unmounted
                if (!this.mounted) {
                  return;
                }
                let indexToChange = _.findIndex(this.state.events, ev => ev.id === event.id);
                let events = this.state.events;
                events[indexToChange] = result.data.event;
                this.setState({
                  totalLoadedEvents: this.state.totalLoadedEvents + 1,
                  events: events,
                  loading: this.state.totalEvents !== (this.state.totalLoadedEvents + 1)
                });
              },
              error => {
                console.log(error);
              }
            );
          } else {
            // relecture dans le cache
            let indexToChange = _.findIndex(this.state.events, ev => ev.id === event.id);
            let events = this.state.events;
            events[indexToChange] = eic; // event venant du cache
            this.setState({
              totalLoadedEvents: this.state.totalLoadedEvents + 1,
              events: events,
              loading: this.state.totalEvents !== (this.state.totalLoadedEvents + 1)
            })
          }
        });
      },
      error => {
        let lang = _.toUpper(this.props.lang);
        if (_.isUndefined(error)) {
          // réseau
          this.setState({
            errorType: 1,
            errorMessage: _.upperFirst(_.get(dictionnary, lang + ".errorMessageNetwork")),
            loading: false
          });
        }
        if (error.status === 419) {
          this.setState({
            errorType: error.status,
            errorMessage: _.upperFirst(_.get(dictionnary, lang + ".errorOccurredMessage")),
            loading: false
          });
        }
        if (error.status === 401) {
          this.setState({
            errorType: error.status,
            errorMessage: _.upperFirst(_.get(dictionnary, lang + ".errorMessageAuthentication")),
            loading: false
          });
        }
      }
    );
  };



  render() {
    const lang = _.toUpper(this.props.lang);
    return (
      <React.Fragment>
        <Container maxWidth="md">
          {/* sections */}
          <Tabs
            value={this.state.tab}
            onChange={(e, tab) => {
              if (tab === "myevents") {
                this.setState({ tab: tab, selectedEvent: {} });
              } else {
                this.setState({ tab: tab });
              }
            }}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            style={{ marginBottom: "15px" }}
          >
            {userIsSeller(this.props.user.roles)
              ? <Tab 
                  label={
                    <Event />
                  }
                  value="myevents"
                />
              : null
            }
            {userIsAdmin(this.props.user.roles) || userIsTech(this.props.user.roles)
              ? <Tab
                  label={<Search />}
                  value="search"
                />
              : null
            }
            <Tab 
              label={
                <Timeline />
              }
              value="statistics"
              disabled={_.isEmpty(this.state.selectedEvent)}
            />
          </Tabs>

          {this.state.tab === "myevents"
            ? <React.Fragment>
                {/* loader */}
                {this.state.loading
                  ? <Grid container={true} style={{ marginTop: "25px", marginBottom: "25px" }}>
                      <Grid item={true} xs={12} style={{ textAlign: "center" }}>
                        <CircularProgress
                          size={25}
                        />
                      </Grid>
                    </Grid>
                  : null
                }
                {/* affichage des events */}
                {_.isEmpty(this.state.events)
                  ? <div style={{ textAlign: "center", marginTop: "40px", marginBottom: "40px" }}>
                      <img src={bytImage} alt="no events" />
                    </div>
                  : <Grid container={true} spacing={1}>
                      {_.map(this.state.events, (event, i) => 
                        <Grid item={true} xs={12} sm={4} key={i}>
                          <Card>
                            <CardContent
                              style={{ paddingBottom: 10, textAlign: "center" }}
                              onClick={() => {
                                this.setState({
                                  selectedEvent: event,
                                  tab: "statistics"
                                });
                              }}
                            >
                              <Typography variant="body2" color="textSecondary">
                                {event.name}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {displayDate(event.date, this.props.lang) + " - " + displayTime(event.date, this.props.lang)}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {event.code}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      )}
                    </Grid>
                }
              </React.Fragment>
            : null
          }

          {this.state.tab === "statistics"
            ? <React.Fragment>
                <StatisticsView
                  client={this.props.client}
                  jwt={this.props.jwt}
                  lang={this.props.lang}
                  event={this.state.selectedEvent}
                />
              </React.Fragment>
            : null
          }
        </Container>

        {/* messages d'erreurs */}
        <ModalMessage 
          open={!_.isNull(this.state.errorType)}
          title={
            this.state.errorType !== 401
              ? _.upperFirst(_.get(dictionnary, lang + ".statistics"))
              : _.upperFirst(_.get(dictionnary, lang + ".authentication"))
          }
          message={this.state.errorMessage}
          type="error"
          onAction={() => {
            if (this.state.errorType === 401) {
              signOut();
            } else {
              this.setState({
                errorMessage: "",
                errorType: null
              })
            }
          }}
        />
      </React.Fragment>
    )
  }
}