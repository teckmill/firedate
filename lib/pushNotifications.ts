import webpush from 'web-push';

// Set up VAPID keys (you'll need to generate these)
const vapidKeys = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY,
};

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

export async function sendPushNotification(subscription: PushSubscription, payload: string) {
  try {
    await webpush.sendNotification(subscription, payload);
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
}