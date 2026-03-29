// const express = require("express");
// const lostController = require("../controllers/lostController");

// const router = express.Router();

// router.post("/", lostController.addLostItem);
// router.get("/", lostController.getLostItems);
// router.get("/search", lostController.searchLostItems);

// module.exports = router;



const express = require("express");
const lostController = require("../controllers/lostController");

const router = express.Router();

router.post("/", lostController.addLostItem);
router.get("/", lostController.getLostItems);
router.get("/search", lostController.searchLostItems);
router.patch("/:id/resolve", lostController.resolveLostItem);

module.exports = router;
