import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import PocketBase from 'pocketbase';


export function createInstance() {
  return new PocketBase(PUBLIC_POCKETBASE_URL || 'http://localhost:8090')
}

export const pb = createInstance();

export type UserType = {
  id: string;
  name: string;
  is_anonymous: boolean;
  avatar: string;
  created: string;
  updated: string;
}

export type RoomType = {
  id: string;
  ownerId: string;
  roomName: string;
  users: {
    [id: string]: RoomUser
  }
  description: string;
  restrictControl: boolean;
  showVotes: boolean;
  created: string;
  updated: string;
}

export type RoomUser = {
  name: string;
  vote: string;
}