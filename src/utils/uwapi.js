import axios from 'axios';

const ROOT_URL = 'https://api.uwaterloo.ca/v2';

class UWAPI {
  /**
   * Creates a new UWAPI instance.
   * @param {string} apiKey the API key.
   */
  constructor(apiKey, timeout = 10000) {
    this.apiKey = apiKey;
    this.timeout = timeout;
  }

  /**
   * Sends a GET request to UW Open Data API.
   * @param {string} url the URL of the endpoint.
   * @param {Object} params parameters to send along the request.
   */
  sendUrlRequest = async (url, params = {}) => {
    const response = await axios.get(url, {
      baseURL: ROOT_URL,
      params: {
        ...params,
        key: this.apiKey,
      },
      timeout: this.timeout,
      timeoutErrorMessage: 'Network Timeout',
    });
    const { meta, data } = response.data;
    if (meta.status !== 200) {
      const error = Error(meta.message);
      error.name = `UW ${meta.status}`;
      throw error;
    }
    return data;
  }

  /**
   * Sends multiple GET requests to UW Open Data API.
   * @param {string[]} urlList the URLs of the endpoints.
   * @param {Object} params parameters to send along each request.
   */
  sendBulkUrlRequest = (urlList, params = {}) => {
    const instance = axios.create({
      baseURL: ROOT_URL,
      timeout: this.timeout,
      timeoutErrorMessage: `timeout ${this.timeout}`,
    });
    const promises = urlList.map((url) => instance.get(url, {
      params: {
        ...params,
        key: this.apiKey,
      },
    }));
    return promises;
  }

  /**
   * Returns all available subject codes.
   */
  getSubjectCodes = async () => {
    const subjects = await this.sendUrlRequest('/codes/subjects.json');
    return subjects.map((item) => item.subject);
  }

  /**
   * Returns current_term, previous_term, and next_term information
   */
  getTermsInfo = async () => {
    const termsInfo = await this.sendUrlRequest('/terms/list.json');
    const result = {};
    const getTermName = (termCode) => {
      const digitToSeason = {
        1: 'Winter',
        5: 'Spring',
        9: 'Fall',
      };
      return `${digitToSeason[termCode[3]]} ${19 + parseInt(termCode[0], 10)}${termCode.substring(1, 3)}`;
    };
    result.current_term = [termsInfo.current_term,
      getTermName(termsInfo.current_term.toString())];
    result.previous_term = [termsInfo.previous_term,
      getTermName(termsInfo.previous_term.toString())];
    result.next_term = [termsInfo.next_term,
      getTermName(termsInfo.next_term.toString())];
    return result;
  };

  /**
   * Returns all available catalog numbers (course numbers) for a subject.
   * @param {string} subject
   */
  getCourseNumbers = async (subject) => {
    const courses = await this.sendUrlRequest(`/courses/${subject}.json`);
    return courses.map((item) => item.catalog_number);
  }

  /**
   * Returns the schedule of a course.
   * @param {string} subject
   * @param {string | number} catalogNumber
   * @param {number} term the term to get schedules for.
   */
  getCourseSchedule = async (subject, catalogNumber, term = undefined) => {
    const url = `/courses/${subject}/${catalogNumber}/schedule.json`;
    const classes = await this.sendUrlRequest(url, { term });
    return classes;
  }

  /**
   * Returns the schedules of multiple courses.
   * @param {string[]} courseCodeList the list of courses to get schedules for.
   * @param {number} term the term to get schedules for.
   */
  getCourseScheduleBulk = (courseCodeList, term = undefined) => {
    const urlList = courseCodeList.map((code) => {
      const [sub, cata] = code.split(' ');
      return `/courses/${sub}/${cata}/schedule.json`;
    });
    return this.sendBulkUrlRequest(urlList, { term });
  }

  /**
   * Returns the schedules of multiple classes.
   * @param {number[]} classNumberList the list of classes to get schedules for.
   * @param {number} term the term to get schedules for.
   */
  getClassScheduleBulk = (classNumberList, term = undefined) => {
    const urlList = classNumberList.map((classNum) => `/courses/${classNum}/schedule.json`);
    return this.sendBulkUrlRequest(urlList, { term });
  }
}

export default UWAPI;
