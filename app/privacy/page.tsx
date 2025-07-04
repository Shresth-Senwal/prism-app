export default function PrivacyPage() {
  return (
    <div className="container py-12 max-w-4xl">
      <div className="space-y-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold">Privacy Policy</h1>

        <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">Data Collection</h2>
            <p className="leading-relaxed">
              Prism collects minimal personal information necessary to provide our analysis services. We do not store
              your search queries or personal browsing history beyond what is necessary for service functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">Data Usage</h2>
            <p className="leading-relaxed">
              The information we collect is used solely to improve our analysis algorithms and provide you with more
              relevant perspectives. We do not sell, rent, or share your personal information with third parties for
              marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">Data Security</h2>
            <p className="leading-relaxed">
              We implement industry-standard security measures to protect your information. All data transmission is
              encrypted, and we regularly update our security protocols to ensure your privacy is maintained.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">Contact</h2>
            <p className="leading-relaxed">
              If you have any questions about this Privacy Policy or our data practices, please contact us at
              privacy@prism.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
