import heroImage from "@/assets/hero-restaurant.jpg";

const Hero = () => {
  return (
    <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-background" />
      </div>
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 animate-fade-in">
          Le Gourmet Parisien
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          Une expérience culinaire authentique au cœur de Paris
        </p>
        <div className="flex gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <a 
            href="#menu" 
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:scale-105 transition-transform shadow-elegant"
          >
            Découvrir le menu
          </a>
          <a 
            href="#avis" 
            className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg font-medium hover:bg-white/20 transition-colors"
          >
            Nos avis
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
