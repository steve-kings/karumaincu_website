import BlogClient from './BlogClient'

const baseUrl = 'https://karumaincu.org'

// Fetch blog data for metadata
async function getBlog(id) {
  try {
    const response = await fetch(`${baseUrl}/api/blogs/${id}`, {
      cache: 'no-store'
    })
    if (response.ok) {
      const data = await response.json()
      return data.success ? data.data : null
    }
  } catch (error) {
    console.error('Error fetching blog for metadata:', error)
  }
  return null
}

// Generate dynamic metadata for Open Graph
export async function generateMetadata({ params }) {
  const blog = await getBlog(params.id)
  
  if (!blog) {
    return {
      title: 'Blog Not Found | Karumaincu',
      description: 'The requested blog post could not be found.',
    }
  }

  const description = blog.excerpt || blog.content?.substring(0, 160) || 'Read this blog post on Karumaincu'
  const image = blog.featured_image || `${baseUrl}/logo.png`

  return {
    title: `${blog.title} | Karumaincu Blog`,
    description: description,
    authors: [{ name: blog.author_name }],
    openGraph: {
      title: blog.title,
      description: description,
      url: `${baseUrl}/blog/${params.id}`,
      siteName: 'Karumaincu',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
      publishedTime: blog.created_at,
      modifiedTime: blog.updated_at || blog.created_at,
      authors: [blog.author_name],
      tags: blog.tags || [],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: description,
      images: [image],
    },
  }
}

export default async function BlogPage({ params }) {
  const blog = await getBlog(params.id)
  
  return <BlogClient id={params.id} initialBlog={blog} />
}
