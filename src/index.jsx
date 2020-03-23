import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useRoutes, navigate } from 'hookrouter';
import NonExistentPage from './non_existent_page/index';
import WelcomePage from './welcome_page/index';
import ResultPage from './result_page/index';
import ResultNotFoundPage from './result_not_found_page/index';
import './index.css';

function App() {
  const [result, setResult] = useState(null);
  const handleResultChange = (newVal) => {
    setResult(newVal);
  };
  const router = {
    '/schedule-hub': () => <WelcomePage setResult={handleResultChange} />,
    '/schedule-hub/result': () => <ResultPage schedules={result} />,
    '/schedule-hub/result-not-found': () => <ResultNotFoundPage />,
  };
  const routeResult = useRoutes(router);
  if (!routeResult) {
    return <NonExistentPage />;
  }
  if (routeResult.type.name === 'ResultPage') {
    if (result === null) {
      navigate('/result-not-found');
    }
  }
  return routeResult;
}
ReactDOM.render(<App />, document.getElementById('root'));
