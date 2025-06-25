'use client';
import React from 'react';
import { sampleBlogs } from '@/app/blogs/constant';
import Navbar from '@/components/Navbar';

const BlogDetailPage = ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const blog = sampleBlogs.find(blog => blog.slug === slug);

  if (!blog) return <div>Blog not found</div>;

  return (
    <>
    <Navbar/>
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb',}} className='sm:mt-20'>
      {/* Header Image */}
      <div style={{ position: 'relative', height: '400px', overflow: 'hidden' }}>
        <img
          src={blog.imageUrl}
          alt={blog.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.3))'
        }}></div>
        
        {/* Content Overlay */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '2rem',
          color: 'white'
        }}>
          <div style={{ maxWidth: '64rem', margin: '0 auto' , display:'flex', flexDirection:'column', alignItems:'center'}}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
              {blog.categories.map((category, idx) => (
                <span key={idx} style={{
                  backgroundColor: '#c5a1a3',
                  color: 'white',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  {category}
                </span>
              ))}
            </div>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1rem', lineHeight: '1.1' }} >
              {blog.title}
            </h1>
            <p style={{ fontSize: '0.8rem', color: '#e5e7eb', marginBottom: '1.5rem' }}>
              {blog.shortDescription}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.875rem' }}>
              {/* Author/Date Info */}
            </div>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '3rem 1rem' }}>
        <a 
          href="/blogs"
          style={{
            display: 'inline-block',
            marginBottom: '2rem',
            color: '#2563eb',
            textDecoration: 'none',
            fontWeight: 500
          }}
        >
          ← Back to Blogs
        </a>

        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '2rem' }}>
          {blog.description.map((section, idx) => (
            <div key={idx} style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
                {section.heading}
              </h2>
              <p style={{ color: '#374151', lineHeight: '1.75', fontSize: '1.125rem' }}>
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default BlogDetailPage;