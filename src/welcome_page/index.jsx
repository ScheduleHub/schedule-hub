import React from 'react';
import {
  Button, TextField, Typography, makeStyles, Grid, Modal,
  Card, CardContent, CardHeader, CardMedia, CardActions, Link, Paper, List, CssBaseline, Divider, Snackbar, Fade, Backdrop, createMuiTheme, ThemeProvider,
} from '@material-ui/core';
import { Autocomplete, Alert } from '@material-ui/lab';
import { blue } from '@material-ui/core/colors';
import _ from 'lodash';
import axios from 'axios';
import CourseItem from '../components/CourseItem';
import './index.css';
import { areAssociated, getCourseCode } from '../utils/courses';
import logo from './icon.svg';

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
      showAlert: false,
      rawCourses: '',
      courseInfo: [],
      hideAlert: true,
    };
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

  showModal = () => {
    const { rawCourses } = this.state;
    try {
      this.parseCourses(rawCourses);
      this.setState({
        modalShow: true,
        hideAlert: true,
      });
    } catch (error) {
      this.setState({
        hideAlert: false,
      });
    }
  }

  hideModal = () => {
    this.setState({
      modalShow: false,
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
    if (!subject) return;
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
    const url = `https://api.uwaterloo.ca/v2/courses/${subjectBox}/${courseNumberBox}/schedule.json`;
    const response = await axios.get(url, {
      params: {
        key: apiKey,
      },
    });
    const courseCode = `${subjectBox} ${courseNumberBox}`;
    if (response.data.meta.status !== 200) {
      // this.setState({
      //   showAlert: true,
      // });
      alert(`The course ${courseCode} is unavailable for this term.`);
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
    const grouped = courseInfo.map((/** @type {[]} */ course) => {
      const dict = _.groupBy(course, (s) => s.section[4]);
      const groupedSectionList = [];
      _.forEach(dict, (value, key) => {
        groupedSectionList[key] = value;
      });
      return groupedSectionList;
    });

    const currentCoursesDict = _.keyBy(currentCourses, 'courseCode');

    const associatedClassList = grouped.map((course) => {
      let primary = course[0];
      const keepUnchanged = currentCoursesDict[getCourseCode(primary[0])].keep;
      if (keepUnchanged) {
        primary = primary.filter((section) => currentClasses.includes(section.class_number));
      }

      const other = course.slice(1);
      const rearranged = primary.map((primarySection) => {
        const allowedComponents = other.map((component) => {
          let allowedSections = component.filter(
            (section) => areAssociated(primarySection, section),
          );
          if (_.isEmpty(allowedSections)) {
            allowedSections = component.filter((section) => section.associated_class === 99);
          }
          return _.map(allowedSections, 'class_number');
        });
        return [[primarySection.class_number]].concat(allowedComponents);
      });
      return rearranged;
    });

    const data = {
      courses_info: courseInfo,
      filtered_courses: associatedClassList,
    };
    console.log(data);
  }


  render() {
    const {
      modalShow, currentCourses, allSubjects, courseNumbers, showAlert, subjectBox, courseNumberBox, hideAlert,
    } = this.state;

    return (
      <ThemeProvider theme={theme}>
        <div style={{ padding: 16 }}>
          <CssBaseline />
          <Snackbar open={!hideAlert} autoHideDuration={5000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <Alert severity="warning">
          Your course info cannot be read. Please try again.
            </Alert>
          </Snackbar>
          <img src={logo} alt="Logo" className="Logo" />

          <Grid container justify="center" spacing={4}>
            <Grid item xs={12} md={4} lg={3}>
              <Card raised>
                <CardHeader title="Step 1" style={{ background: '#f5f5f5' }} />
                <CardContent>
                  <Typography variant="body1">
                  Go to&nbsp;
                    <Link href="https://quest.pecs.uwaterloo.ca/psp/SS/ACADEMIC/SA/?cmd=login&languageCd=ENG" target="_blank">Quest</Link>
                  &nbsp;and click &quot;Class Schedule&quot;.
                  </Typography>
                </CardContent>
                <CardMedia
                  image="https://uwflow.com/static/img/import-schedule/step-1.png"
                  title="Go to Class Schedule"
                  style={{ height: 0, paddingTop: '100%' }}
                />
              </Card>
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
              <Card raised>
                <CardHeader title="Step 2" style={{ background: '#f5f5f5' }} />
                <CardContent>
                  <Typography variant="body1">Choose your term, then select all and copy.</Typography>
                </CardContent>
                <CardMedia
                  image="https://uwflow.com/static/img/import-schedule/step-2.png"
                  title="Select All and Copy"
                  style={{ height: 0, paddingTop: '100%' }}
                />
              </Card>
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
              <Card raised style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardHeader title="Step 3" style={{ background: '#f5f5f5' }} />
                <CardContent>
                  <Typography variant="body1" gutterBottom style={{ marginBottom: 16 }}>Paste into the box below.</Typography>
                  <TextField
                    multiline
                    required
                    variant="outlined"
                    fullWidth
                    rows={12}
                    onChange={(e) => this.updateRawCourses(e.target.value)}
                  />
                </CardContent>
                <CardActions style={{ padding: 16, marginTop: 'auto' }}>
                  <Button color="primary" variant="contained" size="large" fullWidth onClick={this.showModal}>Next</Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>

          <Modal
            open={modalShow}
            onClose={this.hideModal}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
            closeAfterTransition
          >
            <Fade in={modalShow}>
              <Paper style={{ width: 800 }}>
                <div style={{ padding: 16, background: '#f5f5f5' }}>
                  <Typography variant="h5">Edit my courses</Typography>
                </div>
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
                    <Autocomplete
                      className="AutoCompleteInput"
                      id="subjectBox"
                      options={allSubjects}
                      renderInput={(params) => (
                        <TextField {...params} label="Subject" variant="outlined" fullWidth />
                      )}
                      onSelect={(e) => {
                        this.loadCourseNumbers(e.target.value);
                        this.setState({
                          subjectBox: e.target.value.toUpperCase(),
                        });
                      }}
                    />
                    <Autocomplete
                      className="AutoCompleteInput"
                      id="courseNumberBox"
                      options={courseNumbers}
                      getOptionLabel={(option) => option}
                      renderInput={(params) => (
                        <TextField {...params} label="Course number" variant="outlined" fullWidth />
                      )}
                      onSelect={(e) => this.setState({
                        courseNumberBox: e.target.value,
                      })}
                    />
                    <div style={{ display: 'flex', padding: '0 16px 16px 16px' }}>
                      <Button color="primary" variant="outlined" onClick={this.handleAddClick} style={{ marginLeft: 'auto' }}>Add Course</Button>
                    </div>
                    {/* TODO: Alert for unavailable course */}
                    {/* <Alert show={showAlert} variant="warning">
                <Alert.Heading>Warning</Alert.Heading>
                <p>
              The course
                  <strong>{` ${subjectBox} ${courseNumberBox} `}</strong>
              is unavailable this term.
                </p>
                <hr />
                <div className="d-flex justify-content-end">
                  <Button onClick={() => this.setState({ showAlert: false })} variant="outline-warning">OK</Button>
                </div>
              </Alert> */}
                  </Grid>
                </Grid>
                <Divider />
                <div style={{ padding: 16 }}>
                  <Button size="large" variant="contained" color="primary" fullWidth onClick={this.handleViewScheduleClick}>View Recommended Schedules</Button>
                </div>
              </Paper>
            </Fade>
          </Modal>
        </div>
      </ThemeProvider>
    );
  }
}

export default WelcomePage;
