import type { SectionProps } from "./shared"

export function PosterSection({ T }: SectionProps) {
  return (
    <>
      {/* ── 8b · Classified: The Redacted Conspiracy Report ──
          Aged grey-green poster whose headline words hide under solid black
          redaction bars; moving the pointer over them rubs the ink away like
          an eraser, revealing the words beneath. Ghost letters show faintly
          on the bars. Plain-DOM canvas rub, armed by an inline script. */}
      <section id="redacted-report" className="relative border-b-4 border-black bg-[#232019] px-4 py-14 sm:px-10 sm:py-20">
        <div suppressHydrationWarning className="redact-poster relative mx-auto flex min-h-[340px] w-full max-w-[900px] flex-col items-center justify-between gap-8 overflow-hidden px-5 py-7 text-center sm:aspect-[3/2] sm:gap-0 sm:px-10 sm:py-9">
          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.35em] text-[#1a1a1a]/80 sm:text-[10px]">
            <T k="poster.kicker">Dead Good Club Official</T>
          </p>
          <h2 className="redact-title font-mono text-[clamp(1.9rem,6.6vw,4.6rem)] font-bold uppercase leading-[1.65] tracking-[0.04em] text-[#1a1a1a]">
            <span className="block">
              <span className="redact-word"><T k="poster.line1">THE REDACTED</T></span>
            </span>
            <span className="block">
              <span className="redact-word"><T k="poster.line2">CONSPIRACY</T></span>
            </span>
            <span className="block">
              <span className="redact-word"><T k="poster.line3">REPORT</T></span>
            </span>
          </h2>
          {/* placeholder CTA — still styled as a redaction bar with ghost
              lettering, centred beneath the headline */}
          <a
            href="#"
            className="redact-reveal-btn inline-block px-9 py-3 font-mono text-[12px] font-bold uppercase tracking-[0.25em] sm:px-12 sm:text-[14px]"
          >
            <T k="poster.button">Button</T>
          </a>
          <div className="flex flex-col items-center gap-2">
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-[#1a1a1a]/75 sm:text-[10px]">
              <T k="poster.footer">Classified Document &mdash; Do Not Distribute</T>
            </p>
            {/* tick to paint the redaction bars back on */}
            <label className="redact-reset flex min-h-[24px] cursor-pointer select-none items-center gap-1.5 px-1 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#1a1a1a]/80 sm:text-[10px]">
              <input type="checkbox" className="h-3 w-3 cursor-pointer border-black accent-[#1a1a1a]" />
              <T k="poster.redact">Redact</T>
            </label>
          </div>
        </div>
        {/* Paint a black bar over each word, ghost the letters onto it, and
            rub it away (destination-out soft brush) as the pointer moves */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){function init(){var p=document.querySelector('.redact-poster');if(!p||!document.createElement('canvas').getContext)return;if(p.getAttribute('data-redact-init'))return;p.setAttribute('data-redact-init','1');var words=[].slice.call(p.querySelectorAll('.redact-word'));var state=[];function setup(){state=words.map(function(w){var old=w.querySelector('canvas');if(old)old.remove();var r=w.getBoundingClientRect();var padX=r.height*0.40,padY=-r.height*0.11;var cw=r.width+padX*2,ch=r.height+padY*2;var dpr=window.devicePixelRatio||1;var c=document.createElement('canvas');c.width=Math.max(1,Math.round(cw*dpr));c.height=Math.max(1,Math.round(ch*dpr));c.style.cssText='position:absolute;left:'+(-padX)+'px;top:'+(-padY)+'px;width:'+cw+'px;height:'+ch+'px;pointer-events:none;';var x=c.getContext('2d');x.scale(dpr,dpr);x.fillStyle='#151515';x.fillRect(0,0,cw,ch);var cs=getComputedStyle(w);x.font=cs.fontWeight+' '+cs.fontSize+' '+cs.fontFamily;x.fillStyle='rgba(190,187,178,0.22)';x.textBaseline='alphabetic';x.fillText(w.textContent,padX,padY+r.height*0.68);w.appendChild(c);return{el:w,ctx:x,padX:padX,padY:padY}})}function rub(e){state.forEach(function(s){var r=s.el.getBoundingClientRect();var x=e.clientX-(r.left-s.padX),y=e.clientY-(r.top-s.padY);var R=Math.max(34,r.height*0.85);if(x<-R||y<-R||x>r.width+s.padX*2+R||y>r.height+s.padY*2+R)return;var ctx=s.ctx;ctx.globalCompositeOperation='destination-out';var g=ctx.createRadialGradient(x,y,0,x,y,R);g.addColorStop(0,'rgba(0,0,0,0.5)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,R,0,6.2832);ctx.fill();ctx.globalCompositeOperation='source-over'})}p.addEventListener('pointermove',rub);p.addEventListener('pointerdown',rub);var box=p.querySelector('.redact-reset input');if(box){box.addEventListener('change',function(){if(box.checked){setup();setTimeout(function(){box.checked=false},450)}})}if(document.fonts&&document.fonts.ready){document.fonts.ready.then(setup)}else{setup()}var t;window.addEventListener('resize',function(){clearTimeout(t);t=setTimeout(setup,150)})}init();window.addEventListener('load',function(){setTimeout(init,120);setTimeout(init,1200)})})();",
          }}
        />
      </section>
    </>
  )
}
