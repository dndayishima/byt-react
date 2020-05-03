import React, { useState, useEffect } from "react";
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

import { Event, Timeline } from "@material-ui/icons";
import _ from "lodash";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { ModalMessage } from "..";
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
import bytImage from "../../images/favicon/favicon_byt.jpg";

const Statistics = props => {
  const [events, setEvents] = useState([]);
  const [reloadParams, setReloadParams] = useState({ sortBy: "date" });
  const [loading, setLoading] = useState(false);
  // gestion d'erreurs
  const [errorMessage, setErrorMessage] = useState("");
  const [errorType, setErrorType] = useState(null);

  const history = useHistory();
  const { eventCode } = useParams();
  const { path } = useRouteMatch();
  
  useEffect(() => {
    if (
      !userIsSeller(props.user.roles) &&
      !userIsTech(props.user.roles) &&
      !userIsAdmin(props.user.roles)
    ) {
      history.push("/plateform/events");
    } else if (!eventCode) {
      reloadEvents();
    }
      
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventCode]);

  useEffect(() => {
    if (loading) {
      let readEvents = arrayEvents => {
        if (_.isEmpty(arrayEvents)) {
          setLoading(false);
        } else {
          let currentEvent = arrayEvents.shift();
          let eic = props.cache[
            _.findIndex(props.cache, e => e.id === currentEvent.id)
          ];
          let stateEvents = events;
          let indexToChange = _.findIndex(stateEvents, ev => ev.id === currentEvent.id);
          if (!eic || eic.lockRevision !== currentEvent.lockRevision) {
            // on fait un read sans photo (photo pas nécessaire)
            props.client.Event.readByCodeSimple(
              props.jwt,
              currentEvent.code,
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
            // relecture dans le cache
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

  const reloadEvents = () => {
    let params = reloadParams;
    _.set(params, "seller", props.user.code);
    setReloadParams(params);
    props.client.Event.simpleEvents(
      props.jwt,
      params,
      result => {
        //console.log(result);
        setEvents(result.results.content);
        setLoading(true);
      },
      error => {
        console.log(error);
        let lang = _.toUpper(props.lang);
        if (_.isUndefined(error)) {
          // réseau
          setErrorType(1);
          setErrorMessage(_.upperFirst(_.get(dictionnary, lang + ".errorMessageNetwork")));
          setLoading(false);
        }
        if (error.status === 419) {
          setErrorType(error.status);
          setErrorMessage(_.upperFirst(_.get(dictionnary, lang + ".errorOccurredMessage")));
          setLoading(false);
        }
        if (error.status === 401) {
          setErrorType(error.status);
          setErrorMessage(_.upperFirst(_.get(dictionnary, lang + ".errorMessageAuthentication")));
          setLoading(false);
        }
      }
    );
  };

  const lang = _.toUpper(props.lang);

  return (
    <React.Fragment>
      <Container maxWidth="md">
        {/* sections */}
        <Tabs
          value={eventCode ? "statistics" : "myevents"}
          onChange={(e, tab) => {
            if (tab === "myevents") {
              history.push("/plateform/statistics");
            }
          }}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          style={{ marginBottom: "15px" }}
        >
          <Tab 
            label={
              <Event />
            }
            value="myevents"
          />
          <Tab 
            label={
              <Timeline />
            }
            value="statistics"
            disabled={_.isEmpty(eventCode)}
          />
        </Tabs>

        {!eventCode
          ? <React.Fragment>
              {/* loader */}
              {loading
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
              {_.isEmpty(events)
                ? <div style={{ textAlign: "center", marginTop: "40px", marginBottom: "40px" }}>
                    <img src={bytImage} alt="no events" />
                  </div>
                : <Grid container={true} spacing={1}>
                    {_.map(events, (event, i) => 
                      <Grid item={true} xs={12} sm={4} key={i}>
                        <Card>
                          <CardContent
                            style={{ paddingBottom: 10, textAlign: "center" }}
                            onClick={() => {
                              history.push(`${path}/${event.code}`);
                            }}
                          >
                            {!event.name || !event.date
                              ? <React.Fragment>
                                  <CircularProgress size={25}/>
                                </React.Fragment>
                              : <React.Fragment>
                                  <Typography variant="body2" color="textSecondary">
                                    {event.name}
                                  </Typography>
                                  <Typography variant="body2" color="textSecondary">
                                    {displayDate(event.date, props.lang) + " - " + displayTime(event.date, props.lang)}
                                  </Typography>
                                </React.Fragment>
                            }
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

        {eventCode
          ? <React.Fragment>
              <StatisticsView
                client={props.client}
                jwt={props.jwt}
                lang={props.lang}
                eventCode={eventCode}
                //event={this.state.selectedEvent}
              />
            </React.Fragment>
          : null
        }
      </Container>

      {/* messages d'erreurs */}
      <ModalMessage 
        open={!_.isNull(errorType)}
        title={
          errorType !== 401
            ? _.upperFirst(_.get(dictionnary, lang + ".statistics"))
            : _.upperFirst(_.get(dictionnary, lang + ".authentication"))
        }
        message={errorMessage}
        type="error"
        onAction={() => {
          if (errorType === 401) {
            signOut();
          } else {
            setErrorMessage("");
            setErrorType(null);
          }
        }}
      />
    </React.Fragment>
  )
};

Statistics.propTypes = {
  client: PropTypes.any.isRequired,
  jwt: PropTypes.string,
  user: PropTypes.object,
  lang: PropTypes.string,
  cache: PropTypes.array
};

Statistics.defaultProps = {
  lang: "fr"
};

export default Statistics;