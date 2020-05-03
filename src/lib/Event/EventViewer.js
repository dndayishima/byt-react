import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Grid,
  Typography
} from "@material-ui/core";

import {
  Category,
  DateRange,
  Event,
  EventNote,
  PersonOutline,
  Place
} from "@material-ui/icons";

import _ from "lodash";

import {
  useHistory,
  useParams
} from "react-router-dom";

import BuyTicket from "../Others/BuyTicket";
import PriceViewer from "../Price/PriceViewer";

import { dictionnary } from "../Langs/langs";
import { displayDate, displayTime, userIsAdmin } from "../Helpers/Helpers";

const styles = {
  cardHeader: {
    backgroundColor: "#EEEEEE"
  }
}
const EventViewer = props => {
  const [event, setEvent] = useState({});
  const [buyTicket, setBuyTicket] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState({});
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const { eventCode } = useParams();

  useEffect(() => {
    setLoading(true);
    props.client.Event.readByCode(
      props.jwt,
      eventCode,
      result => {
        //console.log(result);
        setEvent(result.data.event);
        setLoading(false);
      },
      error => {
        console.log(error);
        history.push("/plateform/events");
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lang = _.toUpper(props.lang);
  
  if (buyTicket) {
    return (
      <React.Fragment>
        <BuyTicket
          client={props.client}
          jwt={props.jwt}
          lang={props.lang}
          event={event}
          price={selectedPrice}
          onCancel={() => {
            setBuyTicket(false);
            setSelectedPrice({});
          }}
        />
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      <Container maxWidth="md" style={{ marginBottom: "25px" }}>
        {loading
          ? <div style={{ textAlign: "center", marginTop: "15px" }}>
              <CircularProgress
                size={25}
              />
            </div>
          : null
        }

        {!_.isEmpty(event)
          ? <React.Fragment>
              {!_.isEmpty(event.photo)
                ? <Grid container={true} spacing={2} justify="center">
                    <Grid item={true} xs={12} md={10}>
                      <img
                        src={event.photo}
                        alt="Affiche"
                        height="100%"
                        width="100%"
                      />
                    </Grid>
                  </Grid>
                : null
              }

              <Grid container={true} spacing={2}>
                <Grid item={true} xs={12}>
                  <Card>
                    <CardHeader 
                      title={
                        <EventNote 
                          color="primary"
                          style={{ fontSize: 25 }}
                        />
                      }
                      titleTypographyProps={{ align: "center" }}
                      style={styles.cardHeader}
                    />
                    <CardContent style={{ textAlign: "center" }}>
                      <Typography variant="body1" color="textSecondary">
                        <strong>{event.name}</strong>
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Grid container={true} spacing={2}>
                <Grid item={true} xs={12} sm={4}>
                  <Card>
                    <CardHeader 
                      title={
                        <Event 
                          color="primary"
                          style={{ fontSize: 25 }}
                        />
                      }
                      titleTypographyProps={{ align: "center" }}
                      style={styles.cardHeader}
                    />
                    <CardContent style={{ textAlign: "center" }}>
                      <Typography variant="body1" color="textSecondary">
                        {event.code}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item={true} xs={12} sm={4}>
                  <Card>
                    <CardHeader 
                      title={
                        <DateRange 
                          color="primary"
                          style={{ fontSize: 25 }}
                        />
                      }
                      titleTypographyProps={{ align: "center" }}
                      style={styles.cardHeader}
                    />
                    <CardContent style={{ textAlign: "center" }}>
                      <Typography variant="body1" color="textSecondary">
                        {displayDate(event.date, props.lang) + " - " + displayTime(event.date, props.lang)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item={true} xs={12} sm={4}>
                  <Card>
                    <CardHeader 
                      title={
                        <PersonOutline 
                          color="primary"
                          style={{ fontSize: 25 }}
                        />
                      }
                      titleTypographyProps={{ align: "center" }}
                      style={styles.cardHeader}
                    />
                    <CardContent style={{ textAlign: "center" }}>
                      <Typography variant="body1" color="textSecondary">
                        {event.seller}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {!_.isEmpty(event.description)
                  ? <Grid item={true} xs={12}>
                      <Card>
                        <CardContent>
                          <Typography variant="body1" color="textSecondary">
                            {event.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  : null
                }
              </Grid>

              {/* Prix + Places */}
              <Typography variant="h6" style={{ marginTop: "25px", marginBottom: "15px", textAlign: "center" }}>
                <strong>{_.upperFirst(_.get(dictionnary, lang + ".price"))}</strong>
              </Typography>

              <Grid container={true} spacing={2}>
                {_.map(event.prices, (price, index) => 
                  <Grid item={true} key={index} xs={12} sm={6} md={4}>
                    <PriceViewer 
                      lang={props.lang}
                      edition={false}
                      price={price}
                      buy={userIsAdmin(props.user.roles) || event.seller !== props.user.code}
                      onClickBuy={p => {
                        if (_.isEmpty(p.id)) {
                          return;
                        }
                        setBuyTicket(true);
                        setSelectedPrice(p);
                      }}
                    />
                  </Grid>
                )}
              </Grid>

              {/* Adresse - Venue */}
              {!_.isNull(event.venue)
                ? <React.Fragment>
                    <Typography variant="h6" style={{ marginTop: "25px", marginBottom: "15px", textAlign: "center" }}>
                      <strong>{_.upperFirst(_.get(dictionnary, lang + ".venue"))}</strong>
                    </Typography>
                    <Grid container={true}>
                      <Grid item={true} xs={12}>
                        <Card>
                          <CardHeader 
                            title={
                              <Place 
                                color="primary"
                                style={{ fontSize: 25 }}
                              />
                            }
                            titleTypographyProps={{ align: "center" }}
                            style={styles.cardHeader}
                          />
                          <CardContent style={{ textAlign: "center" }}>
                            <Typography variant="body1" color="textSecondary">
                              {!_.isEmpty(event.venue.number)
                                ? "N° " + event.venue.number + ", "
                                : null
                              }
                              {!_.isEmpty(event.venue.road)
                                ? event.venue.road
                                : null
                              }
                            </Typography>
                            {!_.isEmpty(event.venue.details)
                              ? <Typography variant="body1" color="textSecondary">
                                  {event.venue.details}
                                </Typography>
                              : null
                            }
                            <Typography variant="body1" color="textSecondary">
                              {!_.isEmpty(event.venue.city)
                                ? _.toUpper(event.venue.city) + ", "
                                : null
                              }
                              {!_.isEmpty(event.venue.country)
                                ? _.toUpper(event.venue.country)
                                : null
                              }
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </React.Fragment>
                : null
              }

              {/* tags */}
              {!_.isEmpty(event.tags)
                ? <React.Fragment>
                    <Typography variant="h6" style={{ marginTop: "25px", marginBottom: "15px", textAlign: "center" }}>
                      <strong>{_.upperFirst(_.get(dictionnary, lang + ".tag"))}</strong>
                    </Typography>
                    <Grid container={true}>
                      <Grid item={true} xs={12}>
                        <Card>
                          <CardHeader 
                            title={
                              <Category 
                                color="primary"
                                style={{ fontSize: 25 }}
                              />
                            }
                            titleTypographyProps={{ align: "center" }}
                            style={styles.cardHeader}
                          />
                          <CardContent style={{ textAlign: "center" }}>
                            <Typography variant="body1" color="textSecondary">
                              {_.map(event.tags, (tag, index) => {
                                let t = _.toUpper(tag);
                                if (index === event.tags.length - 1) {
                                  return t;
                                } else {
                                  return t + ", "
                                }
                              })}
                            </Typography>
                            
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </React.Fragment>
                : null
              }

              {/* Button Annuler */}
              <Grid container={true} spacing={1} justify="center" style={{ marginTop: "30px" }}>
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
              </Grid>
            </React.Fragment>
          : null
        }
      </Container>
    </React.Fragment>
  );
};

EventViewer.propTypes = {
  client: PropTypes.any.isRequired,
  jwt: PropTypes.string,
  lang: PropTypes.string,
  user: PropTypes.object
};

EventViewer.defaultProps = {
  lang: "fr"
};

export default EventViewer;