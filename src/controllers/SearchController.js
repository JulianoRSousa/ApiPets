const Auth = require("../models/Auth");
const User = require("../models/User");

//index, show, store, update, destroy

module.exports = {
  async searchFriends(req, res, next) {
    const { tags } = req.headers;
    const search = String(tags).toUpperCase().split(" ");
    try {
      if (search.indexOf("@") == 0) {
          search[0].replace('@','')
        const resultSearch = await User.find({ tags: { $all: search[0] } });
        return res.status(200).json(resultSearch);
      } else {
        const resultSearch = await User.find({ tags: { $in: search } });
        return res.status(200).json(resultSearch);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ Error: "Internal Server Error" });
    }
  },
};
