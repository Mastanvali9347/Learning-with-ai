import { motion } from 'framer-motion';

interface Language {
  id: string;
  label: string;
  nativeName: string;
}

interface LanguageSelectorProps {
  languages: Language[];
  onSelect: (languageId: string) => void;
}

export function LanguageSelector({ languages, onSelect }: LanguageSelectorProps) {
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
        Choose Your Language
      </motion.h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto pr-2">
        {languages.map((language, index) => (
          <motion.button
            key={language.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: 0.3 + index * 0.03,
              type: "spring",
              stiffness: 200,
              damping: 20
            }}
            whileHover={{ 
              scale: 1.05, 
              y: -3,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(language.id)}
            className="p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-700 hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 rounded-xl transition-all hover:shadow-md group"
          >
            <p className="text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 mb-1">{language.label}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-300">{language.nativeName}</p>
          </motion.button>
        ))}
      </div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-center"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400">🌍 Supporting {languages.length}+ languages across India</p>
      </motion.div>
    </motion.div>
  );
}