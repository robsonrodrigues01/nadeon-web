export interface FaqItem {
  question: string;
  answer: string;
}

export const HUMAN_FAQS: FaqItem[] = [
  {
    question: "What is NMN and how is it different from NAD+?",
    answer:
      "NMN (Nicotinamide Mononucleotide) is the direct cellular precursor to NAD+. While NAD+ is a larger molecule, NMN is readily absorbed and converted by your cells into active NAD+ to support cellular energy and repair.",
  },
  {
    question: "How long until I notice a difference?",
    answer:
      "Most customers report feeling sustained daily energy and mental clarity within 2 to 4 weeks of consistent morning use. Long-term cellular benefits compound over 60 to 90 days.",
  },
  {
    question: "Can I take BioHack and Renew together?",
    answer:
      "Yes. In fact, our Energy Duo pairs BioHack (NMN) with Renew (direct NAD+ and trans-resveratrol) to provide two complementary biological pathways to cellular NAD+ elevation.",
  },
  {
    question: "How does Subscribe & Save work?",
    answer:
      "You receive 15% off every order delivered automatically every 30, 60, or 90 days. You can adjust frequency, swap formulas, pause, or cancel anytime from your account dashboard with zero commitment.",
  },
  {
    question: "Where are your products made and tested?",
    answer:
      "All Nadeon formulas are manufactured in our own cGMP-compliant, FDA-registered facility in Clifton, New Jersey. Every lot is independently third-party tested with certificates of analysis publicly available.",
  },
];
