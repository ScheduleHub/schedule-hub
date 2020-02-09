import React, { useState, useEffect, useRef } from 'react';
import {
  Button, TextField, Typography, Grid, Modal, Link, List,
  Card, CardContent, CardHeader, CardMedia, Paper, CssBaseline,
  Divider, Snackbar, Fade, Backdrop, createMuiTheme, ThemeProvider,
  Box, CircularProgress, Container, makeStyles, Hidden,
} from '@material-ui/core';
import { Autocomplete, Alert } from '@material-ui/lab';
import { blue } from '@material-ui/core/colors';
import axios from 'axios';
import CourseItem from 'components/CourseItem';
import './index.css';
import { getCourseCode, formatPostData } from 'utils/courses';
import logo from 'res/icon.svg';
import step1 from 'res/calendar-step-1.png';
import step2 from 'res/calendar-step-2.png';
import _ from 'lodash';

const apiKey = '4ad350333dc3859b91bcf443d14e4bf0';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#ffffff',
  },
  currentCoursesList: {
    overflowY: 'scroll',
    height: 360,
  },
  editCourseModal: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
  editCoursePaper: {
    outline: 'none',
    width: 800,
  },
  fillRemainingHeight: { flexGrow: 1 },
  flexContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  fullHeight: { height: '100%' },
  header: { background: '#f5f5f5' },
  marginLeft: { marginLeft: theme.spacing(2) },
  stepImage: { height: 0, paddingTop: '100%' },
  stickBottom: { marginTop: 'auto' },
  stickRight: { marginLeft: 'auto' },
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
  const [snackbarText, setSnackbarText] = useState('');
  const [scheduleImportInput, setScheduleImportInput] = useState(''); // rawCourses
  const [addCourseSubjectInput, setAddCourseSubjectInput] = useState(''); // subjectBox
  const [addCourseNumberInput, setAddCourseNumberInput] = useState(''); // courseNumberBox
  const [addCourseLoading, setAddCourseLoading] = useState(false);

  // Refs
  const addCourseNumberInputRef = useRef(); // courseNumberBoxRef

  // Material UI styles
  const classes = useStyles();

  useEffect( // componentDidMount()
    () => {
      const loadAvailSubjects = async () => {
        const url = 'https://api.uwaterloo.ca/v2/codes/subjects.json';
        const response = await axios.get(url, {
          params: {
            key: apiKey,
          },
        });
        const subjects = response.data.data.map((item) => item.subject);
        setAvailSubjects(subjects);
      };
      loadAvailSubjects();
    },
    [],
  );

  const isValidSchedule = (courseInfo, classNumbers) => {
    const completeClassNumbers = _.flatten(courseInfo).map((obj) => obj.class_number);
    return classNumbers.every((number) => completeClassNumbers.includes(number));
  };

  const showSnackbar = (severity, text) => {
    setSnackbarSeverity(severity);
    setSnackbarText(text);
    setSnackbarOpen(true);
  };

  const hideSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const showScheduleInvalidAlert = () => {
    showSnackbar(
      'warning',
      'Your course info cannot be read.\nPlease make sure it\'s correct and try again.',
    );
  };

  const showSnackbarForAddCourse = () => {
    showSnackbar(
      'warning',
      `${addCourseSubjectInput} ${addCourseNumberInput} is unavailable for this term.`,
    );
  };

  const loadCourseInfo = async (courseNames, classNumbers) => {
    const timeout = 6000;
    const instance = axios.create({
      baseURL: 'https://api.uwaterloo.ca/v2/courses',
      timeout,
    });
    const promises = courseNames.map((str) => {
      const [sub, cata] = str.split(' ');
      return instance.get(`/${sub}/${cata}/schedule.json`, {
        params: {
          key: apiKey,
        },
      });
    });
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
      if (error.message === `timeout of ${timeout}ms exceeded`) {
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
    // this.render(); // TODO: Why do we need this line?
  };

  const loadAvailCourseNumbers = async (subject) => { // TODO: migrate to useEffect()
    if (!subject) {
      setAvailCourseNumbers([]);
      return;
    }
    const url = `https://api.uwaterloo.ca/v2/courses/${subject}.json`;
    const response = await axios.get(url, {
      params: {
        key: apiKey,
      },
    });
    const courseNumbers = response.data.data.map((item) => item.catalog_number);
    setAvailCourseNumbers(courseNumbers);
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
    const url = `https://api.uwaterloo.ca/v2/courses/${addCourseSubjectInput}/${addCourseNumberInput}/schedule.json`;
    const response = await axios.get(url, {
      params: {
        key: apiKey,
      },
    });
    if (response.data.meta.status !== 200) {
      showSnackbar('warning', `${courseCode} is unavailable for this term.`);
      setAddCourseLoading(false);
      return;
    }

    newCurrentCourses.push({
      courseCode,
      keepable: false,
      keep: false,
    });
    const newCourseInfo = coursesInfo.slice();
    newCourseInfo.push(response.data.data);
    setCurrentCourses(newCurrentCourses);
    setCoursesInfo(newCourseInfo);
    setAddCourseLoading(false);
  };

  const handleViewScheduleClick = () => {
    const data = formatPostData(currentCourses, currentClasses, coursesInfo);
    // eslint-disable-next-line no-console
    console.log(data); // TODO: pass data to back-end
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Snackbar
        open={snackbarOpen}
        onClose={hideSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={3000}
      >
        <Alert severity={snackbarSeverity} onClose={hideSnackbar}>
          {snackbarText}
        </Alert>
      </Snackbar>
      <img src={logo} alt="Logo" className="logo" />

      <Container maxWidth="lg">
        <Grid container justify="center" spacing={4}>
          {/* TODO: change spacing to 6 for md and higher */}
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
              <CardContent className={`${classes.flexContainer} ${classes.fillRemainingHeight}`}>
                <Box mb={2}>
                  <Typography variant="body1">Paste into the box below.</Typography>
                </Box>
                <TextField
                  className={classes.fillRemainingHeight}
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
      >
        <Fade in={editCourseModalOpen}>
          <Paper className={classes.editCoursePaper}>
            <Box p={2} className={classes.header}>
              <Typography variant="h5">Edit my courses</Typography>
            </Box>
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
                    className="margin-bottom-16"
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
                    className="margin-bottom-16"
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
