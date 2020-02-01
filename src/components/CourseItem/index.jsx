import React from 'react';
import {
  ListItem, ListItemText, ListItemSecondaryAction, IconButton, Tooltip,
} from '@material-ui/core';
import { Close, Lock, LockOpen } from '@material-ui/icons';

function CourseItem(props) {
  const {
    courseCode, keepable, keep, onDropClick,
  } = props;

  return (
    <ListItem>
      <ListItemText primary={courseCode} />
      <ListItemSecondaryAction>
        {/* TODO: Keep toggle */}
        <Tooltip
          title={keep
            ? 'This course will be kept unchanged in the schedule.'
            : 'This course is allowed to be changed'}
        >
          <IconButton aria-label="keep unchanged" disabled={!keepable || true}>
            {/* Remove || true when implementing keepable */}
            {keep ? <Lock /> : <LockOpen />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Drop this course">
          <IconButton aria-label="drop" onClick={onDropClick}>
            <Close />
          </IconButton>
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export default CourseItem;
