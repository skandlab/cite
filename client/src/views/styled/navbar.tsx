import React from "react";
import { Menu, Grid, Image } from "semantic-ui-react";
import { URL_NAVBAR_LOGO, ROUTE_HOME, APP_TITLE } from "../../utils/constants";
import { browserHistory } from "../../utils/browser_history";

export const Navbar = () => (
  <Grid.Row centered className="menuRow">
    <Grid.Column mobile={16} tablet={16} computer={16} largeScreen={15} widescreen={12}>
      <Menu fluid borderless>
        <Menu.Item>
          <Image
            size="tiny"
            src={URL_NAVBAR_LOGO}
            alt={APP_TITLE + "-logo"}
            onClick={() => browserHistory.push(ROUTE_HOME)}
          />
        </Menu.Item>
        <Menu.Item>
          <Menu.Header as="h2">{APP_TITLE}</Menu.Header>
        </Menu.Item>
      </Menu>
    </Grid.Column>
  </Grid.Row>
);
