import React from 'react';
import {
  Button, TextField, Typography, makeStyles, Grid, Modal, Link, List,
  Card, CardContent, CardHeader, CardMedia, CardActions,
  Paper, CssBaseline, Divider, Snackbar, Fade, Backdrop, createMuiTheme, ThemeProvider, Box,
} from '@material-ui/core';
import { Autocomplete, Alert } from '@material-ui/lab';
import { blue } from '@material-ui/core/colors';
import _ from 'lodash';
import axios from 'axios';
import CourseItem from 'components/CourseItem';
import './index.css';
import { areAssociated, getCourseCode, formatPostData } from 'utils/courses';
import logo from 'res/icon.svg';
import step1 from 'res/calendar-step-1.png';
import step2 from 'res/calendar-step-2.png';

const apiKey = '4ad350333dc3859b91bcf443d14e4bf0';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: blue[500],
      light: '#6ec6ff',
      dark: '#0069c0',
    },
  },
});

const useStyles = makeStyles((theme) => ({
  screenshot: {
    height: 300,
  },
}));

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
      courseUnavailAlertShow: false,
      rawCourses: '',
      courseInfo: [],
      scheduleInvalidAlertShow: false,
    };
    this.courseNumberBoxRef = React.createRef();
  }

  componentDidMount() {
    this.loadSubjects();
  }

  loadCourseInfo = async (courseNames) => {
    const allUrl = courseNames.map((str) => {
      const [sub, cata] = str.split(' ');
      return `https://api.uwaterloo.ca/v2/courses/${sub}/${cata}/schedule.json`;
    });
    Promise.all(allUrl.map((url) => axios.get(url, {
      params: {
        key: apiKey,
      },
    }))).then((values) => {
      const courseInfo = values.map((value) => value.data.data);
      console.log(courseInfo);
      this.setState({ courseInfo });
    });
  }

  parseCourses = (rawCourses) => {
    const classNumbers = rawCourses.match(/^\d{4}$/gm);
    const courseNames = rawCourses.match(/[A-Z]{2,6} \d{1,3}[A-Z]? - /g).map((x) => x.substring(0, x.length - 3));

    this.setState({
      currentCourses: courseNames.map(
        (item) => ({ courseCode: item, keepable: true, keep: true }),
      ),
      currentClasses: classNumbers.map((item) => parseInt(item, 10)),
    });
    this.loadCourseInfo(courseNames);
  }

  showScheduleInvalidAlert = () => this.setState({ scheduleInvalidAlertShow: true });

  hideScheduleInvalidAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ scheduleInvalidAlertShow: false });
  }

  showCourseUnavailAlert = () => this.setState({ courseUnavailAlertShow: true });

  hideCourseUnavailAlert = () => this.setState({ courseUnavailAlertShow: false });

  showModal = () => {
    const { rawCourses } = this.state;
    try {
      this.parseCourses(rawCourses);
      this.setState({
        modalShow: true,
      });
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
    });
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

  updateRawCourses = (rawCourses) => {
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
    console.log(data);
  }

  render() {
    const {
      modalShow, currentCourses, allSubjects, courseNumbers,
      subjectBox, courseNumberBox, scheduleInvalidAlertShow, courseUnavailAlertShow,
    } = this.state;

    return (
      <ThemeProvider theme={theme}>
        <Box p={2}>
          <CssBaseline />
          <Snackbar
            open={scheduleInvalidAlertShow}
            onClose={this.hideScheduleInvalidAlert}
            autoHideDuration={3000}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert severity="warning" onClose={this.hideScheduleInvalidAlert}>
              Your course info cannot be read. Please try again.
            </Alert>
          </Snackbar>
          <img src={logo} alt="Logo" className="logo" />

          <Grid container justify="center" spacing={4}>
            <Grid item xs={12} md={4} lg={3}>
              <Card raised>
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
            <Grid item xs={12} md={4} lg={3}>
              <Card raised>
                <CardHeader title="Step 2" className="header" />
                <CardContent>
                  <Typography variant="body1">Choose your term, then select all and copy.</Typography>
                </CardContent>
                <CardMedia
                  image={step2}
                  title="Select All and Copy"
                  className="step-img"
                />
              </Card>
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
              <Card raised style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardHeader title="Step 3" className="header" />
                <CardContent>
                  <Box mb={2}>
                    <Typography variant="body1">Paste into the box below.</Typography>
                  </Box>
                  <TextField
                    multiline
                    required
                    variant="outlined"
                    fullWidth
                    rows={12}
                    onChange={(e) => this.updateRawCourses(e.target.value)}
                  />
                </CardContent>
                <CardActions className="stick-bottom">
                  <Box p={1} width={1}>
                    <Button color="primary" variant="contained" size="large" fullWidth onClick={this.showModal}>Next</Button>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          </Grid>

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
                          <TextField {...params}
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
                          <TextField {...params}
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
                      <Snackbar
                        open={courseUnavailAlertShow}
                        onClose={this.hideCourseUnavailAlert}
                        autoHideDuration={3000}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                      >
                        <Alert severity="warning" onClose={this.hideCourseUnavailAlert}>
                          {`${subjectBox} ${courseNumberBox}`}
                          &nbsp;is unavailable for this term.
                        </Alert>
                      </Snackbar>
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
        </Box>
      </ThemeProvider>
    );
  }
}

export default WelcomePage;
