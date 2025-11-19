'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  requestNotificationPermission, 
  deactivateDeviceToken,
  isNotificationSupported,
  getNotificationPermission
} from '@/lib/firebase';

interface UseNotificationReturn {
  isSupported: boolean;
  permission: NotificationPermission | null;
  requestPermission: () => Promise<boolean>;
  disableNotifications: () => Promise<void>;
  isLoading: boolean;
}

export function useNotification(userId?: string): UseNotificationReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentToken, setCurrentToken] = useState<string | null>(null);

  useEffect(() => {
    // Check if notifications are supported
    setIsSupported(isNotificationSupported());
    setPermission(getNotificationPermission());
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!userId) {
      console.warn('Cannot request permission: userId is not provided');
      return false;
    }

    if (!isSupported) {
      console.warn('Notifications not supported on this browser');
      return false;
    }

    setIsLoading(true);
    try {
      const token = await requestNotificationPermission(userId);
      if (token) {
        setCurrentToken(token);
        setPermission('granted');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [userId, isSupported]);

  const disableNotifications = useCallback(async (): Promise<void> => {
    if (!userId || !currentToken) {
      console.warn('Cannot disable notifications: missing userId or token');
      return;
    }

    setIsLoading(true);
    try {
      await deactivateDeviceToken(userId, currentToken);
      setCurrentToken(null);
      // debug log removed
    } catch (error) {
      console.error('Error disabling notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, currentToken]);

  return {
    isSupported,
    permission,
    requestPermission,
    disableNotifications,
    isLoading,
  };
}