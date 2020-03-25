/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NonExistentPage from './non_existent_page/index';
import WelcomePage from './welcome_page/index';
import ResultPage from './result_page/index';
import './index.css';

function App() {
  const [result, setResult] = useState(null);
  const [currentTermCode, setCurrentTermCode] = useState(null);
  const [currentTermName, setCurrentTermName] = useState('');
  const [coursesInfo, setCoursesInfo] = useState([]); // courseInfo
  const [availSubjects, setAvailSubjects] = useState([]); // allSubjects
  const [termsInfo, setTermsInfo] = useState({});
  const [availCourseNumbers, setAvailCourseNumbers] = useState([]); // courseNumbers
  const [currentClasses, setCurrentClasses] = useState([]);
  const [currentCourses, setCurrentCourses] = useState([]);

  const handleResultChange = (newVal) => {
    setResult(newVal);
  };

  const handleCurrentTermCodeChange = (newCode) => {
    setCurrentTermCode(newCode);
  };

  const handleCurrentTermNameChange = (newName) => {
    setCurrentTermName(newName);
  };

  const BASE_URL = `${process.env.PUBLIC_URL}/`;

  return (
    <Router>
      <Switch>
        <Route
          exact
          path={BASE_URL}
          render={(props) => (
            <WelcomePage
              {...props}
              currentTermName={currentTermName}
              currentTermCode={currentTermCode}
              coursesInfo={coursesInfo}
              availSubjects={availSubjects}
              termsInfo={termsInfo}
              availCourseNumbers={availCourseNumbers}
              currentClasses={currentClasses}
              currentCourses={currentCourses}
              setCurrentTermName={handleCurrentTermNameChange}
              setCurrentTermCode={handleCurrentTermCodeChange}
              setCoursesInfo={setCoursesInfo}
              setAvailSubjects={setAvailSubjects}
              setTermsInfo={setTermsInfo}
              setAvailCourseNumbers={setAvailCourseNumbers}
              setCurrentClasses={setCurrentClasses}
              setCurrentCourses={setCurrentCourses}
              setResult={handleResultChange}
            />
          )}
        />
        <Route
          exact
          path={`${BASE_URL}result`}
          render={result === null
            ? () => <NonExistentPage />
            : (props) => (
              <ResultPage
                {...props}
                schedules={result}
                termCode={currentTermCode}
                termName={currentTermName}
              />
            )}
        />
        <Route component={NonExistentPage} />
      </Switch>
    </Router>
  );
}
ReactDOM.render(<App />, document.getElementById('root'));
