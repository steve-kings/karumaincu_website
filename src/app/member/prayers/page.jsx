'use client';

import { useState, useEffect } from 'react';
import MemberLayout from '@/components/MemberLayout';

export default function MemberPrayersPage() {
  const [prayers, setPrayers] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, answered: 0, archived: 0 });
  const [filter, setFilter] = useState('active');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'personal',
    priority: 'medium',
    is_private: true
  });

  const categories = [
    { value: 'personal', label: 'Personal', icon: '🙏' },
    { value: 'health', label: 'Health', icon: '❤️' },
    { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
    { value: 'work', label: 'Work/Studies', icon: '📚' },
    { value: 'spiritual', label: 'Spiritual Growth', icon: '✨' },
    { value: 'financial', label: 'Financial', icon: '💰' },
    { value: 'relationships', label: 'Relationships', icon: '💑' },
    { value: 'other', label: 'Other', icon: '📝' }
  ];

  useEffect(() => {
    fetchPrayers();
    fetchStats();
  }, [filter]);

  const fetchPrayers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const url = filter === 'all' 
        ? '/api/member/prayers'