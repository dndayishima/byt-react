import React from "react";
import PropTypes from "prop-types";

import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Divider,
  Fab,
  Grid,
  Paper,
  Typography
} from "@material-ui/core";

import {
  AccessTime,
  Bookmarks,
  DateRange,
  Edit,
  Place,
  Search,
  ShoppingCart
} from "@material-ui/icons";


import emptyIcon from "../../empty-events.png";

import _ from "lodash";
import moment from "moment";

//import { truncateString } from "../Helpers/Helpers";
import imageEmpty from "../../image-empty.png";
import avatarImage from "../../favicon_byt.jpg";

export default class EventsList extends React.Component {
  static propTypes = {
    events: PropTypes.array,
    lang: PropTypes.string,
    user: PropTypes.object,
    onSelection: PropTypes.func,
    onEdit: PropTypes.func
  };
  static defaultProps = {
    lang: "fr"
  };
  render() {
    return (
      <React.Fragment>
        {_.isEmpty(this.props.events)
          ? <div style={{ textAlign: "center", marginTop: "40px", marginBottom: "40px" }}>
              <img src={emptyIcon} alt="no events" height="80" width="auto" />
            </div>
          : <Container maxWidth="lg">
              <Grid container spacing={1}>
                {_.map(this.props.events, (event, i) => 
                  <Event
                    key={i}
                    event={event}
                    lang={this.props.lang}
                    user={this.props.user}
                    onSelection={event => {
                      if (this.props.onSelection) {
                        this.props.onSelection(event);
                      }
                    }}
                    onEdit={event => {
                      if (this.props.onEdit) {
                        this.props.onEdit(event);
                      }
                    }}
                  />
                )}
              </Grid>
            </Container>
        }
      </React.Fragment>
    );
  }
}

class Event extends React.Component {
  tagsToString = array => {
    let str = "";
    _.forEach(array, (tag, i) => {
      if (i === array.length - 1) {
        str +=  _.upperFirst(tag);
      } else {
        str += _.upperFirst(tag) + " / ";
      }
    });
    return str;
  };

  dispayDate = date => {
    if (this.props.lang === "en") {
      return moment(date).format("MM/DD/YYYY");
    }
    return moment(date).format("DD/MM/YYYY")
  };

  displayTime = date => {
    if (this.props.lang === "en") {
      return moment(date).format("LT");
    }
    return moment(date).format("HH:mm");
  };

  render() {
    let event = this.props.event;
    console.log(event);
    return (
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardHeader
            avatar={
              <Avatar aria-label="event" variant="square" src={avatarImage} />
            }
            title={event.name}
            subheader={this.dispayDate(event.date) + " - " + this.displayTime(event.date)}
          />
          <CardMedia 
            style={{ height: 0, paddingTop: "56.25%" }}
            image={_.isEmpty(event.photo) ? imageEmpty : event.photo}
            title={event.name}
          />
          <CardContent style={{ paddingBottom: 10 }}>
            {/*{!_.isEmpty(event.description)
              ? <Typography variant="body2" color="textSecondary" component="p">
                  {truncateString(event.description, 150)}
                </Typography>
              : null
            }*/}
            {/*{!_.isEmpty(event.description)
              ? <Divider style={{ marginTop: "5px", marginBottom: "5px" }}/>
              : null
            }*/}
            <Typography variant="body2" color="textSecondary" component="p">
              {event.code}
            </Typography>
            {/*{!_.isEmpty(event.tags)
              ? <Typography variant="body2" color="textSecondary">
                  {truncateString(this.tagsToString(event.tags), 50)}
                </Typography>
              : null
            }*/}
          </CardContent>
        </Card>
      </Grid>
    );
  }
}

class Eventeee extends React.Component {
  tagsToString = array => {
    let str = "";
    _.forEach(array, (tag, i) => {
      if (i === array.length - 1) {
        str +=  _.upperFirst(tag);
      } else {
        str += _.upperFirst(tag) + " / ";
      }
    });
    return str;
  };

  

  render () {
    let event = this.props.event;
    return (
      <React.Fragment>
        <Paper
          style={{
            paddingLeft: "1%",
            paddingRight: "1%",
            paddingTop: "5px",
            paddingBottom: "5px"
          }}
        >
          <div style={{ display: "flex" }}>
            <Typography style={{ flexGrow: 1 }} color="primary">
              <strong>{_.toUpper(event.name)}</strong>
            </Typography>
            <Typography color="primary">
              <strong>
                {/*<u>
                  {this.props.lang === "en"
                    ? Number(event.price).toLocaleString("en-EN")
                    : Number(event.price).toLocaleString("fr-FR")
                  }
                </u>*/}
              </strong>
            </Typography>
          </div>
          {!event.photo
            ? null
            : <div style={{ paddingTop: "10px", paddingBottom: "5px", display: "flex" }}>
                <img src={"data:image/png;base64," + event.photo} alt="Affiche" height="150" width="auto"/>
              </div>
          }
          {event.description
            ? <div style={{ marginTop: "10px", minHeight: "70px" }}>
                <Typography color="textSecondary">
                  {event.description}
                </Typography>
              </div>
            : null
          }
          
          <div style={{ display: "flex", marginTop: "10px" }}>
            <div style={{ flexGrow: 1 }}>

              {/* code de l'événement */}
              <div style={{ marginTop: "5px", display: "flex" }}>
                <Bookmarks />
                <Typography color="textSecondary" style={{ paddingLeft: "10px"}}>
                  <strong>{event.code}</strong>
                </Typography>
              </div>

              {/* date de l'évenement */}
              <div style={{ marginTop: "5px", display: "flex" }}>
                <DateRange />
                <Typography color="textSecondary" style={{ paddingLeft: "10px"}}>
                  {this.props.lang === "en"
                    ? moment(event.date).format("MM/DD/YYYY")
                    : moment(event.date).format("DD/MM/YYYY")
                  }
                </Typography>
              </div>

              {/* Heure */}
              <div style={{ marginTop: "5px", display: "flex" }}>
                <AccessTime />
                <Typography color="textSecondary" style={{ paddingLeft: "10px"}}>
                  {this.props.lang === "en"
                    ? moment(event.date).format("LT")
                    : moment(event.date).format("HH:mm")
                  }
                </Typography>
              </div>

              {/* Venue */}
              <div style={{ marginTop: "5px", display: "flex" }}>
                <Place />
                <Typography color="textSecondary" style={{ paddingLeft: "10px"}}>
                  {/*{_.isEmpty(event.venue)
                    ? " -"
                    : event.venue
                  }*/}
                </Typography>
              </div>
            </div>

            {/* Ici le bouton */}
            <div style={{ marginTop: "30px", paddingRight: "1%" }}>
              <Fab
                color="primary"
                onClick={() => {
                  if (this.props.user.code === event.seller) { // modification
                    if (this.props.onEdit) {
                      this.props.onEdit(event);
                    }
                  } else {
                    if (this.props.onSelection) {
                      this.props.onSelection(event);
                    }
                  }
                }}
              >
                {this.props.user.code === event.seller
                  ? <Edit />
                  : <ShoppingCart />
                }
                
              </Fab>
            </div>
          </div>

          {!_.isEmpty(event.tags)
            ? <div>
                <Divider style={{ marginTop: "5px", marginBottom: "5px" }}/>
                <Typography color="textSecondary">
                  <Search style={{ verticalAlign: "middle" }}/> {this.tagsToString(event.tags)}
                </Typography>
              </div>
            : null
          }
        </Paper>
      </React.Fragment>
    )
  }
}