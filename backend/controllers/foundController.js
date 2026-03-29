const db = require("../db");

exports.addFoundItem = async (req, res) => {
  try {
    const { item_name, description, location, date_found, contact_name, contact_info } = req.body;

    // Duplicate prevention — check same item_name + location + contact_info
    const [existing] = await db.query(
      `SELECT id FROM found_items WHERE item_name = ? AND location = ? AND contact_info = ?`,
      [item_name, location, contact_info]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: "Duplicate entry: this item was already reported." });
    }

    const [result] = await db.query(
      `INSERT INTO found_items (item_name, description, location, date_found, contact_name, contact_info, status)
       VALUES (?, ?, ?, ?, ?, ?, 'found')`,
      [item_name, description, location, date_found, contact_name, contact_info]
    );

    const insertedItem = {
      id: result.insertId,
      item_name, description, location, date_found, contact_name, contact_info, status: "found",
    };

    const [matches] = await db.query(
      `SELECT * FROM lost_items WHERE item_name LIKE ? AND location LIKE ? AND status != 'resolved'`,
      [`%${item_name}%`, `%${location}%`]
    );

    for (const match of matches) {
      await db.query(
        `INSERT INTO matches (lost_item_id, found_item_id, match_status) VALUES (?, ?, 'pending')`,
        [match.id, result.insertId]
      );
    }

    return res.json({ foundItem: insertedItem, matches });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error adding found item" });
  }
};

exports.getFoundItems = async (req, res) => {
  try {
    const { query } = req.query;
    let sql = `SELECT id, item_name, description, location, date_found, contact_name, contact_info, status FROM found_items`;
    const params = [];

    if (query && query.trim()) {
      sql += ` WHERE item_name LIKE ? OR location LIKE ?`;
      params.push(`%${query.trim()}%`, `%${query.trim()}%`);
    }

    sql += ` ORDER BY date_found DESC`;
    const [rows] = await db.query(sql, params);
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error fetching found items" });
  }
};

exports.searchFoundItems = async (req, res) => {
  try {
    const { item_name, location } = req.query;
    let query = `SELECT id, item_name, description, location, date_found, contact_name, contact_info, status FROM found_items WHERE 1=1`;
    const params = [];

    if (item_name) { query += " AND item_name LIKE ?"; params.push(`%${item_name}%`); }
    if (location)  { query += " AND location LIKE ?";  params.push(`%${location}%`); }

    const [rows] = await db.query(query, params);
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error searching found items" });
  }
};

exports.resolveFoundItem = async (req, res) => {
  try {
    const { id } = req.params;
    // Delete related matches first (foreign key safety)
    await db.query(`DELETE FROM matches WHERE found_item_id = ?`, [id]);
    // Delete the item itself
    await db.query(`DELETE FROM found_items WHERE id = ?`, [id]);
    return res.json({ message: "Item resolved and removed." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to resolve item" });
  }
};

exports.getMatches = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        m.id as match_id, m.match_status,
        l.id as lost_id, l.item_name as lost_item, l.location as lost_location,
        l.date_lost, l.contact_name as lost_contact, l.contact_info as lost_contact_info,
        f.id as found_id, f.item_name as found_item, f.location as found_location,
        f.date_found, f.contact_name as found_contact, f.contact_info as found_contact_info
      FROM matches m
      JOIN lost_items l ON m.lost_item_id = l.id
      JOIN found_items f ON m.found_item_id = f.id
      ORDER BY m.id DESC
    `);
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error fetching matches" });
  }
};
