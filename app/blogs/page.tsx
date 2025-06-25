'use client';
import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, User, ArrowRight, Clock, Tag, ChevronDown } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { sampleBlogs, categories } from './constant';
import Link from 'next/link';

const BlogPlatform = () => {
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        setTimeout(() => {
            setBlogs(sampleBlogs);
            setFilteredBlogs(sampleBlogs);
            setIsLoading(false);
        }, 1000);
    }, []);

    useEffect(() => {
        let filtered = blogs;

        if (searchTerm) {
            filtered = filtered.filter(blog =>
                blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                blog.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                blog.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(blog =>
                blog.categories.includes(selectedCategory)
            );
        }

        setFilteredBlogs(filtered);
    }, [searchTerm, selectedCategory, blogs]);

    return (
        <>
            <Navbar />
            <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #a87b7e 0%, #c5a1a3 30%, #d8b8ba 70%, #e8d1d2 100%)',
                    color: 'white',
                    padding: '4rem 1rem'
                }}>
                    <div style={{ maxWidth: '80rem', margin: '0 auto', textAlign: 'center' }}>
                        <h1 style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                            InstantJob Blog
                        </h1>
                        <p style={{ fontSize: '1.5rem', marginBottom: '2rem', opacity: '0.9' }}>
                            Insights, Tips, and Stories to Accelerate Your Career
                        </p>
                        <div style={{ maxWidth: '32rem', margin: '0 auto', position: 'relative' }}>
                            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} size={20} />
                            <input
                                type="text"
                                placeholder="Search articles, tips, career advice..."
                                style={{
                                    width: '100%',
                                    paddingLeft: '3rem',
                                    paddingRight: '1rem',
                                    paddingTop: '1rem',
                                    paddingBottom: '1rem',
                                    fontSize: '1rem',
                                    border: 'none',
                                    borderRadius: '9999px',
                                    outline: 'none',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Filter Section */}
                <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem' }}>
                    <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            borderRadius: '9999px',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '0.875rem',
                                            fontWeight: '500',
                                            transition: 'all 0.2s',
                                            backgroundColor: selectedCategory === category ? '#c5a1a3' : '#f3f4f6',
                                            color: selectedCategory === category ? 'white' : '#374151'
                                        }}
                                    >
                                        {category === 'all' ? 'All Categories' : category}
                                    </button>
                                ))}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280' }}>
                                <Tag size={16} />
                                <span>{filteredBlogs.length} articles found</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Blog Grid */}
                <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '3rem 1rem' }}>
                    {isLoading ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                            {[...Array(6)].map((_, idx) => (
                                <div key={idx} style={{ backgroundColor: 'white', borderRadius: '0.75rem', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                                    <div style={{ height: '12rem', backgroundColor: '#e5e7eb' }}></div>
                                    <div style={{ padding: '1.5rem' }}>
                                        <div style={{ height: '1rem', backgroundColor: '#e5e7eb', borderRadius: '0.25rem', marginBottom: '1rem' }}></div>
                                        <div style={{ height: '1.5rem', backgroundColor: '#e5e7eb', borderRadius: '0.25rem', marginBottom: '0.75rem' }}></div>
                                        <div style={{ height: '1rem', backgroundColor: '#e5e7eb', borderRadius: '0.25rem', marginBottom: '0.5rem' }}></div>
                                        <div style={{ height: '1rem', backgroundColor: '#e5e7eb', borderRadius: '0.25rem', width: '75%' }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredBlogs.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                            <div style={{ maxWidth: '28rem', margin: '0 auto', backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                                <Search size={64} style={{ color: '#d1d5db', margin: '0 auto 1rem' }} />
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>No articles found</h3>
                                <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                                    Try adjusting your search terms or filter criteria to find what you're looking for.
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedCategory('all');
                                    }}
                                    style={{
                                        backgroundColor: '#2563eb',
                                        color: 'white',
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '0.5rem',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontWeight: '500',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                            {filteredBlogs.map((blog, index) => (
                                <Link
                                    href={`/blogs/${blog.slug}`}
                                    key={blog.id}
                                    passHref
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    <div
                                        style={{
                                            backgroundColor: 'white',
                                            borderRadius: '0.75rem',
                                            overflow: 'hidden',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            ':hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                                            }
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-4px)';
                                            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                                        }}
                                    >
                                        <div style={{ position: 'relative', overflow: 'hidden' }}>
                                            <img
                                                src={blog.imageUrl}
                                                alt={blog.title}
                                                style={{ width: '100%', height: '12rem', objectFit: 'cover' }}
                                            />
                                            <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
                                                <span style={{
                                                    backgroundColor: '#c5a1a3',
                                                    color: 'white',
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '9999px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '500'
                                                }}>
                                                    {blog.categories[0]}
                                                </span>
                                            </div>
                                        </div>

                                        <div style={{ padding: '1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#6b7280', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <User size={12} />
                                                    <span>{blog.author}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <Calendar size={12} />
                                                    <span>{new Date(blog.publishDate).toLocaleDateString()}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <Clock size={12} />
                                                    <span>{blog.readTime}</span>
                                                </div>
                                            </div>

                                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                                                {blog.title}
                                            </h3>

                                            <p style={{ color: '#6b7280', marginBottom: '1rem', fontSize: '0.875rem', lineHeight: '1.5' }}>
                                                {blog.shortDescription.length > 120 ? blog.shortDescription.substring(0, 120) + '...' : blog.shortDescription}
                                            </p>

                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                                                {blog.categories.slice(1).map((category, idx) => (
                                                    <span key={idx} style={{
                                                        backgroundColor: '#f3f4f6',
                                                        color: '#374151',
                                                        padding: '0.25rem 0.5rem',
                                                        borderRadius: '0.375rem',
                                                        fontSize: '0.75rem'
                                                    }}>
                                                        {category}
                                                    </span>
                                                ))}
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <span style={{ color: '#c5a1a3', fontWeight: '600', fontSize: '0.875rem' }}>
                                                    Read More
                                                </span>
                                                <ArrowRight size={16} style={{ color: '#c5a1a3' }} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default BlogPlatform;