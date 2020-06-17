import React from "react";
import { Segment, Message, Button, Icon } from "semantic-ui-react";
import styled from "@emotion/styled";
import { ROUTES } from "../../../utils/routes";

interface BannerProps {
	loading: boolean;
	handleExampleQuery: () => void;
	handleTourToggle: () => void;
}

export const Banner = ({
	loading,
	handleExampleQuery,
	handleTourToggle,
}: BannerProps) => (
	<Segment>
		<Message>
			<Message.Header as="h2">Welcome</Message.Header>
			<p>
				CITE provides visualization of ligand-receptor (LR) signaling
				interactions within the tumor microenvironment (TME). The
				relative flow of signaling is estimated by the Relative
				Crosstalk (<b>RC</b>) score. Read more about RC score{" "}
				<a href={ROUTES.About.push()}>here</a>.
			</p>
			<ButtonYellow size="mini" onClick={handleTourToggle}>
				Take a tour&nbsp;&nbsp;&nbsp;&nbsp;
				<Icon name="rocket" />
			</ButtonYellow>
			<p>
				<b>Example:-</b>
				<br />
				If you are interested in the <u>AREG-EGFR</u> interaction in{" "}
				<u>glioblastoma (GBM) and lower-grade glioma (LGG)</u>, then you{" "}
				select the respective ligand, receptor and cancer types. You can{" "}
				hover over the individual cells to see the specific values of
				Relative Crosstalk (<b>RC</b>) scores. The heatmap of the RC
				scores for AREG-EGFR pair in GBM and LGG shows a{" "}
				<u>very high SC (stroma-to-cancer) score</u> for this pair,
				indicating that tumor infiltrating stromal cells over-express
				the ligand AREG, activating over-expressed EGFR in cancer cells.
			</p>
			<Button
				data-testid="exampleButton"
				role="button"
				size="mini"
				loading={loading}
				onClick={handleExampleQuery}
			>
				Try example
			</Button>
		</Message>
	</Segment>
);

const ButtonYellow = styled(Button)`
	background-color: #ffe380 !important;
`;
