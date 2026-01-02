export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <h1 className="text-3xl font-serif font-bold mb-8 text-center">Terms and Conditions</h1>

            <div className="space-y-6 text-gray-700 leading-relaxed text-sm md:text-base">
                <section>
                    <h2 className="text-xl font-semibold text-black mb-3">1. Introduction</h2>
                    <p>
                        Welcome to Fragrance Kart. By accessing our website and placing an order, you agree to be bound by these Terms and Conditions. Please read them carefully before using our services.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-black mb-3">2. Products and Services</h2>
                    <p>
                        We strive to display the colors and images of our products as accurately as possible. However, we cannot guarantee that your computer monitor's display of any color will be accurate. All products are subject to availability, and we reserve the right to discontinue any product at any time.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-black mb-3">3. Pricing and Payment</h2>
                    <p>
                        All prices are listed in the local currency and are subject to change without notice. We accept various payment methods as indicated at checkout. You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-black mb-3">4. Shipping and Returns</h2>
                    <p>
                        Shipping costs and delivery times vary depending on the destination. Please refer to our Shipping Policy for detailed information. We accept returns within a specified period, provided the items are in their original condition.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-black mb-3">5. Intellectual Property</h2>
                    <p>
                        All content included on this site, such as text, graphics, logos, images, and software, is the property of Fragrance Kart or its content suppliers and protected by international copyright laws.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-black mb-3">6. Governing Law</h2>
                    <p>
                        These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of the jurisdiction in which our company is registered.
                    </p>
                </section>

                <p className="text-xs text-gray-500 mt-10">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
        </div>
    );
}
