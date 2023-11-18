const jwt = require('jsonwebtoken');
const User = require("../modules/User");

exports.auth = async (req, res, next) => {
  const { authorization } = req.headers;
  if(!authorization) {
    return res.status(401).send("Unauthorized!!!");
  }
  const token = authorization.split(" ")[1];
  try {
      const data = jwt.verify(token, process.env.JWTSecret);
      const { user: {id} } = data;
      const user = await User.findById(id);
      if (user) {
        let org;
        if(user?.orgId) {
          org = await Organisation.findById(user._doc.orgId);
        }
        if (user._doc?.password) delete user._doc.password;
        req.user = {...user._doc, ...org?._doc};
        next();
      } else {
        return res.status(200).send('User not found!!!');
      }

    } catch (err) {
      console.log(err.message);
      return res.status(500).send('Server Error');
    }
}