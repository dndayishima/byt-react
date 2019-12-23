import React from "react";
import PropTypes from "prop-types";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
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

import BuyTicket from "./BuyTicket";
import PriceViewer from "./PriceViewer";

import { dictionnary } from "../Langs/langs";
import { displayDate, displayTime } from "../Helpers/Helpers";

const styles = {
  cardHeader: {
    backgroundColor: "#EEEEEE"
  }
}
export default class EventViewer extends React.Component {
  static propTypes = {
    client: PropTypes.any.isRequired,
    jwt: PropTypes.string,
    lang: PropTypes.string,
    event: PropTypes.object,
    user: PropTypes.object,
    onCancel: PropTypes.func
  };
  static defaultProps = {
    lang: "fr"
  };

  state = {
    buyTicket: false,
    selectedPrice: {}
  };

  render () {
    const event = this.props.event;
    const lang = _.toUpper(this.props.lang);
    
    if (this.state.buyTicket) {
      return (
        <React.Fragment>
          <BuyTicket
            client={this.props.client}
            jwt={this.props.jwt}
            lang={this.props.lang}
            event={this.props.event}
            price={this.state.selectedPrice}
            onCancel={() => {
              this.setState({ buyTicket: false, selectedPrice: {} });
            }}
          />
        </React.Fragment>
      )
    }

    return (
      <React.Fragment>
        <Container maxWidth="md" style={{ marginBottom: "25px" }}>
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
                    {displayDate(event.date, this.props.lang) + " - " + displayTime(event.date, this.props.lang)}
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
                  lang={this.props.lang}
                  edition={false}
                  price={price}
                  buy={event.seller !== this.props.user.code}
                  onClickBuy={p => {
                    if (_.isEmpty(p.id)) {
                      return;
                    }
                    this.setState({
                      buyTicket: true,
                      selectedPrice: p
                    });
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
                  if (this.props.onCancel) {
                    this.props.onCancel();
                  }
                }}
              >
                {_.upperFirst(_.get(dictionnary, lang + ".cancel"))}
              </Button>
            </Grid>
          </Grid>
        </Container>
      </React.Fragment>
    );
  }
}