const db = require("../db");

function requiredFieldsPresent(body, fields) {
  return fields.every((f) => body[f] !== undefined && body[f] !== null && body[f] !== "");
}

exports.addLostItem = (req, res) => {
  const {
    item_name,
    description,
    location,
    date_lost,
    contact_name,
    contact_info,
  } = req.body || {};

  const requiredFields = [
    "item_name",
    "description",
    "location",
    "date_lost",
    "contact_name",
    "contact_info",
  ];

  if (!requiredFieldsPresent(req.body || {}, requiredFields)) {
    return res.status(400).json({
      error: "Missing required fields",
      requiredFields,
    });
  }

  const sql = `
    INSERT INTO lost_items
      (item_name, description, location, date_lost, contact_name, contact_info)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [item_name, description, location, date_lost, contact_name, contact_info],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Failed to add lost item" });
      }

      return res.status(201).json({
        id: results.insertId,
        item_name,
        description,
        location,
        date_lost,
        contact_name,
        contact_info,
      });
    }
  );
};

exports.getLostItems = (req, res) => {
  const sql = `
    SELECT
      item_name, description, location, date_lost, contact_name, contact_info
    FROM lost_items
    ORDER BY date_lost DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: "Failed to fetch lost items" });
    return res.json(rows);
  });
};

exports.searchLostItems = (req, res) => {
  const query = (req.query.query || "").toString().trim();
  if (!query) return res.status(400).json({ error: "Missing query parameter" });

  const like = `%${query}%`;

  const sql = `
    SELECT
      item_name, description, location, date_lost, contact_name, contact_info
    FROM lost_items
    WHERE item_name LIKE ? OR location LIKE ?
    ORDER BY date_lost DESC
  `;

  db.query(sql, [like, like], (err, rows) => {
    if (err) return res.status(500).json({ error: "Failed to search lost items" });
    return res.json(rows);
  });
};

