const express = require("express");
const multer = require("multer");
const path = require("path");
const { controllers } = require("../controllers/main.controllers");

const router = express.Router();

// Konfigurasi multer dengan folder sementara
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(__dirname, "../storages/temp")),
  filename: (_req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// ROUTES
router.get("/test", (_req, res) => {
  return res.status(200).json({ message: 'berjalan' });
});

// ** Organization
router.post("/create-organization", controllers.organization.create);

// router.post("/:appName/create-folder", controllers.createFolder);
// router.post("/:appName/:subFolder/upload", upload.single("file"), controllers.uploadFile);
// router.get("/:appName/:subFolder/files", controllers.getFiles);
// router.get("/:appName/:subFolder/download/:filename", controllers.downloadFile);
// router.delete("/:appName/:subFolder/delete/:filename", controllers.deleteFile);

module.exports = router;