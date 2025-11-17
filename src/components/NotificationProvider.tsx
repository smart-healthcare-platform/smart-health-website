"use client";

import { useEffect, useState, useCallback } from "react";
import {
  requestNotificationPermission,
  onMessageListener,
  isNotificationSupported,
} from "@/lib/firebase";
import { toast } from "react-toastify";
import { isAuthenticated } from "@/lib/auth-helpers";

interface NotificationProviderProps {
  children: React.ReactNode;
  userId?: string;
}

interface FCMPayload {
  notification?: {
    title?: string;
    body?: string;
  };
  data?: {
    conversationId?: string;
    appointmentId?: string;
    [key: string]: string | undefined;
  };
}

export function NotificationProvider({
  children,
  userId,
}: NotificationProviderProps) {
  const [isListening, setIsListening] = useState(false);
  const [permissionStatus, setPermissionStatus] =
    useState<NotificationPermission | null>(null);

  // Request notification permission when user logs in
  useEffect(() => {
    if (userId && !isListening) {
      const initNotifications = async () => {
        // Check if notifications are supported
        if (!isNotificationSupported()) {
          return;
        }

        // Check if user is authenticated (has token in localStorage/sessionStorage)
        if (!isAuthenticated()) {
          console.log(
            "[NotificationProvider] User not authenticated yet, waiting...",
          );
          return;
        }

        // Check current permission
        const currentPermission = Notification.permission;
        setPermissionStatus(currentPermission);

        // Only request permission if not already decided
        if (currentPermission === "default") {
          const token = await requestNotificationPermission(userId);
          if (token) {
            setPermissionStatus("granted");
          }
        } else if (currentPermission === "granted") {
          // Permission already granted, just get the token
          await requestNotificationPermission(userId);
        }
      };

      initNotifications();
    }
  }, [userId, isListening]);

  // Listen for foreground messages
  useEffect(() => {
    if (!userId || isListening) return;

    const setupMessageListener = async () => {
      if (!isNotificationSupported()) {
        return;
      }

      try {
        setIsListening(true);

        // Start listening for messages
        onMessageListener()
          .then((payload: unknown) => {
            const fcmPayload = payload as FCMPayload;

            const title = fcmPayload.notification?.title || "New Notification";
            const body = fcmPayload.notification?.body || "";

            // Show toast notification with emoji and consistent format
            toast.info(`💬 ${title}\n${body}`, {
              onClick: () => {
                // Handle notification click
                if (fcmPayload.data?.conversationId) {
                  window.location.href = `/chat/${fcmPayload.data.conversationId}`;
                } else if (fcmPayload.data?.appointmentId) {
                  window.location.href = `/appointments/${fcmPayload.data.appointmentId}`;
                }
              },
            });

            // Show browser notification if permission granted
            if (Notification.permission === "granted") {
              new Notification(title, {
                body,
                icon: "/icon-192x192.png",
                badge: "/badge-72x72.png",
                tag: fcmPayload.data?.conversationId || "notification",
              });
            }
          })
          .catch((err) => {
            console.error("Error listening to messages:", err);
          });

        return () => {
          // Cleanup if needed
        };
      } catch (error) {
        console.error("Error setting up message listener:", error);
      }
    };

    setupMessageListener();
  }, [userId, isListening]);

  // Request permission UI component (optional)
  const requestPermission = useCallback(async () => {
    if (!userId) {
      toast.warning("Please log in to enable notifications");
      return;
    }

    const token = await requestNotificationPermission(userId);
    if (token) {
      setPermissionStatus("granted");
      toast.success("Notifications enabled!");
    } else {
      toast.error("Failed to enable notifications");
    }
  }, [userId]);

  return (
    <>
      {children}

      {/* Show notification prompt if permission is default */}
      {userId &&
        permissionStatus === "default" &&
        isNotificationSupported() && (
          <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 max-w-md z-50 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Enable Notifications
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Stay updated with new messages and appointments
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={requestPermission}
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Enable
                  </button>
                  <button
                    onClick={() => setPermissionStatus("denied")}
                    className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Not Now
                  </button>
                </div>
              </div>
              <button
                onClick={() => setPermissionStatus("denied")}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
    </>
  );
}
