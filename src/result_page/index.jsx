import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  AppBar,
  Backdrop,
  Box,
  CircularProgress,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  CssBaseline,
  ThemeProvider,
  createMuiTheme,
  makeStyles,
  Snackbar,
  IconButton,
  Button,
  Popover,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { blue, pink, green } from '@material-ui/core/colors';
import axios from 'axios';
import UWAPI from 'utils/uwapi';
import Timetable from 'components/Timetable';
import GitHubIcon from '@material-ui/icons/GitHub';
import appBarIcon from 'res/icon-white.svg';
// import { useRoutes, navigate } from 'hookrouter';
// import WelcomePage from '../welcome_page/index';

const API_KEY = '4ad350333dc3859b91bcf443d14e4bf0';
const uwapi = new UWAPI(API_KEY, null);

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
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflowY: 'hidden',
  },
  contents: {
    // display: 'flex',
    // flexDirection: 'column',
    display: 'flex',
    justifyContent: 'center',
    flexGrow: 0,
    overflow: 'hidden',
    padding: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      padding: 0,
    },
  },
  loadingFullPage: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  timetableBox: {
    display: 'inline-block',
    maxWidth: '100%',
    maxHeight: '100%',
    alignSelf: 'flex-start',
    overflow: 'auto',
    border: `2px solid ${theme.palette.divider}`,
  },
  appBarIcon: {
    height: 30,
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(1),
  },
  termBtn: {
    fontSize: '18px',
    color: 'white',
    textTransform: 'none',
  },
  popover: {
    pointerEvents: 'none',
  },
  gitHubIconPopoverPaper: {
    padding: theme.spacing(1),
  },
}));

const propTypes = {
  schedules: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  termCode: PropTypes.number.isRequired,
  termName: PropTypes.string.isRequired,
};

function ResultPage(props) {
  const { schedules, termCode, termName } = props;
  // UI states
  const [selectedSchedIndex, setSelectedSchedIndex] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState(''); // snackbarTheme
  const [snackbarTitle, setSnackbarTitle] = useState('');
  const [snackbarText, setSnackbarText] = useState('');
  const [GithubIconAnchorEl, setGithubIconAnchorEl] = useState(null);

  // Data states
  const [classesInfo, setClassesInfo] = useState(Array(schedules.length).fill(undefined));

  const classes = useStyles();

  // const routeResult = useRoutes({
  //   '/': () => <WelcomePage />,
  // });


  const showSnackbar = (severity, text, title = '') => {
    setSnackbarSeverity(severity);
    setSnackbarText(text);
    setSnackbarTitle(title);
    setSnackbarOpen(true);
  };

  const hideSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  useEffect(
    () => {
      const loadApiSchedules = (sched, index) => {
        const promises = uwapi.getClassScheduleBulk(sched, termCode);
        axios.all(promises).then((values) => {
          const info = values.map((item) => item.data.data[0]);
          setClassesInfo((prevClassesInfo) => {
            const newClassesInfo = prevClassesInfo.slice();
            newClassesInfo[index] = info;
            return newClassesInfo;
          });
        }).catch((error) => {
          showSnackbar('error', error.message);
        });
      };

      const loadSchedules = async () => {
        try {
          schedules.forEach((sched, index) => loadApiSchedules(sched, index));
        } catch (error) {
          showSnackbar('error', error.message);
        }
      };
      loadSchedules();
    }, [schedules, termCode],
  );

  const handleTabsChange = (event, newValue) => {
    setSelectedSchedIndex(newValue);
  };

  const handleGitHubIconPopoverOpen = (event) => {
    setGithubIconAnchorEl(event.currentTarget);
  };

  const handleGitHubIconPopoverClose = () => {
    setGithubIconAnchorEl(null);
  };

  return (
    <ThemeProvider theme={shTheme}>
      <CssBaseline />
      <Snackbar
        open={snackbarOpen}
        onClose={hideSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={6000}
      >
        <Alert severity={snackbarSeverity} onClose={hideSnackbar}>
          {snackbarTitle && <AlertTitle>{snackbarTitle}</AlertTitle>}
          {snackbarText}
        </Alert>
      </Snackbar>
      <div className={classes.root}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <img src={appBarIcon} alt="" className={classes.appBarIcon} />
            <Typography variant="h6" style={{ flex: 1 }}>Scheudle Hub</Typography>
            <Button
              className={classes.termBtn}
            >
              {termName}
            </Button>
            <IconButton
              onMouseEnter={handleGitHubIconPopoverOpen}
              onMouseLeave={handleGitHubIconPopoverClose}
              color="inherit"
              href="https://github.com/ScheduleHub/schedule-hub"
              target="_blank"
            >
              <GitHubIcon style={{ fontSize: 30 }} />
            </IconButton>
            <Popover
              className={classes.popover}
              classes={{
                paper: classes.gitHubIconPopoverPaper,
              }}
              open={Boolean(GithubIconAnchorEl)}
              anchorEl={GithubIconAnchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              onClose={handleGitHubIconPopoverClose}
              disableRestoreFocus
            >
              <Typography>GitHub Repo</Typography>
            </Popover>
          </Toolbar>
          <AppBar position="static" color="default">
            <Tabs
              value={selectedSchedIndex}
              textColor="primary"
              indicatorColor="primary"
              variant="scrollable"
              onChange={handleTabsChange}
            >
              {schedules.map((_, index) => (
                <Tab label={`Schedule ${index + 1}`} />
              ))}
            </Tabs>
          </AppBar>
        </AppBar>
        <div className={classes.contents}>
          <Box className={classes.timetableBox}>
            <Timetable schedule={classesInfo[selectedSchedIndex]} />
          </Box>
        </div>
        <Backdrop open={!classesInfo[selectedSchedIndex]} className={classes.loadingFullPage}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    </ThemeProvider>
  );
}

ResultPage.propTypes = propTypes;

export default ResultPage;
