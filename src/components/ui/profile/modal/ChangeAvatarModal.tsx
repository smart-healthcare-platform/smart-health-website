// app/profile/components/ChangeAvatarModal.tsx
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
interface ChangeAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAvatarChange: (newAvatar: string) => void;
  currentAvatar: string;
}

export default function ChangeAvatarModal({ isOpen, onClose, onAvatarChange, currentAvatar }: ChangeAvatarModalProps) {
  const [previewAvatar, setPreviewAvatar] = useState(currentAvatar);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile); // Tạo URL tạm cho ảnh
      onAvatarChange(url); // Gửi URL tạm hoặc xử lý upload API ở đây
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl"
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Đổi ảnh đại diện</h3>
            <div className="mb-6">
              <div className="flex justify-center mb-4">
                <Image
                  src={previewAvatar}
                  alt="Avatar preview"
                  width={150}
                  height={150}
                  className="rounded-full object-cover border-2 border-gray-300"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-all"
              >
                Hủy
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
              >
                Lưu
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}