import type { JSX } from "react"

/**
 * The walking route, as a schematic street map of Soho.
 *
 * Generated rather than drawn: every junction in it is a real latitude and
 * longitude, projected once, so the grid is true and each leg runs down
 * the street it really runs down. Walks 1, 3 and 4 are traced against the
 * owner's own Google Maps routes; walks 2 and 5 are still reconstructions
 * from their endpoints, which is why the page says the streets within a
 * walk are indicative and the Maps link is the route. Two liberties are taken and both are
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
 * Each walk has its own colour, carried by a `w1`..`w5` class on its line,
 * its arrows and its numbered discs — and on the swatch in the key, which
 * uses the same classes so the legend cannot fall out of step with the
 * map. Colour is never the only difference: every walk carries its number
 * too, because five hues are not five distinctions for every reader.
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
    <desc id="map-desc">A schematic street map of Soho. Base camp is Soho Square, marked with a star, where check-in and stops 1 and 2 happen. Five numbered walks lead out of it: walk one loops south by Meard Street and back; walk two runs west along Oxford Street to Bond Street and back; walk three goes west to Berwick Street Market and south to St Anne&rsquo;s Churchyard; walk four goes south to Piccadilly Circus; and an optional fifth walk goes east by Leicester Square. The same route, with its times and a Google Maps link for each walk, is set out in the list below this map.</desc>
    <rect className="grn" x="867.5" y="208.4" width="90" height="92.3"/>
    <rect className="grn" x="992.8" y="721.3" width="77.1" height="61.6"/>
    <rect className="grn" x="787.1" y="526.4" width="32.1" height="30.8"/>
    <path className="rd-major" d="M127.4,372.5 L257.7,321.2 L384.8,270 L475,239.2 L710,208.4 L800,198.1 L890,177.6 L1037.8,146.8"/>
    <path className="rd-major" d="M384.8,270 L441.6,413.6 L549.3,577.7 L671.4,721.3 L742.1,793.2"/>
    <path className="rd-major" d="M742.1,793.2 L800,700.8 L838.5,608.5 L915.7,577.7 L1012.1,557.2 L1095.9,546.9 L1146,464.9"/>
    <path className="rd-major" d="M1037.8,146.8 L1069.9,341.8 L1095.9,546.9 L1109.3,670 L1122.6,793.2"/>
    <path className="rd-major" d="M710,208.4 L729.3,311 L742.1,382.8 L755,423.8 L774.3,485.4 L787.1,516.2 L806.4,546.9 L838.5,608.5"/>
    <path className="rd-major" d="M800,198.1 L806.4,239.2 L819.3,311 L825.7,382.8 L838.5,485.4 L851.4,516.2 L890,588"/>
    <path className="rd-major" d="M475,239.2 L581.4,290.5 L607.1,372.5 L632.9,423.8 L652.1,464.9 L665,495.6"/>
    <path className="rd-major" d="M787.1,516.2 L851.4,516.2 L967.1,495.6 L1012.1,495.6 L1089.2,495.6"/>
    <path className="rd-major" d="M960.7,290.5 L986.4,393.1 L1012.1,495.6 L1024.9,557.2"/>
    <path className="rd-major" d="M928.5,290.5 L947.8,393.1 L967.1,495.6 L960.7,567.5"/>
    <path className="rd-major" d="M475,423.8 L632.9,423.8 L755,423.8"/>
    <path className="rd-major" d="M742.1,793.2 L883.5,772.6 L992.8,752.1"/>
    <path className="rd-major" d="M1069.9,721.3 L1109.3,670"/>
    <path className="rd-minor" d="M774.3,485.4 L838.5,485.4"/>
    <path className="rd-minor" d="M742.1,382.8 L825.7,382.8"/>
    <path className="rd-minor" d="M665,495.6 L748.5,485.4"/>
    <path className="rd-minor" d="M806.4,239.2 L877.1,249.4"/>
    <path className="rd-minor" d="M890,177.6 L909.2,218.7"/>
    <path className="rd-minor" d="M710,280.2 L581.4,290.5"/>
    <path className="rd-minor" d="M1005.6,464.9 L947.8,475.1"/>
    <text className="lbl-dist" x="210" y="500" textAnchor="middle">Mayfair</text>
    <text className="lbl-dist" x="872" y="700" textAnchor="middle">Chinatown</text>
    <path className="leg-case" d="M917.2,248.1 L967.7,285.8 L994.1,391 L1015.6,471.2 L960.9,480.9 L974.3,502.4 L847.2,514.3 L834.1,493.4 L768.4,493.4 L747.2,425.9 L721.4,312.6 L706.9,231.2 L807,231.2 L878.2,241.5 L913.6,246.6"/>
    <path className="leg w1" d="M917.2,248.1 L967.7,285.8 L994.1,391 L1015.6,471.2 L960.9,480.9 L974.3,502.4 L847.2,514.3 L834.1,493.4 L768.4,493.4 L747.2,425.9 L721.4,312.6 L706.9,231.2 L807,231.2 L878.2,241.5 L913.6,246.6"/>
    <path className="leg-case" d="M904.5,255.3 L901.4,220.8 L885.5,186.9 L801.3,206 L711,216.3 L476.8,247 L387.5,277.5 L260.7,328.7 L130.3,380"/>
    <path className="leg w2" d="M904.5,255.3 L901.4,220.8 L885.5,186.9 L801.3,206 L711,216.3 L476.8,247 L387.5,277.5 L260.7,328.7 L130.3,380"/>
    <path className="leg-case" d="M130.7,380.9 L261.1,329.6 L387.9,278.4 L477.1,248 L711.1,217.3 L801.5,207 L884.9,188 L900.4,221 L903.5,255.4"/>
    <path className="leg w2" d="M130.7,380.9 L261.1,329.6 L387.9,278.4 L477.1,248 L711.1,217.3 L801.5,207 L884.9,188 L900.4,221 L903.5,255.4"/>
    <path className="leg-case" d="M913.7,245.7 L878.4,240.5 L805.2,229.9 L707.7,271.4 L595.9,282.5 L611.3,344 L624,394.9 L630.5,436.4 L652,493.5 L721.2,504.5 L769.4,514.1 L793.1,542.5"/>
    <path className="leg w3" d="M913.7,245.7 L878.4,240.5 L805.2,229.9 L707.7,271.4 L595.9,282.5 L611.3,344 L624,394.9 L630.5,436.4 L652,493.5 L721.2,504.5 L769.4,514.1 L793.1,542.5"/>
    <path className="leg-case" d="M792.3,541.5 L798.6,551.4 L828.6,608.9 L792,696.7 L734.5,788.4"/>
    <path className="leg w4" d="M792.3,541.5 L798.6,551.4 L828.6,608.9 L792,696.7 L734.5,788.4"/>
    <path className="leg-case" d="M742.1,793.2 L883.5,772.6 L992.8,752.1 L1069.9,721.3 L1109.3,670 L1146,629"/>
    <path className="leg w5" d="M742.1,793.2 L883.5,772.6 L992.8,752.1 L1069.9,721.3 L1109.3,670 L1146,629" strokeDasharray="14 10"/>
    <text className="lbl-st" x="788.7" y="179.9" transform="rotate(-6.5 788.7 179.9)" style={{ fontSize: "18px" }}>Oxford Street</text>
    <text className="lbl-st" x="628.9" y="675.8" transform="rotate(49.6 628.9 675.8)" style={{ fontSize: "15px" }}>Regent Street</text>
    <text className="lbl-st" x="982" y="549.1" transform="rotate(-12 982 549.1)" style={{ fontSize: "15px" }}>Shaftesbury Avenue</text>
    <text className="lbl-st" x="1063.2" y="305.7" transform="rotate(80.6 1063.2 305.7)" style={{ fontSize: "14px" }}>Charing Cross Rd</text>
    <text className="lbl-st" x="724.1" y="268.9" transform="rotate(79.4 724.1 268.9)" style={{ fontSize: "14px" }}>Wardour St</text>
    <text className="lbl-st" x="867" y="565.7" transform="rotate(61.8 867 565.7)" style={{ fontSize: "14px" }}>Dean St</text>
    <text className="lbl-st" x="963.7" y="553.4" transform="rotate(-84.9 963.7 553.4)" style={{ fontSize: "13px" }}>Frith St</text>
    <text className="lbl-st" x="991.3" y="417.4" transform="rotate(75.9 991.3 417.4)" style={{ fontSize: "13px" }}>Greek St</text>
    <text className="lbl-st" x="566.9" y="270" transform="rotate(25.7 566.9 270)" style={{ fontSize: "14px" }}>Berwick St</text>
    <text className="lbl-st" x="531" y="428.3" transform="rotate(0 531 428.3)" style={{ fontSize: "13px" }}>Broadwick St</text>
    <text className="lbl-st" x="1046.7" y="515.1" transform="rotate(0 1046.7 515.1)" style={{ fontSize: "13px" }}>Old Compton St</text>
    <text className="lbl-st" x="806.4" y="462.9" transform="rotate(0 806.4 462.9)" style={{ fontSize: "12px" }}>Meard St</text>
    <text className="lbl-st" x="783.9" y="364.3" transform="rotate(0 783.9 364.3)" style={{ fontSize: "11px" }}>St Anne&rsquo;s Ct</text>
    <text className="lbl-st" x="847.7" y="799.3" transform="rotate(-8.3 847.7 799.3)" style={{ fontSize: "12px" }}>Coventry St</text>
    <text className="lbl-st" x="1089.6" y="686.2" transform="rotate(-52.5 1089.6 686.2)" style={{ fontSize: "11px" }}>Cranbourn St</text>
    <text className="lbl-st" x="706.8" y="522" transform="rotate(-7 706.8 522)" style={{ fontSize: "11px" }}>Peter St</text>
    <text className="lbl-st" x="841.7" y="234.8" transform="rotate(8.3 841.7 234.8)" style={{ fontSize: "11px" }}>Carlisle St</text>
    <text className="lbl-st" x="645.7" y="274.8" transform="rotate(-4.6 645.7 274.8)" style={{ fontSize: "11px" }}>Noel St</text>
    <text className="lbl-st" x="976.7" y="460.5" transform="rotate(-10.1 976.7 460.5)" style={{ fontSize: "10px" }}>Bateman St</text>
    <path className="arw w1" d="M-9,-6.5 L10,0 L-9,6.5 Z" transform="translate(959.3 503.8) rotate(174.6)"/>
    <path className="arw w1" d="M-9,-6.5 L10,0 L-9,6.5 Z" transform="translate(725.6 330.9) rotate(-102.8)"/>
    <circle className="walk-disc w1" cx="995.1" cy="394.7" r="16"/>
    <text className="walk-n" x="995.1" y="401.2" textAnchor="middle">1</text>
    <circle className="walk-disc w1" cx="877.2" cy="511.5" r="16"/>
    <text className="walk-n" x="877.2" y="518" textAnchor="middle">1</text>
    <circle className="walk-disc w1" cx="708.4" cy="239.7" r="16"/>
    <text className="walk-n" x="708.4" y="246.2" textAnchor="middle">1</text>
    <path className="arw w2" d="M-9,-6.5 L10,0 L-9,6.5 Z" transform="translate(449.8 256.2) rotate(161.2)"/>
    <circle className="walk-disc w2" cx="618.4" cy="228.5" r="16"/>
    <text className="walk-n" x="618.4" y="235" textAnchor="middle">2</text>
    <circle className="walk-disc w2" cx="289.7" cy="317" r="16"/>
    <text className="walk-n" x="289.7" y="323.5" textAnchor="middle">2</text>
    <path className="arw w2" d="M-9,-6.5 L10,0 L-9,6.5 Z" transform="translate(257.9 330.8) rotate(-21.5)"/>
    <path className="arw w2" d="M-9,-6.5 L10,0 L-9,6.5 Z" transform="translate(532.8 240.7) rotate(-7.5)"/>
    <circle className="walk-disc w2" cx="368.9" cy="286.1" r="16"/>
    <text className="walk-n" x="368.9" y="292.6" textAnchor="middle">2</text>
    <circle className="walk-disc w2" cx="702.3" cy="218.5" r="16"/>
    <text className="walk-n" x="702.3" y="225" textAnchor="middle">2</text>
    <path className="arw w3" d="M-9,-6.5 L10,0 L-9,6.5 Z" transform="translate(628.5 279.3) rotate(174.3)"/>
    <path className="arw w3" d="M-9,-6.5 L10,0 L-9,6.5 Z" transform="translate(653.5 493.7) rotate(9.1)"/>
    <circle className="walk-disc w3" cx="776.8" cy="242" r="16"/>
    <text className="walk-n" x="776.8" y="248.5" textAnchor="middle">3</text>
    <circle className="walk-disc w3" cx="610.1" cy="339.4" r="16"/>
    <text className="walk-n" x="610.1" y="345.9" textAnchor="middle">3</text>
    <circle className="walk-disc w3" cx="715.9" cy="503.7" r="16"/>
    <text className="walk-n" x="715.9" y="510.2" textAnchor="middle">3</text>
    <path className="arw w4" d="M-9,-6.5 L10,0 L-9,6.5 Z" transform="translate(795.6 688) rotate(112.7)"/>
    <circle className="walk-disc w4" cx="820.4" cy="628.6" r="16"/>
    <text className="walk-n" x="820.4" y="635.1" textAnchor="middle">4</text>
    <circle className="walk-disc w4" cx="764.2" cy="740.9" r="16"/>
    <text className="walk-n" x="764.2" y="747.4" textAnchor="middle">4</text>
    <path className="arw w5" d="M-9,-6.5 L10,0 L-9,6.5 Z" transform="translate(886.8 772) rotate(-10.6)"/>
    <path className="arw w5" d="M-9,-6.5 L10,0 L-9,6.5 Z" transform="translate(1011.4 744.7) rotate(-21.8)"/>
    <path className="arw w5" d="M-9,-6.5 L10,0 L-9,6.5 Z" transform="translate(1127.7 649.4) rotate(-48.1)"/>
    <circle className="walk-disc w5" cx="823.5" cy="781.3" r="16"/>
    <text className="walk-n" x="823.5" y="787.8" textAnchor="middle">5</text>
    <circle className="walk-disc w5" cx="945.1" cy="761.1" r="16"/>
    <text className="walk-n" x="945.1" y="767.6" textAnchor="middle">5</text>
    <circle className="walk-disc w5" cx="1062.3" cy="724.4" r="16"/>
    <text className="walk-n" x="1062.3" y="730.9" textAnchor="middle">5</text>
    <g><circle className="stn" cx="1037.8" cy="146.8" r="8.5"/><rect className="stn-bar" x="1029.3" y="145.2" width="17" height="3.2"/><text className="lbl-stn" x="1052.8" y="151.8" textAnchor="start">Tottenham Court Rd</text></g>
    <g><circle className="stn" cx="384.8" cy="270" r="8.5"/><rect className="stn-bar" x="376.3" y="268.4" width="17" height="3.2"/><text className="lbl-stn" x="384.8" y="296" textAnchor="middle">Oxford Circus</text></g>
    <g><circle className="stn" cx="127.4" cy="372.5" r="8.5"/><rect className="stn-bar" x="118.9" y="370.9" width="17" height="3.2"/><text className="lbl-stn" x="127.4" y="398.5" textAnchor="middle">Bond Street</text></g>
    <g><circle className="stn" cx="742.1" cy="793.2" r="8.5"/><rect className="stn-bar" x="733.6" y="791.6" width="17" height="3.2"/><text className="lbl-stn" x="742.1" y="819.2" textAnchor="middle">Piccadilly Circus</text></g>
    <g><circle className="stn" cx="1109.3" cy="670" r="8.5"/><rect className="stn-bar" x="1100.8" y="668.4" width="17" height="3.2"/><text className="lbl-stn" x="1109.3" y="696" textAnchor="middle">Leicester Square</text></g>
    <polygon className="base-star" points="912.5,232.6 918,246.9 933.4,247.8 921.5,257.5 925.4,272.4 912.5,264.1 899.5,272.4 903.4,257.5 891.5,247.8 906.9,246.9"/>
    <text className="lbl-big" x="946.5" y="246.6">Soho Square</text>
    <text className="lbl-place" x="946.5" y="268.6">Base camp — the Hut</text>
    <text className="lbl-sub" x="946.5" y="288.6">Check-in 12–1pm · stops 1 and 2</text>
    <rect className="stop" x="785" y="521.7" width="30" height="30" transform="rotate(45 800 536.7)"/><text className="stop-n" x="800" y="542.7" textAnchor="middle">3</text>
    <text className="lbl-big" x="760" y="538.7" textAnchor="end">St Anne&rsquo;s Churchyard</text>
    <text className="lbl-sub" x="760" y="558.7" textAnchor="end">Stop 3 · 4.30–5.30pm</text>
    <rect className="stop" x="727.1" y="778.2" width="30" height="30" transform="rotate(45 742.1 793.2)"/><text className="stop-n" x="742.1" y="799.2" textAnchor="middle">4</text>
    <text className="lbl-big" x="742.1" y="841.2" textAnchor="middle">Eros Statue · Piccadilly Circus</text>
    <text className="lbl-sub" x="742.1" y="861.2" textAnchor="middle">Stop 4 · 6–7pm</text>
    <circle className="spot" cx="639.3" cy="434.1" r="7"/>
    <text className="lbl-big" x="619.3" y="410.1" textAnchor="end">Berwick Street Market</text>
    <text className="lbl-big" x="1152" y="599" textAnchor="end">To BloodSport</text>
    <text className="lbl-sub" x="1152" y="619" textAnchor="end">Bonus, from 7pm</text>
    <text className="lbl-sub" x="1053.8" y="170.8">Participants likely arrive here</text>
    <rect className="box" x="56" y="48" width="452" height="196"/>
    <rect className="box-in" x="64" y="56" width="436" height="180"/>
    <text className="cart-eyebrow" x="86" y="96">World Zombie Day: London</text>
    <text className="cart-title" x="84" y="152">The route</text>
    <text className="cart-sub" x="86" y="186">Base camp: Soho Square</text>
    <text className="cart-sub" x="86" y="212">Saturday 10 October · from 12 noon</text>
    <rect className="box" x="56" y="586" width="438" height="326"/>
    <rect className="box-in" x="64" y="594" width="422" height="310"/>
    <text className="key-title" x="84" y="630">Reading the map</text>
    <polygon className="base-star" points="100,648 103.3,656.5 112.4,657 105.3,662.7 107.6,671.5 100,666.6 92.4,671.5 94.7,662.7 87.6,657 96.7,656.5"/>
    <text className="key-t" x="140" y="666">Base camp — Soho Square (stops 1 and 2)</text>
    <rect className="stop" x="89" y="677" width="22" height="22" transform="rotate(45 100 688)"/>
    <text className="key-t" x="140" y="693">A timed stop, numbered as on the list</text>
    <path className="leg w1" d="M74,715 L126,715"/>
    <circle className="walk-disc w1" cx="100" cy="715" r="13"/>
    <text className="walk-n" x="100" y="720" textAnchor="middle" style={{ fontSize: "15px" }}>1</text>
    <text className="key-t" x="140" y="720">Walk 1 · 1.15–1.45pm · Meard St loop</text>
    <path className="leg w2" d="M74,742 L126,742"/>
    <circle className="walk-disc w2" cx="100" cy="742" r="13"/>
    <text className="walk-n" x="100" y="747" textAnchor="middle" style={{ fontSize: "15px" }}>2</text>
    <text className="key-t" x="140" y="747">Walk 2 · 2–3pm · Oxford St, Bond St, back</text>
    <path className="leg w3" d="M74,769 L126,769"/>
    <circle className="walk-disc w3" cx="100" cy="769" r="13"/>
    <text className="walk-n" x="100" y="774" textAnchor="middle" style={{ fontSize: "15px" }}>3</text>
    <text className="key-t" x="140" y="774">Walk 3 · 4–4.30pm · Market and churchyard</text>
    <path className="leg w4" d="M74,796 L126,796"/>
    <circle className="walk-disc w4" cx="100" cy="796" r="13"/>
    <text className="walk-n" x="100" y="801" textAnchor="middle" style={{ fontSize: "15px" }}>4</text>
    <text className="key-t" x="140" y="801">Walk 4 · 5.30–6pm · To Piccadilly Circus</text>
    <path className="leg w5" d="M74,823 L126,823" strokeDasharray="14 10"/>
    <circle className="walk-disc w5" cx="100" cy="823" r="13"/>
    <text className="walk-n" x="100" y="828" textAnchor="middle" style={{ fontSize: "15px" }}>5</text>
    <text className="key-t" x="140" y="828">Walk 5 · from 7pm · To BloodSport (optional)</text>
    <circle className="stn" cx="100" cy="850" r="11"/>
    <rect className="stn-bar" x="89" y="848" width="22" height="4"/>
    <text className="key-t" x="140" y="855">Underground station</text>
    <rect className="scale-a" x="968" y="856" width="92.8" height="7"/>
    <rect className="scale-b" x="1060.8" y="856" width="92.8" height="7"/>
    <text className="lbl-sub" x="968" y="847">0</text>
    <text className="lbl-sub" x="1153.6" y="847" textAnchor="end">200 m</text>
    <text className="lbl-sub" x="968" y="881">True in Soho. Walks 2 and 5 reach</text>
    <text className="lbl-sub" x="968" y="899">further than the plate shows.</text>
    <circle className="compass" cx="1178" cy="120" r="30"/>
    <polygon className="compass-n" points="1178,88 1168,132 1178,124 1188,132"/>
    <text className="compass-t" x="1178" y="80" textAnchor="middle">N</text>
    </svg>
  )
}
