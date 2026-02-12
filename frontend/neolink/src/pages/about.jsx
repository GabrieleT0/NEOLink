import React from 'react';

const About = () => {
    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#fafafa',
            padding: '2rem 1rem 4rem'
        }}>
            <div style={{
                maxWidth: '900px',
                margin: '0 auto'
            }}>
                {/* Header */}
                <header style={{
                    textAlign: 'center',
                    marginBottom: '2rem',
                    paddingBottom: '2rem',
                    borderBottom: '2px solid #e9ecef'
                }}>
                    <span style={{
                        display: 'inline-block',
                        backgroundColor: '#f0f0ff',
                        color: '#7c6fd6',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        marginBottom: '1rem'
                    }}>
                        NEOLink - NEOLAiA
                    </span>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        color: '#213547',
                        margin: '0 0 0.5rem 0'
                    }}>
                        About NEOLink
                    </h1>
                    <p style={{
                        color: '#6c757d',
                        fontSize: '0.95rem',
                        margin: '0'
                    }}>
                        Learn more about our service
                    </p>
                </header>

                {/* PDF Viewer */}
                <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    padding: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1rem'
                    }}>
                        <h2 style={{
                            fontSize: '1.25rem',
                            fontWeight: '600',
                            color: '#213547',
                            margin: 0
                        }}>
                            Service Information
                        </h2>
                        <a
                            href="/about.pdf"
                            download
                            style={{
                                backgroundColor: '#7c6fd6',
                                color: '#ffffff',
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                textDecoration: 'none',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            Download PDF
                        </a>
                    </div>
                    
                    <iframe
                        src="/about.pdf"
                        title="About NEOLink"
                        style={{
                            width: '100%',
                            height: '70vh',
                            border: 'none',
                            borderRadius: '8px'
                        }}
                    />
                </div>

                {/* Back Link */}
                <div style={{ textAlign: 'center' }}>
                    <a
                        href="/"
                        style={{
                            color: '#7c6fd6',
                            textDecoration: 'none',
                            fontSize: '0.95rem',
                            fontWeight: '500'
                        }}
                    >
                        ← Back to Home
                    </a>
                </div>
            </div>
        </div>
    );
};

export default About;
