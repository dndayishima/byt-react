import React from "react";
import PropTypes from "prop-types";

import {
  Container,
  Grid,
  TextField
} from "@material-ui/core";

import _ from "lodash";

export default class PriceEditor extends React.Component {
  static propTypes = {
    lang: PropTypes.string,
    price: PropTypes.object
  };

  static defaultProps = {
    lang: "fr",
    price: {}
  };

  state = {
    type: _.get(this.props.price, "type", ""),
    values: _.get(this.props.price, "values", []),
    totalPlaces: _.get(this.props.price, "totalPlaces", 0),
    alreadyTakenPlaces: _.get(this.props.price, "alreadyTakenPlaces", 0),
    remainingPlaces: _.get(this.props.price, "remainingPlaces", 0), // peut-être pas besoin
    checkExceeding: _.get(this.props.price, "checkExceeding", false)
  };

  render() {
    return(
      <React.Fragment>
        <Container maxWidth="md">
          <Grid container={true} spacing={2}>
            <Grid item={true} xs={12} sm={4} md={4}>
              <TextField
                fullWidth={true}
                label="Type"
                variant="outlined"
                value={this.state.type}
              />
            </Grid>
            <Grid item={true} xs={12} sm={4} md={4}>
              <TextField
                fullWidth={true}
                label="Total places"
                variant="outlined"
                type="number"
                value={this.state.totalPlaces}
              />
            </Grid>
            <Grid item={true} xs={12} sm={4} md={4}>
              <TextField
                fullWidth={true}
                label="Places already taken"
                variant="outlined"
                type="number"
                value={this.state.alreadyTakenPlaces}
              />
            </Grid>
          </Grid>
        </Container>
      </React.Fragment>
    )
  }
}