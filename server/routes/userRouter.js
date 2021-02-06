const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const User = require("../models/userModel");
const execQuery= require("../db/execQuery.js")

router.post("/register", async (req, res) => {
  try {
    let { email, password, passwordCheck, firstName, lastName } = req.body;
    let displayName = firstName + ' ' + lastName;

    // validate
    if (!email || !password || !passwordCheck)
      return res.status(400).json({ msg: "Not all fields have been entered." });
    if (password.length < 5)
      return res
        .status(400)
        .json({ msg: "The password needs to be at least 5 characters long." });
    if (password !== passwordCheck)
      return res
        .status(400)
        .json({ msg: "Enter the same password twice for verification." });

    const matchingUsersSql= "SELECT * FROM userspos WHERE email= CONVERT(? USING utf8) COLLATE utf8_bin";

    const [matchingUsers]= await execQuery(matchingUsersSql, [email]);
    if (matchingUsers.length> 0)
      return res
        .status(400)
        .json({ msg: "An account with this email already exists." });

    if (!displayName) displayName = email;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const userInsertSql= "INSERT INTO userspos (email, password, displayName) VALUES (?, ?, ?)";
    const savedUser= await execQuery(userInsertSql, [email, passwordHash, displayName]);

    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate
    if (!email || !password)
      return res.status(400).json({ msg: "Not all fields have been entered." });
    const sql= "SELECT * FROM userspos WHERE email= CONVERT(? USING utf8) COLLATE utf8_bin";
    const [matchingUsers]= await execQuery(sql, [email]);
    if (matchingUsers.length!= 1)
      return res
        .status(400)
        .json({ msg: "No account with this email has been registered." });


    const isMatch = await bcrypt.compare(password, matchingUsers[0].password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

    const token = jwt.sign({ id: matchingUsers[0]._id }, process.env.JWT_SECRET);
    res.json({
      token,
      user: {
        id: matchingUsers[0]._id,
        displayName: matchingUsers[0].displayName,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/delete", auth, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user);
    res.json(deletedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/tokenIsValid", async (req, res) => {

  try {
    const token = req.header("x-auth-token");

    if (!token) return res.json(false);

    // return res.json({data: req.header("x-auth-token")});
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);

    // return res.json({data: verified});
    // const sql= "SELECT * FROM userspos WHERE id= ?";
    // const [matchingUsers]= await execQuery(sql, [verified.id]);
    // if (matchingUsers.length== 0) return res.json(false);

    return res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  const sql= "SELECT * FROM userspos WHERE id= ?";
  // return res.json({data: req.user})
  const [matchingUsers]= await execQuery(sql, [req.user]);
  const user = matchingUsers[0];

  return res.json({
    displayName: user.displayName,
    id: user._id,
  });
});

module.exports = router;
