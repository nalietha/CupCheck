export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-vaporText p-8 flex justify-center">
      <div className="max-w-3xl w-full space-y-8">
        <h1 className="text-3xl font-bold text-vaporCyan">Privacy Policy</h1>
        
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">1. Data Collection</h2>
          <p className="text-gray-400">
            When you submit a support ticket, we collect the information you provide, 
            including your email address, the subject of your request, and the description 
            of the issue. We use this information solely to provide support and improve 
            our services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">2. Third-Party Services</h2>
          <p className="text-gray-400">
            We use <strong>EmailJS</strong> to facilitate the delivery of support tickets. 
            Your support request data is processed through their secure infrastructure 
            for the sole purpose of delivering your message to our support team.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">3. Data Security</h2>
          <p className="text-gray-400">
            Your data is important to us. We do not sell your personal information to 
            third parties. We implement industry-standard security measures to protect 
            the information you submit through our platform.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">4. Contact Us</h2>
          <p className="text-gray-400">
            If you have any questions about this privacy policy or how we handle your data, 
            please reach out to us at <a href="mailto:support@yourdomain.com" className="text-vaporCyan hover:underline">support@yourdomain.com</a>.
          </p>
        </section>

        <footer className="pt-8 border-t border-gray-800 text-sm text-gray-600">
          Last updated: June 17, 2026
        </footer>
      </div>
    </main>
  );
}