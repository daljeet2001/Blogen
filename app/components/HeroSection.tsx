"use client";

export function HeroSection() {
  return (
    <section className="w-full min-h-[80vh] flex items-center justify-center bg-black text-white mb-20">
      <div className="max-w-3xl mx-auto px-6 text-center">
        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
          Turn Blogs into Social Media Posts in Seconds
        </h1>

        {/* Subtext */}
        <p className="text-lg md:text-xl text-gray-300 mb-6">
          Blogen helps you repurpose your blog content into engaging posts for
          LinkedIn, X, and Instagram — saving you hours of work while boosting
          your reach.
        </p>

        {/* Tenant Highlight */}
    <div className="w-full px-6 py-4 mb-10 text-cente bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white rounded-3xl">
  <p className="text-md md:text-lg font-medium text-white ">
  Built for teams — invite members to your tenant, edit together, generate posts from your content, and publish with ease✨.
</p>

    </div>


        <img
          src="/sc1.png"
          alt="Hero Image"
          className="w-full h-auto rounded-lg shadow-lg"
        />
      </div>
    </section>
  );
}
