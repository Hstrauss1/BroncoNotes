export type Account = {
  user_id: string;
  avatar: string;
  name: string;
  points_tot: number;
};

export type Comment = {
  create_time: string;
  note_id: string;
  review: string;
  user_id: string;
};

export type Like = {
  note_id: string;
  user_id: string;
};

export type Note = {
  note_id: string;
  user_id: string;
  votes: number;
  title: string;
  storage_path: string;
  cost: number;
};

export type Unlocked = {
  note_id: string;
  user_id: string;
};
