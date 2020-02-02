import _ from 'lodash';

/**
 * @typedef {{ courseCode: string, keepable: boolean, keep: boolean }} CurrentCourse
 */

/**
 * @typedef {Object} ClassInfo
 * @property {string} subject
 * @property {number} catalog_number
 * @property {number} associated_class
 * @property {string} section
 * @property {string} campus
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
 * Determines whether a class in online.
 * @param {ClassInfo} classInfo the ClassInfo object to check.
 */
const isOnline = (classInfo) => classInfo.campus === 'ONLN ONLINE';

/**
 * Formats data for use in back-end.
 * @param {CurrentCourse[]} currentCourses the list of current courses.
 * @param {number[]} currentClasses the list of current class numbers.
 * @param {ClassInfo[][]} courseInfo the courses information obtained from API.
 */
const formatPostData = (currentCourses, currentClasses, courseInfo) => {
  const filteredCourseInfo = courseInfo.map((course) => course.filter((s) => !isOnline(s)));

  const grouped = filteredCourseInfo.map((course) => {
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

  return {
    courses_info: filteredCourseInfo,
    filtered_courses: associatedClassList,
  };
};

export {
  areAssociated,
  getCourseCode,
  formatPostData,
};
