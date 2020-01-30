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

export {
  areAssociated,
  getCourseCode,
};
