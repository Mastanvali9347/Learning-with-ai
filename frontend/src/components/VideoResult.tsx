import { useState } from 'react';
import { Download, Share2, FileText, RotateCcw, Play, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { VideoPlayer } from './VideoPlayer';

interface VideoResultProps {
  topic: string;
  type: string;
  method?: string;
  language: string;
  videoUrl: string;
  thumbnail: string;
  transcript: string;
  onStartNew: () => void;
}

export function VideoResult({
  topic,
  type,
  method,
  language,
  videoUrl,
  thumbnail,
  transcript,
  onStartNew,
}: VideoResultProps) {
  const [showTranscript, setShowTranscript] = useState(false);
  const [showNotes, setShowNotes] = useState(true);

  // Generate video duration between 15-18 minutes (900-1080 seconds)
  const videoDuration = Math.floor(900 + Math.random() * 180);

  const handleDownload = () => {
    alert('Download functionality will be connected to actual video file generation service');
  };

  const handleShare = () => {
    alert('Share functionality will be implemented with actual sharing options');
  };

  const handleDownloadTranscript = () => {
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${topic}-transcript.txt`;
    a.click();
  };

  // Generate detailed notes based on topic
  const generateNotes = () => {
    return {
      introduction: `This comprehensive ${Math.floor(videoDuration / 60)}-minute video provides an in-depth exploration of ${topic}, focusing specifically on ${type}.`,
      keyPoints: [
        `Understanding the fundamental principles of ${topic}`,
        `Exploring the theoretical framework and core concepts`,
        `Examining real-world applications and practical examples`,
        `Analyzing case studies and implementation strategies`,
        `Discussing common challenges and solutions`,
        `Reviewing best practices and expert recommendations`,
      ],
      detailedBreakdown: [
        {
          section: 'Introduction (0:00 - 1:00)',
          content: `Overview of ${topic} and what will be covered in this comprehensive lesson.`,
        },
        {
          section: 'Definition & Core Concepts (1:00 - 3:00)',
          content: `Detailed explanation of what ${topic} means, its origins, and fundamental principles.`,
        },
        {
          section: 'Key Fundamentals (3:00 - 6:00)',
          content: `Deep dive into the essential concepts, theories, and frameworks that underpin ${topic}.`,
        },
        {
          section: 'Visual Explanation (6:00 - 9:00)',
          content: `Treemap visualization and graphical representations to illustrate complex relationships.`,
        },
        {
          section: 'Detailed Analysis (9:00 - 12:00)',
          content: `Component-by-component breakdown with examples and detailed explanations.`,
        },
        {
          section: 'Real-World Applications (12:00 - 14:00)',
          content: `Practical applications of ${topic} in industry, research, and everyday scenarios.`,
        },
        {
          section: 'Examples & Case Studies (14:00 - 16:00)',
          content: `Concrete examples demonstrating how ${topic} is applied in various contexts.`,
        },
        {
          section: `Summary & Conclusion (16:00 - ${Math.floor(videoDuration / 60)}:${(videoDuration % 60).toString().padStart(2, '0')})`,
          content: `Recap of key takeaways, important points to remember, and next steps for further learning.`,
        },
      ],
      summary: `This video provides a complete understanding of ${topic} in ${language}, covering everything from basic definitions to advanced applications. The content is structured to ensure progressive learning, with visual aids, practical examples, and comprehensive explanations throughout.`,
    };
  };

  const notes = generateNotes();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
    >
      <div className="text-center mb-6">
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 15,
            delay: 0.2
          }}
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl mb-4"
        >
          <Play className="w-8 h-8 text-white" />
        </motion.div>
        <motion.h3 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-900 dark:text-white mb-2"
        >
          ✨ Your Video is Ready!
        </motion.h3>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 dark:text-gray-400"
        >
          {topic} - {type} in {language}
        </motion.p>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-gray-500 dark:text-gray-500 mt-1"
        >
          Duration: {Math.floor(videoDuration / 60)}:{(videoDuration % 60).toString().padStart(2, '0')} minutes
        </motion.p>
      </div>

      {/* Video Player */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-6"
      >
        <VideoPlayer
          topic={topic}
          type={type}
          language={language}
          thumbnail={thumbnail}
          duration={videoDuration}
        />
      </motion.div>

      {/* Video Features */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
      >
        {[
          { emoji: '✨', label: 'Animations', color: 'blue' },
          { emoji: '🗺️', label: 'Treemap', color: 'purple' },
          { emoji: '🎙️', label: 'Voiceover', color: 'green' },
          { emoji: '📄', label: 'Subtitles', color: 'orange' },
        ].map((feature, index) => (
          <motion.div
            key={feature.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            className={`bg-${feature.color}-50 dark:bg-${feature.color}-900/20 rounded-lg p-3 text-center border border-${feature.color}-100 dark:border-${feature.color}-900/50`}
          >
            <p className="text-2xl mb-1">{feature.emoji}</p>
            <p className="text-xs text-gray-700 dark:text-gray-300">{feature.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Detailed Notes */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-5 mb-6 border border-blue-100 dark:border-blue-900/50"
      >
        <button
          onClick={() => setShowNotes(!showNotes)}
          className="w-full flex items-center justify-between mb-3"
        >
          <h4 className="text-gray-900 dark:text-white">📚 Detailed Learning Notes</h4>
          {showNotes ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        
        {showNotes && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{notes.introduction}</p>
            </div>

            <div>
              <h5 className="text-gray-900 dark:text-white text-sm mb-2">Key Learning Points:</h5>
              <ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
                {notes.keyPoints.map((point, index) => (
                  <li key={index}>• {point}</li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="text-gray-900 dark:text-white text-sm mb-2">Video Structure & Timeline:</h5>
              <div className="space-y-2">
                {notes.detailedBreakdown.map((item, index) => (
                  <div key={index} className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                    <p className="text-sm text-blue-700 dark:text-blue-400 mb-1">{item.section}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{item.content}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-blue-200 dark:border-blue-800">
              <h5 className="text-gray-900 dark:text-white text-sm mb-2">Summary:</h5>
              <p className="text-sm text-gray-700 dark:text-gray-300">{notes.summary}</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDownload}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
        >
          <Download className="w-5 h-5" />
          Download Video (MP4)
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleShare}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg"
        >
          <Share2 className="w-5 h-5" />
          Share Video
        </motion.button>
      </motion.div>

      {/* Transcript Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6"
      >
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="flex items-center gap-2"
          >
            <h4 className="text-gray-900 dark:text-white">📝 Full Transcript</h4>
            {showTranscript ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={handleDownloadTranscript}
            className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
          >
            <FileText className="w-4 h-4" />
            Download
          </button>
        </div>
        {showTranscript && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{transcript}</p>
          </div>
        )}
      </motion.div>

      {/* Start New */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onStartNew}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
      >
        <RotateCcw className="w-5 h-5" />
        Learn Another Topic
      </motion.button>
    </motion.div>
  );
}