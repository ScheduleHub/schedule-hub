import React from 'react';
import {
  Button, TextField, Typography, Grid, Modal, Link, List,
  Card, CardContent, CardHeader, CardMedia, Paper, CssBaseline,
  Divider, Snackbar, Fade, Backdrop, createMuiTheme, ThemeProvider,
  Box, CircularProgress, Container,
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

const theme = createMuiTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 1152,
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

// const useStyles = makeStyles((theme) => ({
//   screenshot: {
//     height: 300,
//   },
// }));

class WelcomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalShow: false,
      currentCourses: [],
      currentClasses: [],
      allSubjects: [],
      courseNumbers: [],
      subjectBox: '',
      courseNumberBox: '',
      rawCourses: '',
      courseInfo: [],
      snackbarOpen: false,
      snackbarTheme: '',
      snackbarText: '',
      fullPageOverlayOpen: false,
    };
    this.courseNumberBoxRef = React.createRef();
  }

  componentDidMount() {
    this.loadSubjects();
  }

  isValidSchedule = (courseInfo, classNumbers) => {
    const completeClassNumbers = _.flatten(courseInfo).map((obj) => obj.class_number);
    return classNumbers.every((number) => completeClassNumbers.includes(number));
  }

  loadCourseInfo = async (courseNames, classNumbers) => {
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
    this.setState({ fullPageOverlayOpen: true });
    axios.all(promises).then((values) => {
      const courseInfo = values.map((value) => value.data.data);
      if (this.isValidSchedule(courseInfo, classNumbers)) {
        this.setState({
          courseInfo,
          currentCourses: courseNames.map(
            (item) => ({ courseCode: item, keepable: true, keep: true }),
          ),
          currentClasses: classNumbers,
          modalShow: true,
        });
      } else {
        this.showScheduleInvalidAlert();
      }
    }).catch((error) => {
      if (error.message === `timeout of ${timeout}ms exceeded`) {
        this.showSnackbar('error', 'Network Timeout');
      } else {
        this.showSnackbar('error', error.message);
      }
    }).finally(() => {
      this.setState({ fullPageOverlayOpen: false });
    });
  }

  parseCourses = (rawCourses) => {
    const classNumbers = rawCourses.match(/^\d{4}$/gm);
    const courseNames = rawCourses.match(/[A-Z]{2,6} \d{1,3}[A-Z]? - /g).map((x) => x.substring(0, x.length - 3));
    if (rawCourses.match(/^\d{3}$/gm).length !== classNumbers.length || rawCourses.match(/^0\d{2}$/gm).length !== courseNames.length) {
      this.showScheduleInvalidAlert();
      return;
    }
    this.loadCourseInfo(courseNames, classNumbers.map((item) => parseInt(item, 10)));
  }

  showScheduleInvalidAlert = () => this.showSnackbar('warning', 'Your course info cannot be read.\nPlease make sure it\'s correct and try again.');

  showCourseUnavailAlert = () => {
    const { subjectBox, courseNumberBox } = this.state;
    this.showSnackbar('warning', `${subjectBox} ${courseNumberBox} is unavailable for this term.`);
  }

  hideSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ snackbarOpen: false });
  }

  showModal = (rawCourses) => {
    try {
      this.parseCourses(rawCourses);
    } catch (error) {
      this.showScheduleInvalidAlert();
    }
  }

  hideModal = () => {
    this.setState({
      modalShow: false,
      subjectBox: '',
      courseNumberBox: '',
      courseNumbers: [],
      rawCourses: '',
    });
  }

  showSnackbar = (snackbarTheme, snackbarText) => {
    this.setState({
      snackbarTheme, snackbarText, snackbarOpen: true, rawCourses: '',
    });
  }

  hideSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ snackbarOpen: false });
  }

  dropCourse = (courseCode) => {
    const { currentCourses, courseInfo } = this.state;
    const newCurrentCourses = currentCourses.filter((item) => item.courseCode !== courseCode);
    const newCourseInfo = courseInfo.filter((item) => getCourseCode(item[0]) !== courseCode);
    this.setState({
      currentCourses: newCurrentCourses,
      courseInfo: newCourseInfo,
    });
    this.render();
  }

  loadSubjects = async () => {
    const url = 'https://api.uwaterloo.ca/v2/codes/subjects.json';
    const response = await axios.get(url, {
      params: {
        key: apiKey,
      },
    });
    const allSubjects = response.data.data.map((item) => item.subject);
    this.setState({
      allSubjects,
    });
  }

  loadCourseNumbers = async (subject) => {
    if (!subject) {
      this.setState({ courseNumbers: [] });
      return;
    }
    const url = `https://api.uwaterloo.ca/v2/courses/${subject}.json`;
    const response = await axios.get(url, {
      params: {
        key: apiKey,
      },
    });
    const courseNumbers = response.data.data.map((item) => item.catalog_number);
    this.setState({
      courseNumbers,
    });
  }

  handleRawCoursesInputChange = (rawCourses) => {
    this.setState({ rawCourses });
  }

  handleAddClick = async () => {
    const {
      subjectBox, courseNumberBox, currentCourses, courseInfo,
    } = this.state;
    if (!subjectBox || !courseNumberBox) {
      return;
    }
    const url = `https://api.uwaterloo.ca/v2/courses/${subjectBox}/${courseNumberBox}/schedule.json`;
    const response = await axios.get(url, {
      params: {
        key: apiKey,
      },
    });
    const courseCode = `${subjectBox} ${courseNumberBox}`;
    if (response.data.meta.status !== 200) {
      this.showCourseUnavailAlert();
      return;
    }

    const newCurrentCourses = currentCourses.slice();
    if (newCurrentCourses.filter((item) => courseCode === item.courseCode).length) {
      return;
    }
    newCurrentCourses.push({
      courseCode,
      keepable: false,
      keep: false,
    });
    const newCourseInfo = courseInfo.slice();
    newCourseInfo.push(response.data.data);
    this.setState({
      currentCourses: newCurrentCourses,
      courseInfo: newCourseInfo,
    });
  }

  handleViewScheduleClick = () => {
    const { currentCourses, currentClasses, courseInfo } = this.state;
    const data = formatPostData(currentCourses, currentClasses, courseInfo);
    // eslint-disable-next-line no-console
    console.log(data);
  }

  handlePaste = (pasteText) => {
    try {
      this.hideSnackbar();
      this.setState({ rawCourses: pasteText });
      this.showModal(pasteText);
    } catch (error) {
      this.showSnackbar('error', error.message);
    }
  }

  render() {
    const {
      modalShow, currentCourses, allSubjects, courseNumbers,
      subjectBox, courseNumberBox, fullPageOverlayOpen,
      rawCourses, snackbarTheme, snackbarOpen, snackbarText,
    } = this.state;

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Snackbar
          open={snackbarOpen}
          onClose={this.hideSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          autoHideDuration={3000}
        >
          <Alert severity={snackbarTheme} onClose={this.hideSnackbar}>
            {snackbarText}
          </Alert>
        </Snackbar>
        <img src={logo} alt="Logo" className="logo" />

        <Container maxWidth="lg">
          <Grid container justify="center" spacing={4}>
            {/* TODO: change spacing to 6 for md and higher */}
            <Grid item xs={12} md>
              <Card className="card" raised>
                <CardHeader title="Step 1" className="header" />
                <CardContent>
                  <Typography variant="body1">
                      Go to&nbsp;
                    <Link href="https://quest.pecs.uwaterloo.ca/psp/SS/ACADEMIC/SA/?cmd=login&languageCd=ENG" target="_blank">Quest</Link>
                      &nbsp;and click &quot;Class Schedule&quot;.
                  </Typography>
                </CardContent>
                <CardMedia
                  image={step1}
                  title="Go to Class Schedule"
                  className="step-img"
                />
              </Card>
            </Grid>
            <Grid item xs={12} md>
              <Card className="card" raised style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardHeader title="Step 2" className="header" />
                <CardContent>
                  <Typography variant="body1">Choose your term, select all and copy.</Typography>
                </CardContent>
                <CardMedia
                  image={step2}
                  title="Select All and Copy"
                  className="step-img stick-bottom"
                />
              </Card>
            </Grid>
            <Grid item xs={12} md>
              <Card raised style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardHeader title="Step 3" className="header" />
                <CardContent style={{
                  display: 'flex', flexDirection: 'column', flexGrow: 1, paddingBottom: '16px',
                }}
                >
                  <Box mb={2}>
                    <Typography variant="body1">Paste into the box below.</Typography>
                  </Box>
                  <TextField
                    style={{ flexGrow: 1 }}
                    value={rawCourses}
                    onPaste={(e) => this.handlePaste(e.clipboardData.getData('text/plain'))}
                    multiline
                    required
                    variant="outlined"
                    fullWidth
                    rows={12}
                    onChange={(e) => this.handleRawCoursesInputChange(e.target.value)}
                    InputProps={{
                      style: { height: '100%' },
                    }}
                      // eslint-disable-next-line react/jsx-no-duplicate-props
                    inputProps={{
                      style: { height: '100%' },
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>

        <Modal
          open={modalShow}
          onClose={this.hideModal}
          className="flex-container"
          style={{ alignItems: 'center', justifyContent: 'center' }}
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
          closeAfterTransition
        >
          <Fade in={modalShow}>
            <Paper style={{ width: 800, outline: 'none' }}>
              <Box p={2} className="header">
                <Typography variant="h5">Edit my courses</Typography>
              </Box>
              <Grid container>
                <Grid item xs={12} sm>
                  <List style={{ overflowY: 'scroll', height: 360 }}>
                    {currentCourses.map((item) => {
                      const { courseCode, keepable, keep } = item;
                      return (
                        <CourseItem
                          key={courseCode}
                          courseCode={courseCode}
                          keepable={keepable}
                          keep={keep}
                          onDropClick={() => this.dropCourse(courseCode)}
                        />
                      );
                    })}
                  </List>
                </Grid>
                <Grid item xs={12} sm>
                  <Box p={2}>
                    <Autocomplete
                      className="margin-bottom-16"
                      id="subjectBox"
                      options={allSubjects}
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
                        if (value === subjectBox) {
                          return;
                        }
                        this.loadCourseNumbers(value);
                        this.setState({
                          subjectBox: (value || '').toUpperCase(),
                          courseNumberBox: '',
                        });
                        if (value) {
                          this.courseNumberBoxRef.current.focus();
                        }
                      }}
                      value={subjectBox}
                    />
                    <Autocomplete
                      className="margin-bottom-16"
                      id="courseNumberBox"
                      options={courseNumbers}
                      getOptionLabel={(option) => option}
                      renderInput={(params) => (
                        <TextField
                            // eslint-disable-next-line react/jsx-props-no-spreading
                          {...params}
                          label="Course number"
                          variant="outlined"
                          fullWidth
                          inputRef={this.courseNumberBoxRef}
                        />
                      )}
                      onChange={(_event, value) => {
                        this.setState({
                          courseNumberBox: value,
                        });
                      }}
                      value={courseNumberBox}
                    />
                    <div className="flex-container">
                      <Box ml="auto">
                        <Button color="primary" variant="outlined" onClick={this.handleAddClick}>Add Course</Button>
                      </Box>
                    </div>
                  </Box>
                </Grid>
              </Grid>
              <Divider />
              <Box p={2}>
                <Button size="large" variant="contained" color="primary" fullWidth onClick={this.handleViewScheduleClick}>View Recommended Schedules</Button>
              </Box>
            </Paper>
          </Fade>
        </Modal>
        <Backdrop
          style={{
            zIndex: theme.zIndex.drawer + 1,
            color: '#fff',
          }}
          open={fullPageOverlayOpen}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </ThemeProvider>
    );
  }
}

export default WelcomePage;
