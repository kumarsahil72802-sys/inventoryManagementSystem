import multer from 'multer';

const DOC_FIELDS = [
  { name: 'highestQualificationCertificate', maxCount: 1 },
  { name: 'aadharCard', maxCount: 1 },
  { name: 'panCard', maxCount: 1 },
  { name: 'resumeCertificate', maxCount: 1 },
];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
}).fields(DOC_FIELDS);

/**
 * Only run multer when the request is multipart/form-data (e.g. form with files).
 * Otherwise next() so JSON body is left to body-parser.
 */
export function staffDocumentUpload(req, res, next) {
  const contentType = req.headers['content-type'] || '';
  if (!contentType.includes('multipart/form-data')) {
    return next();
  }
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: 'File upload error', error: err.message });
    }
    next();
  });
}
