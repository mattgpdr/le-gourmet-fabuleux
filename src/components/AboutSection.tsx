const AboutSection = () => {
  return (
    <section id="a-propos" className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-4 md:mb-6">
            Notre restaurant est ouvert du lundi au dimanche
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-4 md:mb-6">
            Nous avons le plaisir de vous recevoir pour déjeuner et dîner du lundi au dimanche. 
            Menu du jour et carte selon les saisons servis rapidement – la solution parfaite lorsque 
            les choses doivent aller vite. Le Gourmet Parisien – Des plats délicieux de la cuisine française.
          </p>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 md:mb-8">
            Notre restaurant est un lieu de rencontre prisé pour une pause déjeuner ou pour boire un verre 
            après une journée au bureau. Profitez de votre soirée dans notre espace chaleureux ou en terrasse 
            avec vue sur Paris.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 md:gap-8 mt-8 md:mt-12">
            <div className="bg-card p-4 md:p-6 rounded-lg border">
              <h3 className="text-lg md:text-2xl font-serif font-bold mb-3 md:mb-4">
                Un excellent restaurant avec une carte variée
              </h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Notre cuisine française vous régalera avec des recettes riches en traditions au goût authentique. 
                Découvrez nos spécialités et notre sélection de vins. L'après-midi, savourez un bon café 
                accompagné d'un dessert maison.
              </p>
            </div>
            
            <div className="bg-card p-4 md:p-6 rounded-lg border">
              <h3 className="text-lg md:text-2xl font-serif font-bold mb-3 md:mb-4">
                Événements privés sur mesure
              </h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Notre établissement est disponible pour vos événements privés. Contactez-nous pour organiser 
                votre anniversaire, baptême, communion ou tout autre événement. Nous vous proposerons une date 
                et un menu personnalisés.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
