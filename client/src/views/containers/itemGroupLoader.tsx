import React from "react";
import ContentLoader from "react-content-loader";

export const ItemGroupLoader = () => (
	<ContentLoader
		speed={2}
		width={240}
		height={220}
		viewBox="0 0 240 220"
		backgroundColor="#f3f3f3"
		foregroundColor="#ecebeb"
	>
		<circle cx="20" cy="16" r="16" />
		<rect
			x="40"
			y="8" // cy-8
			rx="4"
			ry="4"
			width="220"
			height="20"
		/>
		<circle cx="20" cy="64" r="16" /> // cy = cy+48
		<rect x="40" y="56" rx="4" ry="4" width="220" height="20" />
		<circle cx="20" cy="112" r="16" />
		<rect x="40" y="104" rx="4" ry="4" width="220" height="20" />
		<circle cx="20" cy="160" r="16" />
		<rect x="40" y="152" rx="4" ry="4" width="220" height="20" />
		<circle cx="20" cy="208" r="16" />
		<rect x="40" y="200" rx="4" ry="4" width="220" height="20" />
	</ContentLoader>
);
