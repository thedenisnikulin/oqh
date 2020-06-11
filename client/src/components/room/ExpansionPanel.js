import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import UserAvatar from "../UserAvatar";

const useStyles = makeStyles((theme) => ({
  heading: {
    display: "flex",
    flexDirection: "row"
  },
  panel: {
      margin: "0 0 0.5rem 8%",
      padding: "0",
      
  },
  smth: {
    width: "90%",
    "&:hover": {
      background: "#d5dce3"
    },
  }
}));

export default function ControlledExpansionPanel(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className={classes.panel}>
      <ExpansionPanel className={classes.smth} expanded={expanded === 'panel'} onChange={handleChange('panel')}>
        <ExpansionPanelSummary className={classes.smth}
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >
          <Typography className={classes.heading}><div className="flexx">
                <UserAvatar username={props.user.username} size="small" />
                <div className="member-username">{props.user.username}</div>
            </div></Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            {props.user.bio}
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}