const fs = require("fs-extra");
const path = require("path");

// Handlers
const { H_Check_Duplicate } = require("../../utils/handlers/H_Check_Duplicate");

// Constans
const STORAGE_DIR =
  process.env.STORAGE_DIR || path.join(__dirname, "../../storages");

// Ensure the main storage directory exists
fs.ensureDirSync(STORAGE_DIR);

// Create folder based on application and subfolder
const getStoragePath = async (appName, subFolder) => {
  const folderPath = path.join(STORAGE_DIR, appName, subFolder);
  await fs.ensureDir(folderPath); // Create folder if it doesn't exist
  return folderPath;
};

// ## Create a new base folder (Organization)
exports.createOrganization = async (req, res) => {
  try {
    const { organization_name } = req.body;

    if (!organization_name) {
      return res.status(400).json({ error: "Organization name is required" });
    }

    // Handler Check Duplicate
    const isDuplicate = await H_Check_Duplicate({
      value: organization_name,
      role: "folder",
      error_msg: "Missing compare attribute values. Please check again",
    });

    if (isDuplicate) {
      return res.status(409).json({ message: "Organization Already Exists" });
    }

    res
      .status(201)
      .json({ message: `Organization folder created ${organization_name}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ## Get list of folder in Organization
exports.getListFolderByOrganizationId = async (req, res) => {
  try {
    const { organization_name } = req.body;

    if (!organization_name) {
      return res.status(400).json({ error: "Organization name is required" });
    }

    const organizationPath = await getStoragePath(organization_name, "");

    res
      .status(201)
      .json({ message: "Organization folder created", path: organizationPath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
