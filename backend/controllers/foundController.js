const db = require("../db");

exports.addFoundItem = async (req, res) => {
  console.log("🔥 CONTROLLER RUNNING");

  try {
    const {
      item_name,
      description,
      location,
      date_found,
      contact_name,
      contact_info,
    } = req.body;

    const [result] = await db.query(
      "INSERT INTO found_items (item_name, description, location, date_found, contact_name, contact_info, status) VALUES (?, ?, ?, ?, ?, ?, 'found')",
      [item_name, description, location, date_found, contact_name, contact_info,]
    );

    const insertedItem = {
      id: result.insertId,
      item_name,
      description,
      location,
      date_found,
      contact_name,
      contact_info,
      status: "found",
    };

    const [matches] = await db.query(
      "SELECT * FROM lost_items WHERE item_name LIKE ? AND location LIKE ?",
      [`%${item_name}%`, `%${location}%`]
    );

    console.log("MATCHES:", matches);

    return res.json({ foundItem: insertedItem, matches });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error adding found item" });
  }
};

// ✅ ADD THIS
exports.getFoundItems = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM found_items ORDER BY date_found DESC");
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error fetching found items" });
  }
};

// ✅ ADD THIS
exports.searchFoundItems = async (req, res) => {
  try {
    const { item_name, location } = req.query;

    let query = "SELECT * FROM found_items WHERE 1=1";
    const params = [];

    if (item_name) {
      query += " AND item_name LIKE ?";
      params.push(`%${item_name}%`);
    }

    if (location) {
      query += " AND location LIKE ?";
      params.push(`%${location}%`);
    }

    const [rows] = await db.query(query, params);
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error searching found items" });
  }
};