import React from "react";
import PropTypes from "prop-types";

import {
  CircularProgress,
  Container,
  Grid
} from "@material-ui/core";

import { Bar } from "react-chartjs-2";

import _ from "lodash";

import bytImage from "../../favicon_byt.jpg";
import { dictionnary } from "../Langs/langs";

export default class StatisticsView extends React.Component {
  static propTypes = {
    client: PropTypes.any.isRequired,
    jwt: PropTypes.string,
    lang: PropTypes.string,
    event: PropTypes.object
  }

  static defaultProps = {
    lang: "fr"
  };
  
  state = {
    loading: true,
    ticketsPerWeek: []
  };

  componentDidMount() {
    if (!_.isEmpty(this.props.event)) {
      this.reload();
    } else {
      this.setState({ loading: false });
    }
  }

  reload = () => {
    this.props.client.Ticket.ticketsPerWeek(
      this.props.jwt,
      this.props.event.code,
      result => {
        //console.log(result);
        this.setState({
          loading: false,
          ticketsPerWeek: result.data
        })
      },
      error => {
        //console.log(error);
        this.setState({ loading: false, ticketsPerWeek: [] });
      }
    );
  };

  getChartLabels = () => {
    let arrayLabels = [];
    _.forEach(this.state.ticketsPerWeek, data => {
      let label = "W. " + data.week + " (" + data.year + ")";
      arrayLabels.push(label);
    });
    return arrayLabels;
  };

  getChartData = () => {
    let d = [];
    _.forEach(this.state.ticketsPerWeek, data => {
      d.push(data.totalTickets);
    });
    return d;
  }

  render() {
    const lang = _.toUpper(this.props.lang);
    // data for the chart
    const data = {
      labels: this.getChartLabels(),
      datasets: [
        {
          label: _.upperFirst(_.get(dictionnary, lang + ".ticketsPerWeek")),
          backgroundColor: 'rgba(145,145,135,57)',
          borderColor: 'rgba(145,145,135,57)',
          borderWidth: 1,
          hoverBackgroundColor: "rgba(38,87,105,41)",
          hoverBorderColor: "rgba(38,87,105,41)",
          data: this.getChartData()
        }
      ]
    };

    console.log(this.props.event);
    return (
      <React.Fragment>
        <Container>
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
          {_.isEmpty(this.state.ticketsPerWeek)
            ? <div style={{ textAlign: "center", marginTop: "40px", marginBottom: "40px" }}>
                <img src={bytImage} alt="no tickets" />
              </div>
            : <Grid container={true}>
                <Bar 
                  data={data}
                  height={400}
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      yAxes: [{
                        display: true,
                        ticks: { beginAtZero: true }
                      }]
                    }
                  }}
                />
              </Grid>
          }
        </Container>
      </React.Fragment>
    )
  }
}