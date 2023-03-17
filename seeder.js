const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

// Connect to mongodb
mongoose.connect(process.env.MONGO_URI, (err) => {
  if (err) console.log("Unable to connect to the server");
  else console.log("mongoDB is connected");
});

// Loads models
const BlockUserActivity = require("./models/blockUserActivity");
const blocks = require("./models/blocks");
const UserCourseActivity = require("./models/userCourseActivity");

// Creates default cohorts for each course.
const BlockUserActivityCollection = async () => {
  try {
    // Use the Aggregation Pipeline to transform the data in the original collection to match the new schema
    const blocksCollectionPipeline = [
      { $match: { type: { $eq: "mcq" } } },
      {
        $project: {
          // Transform fields from old schema to new schema
          _id: 0,
          block_id: "$_id",
          course_id: "$course",
          mcqs: "$mcqs",
        },
      },
      {
        $unwind: "$mcqs",
      },
      {
        $unwind: "$mcqs.voters",
      },
      {
        $project: {
          // Transform fields from old schema to new schema
          mcq_option_id: "$mcqs._id",
          user_id: "$mcqs.voters",
          block_id: "$block_id",
          course_id: "$course_id",
        },
      },
      {
        $group: {
          _id: {
            user_id: "$user_id",
            course_id: "$course_id",
            block_id: "$block_id",
          },
          mcq_option_id: {
            $push: "$mcq_option_id",
          },
        },
      },
      {
        $project: {
          // Transform fields from old schema to new schema
          _id: 0,
          mcq_option_ids: "$mcq_option_id",
          user_id: "$_id.user_id",
          block_id: "$_id.block_id",
          course_id: "$_id.course_id",
        },
      },
      // {
      //   $limit: 10000,
      // },
      // {
      //   $lookup: {
      //     from: "user_course_activities",
      //     // localField: "course_id", // field in the orders collection
      //     // foreignField: "course_id", // field in the items collection
      //     let: { course_id: "$course_id", user_id: "$user_id" },
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $and: [
      //               { $eq: ["$course_id", "$$course_id"] },
      //               { $eq: ["$user_id", "$$user_id"] },
      //             ],
      //           },
      //         },
      //       },
      //       {
      //         $project: {
      //           _id: 0,
      //           cohort_id: "$cohort_id",
      //           // course_id: "$course_id",
      //           // user_id: "$user_id",
      //         },
      //       },
      //     ],
      //     as: "dataWithCohort",
      //   },
      // },
      // {
      //   $unwind: "$dataWithCohort",
      // },
      // {
      //   $project: {
      //     // Transform fields from old schema to new schema
      //     _id: 0,
      //     mcq_option_ids: "$mcq_option_id",
      //     user_id: "$_id.user_id",
      //     block_id: "$_id.block_id",
      //     course_id: "$_id.course_id",
      //   },
      // },
      {
        $unset: ["mcqs"],
      },
      // {
      //   $merge: {
      //     into: "block_user_activities_new_2",
      //     on: ["user_id", "course_id"],
      //     whenNotMatched: "insert",
      //   },
      // },
      {
        $out: "block_user_activities_new_2",
      },
    ];

    // first creating default cohorts for all the courses.
    const data = await blocks.aggregate(blocksCollectionPipeline);

    // const pipeline2 = [
    //   {
    //     $lookup: {
    //       from: "user_course_activities",
    //       // localField: "course_id", // field in the orders collection
    //       // foreignField: "course_id", // field in the items collection
    //       let: { course_id: "$course_id", user_id: "$user_id" },
    //       pipeline: [
    //         {
    //           $match: {
    //             $expr: {
    //               $and: [
    //                 { $eq: ["$course_id", "$$course_id"] },
    //                 { $eq: ["$user_id", "$$user_id"] },
    //               ],
    //             },
    //           },
    //         },
    //         {
    //           $project: {
    //             _id: 0,
    //             cohort_id: "$cohort_id",
    //             // course_id: "$course_id",
    //             // user_id: "$user_id",
    //           },
    //         },
    //       ],
    //       as: "dataWithCohort",
    //     },
    //   },
    //   {
    //     $unwind: "$dataWithCohort",
    //   },
    //   {
    //     $project: {
    //       // Transform fields from old schema to new schema
    //       _id: 0,
    //       mcq_option_ids: "$mcq_option_id",
    //       user_id: "$_id.user_id",
    //       block_id: "$_id.block_id",
    //       course_id: "$_id.course_id",
    //     },
    //   },
    //   {
    //     $limit: 100,
    //   },
    //   {
    //     $merge: {
    //       into: "block_user_activities_new_2",
    //       on: ["user_id", "course_id"],
    //       // whenNotMatched: "insert",
    //     },
    //   },
    // ];

    // // first creating default cohorts for all the courses.
    // const data = await UserCourseActivity.aggregate(pipeline2);

    console.log("Data Imported...", data);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    const res = await UserCourseActivity.deleteMany();
    console.log(res);
    console.log("Data Destroyed...");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === "-i") {
  BlockUserActivityCollection();
} else if (process.argv[2] === "-d") {
  deleteData();
}
