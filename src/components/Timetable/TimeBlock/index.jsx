import React from 'react';
import PropTypes from 'prop-types';
import {
  Box, Typography, Paper, makeStyles,
} from '@material-ui/core';

const hourBlockHeight = 64;
const blockWidth = 128;

const timeStringToNum = (timeStr) => {
  const [h, m] = timeStr.split(':');
  return h * 6 + m / 10;
};

const useStyles = makeStyles((theme) => ({
  paper: (props) => ({
    display: 'flex',
    height: '100%',
    padding: theme.spacing(0.5),
    border: props.blockInfo.sectionNum.startsWith('0')
      ? `1px solid ${theme.palette.secondary.main}`
      : `1px solid ${theme.palette.ternary.main}`,
  }),
  sectionText: {
    lineHeight: 1.2,
    textAlign: 'right',
    whiteSpace: 'pre',
  },
}));

const propTypes = {
  startTime: PropTypes.string.isRequired,
  endTime: PropTypes.string.isRequired,
  blockInfo: PropTypes.shape({
    courseCode: PropTypes.string.isRequired,
    sectionType: PropTypes.string.isRequired,
    sectionNum: PropTypes.string.isRequired,
  }).isRequired,
};

function TimeBlock(props) {
  const classes = useStyles(props);

  const { startTime, endTime, blockInfo } = props;
  const { courseCode, sectionType, sectionNum } = blockInfo;

  const start = timeStringToNum(startTime);
  const end = timeStringToNum(endTime);
  const duration = end - start;

  return (
    <Box
      height={duration * (hourBlockHeight / 6)}
      width={blockWidth}
      position="absolute"
      top={(start - timeStringToNum('8:00')) * (hourBlockHeight / 6)}
    >
      <Paper variant="outlined" className={classes.paper}>
        <Box flexGrow={1}>
          <Typography variant="body2" display="block">
            {courseCode}
          </Typography>
          <Typography variant="caption" display="block">
            {`${startTime}-${endTime}`}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" display="block" className={classes.sectionText}>
            {`${sectionType}\n${sectionNum}`}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

TimeBlock.propTypes = propTypes;

export { TimeBlock as default, hourBlockHeight, blockWidth };
