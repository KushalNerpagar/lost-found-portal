// const express = require("express");
// const foundController = require("../controllers/foundController");

// const router = express.Router();

// // ✅ EXACT MATCH WITH CONTROLLER
// router.post("/", foundController.addFoundItem);
// router.get("/", foundController.getFoundItems);
// router.get("/search", foundController.searchFoundItems);

// module.exports = router;

const express = require("express");
const foundController = require("../controllers/foundController");

const router = express.Router();

router.post("/", foundController.addFoundItem);
router.get("/", foundController.getFoundItems);
router.get("/search", foundController.searchFoundItems);
router.patch("/:id/resolve", foundController.resolveFoundItem);
router.get("/matches", foundController.getMatches);

module.exports = router;
