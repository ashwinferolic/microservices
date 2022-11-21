const multer = require("multer");
const XLSX = require("xlsx");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadImage = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

const uploadFile = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "text/csv" ||
      file.mimetype ==
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.mimetype ==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only csv or docx or excel data format allowed"));
    }
  },
});

const getUrl = async (req, res) => {
  let url =
    req.hostname + ":" + process.env.PORT + "/uploads/" + req.file.filename;
  return res.status(201).json({ message: "image upload successfull", url });
};

const getMultipleUrl = async (req, res) => {
  let data = req.files.map(
    (file) =>
      req.hostname + ":" + process.env.PORT + "/uploads/" + file.filename
  );
  return res.status(201).json({ message: "image upload successfull", data });
};

const getJsonData = async (req, res, next) => {
  try {
    const path = req.file.path;
    const workbook = XLSX.readFile(path);
    const sheetList = workbook.SheetNames;
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetList[0]]);
    req.body.data = data;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadImage,
  uploadFile,
  getUrl,
  getMultipleUrl,
  getJsonData,
};
