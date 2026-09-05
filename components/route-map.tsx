import type { JSX } from "react"

/**
 * The walking route, as a schematic street map of Soho.
 *
 * Generated rather than drawn: every junction in it is a real latitude and
 * longitude, projected once, so the grid is true and each leg runs down
 * the street it really runs down. Two liberties are taken and both are
 * declared on the face of the map — longitude outside the Soho core is
 * compressed so the long tails west to Bond Street and east to Covent
 * Garden do not squash the part anyone navigates by, and legs sharing a
 * street are drawn as parallel lanes so five walks do not stack into one
 * stripe.
 *
 * It is inline SVG, not a picture of a map: it takes its colours from the
 * theme's own custom properties, so it is legible on paper and on ink
 * without shipping two files, and its labels are real text that a reader
 * can search, select and zoom without it turning to mush. Nothing here is
 * a raster image, which is also what keeps `check:credits` happy — a
 * photograph is the one thing components/photo.tsx is allowed to emit,
 * and a drawing is not one. (That check greps the source rather than the
 * markup, deliberately: a rule you can talk your way past is not a rule.
 * So this comment says "raster image" where it means the tag.)
 *
 * The route is carried twice over: once as this drawing, and once as the
 * running order beneath it. The drawing is `role="img"` with a title and
 * a description, and the description points at that list rather than
 * trying to be it — five walks read out as prose is not navigation.
 *
 * Colours and sizes live with the rest of the map's rules in
 * app/globals.css, under "the route map".
 */
export function RouteMap(): JSX.Element {
  return (
    <svg className="wzdmap" viewBox="0 0 1240 940" role="img" aria-labelledby="map-title map-desc">
    <title id="map-title">The World Zombie Day walking route through Soho</title>
    <desc id="map-desc">A schematic street map of Soho and Covent Garden. Base camp is Soho Square, marked with a star. Five numbered walks lead out of it and back: walk one loops south to Meard Street; walk two runs west along Oxford Street to Bond Street and back, dropping south down Berwick Street to NQ64; walk three goes west to Berwick Street Market and south to St Anne&rsquo;s Churchyard; walk four goes south down Wardour Street and along Shaftesbury Avenue to Piccadilly Circus; and an optional fifth walk crosses Leicester Square to Endell Street in Covent Garden. The same route is set out in full, with times, in the schedule below this map.</desc>
    <rect className="grn" x="786.1" y="220.2" width="85.9" height="88.2"/>
    <rect className="grn" x="905.8" y="710" width="73.7" height="58.8"/>
    <rect className="grn" x="709.4" y="523.9" width="30.7" height="29.4"/>
    <rect className="grn" x="408.1" y="602.3" width="37.3" height="49"/>
    <path className="rd-major" d="M79.3,376.9 L203.8,327.9 L325.1,278.9 L411.3,249.6 L635.7,220.2 L721.7,210.4 L807.6,190.8 L948.8,161.4"/>
    <path className="rd-major" d="M325.1,278.9 L379.4,416.1 L482.2,572.9 L598.9,710 L666.4,778.6"/>
    <path className="rd-major" d="M666.4,778.6 L721.7,690.4 L758.5,602.3 L832.2,572.9 L924.2,553.3 L1004.3,543.5 L1052.2,465.1"/>
    <path className="rd-major" d="M948.8,161.4 L979.5,347.5 L1004.3,543.5 L1017,661.1 L1029.8,778.6"/>
    <path className="rd-major" d="M635.7,220.2 L654.1,318.1 L666.4,386.7 L678.7,425.9 L697.1,484.7 L709.4,514.1 L727.8,543.5 L758.5,602.3"/>
    <path className="rd-major" d="M721.7,210.4 L727.8,249.6 L740.1,318.1 L746.2,386.7 L758.5,484.7 L770.8,514.1 L807.6,582.7"/>
    <path className="rd-major" d="M411.3,249.6 L512.9,298.5 L537.5,376.9 L562.1,425.9 L580.5,465.1 L592.7,494.5"/>
    <path className="rd-major" d="M709.4,514.1 L770.8,514.1 L881.3,494.5 L924.2,494.5 L997.9,494.5"/>
    <path className="rd-major" d="M875.1,298.5 L899.7,396.5 L924.2,494.5 L936.5,553.3"/>
    <path className="rd-major" d="M844.4,298.5 L862.8,396.5 L881.3,494.5 L875.1,563.1"/>
    <path className="rd-major" d="M411.3,425.9 L562.1,425.9 L678.7,425.9"/>
    <path className="rd-major" d="M666.4,778.6 L801.5,759 L905.8,739.4"/>
    <path className="rd-major" d="M1017,661.1 L1090.5,572.9 L1154.3,504.3 L1189.4,465.1"/>
    <path className="rd-major" d="M1157.5,465.1 L1163.9,376.9 L1170.3,278.9"/>
    <path className="rd-major" d="M979.5,710 L1017,661.1"/>
    <path className="rd-minor" d="M697.1,484.7 L758.5,484.7"/>
    <path className="rd-minor" d="M666.4,386.7 L746.2,386.7"/>
    <path className="rd-minor" d="M592.7,494.5 L672.5,484.7"/>
    <path className="rd-minor" d="M727.8,249.6 L795.3,259.3"/>
    <path className="rd-minor" d="M807.6,190.8 L826,230"/>
    <text className="lbl-dist" x="232" y="512" textAnchor="middle">Mayfair</text>
    <text className="lbl-dist" x="856" y="690" textAnchor="middle">Chinatown</text>
    <path className="ret" d="M580.5,465.1 L562.1,425.9 L678.7,425.9 L666.4,386.7 L746.2,386.7 L727.8,249.6 L795.3,259.3 L829.1,264.2"/>
    <path className="leg-case" d="M836.4,261 L852.1,296.1 L870.7,395 L890.6,501 L771.5,522.1 L704,522.1 L685.1,476.7 L749.4,476.7 L738.3,387.7 L718.5,240.1 L796.5,251.4 L830.2,256.3"/>
    <path className="leg" d="M836.4,261 L852.1,296.1 L870.7,395 L890.6,501 L771.5,522.1 L704,522.1 L685.1,476.7 L749.4,476.7 L738.3,387.7 L718.5,240.1 L796.5,251.4 L830.2,256.3"/>
    <path className="leg-case" d="M821.1,265 L818.2,232.1 L803.1,200 L723,218.3 L636.7,228.1 L413.1,257.4 L327.9,286.4 L206.8,335.4 L82.2,384.4"/>
    <path className="leg" d="M821.1,265 L818.2,232.1 L803.1,200 L723,218.3 L636.7,228.1 L413.1,257.4 L327.9,286.4 L206.8,335.4 L82.2,384.4"/>
    <path className="leg-case" d="M82.6,385.3 L207.1,336.3 L328.2,287.4 L410.7,259.3 L505.5,305 L529.1,380.3 L554,429.8 L572.3,468.9"/>
    <path className="leg" d="M82.6,385.3 L207.1,336.3 L328.2,287.4 L410.7,259.3 L505.5,305 L529.1,380.3 L554,429.8 L572.3,468.9"/>
    <path className="leg-case" d="M830.4,255.3 L796.6,250.4 L716.7,238.9 L731.1,319.3 L736.4,377.7 L654.2,377.7 L666.4,416.9 L545.8,416.9 L560.2,439.9 L572.2,468.6 L587.1,504.3 L673.1,493.7 L691.1,493.7 L701.4,518.2 L714,538.5"/>
    <path className="leg" d="M830.4,255.3 L796.6,250.4 L716.7,238.9 L731.1,319.3 L736.4,377.7 L654.2,377.7 L666.4,416.9 L545.8,416.9 L560.2,439.9 L572.2,468.6 L587.1,504.3 L673.1,493.7 L691.1,493.7 L701.4,518.2 L714,538.5"/>
    <path className="leg-case" d="M714,538.5 L720,548 L748.6,602.7 L713.6,686.3 L658.8,773.9"/>
    <path className="leg" d="M714,538.5 L720,548 L748.6,602.7 L713.6,686.3 L658.8,773.9"/>
    <path className="leg-case" d="M666.4,778.6 L801.5,759 L905.8,739.4 L979.5,710 L1017,661.1 L1090.5,572.9 L1154.3,504.3 L1157.5,465.1 L1163.9,376.9"/>
    <path className="leg" d="M666.4,778.6 L801.5,759 L905.8,739.4 L979.5,710 L1017,661.1 L1090.5,572.9 L1154.3,504.3 L1157.5,465.1 L1163.9,376.9" strokeDasharray="14 10"/>
    <text className="lbl-st" x="710.9" y="192.1" transform="rotate(-6.5 710.9 192.1)" style={{ fontSize: "18px" }}>Oxford Street</text>
    <text className="lbl-st" x="558.3" y="666.8" transform="rotate(49.6 558.3 666.8)" style={{ fontSize: "15px" }}>Regent Street</text>
    <text className="lbl-st" x="895.5" y="544.9" transform="rotate(-12 895.5 544.9)" style={{ fontSize: "15px" }}>Shaftesbury Avenue</text>
    <text className="lbl-st" x="973.1" y="313.3" transform="rotate(80.6 973.1 313.3)" style={{ fontSize: "14px" }}>Charing Cross Rd</text>
    <text className="lbl-st" x="649.2" y="277.3" transform="rotate(79.4 649.2 277.3)" style={{ fontSize: "14px" }}>Wardour St</text>
    <text className="lbl-st" x="785.6" y="562.3" transform="rotate(61.8 785.6 562.3)" style={{ fontSize: "14px" }}>Dean St</text>
    <text className="lbl-st" x="878" y="550.5" transform="rotate(-84.9 878 550.5)" style={{ fontSize: "13px" }}>Frith St</text>
    <text className="lbl-st" x="904.4" y="420" transform="rotate(75.9 904.4 420)" style={{ fontSize: "13px" }}>Greek St</text>
    <text className="lbl-st" x="499.1" y="278.4" transform="rotate(25.7 499.1 278.4)" style={{ fontSize: "14px" }}>Berwick St</text>
    <text className="lbl-st" x="464.8" y="430.4" transform="rotate(0 464.8 430.4)" style={{ fontSize: "13px" }}>Broadwick St</text>
    <text className="lbl-st" x="957.3" y="514" transform="rotate(0 957.3 514)" style={{ fontSize: "13px" }}>Old Compton St</text>
    <text className="lbl-st" x="727.8" y="462.2" transform="rotate(0 727.8 462.2)" style={{ fontSize: "12px" }}>Meard St</text>
    <text className="lbl-st" x="706.3" y="368.2" transform="rotate(0 706.3 368.2)" style={{ fontSize: "11px" }}>St Anne&rsquo;s Ct</text>
    <text className="lbl-st" x="1067.2" y="589.4" transform="rotate(-50.2 1067.2 589.4)" style={{ fontSize: "13px" }}>Long Acre</text>
    <text className="lbl-st" x="1162.1" y="390.3" transform="rotate(-85.9 1162.1 390.3)" style={{ fontSize: "13px" }}>Endell St</text>
    <text className="lbl-st" x="767.3" y="785.5" transform="rotate(-8.3 767.3 785.5)" style={{ fontSize: "12px" }}>Coventry St</text>
    <text className="lbl-st" x="998.3" y="676.1" transform="rotate(-52.5 998.3 676.1)" style={{ fontSize: "11px" }}>Cranbourn St</text>
    <text className="lbl-st" x="632.6" y="521.1" transform="rotate(-7 632.6 521.1)" style={{ fontSize: "11px" }}>Peter St</text>
    <text className="lbl-st" x="761.6" y="244.9" transform="rotate(8.3 761.6 244.9)" style={{ fontSize: "11px" }}>Carlisle St</text>
    <path className="arw" d="M-9,-6.5 L10,0 L-9,6.5 Z" transform="translate(832.3 511.3) rotate(169.9)"/>
    <path className="arw" d="M-9,-6.5 L10,0 L-9,6.5 Z" transform="translate(739.3 395.9) rotate(-97.1)"/>
    <circle className="walk-disc" cx="873.3" cy="408.7" r="16"/>
    <text className="walk-n" x="873.3" y="415.2" textAnchor="middle">1</text>
    <circle className="walk-disc" cx="761.2" cy="522.1" r="16"/>
    <text className="walk-n" x="761.2" y="528.6" textAnchor="middle">1</text>
    <circle className="walk-disc" cx="728.6" cy="315.6" r="16"/>
    <text className="walk-n" x="728.6" y="322.1" textAnchor="middle">1</text>
    <path className="arw" d="M-9,-6.5 L10,0 L-9,6.5 Z" transform="translate(371.6 271.5) rotate(161.2)"/>
    <circle className="walk-disc" cx="531.7" cy="241.8" r="16"/>
    <text className="walk-n" x="531.7" y="248.3" textAnchor="middle">2</text>
    <circle className="walk-disc" cx="188.7" cy="342.5" r="16"/>
    <text className="walk-n" x="188.7" y="349" textAnchor="middle">2</text>
    <path className="arw" d="M-9,-6.5 L10,0 L-9,6.5 Z" transform="translate(165.3 352.8) rotate(-21.5)"/>
    <path className="arw" d="M-9,-6.5 L10,0 L-9,6.5 Z" transform="translate(448.3 277.4) rotate(25.7)"/>
    <circle className="walk-disc" cx="259.5" cy="315.1" r="16"/>
    <text className="walk-n" x="259.5" y="321.6" textAnchor="middle">2</text>
    <circle className="walk-disc" cx="533.5" cy="389.1" r="16"/>
    <text className="walk-n" x="533.5" y="395.6" textAnchor="middle">2</text>
    <path className="arw" d="M-9,-6.5 L10,0 L-9,6.5 Z" transform="translate(676.1 377.7) rotate(180)"/>
    <path className="arw" d="M-9,-6.5 L10,0 L-9,6.5 Z" transform="translate(583.2 494.9) rotate(67.3)"/>
    <circle className="walk-disc" cx="723" cy="273.7" r="16"/>
    <text className="walk-n" x="723" y="280.2" textAnchor="middle">3</text>
    <circle className="walk-disc" cx="631.8" cy="416.9" r="16"/>
    <text className="walk-n" x="631.8" y="423.4" textAnchor="middle">3</text>
    <circle className="walk-disc" cx="644.1" cy="497.3" r="16"/>
    <text className="walk-n" x="644.1" y="503.8" textAnchor="middle">3</text>
    <path className="arw" d="M-9,-6.5 L10,0 L-9,6.5 Z" transform="translate(717 678.2) rotate(112.7)"/>
    <circle className="walk-disc" cx="740.7" cy="621.6" r="16"/>
    <text className="walk-n" x="740.7" y="628.1" textAnchor="middle">4</text>
    <circle className="walk-disc" cx="687.1" cy="728.6" r="16"/>
    <text className="walk-n" x="687.1" y="735.1" textAnchor="middle">4</text>
    <path className="arw" d="M-9,-6.5 L10,0 L-9,6.5 Z" transform="translate(934.5 728) rotate(-21.8)"/>
    <path className="arw" d="M-9,-6.5 L10,0 L-9,6.5 Z" transform="translate(1104 558.3) rotate(-47.1)"/>
    <circle className="walk-disc" cx="780.4" cy="762.1" r="16"/>
    <text className="walk-n" x="780.4" y="768.6" textAnchor="middle">5</text>
    <circle className="walk-disc" cx="934.5" cy="728" r="16"/>
    <text className="walk-n" x="934.5" y="734.5" textAnchor="middle">5</text>
    <circle className="walk-disc" cx="1156.5" cy="477.4" r="16"/>
    <text className="walk-n" x="1156.5" y="483.9" textAnchor="middle">5</text>
    <g><circle className="stn" cx="948.8" cy="161.4" r="8.5"/><rect className="stn-bar" x="940.3" y="159.8" width="17" height="3.2"/><text className="lbl-stn" x="963.8" y="166.4" textAnchor="start">Tottenham Court Rd</text></g>
    <g><circle className="stn" cx="325.1" cy="278.9" r="8.5"/><rect className="stn-bar" x="316.6" y="277.3" width="17" height="3.2"/><text className="lbl-stn" x="325.1" y="304.9" textAnchor="middle">Oxford Circus</text></g>
    <g><circle className="stn" cx="79.3" cy="376.9" r="8.5"/><rect className="stn-bar" x="70.8" y="375.3" width="17" height="3.2"/><text className="lbl-stn" x="79.3" y="402.9" textAnchor="middle">Bond Street</text></g>
    <g><circle className="stn" cx="666.4" cy="778.6" r="8.5"/><rect className="stn-bar" x="657.9" y="777" width="17" height="3.2"/><text className="lbl-stn" x="666.4" y="804.6" textAnchor="middle">Piccadilly Circus</text></g>
    <g><circle className="stn" cx="1017" cy="661.1" r="8.5"/><rect className="stn-bar" x="1008.5" y="659.5" width="17" height="3.2"/><text className="lbl-stn" x="1032" y="666.1" textAnchor="start">Leicester Square</text></g>
    <g><circle className="stn" cx="1154.3" cy="504.3" r="8.5"/><rect className="stn-bar" x="1145.8" y="502.7" width="17" height="3.2"/><text className="lbl-stn" x="1139.3" y="509.3" textAnchor="end">Covent Garden</text></g>
    <polygon className="base-star" points="829.1,242.2 834.7,256.6 850,257.4 838.1,267.2 842,282 829.1,273.7 816.1,282 820,267.2 808.2,257.4 823.5,256.6"/>
    <text className="lbl-big" x="863.1" y="256.2">Soho Square</text>
    <text className="lbl-place" x="863.1" y="278.2">Base camp — the hut · from 12 noon</text>
    <text className="lbl-sub" x="863.1" y="298.2">Stops 1 and 2 regroup here</text>
    <rect className="stop" x="706.7" y="518.7" width="30" height="30" transform="rotate(45 721.7 533.7)"/><text className="stop-n" x="721.7" y="539.7" textAnchor="middle">3</text>
    <text className="lbl-big" x="681.7" y="535.7" textAnchor="end">St Anne&rsquo;s Churchyard</text>
    <text className="lbl-sub" x="681.7" y="555.7" textAnchor="end">Stop 3 · 4.30–5.30pm</text>
    <rect className="stop" x="651.4" y="763.6" width="30" height="30" transform="rotate(45 666.4 778.6)"/><text className="stop-n" x="666.4" y="784.6" textAnchor="middle">4</text>
    <text className="lbl-big" x="666.4" y="826.6" textAnchor="middle">Eros · Piccadilly Circus</text>
    <text className="lbl-sub" x="666.4" y="846.6" textAnchor="middle">Stop 4 · 6–7pm</text>
    <circle className="spot" cx="568.2" cy="435.7" r="7"/>
    <text className="lbl-big" x="548.2" y="411.7" textAnchor="end">Berwick Street Market</text>
    <circle className="spot" cx="580.5" cy="465.1" r="7"/>
    <text className="lbl-big" x="562.5" y="481.1" textAnchor="end">NQ64 arcade bar</text>
    <text className="lbl-sub" x="562.5" y="499.1" textAnchor="end">Walk 2 finishes here</text>
    <circle className="spot" cx="1163.9" cy="376.9" r="7"/>
    <text className="lbl-big" x="1143.9" y="346.9" textAnchor="end">BloodSport</text>
    <text className="lbl-sub" x="1143.9" y="366.9" textAnchor="end">Covent Garden · optional</text>
    <text className="lbl-sub" x="75.3" y="420.9">Walk 2 turns round here</text>
    <text className="lbl-sub" x="964.8" y="185.4">Most of us arrive here</text>
    <rect className="box" x="56" y="48" width="452" height="196"/>
    <rect className="box-in" x="64" y="56" width="436" height="180"/>
    <text className="cart-eyebrow" x="86" y="96">World Zombie Day: London</text>
    <text className="cart-title" x="84" y="152">The route</text>
    <text className="cart-sub" x="86" y="186">Soho Square and back, five times over</text>
    <text className="cart-sub" x="86" y="212">Saturday 10 October · 12 noon to 7pm</text>
    <rect className="box" x="56" y="586" width="438" height="326"/>
    <rect className="box-in" x="64" y="594" width="422" height="310"/>
    <text className="key-title" x="84" y="630">Reading the map</text>
    <polygon className="base-star" points="100,648 103.3,656.5 112.4,657 105.3,662.7 107.6,671.5 100,666.6 92.4,671.5 94.7,662.7 87.6,657 96.7,656.5"/>
    <text className="key-t" x="140" y="666">Base camp — Soho Square (stops 1 and 2)</text>
    <rect className="stop" x="89" y="677" width="22" height="22" transform="rotate(45 100 688)"/>
    <text className="key-t" x="140" y="693">A timed stop, numbered as on the schedule</text>
    <path className="leg" d="M74,715 L126,715"/>
    <circle className="walk-disc" cx="100" cy="715" r="13"/>
    <text className="walk-n" x="100" y="720" textAnchor="middle" style={{ fontSize: "15px" }}>1</text>
    <text className="key-t" x="140" y="720">Walk 1 · 1.15–1.45pm · Meard Street loop</text>
    <path className="leg" d="M74,742 L126,742"/>
    <circle className="walk-disc" cx="100" cy="742" r="13"/>
    <text className="walk-n" x="100" y="747" textAnchor="middle" style={{ fontSize: "15px" }}>2</text>
    <text className="key-t" x="140" y="747">Walk 2 · 2–3pm · Oxford St, Bond St, NQ64</text>
    <path className="leg" d="M74,769 L126,769"/>
    <circle className="walk-disc" cx="100" cy="769" r="13"/>
    <text className="walk-n" x="100" y="774" textAnchor="middle" style={{ fontSize: "15px" }}>3</text>
    <text className="key-t" x="140" y="774">Walk 3 · 4–4.30pm · Market and churchyard</text>
    <path className="leg" d="M74,796 L126,796"/>
    <circle className="walk-disc" cx="100" cy="796" r="13"/>
    <text className="walk-n" x="100" y="801" textAnchor="middle" style={{ fontSize: "15px" }}>4</text>
    <text className="key-t" x="140" y="801">Walk 4 · 5.30–6pm · Down to Piccadilly</text>
    <path className="leg" d="M74,823 L126,823" strokeDasharray="14 10"/>
    <circle className="walk-disc" cx="100" cy="823" r="13"/>
    <text className="walk-n" x="100" y="828" textAnchor="middle" style={{ fontSize: "15px" }}>5</text>
    <text className="key-t" x="140" y="828">Walk 5 · from 7pm · BloodSport (optional)</text>
    <path className="ret" d="M74,850 L126,850"/>
    <text className="key-t" x="140" y="855">The way back to base camp</text>
    <circle className="stn" cx="100" cy="877" r="11"/>
    <rect className="stn-bar" x="89" y="875" width="22" height="4"/>
    <text className="key-t" x="140" y="882">Underground station</text>
    <rect className="scale-a" x="968" y="856" width="88.6" height="7"/>
    <rect className="scale-b" x="1056.6" y="856" width="88.6" height="7"/>
    <text className="lbl-sub" x="968" y="847">0</text>
    <text className="lbl-sub" x="1145.2" y="847" textAnchor="end">200 m</text>
    <text className="lbl-sub" x="968" y="881">True in Soho. Walks 2 and 5 reach</text>
    <text className="lbl-sub" x="968" y="899">further than the map shows.</text>
    <circle className="compass" cx="1178" cy="120" r="30"/>
    <polygon className="compass-n" points="1178,88 1168,132 1178,124 1188,132"/>
    <text className="compass-t" x="1178" y="80" textAnchor="middle">N</text>
    </svg>
  )
}
