export const colors = {
  canvasBackground: "#1A1A1A",
  background: "#404258",
  textPrimary: "#FFFFFF",
  textSecondary: "#EEEEEE",
  textMuted: "#C8CAE0",
  surfaceMuted: "#474E68",
  surfaceRaised: "#50577A",
  surfaceSoft: "#5E648B",
  actionNeutral: "#50577A",
  accent: "#594DC8",
  accentSoft: "#766DDB",
  error: "#FF8EA1",
  white: "#FFFFFF",
  divider: "#767CA2",
  patternPrimary: "rgba(173, 128, 96, 0.26)",
  patternSecondary: "rgba(168, 92, 160, 0.24)",
  homeSidebar: "#50577A",
  homeHeader: "#4B5170",
  homeCard: "#474E68",
  homeTile: "#596080",
  homeTileInner: "#6A7193",
  homeChip: "#596080",
  homeSelection: "#7379A4",
  taskIndicator: "#FF5B5B",
  taskBarYellow: "#FFC941",
  taskBarAmber: "#FFAA33",
  taskBarOrange: "#FF8A26",
  taskBarGold: "#FFD965",
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
  input: 24,
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
    shadowOpacity: 0.24,
    shadowRadius: 18,
    elevation: 10,
  },
} as const;
