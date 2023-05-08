const pipeline2 = [
  { $match: { cohort_id: { $ne: "" } } },
  {
    $lookup: {
      from: "blockuseractivities_new_2",
      let: {
        user_id: "$userId",
        courseId: "$course_id",
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$userId", "$$user_id"] },
                { $eq: ["$course_id", "$$courseId"] },
              ],
            },
          },
        },
        {
          $project: {
            // _id: 0,
            cohort_id: 1,
          },
        },
      ],
      as: "matchedDocs",
    },
  },
  // {
  //   $unwind: "$matchedDocs",
  // },
  // {
  //   $project: {
  //     // Transform fields from old schema to new schema
  //     cohort_id: "$matchedDocs.cohort_id",
  //     course_id: "$matchedDocs.course_id",
  //     user_id: "$matchedDocs.userId",
  //   },
  // },
  // {
  //   $limit: 100,
  // },
  // {
  //   $merge: {
  //     into: "blockuseractivities_new_2",
  //     on: ["user_id", "course_id"],
  //     // whenNotMatched: "insert",
  //   },
  // },
];

// // first creating default cohorts for all the courses.
const data = await UserCourseActivity.aggregate(pipeline2);
