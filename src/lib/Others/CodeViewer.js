import React from "react";
import PropTypes from "prop-types";

import {
  Badge,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Typography
} from "@material-ui/core";

import {
  //DeleteForever,
  Edit,
  Person
} from "@material-ui/icons";

import _ from "lodash";

import { displayDate, displayTime, priceValuePrinting } from "../Helpers/Helpers";

const styles = {
  cardHeader: {
    backgroundColor: "#EEEEEE"
  }
};

export default class CodeViewer extends React.Component {
  static propTypes = {
    lang: PropTypes.string,
    code: PropTypes.object
  };

  static defaultProps = {
    lang: "fr"
  };

  state = {
    showUsedBy: false
  };

  render () {
    return (
      <React.Fragment>
        <Card>
          <CardHeader 
            title={
              <Typography variant="body1" color="textPrimary" align="center">
                <strong>
                  {priceValuePrinting(this.props.code.value.value, this.props.lang) + " " + this.props.code.value.currency}
                </strong>
              </Typography>
            }
            style={styles.cardHeader}
          />
          <CardContent style={{ textAlign: "center" }}>
            <Badge
              color={
                !_.isEmpty(this.props.code.usedAt) ||
                !_.isEmpty(this.props.code.usedBy)
                  ? "error"
                  : "primary"
              }
              overlap="circle"
              badgeContent=" "
            >
              &nbsp;
            </Badge>
            <Typography variant="body1" color="textSecondary">
              <strong>{this.props.code.code}</strong>
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {displayDate(this.props.code.createdAt, this.props.lang) + " - " + displayTime(this.props.code.createdAt, this.props.lang)}
            </Typography>

            {/* created by */}
            <Divider style={{ marginTop: "5px", marginBottom: "5px" }}/>

            <Typography variant="body1" color="textSecondary">
              <Edit />
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {this.props.code.createdBy}
            </Typography>

            {this.state.showUsedBy
              ? <React.Fragment>
                  <Divider style={{ marginTop: "5px", marginBottom: "5px" }}/>
                  <Typography variant="body1" color="textSecondary">
                    <Person />
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {this.props.code.usedBy}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                  {displayDate(this.props.code.usedAt, this.props.lang) + " - " + displayTime(this.props.code.usedAt, this.props.lang)}
                  </Typography>
                </React.Fragment>
              : null
            }
          </CardContent>

          <CardActions>
            <Button
              fullWidth={true}
              variant="contained"
              disabled={_.isEmpty(this.props.code.usedAt) && _.isEmpty(this.props.code.usedBy)}
              onClick={() => {
                this.setState({ showUsedBy: !this.state.showUsedBy })
              }}
            >
              <Person 
                color={
                  _.isEmpty(this.props.code.usedAt) &&
                  _.isEmpty(this.props.code.usedBy)
                    ? "disabled"
                    : "primary" 
                }
              />
            </Button>
            {/* suppression d'un code */}
            {/*<Button
              fullWidth={true}
              variant="contained"
              onClick={() => {}}
            >
              <DeleteForever
                color="error"
              />
            </Button>*/}
          </CardActions>
        </Card>
      </React.Fragment>
    );
  }
}