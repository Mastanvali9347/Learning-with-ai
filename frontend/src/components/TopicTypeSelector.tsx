import { motion } from 'framer-motion';

interface TopicType {
  id: string;
  label: string;
  icon: string;
}

interface TopicTypeSelectorProps {
  types: TopicType[];
  onSelect: (typeId: string) => void;
}

export function TopicTypeSelector({ types, onSelect }: TopicTypeSelectorProps) {
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
        className="text-gray-900 dark:text-white mb-4"
      >
        Select Content Type
      </motion.h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {types.map((type, index) => (
          <motion.button
            key={type.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: 0.3 + index * 0.05,
              type: "spring",
              stiffness: 200,
              damping: 20
            }}
            whileHover={{ 
              scale: 1.05, 
              y: -5,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(type.id)}
            className="p-4 bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 rounded-xl transition-all hover:shadow-md group"
          >
            <motion.div 
              className="text-3xl mb-2"
              whileHover={{ scale: 1.2, rotate: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {type.icon}
            </motion.div>
            <p className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-700 dark:group-hover:text-blue-400">{type.label}</p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}