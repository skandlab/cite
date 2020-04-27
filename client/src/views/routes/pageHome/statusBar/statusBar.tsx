import React from "react";
import { Menu, Statistic } from "semantic-ui-react";
import { ColorBar } from "./colorbar";
import { InterfaceData } from "..";
import { paginationText } from "../pagination";

interface Props {
  filteredData: InterfaceData[];
  currentPageNumber: number;
}

export const StatusBar = (props: Props) => (
  <Menu className="nohover" secondary borderless>
    <Menu.Item>
      <Statistic text size="mini">
        <Statistic.Label>Ligand-Receptor Combinations</Statistic.Label>
        <Statistic.Value>{paginationText({ ...props, totalItems: props.filteredData.length })}</Statistic.Value>
      </Statistic>
    </Menu.Item>
    <Menu.Menu position="right">
      <Menu.Item>
        <ColorBar />
      </Menu.Item>
    </Menu.Menu>
  </Menu>
);
