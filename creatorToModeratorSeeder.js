const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

// Connect to mongodb
mongoose.connect(process.env.MONGO_URI, (err) => {
  if (err) console.log("Unable to connect to the server");
  else console.log("mongoDB is connected");
});

// Loads models
const courses = require("./models/course");
// const users = require("./models/user");
// const UserCourseActivity = require("./models/userCourseActivity");

// Creates default cohorts for each course.
const AddCreatorToModerator = async () => {
  try {
    // Use the Aggregation Pipeline to transform the data in the original collection to match the new schema
    const AddCreatorToModeratorPipeline = [
      {
        $addFields: {
          // Create a new object with the key-value pair you want to push
          newMember: {
            _id: mongoose.Types.ObjectId(),
            user: "$creator",
            permit_val: "moderator",
            added_at: "$created_at",
            // Add any other fields as needed
          }
        }
      },
      {
        $set: {
          // Push the new object into the "members" array field
          members: { $concatArrays: ["$members", ["$newMember"]] }
        }
      },
      {
        $unset: "newMember" // Optionally, remove the temporary "newMember" field
      },
      {
        $out: "courses",
      },
    ];

    // first creating default cohorts for all the courses.
    const AddCreatorToModeratorData = await courses.aggregate(AddCreatorToModeratorPipeline,  {
      "allowDiskUse" : true
  });
    console.log("Data Imported...", AddCreatorToModeratorData);

    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
// const deleteData = async () => {
//   try {
//     const res = await BlockUserActivity.deleteMany();
//     console.log(res);
//     console.log("Data Destroyed...");
//     process.exit();
//   } catch (err) {
//     console.error(err);
//   }
// };

if (process.argv[2] === "-i") {
  AddCreatorToModerator();
} else if (process.argv[2] === "-d") {
  deleteData();
}
