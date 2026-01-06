import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Heart, Share2, Download, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CommunityTemplate {
  id: string;
  title: string;
  description: string;
  context: 'nest' | 'grind' | 'self';
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedMinutes: number;
  subtasks: string[];
  author: string;
  likes: number;
  downloads: number;
  createdAt: string;
  tags: string[];
}

// Sample community templates
const COMMUNITY_TEMPLATES: CommunityTemplate[] = [
  {
    id: 'ct-1',
    title: 'Deep Clean Kitchen',
    description: 'Thorough kitchen cleaning from top to bottom',
    context: 'nest',
    category: 'Clean',
    difficulty: 'hard',
    estimatedMinutes: 30,
    subtasks: ['Clear counters', 'Clean appliances', 'Scrub sink', 'Mop floor', 'Organize pantry'],
    author: 'CleanQueen92',
    likes: 342,
    downloads: 1205,
    createdAt: '2025-12-15',
    tags: ['kitchen', 'deep-clean', 'thorough']
  },
  {
    id: 'ct-2',
    title: 'Email Blitz',
    description: 'Power through your inbox in 15 minutes',
    context: 'grind',
    category: 'Email',
    difficulty: 'medium',
    estimatedMinutes: 15,
    subtasks: ['Sort by priority', 'Reply to urgent', 'Archive read', 'Flag follow-ups', 'Clean spam'],
    author: 'ProductivityPro',
    likes: 567,
    downloads: 2341,
    createdAt: '2025-12-10',
    tags: ['email', 'productivity', 'quick']
  },
  {
    id: 'ct-3',
    title: 'Morning Energy Boost',
    description: 'Quick morning routine to energize your day',
    context: 'self',
    category: 'Morning',
    difficulty: 'easy',
    estimatedMinutes: 10,
    subtasks: ['Drink water', 'Stretch', 'Cold shower', 'Eat breakfast', 'Set intentions'],
    author: 'HealthyHabits',
    likes: 823,
    downloads: 3456,
    createdAt: '2025-12-08',
    tags: ['morning', 'energy', 'routine']
  },
  {
    id: 'ct-4',
    title: 'Bedroom Reset',
    description: 'Make your bedroom a sanctuary in 20 minutes',
    context: 'nest',
    category: 'Organize',
    difficulty: 'medium',
    estimatedMinutes: 20,
    subtasks: ['Make bed', 'Pick up floor', 'Organize dresser', 'Open window', 'Light candle'],
    author: 'CozyHome',
    likes: 456,
    downloads: 1678,
    createdAt: '2025-12-05',
    tags: ['bedroom', 'organize', 'cozy']
  },
  {
    id: 'ct-5',
    title: 'Focus Session Prep',
    description: 'Prepare your workspace for deep work',
    context: 'grind',
    category: 'Admin',
    difficulty: 'easy',
    estimatedMinutes: 8,
    subtasks: ['Clear desk', 'Close tabs', 'Silence phone', 'Set timer', 'Grab water'],
    author: 'DeepWorkDude',
    likes: 234,
    downloads: 892,
    createdAt: '2025-12-01',
    tags: ['focus', 'productivity', 'workspace']
  }
];

interface TaskTemplateLibraryProps {
  onSelectTemplate?: (template: CommunityTemplate) => void;
}

export default function TaskTemplateLibrary({ onSelectTemplate }: TaskTemplateLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContext, setSelectedContext] = useState<'nest' | 'grind' | 'self' | 'all'>('all');
  const [likedTemplates, setLikedTemplates] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredTemplates = COMMUNITY_TEMPLATES.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesContext = selectedContext === 'all' || template.context === selectedContext;
    return matchesSearch && matchesContext;
  });

  const toggleLike = (templateId: string) => {
    const newLiked = new Set(likedTemplates);
    if (newLiked.has(templateId)) {
      newLiked.delete(templateId);
    } else {
      newLiked.add(templateId);
    }
    setLikedTemplates(newLiked);
  };

  const contextIcons = {
    nest: '🏠',
    grind: '💼',
    self: '🧘'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Task Template Library</h2>
        <p className="text-gray-600">Discover templates created by the community. Download, customize, and share!</p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {(['all', 'nest', 'grind', 'self'] as const).map((context) => (
            <Button
              key={context}
              onClick={() => setSelectedContext(context)}
              variant={selectedContext === context ? 'default' : 'outline'}
              size="sm"
            >
              {context === 'all' ? '📋 All' : `${contextIcons[context]} ${context.charAt(0).toUpperCase() + context.slice(1)}`}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-600">
        Showing {filteredTemplates.length} of {COMMUNITY_TEMPLATES.length} templates
      </p>

      {/* Templates Grid */}
      <AnimatePresence mode="wait">
        {filteredTemplates.length > 0 ? (
          <motion.div
            key="templates"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-2 border-gray-200 rounded-lg p-4 hover:border-primary hover:shadow-lg transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{contextIcons[template.context]}</span>
                      <h3 className="font-bold text-sm">{template.title}</h3>
                    </div>
                    <p className="text-xs text-gray-600">{template.description}</p>
                  </div>
                  <motion.button
                    onClick={() => toggleLike(template.id)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        likedTemplates.has(template.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-400'
                      }`}
                    />
                  </motion.button>
                </div>

                {/* Meta Info */}
                <div className="flex gap-3 mb-3 text-xs text-gray-600">
                  <span>⏱️ {template.estimatedMinutes}m</span>
                  <span>📊 {template.difficulty}</span>
                  <span>👤 {template.author}</span>
                </div>

                {/* Subtasks Preview */}
                <div className="mb-3 bg-gray-50 rounded p-2">
                  <p className="text-xs font-semibold text-gray-700 mb-1">Steps:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {template.subtasks.slice(0, 3).map((subtask, i) => (
                      <li key={i}>✓ {subtask}</li>
                    ))}
                    {template.subtasks.length > 3 && (
                      <li className="text-gray-500">+{template.subtasks.length - 3} more</li>
                    )}
                  </ul>
                </div>

                {/* Stats */}
                <div className="flex gap-4 mb-3 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {template.likes}
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    {template.downloads}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex gap-1 flex-wrap mb-3">
                  {template.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => onSelectTemplate?.(template)}
                    size="sm"
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Use Template
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <p className="text-gray-600 mb-4">No templates found matching your search.</p>
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Create Your Own
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <motion.div
        className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="font-bold mb-2">Share Your Templates</h3>
        <p className="text-sm text-gray-600 mb-4">
          Created a template that works great for you? Share it with the community and help others!
        </p>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Submit Template
        </Button>
      </motion.div>
    </div>
  );
}
