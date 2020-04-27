import React from "react";
import { ResponsiveHeatMap } from "@nivo/heatmap";
import { InterfaceData } from "../routes/pageHome";
import { heatmapProps } from "../plots/plots.json";

interface Props {
  data: InterfaceData;
  pairKeys: string[];
  tumorKeys: string[];
  heatmapOptions?: {
    [key: string]: any;
  };
}

export const HeatMap = (props: Props) => (
  // @ts-ignore
  <ResponsiveHeatMap
    data={props.data.values.filter((prop) => props.tumorKeys.includes(prop.tumor_type))}
    keys={props.pairKeys}
    {...{ ...heatmapProps, ...props.heatmapOptions }}
  />
);
