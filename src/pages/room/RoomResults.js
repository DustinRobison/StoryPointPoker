import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Typography, Divider, Box } from "@material-ui/core";
import PropTypes from "prop-types";
import { Decimal } from "decimal.js";

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    padding: spacing(3)
  }
}));

const RoomResults = ({ votes }) => {
  const classes = useStyles();

  const getAverageVote = () => {
    const sumObject = votes.reduce(
      (acc, vote) => {
        try {
          const voteNumber = parseInt(vote);
          return {
            total: acc.total + voteNumber,
            votes: acc.votes + 1
          };
        } catch (err) {
          return acc;
        }
      },
      { total: 0, votes: 0 }
    );
    if (sumObject.total && sumObject.votes) {
      const avg = new Decimal(sumObject.total)
        .dividedBy(sumObject.votes)
        .toNumber();
      return avg.toFixed(2);
    } else {
      return "--";
    }
  };

  return (
    <div className={classes.root}>
      <Typography variant={"h6"} align={"center"}>
        Results:
      </Typography>
      <Divider />
      <Typography variant={"subtitle1"}>
        Average:{" "}
        <Box component={"span"} fontWeight={500}>
          {getAverageVote()}
        </Box>
      </Typography>
    </div>
  );
};

RoomResults.propTypes = {
  lastVoteTimestamp: PropTypes.number.isRequired,
  showVotes: PropTypes.bool,
  votes: PropTypes.arrayOf(PropTypes.string)
};

export default RoomResults;
