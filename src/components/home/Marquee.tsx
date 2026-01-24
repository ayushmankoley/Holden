import "./Marquee.css";

const MARQUEE_ITEMS = [
  "The Holden Showcase",
  "Regulated RWA Issuance",
  "Built on Stellar",
  "KYC-Verified Trading",
  "Real-World Assets",
];

const Marquee: React.FC = () => {
  // Create 4 copies for seamless infinite scroll
  const items = [
    ...MARQUEE_ITEMS,
    ...MARQUEE_ITEMS,
    ...MARQUEE_ITEMS,
    ...MARQUEE_ITEMS,
  ];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {items.map((text, index) => (
          <span
            key={`${text}-${index % MARQUEE_ITEMS.length}-${Math.floor(index / MARQUEE_ITEMS.length)}`}
            className="marquee__item"
          >
            <span className="marquee__dot" />
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
