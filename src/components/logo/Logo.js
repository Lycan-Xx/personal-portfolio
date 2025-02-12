import React from "react";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
	svgHover: {
		fill: theme.palette.foreground.default,
		"&:hover": {
			fill: theme.palette.primary.main,
		},
		transition: "all 0.5s ease",
	},
}));

return (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="-35 -10 220 220"
		className={classes.svgHover}
	>
		<g id="Layer_2" data-name="Layer 2">
			<g id="Layer_5" data-name="Layer 5">
				<rect className="cls-1" x="0.47" y="31.33" width="9.9" height="133.85" rx="3.75" />
				<rect className="cls-1" x="133.62" y="57.1" width="9.9" height="108.08" rx="3.75" />
				<rect className="cls-1" x="30.39" y="21.71" width="9.9" height="112.54" rx="3.75" transform="translate(-38.83 35.21) rotate(-35.65)" />
				<rect className="cls-1" x="90.6" y="-17.08" width="9.9" height="201.44" rx="3.75" transform="translate(65.78 -39.81) rotate(35.24)" />
				<rect className="cls-1" x="78.17" y="39.68" width="9.9" height="201.55" rx="3.75" transform="translate(96.28 -22.22) rotate(35.24)" />
			</g>
		</g>
	</svg>
);
};
