const router = require("express").Router();
const execQuery= require("../db/execQuery.js")

router.get("/getAllProducts", async (req, res) => {
  try {

    const sql= "SELECT * FROM menugroupitem WHERE id > ?";
    // return res.json({data: sql})

    const [products]= await execQuery(sql, [0]);

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
