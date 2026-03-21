export interface CreateAnnouncementDTO {
  school_id: string;
  title: string;
  message: string;
  target_role?: string | null;
}

export interface UpdateAnnouncementDTO {
  title?: string;
  message?: string;
  target_role?: string | null;
}

export interface AnnouncementResponse {
  id: string;
  school_id: string;
  title: string;
  message: string;
  target_role: string | null;
  created_by: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateMessageDTO {
  receiver_id: string;
  message: string;
}

export interface MessageResponse {
  id: string;
  school_id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
}
