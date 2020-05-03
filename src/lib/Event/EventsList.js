import React from "react";
import PropTypes from "prop-types";

import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Grid,
  Typography,
  IconButton
} from "@material-ui/core";

import {
  Edit
} from "@material-ui/icons";


import bytImage from "../../images/favicon/favicon_byt.jpg";

import _ from "lodash";

import imageEmpty from "../../images/others/image-empty.png";
import avatarImage from "../../images/favicon/favicon_byt.jpg";

import { displayDate, displayTime } from "../Helpers/Helpers";
import { dictionnary } from "../Langs/langs";

const EventsList = props => {
  return (
    <React.Fragment>
      {_.isEmpty(props.events)
        ? <div style={{ textAlign: "center", marginTop: "40px", marginBottom: "40px" }}>
            <img src={bytImage} alt="no events" />
          </div>
        : <Container maxWidth="lg">
            <Grid container={true} spacing={1}>
              {_.map(props.events, (event, i) => 
                <Event
                  key={i}
                  event={event}
                  lang={props.lang}
                  user={props.user}
                  onEdit={event => {
                    if (props.onEdit) {
                      props.onEdit(event.code);
                    }
                  }}
                  onView={event => {
                    if (props.onView) {
                      props.onView(event.code);
                    }
                  }}
                />
              )}
            </Grid>
          </Container>
      }
    </React.Fragment>
  );
};

EventsList.propTypes = {
  events: PropTypes.array,
  lang: PropTypes.string,
  user: PropTypes.object,
  onEdit: PropTypes.func,
  onView: PropTypes.func
};

EventsList.defaultProps = {
  lang: "fr"
};

export default EventsList;

const Event = props => {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card>
        <CardHeader
          avatar={
            <Avatar aria-label="event" variant="square" src={avatarImage} />
          }
          action={
            props.user.code === props.event.seller
              ? <IconButton
                  aria-label="edit"
                  onClick={() => {
                    if (props.onEdit) {
                      props.onEdit(props.event);
                    }
                  }}
                >
                  <Edit />
                </IconButton>
              : null
          }
          title={props.event.name}
          subheader={
            _.isNull(props.event.date)
              ? _.get(dictionnary, _.toUpper(props.lang) + ".loading") + "..."
              : displayDate(props.event.date, props.lang) + " - " + displayTime(props.event.date, props.lang)
          }
        />
        <CardMedia 
          style={{ height: 0, paddingTop: "56.25%" }}
          image={_.isEmpty(props.event.photo) ? imageEmpty : props.event.photo}
          title={props.event.name}
          onClick={() => {
            if (!props.event.code) {
              return;
            }
            if (props.onView) {
              props.onView(props.event);
            }
          }}
        />
        <CardContent style={{ paddingBottom: 10, textAlign: "center" }}>
          <Typography variant="body2" color="textSecondary" component="p">
            {props.event.code}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}