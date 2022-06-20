import React from "react";
import PropTypes from "prop-types";
import {
  Player,
  ControlBar,
  PlaybackRateMenuButton,
  BigPlayButton,
  CurrentTimeDisplay,
  TimeDivider,
  ReplayControl,
  ForwardControl,
  VolumeMenuButton,
} from "video-react";
import "video-react/dist/video-react.css";

const VideoPlayer = (props) => {
  const { videoUrl, thumbnail } = props;

  return (
    <Player poster={thumbnail} src={videoUrl} autoPlay aspectRatio="16:9">
      <BigPlayButton position="center" />
      <ControlBar>
        <ReplayControl seconds={10} order={1.1} />
        <ForwardControl seconds={30} order={1.2} />
        <CurrentTimeDisplay order={4.1} />
        <TimeDivider order={4.2} />
        <PlaybackRateMenuButton rates={[2, 1, 0.5]} order={7.1} />
        <VolumeMenuButton disabled />
      </ControlBar>
    </Player>
  );
};

VideoPlayer.propTypes = {
  videoUrl: PropTypes.any,
  thumbnail: PropTypes.string,
};

export default VideoPlayer;
