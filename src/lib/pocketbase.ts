import PocketBase from 'pocketbase';

// Create a new instance
const pb = new PocketBase(import.meta.env.VITE_POCKET_URL);

// Enable auto cancellation of pending requests
pb.autoCancellation(false);

export { pb };