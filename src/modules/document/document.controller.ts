import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { createDocumentSchema } from './document.validation';
import { documentService } from './document.service';

const uploadsDir = path.resolve(process.cwd(), 'uploads', 'documents');
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '');
    cb(null, `${uuidv4()}${ext}`);
  },
});

export const documentUpload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
});

export const uploadDocumentFile = async (req: Request, res: Response): Promise<void> => {
  const file = (req as Request & { file?: Express.Multer.File }).file;
  if (!file) {
    res.status(400).json({ message: 'File is required' });
    return;
  }

  res.status(201).json({
    message: 'File uploaded successfully',
    data: {
      fileUrl: `/uploads/documents/${file.filename}`,
      fileName: file.originalname,
    },
  });
};

export const createDocument = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = createDocumentSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  const hasFile = Boolean((req as Request & { file?: Express.Multer.File }).file);
  const bodyFileUrl = (value.fileUrl ?? '').toString().trim();
  if (!hasFile && !bodyFileUrl) {
    res.status(400).json({ message: 'Provide either a file upload or fileUrl' });
    return;
  }

  const file = (req as Request & { file?: Express.Multer.File }).file;
  const fileUrl = file ? `/uploads/documents/${file.filename}` : bodyFileUrl;
  const fileName = (value.fileName ?? '').toString().trim() || (file ? file.originalname : null);

  try {
    const doc = await documentService.createDocument({
      ownerType: value.ownerType,
      ownerId: value.ownerId,
      type: value.type,
      fileUrl,
      fileName,
    });

    res.status(201).json({ message: 'Document created successfully', data: doc });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};
