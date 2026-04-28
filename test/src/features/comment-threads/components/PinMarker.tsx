interface PinMarkerProps {
  pinIndex: number;
  resolved?: boolean;
  selected: boolean;
  onClick: () => void;
}

export const PinMarker = ({ pinIndex, resolved = false, selected, onClick }: PinMarkerProps) => {
  const pinFillColor = resolved
    ? "var(--aegis-color-background-lime-bold)"
    : "var(--aegis-color-background-brand-bold)";
  const pinRingColor = resolved
    ? "color-mix(in srgb, var(--aegis-color-background-lime-bold) 22%, transparent)"
    : "color-mix(in srgb, var(--aegis-color-background-brand-bold) 22%, transparent)";
  const pinTextColor = "var(--aegis-color-text-onFill, #fff)";

  return (
    <button
      type="button"
      data-pin-marker
      aria-label={resolved ? `コメントピン ${pinIndex} 解決済み` : `コメントピン ${pinIndex}`}
      title={resolved ? `Pin #${pinIndex} 解決済み` : `Pin #${pinIndex}`}
      onClick={onClick}
      style={{
        width: "var(--aegis-size-xLarge)",
        height: "var(--aegis-size-xLarge)",
        appearance: "none",
        WebkitAppearance: "none",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        border: `var(--aegis-border-width-thin) solid var(--aegis-color-border-onFill, #fff)`,
        borderRadius: "var(--aegis-radius-full)",
        backgroundColor: pinFillColor,
        backgroundImage: `linear-gradient(${pinFillColor}, ${pinFillColor})`,
        boxShadow: selected
          ? `0 0 0 var(--aegis-space-xxSmall) ${pinRingColor}`
          : `0 0 0 var(--aegis-border-width-thinPlus) color-mix(in srgb, ${pinFillColor} 24%, transparent)`,
        color: pinTextColor,
        fontSize: "var(--aegis-internal-font-size-medium)",
        fontWeight: "var(--aegis-internal-font-weight-bold)",
        lineHeight: 1,
        padding: 0,
        cursor: "pointer",
        zIndex: "var(--aegis-zIndex-docked)",
        outlineOffset: "2px",
        opacity: 1,
        transition: "transform 120ms ease, box-shadow 120ms ease",
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.transform = "scale(1.15)";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.transform = "scale(1)";
      }}
    >
      {resolved ? "☑" : pinIndex}
    </button>
  );
};
