import React from "react";
import styled from "@emotion/styled";
import {
	Grid,
	Card,
	Image,
	Icon,
	Label,
	Segment,
	Header,
	Item,
	Container,
	Divider,
} from "semantic-ui-react";
import { GridColumn } from "../containers/gridColumn";
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
		<Card.Content textAlign="left">
			<Card.Header>{props.header}</Card.Header>
			<Card.Meta>
				<span className="date">{props.subHeader}</span>
			</Card.Meta>
			<Card.Description>{props.jobDescription}</Card.Description>
		</Card.Content>
		<Card.Content textAlign="left" extra>
			<Label
				as="a"
				href={"mailto:" + props.email}
				target="_blank"
				rel="noopener noreferrer"
			>
				<Icon name="mail" /> Contact
			</Label>
		</Card.Content>
	</Card>
);

const PageAbout = () => (
	<>
		<Grid.Row centered>
			<StyledGridColumn>
				<Container>
					<em>
						<big>
							CITE provides a database and dynamic visualization
							of ligand-receptor (LR) signaling interactions
							within the tumor microenvironment (TME).
						</big>
					</em>
					<Divider />
					<Item.Group textAlign="left">
						<StyledItem>
							<Item.Content>
								Crosstalk between ligands and receptors on
								cancer and stromal cells were estimated in the
								tumor microenvironment of 20 solid tumor types,
								based on cancer and stroma specific expression.
								<Image
									src={require("../../assets/about_deconvolution.png")}
									alt="deconvolution explanation"
									size="huge"
									centered
								/>
							</Item.Content>
						</StyledItem>
						<StyledItem>
							<Item.Content>
								The RC score then estimates the relative complex
								concentration given all four possible directions
								of signaling and a normal tissue state, e.g. for
								cancer-cancer (CC) signaling:
								<Image
									src={require("../../assets/about_formula.png")}
									alt="relative cross-talk formula"
									size="huge"
									centered
								/>
							</Item.Content>
						</StyledItem>
						<StyledItem>
							<Item.Content>
								To estimate the relative flow of signaling
								between cancer and stromal cell compartments,
								the Relative Crosstalk (RC) score was used.
								Ligand-receptor complex activity was
								approximated using the product of ligand and
								receptor gene expression inferred for the given
								compartments (in linear scale).
								<Image
									src={require("../../assets/about_signaling.png")}
									alt="relative cross-talk example"
									size="huge"
									centered
								/>
							</Item.Content>
						</StyledItem>
					</Item.Group>
				</Container>
			</StyledGridColumn>
		</Grid.Row>
		<Grid.Row centered>
			<GridColumn>
				<Segment padded="very" textAlign="center">
					<Header as="h2">The Team</Header>
					<Card.Group centered stackable>
						{Members.map((props) => (
							<MemberInfo {...props} key={props.email} />
						))}
					</Card.Group>
				</Segment>
			</GridColumn>
		</Grid.Row>
	</>
);

const StyledGridColumn = styled(GridColumn)`
	max-width: 992px;
	font-size: 18px;
`;

const StyledItem = styled(Item)`
	margin: 3em 0 !important;
	& img {
		margin: 1em auto !important;
	}
`;

export default PageAbout;
