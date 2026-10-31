import { ArrowUpRight, Compass } from "lucide-react";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <div className="footer-brand">Idris Tour &amp; Travel</div>
          <p className="footer-tagline">Your Journey, Our Priority.</p>
          <p className="footer-details">Bole, Addis Ababa · Umrah, flights, hotels, tours and visa assistance.</p>
        </div>
        <div className="footer-right">
          <p>
            The fares shown are planning figures. Confirm availability and final
            prices with the travel desk before booking.
          </p>
          <a href="#film">
            <Compass className="size-4" aria-hidden="true" />
            Back to the beginning <ArrowUpRight className="size-3" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
