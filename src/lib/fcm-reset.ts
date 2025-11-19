/**
 * FCM Reset Utility
 * Use this to completely reset FCM registration when encountering push service errors
 */

/**
 * Completely reset FCM registration
 * This will:
 * 1. Unregister all service workers
 * 2. Clear all caches
 * 3. Clear IndexedDB (where FCM stores tokens)
 * 4. Reload the page
 */
export async function resetFCMCompletely(): Promise<void> {
  console.log('🔄 Starting complete FCM reset...');

  try {
    // Step 1: Unregister all service workers
    if ('serviceWorker' in navigator) {
      console.log('📝 Unregistering service workers...');
      const registrations = await navigator.serviceWorker.getRegistrations();
      
      for (const registration of registrations) {
        await registration.unregister();
        console.log('✅ Unregistered service worker:', registration.scope);
      }
    }

    // Step 2: Clear all caches
    if ('caches' in window) {
      console.log('📝 Clearing caches...');
      const cacheNames = await caches.keys();
      
      for (const cacheName of cacheNames) {
        await caches.delete(cacheName);
        console.log('✅ Deleted cache:', cacheName);
      }
    }

    // Step 3: Clear FCM IndexedDB
    if ('indexedDB' in window) {
      console.log('📝 Clearing FCM IndexedDB...');
      
      // Firebase uses these databases
      const dbNames = [
        'firebase-messaging-database',
        'firebase-installations-database',
        'firebaseLocalStorageDb'
      ];

      for (const dbName of dbNames) {
        try {
          await deleteIndexedDB(dbName);
          console.log('✅ Deleted IndexedDB:', dbName);
        } catch (error) {
          console.warn('⚠️ Could not delete IndexedDB:', dbName, error);
        }
      }
    }

    // Step 4: Clear localStorage items related to Firebase
    if ('localStorage' in window) {
      console.log('📝 Clearing Firebase localStorage...');
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('firebase') || key.includes('fcm'))) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        console.log('✅ Removed localStorage key:', key);
      });
    }

    console.log('✅ FCM reset complete!');
    console.log('🔄 Reloading page in 2 seconds...');
    
    setTimeout(() => {
      window.location.reload();
    }, 2000);

  } catch (error) {
    console.error('❌ Error during FCM reset:', error);
    throw error;
  }
}

/**
 * Delete an IndexedDB database
 */
function deleteIndexedDB(dbName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(dbName);
    
    request.onsuccess = () => {
      resolve();
    };
    
    request.onerror = () => {
      reject(request.error);
    };
    
    request.onblocked = () => {
      console.warn('⚠️ IndexedDB deletion blocked for:', dbName);
      // Try to resolve anyway
      resolve();
    };
  });
}

/**
 * Soft reset - only unregister service workers and clear FCM cache
 * Use this for less aggressive reset
 */
export async function softResetFCM(): Promise<void> {
  console.log('🔄 Starting soft FCM reset...');

  try {
    // Unregister service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      
      for (const registration of registrations) {
        if (registration.active?.scriptURL.includes('firebase-messaging')) {
          await registration.unregister();
          console.log('✅ Unregistered Firebase service worker');
        }
      }
    }

    // Clear only FCM-related caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      
      for (const cacheName of cacheNames) {
        if (cacheName.includes('firebase') || cacheName.includes('fcm')) {
          await caches.delete(cacheName);
          console.log('✅ Deleted FCM cache:', cacheName);
        }
      }
    }

    console.log('✅ Soft FCM reset complete!');
    console.log('💡 Try requesting notification permission again');

  } catch (error) {
    console.error('❌ Error during soft FCM reset:', error);
    throw error;
  }
}

/**
 * Check FCM health status
 */
export async function checkFCMHealth(): Promise<{
  serviceWorkerRegistered: boolean;
  serviceWorkerActive: boolean;
  notificationPermission: NotificationPermission | null;
  pushSupported: boolean;
  indexedDBs: string[];
  vapidKeyValid: boolean;
  vapidKeyLength: number;
  issues: string[];
}> {
  const issues: string[] = [];
  let serviceWorkerRegistered = false;
  let serviceWorkerActive = false;

  // Check service worker
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    const fcmSW = registrations.find(r => 
      r.active?.scriptURL.includes('firebase-messaging')
    );
    
    if (fcmSW) {
      serviceWorkerRegistered = true;
      serviceWorkerActive = !!fcmSW.active;
    } else {
      issues.push('Firebase service worker not registered');
    }
  } else {
    issues.push('Service Worker API not supported');
  }

  // Check notification permission
  const notificationPermission = 'Notification' in window 
    ? Notification.permission 
    : null;

  if (notificationPermission === 'denied') {
    issues.push('Notification permission denied by user');
  } else if (notificationPermission === 'default') {
    issues.push('Notification permission not yet requested');
  }

  // Check push support
  const pushSupported = 'PushManager' in window;
  if (!pushSupported) {
    issues.push('Push API not supported in this browser');
  }

  // Check VAPID key
  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || '';
  const vapidKeyLength = vapidKey.length;
  const vapidKeyValid = vapidKey.startsWith('B') && vapidKeyLength >= 87 && vapidKeyLength <= 88;
  
  if (!vapidKey) {
    issues.push('VAPID key not configured');
  } else if (!vapidKeyValid) {
    if (!vapidKey.startsWith('B')) {
      issues.push('VAPID key must start with "B"');
    }
    if (vapidKeyLength < 87 || vapidKeyLength > 88) {
      issues.push(`VAPID key length is ${vapidKeyLength}, expected 87-88`);
    }
  }

  // Check IndexedDB
  const indexedDBs: string[] = [];
  if ('indexedDB' in window) {
    try {
      const dbs = await indexedDB.databases();
      indexedDBs.push(...dbs.map(db => db.name || 'unknown'));
    } catch (error) {
      console.warn('Could not list IndexedDB databases:', error);
    }
  }

  console.log('🔍 FCM Health Check Results:');
  console.log('  Service Worker:', serviceWorkerRegistered ? '✅ Registered' : '❌ Not registered');
  console.log('  SW Active:', serviceWorkerActive ? '✅ Yes' : '❌ No');
  console.log('  Notification Permission:', notificationPermission);
  console.log('  Push API:', pushSupported ? '✅ Supported' : '❌ Not supported');
  console.log('  VAPID Key:', vapidKeyValid ? '✅ Valid format' : '❌ Invalid format');
  console.log('  VAPID Key Length:', vapidKeyLength);
  console.log('  IndexedDBs:', indexedDBs);
  
  if (issues.length > 0) {
    console.log('⚠️ Issues Found:');
    issues.forEach(issue => console.log('  -', issue));
    console.log('');
    console.log('💡 Recommended Actions:');
    if (issues.some(i => i.includes('VAPID'))) {
      console.log('  1. Go to Firebase Console → Project Settings → Cloud Messaging');
      console.log('  2. Delete existing Web Push certificate');
      console.log('  3. Generate new key pair');
      console.log('  4. Copy ENTIRE key and update .env.local');
      console.log('  5. Restart dev server');
      console.log('  6. Run: resetFCM()');
    }
    if (!serviceWorkerRegistered || !serviceWorkerActive) {
      console.log('  → Run: softResetFCM()');
    }
  } else {
    console.log('✅ No issues found!');
    console.log('💡 If still getting errors, the VAPID key may not match the Firebase project');
    console.log('   Run: testVapidKey() to verify');
  }

  return {
    serviceWorkerRegistered,
    serviceWorkerActive,
    notificationPermission,
    pushSupported,
    indexedDBs,
    vapidKeyValid,
    vapidKeyLength,
    issues,
  };
}

/**
 * Test VAPID key by attempting to get FCM token
 */
export async function testVapidKey(): Promise<{
  success: boolean;
  error?: string;
  token?: string;
}> {
  console.log('🔍 Testing VAPID key...');
  
  try {
    const { getMessaging, getToken, isSupported } = await import('firebase/messaging');
    const { getApps } = await import('firebase/app');
    
    // Check if messaging is supported
    const supported = await isSupported();
    if (!supported) {
      return {
        success: false,
        error: 'Firebase Messaging not supported in this browser'
      };
    }
    
    // Get Firebase app
    const apps = getApps();
    if (apps.length === 0) {
      return {
        success: false,
        error: 'Firebase app not initialized'
      };
    }
    const app = apps[0];
    
    const messaging = getMessaging(app);
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    
    if (!vapidKey) {
      return {
        success: false,
        error: 'VAPID key not configured'
      };
    }
    
    // Check notification permission
    if (Notification.permission !== 'granted') {
      console.log('⚠️ Notification permission not granted. Requesting...');
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        return {
          success: false,
          error: 'Notification permission denied'
        };
      }
    }
    
    // Ensure service worker is ready
    if ('serviceWorker' in navigator) {
      await navigator.serviceWorker.ready;
    }
    
    // Try to get token
    console.log('📝 Attempting to get FCM token...');
    const token = await getToken(messaging, {
      vapidKey: vapidKey,
      serviceWorkerRegistration: await navigator.serviceWorker.getRegistration()
    });
    
    if (token) {
      console.log('✅ VAPID key is VALID! Token obtained successfully');
      console.log('📋 Token preview:', token.substring(0, 20) + '...');
      return {
        success: true,
        token
      };
    } else {
      console.error('❌ No token returned (but no error thrown)');
      return {
        success: false,
        error: 'No token returned'
      };
    }
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    console.error('❌ VAPID key test FAILED!');
    console.error('Error:', errorMessage);
    
    if (errorMessage.includes('AbortError') || errorMessage.includes('push service error')) {
      console.error('');
      console.error('🔧 This means the VAPID key does NOT match your Firebase project!');
      console.error('');
      console.error('SOLUTION:');
      console.error('1. Go to: https://console.firebase.google.com/project/vv-smart-health/settings/cloudmessaging');
      console.error('2. Scroll to "Web Push certificates"');
      console.error('3. DELETE the existing key pair');
      console.error('4. Click "Generate key pair"');
      console.error('5. Copy the ENTIRE new key');
      console.error('6. Update .env.local: NEXT_PUBLIC_FIREBASE_VAPID_KEY=<new-key>');
      console.error('7. Restart dev server');
      console.error('8. Run: resetFCM()');
    } else if (errorMessage.includes('InvalidAccessError')) {
      console.error('');
      console.error('🔧 VAPID key format is invalid or corrupted');
      console.error('');
      console.error('SOLUTION: Regenerate the key in Firebase Console');
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Show all available FCM commands
 */
export function showFCMCommands(): void {
  console.log('');
  console.log('🔧 FCM Troubleshooting Commands:');
  console.log('');
  console.log('📊 Diagnostics:');
  console.log('  debugFirebaseConfig()  - Show complete Firebase config and diagnostics');
  console.log('  checkFCMHealth()       - Quick health check of FCM setup');
  console.log('  testVapidKey()         - Test if VAPID key works with Firebase');
  console.log('');
  console.log('🔄 Reset Functions:');
  console.log('  softResetFCM()         - Unregister service worker and clear FCM cache');
  console.log('  resetFCM()             - Complete reset (SW, cache, IndexedDB) + reload');
  console.log('');
  console.log('💡 Typical workflow when encountering errors:');
  console.log('  1. checkFCMHealth()    - Identify issues');
  console.log('  2. testVapidKey()      - Verify VAPID key is valid');
  console.log('  3. softResetFCM()      - Try soft reset first');
  console.log('  4. resetFCM()          - If still failing, complete reset');
  console.log('');
  console.log('🔗 If testVapidKey() fails with AbortError:');
  console.log('  → VAPID key does NOT match Firebase project');
  console.log('  → Go to Firebase Console and regenerate the key');
  console.log('  → URL: https://console.firebase.google.com/project/vv-smart-health/settings/cloudmessaging');
  console.log('');
}

/**
 * Expose reset functions to window for console access
 */
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).resetFCM = resetFCMCompletely;
  (window as unknown as Record<string, unknown>).softResetFCM = softResetFCM;
  (window as unknown as Record<string, unknown>).checkFCMHealth = checkFCMHealth;
  (window as unknown as Record<string, unknown>).testVapidKey = testVapidKey;
  (window as unknown as Record<string, unknown>).showFCMCommands = showFCMCommands;
  
  // Auto-show commands on load
  console.log('💡 FCM troubleshooting tools loaded. Type showFCMCommands() to see available commands.');
}