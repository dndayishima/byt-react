import React from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Typography
} from "@material-ui/core"

import _ from "lodash";

import MuiDialogTitle from "@material-ui/core/DialogTitle";

import { Image } from "@material-ui/icons";
import DeleteIcon from "@material-ui/icons/Delete";

import { imageHasPrefix } from "../Helpers/Helpers";
import { dictionnary } from "../Langs/langs";
import emptyImage from "../../empty-image.png";

export default class ModalPhoto extends React.Component {
  static defaultProps = {
    lang: "fr"
  };

  state = {
    photo: this.props.photo
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.photo !== prevProps.photo) {
      this.setState({ photo: this.props.photo });
    }
  };

  getBase64Image = file => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      //console.log(reader.result);
      this.setState({ photo: reader.result });
    };
    reader.onerror = error => {
      console.log("error " + error);
    };
  };

  render() {
    let lang = _.toUpper(this.props.lang);
    return (
      <React.Fragment>
        <Dialog
          open={this.props.open}
          onClose={() => {
            if (this.props.onClose) {
              this.props.onClose();
            }
          }}
        >
          <MuiDialogTitle disableTypography={true}>
            <Typography
              variant="h6"
              color="primary"
            >
              <strong>
                {_.upperFirst(_.get(dictionnary, lang + ".image"))}
              </strong>
            </Typography>
          </MuiDialogTitle>
          <DialogContent dividers={true}>
            <div
              style={{ textAlign: "center" }}
            >
              <img
                src={
                  _.isEmpty(this.state.photo)
                    ? emptyImage
                    : imageHasPrefix(this.state.photo)
                      ? this.state.photo
                      : "data:image/png;base64," + this.state.photo
                }
                height="auto"
                width="100%"
                alt="Affiche"
              />
            </div>

            <div style={{ marginTop: "10px", display: "flex", justifyContent: "center" }}>
              <IconButton
                onClick={() => {
                  document.getElementById("file").click();
                }}
              >
                <Image />
              </IconButton>
              <IconButton
                onClick={() => this.setState({ photo: "" })}
              >
                <DeleteIcon />
              </IconButton>
            </div>
            <input
              id="file"
              type="file"
              accept="image/*"
              hidden={true}
              onChange={e => {
                if (_.get(e.target.files, "length") !== 0) {
                  let file = _.get(e.target.files, "0");
                  this.getBase64Image(file);
                }
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              color="primary"
              onClick={() => {
                if (this.props.onClose) {
                  this.props.onClose();
                }
              }}
            >
              <strong>
                {_.upperFirst(_.get(dictionnary, lang + ".cancel"))}
              </strong>
            </Button>
            <Button
              color="primary"
              onClick={() => {
                if (this.props.onModify) {
                  this.props.onModify(this.state.photo);
                }
                if (this.props.onClose) {
                  this.props.onClose();
                }
              }}
            >
              <strong>
                {_.upperFirst(_.get(dictionnary, lang + ".modify"))}
              </strong>
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}