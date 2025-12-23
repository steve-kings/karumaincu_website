'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BlogComments from '@/components/BlogComments'

export default function BlogClient({ id, initialBlog }) {
  const router = useRouter()
  const [blog, setBlog] = useState(initialBlog)
  const [loading, setLoading] = useState(!initialBlog)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!initialBlog && id) {
      fetchBlog()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchBlog = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/blogs/${id}`)
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setBlog(data.data)
        }
      }
    } catch (error) {
      console.error('Error fetching blog:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-950">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <i className="fas fa-spinner fa-spin text-5xl text-emerald-600 dark:text-emerald-400 mb-4"></i>
          <p className="text-gray-600 dark:text-neutral-400">Loading blog...</p>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-950">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <i className="fas fa-exclamation-circle text-5xl text-red-600 dark:text-red-400 mb-4"></i>
          <p className="text-gray-600 dark:text-neutral-400">Blog not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950">
      {/* Header */}
      <header className="bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="KarUCU Logo" className="h-10 w-auto" />
              <span className="text-xl font-heading font-bold text-black dark:text-white">
                Karumaincu
              </span>
            </a>
            <a
              href="/blog"
              className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              All Blogs
            </a>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-800 overflow-hidden">
          {/* Featured Image */}
          {blog.featured_image && (
            <div className="w-full h-[400px] overflow-hidden">
              <img
                src={blog.featured_image}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-8 md:p-12">
            {/* Category */}
            {blog.category && (
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-semibold">
                  <i className="fas fa-tag mr-2"></i>
                  {blog.category}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-black dark:text-white mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Meta Info */}
            <div className="mb-8 pb-8 border-b border-gray-200 dark:border-neutral-800">
              {/* Author & Date */}
              <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-neutral-400 mb-6">
                <div className="flex items-center gap-3">
                  {blog.author_image ? (
                    <img
                      src={blog.author_image}
                      alt={blog.author_name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500 shadow-lg"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center border-2 border-emerald-500 shadow-lg">
                      <i className="fas fa-user text-white text-lg"></i>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-black dark:text-white text-lg">{blog.author_name}</p>
                    <p className="text-sm text-gray-500 dark:text-neutral-500">Author</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                  <i className="fas fa-calendar text-emerald-600 dark:text-emerald-400"></i>
                  <span className="text-sm font-medium">
                    {new Date(blog.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              {/* Share Section */}
              <div className="bg-gradient-to-r from-gray-50 to-emerald-50 dark:from-neutral-800 dark:to-emerald-950/30 rounded-xl p-6 border border-gray-200 dark:border-neutral-700">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-share-alt text-emerald-600 dark:text-emerald-400 text-xl"></i>
                    <span className="font-semibold text-gray-800 dark:text-neutral-200 text-lg">Share this post</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Copy Link */}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href)
                        setCopied(true)
                        setTimeout(() => setCopied(false), 2000)
                      }}
                      className="group relative px-5 py-2.5 bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800 transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg border border-gray-200 dark:border-neutral-700 hover:scale-105"
                      title="Copy link"
                    >
                      <i className={`fas ${copied ? 'fa-check text-green-600' : 'fa-link'} transition-all duration-300`}></i>
                      <span className="font-medium">{copied ? 'Copied!' : 'Copy'}</span>
                    </button>

                    {/* WhatsApp */}
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(blog.title + ' - ' + (typeof window !== 'undefined' ? window.location.href : ''))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-105"
                      title="Share on WhatsApp"
                    >
                      <i className="fab fa-whatsapp text-lg"></i>
                      <span className="font-medium hidden sm:inline">WhatsApp</span>
                    </a>

                    {/* Facebook */}
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-105"
                      title="Share on Facebook"
                    >
                      <i className="fab fa-facebook-f text-lg"></i>
                      <span className="font-medium hidden sm:inline">Facebook</span>
                    </a>

                    {/* Twitter */}
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative px-5 py-2.5 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-xl hover:from-sky-600 hover:to-sky-700 transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-105"
                      title="Share on Twitter"
                    >
                      <i className="fab fa-twitter text-lg"></i>
                      <span className="font-medium hidden sm:inline">Twitter</span>
                    </a>

                    {/* LinkedIn */}
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative px-5 py-2.5 bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-xl hover:from-blue-800 hover:to-blue-900 transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-105"
                      title="Share on LinkedIn"
                    >
                      <i className="fab fa-linkedin-in text-lg"></i>
                      <span className="font-medium hidden sm:inline">LinkedIn</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Excerpt */}
            {blog.excerpt && (
              <div className="mb-8 p-6 bg-emerald-50 dark:bg-emerald-950/20 border-l-4 border-emerald-500 rounded-lg">
                <p className="text-lg text-gray-700 dark:text-neutral-300 italic leading-relaxed">
                  {blog.excerpt}
                </p>
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none mb-10">
              <div
                className="text-gray-700 dark:text-neutral-300 text-lg leading-relaxed whitespace-pre-wrap"
                style={{ lineHeight: '1.8' }}
              >
                {blog.content}
              </div>
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-8 border-t border-gray-200 dark:border-neutral-800">
                <span className="text-gray-600 dark:text-neutral-400 font-medium mr-2">
                  <i className="fas fa-tags mr-2"></i>
                  Tags:
                </span>
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>

        {/* Comments Section */}
        <BlogComments blogId={id} />

        {/* Back to Blogs */}
        <div className="mt-12 text-center">
          <a
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            <i className="fas fa-arrow-left"></i>
            Back to All Blogs
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-gray-600 dark:text-neutral-400">
            © {new Date().getFullYear()} Karumaincu. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
