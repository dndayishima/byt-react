import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";
import _ from "lodash";

const Title = ({ title }) => {
  return(
    <React.Fragment>
      {_.isEmpty(title)
        ? null
        : <div style={{ marginBottom: "15px" }}> 
            <Typography 
              color="primary"
              //style={{ color: "red" }}
              variant="h4"
            >
              <strong>{title}</strong>
            </Typography>
          </div>
      }
    </React.Fragment>
  );
};

Title.propTypes = {
  title: PropTypes.string
};

Title.defaultProps = {
  title: ""
};

export default Title;