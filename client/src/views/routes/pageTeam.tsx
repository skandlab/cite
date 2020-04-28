import React from "react";
import { Grid, Card, Image, Icon } from "semantic-ui-react";
import { GridColumn } from "../styled/gridColumn";
import { Members } from "../../utils/constants";

interface Props {
	imageUrl: string;
	header: string;
	subHeader: string;
	jobDescription: string;
	email: string;
}

const MemberInfo = (props: Props) => (
	<Card>
		<Image src={props.imageUrl} wrapped ui={false} />
		<Card.Content>
			<Card.Header>{props.header}</Card.Header>
			<Card.Meta>
				<span>{props.subHeader}</span>
			</Card.Meta>
			<Card.Description>{props.jobDescription}</Card.Description>
		</Card.Content>
		<Card.Content extra>
			<Icon name="user" />
			{props.email}
		</Card.Content>
	</Card>
);

export const PageTeam = () => (
	<Grid.Row centered>
		<GridColumn>
			<Card.Group centered stackable>
				{Members.map((props) => (
					<MemberInfo {...props} key={props.email} />
				))}
			</Card.Group>
		</GridColumn>
	</Grid.Row>
);
