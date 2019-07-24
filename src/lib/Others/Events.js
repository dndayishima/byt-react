import React from "react";
import EventsList from "./EventsList";

export default class Events extends React.Component {
  render () {
    return (
      <React.Fragment>
        This is an Event Manager <br />
        <EventsList />
      </React.Fragment>
    )
  }
}