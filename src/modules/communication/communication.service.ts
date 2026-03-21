import { Announcement } from './announcement.model';
import { Message } from './message.model';
import { FindOptions, WhereOptions } from 'sequelize';
import { generateUuid } from '../../core/utils/uuid';
import {
  AnnouncementResponse,
  CreateAnnouncementDTO,
  CreateMessageDTO,
  MessageResponse,
  UpdateAnnouncementDTO,
} from './communication.types';
import { School } from '../platform/school.model';
import { User } from '../users/user.model';

export class SchoolNotFoundError extends Error {
  constructor() {
    super('School not found');
  }
}

export class AnnouncementNotFoundError extends Error {
  constructor() {
    super('Announcement not found');
  }
}

export class UserNotFoundError extends Error {
  constructor() {
    super('User not found');
  }
}

export class SchoolMismatchError extends Error {
  constructor() {
    super('Users are not in the same school');
  }
}

export const communicationService = {
  async createAnnouncement(
    input: CreateAnnouncementDTO,
    createdBy: string
  ): Promise<AnnouncementResponse> {
    const school = await School.findByPk(input.school_id);
    if (!school) {
      throw new SchoolNotFoundError();
    }

    const announcement = await Announcement.create({
      id: generateUuid(),
      school_id: input.school_id,
      title: input.title,
      message: input.message,
      target_role: input.target_role ?? null,
      created_by: createdBy,
    });

    return announcement.get({ plain: true }) as AnnouncementResponse;
  },

  async listAnnouncements(
    schoolId: string,
    options?: { where?: WhereOptions; order?: FindOptions['order']; limit?: number; offset?: number }
  ): Promise<{ rows: AnnouncementResponse[]; count: number }> {
    const result = await Announcement.findAndCountAll({
      where: { school_id: schoolId, ...(options?.where ?? {}) },
      order: options?.order,
      limit: options?.limit,
      offset: options?.offset,
    });
    return {
      rows: result.rows.map((item) => item.get({ plain: true }) as AnnouncementResponse),
      count: result.count,
    };
  },

  async updateAnnouncement(
    id: string,
    input: UpdateAnnouncementDTO
  ): Promise<AnnouncementResponse> {
    const announcement = await Announcement.findByPk(id);
    if (!announcement) {
      throw new AnnouncementNotFoundError();
    }

    const updated = await announcement.update({
      title: input.title ?? announcement.title,
      message: input.message ?? announcement.message,
      target_role: input.target_role ?? announcement.target_role,
    });

    return updated.get({ plain: true }) as AnnouncementResponse;
  },

  async deleteAnnouncement(id: string): Promise<void> {
    const announcement = await Announcement.findByPk(id);
    if (!announcement) {
      throw new AnnouncementNotFoundError();
    }
    await announcement.destroy();
  },

  async createMessage(senderId: string, input: CreateMessageDTO): Promise<MessageResponse> {
    const sender = await User.findByPk(senderId);
    if (!sender) {
      throw new UserNotFoundError();
    }
    const receiver = await User.findByPk(input.receiver_id);
    if (!receiver) {
      throw new UserNotFoundError();
    }

    if (sender.school_id !== receiver.school_id) {
      throw new SchoolMismatchError();
    }

    const message = await Message.create({
      id: generateUuid(),
      school_id: sender.school_id ?? '',
      sender_id: senderId,
      receiver_id: input.receiver_id,
      message: input.message,
    });

    return message.get({ plain: true }) as MessageResponse;
  },

  async listSentMessages(
    userId: string,
    options?: { where?: WhereOptions; order?: FindOptions['order']; limit?: number; offset?: number }
  ): Promise<{ rows: MessageResponse[]; count: number }> {
    const result = await Message.findAndCountAll({
      where: { sender_id: userId, ...(options?.where ?? {}) },
      order: options?.order,
      limit: options?.limit,
      offset: options?.offset,
    });
    return {
      rows: result.rows.map((item) => item.get({ plain: true }) as MessageResponse),
      count: result.count,
    };
  },

  async listReceivedMessages(
    userId: string,
    options?: { where?: WhereOptions; order?: FindOptions['order']; limit?: number; offset?: number }
  ): Promise<{ rows: MessageResponse[]; count: number }> {
    const result = await Message.findAndCountAll({
      where: { receiver_id: userId, ...(options?.where ?? {}) },
      order: options?.order,
      limit: options?.limit,
      offset: options?.offset,
    });
    return {
      rows: result.rows.map((item) => item.get({ plain: true }) as MessageResponse),
      count: result.count,
    };
  },
};
