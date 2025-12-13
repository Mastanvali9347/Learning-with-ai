import { Video, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface VideoGenerationConfirmProps {
  onConfirm: (confirmed: boolean) => void;
}

export function VideoGenerationConfirm({ onConfirm }: VideoGenerationConfirmProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
    >
      <div className="text-center">
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 15,
            delay: 0.2
          }}
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl mb-4"
        >
          <Video className="w-8 h-8 text-white" />
        </motion.div>
        <motion.h3 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-900 dark:text-white mb-2"
        >
          Generate Learning Video?
        </motion.h3>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 dark:text-gray-400 mb-6"
        >
          I'll create an engaging video with animations, voiceover, and subtitles in your selected language.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 mb-6 text-left border border-blue-100 dark:border-blue-900/50"
        >
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Your video will include:</p>
          <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            {['✨ Animated visual explanations', '🗺️ Treemap visualizations', '📝 Structured content breakdown', '🎙️ AI voiceover narration', '📄 Subtitles in selected language', '📊 Key points and summary', '📥 Downloadable transcript'].map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.05 }}
              >
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex gap-3 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onConfirm(true)}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <Video className="w-5 h-5" />
            YES - Generate Video
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onConfirm(false)}
            className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all flex items-center gap-2"
          >
            <X className="w-5 h-5" />
            NO - Go Back
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}