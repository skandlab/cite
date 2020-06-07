import React from "react";
import { Menu } from "semantic-ui-react";
import { ColorBar } from "./colorbar";
import { Summary } from "./summary";

interface Props {
	totalItems: number;
	currentPageNumber: number;
}

export const StatusBar = (props: Props) => (
	<Menu className="nohover" secondary borderless>
		<Menu.Item>
			<Summary {...props} />
		</Menu.Item>
		<Menu.Menu position="right">
			<Menu.Item>
				<ColorBar />
			</Menu.Item>
		</Menu.Menu>
	</Menu>
);
