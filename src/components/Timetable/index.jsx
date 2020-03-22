import React from 'react';
import PropTypes from 'prop-types';
import {
  makeStyles, Box, Typography,
} from '@material-ui/core';
import { parseTime } from 'utils/courses';
import TimeBlock, { hourBlockHeight, blockWidth } from './TimeBlock';

const useStyles = makeStyles((theme) => {
  const defaultDivider = `1px solid ${theme.palette.divider}`;
  const timeColumnWidth = 72;
  return {
    root: {
      display: 'table',
    },
    captionCell: {
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(1),
    },
    row: {
      display: 'table-row',
      '& > *': {
        display: 'table-cell',
        position: 'sticky',
        borderBottom: defaultDivider,
        borderRight: defaultDivider,
        width: blockWidth,
        minWidth: blockWidth,
        maxWidth: blockWidth,
      },
      '& > *:first-child': {
        left: 0,
        borderLeft: defaultDivider,
        width: timeColumnWidth,
        minWidth: timeColumnWidth,
        maxWidth: timeColumnWidth,
      },
    },
    weekdayRow: {
      '& > *': {
        position: 'sticky',
        top: 0,
        zIndex: 3,
        borderTop: defaultDivider,
      },
      '& > *:first-child': {
        zIndex: 4,
      },
    },
    timeColumn: {
      zIndex: 2,
      '& > *': {
        borderBottom: defaultDivider,
        height: hourBlockHeight,
      },
      '& > *:last-child': {
        borderBottom: 'none',
      },
    },
  };
});

const hours = [
  '8 am', '9 am', '10 am', '11 am', '12 pm',
  '1 pm', '2 pm', '3 pm', '4 pm', '5 pm',
  '6 pm', '7 pm', '8 pm', '9 pm', '10 pm',
];

const weekdays = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday',
];
const shortWeekdays = ['M', 'T', 'W', 'Th', 'F'];

function Timetable(props) {
  const classes = useStyles();

  const { schedule } = props;
  const blocks = (schedule || []).map(parseTime).flat();

  return (
    <div className={classes.root}>
      <Box className={`${classes.row} ${classes.weekdayRow}`}>
        <Box className={classes.captionCell} />
        {weekdays.map((value) => (
          <Typography variant="subtitle2" key={value} className={classes.captionCell}>
            {value}
          </Typography>
        ))}
      </Box>
      <Box className={classes.row}>
        <Box className={classes.timeColumn}>
          {hours.map((value) => (
            <Typography variant="subtitle2" key={value} className={classes.captionCell}>
              {value}
            </Typography>
          ))}
        </Box>
        {shortWeekdays.map((day) => (
          <Box position="relative" key={day}>
            {blocks.filter((b) => b.day === day).map((b) => (
              <TimeBlock
                key={`${day}${b.startTime}`}
                startTime={b.startTime}
                endTime={b.endTime}
                blockInfo={b.blockInfo}
              />
            ))}
          </Box>
        ))}
      </Box>
    </div>
  );
}

Timetable.propTypes = {
  schedule: PropTypes.arrayOf(PropTypes.shape({
    day: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    blockInfo: PropTypes.shape({
      courseCode: PropTypes.string,
      sectionType: PropTypes.string,
      sectionNum: PropTypes.string,
    }),
  })),
};

Timetable.defaultProps = {
  schedule: [],
};

export default Timetable;
