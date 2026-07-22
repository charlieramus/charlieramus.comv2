import Reveal from "@/components/reveal";

// A quiet nudge down into the "Right now" section. Replaces the old "Step into
// my digital home" heading + horizontal project carousel (and its bookmark
// icon), removed in V15: a centered "View more" link that smooth-scrolls down
// to #right-now, with a chevron that slowly fades in and out.
export default function DigitalHome() {
  return (
    <Reveal className="step">
      <a href="#right-now" className="step-more">
        <span>View more</span>
        <svg
          className="step-arrow"
          viewBox="0 0 24 24"
          width="22"
          height="22"
          aria-hidden="true"
        >
          <path
            d="M6 9l6 6 6-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </Reveal>
  );
}
