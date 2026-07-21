import Link from "next/link";
import { ArrowRight } from "@/components/icons";

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="shell not-found__grid">
        <p>404</p>
        <div>
          <span>Page not found</span>
          <h1>The route changed.<br />The next decision is clear.</h1>
          <p>The page you requested does not exist or has moved.</p>
          <Link className="button button--light" href="/">Return home <ArrowRight /></Link>
        </div>
      </div>
    </section>
  );
}
