const fs = require("fs-extra");
const path = require("path");

exports.H_Check_Duplicate = async (
  compare = { value: null, role: null, error_msg: null }
) => {
  // Roles
  const roles = {
    folder: async (req, res) => {
      const dir_path = path.join(__dirname, `../../storages/${compare.value}`);
      const exists = await fs.pathExists(dir_path);
      return exists;
    },
    data: async () => {
      const dir_path = path.join(__dirname, `../../storages/${compare.value}`);
      const exists = await fs.pathExists(dir_path);
      return exists;
    },
  };

  if (
    !compare?.value ||
    !compare?.role ||
    !compare?.error_msg
  ) {
    throw new Error(compare.error_msg);
  }

  return await roles[compare.role]();
};
