import { motion } from 'motion/react';
import { Brain, Presentation, BookOpen, Target, Lightbulb, Users } from 'lucide-react';

interface TeachingMethod {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface TeachingMethodSelectorProps {
  methods: TeachingMethod[];
  onSelect: (methodId: string) => void;
}

export function TeachingMethodSelector({ methods, onSelect }: TeachingMethodSelectorProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
    >
      <motion.h3 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-900 dark:text-white mb-2"
      >
        Choose Teaching Method
      </motion.h3>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-600 dark:text-gray-400 text-sm mb-4"
      >
        Select how you'd like to learn this topic
      </motion.p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {methods.map((method, index) => (
          <motion.button
            key={method.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              delay: 0.4 + index * 0.1,
              type: "spring",
              stiffness: 150,
              damping: 20
            }}
            whileHover={{ 
              scale: 1.02, 
              x: 5,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(method.id)}
            className="p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-700 hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 rounded-xl transition-all hover:shadow-lg group text-left"
          >
            <div className="flex items-start gap-3">
              <motion.div 
                className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {method.icon}
              </motion.div>
              <div className="flex-1">
                <p className="text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 mb-1">
                  {method.label}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-300">
                  {method.description}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
