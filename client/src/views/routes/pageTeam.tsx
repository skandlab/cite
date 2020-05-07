import React from "react";
import {
	Grid,
	Card,
	Image,
	Icon,
	Label,
	Segment,
	Header,
	ImageProps,
	Container,
} from "semantic-ui-react";
import { GridColumn } from "../styled/gridColumn";
import { Members } from "../../utils/constants";
import styled from "@emotion/styled";

interface Props {
	imageUrl: string;
	header: string;
	subHeader: string;
	jobDescription: string;
	email: string;
}

const AppImage = (props: ImageProps) => (
	<Image src={props.src} alt={props.alt} centered fluid {...props} />
);

const StyledContainer = styled(Container)`
	font-size: 20px;
`;

const MemberInfo = (props: Props) => (
	<Card>
		<Image src={props.imageUrl} wrapped ui={false} />
		<Card.Content>
			<Card.Header>{props.header}</Card.Header>
			<Card.Meta>
				<span className="date">{props.subHeader}</span>
			</Card.Meta>
			<Card.Description>{props.jobDescription}</Card.Description>
		</Card.Content>
		<Card.Content extra>
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

export const PageTeam = () => (
	<>
		<Grid.Row>
			<GridColumn>
				<StyledContainer textAlign="center">
					<q>
						<em>
							This database could aid in target discovery
							approaches by providing signaling interactions of
							cancer cells with their environment as they exist
							inside human tumors.
						</em>
					</q>
				</StyledContainer>
			</GridColumn>
		</Grid.Row>
		<Grid.Row />
		<Grid.Row>
			<GridColumn>
				<AppImage
					src={require("../../assets/about_signaling.png")}
					alt="cell-cell signaling interface"
					size="huge"
				/>
				<Segment padded="very">
					<p>
						<b>TUMERIC</b> is a freely available database of curated
						receptor-ligand signaling interactions within the tumor
						microenvironment (TME). The cancer and stromal cell
						specific expression was calculated by deconvolution of
						bulk tumor expression obtained from TCGA (
						<a
							href="https://www.biorxiv.org/content/10.1101/835512v1"
							target="_blank"
							rel="noopener noreferrer"
						>
							Ghoshdastider, 2019
						</a>
						).
					</p>
					<p>
						<ul>
							<li>
								Crosstalk between ligands and receptors on
								cancer and stromal cells was estimated in the
								tumor microenvironment of 20 solid tumor types,
								based on the cancer and stroma specific
								expression.
							</li>
							<li>
								To estimate the relative flow of signaling
								between cancer and stromal cell compartments,
								the Relative Crosstalk (RC) score was used.
								Ligand-receptor complex activity was
								approximated using the product of ligand and
								receptor gene expression inferred for the given
								compartments (in linear scale).
							</li>
							<li>
								The RC score then estimates the relative complex
								concentration given all four possible directions
								of signaling and a normal tissue state, e.g. for
								cancer-cancer (CC) signaling:
								<AppImage
									src={require("../../assets/about_formula.png")}
									alt="relative cross-talk formula"
									size="huge"
									fluid={false}
								/>
							</li>
						</ul>
					</p>
				</Segment>
			</GridColumn>
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
