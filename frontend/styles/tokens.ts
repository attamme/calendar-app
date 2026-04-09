export const colors = {
  background: "#FFFFFF",
  textPrimary: "#111111",
  textSecondary: "#696969",
  textMuted: "#9D9D9D",
  surfaceMuted: "#D9D9D9",
  actionNeutral: "#747474",
  accent: "#6A5AFC",
  error: "#B3261E",
  white: "#FFFFFF",
  homeHeader: "#CECECE",
  homeCard: "#878787",
  homeTile: "#A8A8A8",
  homeTileInner: "#878787",
  homeChip: "#BDBDBD",
  homeSelection: "#5E5E5E",
} as const;

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  authGutter: 37,
} as const;

export const radius = {
  pill: 100,
  card: 20,
  logo: 10,
  round: 999,
} as const;

export const typography = {
  fontFamily: {
    inter: "Inter",
    balsamiq: "Balsamiq Sans",
    balsamiqBold: "Balsamiq Sans Bold",
  },
  size: {
    bodySm: 14,
    body: 16,
    bodyLg: 20,
    title: 24,
    hero: 36,
    display: 48,
  },
  lineHeight: {
    compact: 19,
    body: 24,
    bodyLg: 29,
    roomy: 34,
  },
} as const;

export const shadows = {
  floating: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 10,
  },
} as const;
