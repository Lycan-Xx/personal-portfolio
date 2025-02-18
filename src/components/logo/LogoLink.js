import React from "react";
import { Link, Tooltip, Zoom } from "@mui/material";
import { makeStyles } from "@mui/styles"; // Update this line
import Resume from "../../settings/resume.json";

const useStyles = makeStyles((theme) => ({
	svg: {
		position: "fixed",
		width: "50px",
		height: "50px",
		top: theme.spacing(6),
		left: theme.spacing(6),
		boxShadow:
			"0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)",
		borderRadius: "50%",
	},
}));


return (
	<Tooltip
		title={Resume.basics.name}
		placement="right"
		TransitionComponent={Zoom}
	>
		<Link
			variant="h6"
			href={Resume.basics.url}
			underline="none"
			color="inherit"
			noWrap
			className={classes.svg}
		>
		</Link>
	</Tooltip>
);
};
