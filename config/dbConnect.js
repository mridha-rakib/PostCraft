const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://rakibmahmudmridha:eRC2HG7yS7ibRoe0@cluster0.of7yscw.mongodb.net/postCraftDB"
    );
    console.log("DB connected successfully");
  } catch (error) {
    console.log("DB connection error: ", error.message);
  }
};

dbConnect();
