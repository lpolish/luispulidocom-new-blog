'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface Skill {
  name: string;
  description: string;
}

const skills: Skill[] = [
  { name: 'Backend Development', description: 'Building scalable APIs and services' },
  { name: 'System Design', description: 'Architecting robust distributed systems' },
  { name: 'DevOps', description: 'Automating deployment and infrastructure' },
  { name: 'Technical Writing', description: 'Documenting complex technical concepts' }
];

export function Skills() {
  return (
    <section>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Technical Expertise</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-primary/50 backdrop-blur-sm rounded-xl p-6 border border-border"
            >
              <h3 className="text-lg font-bold mb-2">{skill.name}</h3>
              <p className="text-textMuted text-sm">{skill.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 