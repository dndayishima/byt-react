import React from "react";
import PropTypes from "prop-types";

import {
  Divider, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText 
} from "@material-ui/core";
import {
  Attachment,
  CenterFocusWeak, 
  Event,
  InfoOutlined,
  //Security,
  Settings, 
  Timeline, 
  VpnKey 
} from "@material-ui/icons";

import _ from "lodash";

import { dictionnary } from "../Langs/langs";
import { userIsAdmin, userIsSeller, userIsTech } from "../Helpers/Helpers";

import logo from "../../images/logo/byt-logo.jpg";

export default class MenuDrawer extends React.Component {
  static propTypes = {
    lang: PropTypes.string,
    onChangeSelection: PropTypes.func,
    onClickItem: PropTypes.func,
    open: PropTypes.bool,
    roles: PropTypes.array
  };
  static defaultProps = {
    lang: "fr",
    open: false,
    roles: []
  };

  onClick = item => {
    if (this.props.onClickItem) {
      this.props.onClickItem(item);
    }
  };

  render () {
    let lang = _.toUpper(this.props.lang);
    return (
      <Drawer
        anchor="left"
        open={this.props.open}
        onClose={this.props.onClose}
      >
        <div
          style={{ width: 240, cursor: "pointer" }}
        >
          <div style={{ textAlign: "center" }}>
          <img src={logo} height="60" width="auto" alt="logo"/>
          </div>
        </div>
        <Divider />
        <List>
          <ListItem
            button={true}
            onClick={() => this.onClick("events")}
          >
            <ListItemIcon>
              <Event />
            </ListItemIcon>
            <ListItemText
              primary={_.upperFirst(_.get(dictionnary, lang + ".events"))}
            />
          </ListItem>

          <ListItem
            button={true}
            onClick={() => this.onClick("tickets")}
          >
            <ListItemIcon>
              <Attachment />
            </ListItemIcon>
            <ListItemText
              primary={_.upperFirst(_.get(dictionnary, lang + ".tickets"))}
            />
          </ListItem>

          {
            userIsSeller(this.props.roles) ||
            userIsTech(this.props.roles) ||
            userIsAdmin(this.props.roles)
            ? <React.Fragment>
                <ListItem
                  button={true}
                  onClick={() => this.onClick("statistics")}
                >
                  <ListItemIcon>
                    <Timeline />
                  </ListItemIcon>
                  <ListItemText
                    primary={_.upperFirst(_.get(dictionnary, lang + ".statistics"))}
                  />
                </ListItem>
      
                <ListItem
                  button={true}
                  onClick={() => this.onClick("scanner")}
                >
                  <ListItemIcon>
                    <CenterFocusWeak />
                  </ListItemIcon>
                  <ListItemText
                    primary={_.upperFirst(_.get(dictionnary, lang + ".scan"))}
                  />
                </ListItem>
              </React.Fragment>
            : null
          }

          {
            userIsTech(this.props.roles) ||
            userIsAdmin(this.props.roles)
            ? <ListItem 
                button={true}
                onClick={() => this.onClick("code")}
              >
                <ListItemIcon>
                  <VpnKey />
                </ListItemIcon>
                <ListItemText
                  primary={_.upperFirst(_.get(dictionnary, lang + ".code"))}
                />
              </ListItem> 
            : null
          }

          {/*{userIsAdmin(this.props.roles)
            ? <ListItem
                button={true}
                onClick={() => this.onClick("administration")}
              >
                <ListItemIcon>
                  <Security />
                </ListItemIcon>
                <ListItemText 
                  primary={_.upperFirst(_.get(dictionnary, lang + ".administration"))}
                />
              </ListItem>
            : null
          }*/}
          
          <ListItem 
            button={true}
            onClick={() => this.onClick("settings")}
          >
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText 
              primary={_.upperFirst(_.get(dictionnary, lang + ".settings"))}
            />
          </ListItem>

          <ListItem
            button={true}
            onClick={() => this.onClick("about")}
          >
            <ListItemIcon>
              <InfoOutlined />
            </ListItemIcon>
            <ListItemText
              primary={_.upperFirst(_.get(dictionnary, lang + ".about"))}
            />
          </ListItem>
        </List>
      </Drawer>
    )
  }
}