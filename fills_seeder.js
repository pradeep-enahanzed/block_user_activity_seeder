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
      { $match: { type: { $eq: "fill" } } },
      {
        $project: {
          // Transform fields from old schema to new schema
          _id: 0,
          block_id: "$_id",
          course_id: "$course",
          fills: "$fills",
        },
      },
      {
        $unwind: "$fills",
      },
      {
        $unwind: "$fills.responses",
      },
      {
        $project: {
          // Transform fields from old schema to new schema
          fills: "$fills._id",
          user_id: "$fills.responses.creator",
          text: "$fills.responses.text",
          block_id: "$block_id",
          course_id: "$course_id",
          created_at: "$fills.responses.created_at",
          updated_at: "$fills.responses.updated_at",
        },
      },
      {
        $group: {
          _id: {
            user_id: "$user_id",
            course_id: "$course_id",
            block_id: "$block_id",
          },
          fills: {
            $push: { _id: "$fills", text: "$text" },
          },
          timestamps: {
            $push: {
              created_at: "$created_at",
              updated_at: "$updated_at",
            },
          },
        },
      },
      {
        $project: {
          // Transform fields from old schema to new schema
          _id: 0,
          fills: "$fills",
          user_id: "$_id.user_id",
          block_id: "$_id.block_id",
          course_id: "$_id.course_id",
          type: "fill",
          created_at: { $arrayElemAt: ["$timestamps.created_at", 0] },
          updated_at: { $arrayElemAt: ["$timestamps.updated_at", 0] },
        },
      },

      {
        $set: {
          NoOfAttempts: 1,
        },
      },
      {
        $merge: {
          into: "blockuseractivities",
        },
      },
    ];

    // first creating default cohorts for all the courses.
    const mcqData = await blocks.aggregate(blocksCollectionPipeline, {
      "allowDiskUse" : true
  });
    console.log("Data Imported...", mcqData);

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
