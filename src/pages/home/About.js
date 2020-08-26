import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Paper, Grid, Typography, Divider, Link } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    padding: spacing(3)
  },
  bodyText: {
    padding: spacing(1)
  }
}));

const About = ({ reference }) => {
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography
            variant={"h6"}
            align={"center"}
            ref={reference}
            component={"div"}
          >
            About
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant={"subtitle1"}>
            What Is Story Point Poker?
          </Typography>
          <Divider variant={"fullWidth"} />
          <Typography className={classes.bodyText}>
            Story Point Poker is a simple tool to help with the agile process
            implementation referred to as{" "}
            <Link
              href={"https://en.wikipedia.org/wiki/Planning_poker"}
              target={"_blank"}
              rel={"noopener noreferrer"}
            >
              Planning Poker
            </Link>
            .
          </Typography>
          <Typography className={classes.bodyText}>
            A goal of{" "}
            <Link
              href={"https://en.wikipedia.org/wiki/Agile_software_development"}
              target={"_blank"}
              rel={"noopener noreferrer"}
            >
              Agile
            </Link>{" "}
            is to enable a development team to have a measure of planning. Part
            of that planning is estimating the complexity of tasks in a proposed
            workload. Story Point Poker is a simple tool to enable those team
            driven estimates in real time with ease.
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant={"subtitle1"}>
            How can I use story point poker?
          </Typography>
          <Divider variant={"fullWidth"} />
          <Typography className={classes.bodyText}>
            Story Point Poker is made for software development teams and is
            intended to be used in addition to other tools.
          </Typography>
          <Typography className={classes.bodyText}>
            Before starting you need a list of the tasks you intend for you and
            your team to complete. Common tools for this are:{" "}
            <Link
              href={"https://www.atlassian.com/software/jira"}
              target={"_blank"}
              rel={"noopener noreferrer"}
            >
              Jira
            </Link>{" "}
            or{" "}
            <Link
              href={"https://trello.com"}
              target={"_blank"}
              rel={"noopener noreferrer"}
            >
              Trello
            </Link>{" "}
            but there are many others. Then you need to meet your team in real
            time.
          </Typography>
          <Typography className={classes.bodyText}>
            Next, you can create a room from{" "}
            <Link component={RouterLink} to={"/"}>
              the home page
            </Link>{" "}
            and send the url to invite others. The team can discuss the task to
            be estimated and submit their votes on the complexity of the task in
            real time and keep it hidden. After all votes are submitted they can
            be revealed and a discussion towards consensus can be initiated.
            Finally update the task with the estimation and clear votes to move
            on to the next.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant={"subtitle1"}>
            Does <Link href={"/"}>storypointpoker.com</Link> store any of my
            personal data?
          </Typography>
          <Divider variant={"fullWidth"} />
          <Typography className={classes.bodyText}>
            No.
            <br />
            We do collect Google analytics data (ie. counts the number of people
            that visited the site and poker room) but every action you do and
            your created room are all automatically deleted within 24 hours of
            creation.
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default About;
