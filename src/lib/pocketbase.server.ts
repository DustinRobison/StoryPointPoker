import { SECRET_PB_ADMIN_EMAIL, SECRET_PB_ADMIN_PASSWORD } from '$env/static/private';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import PocketBase from 'pocketbase';


export async function createServerInstance() {
  const pb = new PocketBase(PUBLIC_POCKETBASE_URL || 'http://localhost:8090')
  await pb.collection('_superusers').authWithPassword(
    SECRET_PB_ADMIN_EMAIL,
    SECRET_PB_ADMIN_PASSWORD,
  ) 
  return pb;
}


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
  users: Array<{
    id: string;
    name: string;
    vote: string;
  }>;
  description: string;
  restrictControl: boolean;
  showVotes: boolean;
  created: string;
  updated: string;
}