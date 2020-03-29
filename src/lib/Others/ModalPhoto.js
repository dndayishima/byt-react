import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Typography
} from "@material-ui/core"
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import { Image, Delete } from "@material-ui/icons";
import _ from "lodash";

import { dictionnary } from "../Langs/langs";
import emptyImage from "../../empty-image.png";

const ModalPhoto = props => {
  const [photo, setPhoto] = useState("");
  
  useEffect(() => {
    setPhoto(props.photo);
  }, [props.photo]); // cette Hook ne s'exécute que si props.photo a changé

  const getBase64Image = file => {
    let reader = new FileReader();
    reader.readAsDataURL(file); // base 64
    reader.onload = () => {
      //console.log(reader.result);
      setPhoto(reader.result);
    };
    reader.onerror = error => {
      console.log("error " + error);
    };
  };

  let lang = _.toUpper(props.lang);
  return (
    <React.Fragment>
      <Dialog
        open={props.open}
        onClose={() => {
          if (props.onClose) {
            props.onClose();
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
                _.isEmpty(photo)
                  ? emptyImage
                  : photo
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
              onClick={() => setPhoto(new Uint8Array())}
            >
              <Delete />
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
                // si taille supérieure à 1 mo -> refuser
                if (file.size / 1024 / 1024 > 1) {
                  alert(_.upperFirst(_.get(dictionnary, lang + ".imageSizeTooLarge")));
                  return;
                }
                getBase64Image(file);
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={() => {
              if (props.onClose) {
                props.onClose();
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
              if (props.onModify) {
                props.onModify(photo);
              }
              if (props.onClose) {
                props.onClose();
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
};

ModalPhoto.propTypes = {
  lang: PropTypes.string,
  open: PropTypes.bool,
  photo: PropTypes.string,
  onClose: PropTypes.func,
  onModify: PropTypes.func
};

ModalPhoto.defaultProps = {
  lang: "fr"
};

export default ModalPhoto;