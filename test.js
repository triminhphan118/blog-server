// const Posts = require("./models/Posts");
// const mongoose = require("mongoose");

// mongoose.connect(
//   "mongodb+srv://minhtri:minhtri11800@cluster0.c2xxiqe.mongodb.net/db_blog?retryWrites=true&w=majority",
//   (a) => {
//     console.log(a);
//     console.log("Connected to Mongo DB");
//   }
// );

// async function createPost() {
//   for (let i = 20; i < 35; i++) {
//     await Posts.create({
//       title: `Bài viết gần đầy số ${i}`,
//       slug: `bai-viet-gan-day-so-${i}`,
//       image:
//         "https://images.unsplash.com/photo-1504805572947-34fad45aed93?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
//       decs: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
//       content:
//         '<p><span style="background-color: rgb(255, 255, 255);">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</span></p>',
//       hot: 0,
//       user: "63060d0d4b471dc7437c7070",
//       category: "63048535b2908eb296b81654",
//     });
//   }
// }
// createPost();
