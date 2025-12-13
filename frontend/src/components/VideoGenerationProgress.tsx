import { useEffect, useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface VideoGenerationProgressProps {
  topic: string;
  type: string;
  method?: string;
  language: string;
}

interface Step {
  id: string;
  label: string;
  status: 'pending' | 'processing' | 'complete';
}

export function VideoGenerationProgress({ topic, type, method, language }: VideoGenerationProgressProps) {
  const [steps, setSteps] = useState<Step[]>([
    { id: '1', label: 'Analyzing topic content', status: 'processing' },
    { id: '2', label: 'Generating script and structure', status: 'pending' },
    { id: '3', label: 'Creating visual animations', status: 'pending' },
    { id: '4', label: 'Generating treemap visualization', status: 'pending' },
    { id: '5', label: `Creating AI voiceover in ${language}`, status: 'pending' },
    { id: '6', label: 'Adding subtitles', status: 'pending' },
    { id: '7', label: 'Rendering final video', status: 'pending' },
  ]);

  useEffect(() => {
    const stepDuration = 700; // Time per step in ms
    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setSteps((prev) =>
          prev.map((step, index) => {
            if (index === currentStep) {
              return { ...step, status: 'complete' };
            } else if (index === currentStep + 1) {
              return { ...step, status: 'processing' };
            }
            return step;
          })
        );
        currentStep++;
      } else {
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
    >
      <div className="text-center mb-6">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl mb-4"
        >
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </motion.div>
        <motion.h3 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-900 dark:text-white mb-2"
        >
          Generating Your Video...
        </motion.h3>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 dark:text-gray-400"
        >
          Creating an engaging video about <span className="text-blue-600 dark:text-blue-400">{topic}</span> ({type})
        </motion.p>
      </div>

      <div className="space-y-3 max-w-md mx-auto">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              step.status === 'complete'
                ? 'bg-green-50 dark:bg-green-900/20'
                : step.status === 'processing'
                ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                : 'bg-gray-50 dark:bg-gray-700'
            }`}
          >
            <div className="flex-shrink-0">
              {step.status === 'complete' ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                </motion.div>
              ) : step.status === 'processing' ? (
                <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
              ) : (
                <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-full" />
              )}
            </div>
            <p
              className={`text-sm ${
                step.status === 'complete'
                  ? 'text-green-700 dark:text-green-400'
                  : step.status === 'processing'
                  ? 'text-blue-700 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {step.label}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400"
      >
        <p>⏱️ Estimated time: 30-60 seconds</p>
      </motion.div>
    </motion.div>
  );
}