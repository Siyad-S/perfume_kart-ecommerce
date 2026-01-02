export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <h1 className="text-3xl font-serif font-bold mb-8 text-center">Privacy Policy</h1>

            <div className="space-y-6 text-gray-700 leading-relaxed text-sm md:text-base">
                <section>
                    <h2 className="text-xl font-semibold text-black mb-3">1. Information We Collect</h2>
                    <p>
                        We collect information you provide directly to us, such as when you create an account, place an order, subscribe to our newsletter, or contact customer support. This information may include your name, email address, shipping address, payment information, and phone number.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-black mb-3">2. How We Use Your Information</h2>
                    <p>
                        We use the information we collect to process your orders, communicate with you, improve our services, and send you marketing communications (if you have opted in). We do not share your personal information with third parties for their marketing purposes without your consent.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-black mb-3">3. Cookies and Tracking Technologies</h2>
                    <p>
                        We use cookies and similar tracking technologies to track the activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-black mb-3">4. Data Security</h2>
                    <p>
                        We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-black mb-3">5. Your Rights</h2>
                    <p>
                        Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, delete, or restrict the use of your data. Please contact us to exercise these rights.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-black mb-3">6. Changes to This Policy</h2>
                    <p>
                        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
                    </p>
                </section>

                <p className="text-xs text-gray-500 mt-10">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
        </div>
    );
}
