import { useContext, useEffect, useState } from "react"; 
import { AuthContext } from "../components/AuthContext";
import Auth from "../components/auth";
import { token_is_valid } from "../utils";
import PrivacyPolicy from "../components/privacy_policy"; 
import AcceptPolicy from "../components/accept_policy";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { shibboleth_enabled } from "../api";

const logo_neolaia = `${import.meta.env.BASE_URL}logoNEOLAiA.png`;
const eu_logo = `${import.meta.env.BASE_URL}eu_logo.png`;
const logo_neolink = `${import.meta.env.BASE_URL}logo.png`;
const SHIBBOLETH_ENABLED = shibboleth_enabled;

function Login(){
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { token, setToken, loading } = authContext;
    const [token_validity, setTokenValidity] = useState(false);
    const [shibbolethLoading, setShibbolethLoading] = useState(false);
    
    // Get the redirect path from location state, default to personal page
    const from = location.state?.from || "/personal-page";

    // Handle token from Shibboleth callback
    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            // Store the token from Shibboleth authentication
            localStorage.setItem("token", tokenFromUrl);
            setToken(tokenFromUrl);
            // Clean the URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, [searchParams, setToken]);
    
    useEffect(() => {
        if (loading){
            return;
        }
        const isValid = token_is_valid();
        setTokenValidity(isValid);
        
        if(token && isValid){
            // Navigate to the intended destination (either the original page or personal page)
            navigate(from, { state: { token } });
        }
    }, [loading, token, navigate, from]);

    // Handle Shibboleth login
    const handleShibbolethLogin = () => {
        setShibbolethLoading(true);
        // Redirect to Shibboleth login
        // The SP will authenticate and redirect back to /api/auth/shibboleth
        window.location.href = '/Shibboleth.sso/Login?target=/api/auth/shibboleth';
    };
    
    useEffect(() => {
        if (loading){
            return;
        }
        const isValid = token_is_valid();
        setTokenValidity(isValid);
        
        if(token && isValid){
            // Navigate to the intended destination (either the original page or personal page)
            navigate(from, { state: { token } });
        }
    }, [loading, token, navigate, from]);
    
    return(
        <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            flexDirection: 'column',
            width: '100vw',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: '#fafafa'
        }}>
            {/* Header Section */}
            <div className="py-3 py-md-4 border-bottom bg-white" style={{ width: '100%', flexShrink: 0 }}>
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center px-3 px-md-5 gap-3">
                    <div className="d-flex align-items-center gap-2 gap-md-3">
                        <img 
                            src={logo_neolaia} 
                            alt='Logo NEOLAiA' 
                            className="img-fluid" 
                            style={{ maxHeight: '50px', height: 'auto' }}
                        />
                    </div>
                    <img 
                        src={eu_logo} 
                        alt='Logo EU' 
                        className="img-fluid" 
                        style={{ maxHeight: '45px', height: 'auto' }}
                    />
                </div>
            </div>

            {/* Main Content */}
            <div style={{ 
                flex: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: '2rem 1rem'
            }}>
                {loading ? (
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3">Caricamento...</p>
                    </div>
                ) : (
                    <div style={{ 
                        maxWidth: '600px', 
                        width: '100%',
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        padding: '2rem'
                    }}>
                        <div className="text-center mb-4">
                            <img 
                                src={logo_neolink} 
                                alt='Logo NEOLink' 
                                className="img-fluid mb-3" 
                                style={{ maxWidth: '250px' }}
                            />
                            <h2 className="h4 fw-bold mb-2" style={{ color: '#213547' }}>
                                Welcome
                            </h2>
                            <p className="text-muted">
                                Sign in to access your NEOLink account
                            </p>
                        </div>
                        
                        {SHIBBOLETH_ENABLED ? (
                            /* Shibboleth/eduGAIN Login */
                            <div>
                                <button
                                    onClick={handleShibbolethLogin}
                                    disabled={shibbolethLoading}
                                    style={{
                                        width: '100%',
                                        padding: '1rem 1.5rem',
                                        backgroundColor: '#7c6fd6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        cursor: shibbolethLoading ? 'not-allowed' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.75rem',
                                        transition: 'background-color 0.2s',
                                        opacity: shibbolethLoading ? 0.7 : 1
                                    }}
                                    onMouseOver={(e) => !shibbolethLoading && (e.target.style.backgroundColor = '#6b5fc5')}
                                    onMouseOut={(e) => e.target.style.backgroundColor = '#7c6fd6'}
                                >
                                    {shibbolethLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            Redirecting to your institution...
                                        </>
                                    ) : (
                                        <>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                                                <path d="M2 17l10 5 10-5"/>
                                                <path d="M2 12l10 5 10-5"/>
                                            </svg>
                                            Login with your Institution (eduGAIN)
                                        </>
                                    )}
                                </button>
                                
                                <div style={{
                                    marginTop: '1.5rem',
                                    padding: '1rem',
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '8px',
                                    fontSize: '0.9rem',
                                    color: '#6c757d'
                                }}>
                                    <p style={{ margin: '0 0 0.5rem 0' }}>
                                        <strong>How it works:</strong>
                                    </p>
                                    <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                                        <li>Click the button above</li>
                                        <li>Select your university from the list</li>
                                        <li>Login with your institutional credentials</li>
                                        <li>You'll be redirected back to NEOLink</li>
                                    </ul>
                                </div>

                                <p style={{
                                    marginTop: '1.5rem',
                                    textAlign: 'center',
                                    fontSize: '0.85rem',
                                    color: '#6c757d'
                                }}>
                                    By signing in, you agree to our{' '}
                                    <a href="/privacy_policy" style={{ color: '#7c6fd6' }}>
                                        Privacy Policy
                                    </a>
                                </p>
                            </div>
                        ) : (
                            /* Legacy OTP Login */
                            <Auth 
                                accept_policy_message={<AcceptPolicy />} 
                                privacy_policy={<PrivacyPolicy />} 
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Login;