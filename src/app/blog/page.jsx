'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPost, setSelectedPost] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/blogs?status=approved&limit=50')
      const data = await response.json()
      
      if (data.success) {
        setBlogPosts(data.data || [])
      } else {
        setError('Failed to load blogs')
      }
    } catch (err) {
      console.error('Error fetching blogs:', err)
      setError('Failed to load blog posts')
    } finally {
      setLoading(false)
    }
  }

  const getFeaturedImage = (blog) => {
    if (blog.featured_image) {
      // If it's already a full path starting with /uploads, use it directly
      if (blog.featured_image.startsWith('/uploads')) {
        return blog.featured_image
      }
      // Otherwise, construct the path
      return `/uploads/blogs/${blog.featured_image}`
    }
    return 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop'
  }

  const getAuthorImage = (authorName) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName || 'Anonymous')}&background=purple&color=fff&size=400`
  }

  const filteredPosts = selectedCategory === 'all'
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory)

  const featuredPost = blogPosts[0]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-purple-800 via-teal-700 to-emerald-700 text-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-heading font-bold text-5xl md:text-6xl mb-6">
              Blog & Testimonies
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Stories of faith, growth, and God's faithfulness
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <p className="mt-4 text-gray-600">Loading blog posts...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">
                <i className="fas fa-exclamation-triangle text-4xl"></i>
              </div>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <i className="fas fa-blog text-4xl"></i>
              </div>
              <p className="text-gray-600">No blog posts available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.article 
                  key={post.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  onClick={() => setSelectedPost(post)}
                >
                  <div className="relative">
                    <img 
                      src={getFeaturedImage(post)} 
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold capitalize">
                      {post.category || 'Blog'}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-heading font-bold text-xl text-gray-800 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-700 leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt || post.content?.substring(0, 150) + '...'}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">{post.author_name || 'Anonymous'}</span>
                      <span className="text-gray-500 text-sm">{post.view_count || 0} views</span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Blog Post Modal */}
      {selectedPost && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPost(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img 
                src={getFeaturedImage(selectedPost)} 
                alt={selectedPost.title}
                className="w-full h-64 object-cover rounded-t-2xl"
              />
              <button 
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="p-8">
              <h1 className="font-heading font-bold text-3xl text-gray-800 mb-6">
                {selectedPost.title}
              </h1>
              
              <div className="flex items-center mb-8">
                <img 
                  src={getAuthorImage(selectedPost.author_name)} 
                  alt={selectedPost.author_name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <p className="font-semibold text-gray-800 text-lg">{selectedPost.author_name || 'Anonymous'}</p>
                  <p className="text-gray-600">{new Date(selectedPost.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div 
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: selectedPost.content }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
