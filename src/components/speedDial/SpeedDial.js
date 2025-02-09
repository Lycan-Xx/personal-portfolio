import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from "@material-ui/lab";
import Resume from "../../settings/resume.json";

const useStyles = makeStyles((theme) => ({
	speedDial: {
		position: "fixed",
		top: theme.spacing(12),
		left: theme.spacing(4),
		zIndex: 1000,
	},
	iconColor: {
		color: theme.palette.foreground.default,
	},
	speedDialAction: {
		color: theme.palette.primary.main,
	},
	icon: {
		fontSize: '1.2rem',
	},
}));

export const SpeedDials = () => {
	const classes = useStyles();

	const [open, setOpen] = React.useState(false);

	const handleClose = () => {
		setOpen(false);
	};

	const handleOpen = () => {
		setOpen(true);
	};

	const actionIcons = Resume.basics.profiles.map((action) => (
		<SpeedDialAction
			key={action.network.toLowerCase()}
			icon={<i className={`${classes.icon} ${action.x_icon}`}></i>}
			tooltipTitle={action.network}
			tooltipPlacement="left"
			onClick={() => window.open(action.url, '_blank')}
			className={classes.speedDialAction}
		/>
	));

	return (
		<>
			<SpeedDial
				ariaLabel="SpeedDial"
				className={classes.speedDial}
				hidden={false}
				icon={<SpeedDialIcon />}
				onClose={handleClose}
				onOpen={handleOpen}
				open={open}
				direction="up"
			>
				{actionIcons}
			</SpeedDial>
		</>
	);
};
