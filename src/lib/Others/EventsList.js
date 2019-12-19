import React from "react";
import PropTypes from "prop-types";

import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  //Divider,
  //Fab,
  Grid,
  //Paper,
  Typography,
  IconButton
} from "@material-ui/core";

import {
  //AccessTime,
  //Bookmarks,
  //DateRange,
  Edit,
  //Place,
  //Search,
  //ShoppingCart
} from "@material-ui/icons";


import emptyIcon from "../../empty-events.png";

import _ from "lodash";

import imageEmpty from "../../image-empty.png";
import avatarImage from "../../favicon_byt.jpg";

import { displayDate, displayTime } from "../Helpers/Helpers";

export default class EventsList extends React.Component {
  static propTypes = {
    events: PropTypes.array,
    lang: PropTypes.string,
    user: PropTypes.object,
    onSelection: PropTypes.func,
    onEdit: PropTypes.func,
    onView: PropTypes.func
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
              <Grid container={true} spacing={1}>
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
                    onView={event => {
                      if (this.props.onView) {
                        this.props.onView(event);
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

  render() {
    let event = this.props.event;
    return (
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardHeader
            avatar={
              <Avatar aria-label="event" variant="square" src={avatarImage} />
            }
            action={
              this.props.user.code === event.seller
                ? <IconButton
                    aria-label="edit"
                    onClick={() => {
                      if (this.props.onEdit) {
                        this.props.onEdit(event);
                      }
                    }}
                  >
                    <Edit />
                  </IconButton>
                : null
            }
            title={event.name}
            subheader={displayDate(event.date, this.props.lang) + " - " + displayTime(event.date, this.props.lang)}
          />
          <CardMedia 
            style={{ height: 0, paddingTop: "56.25%" }}
            image={_.isEmpty(event.photo) ? imageEmpty : event.photo}
            title={event.name}
            onClick={() => {
              if (this.props.onView) {
                this.props.onView(event);
              }
            }}
          />
          <CardContent style={{ paddingBottom: 10, textAlign: "center" }}>
            <Typography variant="body2" color="textSecondary" component="p">
              {event.code}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    );
  }
}