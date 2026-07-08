import { Router, type IRouter } from "express";
import multer from "multer";
import path from "path";
import { randomUUID } from "crypto";
import { mkdirSync } from "fs";

// In serverless environments (Netlify/AWS Lambda) the working directory is
// read-only; only /tmp is writable. Fall back to /tmp so importing this module
// never crashes the function at boot. NOTE: /tmp is ephemeral, so uploads do
// not persist across invocations — object storage (S3/R2/Netlify Blobs) is the
// proper long-term fix.
const isServerless = Boolean(
  process.env.NETLIFY ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.LAMBDA_TASK_ROOT,
);
const WORKSPACE_ROOT = path.resolve(process.cwd(), "..", "..");
const IMAGES_DIR =
  process.env.IMAGES_DIR ||
  (isServerless ? "/tmp/images" : path.join(WORKSPACE_ROOT, "images"));

const listingsDir = path.join(IMAGES_DIR, "listings");
const profilesDir = path.join(IMAGES_DIR, "profiles");

// Best-effort: never throw at import time if the directory cannot be created.
try {
  mkdirSync(listingsDir, { recursive: true });
  mkdirSync(profilesDir, { recursive: true });
} catch {
  // ignore — upload routes will surface a clear error if storage is unavailable
}

function makeStorage(subfolder: "listings" | "profiles") {
  return multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, path.join(IMAGES_DIR, subfolder));
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
      cb(null, `${randomUUID()}${ext}`);
    },
  });
}

const imageFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

const uploadListing = multer({
  storage: makeStorage("listings"),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: imageFilter,
});

const uploadProfile = multer({
  storage: makeStorage("profiles"),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter,
});

const router: IRouter = Router();

router.post("/uploads/listing-photo", uploadListing.single("photo"), (req, res): void => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }
  res.json({ url: `/api/images/listings/${req.file.filename}` });
});

router.post("/uploads/profile-photo", uploadProfile.single("photo"), (req, res): void => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }
  res.json({ url: `/api/images/profiles/${req.file.filename}` });
});

export { IMAGES_DIR };
export default router;
