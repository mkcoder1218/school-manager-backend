import { Request, Response } from 'express';
import {
  AnnouncementNotFoundError,
  SchoolMismatchError,
  SchoolNotFoundError,
  UserNotFoundError,
  communicationService,
} from './communication.service';
import {
  createAnnouncementSchema,
  createMessageSchema,
  updateAnnouncementSchema,
} from './communication.validation';
import {
  CreateAnnouncementDTO,
  CreateMessageDTO,
  UpdateAnnouncementDTO,
} from './communication.types';
import { buildListQuery, buildMeta } from '../../core/utils/query';

const resolveSchoolId = (req: Request, bodySchoolId?: string): string | null => {
  if (req.user?.role === 'super_admin') {
    return bodySchoolId ?? (req.query.school_id as string) ?? null;
  }
  return req.user?.school_id ?? null;
};

export const createAnnouncement = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = createAnnouncementSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  const dto = value as CreateAnnouncementDTO;
  const schoolId = resolveSchoolId(req, dto.school_id);
  if (!schoolId || (req.user?.role !== 'super_admin' && dto.school_id !== schoolId)) {
    res.status(403).json({ message: 'Access denied' });
    return;
  }

  try {
    const announcement = await communicationService.createAnnouncement(dto, req.user?.user_id ?? '');
    res.status(201).json({ message: 'Announcement created successfully', data: announcement });
  } catch (error) {
    if (error instanceof SchoolNotFoundError) {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const listAnnouncements = async (req: Request, res: Response): Promise<void> => {
  const schoolId = resolveSchoolId(req);
  if (!schoolId) {
    res.status(400).json({ message: 'school_id is required' });
    return;
  }
  try {
    const { page, limit, offset, sort, order, orderBy, where } = buildListQuery(
      req.query as Record<string, unknown>,
      { allowedSort: ['createdAt', 'title'] }
    );
    const result = await communicationService.listAnnouncements(schoolId, {
      where,
      order: orderBy,
      limit,
      offset,
    });
    res.status(200).json({ data: result.rows, meta: buildMeta({ page, limit, total: result.count, sort, order }) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const listMessages = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.user_id;
  if (!userId) {
    res.status(403).json({ message: 'Access denied' });
    return;
  }

  const box = (req.query.box as string | undefined) ?? 'received';

  try {
    const { page, limit, offset, sort, order, orderBy, where } = buildListQuery(
      req.query as Record<string, unknown>,
      { allowedSort: ['createdAt'] }
    );

    const result =
      box === 'sent'
        ? await communicationService.listSentMessages(userId, {
            where,
            order: orderBy,
            limit,
            offset,
          })
        : await communicationService.listReceivedMessages(userId, {
            where,
            order: orderBy,
            limit,
            offset,
          });

    res.status(200).json({ data: result.rows, meta: buildMeta({ page, limit, total: result.count, sort, order }) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateAnnouncement = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = updateAnnouncementSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  try {
    const updated = await communicationService.updateAnnouncement(
      req.params.announcement_id,
      value as UpdateAnnouncementDTO
    );
    res.status(200).json({ message: 'Announcement updated successfully', data: updated });
  } catch (error) {
    if (error instanceof AnnouncementNotFoundError) {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteAnnouncement = async (req: Request, res: Response): Promise<void> => {
  try {
    await communicationService.deleteAnnouncement(req.params.announcement_id);
    res.status(200).json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    if (error instanceof AnnouncementNotFoundError) {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = createMessageSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }
  try {
    const message = await communicationService.createMessage(
      req.user?.user_id ?? '',
      value as CreateMessageDTO
    );
    res.status(201).json({ message: 'Message sent successfully', data: message });
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      res.status(400).json({ message: error.message });
      return;
    }
    if (error instanceof SchoolMismatchError) {
      res.status(403).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};
