import _ from 'lodash';

/**
 * @typedef {{ courseCode: string, keepable: boolean, keep: boolean }} CurrentCourse
 */

/**
 * @typedef {Object} ClassInfo
 * @property {string} subject
 * @property {number} catalog_number
 * @property {number} class_number
 * @property {number} associated_class
 * @property {string} section
 * @property {string} campus
 * @property {ClassTimeInfo[]} classes
 */

/**
 * @typedef {Object} ClassTimeInfo
 * @property {ClassDate} date
 * @property {{building: string, room: string}} location
 * @property {string[]} instructors
 */

/**
 * @typedef {Object} ClassDate
 * @property {string} start_time
 * @property {string} end_time
 * @property {string} weekdays
 * @property {boolean} is_tba
 * @property {boolean} is_cancelled
 * @property {boolean} is_closed
 */

/**
 * Determines whether two classes are associated.
 * @param {ClassInfo} classInfo1 the ClassInfo object to compare.
 * @param {ClassInfo} classInfo2 the other ClassInfo object to compare.
 */
const areAssociated = (classInfo1, classInfo2) => (
  classInfo1.associated_class === classInfo2.associated_class
);

/**
 * Returns the course code of a class.
 * @param {ClassInfo} classInfo the ClassInfo object to get course code from.
 */
const getCourseCode = (classInfo) => `${classInfo.subject} ${classInfo.catalog_number}`;

/**
 * Determines whether a class in online or not.
 * @param {ClassInfo} classInfo the ClassInfo object to check.
 */
const isOnline = (classInfo) => classInfo.campus === 'ONLN ONLINE';

/**
 * Determines whether a class in closed or not.
 * @param {ClassInfo} classInfo the ClassInfo object to check.
 */
const isClosed = (classInfo) => classInfo.classes.some((value) => value.date.is_closed);

/**
 * Formats data for use in back-end.
 * @param {CurrentCourse[]} currentCourses the list of current courses.
 * @param {number[]} currentClasses the list of current class numbers.
 * @param {ClassInfo[][]} courseInfo the courses information obtained from API.
 */
const formatPostData = (currentCourses, currentClasses, courseInfo) => {
  const currentCoursesDict = _.keyBy(currentCourses, 'courseCode');

  const filteredCourseInfo = courseInfo.map((course) => {
    let filtered = course.filter((s) => !isClosed(s) && !isOnline(s));
    const keepUnchanged = currentCoursesDict[getCourseCode(course[0])].keep;
    if (keepUnchanged) {
      filtered = filtered.filter((section) => currentClasses.includes(section.class_number));
    }
    const filteredSet = _.uniqWith(filtered, (a, b) => {
      if (a.associated_class !== b.associated_class) {
        return false;
      }
      if (a.section.slice(0, 3) !== b.section.slice(0, 3)) {
        return false;
      }
      if (a.classes.length !== b.classes.length) {
        return false;
      }
      for (let i = 0; i < a.classes.length; i += 1) {
        if (!_.isEqual(a.classes[i].date, b.classes[i].date)) {
          return false;
        }
      }
      return true;
    });
    return filteredSet;
  });

  const grouped = filteredCourseInfo.map((course) => {
    const dict = _.groupBy(course, (s) => s.section[4]);
    const groupedSectionList = [];
    _.forEach(dict, (value, key) => {
      groupedSectionList[key] = value;
    });
    return groupedSectionList;
  });

  const associatedClassList = grouped.map((course) => {
    const primary = course[0];
    const other = course.slice(1);
    const rearranged = primary.map((primarySection) => {
      const allowedComponents = other.map((component) => {
        let allowedSections = component.filter((section) => areAssociated(primarySection, section));
        if (_.isEmpty(allowedSections)) {
          allowedSections = component.filter(
            (section) => section.associated_class === 99,
          );
        }
        return _.map(allowedSections, 'class_number');
      });
      return [[primarySection.class_number]].concat(allowedComponents);
    });
    return rearranged;
  });

  return {
    courses_info: filteredCourseInfo,
    filtered_courses: associatedClassList,
  };
};

const prepend = (i, lol) => lol.map((lst) => [i].concat(lst));

const permHelper = (lol) => (!lol.length
  ? [[]] : lol[0].map((x) => prepend(x, permHelper(lol.slice(1)))).flat());

const perm = (fc) => permHelper(
  fc.map((course) => course.map((oneCourseCombo) => permHelper(oneCourseCombo)).flat()),
).map((x) => x.flat());

export {
  areAssociated,
  formatPostData,
  getCourseCode,
  isOnline,
  perm,
};
