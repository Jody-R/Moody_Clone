import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../reduxHooks";
import {
  fetchActiveMeetingRatings,
  selectActiveMeetingRatings,
  subscribeToActiveMeetingRatings,
} from "../../meetings/ratingsSlice";
import { Box, Typography } from "@material-ui/core";
import Loader from "../../components/Loader";
import { Alert } from "@material-ui/lab";
import RatingsBarChart from "./RatingsBarChart";
import { unwrapResult } from "@reduxjs/toolkit";
import { selectActiveMeetingFeedbackLinkId } from "../../meetings/meetingsSelectors";

export default function Ratings(): JSX.Element {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchActiveMeetingRatings());
  }, [dispatch]);

  const activeMeetingFeedbackLinkId = useAppSelector(
    selectActiveMeetingFeedbackLinkId
  );

  useEffect(() => {
    let unsubscribe: () => void;
    const subscribeToRatings = async () => {
      unsubscribe = unwrapResult(
        await dispatch(subscribeToActiveMeetingRatings())
      );
    };
    subscribeToRatings();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [
    dispatch,
    // If the feedback link is created after opening the ratings page, the subscription should be run again
    activeMeetingFeedbackLinkId,
  ]);

  const ratingsLength = useAppSelector(
    (state) => selectActiveMeetingRatings(state).length
  );
  const loading = useAppSelector(
    (state) => state.ratings.loading && state.ratings.ids.length === 0
  );

  return loading ? (
    <Loader />
  ) : (
    <>
      <Typography variant="h3" gutterBottom>
        Ratings (N={ratingsLength})
      </Typography>
      {ratingsLength === 0 ? (
        <Alert severity="info">
          <Typography variant="body1">
            There are no ratings yet. Create a feedback link after you finished
            the meeting and send it to your audience. This page will refresh
            automatically.
            <br />
            <strong>
              Note: Feedback links are only valid for 30 minutes after the
              meeting has ended.
            </strong>
          </Typography>
        </Alert>
      ) : (
        <>
          <Box display="flex">
            <Box mr={2}>
              <RatingsBarChart
                questionType="overallStars"
                title="Overall experience"
                explanation="Shows the distribution of the overall experience scored by stars rom 1 to 5 (1=useless, 5=excellent). This is the score your audience gave using the feedback link you sent them."
              />
            </Box>
            <Box>
              <RatingsBarChart
                questionType="paceStars"
                title="Speaker's pace"
                explanation="Shows the distribution of the speaker's pace scored by stars from 1 to 5 (1=way too fast / slow, 5=just right). This is the score your audience gave using the feedback link you sent them."
              />
            </Box>
          </Box>
          <Box display="inline-block" mt={2}>
            <RatingsBarChart
              questionType="contentStars"
              title="Usefulness of content"
              explanation="Shows the distribution of the usefulness of the presentation's content scored by stars from 1 to 5 (1=useless, 5=excellent). This is the score your audience gave using the feedback link you sent them."
            />
          </Box>
        </>
      )}
    </>
  );
}
