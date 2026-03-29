const db = require("../db");

function requiredFieldsPresent(body, fields) {
  return fields.every((f) => body[f] !== undefined && body[f] !== null && body[f] !== "");
}

exports.addLostItem = async (req, res) => {
  const { item_name, description, location, date_lost, contact_name, contact_info } = req.body || {};

  const requiredFields = ["item_name", "description", "location", "date_lost", "contact_name", "contact_info"];
  if (!requiredFieldsPresent(req.body || {}, requiredFields)) {
    return res.status(400).json({ error: "Missing required fields", requiredFields });
  }

  try {
    const [existing] = await db.query(
      `SELECT id FROM lost_items WHERE item_name = ? AND location = ? AND contact_info = ?`,
      [item_name, location, contact_info]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: "Duplicate entry: this item was already reported." });
    }

    const [result] = await db.query(
      `INSERT INTO lost_items (item_name, description, location, date_lost, contact_name, contact_info, status)
       VALUES (?, ?, ?, ?, ?, ?, 'lost')`,
      [item_name, description, location, date_lost, contact_name, contact_info]
    );

    return res.status(201).json({
      id: result.insertId,
      item_name, description, location, date_lost, contact_name, contact_info, status: "lost",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to add lost item" });
  }
};

exports.getLostItems = async (req, res) => {
  const { query } = req.query;
  let sql = `SELECT id, item_name, description, location, date_lost, contact_name, contact_info, status FROM lost_items`;
  const params = [];

  if (query && query.trim()) {
    sql += ` WHERE item_name LIKE ? OR location LIKE ?`;
    params.push(`%${query.trim()}%`, `%${query.trim()}%`);
  }

  sql += ` ORDER BY date_lost DESC`;

  try {
    const [rows] = await db.query(sql, params);
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch lost items" });
  }
};

exports.searchLostItems = async (req, res) => {
  const query = (req.query.query || "").toString().trim();
  if (!query) return res.status(400).json({ error: "Missing query parameter" });

  const like = `%${query}%`;
  try {
    const [rows] = await db.query(
      `SELECT id, item_name, description, location, date_lost, contact_name, contact_info, status
       FROM lost_items WHERE item_name LIKE ? OR location LIKE ? ORDER BY date_lost DESC`,
      [like, like]
    );
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to search lost items" });
  }
};

exports.resolveLostItem = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(`DELETE FROM matches WHERE lost_item_id = ?`, [id]);
    await db.query(`DELETE FROM lost_items WHERE id = ?`, [id]);
    return res.json({ message: "Item resolved and removed." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to resolve item" });
  }
};
