import { FormControlLabel, Switch } from "@material-ui/core";
import { ChangeEvent, useCallback, useState } from "react";
import { useAppSelector } from "../../reduxHooks";
import { activeMeetingRunning } from "../../meetings/meetingsSelectors";
import {
  useVoiceCapturingIfMeetingIsRunning,
  useVoiceEmotionCapturing,
} from "./hooks";
import Loader from "../../components/Loader";

export default function VoiceCaptureControls(): JSX.Element {
  const meetingRunning = useAppSelector(activeMeetingRunning);
  const [checked, setChecked] = useState<boolean>(false);
  const [warmupModel, extractAndPersistVoiceEmotionsCallback] =
    useVoiceEmotionCapturing();
  const [startVoiceCapturing, stopVoiceCapturing] =
    useVoiceCapturingIfMeetingIsRunning(extractAndPersistVoiceEmotionsCallback);
  const [modelLoading, setModelLoading] = useState<boolean>(false);

  const handleChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      setChecked(e.target.checked);
      console.log("Handle Change.");

      if (meetingRunning) {
        if (e.target.checked) {
          setModelLoading(true);
          await warmupModel();
          setModelLoading(false);

          // Acquire access to the microphone and start predicting the emotions
          await startVoiceCapturing();
        } else {
          // Stop accessing microphone
          await stopVoiceCapturing();
        }
      }
    },
    [meetingRunning, startVoiceCapturing, stopVoiceCapturing, warmupModel]
  );

  return modelLoading ? (
    <Loader />
  ) : (
    <FormControlLabel
      control={
        <Switch checked={checked} onChange={handleChange} color="primary" />
      }
      label={`${checked ? "Disable" : "Enable"} voice tracking`}
    />
  );
}