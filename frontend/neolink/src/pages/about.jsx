import React from 'react';

const About = () => {
    const sectionStyle = {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        padding: '1.5rem',
        marginBottom: '1.5rem'
    };

    const sectionTitleStyle = {
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#213547',
        margin: '0 0 1rem 0',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    };

    const paragraphStyle = {
        color: '#4a5568',
        fontSize: '0.95rem',
        lineHeight: '1.7',
        margin: '0',
        textAlign: 'left'
    };

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
                        Service Information
                    </p>
                </header>

                {/* Service Description */}
                <section style={sectionStyle}>
                    <h2 style={sectionTitleStyle}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c6fd6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="16" x2="12" y2="12"/>
                            <line x1="12" y1="8" x2="12.01" y2="8"/>
                        </svg>
                        Service Description
                    </h2>
                    <p style={paragraphStyle}>
                        NEOLink is a web application designed for the NEOLAiA European Universities Alliance that 
                        enables universities to share and discover educational resources, courses, and learning 
                        materials. The platform facilitates collaboration between institutions by providing a 
                        centralized marketplace for educational items with features like categorization by academic 
                        fields, university associations, and Discourse forum integration.
                    </p>
                </section>

                {/* Who the Service is For */}
                <section style={sectionStyle}>
                    <h2 style={sectionTitleStyle}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c6fd6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                        Who the Service is For
                    </h2>
                    <p style={paragraphStyle}>
                        The service is intended for researchers, university staff, and academics who are members of 
                        the nine universities of the European NEOLAiA alliance, with plans for future extension to 
                        other European alliances.
                    </p>
                </section>

                {/* Who Manages It */}
                <section style={sectionStyle}>
                    <h2 style={sectionTitleStyle}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c6fd6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                            <polyline points="9 22 9 12 15 12 15 22"/>
                        </svg>
                        Who Manages It
                    </h2>
                    <p style={paragraphStyle}>
                        The service is managed by the <strong>University of Salerno</strong> and in particular by the <strong>ISISLab</strong>.
                    </p>
                    <div style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        color: '#4a5568'
                    }}>
                        <p style={{ margin: '0 0 0.5rem 0' }}><strong>Università degli Studi di Salerno</strong></p>
                        <p style={{ margin: '0 0 0.25rem 0' }}>Via Giovanni Paolo II, 132 - 84084 Fisciano (SA)</p>
                        <p style={{ margin: '0 0 0.25rem 0' }}>P.IVA 00851300657 - C.F. 80018670655</p>
                        <p style={{ margin: '0' }}>
                            PEC: <a href="mailto:ammicent@pec.unisa.it" style={{ color: '#7c6fd6' }}>ammicent@pec.unisa.it</a>
                        </p>
                    </div>
                </section>

                {/* Support */}
                <section style={sectionStyle}>
                    <h2 style={sectionTitleStyle}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c6fd6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                            <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                        Support
                    </h2>
                    <p style={paragraphStyle}>
                        You can ask for support by sending an email to the following contact:
                    </p>
                    <div style={{
                        marginTop: '1rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        backgroundColor: '#f0f0ff',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px'
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c6fd6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                            <polyline points="22,6 12,13 2,6"/>
                        </svg>
                        <a 
                            href="mailto:virtualcafe-support-list@unisa.it" 
                            style={{ 
                                color: '#7c6fd6', 
                                fontWeight: '500',
                                textDecoration: 'none'
                            }}
                        >
                            virtualcafe-support-list@unisa.it
                        </a>
                    </div>
                </section>

                {/* Privacy Policy */}
                <section style={sectionStyle}>
                    <h2 style={sectionTitleStyle}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c6fd6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                        Information on the Processing of Personal Data
                    </h2>
                    <p style={paragraphStyle}>
                        All information regarding the processing of personal data and the privacy policy of the service 
                        can be found on our dedicated page:
                    </p>
                    <div style={{ marginTop: '1rem' }}>
                        <a 
                            href="/privacy_policy" 
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                backgroundColor: '#7c6fd6',
                                color: '#ffffff',
                                padding: '0.75rem 1.25rem',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                fontWeight: '500',
                                fontSize: '0.9rem'
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                <polyline points="15 3 21 3 21 9"/>
                                <line x1="10" y1="14" x2="21" y2="3"/>
                            </svg>
                            View Privacy Policy
                        </a>
                    </div>
                </section>

                {/* Back Link */}
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
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
