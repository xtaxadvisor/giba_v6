import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function TermsAndConditions() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          icon={ArrowLeft}
          className="mb-8"
        >
          Back to Home
        </Button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms and Conditions</h1>
          
          <div className="prose max-w-none">
            <h2>1. Introduction</h2>
            <p>Welcome to ProTaXAdvisors. By using our services, you agree to these terms and conditions.</p>

            <h2>2. Services</h2>
            <p>We provide tax advisory, financial planning, and related professional services. Our services are subject to professional standards and regulations.</p>

            <h2>3. Client Responsibilities</h2>
            <p>Clients must provide accurate and complete information. We rely on the information you provide to deliver our services.</p>

            <h2>4. Confidentiality</h2>
            <p>We maintain strict confidentiality of all client information in accordance with professional standards and applicable laws.</p>

            <h2>5. Payment Terms</h2>
            <p>Payment is required according to the agreed terms. Late payments may incur additional charges.</p>

            <h2>6. Communication</h2>
            <p>We may contact you via email, phone, or SMS. By using our services, you consent to receive communications from us.</p>

            <h2>7. Online Services</h2>
            <p>Our online platform is provided "as is." We strive to maintain availability but cannot guarantee uninterrupted access.</p>

            <h2>8. Liability</h2>
            <p>Our liability is limited to the extent permitted by law and our professional obligations.</p>

            <h2>9. Termination</h2>
            <p>Either party may terminate services with written notice, subject to completion of ongoing matters.</p>

            <h2>10. Updates</h2>
            <p>These terms may be updated. Continued use of our services constitutes acceptance of updated terms.</p>

            <h2>11. Contact</h2>
            <p>For questions about these terms, please contact us at:</p>
            <ul>
              <li>Email: info@protaxadvisors.tax</li>
              <li>Phone: (833) 854-5020</li>
              <li>Address: 7575 Kingspointe Pkwy Suite 20, Orlando, Florida 32819</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}