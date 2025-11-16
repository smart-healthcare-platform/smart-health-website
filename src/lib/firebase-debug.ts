/**
 * Firebase Debug Helper
 * Use this to diagnose Firebase FCM configuration issues
 */

export function debugFirebaseConfig() {
  console.group('🔍 Firebase Configuration Debug');
  
  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log('  NEXT_PUBLIC_FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing');
  console.log('  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing');
  console.log('  NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing');
  console.log('  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✅ Set' : '❌ Missing');
  console.log('  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:', process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✅ Set' : '❌ Missing');
  console.log('  NEXT_PUBLIC_FIREBASE_APP_ID:', process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✅ Set' : '❌ Missing');
  console.log('  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID:', process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ? '✅ Set' : '❌ Missing');
  console.log('  NEXT_PUBLIC_FIREBASE_VAPID_KEY:', process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ? '✅ Set' : '❌ Missing');
  
  if (!process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY) {
    console.error('⚠️ VAPID KEY IS MISSING! This is required for FCM.');
    console.log('📝 To fix:');
    console.log('  1. Go to Firebase Console → Project Settings → Cloud Messaging');
    console.log('  2. Under "Web Push certificates", find your VAPID key');
    console.log('  3. Add to .env.local: NEXT_PUBLIC_FIREBASE_VAPID_KEY=your-vapid-key');
  } else {
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    console.log('  VAPID Key (first 20 chars):', vapidKey.substring(0, 20) + '...');
    console.log('  VAPID Key (last 10 chars):', '...' + vapidKey.substring(vapidKey.length - 10));
    console.log('  VAPID Key length:', vapidKey.length, (vapidKey.length >= 87 && vapidKey.length <= 88) ? '✅' : '⚠️ (typical: 87-88)');
    
    if (vapidKey.length < 80 || vapidKey.length > 95) {
      console.error('❌ VAPID KEY LENGTH UNUSUAL!');
      console.log('📝 Your key has', vapidKey.length, 'characters');
      console.log('📝 Typical range: 87-88 characters (but may vary)');
      console.log('');
      console.log('🔍 Common causes:');
      console.log('  1. Key was truncated when copying from Firebase Console');
      console.log('  2. Extra space/newline in .env.local file');
      console.log('  3. Copied from wrong field (use "Key pair" not "Sender ID")');
      console.log('');
      console.log('✅ Fix: Go to Firebase Console → Project Settings → Cloud Messaging');
      console.log('   Copy the ENTIRE "Key pair" value (should start with B)');
      console.log('   Paste into .env.local: NEXT_PUBLIC_FIREBASE_VAPID_KEY=<paste here>');
      console.log('');
      console.log('📋 Full key for verification:');
      console.log('   ' + vapidKey);
      console.log('   Length: ' + vapidKey.length + ' chars');
    }
  }
  
  console.log('');
  
  // Check browser support
  console.log('🌐 Browser Support:');
  console.log('  Notification API:', 'Notification' in window ? '✅ Supported' : '❌ Not supported');
  console.log('  Service Worker API:', 'serviceWorker' in navigator ? '✅ Supported' : '❌ Not supported');
  console.log('  Push API:', 'PushManager' in window ? '✅ Supported' : '❌ Not supported');
  
  if ('Notification' in window) {
    console.log('  Current Permission:', Notification.permission);
  }
  
  console.log('');
  
  // Check service worker
  console.log('🔧 Service Worker Status:');
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      console.log('  Registered Service Workers:', registrations.length);
      registrations.forEach((registration, index) => {
        console.log(`    ${index + 1}. Scope: ${registration.scope}`);
        console.log(`       Active: ${registration.active ? '✅' : '❌'}`);
        console.log(`       Installing: ${registration.installing ? 'Yes' : 'No'}`);
        console.log(`       Waiting: ${registration.waiting ? 'Yes' : 'No'}`);
      });
      
      if (registrations.length === 0) {
        console.warn('  ⚠️ No service workers registered');
        console.log('  📝 Firebase messaging requires a service worker');
        console.log('     Check if /firebase-messaging-sw.js exists in public folder');
      }
    });
  } else {
    console.error('  ❌ Service Worker not supported in this browser');
  }
  
  console.log('');
  
  // Check service worker file
  console.log('📄 Service Worker File Check:');
  fetch('/firebase-messaging-sw.js')
    .then(response => {
      if (response.ok) {
        console.log('  ✅ /firebase-messaging-sw.js exists');
        console.log('  Status:', response.status);
        console.log('  Content-Type:', response.headers.get('content-type'));
      } else {
        console.error('  ❌ /firebase-messaging-sw.js not found');
        console.log('  Status:', response.status);
      }
    })
    .catch(error => {
      console.error('  ❌ Error checking service worker file:', error);
    });
  
  console.log('');
  
  // Check SSL (required for FCM)
  console.log('🔒 Security:');
  console.log('  Protocol:', window.location.protocol);
  if (window.location.protocol === 'https:' || window.location.hostname === 'localhost') {
    console.log('  ✅ Secure context (HTTPS or localhost)');
  } else {
    console.error('  ❌ Insecure context! FCM requires HTTPS or localhost');
  }
  
  console.log('');
  
  // Recommendations
  console.log('💡 Recommendations:');
  
  const issues: string[] = [];
  
  if (!process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY) {
    issues.push('❌ CRITICAL: VAPID key is missing');
  }
  
  if (!('Notification' in window)) {
    issues.push('❌ Browser does not support notifications');
  }
  
  if (!('serviceWorker' in navigator)) {
    issues.push('❌ Browser does not support service workers');
  }
  
  if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
    issues.push('❌ Not using HTTPS (required for production)');
  }
  
  if (issues.length === 0) {
    console.log('  ✅ All checks passed! Configuration looks good.');
  } else {
    console.log('  Issues found:');
    issues.forEach(issue => console.log('  ' + issue));
  }
  
  console.log('');
  
  // Check if Firebase config matches between app and service worker
  console.log('🔄 Config Verification:');
  console.log('  Checking if app config matches service worker...');
  
  fetch('/firebase-messaging-sw.js')
    .then(response => response.text())
    .then(swContent => {
      // Extract config from service worker
      const projectIdMatch = swContent.match(/projectId:\s*["']([^"']+)["']/);
      const messagingSenderIdMatch = swContent.match(/messagingSenderId:\s*["']([^"']+)["']/);
      const appIdMatch = swContent.match(/appId:\s*["']([^"']+)["']/);
      
      const swProjectId = projectIdMatch ? projectIdMatch[1] : null;
      const swMessagingSenderId = messagingSenderIdMatch ? messagingSenderIdMatch[1] : null;
      const swAppId = appIdMatch ? appIdMatch[1] : null;
      
      console.log('  Service Worker Config:');
      console.log('    projectId:', swProjectId);
      console.log('    messagingSenderId:', swMessagingSenderId);
      console.log('    appId:', swAppId);
      console.log('');
      console.log('  App Config (.env.local):');
      console.log('    projectId:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
      console.log('    messagingSenderId:', process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID);
      console.log('    appId:', process.env.NEXT_PUBLIC_FIREBASE_APP_ID);
      console.log('');
      
      // Validate match
      const projectIdMatches = swProjectId === process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      const senderIdMatches = swMessagingSenderId === process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
      const appIdMatches = swAppId === process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
      
      if (projectIdMatches && senderIdMatches && appIdMatches) {
        console.log('  ✅ Configs match! App and service worker use same Firebase project');
      } else {
        console.error('  ❌ CONFIG MISMATCH DETECTED!');
        if (!projectIdMatches) console.error('    projectId does not match');
        if (!senderIdMatches) console.error('    messagingSenderId does not match');
        if (!appIdMatches) console.error('    appId does not match');
        console.log('');
        console.log('  🔧 Fix: Ensure .env.local values match service worker config');
        console.log('     OR update public/firebase-messaging-sw.js to use same values');
        console.log('');
        console.log('  ⚠️ IMPORTANT: VAPID key must be generated from the SAME Firebase project!');
        console.log('     Current service worker project: ' + swProjectId);
        console.log('     Make sure VAPID key is from project: ' + swProjectId);
      }
    })
    .catch(err => {
      console.warn('  Could not verify config match:', err.message);
    });
  
  console.groupEnd();
}

/**
 * Get VAPID key status
 */
export function getVapidKeyStatus(): {
  exists: boolean;
  length: number;
  isValid: boolean;
  preview: string;
} {
  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || '';
  
  return {
    exists: !!vapidKey,
    length: vapidKey.length,
    isValid: vapidKey.length >= 87 && vapidKey.length <= 88, // Valid VAPID key length range
    preview: vapidKey ? vapidKey.substring(0, 20) + '...' : 'Not set',
  };
}

/**
 * Register service worker manually for debugging
 */
export async function registerServiceWorkerManually(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.error('Service Worker not supported');
    return null;
  }
  
  try {
    console.log('🔧 Attempting to register service worker...');
    
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/',
    });
    
    console.log('✅ Service Worker registered:', registration);
    console.log('   Scope:', registration.scope);
    console.log('   Active:', registration.active ? 'Yes' : 'No');
    
    return registration;
  } catch (error) {
    console.error('❌ Service Worker registration failed:', error);
    return null;
  }
}

/**
 * Check if service worker is registered and active
 */
export async function checkServiceWorkerStatus(): Promise<{
  registered: boolean;
  active: boolean;
  scope: string | null;
  error: string | null;
}> {
  if (!('serviceWorker' in navigator)) {
    return {
      registered: false,
      active: false,
      scope: null,
      error: 'Service Worker not supported in this browser',
    };
  }
  
  try {
    const registration = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js');
    
    if (!registration) {
      return {
        registered: false,
        active: false,
        scope: null,
        error: 'Service Worker not registered',
      };
    }
    
    return {
      registered: true,
      active: !!registration.active,
      scope: registration.scope,
      error: null,
    };
  } catch (error) {
    return {
      registered: false,
      active: false,
      scope: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Fix common Firebase FCM issues
 */
export async function autoFixFirebaseIssues(): Promise<void> {
  console.group('🔧 Auto-fixing Firebase FCM Issues');
  
  // 1. Check and register service worker
  console.log('1. Checking service worker...');
  const swStatus = await checkServiceWorkerStatus();
  
  if (!swStatus.registered) {
    console.log('   ⚠️ Service worker not registered. Attempting to register...');
    const registration = await registerServiceWorkerManually();
    if (registration) {
      console.log('   ✅ Service worker registered successfully');
    } else {
      console.error('   ❌ Failed to register service worker');
    }
  } else {
    console.log('   ✅ Service worker already registered');
  }
  
  // 2. Check VAPID key
  console.log('2. Checking VAPID key...');
  const vapidStatus = getVapidKeyStatus();
  
  if (!vapidStatus.exists) {
    console.error('   ❌ VAPID key is missing!');
    console.log('   📝 Action required: Add VAPID key to .env.local');
    console.log('      NEXT_PUBLIC_FIREBASE_VAPID_KEY=your-key-here');
  } else if (!vapidStatus.isValid) {
    console.warn('   ⚠️ VAPID key length is unusual:', vapidStatus.length, '(expected 87-88)');
    console.log('   Please verify your VAPID key is correct');
  } else {
    console.log('   ✅ VAPID key is set and valid');
  }
  
  // 3. Check notification permission
  console.log('3. Checking notification permission...');
  if ('Notification' in window) {
    console.log('   Current permission:', Notification.permission);
    
    if (Notification.permission === 'denied') {
      console.error('   ❌ Notification permission denied by user');
      console.log('   📝 User must manually enable notifications in browser settings');
    } else if (Notification.permission === 'default') {
      console.log('   ℹ️ Permission not yet requested');
    } else {
      console.log('   ✅ Notification permission granted');
    }
  }
  
  console.groupEnd();
}