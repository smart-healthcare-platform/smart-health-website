import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { getMessaging, getToken, onMessage, Messaging, isSupported } from 'firebase/messaging';
import { api, isAuthenticated } from './auth-helpers';
import { debugFirebaseConfig, getVapidKeyStatus } from './firebase-debug';
import { resetFCMCompletely, softResetFCM, checkFCMHealth, testVapidKey, showFCMCommands } from './fcm-reset';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
let app: FirebaseApp;
let analytics: Analytics | null = null;
let messaging: Messaging | null = null;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize analytics only on client side
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize messaging only on client side
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(app);
    } else {
      console.warn('[Firebase] Messaging not supported in this browser');
    }
  });
}

export { app, analytics, messaging };

/**
 * Request notification permission and get FCM token
 */
export async function requestNotificationPermission(userId: string): Promise<string | null> {
  if (!messaging) {
    console.warn('Firebase messaging not supported on this browser');
    return null;
  }

  try {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return null;
    }

    // Debug: Check VAPID key
    const vapidStatus = getVapidKeyStatus();
    if (!vapidStatus.exists) {
      console.error('❌ VAPID KEY IS MISSING!');
      console.error('Please add NEXT_PUBLIC_FIREBASE_VAPID_KEY to your .env.local file');
      console.error('Get it from: Firebase Console → Project Settings → Cloud Messaging → Web Push certificates');
      
      // Show debug info
      console.log('Run debugFirebaseConfig() in console for more details');
      
      return null;
    }
    
    // Validate and trim VAPID key
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY?.trim() || '';
    
    // Validate VAPID key format and length
    // Firebase VAPID keys are base64url-encoded and typically 87-88 characters
    // The key must start with 'B' (indicates uncompressed public key in base64url)
    if (!vapidKey.startsWith('B')) {
      console.error('❌ VAPID KEY FORMAT INVALID!');
      console.error('   Firebase VAPID keys must start with "B"');
      console.error(`   Your key starts with: "${vapidKey.substring(0, 5)}..."`);
      console.error('');
      console.error('🔧 SOLUTION:');
      console.error('   1. Go to Firebase Console → Project Settings → Cloud Messaging');
      console.error('   2. Scroll to "Web Push certificates" section');
      console.error('   3. If no key exists, click "Generate key pair"');
      console.error('   4. Copy the ENTIRE key (should start with B)');
      console.error('   5. Update .env.local: NEXT_PUBLIC_FIREBASE_VAPID_KEY=<key>');
      console.error('   6. Restart dev server');
      return null;
    }
    
    // Check key length (87-88 is typical, but allow some variance)
    if (vapidKey.length < 85 || vapidKey.length > 90) {
      console.warn('⚠️ VAPID KEY LENGTH UNUSUAL!');
      console.warn(`   Current length: ${vapidKey.length} characters`);
      console.warn('   Expected: 87-88 characters (typical range)');
      console.warn('   This may still work, but verify the key is complete');
      console.log('');
    } else {
      console.log('✅ VAPID key format and length OK:', vapidKey.length, 'characters');
    }
    
    // Validate key matches the Firebase project
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
    
    console.log('📋 VAPID Key Info:');
    console.log(`   Key preview: ${vapidStatus.preview}`);
    console.log(`   Key length: ${vapidKey.length} chars`);
    console.log(`   Firebase Project: ${projectId}`);
    console.log(`   Sender ID: ${messagingSenderId}`);
    console.log('');
    console.log('⚠️ CRITICAL: VAPID key MUST be generated from the same Firebase project!');
    console.log(`   Verify this key is from project: ${projectId}`);
    console.log('   If unsure, delete and regenerate the key in Firebase Console');
    console.log('');

    // Request permission
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Notification permission granted');
      
      // Check and update service worker
      if ('serviceWorker' in navigator) {
        let swRegistration = await navigator.serviceWorker.getRegistration();
        if (!swRegistration) {
          console.warn('⚠️ Service worker not registered. Attempting to register...');
          try {
            swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
            console.log('✅ Service worker registered successfully');
            // Wait for service worker to be ready
            await navigator.serviceWorker.ready;
          } catch (swError) {
            console.error('❌ Failed to register service worker:', swError);
            return null;
          }
        } else {
          // Force update the service worker to clear any cache
          try {
            await swRegistration.update();
            console.log('🔄 Service worker updated');
          } catch (updateError) {
            console.warn('⚠️ Could not update service worker:', updateError);
          }
        }
      }
      
      // Get FCM token with retry logic
      console.log('Requesting FCM token...');
      
      // Ensure service worker is ready before requesting token
      const swRegistration = await navigator.serviceWorker.ready;
      console.log('✅ Service worker ready, scope:', swRegistration.scope);
      
      let token;
      try {
        token = await getToken(messaging, {
          vapidKey: vapidKey,
          serviceWorkerRegistration: swRegistration,
        });
      } catch (tokenError) {
        console.error('❌ First token attempt failed:', tokenError);
        
        // Try to unregister and re-register service worker
        console.log('🔄 Attempting to refresh service worker...');
        await swRegistration.unregister();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const newRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        await navigator.serviceWorker.ready;
        
        console.log('🔄 Retrying token request with fresh service worker...');
        token = await getToken(messaging, {
          vapidKey: vapidKey,
          serviceWorkerRegistration: newRegistration,
        });
      }
      
      if (token) {
        console.log('✅ FCM Token obtained:', token);
        
        // Register token with backend via API Gateway
        await registerDeviceToken(userId, token);
        
        return token;
      } else {
        console.warn('No registration token available');
        console.log('💡 Tip: Check browser console for errors');
        console.log('💡 Run debugFirebaseConfig() for detailed diagnostics');
        return null;
      }
    } else if (permission === 'denied') {
      console.warn('Notification permission denied');
      return null;
    } else {
      console.warn('Notification permission dismissed');
      return null;
    }
  } catch (error) {
    console.error('❌ Error getting FCM token:', error);
      
    // Provide helpful error messages
    if (error instanceof Error) {
      const currentVapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY?.trim();
      
      if (error.message.includes('messaging/failed-service-worker-registration')) {
        console.error('💡 Solution: Check if /firebase-messaging-sw.js exists in public folder');
      } else if (error.message.includes('messaging/permission-blocked')) {
        console.error('💡 Solution: Reset notification permissions in browser settings');
      } else if (error.message.includes('InvalidAccessError') || error.message.includes('applicationServerKey')) {
        console.error('💡 VAPID KEY IS INVALID!');
        console.error('   Steps to fix:');
        console.error('   1. Go to Firebase Console → Project Settings → Cloud Messaging');
        console.error('   2. Under "Web Push certificates", click "Generate key pair" for a NEW key');
        console.error('   3. Copy the ENTIRE key value');
        console.error('   4. Update .env.local: NEXT_PUBLIC_FIREBASE_VAPID_KEY=<new-key>');
        console.error('   5. Make sure the key matches the Firebase project config');
        console.error('');
        console.error('   Current key preview:', currentVapidKey?.substring(0, 20) + '...');
        console.error('   Current key length:', currentVapidKey?.length || 0, 'chars');
      } else if (error.message.includes('AbortError') || error.message.includes('push service error')) {
        console.error('💡 Possible causes:');
        console.error('   1. VAPID key does not match Firebase project');
        console.error('   2. Service worker file has errors');
        console.error('   3. Firebase project settings mismatch');
        console.error('   4. Browser push service temporarily unavailable');
        console.error('');
        console.error('🔍 To diagnose, run in console: debugFirebaseConfig()');
      }
    }
      
    return null;
  }
}

/**
 * Register device token with backend via API Gateway
 */
async function registerDeviceToken(userId: string, token: string): Promise<void> {
  try {
    // Check authentication
    if (!isAuthenticated()) {
      console.error('No authentication token found. User must be logged in to register device.');
      return;
    }

    // Call API Gateway endpoint: /v1/notifications/device/register
    const data = await api.post('/notifications/device/register', {
      userId,
      deviceToken: token,
      deviceType: 'web',
    });

    console.log('Device registered successfully:', data);
  } catch (error) {
    console.error('Error registering device token:', error);
  }
}

/**
 * Deactivate device token (on logout) via API Gateway
 */
export async function deactivateDeviceToken(userId: string, token: string): Promise<void> {
  try {
    // Check authentication (but allow deactivation even without token during logout)
    const hasAuth = isAuthenticated();
    
    if (!hasAuth) {
      console.warn('No authentication token found for device deactivation. Attempting anyway...');
    }

    // Call API Gateway endpoint: /v1/notifications/device/deactivate
    const data = await api.delete(
      '/notifications/device/deactivate',
      {
        userId,
        deviceToken: token,
      },
      hasAuth // requireAuth - try with auth if available
    );

    console.log('Device deactivated successfully:', data);
  } catch (error) {
    console.error('Error deactivating device token:', error);
  }
}

/**
 * Listen for foreground messages
 */
export function onMessageListener(): Promise<unknown> {
  return new Promise((resolve) => {
    if (!messaging) {
      console.warn('Messaging not initialized');
      return;
    }

    onMessage(messaging, (payload) => {
      console.log('Received foreground message:', payload);
      resolve(payload);
    });
  });
}

/**
 * Check if browser supports notifications
 */
export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window && messaging !== null;
}

/**
 * Get current notification permission status
 */
export function getNotificationPermission(): NotificationPermission | null {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    return Notification.permission;
  }
  return null;
}

/**
 * Expose debug and reset helpers to window for manual debugging
 */
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).debugFirebaseConfig = debugFirebaseConfig;
  (window as unknown as Record<string, unknown>).resetFCM = resetFCMCompletely;
  (window as unknown as Record<string, unknown>).softResetFCM = softResetFCM;
  (window as unknown as Record<string, unknown>).checkFCMHealth = checkFCMHealth;
  (window as unknown as Record<string, unknown>).testVapidKey = testVapidKey;
  (window as unknown as Record<string, unknown>).showFCMCommands = showFCMCommands;
}