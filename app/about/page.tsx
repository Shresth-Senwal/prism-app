export default function AboutPage() {
  return (
    <div className="container py-12 max-w-4xl">
      <div className="space-y-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold">About Prism</h1>

        <div className="prose prose-lg max-w-none text-muted-foreground">
          <p className="text-lg leading-relaxed">
            Prism is designed to help you see the complete picture by analyzing topics from multiple perspectives. In
            our increasingly complex world, understanding different viewpoints is essential for making informed
            decisions and fostering meaningful dialogue.
          </p>

          <p className="leading-relaxed">
            Our AI-powered platform aggregates information from diverse sources across the digital landscape, presenting
            you with a comprehensive analysis that includes economic, social, environmental, technological, and ethical
            perspectives on any topic you choose to explore.
          </p>

          <p className="leading-relaxed">
            Whether you're a researcher, student, journalist, or simply someone who values informed discourse, Prism
            provides the tools you need to understand the multifaceted nature of today's most important issues.
          </p>
        </div>
      </div>
    </div>
  )
}
