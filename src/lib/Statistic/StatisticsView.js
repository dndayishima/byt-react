import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import {
  CircularProgress,
  Container,
  Grid
} from "@material-ui/core";
import { Bar } from "react-chartjs-2";
import _ from "lodash";

import bytImage from "../../images/favicon/favicon_byt.jpg";
import { dictionnary } from "../Langs/langs";

const StatisticsView = props => {
  const [loading, setLoading] = useState(true);
  const [ticketsPerWeek, setTicketPerWeek] = useState([]);
  
  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const reload = () => {
    props.client.Ticket.ticketsPerWeek(
      props.jwt,
      props.eventCode,
      result => {
        setTicketPerWeek(result.data);
        setLoading(false);
      },
      error => {
        //console.log(error);
        setLoading(false);
        setTicketPerWeek([]);
      }
    );
  };

  const getChartLabels = () => {
    let arrayLabels = [];
    _.forEach(ticketsPerWeek, data => {
      let label = "W. " + data.week + " (" + data.year + ")";
      arrayLabels.push(label);
    });
    return arrayLabels;
  };

  const getChartData = () => {
    let d = [];
    _.forEach(ticketsPerWeek, data => {
      d.push(data.totalTickets);
    });
    return d;
  }

  const lang = _.toUpper(props.lang);
  // data for the chart
  const data = {
    labels: getChartLabels(),
    datasets: [
      {
        label: _.upperFirst(_.get(dictionnary, lang + ".ticketsPerWeek")),
        backgroundColor: 'rgba(145,145,135,57)',
        borderColor: 'rgba(145,145,135,57)',
        borderWidth: 1,
        hoverBackgroundColor: "rgba(38,87,105,41)",
        hoverBorderColor: "rgba(38,87,105,41)",
        data: getChartData()
      }
    ]
  };

  return (
    <React.Fragment>
      <Container>
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
        {_.isEmpty(ticketsPerWeek)
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
};

StatisticsView.propTypes = {
  client: PropTypes.any.isRequired,
  jwt: PropTypes.string,
  lang: PropTypes.string,
  eventCode: PropTypes.string
}

StatisticsView.defaultProps = {
  lang: "fr"
};

export default StatisticsView;