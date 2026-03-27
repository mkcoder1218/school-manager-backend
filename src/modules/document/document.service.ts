import path from 'path';
import { Document } from './document.model';

export const documentService = {
  async createDocument(input: {
    ownerType: 'student' | 'teacher';
    ownerId: string;
    type: 'id_card' | 'certificate' | 'cv' | 'license' | 'medical' | 'other';
    fileUrl: string;
    fileName?: string | null;
  }): Promise<Document> {
    const fileUrl = input.fileUrl.startsWith('/uploads/')
      ? input.fileUrl
      : input.fileUrl;

    return Document.create({
      ownerType: input.ownerType,
      ownerId: input.ownerId,
      type: input.type,
      fileUrl,
      fileName: input.fileName ?? (fileUrl.startsWith('/uploads/') ? path.basename(fileUrl) : null),
      isVerified: false,
    });
  },
};

