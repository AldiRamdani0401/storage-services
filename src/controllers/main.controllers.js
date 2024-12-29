const fs = require("fs-extra");
const path = require("path");
const { createOrganization } = require("./organization/organization.controllers");

const STORAGE_DIR = path.join(__dirname, "../storages");

// Membuat folder utama jika belum ada
fs.ensureDirSync(STORAGE_DIR);

// Membuat folder berdasarkan aplikasi dan subfolder
const getStoragePath = (appName, subFolder) => {
  const folderPath = path.join(STORAGE_DIR, appName, subFolder);
  fs.ensureDirSync(folderPath); // Membuat folder jika belum ada
  return folderPath;
};

exports.controllers = {
  organization: {
    create: createOrganization
  }
}
// Membuat Base Folder Baru (Organization)

// Membuat folder baru
exports.createFolder = (req, res) => {
  const { appName } = req.params;
  const newFolderName = req.body.new_folder_name; // example: users
  const subFolder = req.body.folder_path || ""; // example: indonesian

  if (!newFolderName) {
    return res.status(400).json({ message: "Folder name is required" });
  }

  const folderPath = path.join(STORAGE_DIR, appName, subFolder, newFolderName);

  // Periksa apakah folder sudah ada
  if (fs.existsSync(folderPath)) {
    return res.status(409).json({ message: "Folder already exists" });
  }

  try {
    // Membuat folder baru
    fs.ensureDirSync(folderPath);
    res.status(201).json({ message: "Folder created successfully", folderPath });
  } catch (error) {
    res.status(500).json({ message: "Error creating folder", error });
  }
};

// Upload file
exports.uploadFile = (req, res) => {
  const { appName, subFolder } = req.params;
  const storagePath = getStoragePath(appName, subFolder);

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const newPath = path.join(storagePath, req.file.originalname);

  // Pindahkan file ke folder yang sesuai
  fs.move(req.file.path, newPath, { overwrite: true }, (err) => {
    if (err) {
      return res.status(500).json({ message: "Error saving file", error: err });
    }
    res.status(201).json({
      message: "File uploaded successfully!",
      filePath: newPath,
    });
  });
};

// Mendapatkan daftar file
exports.getFiles = (req, res) => {
  const { appName, subFolder } = req.params;
  const storagePath = getStoragePath(appName, subFolder);

  fs.readdir(storagePath, (err, files) => {
    if (err) {
      return res.status(500).json({ message: "Error reading files", error: err });
    }
    res.status(200).json({ files });
  });
};

// Mengunduh file
exports.downloadFile = (req, res) => {
  const { appName, subFolder, filename } = req.params;
  const filePath = path.join(STORAGE_DIR, appName, subFolder, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }
  res.download(filePath);
};

// Menghapus file
exports.deleteFile = (req, res) => {
  const { appName, subFolder, filename } = req.params;
  const filePath = path.join(STORAGE_DIR, appName, subFolder, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ message: "Error deleting file", error: err });
    }
    res.status(200).json({ message: "File deleted successfully" });
  });
};
