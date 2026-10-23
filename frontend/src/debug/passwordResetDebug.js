import axios from 'axios';

// Test the password reset flow from frontend perspective
const testPasswordResetFromFrontend = async () => {
    console.log('\n=== Frontend Password Reset Debugging ===\n');

    // Check environment
    console.log('1. Checking Vite environment variables:');
    console.log(`   VITE_API_URL: ${import.meta.env.VITE_API_URL}`);

    const PRODUCTS_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/products';
    const AUTH_API_URL = PRODUCTS_API_URL.replace('/products', '/auth');

    console.log(`   Resolved PRODUCTS_API_URL: ${PRODUCTS_API_URL}`);
    console.log(`   Resolved AUTH_API_URL: ${AUTH_API_URL}`);

    // Test API connectivity
    console.log('\n2. Testing API connectivity:');
    try {
        const testUrl = `${AUTH_API_URL}/forgot-password`;
        console.log(`   Testing endpoint: ${testUrl}`);

        const response = await axios.post(testUrl, {
            email: 'test-reset@example.com'
        });

        console.log('   ✅ API Request successful!');
        console.log(`   Response: ${JSON.stringify(response.data)}`);
    } catch (error) {
        console.error('   ❌ API Request failed!');
        console.error(`   Error: ${error.message}`);

        if (error.response) {
            console.error(`   Status: ${error.response.status}`);
            console.error(`   Data: ${JSON.stringify(error.response.data)}`);
        } else if (error.request) {
            console.error('   No response received (network error)');
        }
    }

    console.log('\n3. Checking CORS configuration:');
    console.log(`   Frontend origin: ${window.location.origin}`);
    console.log(`   Backend origin: ${new URL(AUTH_API_URL).origin}`);
    console.log(`   Same origin? ${window.location.origin === new URL(AUTH_API_URL).origin}`);

    if (window.location.origin !== new URL(AUTH_API_URL).origin) {
        console.log('   ⚠️  Cross-origin request detected');
        console.log('   The backend should have CORS configured to allow this origin');
    }
};

// Export for use in browser console
window.testPasswordReset = testPasswordResetFromFrontend;

console.log('Password reset debug helper loaded!');
console.log('Run testPasswordReset() in the console to test the API connection');
