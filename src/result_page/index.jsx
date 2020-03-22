import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  AppBar,
  Backdrop,
  CircularProgress,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  CssBaseline,
  ThemeProvider,
  createMuiTheme,
  makeStyles,
} from '@material-ui/core';
import { blue, pink, green } from '@material-ui/core/colors';
import axios from 'axios';
import UWAPI from 'utils/uwapi';
// import { useRoutes, navigate } from 'hookrouter';
// import WelcomePage from '../welcome_page/index';

const apiKey = '4ad350333dc3859b91bcf443d14e4bf0';
const uwapi = new UWAPI(apiKey, null);

const shTheme = createMuiTheme({
  palette: {
    primary: {
      main: blue[500],
      light: '#6ec6ff',
      dark: '#0069c0',
    },
    secondary: {
      main: green[500],
      light: '#80e27e',
      dark: '#087f23',
    },
    ternary: {
      main: pink[300],
      dark: '#ba2d65',
      light: '#ff94c2',
    },
  },
});

const useStyles = makeStyles((theme) => ({
  loadingFullPage: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const propTypes = {
  schedules: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
};

function ResultPage(props) {
  const { schedules } = props;
  // UI states
  const [selectedSchedIndex, setSelectedSchedIndex] = useState(0);

  // Data states
  const [classesInfo, setClassesInfo] = useState(Array(schedules.length).fill(undefined));

  const classes = useStyles();

  // const routeResult = useRoutes({
  //   '/': () => <WelcomePage />,
  // });

  useEffect(
    () => {
      console.log(schedules);
      const loadApiSchedules = (sched, index) => {
        const start = new Date().getTime();
        const promises = uwapi.getClassScheduleBulk(sched);
        axios.all(promises).then((values) => {
          const info = values.map((item) => item.data.data[0]);
          setClassesInfo((prevClassesInfo) => {
            const newClassesInfo = prevClassesInfo.slice();
            newClassesInfo[index] = info;
            return newClassesInfo;
          });
          console.log(info);
          console.log(new Date().getTime() - start);
        }).catch((error) => {
          console.log(error);
        });
      };

      const loadSchedules = async () => {
        try {
          schedules.forEach((sched, index) => loadApiSchedules(sched, index));
        } catch (error) {
          console.log(error.message);
        }
      };
      loadSchedules();
    },
    [],
  );

  const handleTabsChange = (event, newValue) => {
    setSelectedSchedIndex(newValue);
  };

  if (!schedules) {
    return (<h1>Invalid Schedules</h1>);
  }
  return (
    <ThemeProvider theme={shTheme}>
      <CssBaseline />

      <div>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6">Your Recommended Schedules</Typography>
          </Toolbar>
          <Tabs value={selectedSchedIndex} onChange={handleTabsChange}>
            {schedules.map((_, index) => (
              <Tab label={`Schedule ${index + 1}`} />
            ))}
          </Tabs>
        </AppBar>

        <Backdrop open={!classesInfo[selectedSchedIndex]} className={classes.loadingFullPage}>
          <CircularProgress color="inherit" />
        </Backdrop>

        {schedules.map((sched, index) => (
          <Typography>
            {`Item ${index}`}
          </Typography>
        ))}
      </div>
    </ThemeProvider>
  );
}

ResultPage.propTypes = propTypes;

export default ResultPage;
