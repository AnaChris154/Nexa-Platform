'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface TutorFeedbackProps {
  feedback: string | null;
  loading: boolean;
}

/**
 * Personagem NEX — aparece quando o aluno erra uma questão.
 * Exibe feedback pedagógico gerado pela IA.
 */
export function TutorFeedback({ feedback, loading }: TutorFeedbackProps) {
  const visivel = loading || !!feedback;

  return (
    <AnimatePresence>
      {visivel && (
        <motion.div
          key="tutor"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="flex items-start gap-3 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-4"
        >
          {/* Avatar do personagem */}
          <div className="flex-shrink-0 size-10 rounded-full bg-violet-500 flex items-center justify-center shadow-sm">
            <Sparkles className="size-5 text-white" />
          </div>

          {/* Balão de fala */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-violet-600 uppercase tracking-wide">
              NEX
            </span>

            {loading ? (
              <div className="flex items-center gap-1.5 h-5">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="block size-2 rounded-full bg-violet-400"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.2,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-700 leading-relaxed">{feedback}</p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
