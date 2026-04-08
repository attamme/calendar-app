export const colors = {
    btn_yes: '#594DC8',
    white: '#FFFFFF',
    orange: '#FCA34D',
    black: '#000000',
    btn_no: '#474E68', //button "no" color
    btn_third: '#0577A1'
} as const;

export type ColorType = keyof typeof colors;