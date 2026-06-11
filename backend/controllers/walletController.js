const fs = require('fs');
const path = require('path');
const db = require('../config/db');
const { performOCR } = require('../services/ocrService');

/**
 * @desc    Upload a document & run OCR extraction
 * @route   POST /api/wallet/upload
 */
async function uploadDocument(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please select a file to upload" });
    }

    const { type } = req.body; // Aadhaar Card, Income Certificate, Student ID, etc.
    if (!type) {
      return res.status(400).json({ success: false, message: "Please specify the document type classification" });
    }

    const filePath = req.file.path;
    const originalName = req.file.originalname;

    // 1. Create a draft document entry
    let doc = await db.documents.create({
      user_id: req.user.id,
      name: originalName,
      type,
      file_url: `/uploads/${req.file.filename}`,
      ocr_content: "Analyzing text via AI engine...",
      verified: false
    });

    // 2. Perform OCR asynchronously or inline
    const ocrResult = await performOCR(filePath, originalName);

    // 3. Update document with OCR content
    doc = await db.documents.update(doc.id, {
      ocr_content: ocrResult.text,
      verified: true
    });

    // 4. Check if we can auto-fill profile details from the document!
    const profileUpdates = {};
    if (type === "Income Certificate" && ocrResult.extracted.income) {
      profileUpdates.income = ocrResult.extracted.income;
    }
    if (type === "Aadhaar Card") {
      if (ocrResult.extracted.gender) profileUpdates.gender = ocrResult.extracted.gender;
      if (ocrResult.extracted.name) {
        // we can verify names match
      }
    }
    if (type === "Student ID") {
      profileUpdates.occupation = "Student";
      if (ocrResult.extracted.education) profileUpdates.education = ocrResult.extracted.education;
    }
    if (type === "Domicile Certificate" && ocrResult.extracted.state) {
      profileUpdates.state = ocrResult.extracted.state;
    }

    if (Object.keys(profileUpdates).length > 0) {
      await db.users.update(req.user.id, profileUpdates);
    }

    // 5. Create System Notification
    await db.notifications.create({
      user_id: req.user.id,
      title: `${type} Analyzed`,
      message: `Your ${type} has been parsed via Tesseract OCR. Key-values extracted and profile auto-filled: ${Object.keys(profileUpdates).join(', ') || 'None'}.`
    });

    return res.status(201).json({
      success: true,
      message: "Document uploaded and OCR parsing completed successfully.",
      document: doc,
      autoFilledFields: profileUpdates
    });

  } catch (err) {
    console.error("Upload Document Error:", err);
    return res.status(500).json({ success: false, message: "Server error during document processing" });
  }
}

/**
 * @desc    Get user's uploaded documents
 * @route   GET /api/wallet
 */
async function getUserWallet(req, res) {
  try {
    const documents = await db.documents.findByUserId(req.user.id);
    return res.json({
      success: true,
      count: documents.length,
      documents
    });
  } catch (err) {
    console.error("Fetch Wallet Error:", err);
    return res.status(500).json({ success: false, message: "Server error fetching document wallet" });
  }
}

/**
 * @desc    Delete a wallet document
 * @route   DELETE /api/wallet/:id
 */
async function deleteDocument(req, res) {
  try {
    const doc = await db.documents.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    if (doc.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized access to delete this document" });
    }

    // Try deleting local file
    const localFilePath = path.join(__dirname, '..', doc.file_url);
    if (fs.existsSync(localFilePath)) {
      try {
        fs.unlinkSync(localFilePath);
      } catch (err) {
        console.error("Error deleting physical file:", err.message);
      }
    }

    // Delete record from DB
    await db.documents.delete(doc.id);

    return res.json({
      success: true,
      message: "Document removed from digital wallet successfully."
    });
  } catch (err) {
    console.error("Delete Document Error:", err);
    return res.status(500).json({ success: false, message: "Server error deleting document" });
  }
}

module.exports = {
  uploadDocument,
  getUserWallet,
  deleteDocument
};
