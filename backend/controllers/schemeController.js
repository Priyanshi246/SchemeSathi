const db = require('../config/db');

/**
 * @desc    Get all schemes (with optional category filter)
 * @route   GET /api/schemes
 */
async function getAllSchemes(req, res) {
  try {
    const { category } = req.query;
    let schemes = await db.schemes.list();

    if (category) {
      schemes = schemes.filter(s => s.category.toLowerCase() === category.toLowerCase());
    }

    return res.json({
      success: true,
      count: schemes.length,
      schemes
    });
  } catch (err) {
    console.error("Fetch Schemes Error:", err);
    return res.status(500).json({ success: false, message: "Server error fetching schemes list" });
  }
}

/**
 * @desc    Get details of a single scheme
 * @route   GET /api/schemes/:id
 */
async function getSchemeById(req, res) {
  try {
    const scheme = await db.schemes.findById(req.params.id);
    if (!scheme) {
      return res.status(404).json({ success: false, message: "Scheme not found" });
    }

    return res.json({
      success: true,
      scheme
    });
  } catch (err) {
    console.error("Fetch Scheme Detail Error:", err);
    return res.status(500).json({ success: false, message: "Server error fetching scheme details" });
  }
}

module.exports = {
  getAllSchemes,
  getSchemeById
};
