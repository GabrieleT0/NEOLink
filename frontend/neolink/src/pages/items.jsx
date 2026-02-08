import { useState, useEffect, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { base_url } from "../api";
import ItemCard from "../components/item_card";
import ItemsFilter from "../components/items_filter";
import Navbar from "../components/navbar";
import { AuthContext } from "../components/AuthContext.jsx";
import { notificationsApi } from "../services/notifications";

const logo_neolaia = "/logoNEOLAiA.png";
const eu_logo = "/eu_logo.png";

function ItemsList() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        category_id: '',
        university: '',
        item_status: '',
        erc_area: '',
        erc_panel: '',
        erc_keyword: '',
        languages: '',
        start_date_from: '',
        start_date_to: '',
        end_date_from: '',
        end_date_to: '',
        expiration_from: '',
        expiration_to: ''
    });
    const [showFilters, setShowFilters] = useState(false);
    const { token } = useContext(AuthContext);
    const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
    const [subscriptionName, setSubscriptionName] = useState('');
    const [subscriptionEmailOptIn, setSubscriptionEmailOptIn] = useState(true);
    const [subscriptionSubmitting, setSubscriptionSubmitting] = useState(false);
    const [subscriptionModalError, setSubscriptionModalError] = useState(null);
    const [subscriptionBanner, setSubscriptionBanner] = useState(null);

    const describeFilterValue = (key, value) => {
        if (!value) {
            return null;
        }

        const shortId = (val) => {
            if (typeof val !== 'string') {
                return val;
            }
            return val.length > 6 ? `${val.slice(0, 6)}…` : val;
        };

        switch (key) {
            case 'search':
                return `Search: "${value}"`;
            case 'category_id':
                return `Category filter (${shortId(value)})`;
            case 'university':
                return `University filter (${shortId(value)})`;
            case 'item_status':
                return `Status: ${value}`;
            case 'languages':
                return `Language: ${value}`;
            case 'erc_area':
                return `ERC area: ${value}`;
            case 'erc_panel':
                return `ERC panel (${shortId(value)})`;
            case 'erc_keyword':
                return `ERC keyword (${shortId(value)})`;
            case 'start_date_from':
                return `Start ≥ ${value}`;
            case 'start_date_to':
                return `Start ≤ ${value}`;
            case 'end_date_from':
                return `End ≥ ${value}`;
            case 'end_date_to':
                return `End ≤ ${value}`;
            case 'expiration_from':
                return `Expiration ≥ ${value}`;
            case 'expiration_to':
                return `Expiration ≤ ${value}`;
            default:
                return `${key}: ${value}`;
        }
    };

    const activeFilterChips = useMemo(() => {
        return Object.entries(filters)
            .filter(([, value]) => Boolean(value))
            .map(([key, value]) => describeFilterValue(key, value))
            .filter(Boolean);
    }, [filters]);

    const hasSubscriptionCriteria = activeFilterChips.length > 0;

    const buildDefaultSubscriptionName = () => {
        if (activeFilterChips.length === 0) {
            return 'All new items';
        }
        const primaryChip = activeFilterChips[0];
        return `Alert • ${primaryChip}`;
    };

    const openSubscriptionModal = () => {
        if (!token) {
            setSubscriptionBanner({ type: 'error', message: 'Please login to create alerts.' });
            navigate('/login');
            return;
        }

        if (!hasSubscriptionCriteria) {
            setSubscriptionBanner({ type: 'error', message: 'Select at least one filter before saving an alert.' });
            return;
        }

        setSubscriptionName(buildDefaultSubscriptionName());
        setSubscriptionEmailOptIn(true);
        setSubscriptionModalError(null);
        setSubscriptionModalOpen(true);
    };

    const closeSubscriptionModal = () => {
        setSubscriptionModalOpen(false);
        setSubscriptionModalError(null);
    };

    const handleCreateSubscription = async () => {
        if (!token) {
            setSubscriptionBanner({ type: 'error', message: 'Please login to create alerts.' });
            navigate('/login');
            return;
        }

        if (!hasSubscriptionCriteria) {
            setSubscriptionModalError('Select at least one filter before saving an alert.');
            return;
        }

        setSubscriptionSubmitting(true);
        setSubscriptionModalError(null);

        try {
            await notificationsApi.createSubscription(token, {
                name: subscriptionName.trim() || buildDefaultSubscriptionName(),
                criteria: filters,
                notify_via_email: subscriptionEmailOptIn
            });
            setSubscriptionModalOpen(false);
            setSubscriptionBanner({ type: 'success', message: 'Alert saved. You will be notified when new items match these filters.' });
        } catch (error) {
            const fallback = 'Unable to create alert. Please try again.';
            const message = error.response?.data?.error?.message || fallback;
            setSubscriptionModalError(message);
        } finally {
            setSubscriptionSubmitting(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [filters]);

    const fetchItems = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Build query string from filters
            const queryParams = new URLSearchParams();
            
            // Multi-field search using $or operator
            if (filters.search) {
                const searchTerm = filters.search;
                queryParams.append('filters[$or][0][name][$containsi]', searchTerm);
                queryParams.append('filters[$or][1][description][$containsi]', searchTerm);
                queryParams.append('filters[$or][2][learning_outcomes][$containsi]', searchTerm);
                queryParams.append('filters[$or][3][speakers][$containsi]', searchTerm);
                queryParams.append('filters[$or][4][pedagogical_objectives][$containsi]', searchTerm);
                queryParams.append('filters[$or][5][level_of_study][$containsi]', searchTerm);
                queryParams.append('filters[$or][6][seller_name][$containsi]', searchTerm);
                queryParams.append('filters[$or][7][multimedial_material_provided][$containsi]', searchTerm);
            }
            
            if (filters.category_id) {
                console.log("Applying category_id filter:", filters.category_id);
                queryParams.append('filters[item_category][documentId][$eq]', filters.category_id);
            }
            if (filters.university) {
                queryParams.append('filters[university][documentId][$eq]', filters.university);
            }
            if (filters.item_status) {
                queryParams.append('filters[item_status][$eq]', filters.item_status);
            }
            
            // ERC Area filter
            if (filters.erc_area) {
                queryParams.append('filters[erc_area][$eq]', filters.erc_area);
            }
            
            // ERC Panel filter
            if (filters.erc_panel && filters.erc_area) {
                queryParams.append('filters[erc_panel][documentId][$eq]', filters.erc_panel);
            }
            
            // ERC Keyword filter
            if (filters.erc_keyword && filters.erc_panel && filters.erc_area) {
                queryParams.append('filters[erc_keyword][documentId][$eq]', filters.erc_keyword);
            }

            // Languages filter
            if (filters.languages) {
                queryParams.append('filters[languages][$containsi]', filters.languages);
            }

            // Date filters
            if (filters.start_date_from) {
                queryParams.append('filters[start_date][$gte]', filters.start_date_from);
            }
            if (filters.start_date_to) {
                queryParams.append('filters[start_date][$lte]', filters.start_date_to);
            }
            if (filters.end_date_from) {
                queryParams.append('filters[end_date][$gte]', filters.end_date_from);
            }
            if (filters.end_date_to) {
                queryParams.append('filters[end_date][$lte]', filters.end_date_to);
            }
            if (filters.expiration_from) {
                queryParams.append('filters[expiration][$gte]', filters.expiration_from);
            }
            if (filters.expiration_to) {
                queryParams.append('filters[expiration][$lte]', filters.expiration_to);
            }

            console.log("Fetching items with filters:", queryParams.toString());

            const response = await axios.get(
                `${base_url}/items?${queryParams.toString()}`
            );
            
            setItems(response.data.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching items:", err);
            setError("Failed to load items. Please try again.");
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            category_id: '',
            university: '',
            item_status: '',
            erc_area: '',
            erc_panel: '',
            erc_keyword: '',
            languages: '',
            start_date_from: '',
            start_date_to: '',
            end_date_from: '',
            end_date_to: '',
            expiration_from: '',
            expiration_to: ''
        });
    };

    const hasActiveFilters = () => {
        return filters.search || filters.category_id || filters.university || 
               filters.item_status || filters.erc_area || filters.erc_panel || 
               filters.erc_keyword || filters.languages || filters.start_date_from || 
               filters.start_date_to || filters.end_date_from || filters.end_date_to ||
               filters.expiration_from || filters.expiration_to;
    };

    return (
        <div style={{ 
            minHeight: '100vh',
            backgroundColor: '#fafafa',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Navbar token={token} />

            {/* Main Content */}
            <div style={{ 
                flex: 1,
                maxWidth: '1400px',
                width: '100%',
                margin: '0 auto',
                padding: '2rem 1rem'
            }}>
                {subscriptionBanner && (
                    <div style={{
                        marginBottom: '1.25rem',
                        padding: '1rem',
                        borderRadius: '12px',
                        border: `1px solid ${subscriptionBanner.type === 'success' ? '#51cf66' : '#ff6b6b'}`,
                        backgroundColor: subscriptionBanner.type === 'success' ? '#e6fcf5' : '#fff5f5',
                        color: subscriptionBanner.type === 'success' ? '#2f9e44' : '#c92a2a',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '1rem'
                    }}>
                        <span>{subscriptionBanner.message}</span>
                        <button
                            onClick={() => setSubscriptionBanner(null)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'inherit',
                                fontWeight: '700',
                                cursor: 'pointer',
                                fontSize: '1rem'
                            }}
                            aria-label="Dismiss notification"
                        >
                            ×
                        </button>
                    </div>
                )}
                {/* Page Header with Filter Toggle */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <div>
                        <h2 style={{ 
                            fontSize: '2rem',
                            fontWeight: '700',
                            color: '#213547',
                            margin: '0 0 0.5rem 0'
                        }}>
                            Browse Items
                        </h2>
                        <p style={{ color: '#6c757d', margin: 0 }}>
                            {items.length} {items.length === 1 ? 'item' : 'items'} found
                            {hasActiveFilters() && (
                                <span style={{ 
                                    marginLeft: '0.5rem',
                                    color: '#7c6fd6',
                                    fontWeight: '500'
                                }}>
                                    • Filters active
                                </span>
                            )}
                        </p>
                    </div>
                    
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: showFilters 
                                ? 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)' 
                                : 'linear-gradient(135deg, #7c6fd6 0%, #8b7ad6 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            boxShadow: showFilters 
                                ? '0 2px 4px rgba(220, 53, 69, 0.2)' 
                                : '0 2px 4px rgba(124, 111, 214, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = showFilters 
                                ? '0 4px 12px rgba(220, 53, 69, 0.4)' 
                                : '0 4px 12px rgba(124, 111, 214, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = showFilters 
                                ? '0 2px 4px rgba(220, 53, 69, 0.2)' 
                                : '0 2px 4px rgba(124, 111, 214, 0.2)';
                        }}
                    >
                        <span style={{ fontSize: '1.2rem' }}>
                            {showFilters ? '✕' : '⚙'}
                        </span>
                        <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
                        {hasActiveFilters() && !showFilters && (
                            <span style={{
                                display: 'inline-block',
                                width: '8px',
                                height: '8px',
                                backgroundColor: 'white',
                                borderRadius: '50%'
                            }}></span>
                        )}
                    </button>
                </div>

                {/* Filters Section - Top Position */}
                {showFilters && (
                    <div style={{
                        marginBottom: '2rem',
                        animation: 'slideDown 0.3s ease-out'
                    }}>
                        <ItemsFilter 
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onClearFilters={clearFilters}
                            onSubscribeRequest={openSubscriptionModal}
                            canSubscribe={Boolean(token)}
                            subscriptionHint={!token ? 'Login to create alerts' : ''}
                        />
                    </div>
                )}

                {/* Items Grid */}
                <div>
                    {error && (
                        <div style={{
                            padding: '1rem',
                            backgroundColor: '#f8d7da',
                            border: '1px solid #f5c2c7',
                            borderRadius: '8px',
                            marginBottom: '1.5rem',
                            color: '#842029'
                        }}>
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div style={{ 
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: '400px'
                        }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: '3rem',
                                    height: '3rem',
                                    border: '0.3rem solid #f3f3f3',
                                    borderTop: '0.3rem solid #7c6fd6',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite',
                                    margin: '0 auto'
                                }}></div>
                                <p style={{ marginTop: '1rem', color: '#6c757d' }}>Loading items...</p>
                            </div>
                        </div>
                    ) : items.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '4rem 2rem',
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
                            <h3 style={{ color: '#213547', marginBottom: '0.5rem' }}>No items found</h3>
                            <p style={{ color: '#6c757d', marginBottom: '1rem' }}>
                                Try adjusting your filters or search criteria
                            </p>
                            {hasActiveFilters() && (
                                <button
                                    onClick={clearFilters}
                                    style={{
                                        marginTop: '1rem',
                                        padding: '0.75rem 1.5rem',
                                        backgroundColor: '#7c6fd6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = '#6b5ec5';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = '#7c6fd6';
                                    }}
                                >
                                    Clear All Filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                            gap: '1.5rem'
                        }}>
                            {items.map(item => (
                                <ItemCard key={item.id} item={item} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {subscriptionModalOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(33, 37, 41, 0.65)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem',
                    zIndex: 1200
                }}>
                    <div style={{
                        width: '100%',
                        maxWidth: '520px',
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        padding: '2rem',
                        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)',
                        position: 'relative'
                    }}>
                        <button
                            onClick={closeSubscriptionModal}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'transparent',
                                border: 'none',
                                fontSize: '1.25rem',
                                cursor: 'pointer',
                                color: '#adb5bd'
                            }}
                            aria-label="Close subscription dialog"
                        >
                            ×
                        </button>
                        <h3 style={{ marginTop: 0, color: '#213547' }}>Notify me about new items</h3>
                        <p style={{ color: '#6c757d', marginTop: '0.25rem' }}>
                            Save the current filters and get notified when matching items are published.
                        </p>

                        {subscriptionModalError && (
                            <div style={{
                                margin: '1rem 0',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: '1px solid #ff6b6b',
                                backgroundColor: '#fff5f5',
                                color: '#c92a2a'
                            }}>
                                {subscriptionModalError}
                            </div>
                        )}

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#495057' }}>
                                Alert name
                            </label>
                            <input
                                type="text"
                                value={subscriptionName}
                                onChange={(e) => setSubscriptionName(e.target.value)}
                                placeholder="e.g. English events from my university"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    border: '1px solid #dee2e6',
                                    fontSize: '0.95rem'
                                }}
                            />
                        </div>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#495057' }}>
                            <input
                                type="checkbox"
                                checked={subscriptionEmailOptIn}
                                onChange={(e) => setSubscriptionEmailOptIn(e.target.checked)}
                            />
                            Email me when a matching item appears
                        </label>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <p style={{ fontWeight: 600, color: '#495057', marginBottom: '0.5rem' }}>Active filters</p>
                            {activeFilterChips.length === 0 ? (
                                <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                                    No filters selected. Choose at least one filter to save an alert.
                                </p>
                            ) : (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {activeFilterChips.map((chip) => (
                                        <span
                                            key={chip}
                                            style={{
                                                backgroundColor: '#f0f0ff',
                                                border: '1px solid #7c6fd6',
                                                borderRadius: '999px',
                                                padding: '0.3rem 0.85rem',
                                                fontSize: '0.85rem',
                                                color: '#5a4fb9'
                                            }}
                                        >
                                            {chip}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                            <button
                                onClick={closeSubscriptionModal}
                                style={{
                                    padding: '0.65rem 1.25rem',
                                    borderRadius: '8px',
                                    border: '1px solid #dee2e6',
                                    backgroundColor: 'white',
                                    cursor: 'pointer'
                                }}
                                disabled={subscriptionSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateSubscription}
                                disabled={subscriptionSubmitting || activeFilterChips.length === 0}
                                style={{
                                    padding: '0.65rem 1.65rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: subscriptionSubmitting || activeFilterChips.length === 0 ? '#cfd2f1' : '#7c6fd6',
                                    color: 'white',
                                    fontWeight: 600,
                                    cursor: subscriptionSubmitting || activeFilterChips.length === 0 ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {subscriptionSubmitting ? 'Saving…' : 'Save alert'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}

export default ItemsList;