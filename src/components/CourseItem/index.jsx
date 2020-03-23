import React from 'react';
import PropTypes from 'prop-types';
import {
  ListItem, ListItemText, ListItemSecondaryAction, IconButton, Tooltip, Hidden,
} from '@material-ui/core';
import { RemoveCircleOutline, Lock, LockOpen } from '@material-ui/icons';

function CourseItem(props) {
  const {
    courseCode, keepable, keep, onDropClick, onKeepClick, disabled,
  } = props;

  return (
    <ListItem>
      <ListItemText primary={courseCode} />
      <ListItemSecondaryAction>
        {/* TODO: Keep toggle */}
        <Hidden xsUp={!keepable}>
          <Tooltip
            title={keep
              ? 'This course will be kept unchanged in the schedule.'
              : 'This course is allowed to be changed'}
          >
            <span>
              <IconButton
                aria-label="keep unchanged"
                disabled={!keepable || disabled}
                onClick={onKeepClick}
              >
                {keep ? <Lock /> : <LockOpen />}
              </IconButton>
            </span>
          </Tooltip>
        </Hidden>
        <Tooltip title="Drop this course">
          <IconButton aria-label="drop" onClick={onDropClick} disabled={disabled}>
            <RemoveCircleOutline />
          </IconButton>
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

CourseItem.propTypes = {
  courseCode: PropTypes.string.isRequired,
  keepable: PropTypes.bool.isRequired,
  keep: PropTypes.bool.isRequired,
  onDropClick: PropTypes.func.isRequired,
  onKeepClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default CourseItem;
