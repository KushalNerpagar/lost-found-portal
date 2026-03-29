const express = require("express");
const foundController = require("../controllers/foundController");

const router = express.Router();

router.get("/matches", foundController.getMatches);     
router.post("/", foundController.addFoundItem);
router.get("/", foundController.getFoundItems);
router.get("/search", foundController.searchFoundItems);
router.patch("/:id/resolve", foundController.resolveFoundItem);

module.exports = router;
