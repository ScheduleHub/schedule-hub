import React, { useState, useEffect, useRef } from 'react';
import {
  Button, TextField, Typography, Grid, Modal, Link, List,
  Card, CardContent, CardHeader, CardMedia, Paper, CssBaseline,
  Divider, Snackbar, Fade, Backdrop, createMuiTheme, ThemeProvider,
  Box, CircularProgress, Container, makeStyles, Hidden, IconButton,
  AppBar, Toolbar, Tooltip, Slider, Popover,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { Autocomplete, Alert, AlertTitle } from '@material-ui/lab';
import { blue } from '@material-ui/core/colors';
import axios from 'axios';
import CourseItem from 'components/CourseItem';
import {
  getCourseCode, formatPostData, isOnline, perm,
} from 'utils/courses';
import UWAPI from 'utils/uwapi';
import logo from 'res/icon.svg';
import step1 from 'res/calendar-step-1.png';
import step2 from 'res/calendar-step-2.png';
import _ from 'lodash';
import { Close } from '@material-ui/icons';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

const apiKey = '4ad350333dc3859b91bcf443d14e4bf0';
const uwapi = new UWAPI(apiKey);
// TODO: terms

const useStyles = makeStyles((theme) => ({
  addCourseInput: {
    marginBottom: theme.spacing(2),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#ffffff',
  },
  currentCoursesList: {
    overflowY: 'scroll',
    height: '100%',
  },
  preferenceHeader: {
    color: 'rgba(0, 0, 0, 0.54)',
  },
  editCourseModal: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
  editCoursePaper: {
    outline: 'none',
    width: 750,
  },
  flexContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  flexGrow: {
    flexGrow: 1,
  },
  fullHeight: { height: '100%' },
  header: { background: '#f5f5f5' },
  logo: {
    display: 'block',
    height: '16vmin',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  marginLeft: { marginLeft: theme.spacing(2) },
  stepImage: { height: 0, paddingTop: '100%' },
  stickBottom: { marginTop: 'auto' },
  stickRight: { marginLeft: 'auto' },
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(1),
  },
}));

const theme = createMuiTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 1024,
      lg: 1440,
      xl: 1920,
    },
  },
  palette: {
    primary: {
      main: blue[500],
      light: '#6ec6ff',
      dark: '#0069c0',
    },
  },
});

function PreferenceSlider(props) {
  const {
    label, helpMsg, leftLabel, rightLabel, sliderValue, handleSliderValueChange,
  } = props;

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box>
      <Typography component="span" gutterBottom className={classes.preferenceHeader}>
        <Box display="inline" fontWeight="fontWeightMedium">{`${label} `}</Box>
        <Typography
          display="inline"
          aria-owns={open ? 'mouse-over-popover' : undefined}
          aria-haspopup="true"
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
        >
          <HelpOutlineIcon
            color="action"
            fontSize="small"
          />
        </Typography>
        <Popover
          id="mouse-over-popover"
          className={classes.popover}
          classes={{
            paper: classes.paper,
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
        >
          <Typography style={{ whiteSpace: 'pre' }}>{helpMsg}</Typography>
        </Popover>
      </Typography>
      <Grid container spacing={1}>
        <Grid item>
          <Typography color="textSecondary">{leftLabel}</Typography>
        </Grid>
        <Grid item xs>
          <Slider
            display="inline"
            value={sliderValue}
            onChange={(e, v) => handleSliderValueChange(e, v)}
          />
        </Grid>
        <Grid item>
          <Typography color="textSecondary">{rightLabel}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

PreferenceSlider.propTypes = {
  label: PropTypes.string.isRequired,
  helpMsg: PropTypes.string.isRequired,
  leftLabel: PropTypes.string.isRequired,
  rightLabel: PropTypes.string.isRequired,
  sliderValue: PropTypes.number.isRequired,
  handleSliderValueChange: PropTypes.func.isRequired,
};

function WelcomePage() {
  // Data states
  const [coursesInfo, setCoursesInfo] = useState([]); // courseInfo
  const [availSubjects, setAvailSubjects] = useState([]); // allSubjects
  const [availCourseNumbers, setAvailCourseNumbers] = useState([]); // courseNumbers
  const [currentClasses, setCurrentClasses] = useState([]);
  const [currentCourses, setCurrentCourses] = useState([]);

  // UI states
  const [editCourseModalOpen, setEditCourseModalOpen] = useState(false); // modalShow
  const [fullPageLoading, setFullPageLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState(''); // snackbarTheme
  const [snackbarTitle, setSnackbarTitle] = useState('');
  const [snackbarText, setSnackbarText] = useState('');
  const [scheduleImportInput, setScheduleImportInput] = useState(''); // rawCourses
  const [addCourseSubjectInput, setAddCourseSubjectInput] = useState(''); // subjectBox
  const [addCourseNumberInput, setAddCourseNumberInput] = useState(''); // courseNumberBox
  const [addCourseLoading, setAddCourseLoading] = useState(false);
  const [firstClassSliderValue, setFirstClassSliderValue] = useState(50);
  const [evenDistSliderValue, setEvenDistSliderValue] = useState(50);
  const [clusterClassSliderValue, setClusterClassSliderValue] = useState(50);

  // Refs
  const addCourseNumberInputRef = useRef(); // courseNumberBoxRef

  // Material UI styles
  const classes = useStyles();


  const showSnackbar = (severity, text, title) => {
    setSnackbarSeverity(severity);
    setSnackbarText(text);
    setSnackbarTitle(title || '');
    setSnackbarOpen(true);
  };

  const hideSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  useEffect( // componentDidMount()
    () => {
      const loadAvailSubjects = async () => {
        try {
          const subjects = await uwapi.getSubjectCodes();
          setAvailSubjects(subjects);
        } catch (error) {
          showSnackbar('error', 'Unable to load courses.');
        }
      };
      loadAvailSubjects();
    },
    [],
  );

  const isValidSchedule = (courseInfo, classNumbers) => {
    const completeClassNumbers = _.flatten(courseInfo).map((obj) => obj.class_number);
    return classNumbers.every((number) => completeClassNumbers.includes(number));
  };


  const showScheduleInvalidAlert = () => {
    showSnackbar(
      'warning',
      'Please make sure it\'s correct and try again.',
      'Your course info cannot be read',
    );
  };

  const loadCourseInfo = async (courseNames, classNumbers) => {
    const promises = uwapi.getCourseScheduleMulti(courseNames);
    setFullPageLoading(true);
    axios.all(promises).then((values) => {
      const courseInfo = values.map((value) => value.data.data);
      if (isValidSchedule(courseInfo, classNumbers)) {
        setCoursesInfo(courseInfo);
        setCurrentCourses(courseNames.map(
          (item) => ({ courseCode: item, keepable: true, keep: true }),
        ));
        setCurrentClasses(classNumbers);
        setEditCourseModalOpen(true);
      } else {
        showScheduleInvalidAlert();
      }
    }).catch((error) => {
      if (error.message.startsWith('timeout')) {
        showSnackbar('error', 'Network Timeout');
      } else {
        showSnackbar('error', error.message);
      }
    }).finally(() => {
      setScheduleImportInput('');
      setFullPageLoading(false);
    });
  };

  const parseCourses = (rawCourses) => {
    const classNumbers = rawCourses.match(/^\d{4}$/gm);
    const courseNames = rawCourses.match(/[A-Z]{2,6} \d{1,3}[A-Z]? - /g).map((x) => x.substring(0, x.length - 3));
    if (rawCourses.match(/^\d{3}$/gm).length !== classNumbers.length || rawCourses.match(/^0\d{2}$/gm).length !== courseNames.length) {
      showScheduleInvalidAlert();
      return;
    }
    loadCourseInfo(courseNames, classNumbers.map((item) => parseInt(item, 10)));
  };

  const showModal = (rawCourses) => {
    try {
      parseCourses(rawCourses);
    } catch (error) {
      showScheduleInvalidAlert();
    }
  };

  const closeEditCourseModal = () => {
    setEditCourseModalOpen(false);
    setAddCourseSubjectInput('');
    setAddCourseNumberInput('');
    setAvailCourseNumbers([]);
  };

  const dropCourse = (courseCode) => {
    const newCurrentCourses = currentCourses.filter((item) => item.courseCode !== courseCode);
    const newCourseInfo = coursesInfo.filter((item) => getCourseCode(item[0]) !== courseCode);
    setCurrentCourses(newCurrentCourses);
    setCoursesInfo(newCourseInfo);
  };

  const loadAvailCourseNumbers = async (subject) => {
    if (!subject) {
      setAvailCourseNumbers([]);
      return;
    }
    try {
      const courseNumbers = await uwapi.getCourseNumbers(subject);
      setAvailCourseNumbers(courseNumbers);
    } catch (error) {
      setAvailCourseNumbers([]);
    }
  };

  const handleKeepCourseClick = (courseCode) => {
    const newCurrentCourses = currentCourses.map((course) => (
      (course.courseCode === courseCode) ? { ...course, keep: !course.keep } : course
    ));
    setCurrentCourses(newCurrentCourses);
  };

  const handleAddClick = async () => {
    if (!addCourseSubjectInput || !addCourseNumberInput) {
      return;
    }
    setAddCourseLoading(true);
    const courseCode = `${addCourseSubjectInput} ${addCourseNumberInput}`;
    const newCurrentCourses = currentCourses.slice();
    if (newCurrentCourses.some((item) => courseCode === item.courseCode)) {
      showSnackbar('info', `${courseCode} is already in your schedule.`);
      setAddCourseLoading(false);
      return;
    }

    try {
      const classesInfo = await uwapi.getCourseSchedule(
        addCourseSubjectInput, addCourseNumberInput,
      );
      if (classesInfo.every(isOnline)) {
        const error = new Error(`${courseCode} is only available online.`);
        error.name = 'UW online';
        throw error;
      }
      newCurrentCourses.push({
        courseCode,
        keepable: false,
        keep: false,
      });
      const newCourseInfo = coursesInfo.slice();
      newCourseInfo.push(classesInfo);
      setCurrentCourses(newCurrentCourses);
      setCoursesInfo(newCourseInfo);
    } catch (error) {
      if (error.name === 'UW 204') {
        showSnackbar('warning', `${courseCode} is unavailable for this term.`);
      } else if (error.name === 'UW online') {
        showSnackbar('warning', error.message);
      } else if (error.message.startsWith('timeout')) {
        showSnackbar('error', 'Network Timeout');
      } else {
        showSnackbar('error', error.message);
      }
    } finally {
      setAddCourseLoading(false);
    }
  };

  const handleViewScheduleClick = async () => {
    const data = formatPostData(currentCourses, currentClasses, coursesInfo);
    if (perm(data.filtered_courses).length > 200000) {
      showSnackbar('warning', 'Try locking some of your courses or reduce the number of courses.', 'Too many course combinations');
      return;
    }
    data.preferences = [firstClassSliderValue, evenDistSliderValue, clusterClassSliderValue];
    const url = 'https://qemn8c6rx9.execute-api.us-east-2.amazonaws.com/test/handleschedulerequest';
    try {
      const response = await axios.post(url, data, { timeout: 15000 });
      console.log(response);
    } catch (error) {
      if (error.message.startsWith('timeout')) {
        showSnackbar('error', 'Network Timeout');
      } else {
        showSnackbar('error', error.message);
      }
    }
  };

  const handlePaste = (pasteText) => {
    try {
      hideSnackbar();
      setScheduleImportInput(pasteText);
      showModal(pasteText);
    } catch (error) {
      showSnackbar('error', error.message);
    }
  };

  const handleFirstClassSliderChange = (event, value) => setFirstClassSliderValue(value);

  const handleEvenDistSliderChange = (event, value) => setEvenDistSliderValue(value);

  const handleClusterClassSliderChange = (event, value) => setClusterClassSliderValue(value);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Snackbar
        open={snackbarOpen}
        onClose={hideSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={4000}
      >
        <Alert severity={snackbarSeverity} onClose={hideSnackbar}>
          {snackbarTitle && <AlertTitle>{snackbarTitle}</AlertTitle>}
          {snackbarText}
        </Alert>
      </Snackbar>
      <img src={logo} alt="Logo" className={classes.logo} />

      <Container maxWidth="lg">
        <Grid container justify="center" spacing={4}>
          <Grid item xs={12} sm={10} md>
            <Card raised>
              <CardHeader title="Step 1" className={classes.header} />
              <CardContent>
                <Typography variant="body1">
                  Go to&nbsp;
                  <Link href="https://quest.pecs.uwaterloo.ca/psp/SS/ACADEMIC/SA/?cmd=login&languageCd=ENG" target="_blank">Quest</Link>
                  , click &quot;Class Schedule&quot;.
                </Typography>
              </CardContent>
              <CardMedia
                image={step1}
                title="Go to Class Schedule"
                className={classes.stepImage}
              />
            </Card>
          </Grid>
          <Grid item xs={12} sm={10} md>
            <Card className={`${classes.flexContainer} ${classes.fullHeight}`} raised>
              <CardHeader title="Step 2" className={classes.header} />
              <CardContent>
                <Typography variant="body1">Select all and copy.</Typography>
              </CardContent>
              <CardMedia
                image={step2}
                title="Select All and Copy"
                className={`${classes.stepImage} ${classes.stickBottom}`}
              />
            </Card>
          </Grid>
          <Grid item xs={12} sm={10} md>
            <Card className={`${classes.flexContainer} ${classes.fullHeight}`} raised>
              <CardHeader title="Step 3" className={classes.header} />
              <CardContent className={`${classes.flexContainer} ${classes.flexGrow}`}>
                <Box mb={2}>
                  <Typography variant="body1">Paste into the box below.</Typography>
                </Box>
                <TextField
                  className={classes.flexGrow}
                  value={scheduleImportInput}
                  onPaste={(e) => handlePaste(e.clipboardData.getData('text/plain'))}
                  multiline
                  required
                  variant="outlined"
                  fullWidth
                  rows={12}
                  InputProps={{
                    className: classes.fullHeight,
                  }}
                  inputProps={{
                    className: classes.fullHeight,
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Modal
        open={editCourseModalOpen}
        onClose={closeEditCourseModal}
        className={classes.editCourseModal}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        closeAfterTransition
        disableBackdropClick
      >
        <Fade in={editCourseModalOpen}>
          <Paper className={classes.editCoursePaper}>
            <AppBar position="static" color="default" elevation={0}>
              <Toolbar>
                <Typography variant="h6" className={classes.flexGrow}>Edit my courses</Typography>
                <Tooltip title="Close">
                  <IconButton aria-label="close" onClick={closeEditCourseModal}>
                    <Close />
                  </IconButton>
                </Tooltip>
              </Toolbar>
            </AppBar>
            <Grid container>
              <Grid item xs={12} sm>
                <List className={classes.currentCoursesList}>
                  {currentCourses.map((item) => {
                    const { courseCode, keepable, keep } = item;
                    return (
                      <CourseItem
                        key={courseCode}
                        courseCode={courseCode}
                        keepable={keepable}
                        keep={keep}
                        onDropClick={() => dropCourse(courseCode)}
                        onKeepClick={() => handleKeepCourseClick(courseCode)}
                      />
                    );
                  })}
                </List>
                <Hidden smUp>
                  <Divider />
                </Hidden>
              </Grid>
              <Grid item xs={12} sm>
                <Box p={2} display="flex" flexDirection="column">
                  <Autocomplete
                    className={classes.addCourseInput}
                    id="subjectBox"
                    options={availSubjects}
                    renderInput={(params) => (
                      <TextField
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...params}
                        label="Subject"
                        variant="outlined"
                        fullWidth
                      />
                    )}
                    onChange={(_event, value) => {
                      if (value === addCourseSubjectInput) {
                        return;
                      }
                      loadAvailCourseNumbers(value);
                      setAddCourseSubjectInput((value || '').toUpperCase());
                      setAddCourseNumberInput('');
                      if (value) {
                        addCourseNumberInputRef.current.focus();
                      }
                    }}
                    value={addCourseSubjectInput}
                  />
                  <Autocomplete
                    className={classes.addCourseInput}
                    id="courseNumberBox"
                    options={availCourseNumbers}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => (
                      <TextField
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...params}
                        label="Course number"
                        variant="outlined"
                        fullWidth
                        inputRef={addCourseNumberInputRef}
                      />
                    )}
                    onChange={(_event, value) => {
                      setAddCourseNumberInput(value);
                    }}
                    value={addCourseNumberInput}
                  />
                  <Box mx={0} display="flex" alignItems="center" justifyContent="flex-end">
                    {addCourseLoading && <CircularProgress size={36 / Math.sqrt(2)} />}
                    <Button
                      color="primary"
                      variant="outlined"
                      onClick={handleAddClick}
                      className={classes.marginLeft}
                      disabled={addCourseLoading}
                    >
                      Add Course
                    </Button>
                  </Box>
                  <Box paddingTop={2} px={1}>
                    <PreferenceSlider
                      label="First Class"
                      helpMsg="whether you prefer to start your day early"
                      leftLabel="Early"
                      rightLabel="Late"
                      sliderValue={firstClassSliderValue}
                      handleSliderValueChange={handleFirstClassSliderChange}
                    />
                    <PreferenceSlider
                      label="Even Distribution"
                      helpMsg="whether you prefer to have approximately same number of classes everyday"
                      leftLabel="Even"
                      rightLabel="Uneven"
                      sliderValue={evenDistSliderValue}
                      handleSliderValueChange={handleEvenDistSliderChange}
                    />
                    <PreferenceSlider
                      label="Cluster Classes"
                      helpMsg="whether you prefer to have your classes back to back or separately"
                      leftLabel="Together"
                      rightLabel="Separate"
                      sliderValue={clusterClassSliderValue}
                      handleSliderValueChange={handleClusterClassSliderChange}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
            <Divider />
            <Box p={2}>
              <Button
                size="large"
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleViewScheduleClick}
                disabled={addCourseLoading}
              >
                View Recommended Schedules
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Modal>
      <Backdrop
        className={classes.backdrop}
        open={fullPageLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </ThemeProvider>
  );
}
export default WelcomePage;
