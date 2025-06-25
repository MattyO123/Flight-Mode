import Navigation from "@/components/navigation";

export default function Terms() {
  return (
    <div className="min-h-screen bg-cream">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-serif font-bold text-navy-900 mb-8">
            Terms & Conditions
          </h1>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-navy-800 mb-3">Competition Entry</h2>
              <p className="mb-3">
                Our competitions are skill-based and open to UK residents aged 18 and over. 
                To enter, you must correctly answer the skill question and pay the entry fee.
              </p>
              <p className="mb-3">
                <strong>Free Postal Entry:</strong> Alternatively, you may enter free of charge by posting your 
                name, full address, telephone number, and the correct answer to the skill question to: 
                Flight Mode Competitions, PO Box 1847, Manchester M60 1QS. Please use a separate envelope 
                for each entry. Standard postal rates apply. Postal entries must be received before the 
                competition closing date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-navy-800 mb-3">Skill Question</h2>
              <p>
                All entries must include the correct answer to the skill question. Incorrect answers 
                will be disqualified. The skill question eliminates the element of chance and ensures 
                this remains a competition of skill.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-navy-800 mb-3">Winner Selection</h2>
              <p>
                Winners will be selected at random from all correct entries received by the closing date. 
                The draw will take place within 7 days of the competition closing. Winners will be notified 
                within 14 days of the draw.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-navy-800 mb-3">Prize Details</h2>
              <p>
                Prizes are as described in the individual competition details. Cash alternatives are not 
                available. Prizes are non-transferable. Travel prizes include return flights and accommodation 
                as specified, subject to availability.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-navy-800 mb-3">General</h2>
              <p className="mb-3">
                Flight Mode Competitions Ltd reserves the right to disqualify any entry that does not 
                comply with these terms. Our decision is final in all matters.
              </p>
              <p>
                By entering, you consent to your name and county being published if you win. 
                Full terms and conditions are available on request.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}