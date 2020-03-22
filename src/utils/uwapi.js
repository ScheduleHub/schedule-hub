import axios from 'axios';

const rootUrl = 'https://api.uwaterloo.ca/v2';

class UWAPI {
  /**
   * Creates a new UWAPI instance.
   * @param {string} apiKey the API key.
   */
  constructor(apiKey, timeout = 6000) {
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
      baseURL: rootUrl,
      params: {
        ...params,
        key: this.apiKey,
      },
      timeout: this.timeout,
      timeoutErrorMessage: `timeout ${this.timeout}`,
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
      baseURL: rootUrl,
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
