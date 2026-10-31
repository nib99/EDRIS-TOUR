import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { journeys } from "@/data/catalog";
import { Enquire } from "@/components/site/enquire";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { Journeys } from "@/components/site/journeys";
import { Services } from "@/components/site/services";
import { Showcase } from "@/components/site/showcase";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [journeyId, setJourneyId] = useState(journeys[0].id);
  const [travelers, setTravelers] = useState(2);
  const journey = journeys.find((item) => item.id === journeyId) ?? journeys[0];

  return (
    <main className="min-h-screen">
      <Header />
      <Showcase />
      <Journeys
        selectedId={journey.id}
        travelers={travelers}
        onTravelers={setTravelers}
        onSelect={(next) => setJourneyId(next.id)}
      />
      <Services />
      <Enquire journeyName={journey.name} travelersHint={travelers} />
      <Footer />
    </main>
  );
}
