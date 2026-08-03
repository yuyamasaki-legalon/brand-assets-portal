import{$o as e,Ln as t,at as n,ct as r,is as i,nt as a,or as o,ot as s,st as c,ts as l,vn as u}from"./dist-BI4q01Zl.js";var d=i(l(),1),f={shimmerText:`_shimmerText_lsvl0_1`,shimmerSweep:`_shimmerSweep_lsvl0_1`},p=e(),m={angle:`75deg`,durationMultiplier:8,startPosition:`0%`,endPosition:`-200%`,backgroundSize:`200%`,highlightCenter:`70%`,highlightWidth:`80%`},h=({children:e,color:t})=>(0,p.jsx)(o,{color:t,children:(0,p.jsx)(`span`,{className:f.shimmerText,"data-text":e,children:e})}),g=()=>{let e=(0,d.useMemo)(()=>({"--shimmer-angle":m.angle,"--shimmer-duration-multiplier":String(m.durationMultiplier),"--shimmer-start-position":m.startPosition,"--shimmer-end-position":m.endPosition,"--shimmer-background-size":m.backgroundSize,"--shimmer-highlight-center":m.highlightCenter,"--shimmer-highlight-width":m.highlightWidth}),[]),i=(0,d.useMemo)(()=>`.shimmerText {
  --shimmer-angle: ${m.angle};
  --shimmer-duration-multiplier: ${m.durationMultiplier};
  --shimmer-start-position: ${m.startPosition};
  --shimmer-end-position: ${m.endPosition};
  --shimmer-background-size: ${m.backgroundSize};
  --shimmer-highlight-center: ${m.highlightCenter};
  --shimmer-highlight-width: ${m.highlightWidth};
}

.shimmerText::after {
  background-image: linear-gradient(
    var(--shimmer-angle),
    transparent calc(var(--shimmer-highlight-center) - (var(--shimmer-highlight-width) / 2)),
    color-mix(in srgb, var(--aegis-color-palette-scale-white-1000) 92%, transparent) var(--shimmer-highlight-center),
    transparent calc(var(--shimmer-highlight-center) + (var(--shimmer-highlight-width) / 2))
  );
  background-position: var(--shimmer-start-position) 0;
  background-size: var(--shimmer-background-size) 100%;
  animation: shimmerSweep
    calc(var(--aegis-motion-duration-fast) * var(--shimmer-duration-multiplier))
    var(--aegis-motion-easing-default)
    infinite;
}`,[]),l=(0,d.useMemo)(()=>`const shimmerStyle = {
  "--shimmer-angle": "${m.angle}",
  "--shimmer-duration-multiplier": "${m.durationMultiplier}",
  "--shimmer-start-position": "${m.startPosition}",
  "--shimmer-end-position": "${m.endPosition}",
  "--shimmer-background-size": "${m.backgroundSize}",
  "--shimmer-highlight-center": "${m.highlightCenter}",
  "--shimmer-highlight-width": "${m.highlightWidth}",
} as React.CSSProperties;

<Text color="danger">
  <span className={styles.shimmerText} data-text="Thinking..." style={shimmerStyle}>
    Thinking...
  </span>
</Text>`,[]);return(0,p.jsxs)(a,{children:[(0,p.jsxs)(c,{style:{maxWidth:`var(--aegis-layout-width-small)`,marginInline:`auto`},children:[(0,p.jsx)(s,{children:(0,p.jsxs)(u,{children:[(0,p.jsx)(u.Title,{children:`Shimmer Test`}),(0,p.jsx)(u.Description,{children:`Shimmer preview samples`})]})}),(0,p.jsx)(r,{children:(0,p.jsxs)(`div`,{style:{...e,display:`flex`,flexDirection:`column`,gap:`var(--aegis-space-medium)`},children:[(0,p.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--aegis-space-medium)`},children:[(0,p.jsx)(h,{color:`bold`,children:`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890~!@#$%^&*()_+`}),(0,p.jsx)(h,{color:`subtle`,children:`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890~!@#$%^&*()_+`}),(0,p.jsx)(h,{color:`information`,children:`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890~!@#$%^&*()_+`}),(0,p.jsx)(h,{color:`warning`,children:`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890~!@#$%^&*()_+`}),(0,p.jsx)(h,{color:`danger`,children:`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890~!@#$%^&*()_+`})]}),(0,p.jsx)(t,{}),(0,p.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--aegis-space-medium)`},children:[(0,p.jsx)(h,{children:`Thinking...`}),(0,p.jsx)(h,{children:`Analyzing...`}),(0,p.jsx)(h,{children:`Generating...`}),(0,p.jsx)(h,{children:`Processing...`}),(0,p.jsx)(h,{color:`subtle`,children:`Thinking...`}),(0,p.jsx)(h,{color:`subtle`,children:`Analyzing...`}),(0,p.jsx)(h,{color:`subtle`,children:`Generating...`}),(0,p.jsx)(h,{color:`subtle`,children:`Processing...`})]}),(0,p.jsx)(t,{}),(0,p.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--aegis-space-medium)`},children:[(0,p.jsx)(h,{children:`考えています...`}),(0,p.jsx)(h,{children:`解析しています...`}),(0,p.jsx)(h,{children:`生成しています...`}),(0,p.jsx)(h,{children:`処理しています...`}),(0,p.jsx)(h,{color:`subtle`,children:`考えています...`}),(0,p.jsx)(h,{color:`subtle`,children:`解析しています...`}),(0,p.jsx)(h,{color:`subtle`,children:`生成しています...`}),(0,p.jsx)(h,{color:`subtle`,children:`処理しています...`})]})]})})]}),(0,p.jsxs)(n,{position:`end`,width:`large`,maxWidth:`xxLarge`,variant:`outline`,children:[(0,p.jsx)(s,{children:(0,p.jsx)(u,{children:(0,p.jsx)(u.Title,{children:`Code`})})}),(0,p.jsx)(r,{children:(0,p.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`var(--aegis-space-medium)`},children:[(0,p.jsx)(o,{variant:`label.medium`,children:`css版`}),(0,p.jsx)(`textarea`,{"aria-label":`Shimmer CSS example`,readOnly:!0,value:i,style:{width:`100%`,minHeight:`260px`,padding:`var(--aegis-space-small)`,border:`1px solid var(--aegis-color-border-neutral)`,borderRadius:`var(--aegis-radius-medium)`,backgroundColor:`var(--aegis-color-background-neutral-subtle)`,color:`var(--aegis-color-foreground-default)`,fontFamily:`ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace`,fontSize:`var(--aegis-font-size-body-small)`,lineHeight:`1.5`,resize:`vertical`,boxSizing:`border-box`}}),(0,p.jsx)(o,{variant:`label.medium`,children:`js版`}),(0,p.jsx)(`textarea`,{"aria-label":`Shimmer JS example`,readOnly:!0,value:l,style:{width:`100%`,minHeight:`220px`,padding:`var(--aegis-space-small)`,border:`1px solid var(--aegis-color-border-neutral)`,borderRadius:`var(--aegis-radius-medium)`,backgroundColor:`var(--aegis-color-background-neutral-subtle)`,color:`var(--aegis-color-foreground-default)`,fontFamily:`ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace`,fontSize:`var(--aegis-font-size-body-small)`,lineHeight:`1.5`,resize:`vertical`,boxSizing:`border-box`}})]})})]})]})};export{g as ShimmerTest};