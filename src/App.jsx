import { useState, useRef } from "react";

// ---- Design tokens ----
// Restrained, materials-based palette. One signature accent (warm desaturated gold),
// near-black ground, hairline borders instead of glow. Glow is reserved for one moment only:
// the instant a restaurant earns or upgrades a prestige tier.

const T = {
  // White & minimal — matches the dinedin.app landing page. One restrained teal accent.
  bg: "#FFFFFF",
  surface: "#FFFFFF",          // cards are white, separated by hairline borders
  surfaceRaised: "#FBFAF6",    // faint warm off-white for raised/inset areas
  border: "#E7E4DC",           // hairline border
  borderStrong: "#D8D4C9",
  text: "#14130F",             // near-black ink
  textMuted: "#57544C",        // soft ink
  textFaint: "#918D82",        // faint ink
  accent: "#2E6B52",           // the single teal-green accent (the seal color)
  accentSoft: "#3B7A5E",
  accentDim: "#EDF3EF",        // teal tint for soft backgrounds
  accentDeep: "#1F4E3B",
  gold: "#B08544",             // hairline gold, used only for star ratings
  // Muted accent families (kept for avatars/tiers) — all calm, cohesive on white.
  pink: "#2E6B52",
  purple: "#2E6B52",
  blue: "#2E6B52",
  teal: "#2E6B52",
  amber: "#B08544",
  success: "#2E6B52",          // teal-green
  danger: "#C0573A",           // muted clay (for alerts only)
};

// Muted single-tone "gradients" — calm tints in the teal/sage family so avatars
// stay distinct without the loud rainbow. Each is a soft two-stop in one hue.
const GRADIENTS = {
  pink:   ["#3B7A5E", "#2E6B52"],
  purple: ["#4A7C8C", "#356070"],
  teal:   ["#3B7A5E", "#2E6B52"],
  blue:   ["#4A7C8C", "#356070"],
  amber:  ["#B89160", "#9A7240"],
  coral:  ["#A8705E", "#8A5847"],
};
const gradientCss = (key) => {
  const g = GRADIENTS[key] || GRADIENTS.teal;
  return `linear-gradient(140deg, ${g[0]} 0%, ${g[1]} 100%)`;
};

const reviewers = [
  {
    id: 1,
    name: "Marcus Chen",
    handle: "@marcuseats",
    color: "#FF4D8D",
    colorSecondary: "#FF9E4D",
    colorName: "Sunset Coral",
    gradKey: "pink",
    gradient: "linear-gradient(135deg, #FF4D8D 0%, #FF9E4D 100%)",
    tasteProfile: "Adventurous palate, leans toward bold flavors and unfamiliar cuisines. Will travel across town for an authentic hole-in-the-wall over a trendy spot. Tips generously, rarely sends food back.",
    verifiedVisits: 312,
    trustScore: 94,
    trustBreakdown: [
      { label: "Verified visits", detail: "312 confirmed check-ins", value: 98 },
      { label: "Review consistency", detail: "Ratings track with the crowd", value: 91 },
      { label: "Review depth", detail: "Detailed, specific write-ups", value: 88 },
      { label: "Community helpfulness", detail: "1,240 found reviews helpful", value: 96 },
      { label: "Account history", detail: "Member 3+ years, no flags", value: 95 },
    ],
    matchScore: 92,
    photoUrl: null,
    dimensions: [
      { label: "Adventurousness", value: 89, color: "#FF4D8D" },
      { label: "Consistency", value: 91, color: "#FF9E4D" },
      { label: "Generosity (tipping)", value: 95, color: "#FF4D8D" },
      { label: "Review Detail", value: 82, color: "#FF9E4D" },
    ],
  },
  {
    id: 2,
    name: "Jasmine Rodriguez",
    handle: "@jasminebites",
    color: "#2FE0A8",
    colorSecondary: "#4DFFD0",
    colorName: "Electric Jade",
    gradKey: "teal",
    gradient: "linear-gradient(135deg, #2FE0A8 0%, #4DFFD0 100%)",
    tasteProfile: "Chases the new and the Instagrammable. Loves tasting menus and chef's counters. High standards for presentation, slightly less patient with service hiccups.",
    verifiedVisits: 178,
    trustScore: 81,
    trustBreakdown: [
      { label: "Verified visits", detail: "178 confirmed check-ins", value: 90 },
      { label: "Review consistency", detail: "Occasionally an outlier", value: 74 },
      { label: "Review depth", detail: "Vivid, presentation-focused", value: 92 },
      { label: "Community helpfulness", detail: "610 found reviews helpful", value: 80 },
      { label: "Account history", detail: "Member 2 years, no flags", value: 84 },
    ],
    matchScore: 64,
    photoUrl: null,
    dimensions: [
      { label: "Adventurousness", value: 95, color: "#2FE0A8" },
      { label: "Consistency", value: 64, color: "#4DFFD0" },
      { label: "Generosity (tipping)", value: 73, color: "#2FE0A8" },
      { label: "Review Detail", value: 90, color: "#4DFFD0" },
    ],
  },
  {
    id: 3,
    name: "Derek Osei",
    handle: "@derekfuels",
    color: "#4DA6FF",
    colorSecondary: "#A24DFF",
    colorName: "Cosmic Tide",
    gradKey: "purple",
    gradient: "linear-gradient(135deg, #4DA6FF 0%, #A24DFF 100%)",
    tasteProfile: "Macro-conscious, prioritizes protein and quality ingredients over indulgence. Reviews are blunt and data-driven — calls out cooking quality and freshness without sentimentality.",
    verifiedVisits: 245,
    trustScore: 97,
    trustBreakdown: [
      { label: "Verified visits", detail: "245 confirmed check-ins", value: 96 },
      { label: "Review consistency", detail: "Remarkably steady ratings", value: 99 },
      { label: "Review depth", detail: "Blunt, data-driven detail", value: 94 },
      { label: "Community helpfulness", detail: "1,870 found reviews helpful", value: 97 },
      { label: "Account history", detail: "Member 4+ years, no flags", value: 98 },
    ],
    matchScore: 71,
    photoUrl: null,
    dimensions: [
      { label: "Adventurousness", value: 52, color: "#4DA6FF" },
      { label: "Consistency", value: 98, color: "#A24DFF" },
      { label: "Generosity (tipping)", value: 84, color: "#4DA6FF" },
      { label: "Review Detail", value: 88, color: "#A24DFF" },
    ],
  },
  {
    id: 4,
    name: "You",
    handle: "@you",
    color: "#665E78",
    colorSecondary: "#4A4458",
    colorName: "Unverified",
    gradKey: "purple",
    gradient: "linear-gradient(135deg, #665E78 0%, #4A4458 100%)",
    tasteProfile: "No verified visits yet. Your taste profile builds as you verify real visits to restaurants.",
    verifiedVisits: 0,
    trustScore: 0,
    photoUrl: null,
    dimensions: [
      { label: "Adventurousness", value: 0, color: "#6B6B70" },
      { label: "Consistency", value: 0, color: "#4A4A4E" },
      { label: "Generosity (tipping)", value: 0, color: "#6B6B70" },
      { label: "Review Detail", value: 0, color: "#4A4A4E" },
    ],
  },
];

// ---- AI response engine (simulated) ----

const SEVERITY_KEYWORDS = [
  "hair", "foreign object", "sick", "ill", "allergic", "allergy", "food poisoning",
  "rude", "discriminat", "racist", "yelled", "refused to", "health", "roach", "bug in",
  "raw chicken", "undercooked", "vomit", "hospital", "manager refused",
];

function classifySeverity(review) {
  const ratingFlag = review.rating <= 2;
  const text = review.snippet.toLowerCase();
  const textFlag = SEVERITY_KEYWORDS.some(kw => text.includes(kw));
  const longComplaintFlag = review.rating <= 3 && text.length > 90 &&
    (text.includes("frustrat") || text.includes("never") || text.includes("waited") || text.includes("ignored"));

  if (ratingFlag || textFlag || longComplaintFlag) {
    let reason = "Low rating";
    if (textFlag) reason = "Flagged language detected";
    else if (longComplaintFlag) reason = "Pattern of service complaint";
    return { escalate: true, reason };
  }
  return { escalate: false, reason: null };
}

// Three voice presets a restaurant can pick during onboarding. Real product would generate
// these per-restaurant with an LLM tuned to their actual brand voice — this is a fixed
// approximation so two restaurants don't sound identical out of the box.
const REPLY_TONES = {
  warm: { label: "Warm & casual", description: "Friendly, personal, like a server talking to a regular" },
  polished: { label: "Polished & formal", description: "Professional, measured, fine-dining register" },
  playful: { label: "Playful & energetic", description: "Upbeat, a little fun, casual spot with personality" },
};

const TONE_TEMPLATES = {
  warm: {
    5: (name) => `Aww, thank you for this! Means a lot to hear — we're so glad you had a great time at ${name}. Come back and see us soon!`,
    4: (name) => `Thanks so much for stopping by ${name} and for the honest feedback! We're always working to make it even better.`,
    neutral: (name) => `Hey, thanks for taking the time to share this. We'd love another shot at winning you over next time at ${name}.`,
    escalated: (name) => `We're really sorry this happened at ${name} — that's just not us. Please reach out directly so we can make it right.`,
  },
  polished: {
    5: (name) => `Thank you for your generous review. It was our pleasure to host you at ${name}, and we look forward to welcoming you again.`,
    4: (name) => `We appreciate your feedback following your visit to ${name}. We are grateful for your patronage and continually refining our offering.`,
    neutral: (name) => `Thank you for sharing your experience. We would welcome the opportunity to provide an improved visit at ${name} in the future.`,
    escalated: (name) => `We sincerely apologize for this experience at ${name}, which does not reflect our standards. Please contact us directly so we may address this properly.`,
  },
  playful: {
    5: (name) => `Yesss, this made our day! Thank you for the love — see you back at ${name} soon, our doors (and kitchen) are always open!`,
    4: (name) => `Thanks for the shoutout! We're stoked you came by ${name} — noted on the rest, we're on it.`,
    neutral: (name) => `Appreciate you taking the time! Let us flip the script next visit to ${name} — we know we can do better.`,
    escalated: (name) => `Oof, that's not the experience we want anyone to have at ${name}. Really sorry — reach out directly so we can fix this for you.`,
  },
};

function generateAutoReply(review, restaurantName, tone = "warm") {
  const templates = TONE_TEMPLATES[tone] || TONE_TEMPLATES.warm;
  if (review.rating >= 5) {
    return { text: templates[5](restaurantName), reasoning: "Positive review — thanked reviewer, invited return visit" };
  }
  if (review.rating === 4) {
    return { text: templates[4](restaurantName), reasoning: "Mostly positive — acknowledged minor gap, kept tone upbeat" };
  }
  return { text: templates.neutral(restaurantName), reasoning: "Neutral review — acknowledged feedback, opened door to return" };
}

function generateEscalatedDraft(review, restaurantName, tone = "warm") {
  const templates = TONE_TEMPLATES[tone] || TONE_TEMPLATES.warm;
  return {
    text: templates.escalated(restaurantName),
    reasoning: "Apologized directly, avoided defensive language, moved resolution off-platform",
  };
}

function enrichReview(review, restaurantName, tone = "warm") {
  const severity = classifySeverity(review);
  if (severity.escalate) {
    return { ...review, status: "needs_attention", escalationReason: severity.reason, suggestedReply: generateEscalatedDraft(review, restaurantName, tone) };
  }
  return { ...review, status: "auto_replied", aiReply: generateAutoReply(review, restaurantName, tone) };
}

const initialRestaurantsRaw = [
  {
    id: 1,
    name: "The Olive Counter",
    gradKey: "amber",
    cuisine: "Mediterranean · Scottsdale, AZ",
    logoUrl: null,
    tone: "polished",
    rating: 4.9,
    verifiedReviewCount: 89,
    googleRating: 4.4,
    reviews: [
      { reviewerId: 1, snippet: "Octopus was perfectly charred, service knew the menu cold.", visitVerified: true, rating: 5 },
      { reviewerId: 3, snippet: "Solid protein options, portions slightly small for the price.", visitVerified: true, rating: 4 },
      { reviewerId: 2, snippet: "Found a hair in my pasta and the server brushed it off instead of replacing the dish.", visitVerified: true, rating: 2 },
      { reviewerId: 4, snippet: "Service was a little slow on a Friday but the food made up for it.", visitVerified: true, rating: 4 },
    ],
  },
  {
    id: 2,
    name: "Sakura & Stone",
    gradKey: "purple",
    cuisine: "Japanese · Denver, CO",
    logoUrl: null,
    tone: "warm",
    rating: 4.6,
    verifiedReviewCount: 142,
    googleRating: 4.3,
    reviews: [
      { reviewerId: 2, snippet: "Omakase presentation was stunning, worth the splurge.", visitVerified: true, rating: 5 },
      { reviewerId: 1, snippet: "Black cod melted, but wait time ran long on a Friday.", visitVerified: true, rating: 4 },
    ],
  },
  {
    id: 3,
    name: "Ember & Oak",
    gradKey: "teal",
    cuisine: "Asian Fusion · Denver, CO",
    logoUrl: null,
    tone: "playful",
    rating: 4.8,
    verifiedReviewCount: 67,
    googleRating: 4.6,
    reviews: [
      { reviewerId: 3, snippet: "Best plating-to-flavor ratio I've tracked all year.", visitVerified: true, rating: 5 },
      { reviewerId: 2, snippet: "The duck was outstanding and the sommelier's pairing made the whole meal.", visitVerified: true, rating: 5 },
      { reviewerId: 4, snippet: "Incredible attention to detail in every course, will be back monthly.", visitVerified: true, rating: 5 },
      { reviewerId: 1, snippet: "Waited 50 minutes past our reservation with no update from staff, very frustrating experience.", visitVerified: true, rating: 1 },
    ],
  },
];

const initialRestaurants = initialRestaurantsRaw.map(r => ({
  ...r,
  reviews: r.reviews.map(rev => enrichReview(rev, r.name, r.tone)),
}));

// ---- Prestige tier system (uniform color per tier, not per-restaurant) ----
// Materials-based, not arcade-bright. Elite shares the brand's signature gold —
// reaching Elite means embodying the brand itself — earned, never purchased.

const PRESTIGE_TIERS = {
  elite: { label: "Elite", color: "#B08544", glow: "rgba(176,133,68,0.18)" },
  trusted: { label: "Select", color: "#2E6B52", glow: "rgba(46,107,82,0.14)" },
  rising: { label: "Recognized", color: "#7A766C", glow: "rgba(122,118,108,0.14)" },
};

// Tier criteria, pulled out as a single config block since these numbers are placeholders,
// not validated against real restaurant data yet. Expect to tune these once real restaurants
// are live on the platform and we know what "good" actually looks like in practice.
const TIER_THRESHOLDS = {
  elite: { minRating: 4.8, minReviews: 60, minResponseRate: 0.9 },
  trusted: { minRating: 4.5, minReviews: 50, minResponseRate: 0.6 },
  rising: { minRating: 4.2, minReviews: 20, minResponseRate: 0 },
};

function calculatePrestigeTier(restaurant) {
  const { rating, verifiedReviewCount, reviews } = restaurant;
  const respondedCount = reviews.filter(r => r.status === "owner_replied" || r.status === "auto_replied").length;
  const responseRate = reviews.length > 0 ? respondedCount / reviews.length : 0;

  const meets = (t) => rating >= t.minRating && verifiedReviewCount >= t.minReviews && responseRate >= t.minResponseRate;

  if (meets(TIER_THRESHOLDS.elite)) return "elite";
  if (meets(TIER_THRESHOLDS.trusted)) return "trusted";
  if (meets(TIER_THRESHOLDS.rising)) return "rising";
  return null;
}

// ---- Shared visual primitives ----

// Neutral person silhouette — shown until a reviewer uploads a real photo.
const PersonPlaceholder = ({ size }) => (
  <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" stroke={T.textFaint} strokeWidth="1.5" />
    <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" stroke={T.textFaint} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Neutral storefront silhouette — shown until a restaurant uploads a real logo.
const StorefrontPlaceholder = ({ size }) => (
  <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none">
    <path d="M4 9.5 5 4h14l1 5.5" stroke={T.textFaint} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M3 9.5c0 1.5 1.2 2.5 2.5 2.5S8 11 8 9.5 9.2 12 10.5 12 13 11 13 9.5 14.2 12 15.5 12 18 11 18 9.5s1.2 2.5 2.5 2.5S23 11 21 9.5" stroke={T.textFaint} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 12v8h14v-8" stroke={T.textFaint} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M10 20v-5h4v5" stroke={T.textFaint} strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

const ReviewerAvatar = ({ photoUrl = null, size = 80, ringColor = null, gradKey = null, initial = null }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    background: gradKey ? gradientCss(gradKey) : T.surfaceRaised,
    flexShrink: 0, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center",
    border: gradKey ? "none" : `1px solid ${ringColor || T.borderStrong}`, overflow: "hidden",
    boxShadow: gradKey ? `0 4px 14px ${(GRADIENTS[gradKey] || GRADIENTS.purple)[0]}40` : "none",
  }}>
    {photoUrl ? (
      <img src={photoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    ) : initial ? (
      <span style={{ color: "#fff", fontWeight: 700, fontSize: size * 0.4, textShadow: "0 1px 3px rgba(0,0,0,0.25)" }}>{initial}</span>
    ) : (
      <PersonPlaceholder size={size} />
    )}
  </div>
);

// Taste fingerprint — a radar shape unique to each reviewer, drawn in their signature colors.
// Two people's taste profiles produce visibly different shapes; this is the reviewer's visual identity.
const TastePrint = ({ dimensions, color, colorSecondary, size = 200 }) => {
  const n = dimensions.length;
  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.36;
  const angleAt = (i) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const pointAt = (i, frac) => {
    const a = angleAt(i);
    return [cx + R * frac * Math.cos(a), cy + R * frac * Math.sin(a)];
  };
  const valuePts = dimensions.map((d, i) => pointAt(i, Math.max(0.04, d.value / 100)));
  const polyStr = valuePts.map(p => p.join(",")).join(" ");
  const rings = [0.25, 0.5, 0.75, 1.0];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      {/* grid rings */}
      {rings.map((ring, ri) => (
        <polygon
          key={ri}
          points={dimensions.map((_, i) => pointAt(i, ring).join(",")).join(" ")}
          fill="none"
          stroke={T.border}
          strokeWidth="1"
        />
      ))}
      {/* axes */}
      {dimensions.map((_, i) => {
        const [x, y] = pointAt(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={T.borderStrong} strokeWidth="0.75" opacity="0.5" />;
      })}
      {/* value shape */}
      <polygon points={polyStr} fill={color} fillOpacity="0.32" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      {/* vertices */}
      {valuePts.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="3.2" fill={colorSecondary} />
          <circle cx={x} cy={y} r="1.3" fill="#FFFFFF" opacity="0.85" />
        </g>
      ))}
      {/* axis labels — only on larger prints, not thumbnails */}
      {size >= 120 && dimensions.map((d, i) => {
        const [x, y] = pointAt(i, 1.18);
        return (
          <text
            key={i}
            x={x}
            y={y}
            fill={T.textFaint}
            fontSize="8"
            fontWeight="600"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ letterSpacing: "0.04em", textTransform: "uppercase" }}
          >
            {d.label.split(" ")[0]}
          </text>
        );
      })}
    </svg>
  );
};

const RestaurantLogo = ({ photoUrl = null, size = 50, ringColor = null, gradKey = null, initial = null }) => (
  <div style={{
    width: size, height: size, borderRadius: size * 0.24,
    background: gradKey ? gradientCss(gradKey) : T.surfaceRaised,
    flexShrink: 0, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center",
    border: gradKey ? "none" : `1px solid ${ringColor || T.border}`, overflow: "hidden",
    boxShadow: gradKey ? `0 4px 14px ${(GRADIENTS[gradKey] || GRADIENTS.purple)[0]}40` : "none",
  }}>
    {photoUrl ? (
      <img src={photoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    ) : initial ? (
      <span style={{ color: "#fff", fontWeight: 700, fontSize: size * 0.4, textShadow: "0 1px 3px rgba(0,0,0,0.25)" }}>{initial}</span>
    ) : (
      <StorefrontPlaceholder size={size} />
    )}
  </div>
);

// Uniform badge — identical color for every restaurant in a tier, by design.
const PrestigeBadge = ({ tier, size = "md", justEarned = false }) => {
  if (!tier || !PRESTIGE_TIERS[tier]) return null;
  const info = PRESTIGE_TIERS[tier];
  const isSmall = size === "sm";
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: isSmall ? 4 : 6,
      background: "transparent", border: `1px solid ${info.color}80`,
      borderRadius: 3, padding: isSmall ? "3px 8px" : "5px 12px",
      boxShadow: justEarned ? `0 0 16px ${info.glow}` : "none",
    }}>
      <div style={{ width: isSmall ? 5 : 6, height: isSmall ? 5 : 6, borderRadius: "50%", background: info.color }} />
      <span style={{
        fontSize: isSmall ? 9 : 10, fontWeight: 600, color: info.color,
        letterSpacing: "0.12em", textTransform: "uppercase",
      }}>
        {info.label}
      </span>
    </div>
  );
};

// ---- Verification flow ----

const VERIFY_STEPS = {
  PICK_METHOD: "pick_method",
  RECEIPT_CAPTURE: "receipt_capture",
  PROCESSING: "processing",
  VERIFIED: "verified",
  REVIEW_FORM: "review_form",
};

function VerifyVisitFlow({ restaurant, onComplete, onClose }) {
  const [step, setStep] = useState(VERIFY_STEPS.PICK_METHOD);
  const [method, setMethod] = useState(null);
  const [receiptFileName, setReceiptFileName] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewPhotoUrl, setReviewPhotoUrl] = useState(null);
  const fileInputRef = useRef(null);
  const reviewPhotoInputRef = useRef(null);

  const startProcessing = (chosenMethod) => {
    setMethod(chosenMethod);
    setStep(VERIFY_STEPS.PROCESSING);
    // Simulated verification check — in production this hits OCR / geolocation / QR validation services.
    setTimeout(() => {
      setStep(VERIFY_STEPS.VERIFIED);
    }, 1700);
  };

  const handleReceiptPick = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFileName(file.name);
      startProcessing("receipt");
    }
  };

  const handleCheckIn = () => startProcessing("checkin");
  const handleQrScan = () => startProcessing("qr");

  const handleReviewPhotoPick = (e) => {
    const file = e.target.files?.[0];
    if (file) setReviewPhotoUrl(URL.createObjectURL(file));
  };

  const handleSubmitReview = () => {
    onComplete({ rating, text: reviewText, method, photoUrl: reviewPhotoUrl });
  };

  const methodCopy = {
    receipt: { processing: "Reading receipt…", detail: receiptFileName || "receipt.jpg", verified: "Merchant and date matched." },
    checkin: { processing: "Confirming location…", detail: `Matching GPS to ${restaurant.name}`, verified: "Location matched in real time." },
    qr: { processing: "Validating code…", detail: `Table code for ${restaurant.name}`, verified: "Table code matched — strongest verification available." },
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)",
      display: "flex", alignItems: "flex-end", zIndex: 100,
    }}>
      <div style={{
        width: "100%", background: T.surface, borderTopLeftRadius: 16, borderTopRightRadius: 16,
        border: `1px solid ${T.border}`, borderBottom: "none", padding: "20px 22px 28px",
        maxHeight: "85vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ fontSize: 11, color: T.textFaint, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>
            Verify your visit
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.textFaint, fontSize: 18, cursor: "pointer", padding: 4 }}>✕</button>
        </div>

        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4, color: T.text }}>{restaurant.name}</div>
        <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 22 }}>{restaurant.cuisine}</div>

        {step === VERIFY_STEPS.PICK_METHOD && (
          <div>
            <div style={{ fontSize: 13, color: T.textMuted, marginBottom: 16, lineHeight: 1.6 }}>
              Reviews only count when we can confirm you were actually here. Pick how you'd like to verify this visit.
            </div>

            <button
              onClick={handleQrScan}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 14, padding: 16,
                background: T.surfaceRaised, border: `1px solid ${T.accent}50`, borderRadius: 10,
                marginBottom: 10, cursor: "pointer", textAlign: "left",
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 8, background: T.accentDim, border: `1px solid ${T.accent}40`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0,
              }}>▣</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2, color: T.text, display: "flex", alignItems: "center", gap: 8 }}>
                  Scan table code
                  <span style={{ fontSize: 8, color: T.accent, border: `1px solid ${T.accent}60`, borderRadius: 3, padding: "1px 5px", letterSpacing: "0.06em", fontWeight: 700 }}>STRONGEST</span>
                </div>
                <div style={{ fontSize: 11, color: T.textMuted }}>Scan the code at your table or on your receipt</div>
              </div>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 14, padding: 16,
                background: T.surfaceRaised, border: `1px solid ${T.border}`, borderRadius: 10,
                marginBottom: 10, cursor: "pointer", textAlign: "left",
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 8, background: T.surface, border: `1px solid ${T.border}`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0,
              }}>🧾</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2, color: T.text }}>Upload receipt</div>
                <div style={{ fontSize: 11, color: T.textMuted }}>We match the merchant name and date</div>
              </div>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleReceiptPick} style={{ display: "none" }} />

            <button
              onClick={handleCheckIn}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 14, padding: 16,
                background: T.surfaceRaised, border: `1px solid ${T.border}`, borderRadius: 10,
                cursor: "pointer", textAlign: "left",
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 8, background: T.surface, border: `1px solid ${T.border}`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0,
              }}>📍</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2, color: T.text }}>Check in now</div>
                <div style={{ fontSize: 11, color: T.textMuted }}>We confirm your location matches this restaurant</div>
              </div>
            </button>

            <div style={{
              marginTop: 16, fontSize: 11, color: T.textFaint, lineHeight: 1.6,
              padding: "12px 14px", background: T.surfaceRaised, borderRadius: 8, border: `1px solid ${T.border}`,
            }}>
              Receipt photos are matched and discarded — we don't store images or payment details, only the verification result.
            </div>
          </div>
        )}

        {step === VERIFY_STEPS.PROCESSING && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "30px 0" }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              border: `2px solid ${T.border}`, borderTopColor: T.accent,
              animation: "spin 0.9s linear infinite", marginBottom: 20,
            }} />
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: T.text }}>
              {methodCopy[method]?.processing}
            </div>
            <div style={{ fontSize: 12, color: T.textMuted }}>
              {methodCopy[method]?.detail}
            </div>
          </div>
        )}

        {step === VERIFY_STEPS.VERIFIED && (
          <div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 0 26px" }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%", background: "transparent",
                border: `1px solid ${T.success}`, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, marginBottom: 16, color: T.success,
              }}>✓</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.success, marginBottom: 4 }}>Visit verified</div>
              <div style={{ fontSize: 12, color: T.textMuted, textAlign: "center" }}>
                {methodCopy[method]?.verified}
              </div>
            </div>
            <button
              onClick={() => setStep(VERIFY_STEPS.REVIEW_FORM)}
              style={{
                width: "100%", padding: 14, borderRadius: 8, border: "none",
                background: T.accent, color: "#fff", fontSize: 13, fontWeight: 700,
                cursor: "pointer", letterSpacing: "0.02em",
              }}
            >
              Write your review
            </button>
          </div>
        )}

        {step === VERIFY_STEPS.REVIEW_FORM && (
          <div>
            <div style={{
              display: "inline-block", background: "transparent", color: T.success, fontSize: 10, fontWeight: 700,
              padding: "4px 10px", borderRadius: 3, marginBottom: 16, border: `1px solid ${T.success}60`,
              letterSpacing: "0.08em", textTransform: "uppercase",
            }}>
              ✓ Verified visit
            </div>

            <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 8 }}>Your rating</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => setRating(n)}
                  style={{
                    width: 36, height: 36, borderRadius: 6, cursor: "pointer",
                    border: `1px solid ${n <= rating ? T.accent : T.border}`,
                    background: n <= rating ? T.accentDim : "transparent",
                    color: n <= rating ? T.accent : T.textFaint,
                    fontSize: 15, fontWeight: 700,
                  }}
                >★</button>
              ))}
            </div>

            <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 8 }}>Your review</div>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="What stood out about this visit?"
              rows={4}
              style={{
                width: "100%", background: T.surfaceRaised, border: `1px solid ${T.border}`, borderRadius: 8,
                padding: 12, color: T.text, fontSize: 13, fontFamily: "inherit", resize: "none",
                marginBottom: 18, boxSizing: "border-box",
              }}
            />

            <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 8 }}>Add a photo (optional)</div>
            {reviewPhotoUrl ? (
              <div style={{ position: "relative", marginBottom: 18 }}>
                <img
                  src={reviewPhotoUrl}
                  alt="Review attachment"
                  style={{ width: "100%", maxHeight: 180, objectFit: "cover", borderRadius: 8, display: "block" }}
                />
                <button
                  onClick={() => setReviewPhotoUrl(null)}
                  style={{
                    position: "absolute", top: 8, right: 8, width: 24, height: 24, borderRadius: "50%",
                    background: "rgba(0,0,0,0.7)", border: `1px solid ${T.border}`, color: T.text, fontSize: 12,
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >✕</button>
              </div>
            ) : (
              <button
                onClick={() => reviewPhotoInputRef.current?.click()}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: 14, background: T.surfaceRaised, border: `1px dashed ${T.borderStrong}`, borderRadius: 8,
                  color: T.textMuted, fontSize: 12, fontWeight: 600, cursor: "pointer", marginBottom: 18,
                }}
              >
                📷 Add a photo of your dish or experience
              </button>
            )}
            <input ref={reviewPhotoInputRef} type="file" accept="image/*" onChange={handleReviewPhotoPick} style={{ display: "none" }} />

            <button
              onClick={handleSubmitReview}
              disabled={!reviewText.trim()}
              style={{
                width: "100%", padding: 14, borderRadius: 8, border: "none",
                background: reviewText.trim() ? T.accent : T.surfaceRaised,
                color: reviewText.trim() ? "#fff" : T.textFaint, fontSize: 13, fontWeight: 700,
                cursor: reviewText.trim() ? "pointer" : "not-allowed", letterSpacing: "0.02em",
              }}
            >
              Post verified review
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Business dashboard ----

function BusinessDashboard({ restaurants, getReviewer, onRespond, onLogoUpload, onToneChange }) {
  const [selectedId, setSelectedId] = useState(restaurants[0]?.id ?? null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [draftText, setDraftText] = useState("");

  const restaurant = restaurants.find(r => r.id === selectedId);
  if (!restaurant) return null;

  const needsAttention = restaurant.reviews.filter(r => r.status === "needs_attention");
  const handled = restaurant.reviews.filter(r => r.status !== "needs_attention");

  const startEdit = (index, suggested) => {
    setEditingIndex(index);
    setDraftText(suggested);
  };

  const send = (index) => {
    onRespond(restaurant.id, index, draftText);
    setEditingIndex(null);
    setDraftText("");
  };

  const tier = calculatePrestigeTier(restaurant);
  const tierInfo = tier ? PRESTIGE_TIERS[tier] : null;

  let nextTierHint = null;
  if (tier !== "elite") {
    if (needsAttention.length > 0) {
      nextTierHint = `Resolve ${needsAttention.length} pending review${needsAttention.length > 1 ? "s" : ""} to improve your standing toward the next tier.`;
    } else if (restaurant.rating < 4.8) {
      nextTierHint = "Higher Verified Scores unlock the next tier.";
    } else if (restaurant.verifiedReviewCount < 60) {
      nextTierHint = "More verified visits unlock the next tier.";
    }
  }

  return (
    <div style={{ padding: "20px 24px 0" }}>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 20, paddingBottom: 4 }}>
        {restaurants.map(r => (
          <button
            key={r.id}
            onClick={() => setSelectedId(r.id)}
            style={{
              padding: "8px 14px", borderRadius: 6, whiteSpace: "nowrap",
              border: `1px solid ${selectedId === r.id ? T.accent : T.border}`,
              background: selectedId === r.id ? T.surfaceRaised : "transparent",
              color: selectedId === r.id ? T.text : T.textMuted, fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}
          >
            {r.name}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
        <label style={{ position: "relative", cursor: "pointer", flexShrink: 0 }}>
          <RestaurantLogo photoUrl={restaurant.logoUrl} size={56} ringColor={tierInfo ? tierInfo.color : null} />
          <div style={{
            position: "absolute", bottom: -2, right: -2, width: 20, height: 20, borderRadius: "50%",
            background: T.accent, border: `2px solid ${T.bg}`, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 9,
          }}>📷</div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onLogoUpload(restaurant.id, e.target.files?.[0])}
            style={{ display: "none" }}
          />
        </label>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.text }}>{restaurant.name}</div>
          <div style={{ fontSize: 11, color: T.textFaint }}>{restaurant.logoUrl ? "Tap to change logo" : "Tap to add your logo"}</div>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 10, color: T.textFaint, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 8 }}>
          AI Reply Voice
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {Object.entries(REPLY_TONES).map(([key, info]) => (
            <button
              key={key}
              onClick={() => onToneChange(restaurant.id, key)}
              style={{
                flex: 1, padding: "10px 8px", borderRadius: 8, cursor: "pointer", textAlign: "center",
                border: `1px solid ${restaurant.tone === key ? T.accent : T.border}`,
                background: restaurant.tone === key ? T.accentDim : T.surface,
                color: restaurant.tone === key ? T.accent : T.textMuted,
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700 }}>{info.label}</div>
            </button>
          ))}
        </div>
        <div style={{ fontSize: 10, color: T.textFaint, marginTop: 6, lineHeight: 1.5 }}>
          {REPLY_TONES[restaurant.tone]?.description} · changes apply to new replies going forward
        </div>
      </div>

      <div style={{
        background: T.surface, border: `1px solid ${tierInfo ? tierInfo.color + "50" : T.border}`,
        borderRadius: 10, padding: 16, marginBottom: 14,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: tier ? 8 : 0 }}>
          <div style={{ fontSize: 10, color: T.textFaint, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
            Prestige Status
          </div>
          {tier ? <PrestigeBadge tier={tier} /> : (
            <span style={{ fontSize: 11, color: T.textFaint, fontWeight: 600 }}>Unranked</span>
          )}
        </div>
        {nextTierHint && (
          <div style={{ fontSize: 11, color: T.textMuted, lineHeight: 1.5 }}>{nextTierHint}</div>
        )}
        {!nextTierHint && tier === "elite" && (
          <div style={{ fontSize: 11, color: T.accent, lineHeight: 1.5 }}>Top tier reached — recognized for quality, volume, and responsiveness.</div>
        )}
        <div style={{ fontSize: 9, color: T.textFaint, marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T.border}`, lineHeight: 1.5 }}>
          Tier criteria are still early and may be refined as more restaurants join.
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 22 }}>
        <div style={{ flex: 1, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 19, fontWeight: 700, color: needsAttention.length > 0 ? T.danger : T.success }}>{needsAttention.length}</div>
          <div style={{ fontSize: 10, color: T.textFaint, textTransform: "uppercase", letterSpacing: "0.06em" }}>Need your attention</div>
        </div>
        <div style={{ flex: 1, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 19, fontWeight: 700, color: T.text }}>{handled.length}</div>
          <div style={{ fontSize: 10, color: T.textFaint, textTransform: "uppercase", letterSpacing: "0.06em" }}>Auto-handled by AI</div>
        </div>
      </div>

      {needsAttention.length > 0 && (
        <>
          <div style={{ fontSize: 10, color: T.danger, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>
            Needs Your Attention
          </div>
          {restaurant.reviews.map((rev, i) => {
            if (rev.status !== "needs_attention") return null;
            const reviewer = getReviewer(rev.reviewerId);
            return (
              <div key={i} style={{
                background: T.surface, border: `1px solid ${T.danger}40`, borderRadius: 10, padding: 16, marginBottom: 12,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <ReviewerAvatar photoUrl={reviewer.photoUrl} size={26} gradKey={reviewer.photoUrl ? null : reviewer.gradKey} initial={reviewer.photoUrl ? null : reviewer.name[0]} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{reviewer.name}</span>
                  <span style={{ fontSize: 9, color: T.danger, marginLeft: "auto", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>
                    {rev.escalationReason}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.5, marginBottom: 12 }}>{rev.snippet}</div>

                {editingIndex === i ? (
                  <div>
                    <textarea
                      value={draftText}
                      onChange={(e) => setDraftText(e.target.value)}
                      rows={3}
                      style={{
                        width: "100%", background: T.surfaceRaised, border: `1px solid ${T.border}`, borderRadius: 8,
                        padding: 10, color: T.text, fontSize: 12, fontFamily: "inherit", resize: "none",
                        marginBottom: 10, boxSizing: "border-box",
                      }}
                    />
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => send(i)}
                        style={{ flex: 1, padding: 10, borderRadius: 6, border: "none", background: T.accent, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                      >
                        Send response
                      </button>
                      <button
                        onClick={() => setEditingIndex(null)}
                        style={{ padding: "10px 14px", borderRadius: 6, border: `1px solid ${T.border}`, background: "transparent", color: T.textMuted, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 10, color: T.textFaint, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>AI-suggested reply</div>
                    <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.5, marginBottom: 12, fontStyle: "italic" }}>{rev.suggestedReply?.text}</div>
                    <button
                      onClick={() => startEdit(i, rev.suggestedReply?.text || "")}
                      style={{ width: "100%", padding: 11, borderRadius: 6, border: `1px solid ${T.accent}80`, background: "transparent", color: T.accent, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                    >
                      Review & respond
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}

      <div style={{ fontSize: 10, color: T.textFaint, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, marginBottom: 12, marginTop: needsAttention.length > 0 ? 22 : 0 }}>
        Auto-Handled By AI
      </div>
      {handled.length === 0 && (
        <div style={{ fontSize: 12, color: T.textFaint, padding: 14 }}>No reviews yet.</div>
      )}
      {restaurant.reviews.map((rev, i) => {
        if (rev.status === "needs_attention") return null;
        const reviewer = getReviewer(rev.reviewerId);
        const replyText = rev.status === "owner_replied" ? rev.ownerReply : rev.aiReply?.text;
        const reasoning = rev.status === "owner_replied" ? "You responded directly" : rev.aiReply?.reasoning;
        return (
          <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 16, marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <ReviewerAvatar photoUrl={reviewer.photoUrl} size={24} gradKey={reviewer.photoUrl ? null : reviewer.gradKey} initial={reviewer.photoUrl ? null : reviewer.name[0]} />
              <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{reviewer.name}</span>
              <span style={{ fontSize: 11, color: T.accent, marginLeft: "auto" }}>{"★".repeat(rev.rating)}</span>
            </div>
            <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.5, marginBottom: 10 }}>{rev.snippet}</div>
            <div style={{ padding: 10, background: T.surfaceRaised, borderRadius: 8, borderLeft: `2px solid ${T.success}` }}>
              <div style={{ fontSize: 9, color: T.success, fontWeight: 600, marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {rev.status === "owner_replied" ? "Your reply" : "AI auto-reply"}
              </div>
              <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.5, marginBottom: 4 }}>{replyText}</div>
              {reasoning && <div style={{ fontSize: 10, color: T.textFaint, fontStyle: "italic" }}>{reasoning}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---- Restaurant sign-up / lead capture ----

const PLAN_FEATURES = {
  free: [
    "Claimed, verified business profile",
    "Verified-visit reviews only",
    "Basic AI auto-replies on positive reviews",
    "Eligible for Recognized tier status",
  ],
  paid: [
    "Everything in Free",
    "Full AI auto-reply on every review, tuned to tone",
    "Escalation routing for flagged reviews, with editable AI-drafted responses",
    "Eligible for Select & Elite prestige tiers",
    "Printed QR table cards shipped to your restaurant",
    "Verified-reviewer insights dashboard",
  ],
};

function RestaurantSignup({ onComplete }) {
  const [step, setStep] = useState("form"); // form | confirmed
  const [form, setForm] = useState({ restaurantName: "", contactName: "", email: "", phone: "", city: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const update = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const isValid = form.restaurantName.trim() && form.contactName.trim() && form.email.trim();

  const handleSubmit = async () => {
    if (!isValid) return;
    setSaving(true);
    setError(null);
    try {
      const lead = {
        ...form,
        plan: "trial", // no financial decision at signup — everyone starts on a free trial
        submittedAt: new Date().toISOString(),
      };
      const key = `lead:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
      localStorage.setItem(key, JSON.stringify(lead));
      setStep("confirmed");
    } catch (e) {
      setError("Couldn't save right now — your info wasn't lost, just try submitting again.");
    } finally {
      setSaving(false);
    }
  };

  if (step === "confirmed") {
    return (
      <div style={{ padding: "20px 24px 0" }}>
        <div style={{
          background: T.surface, border: `1px solid ${T.success}50`, borderRadius: 12,
          padding: 28, textAlign: "center",
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%", border: `1px solid ${T.success}`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
            color: T.success, margin: "0 auto 16px",
          }}>✓</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: T.text, marginBottom: 6 }}>You're on the list</div>
          <div style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.6, marginBottom: 4 }}>
            {form.restaurantName} is starting a free 2-week trial — no card, no commitment.
          </div>
          <div style={{ fontSize: 12, color: T.textFaint, lineHeight: 1.6 }}>
            We'll follow up at {form.email} to get your QR table cards out and your profile live.
          </div>
        </div>
        <button
          onClick={() => { setStep("form"); setForm({ restaurantName: "", contactName: "", email: "", phone: "", city: "" }); }}
          style={{
            width: "100%", marginTop: 14, padding: 13, borderRadius: 8, border: `1px solid ${T.border}`,
            background: "transparent", color: T.textMuted, fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}
        >
          Sign up another restaurant
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px 24px 0" }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 4 }}>Try Dined In free for 2 weeks</div>
        <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.5 }}>
          QR table cards, verified reviews, and AI auto-replies — no cost, no card, no commitment to start.
        </div>
      </div>

      <div style={{
        background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 16, marginBottom: 20,
      }}>
        <div style={{ fontSize: 10, color: T.textFaint, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 10 }}>
          Included in your free trial
        </div>
        {PLAN_FEATURES.free.map((f, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
            <span style={{ color: T.accent, fontSize: 11, marginTop: 2 }}>✓</span>
            <span style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.5 }}>{f}</span>
          </div>
        ))}
        <div style={{ fontSize: 10, color: T.textFaint, marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T.border}`, lineHeight: 1.6 }}>
          Like what you see after the trial? Full escalation handling, Select/Elite eligibility, and printed table cards become available as a paid upgrade — no pressure either way.
        </div>
      </div>

      {/* Form fields */}
      {[
        { key: "restaurantName", label: "Restaurant name", placeholder: "e.g. The Olive Counter" },
        { key: "contactName", label: "Your name", placeholder: "e.g. Maria Chen" },
        { key: "email", label: "Email", placeholder: "you@restaurant.com" },
        { key: "phone", label: "Phone (optional)", placeholder: "(303) 555-0100" },
        { key: "city", label: "City", placeholder: "e.g. Denver, CO" },
      ].map(field => (
        <div key={field.key} style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 6 }}>{field.label}</div>
          <input
            value={form[field.key]}
            onChange={update(field.key)}
            placeholder={field.placeholder}
            style={{
              width: "100%", background: T.surfaceRaised, border: `1px solid ${T.border}`, borderRadius: 8,
              padding: 12, color: T.text, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box",
            }}
          />
        </div>
      ))}

      {error && (
        <div style={{ fontSize: 12, color: T.danger, marginBottom: 12 }}>{error}</div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!isValid || saving}
        style={{
          width: "100%", padding: 14, borderRadius: 8, border: "none", marginTop: 4,
          background: isValid && !saving ? T.accent : T.surfaceRaised,
          color: isValid && !saving ? "#fff" : T.textFaint,
          fontSize: 13, fontWeight: 700, cursor: isValid && !saving ? "pointer" : "not-allowed",
        }}
      >
        {saving ? "Saving…" : "Start free trial"}
      </button>
    </div>
  );
}

// ---- Signup list (for reviewing leads you've collected) ----

function loadLeadsFromStorage() {
  try {
    const keys = Object.keys(localStorage).filter(k => k.startsWith("lead:"));
    const loaded = [];
    for (const key of keys) {
      try {
        const raw = localStorage.getItem(key);
        if (raw) loaded.push(JSON.parse(raw));
      } catch {
        // skip unreadable entries rather than failing the whole list
      }
    }
    loaded.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    return loaded;
  } catch (e) {
    return null;
  }
}

function SignupList() {
  const [leads, setLeads] = useState(() => loadLeadsFromStorage());
  const error = leads === null;

  const refresh = () => setLeads(loadLeadsFromStorage());

  const list = leads || [];

  return (
    <div style={{ padding: "20px 24px 0" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: T.text }}>Signups</div>
        <button
          onClick={refresh}
          style={{ background: "none", border: "none", color: T.accent, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
        >
          Refresh
        </button>
      </div>

      {error && <div style={{ fontSize: 12, color: T.danger, marginBottom: 12 }}>Couldn't load signups right now.</div>}

      {list.length === 0 ? (
        <div style={{ fontSize: 13, color: T.textFaint, padding: "20px 0" }}>No signups yet.</div>
      ) : (
        list.map((lead, i) => (
          <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 16, marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{lead.restaurantName}</span>
              <span style={{
                fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                color: lead.plan === "paid" ? T.accent : T.textMuted,
                border: `1px solid ${lead.plan === "paid" ? T.accent : T.border}`,
                borderRadius: 3, padding: "2px 7px",
              }}>
                {lead.plan === "trial" ? "Free trial" : lead.plan}
              </span>
            </div>
            <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 2 }}>{lead.contactName} · {lead.email}</div>
            {lead.phone && <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 2 }}>{lead.phone}</div>}
            {lead.city && <div style={{ fontSize: 12, color: T.textFaint }}>{lead.city}</div>}
            <div style={{ fontSize: 10, color: T.textFaint, marginTop: 8 }}>
              {new Date(lead.submittedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ---- Main app ----

export default function DinedIn() {
  const [view, setView] = useState("restaurants");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedReviewer, setSelectedReviewer] = useState(null);
  const [showTrustBreakdown, setShowTrustBreakdown] = useState(false);
  const [followedReviewers, setFollowedReviewers] = useState([]);
  const toggleFollow = (id) => setFollowedReviewers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const [restaurants, setRestaurants] = useState(initialRestaurants);
  const [verifyTarget, setVerifyTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [myPhotoUrl, setMyPhotoUrl] = useState(null);
  const [signupSubview, setSignupSubview] = useState("signup");
  const [restaurantQuery, setRestaurantQuery] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("All");

  const getReviewer = (id) => {
    const reviewer = reviewers.find(r => r.id === id);
    if (!reviewer) return reviewer;
    return id === 4 ? { ...reviewer, photoUrl: myPhotoUrl } : reviewer;
  };

  const handleProfilePhotoUpload = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setMyPhotoUrl(url);
    setSelectedReviewer(prev => prev && prev.id === 4 ? { ...prev, photoUrl: url } : prev);
    showToast("Profile photo updated");
  };

  const handleLogoUpload = (restaurantId, file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setRestaurants(prev => prev.map(r => r.id === restaurantId ? { ...r, logoUrl: url } : r));
    setSelectedRestaurant(prev => prev && prev.id === restaurantId ? { ...prev, logoUrl: url } : prev);
    showToast("Logo updated");
  };

  const handleToneChange = (restaurantId, tone) => {
    setRestaurants(prev => prev.map(r => r.id === restaurantId ? { ...r, tone } : r));
    showToast(`Reply voice set to ${REPLY_TONES[tone]?.label || tone}`);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  const handleVerifyComplete = ({ rating, text, photoUrl }) => {
    const restaurantId = verifyTarget.id;
    const newReview = { reviewerId: 4, snippet: text, visitVerified: true, rating, status: "pending", photoUrl: photoUrl || null };
    const severity = classifySeverity(newReview);
    if (severity.escalate) {
      newReview.status = "needs_attention";
      newReview.escalationReason = severity.reason;
      newReview.suggestedReply = generateEscalatedDraft(newReview, verifyTarget.name, verifyTarget.tone);
    } else {
      newReview.status = "auto_replied";
      newReview.aiReply = generateAutoReply(newReview, verifyTarget.name, verifyTarget.tone);
    }

    setRestaurants(prev => prev.map(r => {
      if (r.id !== restaurantId) return r;
      const newCount = r.verifiedReviewCount + 1;
      const newRating = Math.round(((r.rating * r.verifiedReviewCount) + rating) / newCount * 10) / 10;
      return { ...r, reviews: [newReview, ...r.reviews], verifiedReviewCount: newCount, rating: newRating };
    }));

    const you = getReviewer(4);
    you.verifiedVisits += 1;

    setSelectedRestaurant(prev => prev && prev.id === restaurantId
      ? { ...prev, reviews: [newReview, ...prev.reviews] }
      : prev
    );

    setVerifyTarget(null);
    showToast(newReview.status === "needs_attention"
      ? "Review posted — flagged for the restaurant's attention"
      : "Review posted — verified visit added to your profile"
    );
  };

  const handleOwnerRespond = (restaurantId, reviewIndex, replyText) => {
    setRestaurants(prev => prev.map(r => {
      if (r.id !== restaurantId) return r;
      const updatedReviews = [...r.reviews];
      updatedReviews[reviewIndex] = { ...updatedReviews[reviewIndex], status: "owner_replied", ownerReply: replyText };
      return { ...r, reviews: updatedReviews };
    }));
    showToast("Response sent to reviewer");
  };

  return (
    <div style={{
      minHeight: "100vh", background: T.bg, fontFamily: "'Inter', 'SF Pro Display', sans-serif",
      color: T.text, paddingBottom: 60, position: "relative",
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${T.bg}; }
        ::-webkit-scrollbar-thumb { background: ${T.borderStrong}; border-radius: 2px; }
      `}</style>

      {/* Header */}
      <div style={{ padding: "28px 24px 18px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 14, textDecoration: "none", cursor: "pointer" }}>
          <svg width="30" height="30" viewBox="0 0 34 34" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="17" cy="17" r="15" stroke={T.accent} strokeWidth="1.2" />
            <circle cx="17" cy="17" r="9.5" stroke={T.accent} strokeWidth="0.7" opacity="0.35" />
            <path d="M12.5 17.2 L15.8 20.5 L21.8 13" stroke={T.accent} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em", color: T.text }}>DINED IN</div>
            <div style={{ fontSize: 9, color: T.textFaint, letterSpacing: "0.16em", textTransform: "uppercase" }}>Every Review. Actually Verified.</div>
          </div>
        </a>
        <a href="/" style={{
          display: "inline-flex", alignItems: "center", gap: 5, textDecoration: "none", flexShrink: 0,
          color: T.textMuted, fontSize: 12, fontWeight: 600, padding: "7px 12px",
          border: `1px solid ${T.border}`, borderRadius: 8,
        }}>
          ← Home
        </a>
      </div>

      {/* Demo preview banner */}
      <div style={{
        padding: "8px 24px", background: T.accentDim, borderBottom: `1px solid ${T.border}`,
        textAlign: "center",
      }}>
        <span style={{ fontSize: 10, color: T.accent, letterSpacing: "0.04em", fontWeight: 600 }}>
          SAMPLE DATA · PRODUCT PREVIEW
        </span>
        <span style={{ fontSize: 10, color: T.textMuted, marginLeft: 8 }}>
          Restaurants and reviews shown are illustrative examples.
        </span>
      </div>

      {/* Toggle */}
      <div style={{ display: "flex", padding: "16px 24px 0", gap: 6, overflowX: "auto" }}>
        {["restaurants", "reviewers", "business", "get started"].map(v => (
          <button
            key={v}
            onClick={() => { setView(v); setSelectedRestaurant(null); setSelectedReviewer(null); }}
            style={{
              flex: "1 0 auto", padding: "10px 12px", borderRadius: 6, whiteSpace: "nowrap",
              border: `1px solid ${view === v ? T.accent : T.border}`,
              background: view === v ? T.surfaceRaised : "transparent",
              color: view === v ? T.text : T.textMuted,
              fontSize: 10.5, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer",
            }}
          >
            {v}
          </button>
        ))}
      </div>

      {/* RESTAURANTS VIEW */}
      {view === "restaurants" && !selectedRestaurant && (
        <div style={{ padding: "16px 24px 0" }}>
          {/* Search bar */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10, background: T.surface,
            border: `1px solid ${T.borderStrong}`, borderRadius: 14, padding: "12px 16px", marginBottom: 14,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="7" stroke={T.purple} strokeWidth="2" />
              <path d="M20 20l-3.5-3.5" stroke={T.purple} strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              value={restaurantQuery}
              onChange={(e) => setRestaurantQuery(e.target.value)}
              placeholder="Search restaurants, cuisines, cities..."
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                color: T.text, fontSize: 13, fontFamily: "inherit",
              }}
            />
            {restaurantQuery && (
              <button onClick={() => setRestaurantQuery("")} style={{ background: "none", border: "none", color: T.textFaint, cursor: "pointer", fontSize: 16, lineHeight: 1 }}>×</button>
            )}
          </div>

          {/* Filter chips */}
          <div style={{ display: "flex", gap: 8, marginBottom: 18, overflowX: "auto", paddingBottom: 2 }}>
            {["All", "Top Rated", "Mediterranean", "Japanese", "Asian Fusion"].map((chip, i) => {
              const active = cuisineFilter === chip;
              const chipColors = [T.purple, T.pink, T.amber, T.blue, T.teal];
              const cc = chipColors[i % chipColors.length];
              return (
                <button
                  key={chip}
                  onClick={() => setCuisineFilter(chip)}
                  style={{
                    flexShrink: 0, padding: "7px 14px", borderRadius: 20, cursor: "pointer",
                    border: `1px solid ${cc}`, whiteSpace: "nowrap",
                    background: active ? cc : "transparent",
                    color: active ? "#fff" : cc,
                    fontSize: 11, fontWeight: 700, letterSpacing: "0.02em",
                  }}
                >
                  {chip}
                </button>
              );
            })}
          </div>

          {/* Restaurant cards */}
          {(() => {
            const q = restaurantQuery.trim().toLowerCase();
            const filtered = restaurants.filter(r => {
              const matchesQuery = !q || r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q);
              const matchesChip =
                cuisineFilter === "All" ? true :
                cuisineFilter === "Top Rated" ? r.rating >= 4.7 :
                r.cuisine.toLowerCase().includes(cuisineFilter.toLowerCase());
              return matchesQuery && matchesChip;
            });
            if (filtered.length === 0) {
              return (
                <div style={{ padding: "40px 0", textAlign: "center", color: T.textFaint, fontSize: 13 }}>
                  No restaurants match "{restaurantQuery || cuisineFilter}".
                </div>
              );
            }
            return filtered.map(r => {
              const tier = calculatePrestigeTier(r);
              const grad = GRADIENTS[r.gradKey] || GRADIENTS.purple;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedRestaurant(r)}
                  style={{
                    width: "100%", background: T.surface, position: "relative", overflow: "hidden",
                    border: `1px solid ${T.border}`,
                    borderRadius: 16, padding: "18px 18px 18px 22px", marginBottom: 12, cursor: "pointer", textAlign: "left",
                    display: "flex", gap: 14, alignItems: "center",
                  }}
                >
                  {/* vivid color spine */}
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 5, background: gradientCss(r.gradKey) }} />
                  <RestaurantLogo photoUrl={r.logoUrl} size={52} gradKey={r.logoUrl ? null : r.gradKey} initial={r.logoUrl ? null : r.name[0]} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: T.text }}>{r.name}</div>
                      {tier && <PrestigeBadge tier={tier} size="sm" />}
                    </div>
                    <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 8 }}>{r.cuisine}</div>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 20,
                        background: gradientCss(r.gradKey), color: "#fff", fontSize: 12, fontWeight: 700,
                      }}>★ {r.rating}</span>
                      <span style={{ fontSize: 11, color: T.textFaint }}>vs {r.googleRating} Google</span>
                    </div>
                  </div>
                </button>
              );
            });
          })()}

          <div style={{
            marginTop: 8, padding: "14px 16px", background: T.surface, borderRadius: 12,
            border: `1px solid ${T.border}`, fontSize: 12, color: T.textMuted, lineHeight: 1.6,
          }}>
            "Verified" ratings come only from reviewers with confirmed visits — receipt, check-in, or table code matched. No anonymous drive-by reviews.
          </div>
        </div>
      )}

      {/* RESTAURANT DETAIL */}
      {view === "restaurants" && selectedRestaurant && (
        <div style={{ padding: "20px 24px 0" }}>
          <button onClick={() => setSelectedRestaurant(null)} style={{ background: "none", border: "none", color: T.textMuted, fontSize: 13, marginBottom: 16, cursor: "pointer" }}>← Back</button>
          {(() => {
            const tier = calculatePrestigeTier(selectedRestaurant);
            const tierInfo = tier ? PRESTIGE_TIERS[tier] : null;
            return (
              <div style={{
                background: T.surface, border: `1px solid ${tierInfo ? tierInfo.color + "50" : T.border}`,
                borderRadius: 12, padding: 22, marginBottom: 16,
              }}>
                <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 16 }}>
                  <label style={{ position: "relative", cursor: "pointer", flexShrink: 0 }}>
                    <RestaurantLogo photoUrl={selectedRestaurant.logoUrl} size={64} ringColor={tierInfo ? tierInfo.color : null} />
                    <div style={{
                      position: "absolute", bottom: -2, right: -2, width: 22, height: 22, borderRadius: "50%",
                      background: T.accent, border: `2px solid ${T.surface}`, display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: 10,
                    }}>📷</div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLogoUpload(selectedRestaurant.id, e.target.files?.[0])}
                      style={{ display: "none" }}
                    />
                  </label>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                      <div style={{ fontSize: 19, fontWeight: 700, color: T.text }}>{selectedRestaurant.name}</div>
                      {tier && <PrestigeBadge tier={tier} />}
                    </div>
                    <div style={{ fontSize: 12, color: T.textMuted }}>{selectedRestaurant.cuisine}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 20, marginBottom: 18 }}>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: T.accent }}>{selectedRestaurant.rating}</div>
                    <div style={{ fontSize: 10, color: T.textFaint, textTransform: "uppercase", letterSpacing: "0.08em" }}>Verified Score</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: T.textMuted }}>{selectedRestaurant.googleRating}</div>
                    <div style={{ fontSize: 10, color: T.textFaint, textTransform: "uppercase", letterSpacing: "0.08em" }}>Google Avg</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: T.text }}>{selectedRestaurant.verifiedReviewCount}</div>
                    <div style={{ fontSize: 10, color: T.textFaint, textTransform: "uppercase", letterSpacing: "0.08em" }}>Verified Visits</div>
                  </div>
                </div>
                <button
                  onClick={() => setVerifyTarget(selectedRestaurant)}
                  style={{
                    width: "100%", padding: 13, borderRadius: 8, border: `1px solid ${T.accent}`,
                    background: "transparent", color: T.accent, fontSize: 13, fontWeight: 700,
                    cursor: "pointer", letterSpacing: "0.02em",
                  }}
                >
                  + Verify your visit & review
                </button>
              </div>
            );
          })()}

          <div style={{ fontSize: 10, color: T.textFaint, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>
            Reviews From Verified Diners
          </div>
          {selectedRestaurant.reviews.map((rev, i) => {
            const reviewer = getReviewer(rev.reviewerId);
            const replyText = rev.status === "owner_replied" ? rev.ownerReply : rev.aiReply?.text;
            return (
              <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, marginBottom: 10, overflow: "hidden" }}>
                <button
                  onClick={() => { setView("reviewers"); setSelectedReviewer(reviewer); }}
                  style={{ width: "100%", display: "flex", gap: 12, padding: 14, background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}
                >
                  <ReviewerAvatar photoUrl={reviewer.photoUrl} size={40} gradKey={reviewer.photoUrl ? null : reviewer.gradKey} initial={reviewer.photoUrl ? null : reviewer.name[0]} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{reviewer.name}</span>
                      {rev.visitVerified && <span style={{ fontSize: 9, color: T.success, border: `1px solid ${T.success}50`, padding: "2px 6px", borderRadius: 3, fontWeight: 600, letterSpacing: "0.04em" }}>VERIFIED</span>}
                      {rev.status === "needs_attention" && <span style={{ fontSize: 9, color: T.danger, border: `1px solid ${T.danger}50`, padding: "2px 6px", borderRadius: 3, fontWeight: 600, letterSpacing: "0.04em" }}>PENDING</span>}
                    </div>
                    <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.5 }}>{rev.snippet}</div>
                  </div>
                </button>
                {rev.photoUrl && (
                  <div style={{ margin: "0 14px 14px" }}>
                    <img src={rev.photoUrl} alt="Review attachment" style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 6, display: "block" }} />
                  </div>
                )}
                {replyText && (
                  <div style={{ margin: "0 14px 14px", padding: 12, background: T.surfaceRaised, borderRadius: 8, borderLeft: `2px solid ${T.accent}` }}>
                    <div style={{ fontSize: 10, color: T.accent, fontWeight: 600, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {rev.status === "owner_replied" ? "Owner response" : "Restaurant response"}
                    </div>
                    <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.5 }}>{replyText}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* REVIEWERS VIEW */}
      {view === "reviewers" && !selectedReviewer && (
        <div style={{ padding: "20px 24px 0" }}>
          {reviewers.map(r => getReviewer(r.id)).map(r => (
            <button
              key={r.id}
              onClick={() => setSelectedReviewer(r)}
              style={{
                width: "100%", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10,
                padding: 16, marginBottom: 10, cursor: "pointer", textAlign: "left",
                display: "flex", gap: 14, alignItems: "center",
              }}
            >
              <ReviewerAvatar photoUrl={r.photoUrl} size={50} gradKey={r.photoUrl ? null : r.gradKey} initial={r.photoUrl ? null : r.name[0]} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: T.text }}>{r.name}</span>
                  {followedReviewers.includes(r.id) && (
                    <span style={{ fontSize: 9, fontWeight: 700, color: T.accent, border: "1px solid " + T.accent + "55", borderRadius: 980, padding: "1px 7px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Following</span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 4 }}>{r.handle} · {r.colorName}</div>
                <div style={{ display: "flex", gap: 10, fontSize: 11 }}>
                  <span style={{ color: T.accent, fontWeight: 600 }}>Trust {r.trustScore}</span>
                  <span style={{ color: T.textFaint }}>{r.verifiedVisits} verified visits</span>
                  {r.id !== 4 && r.matchScore != null && <span style={{ color: r.color, fontWeight: 600 }}>{r.matchScore}% match</span>}
                </div>
              </div>
              {r.verifiedVisits > 0 && (
                <div style={{ flexShrink: 0, opacity: 0.95 }}>
                  <TastePrint dimensions={r.dimensions} color={r.color} colorSecondary={r.colorSecondary} size={54} />
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* REVIEWER DETAIL */}
      {view === "reviewers" && selectedReviewer && (
        <div style={{ padding: "20px 24px 0" }}>
          <button onClick={() => setSelectedReviewer(null)} style={{ background: "none", border: "none", color: T.textMuted, fontSize: 13, marginBottom: 16, cursor: "pointer" }}>← Back</button>
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "24px 22px", borderBottom: `1px solid ${T.border}`, display: "flex", gap: 18, alignItems: "center" }}>
              {selectedReviewer.id === 4 ? (
                <label style={{ position: "relative", cursor: "pointer", flexShrink: 0 }}>
                  <ReviewerAvatar photoUrl={selectedReviewer.photoUrl} size={76} gradKey={selectedReviewer.photoUrl ? null : selectedReviewer.gradKey} initial={selectedReviewer.photoUrl ? null : selectedReviewer.name[0]} />
                  <div style={{
                    position: "absolute", bottom: -2, right: -2, width: 24, height: 24, borderRadius: "50%",
                    background: T.accent, border: `2px solid ${T.surface}`, display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 11,
                  }}>📷</div>
                  <input type="file" accept="image/*" onChange={(e) => handleProfilePhotoUpload(e.target.files?.[0])} style={{ display: "none" }} />
                </label>
              ) : (
                <ReviewerAvatar photoUrl={selectedReviewer.photoUrl} size={76} gradKey={selectedReviewer.photoUrl ? null : selectedReviewer.gradKey} initial={selectedReviewer.photoUrl ? null : selectedReviewer.name[0]} />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: T.text }}>{selectedReviewer.name}</div>
                <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 8 }}>{selectedReviewer.handle}</div>
                <div style={{
                  display: "inline-block", background: "transparent", border: `1px solid ${selectedReviewer.color}60`,
                  borderRadius: 4, padding: "4px 12px", fontSize: 11, color: selectedReviewer.color, fontWeight: 600,
                }}>
                  {selectedReviewer.colorName}
                </div>
                {selectedReviewer.id === 4 && !selectedReviewer.photoUrl && (
                  <div style={{ fontSize: 10, color: T.textFaint, marginTop: 6 }}>Tap your avatar to add a photo</div>
                )}
              </div>
              {/* Follow button — only for other reviewers, not "You" */}
              {selectedReviewer.id !== 4 && (
                <button
                  onClick={() => toggleFollow(selectedReviewer.id)}
                  style={{
                    flexShrink: 0, padding: "9px 18px", borderRadius: 980, cursor: "pointer", fontSize: 13, fontWeight: 700,
                    border: followedReviewers.includes(selectedReviewer.id) ? `1px solid ${T.border}` : "none",
                    background: followedReviewers.includes(selectedReviewer.id) ? "transparent" : T.accent,
                    color: followedReviewers.includes(selectedReviewer.id) ? T.textMuted : "#fff",
                  }}
                >
                  {followedReviewers.includes(selectedReviewer.id) ? "✓ Following" : "+ Follow"}
                </button>
              )}
            </div>
            <div style={{ padding: 22 }}>
              <div style={{
                background: T.surfaceRaised, border: `1px solid ${T.border}`, borderLeft: `2px solid ${selectedReviewer.color}`,
                borderRadius: 8, padding: 16, marginBottom: 20, fontSize: 13, color: T.textMuted, lineHeight: 1.7,
              }}>
                {selectedReviewer.tasteProfile}
              </div>

              {/* Taste Match — only shown for other reviewers (vs "You") */}
              {selectedReviewer.id !== 4 && selectedReviewer.matchScore != null && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 14, marginBottom: 18, padding: "14px 16px",
                  background: `${selectedReviewer.color}14`, border: `1px solid ${selectedReviewer.color}40`, borderRadius: 12,
                }}>
                  <div style={{ position: "relative", width: 52, height: 52, flexShrink: 0 }}>
                    <svg width="52" height="52" viewBox="0 0 52 52">
                      <circle cx="26" cy="26" r="22" fill="none" stroke={T.border} strokeWidth="4" />
                      <circle cx="26" cy="26" r="22" fill="none" stroke={selectedReviewer.color} strokeWidth="4"
                        strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 22}`}
                        strokeDashoffset={`${2 * Math.PI * 22 * (1 - selectedReviewer.matchScore / 100)}`}
                        transform="rotate(-90 26 26)" />
                    </svg>
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: T.text }}>
                      {selectedReviewer.matchScore}%
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>You match {selectedReviewer.name.split(" ")[0]} {selectedReviewer.matchScore}%</div>
                    <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.45 }}>
                      {selectedReviewer.matchScore >= 85 ? "Your tastes are highly aligned — their picks are a strong signal for you."
                        : selectedReviewer.matchScore >= 70 ? "Solid overlap in taste — worth weighing their reviews."
                        : "Some shared taste — useful for a different perspective."}
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
                <button
                  onClick={() => setShowTrustBreakdown(v => !v)}
                  style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
                >
                  <div style={{ fontSize: 19, fontWeight: 700, color: selectedReviewer.color, display: "flex", alignItems: "center", gap: 5 }}>
                    {selectedReviewer.trustScore}
                    <span style={{ fontSize: 11, color: T.textFaint }}>{showTrustBreakdown ? "▲" : "▼"}</span>
                  </div>
                  <div style={{ fontSize: 10, color: T.textFaint, textTransform: "uppercase", borderBottom: `1px dotted ${T.textFaint}` }}>Trust Score</div>
                </button>
                <div>
                  <div style={{ fontSize: 19, fontWeight: 700, color: T.text }}>{selectedReviewer.verifiedVisits}</div>
                  <div style={{ fontSize: 10, color: T.textFaint, textTransform: "uppercase" }}>Verified Visits</div>
                </div>
              </div>

              {/* Trust Score breakdown — transparency on how the number is built */}
              {showTrustBreakdown && selectedReviewer.trustBreakdown && (
                <div style={{
                  marginBottom: 20, padding: "14px 16px", background: T.surfaceRaised,
                  border: `1px solid ${T.border}`, borderRadius: 10,
                }}>
                  <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 12, lineHeight: 1.5 }}>
                    Trust Score is earned, not bought. It's the weighted average of five signals:
                  </div>
                  {selectedReviewer.trustBreakdown.map(b => (
                    <div key={b.label} style={{ marginBottom: 11 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3 }}>
                        <span style={{ fontSize: 12, color: T.text, fontWeight: 600 }}>{b.label}</span>
                        <span style={{ fontSize: 12, color: selectedReviewer.color, fontWeight: 700 }}>{b.value}</span>
                      </div>
                      <div style={{ fontSize: 10.5, color: T.textFaint, marginBottom: 5 }}>{b.detail}</div>
                      <div style={{ height: 4, background: T.border, borderRadius: 2 }}>
                        <div style={{ height: "100%", width: `${b.value}%`, background: selectedReviewer.color, borderRadius: 2 }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ fontSize: 10, color: T.textFaint, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>
                Taste Fingerprint
              </div>
              <div style={{ fontSize: 11, color: T.textFaint, marginBottom: 8 }}>
                A unique shape built from this reviewer's verified visits.
              </div>

              {selectedReviewer.verifiedVisits > 0 ? (
                <>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                    <TastePrint
                      dimensions={selectedReviewer.dimensions}
                      color={selectedReviewer.color}
                      colorSecondary={selectedReviewer.colorSecondary}
                      size={230}
                    />
                  </div>
                  {/* readout below the print */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px", marginTop: 4 }}>
                    {selectedReviewer.dimensions.map(d => (
                      <div key={d.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: d.color, display: "inline-block" }} />
                          <span style={{ fontSize: 11, color: T.textMuted }}>{d.label}</span>
                        </span>
                        <span style={{ fontSize: 11, color: T.text, fontWeight: 700 }}>{d.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{
                  border: `1px dashed ${T.borderStrong}`, borderRadius: 10, padding: "28px 18px",
                  textAlign: "center", color: T.textFaint, fontSize: 12, lineHeight: 1.6,
                }}>
                  Your taste fingerprint appears here once you verify your first visit.
                  <br />Every verified review sharpens its shape.
                </div>
              )}

              {/* AI recommendation — only for other reviewers */}
              {selectedReviewer.id !== 4 && selectedReviewer.verifiedVisits > 0 && (
                <div style={{
                  marginTop: 20, padding: "16px 18px", borderRadius: 12,
                  background: `linear-gradient(135deg, ${selectedReviewer.color}18, ${selectedReviewer.colorSecondary}10)`,
                  border: `1px solid ${selectedReviewer.color}35`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                      color: selectedReviewer.color, display: "inline-flex", alignItems: "center", gap: 5,
                    }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2L12 3z" fill={selectedReviewer.color}/></svg>
                      Dined In AI
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: T.text, lineHeight: 1.6 }}>
                    Based on your taste fingerprint and {selectedReviewer.name.split(" ")[0]}'s {selectedReviewer.matchScore}% match, you'll likely love{" "}
                    <strong style={{ color: selectedReviewer.color }}>{selectedReviewer.name.split(" ")[0] === "Marcus" ? "Sakura & Stone" : "Ember & Oak"}</strong>
                    {" "}— one of their recent verified favorites.
                  </div>
                  <div style={{ fontSize: 10.5, color: T.textFaint, marginTop: 8, fontStyle: "italic" }}>
                    Recommendations sharpen as you verify more visits.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* BUSINESS VIEW */}
      {view === "business" && (
        <BusinessDashboard restaurants={restaurants} getReviewer={getReviewer} onRespond={handleOwnerRespond} onLogoUpload={handleLogoUpload} onToneChange={handleToneChange} />
      )}

      {/* GET STARTED VIEW */}
      {view === "get started" && (
        <>
          <div style={{ display: "flex", gap: 8, padding: "0 24px 16px" }}>
            {[
              { key: "signup", label: "Sign up a restaurant" },
              { key: "leads", label: "View signups" },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setSignupSubview(t.key)}
                style={{
                  padding: "7px 12px", borderRadius: 20, cursor: "pointer", whiteSpace: "nowrap",
                  border: `1px solid ${signupSubview === t.key ? T.accent : T.border}`,
                  background: signupSubview === t.key ? T.accentDim : "transparent",
                  color: signupSubview === t.key ? T.accent : T.textMuted,
                  fontSize: 11, fontWeight: 600,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
          {signupSubview === "signup" ? <RestaurantSignup /> : <SignupList />}
        </>
      )}

      <div style={{ padding: "32px 24px 0", textAlign: "center" }}>
        <div style={{ fontSize: 10, color: T.textFaint, letterSpacing: "0.08em" }}>
          DINED IN · Every review comes from a verified visit · dinedin.app
        </div>
      </div>

      {verifyTarget && (
        <VerifyVisitFlow restaurant={verifyTarget} onComplete={handleVerifyComplete} onClose={() => setVerifyTarget(null)} />
      )}

      {toast && (
        <div style={{
          position: "fixed", bottom: 24, left: 24, right: 24, background: T.surfaceRaised,
          color: T.text, padding: "14px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600,
          textAlign: "center", border: `1px solid ${T.accent}50`, animation: "slideUp 0.3s ease-out",
          zIndex: 200,
        }}>
          {toast}
        </div>
      )}
    </div>
  );
}
