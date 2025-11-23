'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import MemberLayout from '@/components/MemberLayout'
import BlogComments from '@/components/BlogComments'

export default function BlogDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBlog()
  }, [params.id])

  const fetchBlog = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/blogs/${params.id}`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setBlog(data.data)
      } else if (response.status === 404) {
        alert('Blog not found')
        router.push('/member/blogs')
      }
    } catch (error) {
      console.error('Error fetching blog:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <MemberLayout>
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <i className="fas fa-spinner fa-spin text-5xl text-emerald-600 dark:text-emerald-400 mb-4"></i>
          <p className="text-gray-600 dark:text-neutral-400">Loading blog...</p>
        </div>
      </MemberLayout>
    )
  }

  if (!blog) {
    return (
      <MemberLayout>
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <i className="fas fa-exclamation-circle text-5xl text-red-600 dark:text-red-400 mb-4"></i>
          <p className="text-gray-600 dark:text-neutral-400">Blog not found</p>
        </div>
      </MemberLayout>
    )
  }

  return (
    <MemberLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Back to Blogs
        </button>

        {/* Blog Content */}
        <article className="bg-white dark:bg-neutral-950 rounded-2xl shadow-lg border border-gray-100 dark:border-neutral-900 overflow-hidden">
          {/* Featured Image */}
          {blog.featured_image && (
            <div className="w-full h-96 overflow-hidden">
              <img
                src={blog.featured_image}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            {/* Category & Status */}
            <div className="flex items-center gap-3 mb-4">
              {blog.category && (
                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium">
                  {blog.category}
                </span>
              )}
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                blog.status === 'approved' 
                  ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300'
                  : blog.status === 'pending'
                  ? 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300'
                  : blog.status === 'rejected'
                  ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                  : 'bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-neutral-300'
              }`}>
                {blog.status}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-heading font-bold text-black dark:text-white mb-4">
              {blog.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-neutral-400 mb-6 pb-6 border-b border-gray-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                {blog.author_image ? (
                  <img
                    src={blog.author_image}
                    alt={blog.author_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                    <i className="fas fa-user text-emerald-600 dark:text-emerald-400"></i>
                  </div>
                )}
                <span className="font-medium text-black dark:text-white">{blog.author_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-calendar"></i>
                <span>
                  {new Date(blog.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
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
              <div className="flex flex-wrap gap-2 mb-6">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Rejection Reason */}
            {blog.status === 'rejected' && blog.rejection_reason && (
              <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm font-semibold text-red-700 dark:text-red-300 mb-1">
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  Rejection Reason:
                </p>
                <p className="text-sm text-red-600 dark:text-red-400">
                  {blog.rejection_reason}
                </p>
              </div>
            )}
          </div>
        </article>

        {/* Comments Section - Only show for approved blogs */}
        {blog.status === 'approved' && (
          <BlogComments blogId={params.id} />
        )}
      </div>
    </MemberLayout>
  )
}
