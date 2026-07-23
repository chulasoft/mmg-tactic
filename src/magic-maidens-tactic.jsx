import { useState, useReducer, useEffect, useCallback, useRef, useMemo } from "react"
import { Sword, Shield, Heart, Zap, BookOpen, Settings, ChevronRight,
         RotateCcw, Play, User, Map, Star, Scroll, Check, X, ArrowLeft,
         Trophy, Skull, Eye, Lock, Unlock, Crosshair, Move, SkipForward,
         Database, FastForward, Info, Layers, Wind } from "lucide-react"

// ═══════════════════════════════════════════════════════════════════
//  STYLES
// ═══════════════════════════════════════════════════════════════════
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,ital,wght@9..144,0,400;9..144,0,600;9..144,0,700;9..144,0,900;9..144,1,600;9..144,1,700&family=Outfit:wght@300;400;500;600;700&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --bg:#070612;--bg2:#0d0b22;--panel:#131130;--panel2:#1b1945;
    --border:rgba(255,255,255,.07);--b2:rgba(255,255,255,.14);
    --teal:#2dd4bf;--gold:#fbbf24;--purple:#8b5cf6;--red:#f87171;--green:#4ade80;
    --txt:#e2e0f5;--txt2:#94a3b8;--txt3:#64748b;
  }
  body,html{background:var(--bg);color:var(--txt);font-family:'Outfit',system-ui,sans-serif;font-size:15px;height:100%;overflow:hidden}
  @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
  @keyframes slideLeft{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:none}}
  @keyframes glow{0%,100%{text-shadow:0 0 30px rgba(251,191,36,.35)}50%{text-shadow:0 0 60px rgba(251,191,36,.65),0 0 100px rgba(251,191,36,.2)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}
  @keyframes tilePop{from{opacity:0;transform:scale(.7)}to{opacity:1;transform:scale(1)}}
  @keyframes heroFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
  @keyframes typewriter{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
  @keyframes spin{to{transform:rotate(360deg)}}
  .screen{animation:fadeIn .35s ease both}
  .slide{animation:slideLeft .3s ease both}
  ::-webkit-scrollbar{width:5px}
  ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:3px}
  @keyframes floatUp{0%{opacity:0;transform:translateY(4px) scale(.7)}15%{opacity:1;transform:translateY(0) scale(1.1)}30%{transform:translateY(-4px) scale(1)}100%{opacity:0;transform:translateY(-28px) scale(.95)}}
  @keyframes hitShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-2px)}75%{transform:translateX(2px)}}
  @keyframes cardFlourish{0%{transform:translate(-50%,-50%) scale(.6);opacity:0}18%{transform:translate(-50%,-50%) scale(1.15);opacity:1}70%{transform:translate(-50%,-50%) scale(1.05);opacity:1}100%{transform:translate(-50%,-50%) scale(.42) translateY(70px);opacity:0}}
  @keyframes tokenSpawn{0%{opacity:0;transform:scale(.4)}60%{transform:scale(1.12)}100%{opacity:1;transform:scale(1)}}
  @keyframes warpIn{0%{opacity:0;transform:scaleX(.05) scaleY(1.4)}40%{opacity:1;transform:scaleX(1.15) scaleY(.9)}100%{opacity:1;transform:scale(1)}}
  .floater{position:absolute;pointer-events:none;font-family:'Fraunces',serif;font-style:italic;font-weight:700;font-variant-numeric:tabular-nums;z-index:40;animation:floatUp .9s ease-out forwards;text-shadow:0 2px 6px rgba(0,0,0,.7)}
  .board-token{position:absolute;transition:left .28s cubic-bezier(.4,0,.2,1),top .28s cubic-bezier(.4,0,.2,1),opacity .4s,transform .4s;z-index:10}
  .board-token.dying{opacity:0;transform:scale(.5) rotate(9deg);pointer-events:none}
  .board-token.flashing{animation:hitShake .22s ease}
  .board-token.flashing .token{filter:brightness(2.4)}
  .card-flourish{position:fixed;left:50%;top:44%;z-index:200;pointer-events:none;animation:cardFlourish .8s ease-out forwards;width:220px;padding:18px 20px;border-radius:14px;background:linear-gradient(160deg,#1a1640,#12102e);box-shadow:0 0 60px rgba(251,191,36,.25),0 20px 50px rgba(0,0,0,.6)}
  @keyframes bannerSweep{0%{opacity:0;transform:translateX(-40px)}18%{opacity:1;transform:translateX(0)}80%{opacity:1;transform:translateX(0)}100%{opacity:0;transform:translateX(40px)}}
  .phase-banner{position:fixed;left:0;right:0;top:42%;z-index:150;pointer-events:none;display:flex;align-items:center;justify-content:center;gap:16px;animation:bannerSweep 1.1s ease both}
  .phase-banner .rule{height:1px;flex:1;max-width:180px}
  @media(prefers-reduced-motion:reduce){.floater{animation-duration:.4s}.board-token{transition:none}.board-token.flashing{animation:none}.card-flourish{animation-duration:.3s}}
  @media(prefers-reduced-motion:reduce){.phase-banner{animation-duration:.5s}}
  .display-num{font-family:'Fraunces',serif;font-variant-numeric:tabular-nums}
  .label-xs{font-family:'Outfit',sans-serif;font-size:.6rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase}
  .heading{font-family:'Fraunces',serif;font-weight:700}
  .heading-italic{font-family:'Fraunces',serif;font-weight:700;font-style:italic}
  .tile{display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.04);
    position:relative;transition:background .12s;cursor:pointer;overflow:visible}
  .tile:hover:not(.t-wall):not(.t-occupied){background:rgba(255,255,255,.05)!important}
  .t-wall{background:linear-gradient(135deg,#18152e,#0e0d1e)!important;cursor:default}
  .t-move{background:rgba(45,212,191,.13)!important;animation:tilePop .15s ease both}
  .t-move::after{content:'';position:absolute;inset:2px;border:1px solid rgba(45,212,191,.25);border-radius:2px;pointer-events:none}
  .t-atk{background:rgba(248,113,113,.13)!important;animation:tilePop .15s ease both}
  .t-atk::after{content:'';position:absolute;inset:2px;border:1px solid rgba(248,113,113,.25);border-radius:2px;pointer-events:none}
  .t-hero-zone{background:#0b0a1e}
  .t-mid-zone{background:#090818}
  .t-enemy-zone{background:#0d0813}
  .token{width:30px;height:30px;border-radius:50%;border:2px solid;overflow:hidden;
    display:flex;align-items:center;justify-content:center;font-size:.8rem;
    transition:all .2s;flex-shrink:0;position:relative}
  .token img{width:100%;height:100%;object-fit:cover;object-position:20% 10%}
  .token-sel{box-shadow:0 0 0 3px rgba(45,212,191,.7),0 0 12px rgba(45,212,191,.3)}
  .token-done{opacity:.45;filter:grayscale(.5)}
  .hcard{border-radius:10px;overflow:hidden;position:relative;cursor:pointer;
    transition:transform .2s,box-shadow .2s}
  .hcard:hover{transform:translateY(-4px) scale(1.02);z-index:5}
  .hcard img{width:100%;height:100%;object-fit:cover;object-position:20% 10%;display:block;
    transition:transform .3s}
  .hcard:hover img{transform:scale(1.06)}
  .hcard-sel{box-shadow:0 0 0 3px var(--teal),0 12px 40px rgba(45,212,191,.2)}
  .acard{background:var(--panel2);border:1px solid var(--border);border-radius:8px;
    padding:8px 10px;cursor:pointer;transition:all .15s}
  .acard:hover{border-color:var(--b2);transform:translateY(-2px)}
  .acard-sel{border-color:rgba(45,212,191,.5)!important;background:rgba(45,212,191,.08)!important}
  .acard-ult{border-color:rgba(251,191,36,.22)!important;background:rgba(251,191,36,.05)!important}
  .acard-ult.acard-sel{border-color:rgba(251,191,36,.6)!important;background:rgba(251,191,36,.12)!important}
  .btn{display:flex;align-items:center;justify-content:center;gap:7px;padding:9px 18px;
    border-radius:8px;border:1px solid;font-weight:600;font-size:.82rem;cursor:pointer;
    transition:all .14s;user-select:none;letter-spacing:.02em;font-family:inherit}
  .btn:active{transform:scale(.95)}
  .btn-teal{background:rgba(45,212,191,.12);border-color:rgba(45,212,191,.35);color:#2dd4bf}
  .btn-teal:hover{background:rgba(45,212,191,.22);border-color:rgba(45,212,191,.6)}
  .btn-gold{background:rgba(251,191,36,.12);border-color:rgba(251,191,36,.35);color:#fbbf24}
  .btn-gold:hover{background:rgba(251,191,36,.22)}
  .btn-purple{background:rgba(139,92,246,.12);border-color:rgba(139,92,246,.35);color:#a78bfa}
  .btn-purple:hover{background:rgba(139,92,246,.22)}
  .btn-red{background:rgba(248,113,113,.12);border-color:rgba(248,113,113,.35);color:#f87171}
  .btn-red:hover{background:rgba(248,113,113,.22)}
  .btn-ghost{background:transparent;border-color:rgba(255,255,255,.1);color:var(--txt2)}
  .btn-ghost:hover{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.2)}
  .btn:disabled{opacity:.35;cursor:not-allowed;transform:none!important}
  .btn-sm{padding:6px 13px;font-size:.75rem}
  .btn-lg{padding:13px 26px;font-size:.9rem}
  .panel{background:var(--panel);border:1px solid var(--border);border-radius:12px}
  .chip{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:6px;
    font-size:.68rem;font-weight:700;letter-spacing:.06em}
  .chip-n{background:rgba(96,165,250,.15);color:#60a5fa;border:1px solid rgba(96,165,250,.25)}
  .chip-u{background:rgba(251,191,36,.12);color:#fbbf24;border:1px solid rgba(251,191,36,.25)}
  .hpbar-bg{background:rgba(255,255,255,.08);border-radius:3px;height:4px;overflow:hidden}
  .hpbar{height:100%;border-radius:3px;transition:width .4s ease}
  .narrator-txt{font-family:'Fraunces',Georgia,serif;font-style:italic;font-size:1.05rem;line-height:1.95;
    color:var(--txt);animation:typewriter .4s ease both}
  .glow-gold{animation:glow 3s ease-in-out infinite}
  .tab{padding:10px 18px;font-size:.8rem;font-weight:600;cursor:pointer;border-bottom:2px solid transparent;
    color:var(--txt2);transition:all .15s;user-select:none}
  .tab:hover{color:var(--txt)}
  .tab-active{color:var(--gold);border-bottom-color:var(--gold)}
`

// ═══════════════════════════════════════════════════════════════════
//  DATA
// ═══════════════════════════════════════════════════════════════════
const GH = 'https://chulasoft.github.io/magic-maidens-tactic/asset-tactic/'

const HEROES = [
  {id:'elena',n:'Elena',r:'Mage Fighter',t:'Balanced',cl:'#2dd4bf',ic:'⚔',img:`${GH}01elena.png`,
   hp:25,at:4,mv:3,rg:1,growth:{hp:5,at:4,mv:.33,rg:0},
   bi:'Former captain of the Royal Guard. Abandoned her post after a sabotaged mission cost her comrades their lives. Now a sellsword seeking a cause worth fighting for.',
   pl:'Versatile front-liner. Solid offense and defense. Best when adapting to what the party needs.'},
  {id:'yumi',n:'Yumi',r:'Sage Ranger',t:'Ranged',cl:'#60a5fa',ic:'🏹',img:`${GH}02yumi.png`,
   hp:18,at:4,mv:3,rg:3,growth:{hp:2,at:4.5,mv:.5,rg:.7},
   bi:'Last guardian of the Whisperwood. Guided by dying nature spirits. Carries a bow carved from a sacred ancient tree.',
   pl:'Back-line sniper. Keep her safe and find clear sightlines. Her Range growth is exceptional.'},
  {id:'lilith',n:'Lilith',r:'Warlock',t:'Glass Cannon',cl:'#c084fc',ic:'🔮',img:`${GH}03lilith.png`,
   hp:16,at:6,mv:2,rg:2,growth:{hp:1,at:6,mv:.5,rg:.5},
   bi:'Exiled from the Spire Academy for forbidden demonic research. Power through pacts with otherworldly entities.',
   pl:'Maximum damage, minimum survival. Protect at all costs. Her ultimates can erase the toughest foes.'},
  {id:'aria',n:'Aria',r:'Trickster Mage',t:'Mobility',cl:'#f472b6',ic:'✨',img:`${GH}04aria.png`,
   hp:20,at:2,mv:4,rg:2,growth:{hp:5,at:1.5,mv:.67,rg:.5},
   bi:'Street orphan turned illusionist. Learned magic as a survival tool. Fiercely loyal despite her carefree mask.',
   pl:'Master of positioning. Use unmatched mobility to harass back lines and create chaos.'},
  {id:'freya',n:'Freya',r:'Mage Knight',t:'Tank',cl:'#fb923c',ic:'🛡',img:`${GH}05freya.png`,
   hp:30,at:3,mv:1,rg:1,growth:{hp:7.5,at:1,mv:.5,rg:0},
   bi:'Last knight of the shattered Order of the Silver Shield. Bears the weight of her fallen comrades.',
   pl:'Immovable anchor. Park her in choke points. Her HP growth is absurd — she will not fall.'},
  {id:'nia',n:'Nia',r:'Beast Master',t:'Skirmisher',cl:'#a3e635',ic:'🐾',img:`${GH}06nia.png`,
   hp:22,at:4,mv:4,rg:1,growth:{hp:3,at:4.5,mv:.5,rg:.3},
   bi:'Raised by wolves in the wild. Views every battle as a hunt. Her bond with her alpha companion is unbreakable.',
   pl:'Aggressive flanker. Hit-and-run specialist. Chase down isolated targets without mercy.'},
  {id:'seraphina',n:'Seraphina',r:'Arch Bishop',t:'Healer',cl:'#fbbf24',ic:'✝',img:`${GH}07seraphina.png`,
   hp:22,at:2,mv:2,rg:3,growth:{hp:4.5,at:3,mv:.5,rg:.3},
   bi:'Cathedral acolyte who received a divine vision of the coming darkness. Left her order to answer the call.',
   pl:'Indispensable support. Her healing can swing impossible fights. Keep her behind the front line.'},
  {id:'mei',n:'Mei',r:'Techno Mage',t:'Artillery',cl:'#22d3ee',ic:'⚡',img:`${GH}08mei.png`,
   hp:18,at:3,mv:4,rg:4,growth:{hp:4.5,at:2.5,mv:.5,rg:.5},
   bi:'Inventor from isolationist Automata. Fled with prototype gadgets when her council refused to act against the Demon Lord.',
   pl:'Mobile artillery. Attack from extreme range while kiting. Incredible range + mobility combo.'},
]

const CARDS = {
  elena:[
    {id:'MF_N01',lv:1,tp:'N',n:'Runic Strike',d:'+2 ATK this turn',fx:[{t:'B',s:'at',v:2}]},
    {id:'MF_N02',lv:1,tp:'N',n:'Kinetic Shield',d:'Gain 1 Damage Reduction',fx:[{t:'D',v:1}]},
    {id:'MF_N03',lv:3,tp:'N',n:'Blade Rush',d:'+2 MOV this turn',fx:[{t:'B',s:'mv',v:2}]},
    {id:'MF_N04',lv:6,tp:'N',n:'Absorb Magic',d:'Heal 4 HP',fx:[{t:'H',v:4}]},
    {id:'MF_N05',lv:12,tp:'N',n:'Forceful Strike',d:'+3 ATK this turn',fx:[{t:'B',s:'at',v:3}]},
    {id:'MF_N06',lv:18,tp:'N',n:'Battle Focus',d:'Gain +1 Move ATP',fx:[{t:'X',s:'mv',v:1}]},
    {id:'MF_N07',lv:22,tp:'N',n:'Imbued Blade',d:'+4 ATK this turn',fx:[{t:'B',s:'at',v:4}]},
    {id:'MF_N08',lv:28,tp:'N',n:'Rapid Assault',d:'+1 MOV and +2 ATK',fx:[{t:'B',s:'mv',v:1},{t:'B',s:'at',v:2}]},
    {id:'MF_U01',lv:9,tp:'U',n:'Arcane Surge',d:'+2 ATK and +2 MOV this turn',fx:[{t:'B',s:'at',v:2},{t:'B',s:'mv',v:2}]},
    {id:'MF_U02',lv:19,tp:'U',n:'Spellbreaker',d:'+5 ATK this turn',fx:[{t:'B',s:'at',v:5}]},
    {id:'MF_U03',lv:29,tp:'U',n:'Time Shift',d:'Gain +1 Attack ATP',fx:[{t:'X',s:'at',v:1}]},
  ],
  yumi:[
    {id:'SR_N01',lv:1,tp:'N',n:'Trueshot',d:'+2 RNG this turn',fx:[{t:'B',s:'rg',v:2}]},
    {id:'SR_N02',lv:1,tp:'N',n:"Hunter's Pace",d:'+2 MOV this turn',fx:[{t:'B',s:'mv',v:2}]},
    {id:'SR_N03',lv:3,tp:'N',n:'Pinpoint',d:'+1 ATK and +1 RNG',fx:[{t:'B',s:'at',v:1},{t:'B',s:'rg',v:1}]},
    {id:'SR_N04',lv:6,tp:'N',n:'Eagle Eye',d:'+3 RNG this turn',fx:[{t:'B',s:'rg',v:3}]},
    {id:'SR_N05',lv:12,tp:'N',n:'Double Tap',d:'+2 ATK this turn',fx:[{t:'B',s:'at',v:2}]},
    {id:'SR_N06',lv:18,tp:'N',n:'Piercing Arrow',d:'+3 ATK this turn',fx:[{t:'B',s:'at',v:3}]},
    {id:'SR_N07',lv:22,tp:'N',n:'Longshot',d:'+5 RNG this turn',fx:[{t:'B',s:'rg',v:5}]},
    {id:'SR_N08',lv:28,tp:'N',n:'Heavy Bolt',d:'+4 ATK this turn',fx:[{t:'B',s:'at',v:4}]},
    {id:'SR_U01',lv:9,tp:'U',n:'Swift Quiver',d:'Gain +1 Attack ATP',fx:[{t:'X',s:'at',v:1}]},
    {id:'SR_U02',lv:19,tp:'U',n:'Deadeye',d:'+3 ATK and +2 RNG',fx:[{t:'B',s:'at',v:3},{t:'B',s:'rg',v:2}]},
    {id:'SR_U03',lv:29,tp:'U',n:'One with the Wind',d:'Gain +1 Atk & Move ATP',fx:[{t:'X',s:'at',v:1},{t:'X',s:'mv',v:1}]},
  ],
  lilith:[
    {id:'WL_N01',lv:1,tp:'N',n:'Blood Magic',d:'+3 ATK this turn',fx:[{t:'B',s:'at',v:3}]},
    {id:'WL_N02',lv:1,tp:'N',n:'Shadow Step',d:'+1 MOV this turn',fx:[{t:'B',s:'mv',v:1}]},
    {id:'WL_N03',lv:3,tp:'N',n:'Life Tap',d:'+2 ATK and Heal 2 HP',fx:[{t:'B',s:'at',v:2},{t:'H',v:2}]},
    {id:'WL_N04',lv:6,tp:'N',n:'Hex Bolt',d:'+4 ATK this turn',fx:[{t:'B',s:'at',v:4}]},
    {id:'WL_N05',lv:12,tp:'N',n:'Siphon Power',d:'+3 ATK and Heal 2 HP',fx:[{t:'B',s:'at',v:3},{t:'H',v:2}]},
    {id:'WL_N06',lv:18,tp:'N',n:'Hellfire',d:'+5 ATK this turn',fx:[{t:'B',s:'at',v:5}]},
    {id:'WL_N07',lv:22,tp:'N',n:'Eldritch Blast',d:'+6 ATK this turn',fx:[{t:'B',s:'at',v:6}]},
    {id:'WL_N08',lv:28,tp:'N',n:'Frenzied Casting',d:'Gain +1 Attack ATP',fx:[{t:'X',s:'at',v:1}]},
    {id:'WL_U01',lv:9,tp:'U',n:'Annihilate',d:'+5 ATK and +1 RNG',fx:[{t:'B',s:'at',v:5},{t:'B',s:'rg',v:1}]},
    {id:'WL_U02',lv:19,tp:'U',n:'Soul Devour',d:'+3 ATK and Heal 8 HP',fx:[{t:'B',s:'at',v:3},{t:'H',v:8}]},
    {id:'WL_U03',lv:29,tp:'U',n:'Lord of Chaos',d:'+10 ATK this turn',fx:[{t:'B',s:'at',v:10}]},
  ],
  aria:[
    {id:'TM_N01',lv:1,tp:'N',n:'Blink',d:'+3 MOV this turn',fx:[{t:'B',s:'mv',v:3}]},
    {id:'TM_N02',lv:1,tp:'N',n:'Phantom Strike',d:'+1 ATK and +1 MOV',fx:[{t:'B',s:'at',v:1},{t:'B',s:'mv',v:1}]},
    {id:'TM_N03',lv:3,tp:'N',n:'Quick Step',d:'+1 MOV and Heal 2 HP',fx:[{t:'B',s:'mv',v:1},{t:'H',v:2}]},
    {id:'TM_N04',lv:6,tp:'N',n:'Haste',d:'+4 MOV this turn',fx:[{t:'B',s:'mv',v:4}]},
    {id:'TM_N05',lv:12,tp:'N',n:'Deceptive Stab',d:'+2 ATK and +1 MOV',fx:[{t:'B',s:'at',v:2},{t:'B',s:'mv',v:1}]},
    {id:'TM_N06',lv:18,tp:'N',n:'Escape Route',d:'+5 MOV this turn',fx:[{t:'B',s:'mv',v:5}]},
    {id:'TM_N07',lv:22,tp:'N',n:'Phantom Menace',d:'+3 ATK this turn',fx:[{t:'B',s:'at',v:3}]},
    {id:'TM_N08',lv:28,tp:'N',n:'Cunning Action',d:'Gain +1 Move ATP',fx:[{t:'X',s:'mv',v:1}]},
    {id:'TM_U01',lv:9,tp:'U',n:'Phase Shift',d:'+4 MOV and 1 DR',fx:[{t:'B',s:'mv',v:4},{t:'D',v:1}]},
    {id:'TM_U02',lv:19,tp:'U',n:'Vortex Blade',d:'+4 ATK and +2 MOV',fx:[{t:'B',s:'at',v:4},{t:'B',s:'mv',v:2}]},
    {id:'TM_U03',lv:29,tp:'U',n:'Paradox',d:'Gain +1 Atk & Move ATP',fx:[{t:'X',s:'at',v:1},{t:'X',s:'mv',v:1}]},
  ],
  freya:[
    {id:'MK_N01',lv:1,tp:'N',n:'Shield Wall',d:'Gain 2 Damage Reduction',fx:[{t:'D',v:2}]},
    {id:'MK_N02',lv:1,tp:'N',n:"Knight's Vow",d:'Heal 3 HP',fx:[{t:'H',v:3}]},
    {id:'MK_N03',lv:3,tp:'N',n:'Vanguard',d:'+1 MOV and 1 DR',fx:[{t:'B',s:'mv',v:1},{t:'D',v:1}]},
    {id:'MK_N04',lv:6,tp:'N',n:'Bulwark',d:'Gain 3 Damage Reduction',fx:[{t:'D',v:3}]},
    {id:'MK_N05',lv:12,tp:'N',n:'Hold the Line',d:'2 DR and Heal 2 HP',fx:[{t:'D',v:2},{t:'H',v:2}]},
    {id:'MK_N06',lv:18,tp:'N',n:'Heavy Swing',d:'+2 ATK this turn',fx:[{t:'B',s:'at',v:2}]},
    {id:'MK_N07',lv:22,tp:'N',n:'Adamant Will',d:'Gain 4 Damage Reduction',fx:[{t:'D',v:4}]},
    {id:'MK_N08',lv:28,tp:'N',n:"Guardian's Blessing",d:'Heal 4 HP and 1 DR',fx:[{t:'H',v:4},{t:'D',v:1}]},
    {id:'MK_U01',lv:9,tp:'U',n:'Unbreakable',d:'3 DR and Heal 3 HP',fx:[{t:'D',v:3},{t:'H',v:3}]},
    {id:'MK_U02',lv:19,tp:'U',n:'Divine Judgment',d:'+4 ATK and +2 RNG',fx:[{t:'B',s:'at',v:4},{t:'B',s:'rg',v:2}]},
    {id:'MK_U03',lv:29,tp:'U',n:'Avatar of Fortitude',d:'Full Heal and 3 DR',fx:[{t:'H',v:999},{t:'D',v:3}]},
  ],
  nia:[
    {id:'BM_N01',lv:1,tp:'N',n:'Pounce',d:'+1 ATK and +2 MOV',fx:[{t:'B',s:'at',v:1},{t:'B',s:'mv',v:2}]},
    {id:'BM_N02',lv:1,tp:'N',n:'Primal Rage',d:'+2 ATK this turn',fx:[{t:'B',s:'at',v:2}]},
    {id:'BM_N03',lv:3,tp:'N',n:'Feral Charge',d:'+3 MOV this turn',fx:[{t:'B',s:'mv',v:3}]},
    {id:'BM_N04',lv:6,tp:'N',n:'Savage Strike',d:'+3 ATK this turn',fx:[{t:'B',s:'at',v:3}]},
    {id:'BM_N05',lv:12,tp:'N',n:'Maul',d:'+4 ATK this turn',fx:[{t:'B',s:'at',v:4}]},
    {id:'BM_N06',lv:18,tp:'N',n:'Untamed Speed',d:'+2 ATK and +2 MOV',fx:[{t:'B',s:'at',v:2},{t:'B',s:'mv',v:2}]},
    {id:'BM_N07',lv:22,tp:'N',n:"Predator's Cunning",d:'+4 MOV this turn',fx:[{t:'B',s:'mv',v:4}]},
    {id:'BM_N08',lv:28,tp:'N',n:'Rend and Tear',d:'+5 ATK this turn',fx:[{t:'B',s:'at',v:5}]},
    {id:'BM_U01',lv:9,tp:'U',n:'Aspect of the Wolf',d:'+3 ATK and +2 MOV',fx:[{t:'B',s:'at',v:3},{t:'B',s:'mv',v:2}]},
    {id:'BM_U02',lv:19,tp:'U',n:'Aspect of the Bear',d:'+4 ATK and 2 DR',fx:[{t:'B',s:'at',v:4},{t:'D',v:2}]},
    {id:'BM_U03',lv:29,tp:'U',n:'Unleash the Beast',d:'Gain +1 Atk & Move ATP',fx:[{t:'X',s:'at',v:1},{t:'X',s:'mv',v:1}]},
  ],
  seraphina:[
    {id:'AB_N01',lv:1,tp:'N',n:'Lesser Heal',d:'Heal 5 HP',fx:[{t:'H',v:5}]},
    {id:'AB_N02',lv:1,tp:'N',n:'Holy Light',d:'+1 ATK and +1 RNG',fx:[{t:'B',s:'at',v:1},{t:'B',s:'rg',v:1}]},
    {id:'AB_N03',lv:3,tp:'N',n:'Sanctuary',d:'Heal 3 HP and +1 MOV',fx:[{t:'H',v:3},{t:'B',s:'mv',v:1}]},
    {id:'AB_N04',lv:6,tp:'N',n:'Heal',d:'Heal 8 HP',fx:[{t:'H',v:8}]},
    {id:'AB_N05',lv:12,tp:'N',n:'Shield of Faith',d:'Gain 2 Damage Reduction',fx:[{t:'D',v:2}]},
    {id:'AB_N06',lv:18,tp:'N',n:'Greater Heal',d:'Heal 12 HP',fx:[{t:'H',v:12}]},
    {id:'AB_N07',lv:22,tp:'N',n:'Circle of Healing',d:'Heal 4 HP',fx:[{t:'H',v:4}]},
    {id:'AB_N08',lv:28,tp:'N',n:'Prayer of Mending',d:'Heal 15 HP',fx:[{t:'H',v:15}]},
    {id:'AB_U01',lv:9,tp:'U',n:'Divine Intervention',d:'Heal 10 HP and 1 DR',fx:[{t:'H',v:10},{t:'D',v:1}]},
    {id:'AB_U02',lv:19,tp:'U',n:'Salvation',d:'Heal 20 HP',fx:[{t:'H',v:20}]},
    {id:'AB_U03',lv:29,tp:'U',n:'Miracle',d:'Heal to full HP',fx:[{t:'H',v:999}]},
  ],
  mei:[
    {id:'TC_N01',lv:1,tp:'N',n:'Overcharge',d:'+1 ATK and +2 RNG',fx:[{t:'B',s:'at',v:1},{t:'B',s:'rg',v:2}]},
    {id:'TC_N02',lv:1,tp:'N',n:'Boosters',d:'+3 MOV this turn',fx:[{t:'B',s:'mv',v:3}]},
    {id:'TC_N03',lv:3,tp:'N',n:'Targeting System',d:'+2 ATK this turn',fx:[{t:'B',s:'at',v:2}]},
    {id:'TC_N04',lv:6,tp:'N',n:'Plasma Bolt',d:'+3 ATK this turn',fx:[{t:'B',s:'at',v:3}]},
    {id:'TC_N05',lv:12,tp:'N',n:'Force Field',d:'Gain 2 Damage Reduction',fx:[{t:'D',v:2}]},
    {id:'TC_N06',lv:18,tp:'N',n:'Disruptor Ray',d:'+4 ATK this turn',fx:[{t:'B',s:'at',v:4}]},
    {id:'TC_N07',lv:22,tp:'N',n:'Ablative Armor',d:'Gain 3 Damage Reduction',fx:[{t:'D',v:3}]},
    {id:'TC_N08',lv:28,tp:'N',n:'Gatling Laser',d:'Gain +1 Attack ATP',fx:[{t:'X',s:'at',v:1}]},
    {id:'TC_U01',lv:9,tp:'U',n:'Railgun',d:'+4 ATK and +1 RNG',fx:[{t:'B',s:'at',v:4},{t:'B',s:'rg',v:1}]},
    {id:'TC_U02',lv:19,tp:'U',n:'Orbital Strike',d:'+6 ATK this turn',fx:[{t:'B',s:'at',v:6}]},
    {id:'TC_U03',lv:29,tp:'U',n:'Chrono Matrix',d:'Gain +1 Atk & Move ATP',fx:[{t:'X',s:'at',v:1},{t:'X',s:'mv',v:1}]},
  ],
}

const MONSTERS = [
  {id:'goblin',n:'Goblin Scout',hp:8,at:2,mv:4,rg:1,cl:'#86efac',ic:'👺',
   desc:'Fast but fragile. Will chase the weakest hero ruthlessly.'},
  {id:'demon',n:'Demon Warrior',hp:14,at:4,mv:3,rg:1,cl:'#f87171',ic:'😈',
   desc:'Tough frontline fighter. Will target your tanks to wear them down.'},
  {id:'rat',n:'Dire Rat',hp:5,at:1,mv:5,rg:1,cl:'#a78bfa',ic:'🐀',
   desc:'Swarming pest. Weak alone but dangerous in groups.'},
  {id:'mage',n:'Cultist Mage',hp:10,at:5,mv:2,rg:3,cl:'#c084fc',ic:'🧙',
   desc:'Ranged attacker. Prioritises eliminating your healers and supports.'},
  {id:'brute',n:'Hell Brute',hp:22,at:6,mv:2,rg:1,cl:'#ef4444',ic:'👹',
   desc:'Elite heavy. Extremely dangerous. Requires coordinated focus fire.'},
]

const SCENARIOS = [
  {
    id:'c1',title:'Chapter I — The Burning Hour',
    story:[],
    objective:'DEFEAT ALL ENEMIES',
    events:[],   // mid-battle triggers (Phase 3) — schema in docs/DATABASE.md
    outro:[
      'The last of them comes apart\nlike smoke deciding it was never there.\n\nThen quiet.\n\nThe fires are already burning lower,\nas if they, too, have lost the thread\nof whatever brought them here.',
      'The villagers come out slowly.\n\nThey look at you — at the four who stand with you —\nand then at the bare ground\nwhere something had been standing\na breath ago.\n\nNo one says the word for it.\nThere is no word for it yet.',
      'You look at that same patch of ground.\n\nAnd for half a second — no longer —\nyou are certain, the way you are certain of your own name\nwhen you are not trying to remember it,\nthat you have stood exactly here before.\n\nThen it is gone,\nand it is only a street, and only ash.',
    ],
    defeat:'The world tilts, and goes white.\n\nAnd somewhere, patient as the tide,\na voice you almost know says it again:\n\n"… once more …"',
    win:'Defeat all 4 enemies.',lose:'All heroes are defeated.',
    w:14,h:10,
    walls:[[4,2],[4,3],[4,4],[4,7],[4,8],[4,9],[8,1],[8,2],[9,2],[12,4],[12,5],[13,6]],
    heroStarts:[{x:1,y:3},{x:1,y:5},{x:1,y:6},{x:1,y:8}],
    enemies:[
      {x:5,y:2,type:'goblin'},{x:10,y:4,type:'demon'},{x:12,y:2,type:'goblin'},{x:13,y:7,type:'rat'}
    ],
  },
  {
    id:'c2',title:'Chapter II — The Burning Citadel',
    story:[],
    objective:'DEFEAT THE HELL BRUTE',
    events:[],
    outro:[],   // authored when Chapter 2 content lands
    defeat:'Darkness folds back over the citadel,\nand the voice does not even bother to whisper.',
    win:'Defeat the Hell Brute and all guards.',lose:'All heroes are defeated.',
    w:14,h:10,
    walls:[[2,1],[2,2],[3,8],[3,9],[7,3],[7,4],[7,6],[7,7],[11,1],[11,2],[11,8],[11,9]],
    heroStarts:[{x:1,y:4},{x:1,y:5},{x:1,y:6},{x:0,y:5}],
    enemies:[
      {x:7,y:2,type:'mage'},{x:7,y:8,type:'mage'},{x:11,y:5,type:'brute'},{x:12,y:3,type:'demon'},{x:12,y:7,type:'demon'}
    ],
  },
]

const NARR = [
  {type:'whisper', tag:'', txt:'“… you must return once more …”'},
  {type:'narr', tag:'', txt:'Your cheek is against rough wood.\n\nCandlelight. The low clatter of cups.\nThe smell of old ale and woodsmoke.\n\nYou lift your head.\nThe room tilts — then steadies.\n\nFor a moment you are not certain where you are.\nFor a moment, longer than it should be,\nyou are not entirely certain who you are.'},
  {type:'narr', tag:'', txt:'There is one thing that surfaces before anything else.\n\nNot a place. Not a name. Not a reason.\n\nJust this:\nyour team. Eight of them, not counting yourself.\n\nFaces that are almost there —\nfeatures you can nearly make out\nbefore they dissolve at the edges like something seen through water.\n\nAnd names. Somewhere behind your teeth,\nfamiliar as your own breathing,\nalmost.'},
  {type:'narr', tag:'', txt:'Four faces look back at you from around the table.\n\nFamiliar.\nYou trust them without knowing why.\n\nBut there should be more of you.\n\nYou are certain of it in the way you are certain\nyour own heart is beating —\nwithout being able to say exactly how you know.'},
  {type:'party', tag:'Your Companions'},
  {type:'narr', tag:'', txt:'"You were muttering in your sleep," one of them says.\n"Again."\n\nYou sit up. Try to reach for the names.\nThey are there — you can almost feel the shape of them.\nAlmost see the faces.\n\nYou begin to say one aloud.\n\nIt comes out wrong. Half-formed.\nLike trying to describe a dream\nin a language you have forgotten you knew.'},
  {type:'narr', tag:'', txt:'A silence.\n\n"...Who are you talking about?"\n\nYou look at each of them in turn.\n\n"There were others," you say.\n"I can almost remember them."\n\nAnother silence. The kind between people\nwho are deciding whether to be worried.\n\n"There is no one else," one of them says quietly.\n"There has never been anyone else."'},
  {type:'narr', tag:'', txt:'You are still trying to hold onto a face\nwhen the door crashes open.\n\nA boy stumbles through — no older than twelve.\nOne shoulder smoking. Eyes carrying\nthe particular emptiness of someone\nwho has just seen something they will spend years\ntrying to describe.\n\n"Fire — east side — the watchers —\nthey’re gone —\nsomething came out of nowhere —"\n\nThe tavern comes apart.'},
  {type:'narr', tag:'', txt:'Outside, the sky is the wrong colour.\n\nFire where buildings should be.\nVillagers running in every direction,\nfaces painted amber and red.\n\nYou step into it.\n\nYour four companions fall in behind you\nwithout a word.\n\nNobody runs.'},
  {type:'narr', tag:'', txt:'Between the burning buildings,\nin the space where the gate used to stand,\nsomething moves.\n\nThen more.\n\nNot from the shadows.\nNot from around a corner.\n\nThey simply… arrive.\n\nYou have no name for what you are seeing.\n\nBut your hand is already on your weapon,\nand your feet are already moving forward —\nas if some part of you\nhas done this before.'},
  {type:'chapter', tag:'', chapterNum:'I', chapterTitle:'The Burning Hour', sub:'A village on the edge of nowhere.\nA fire with no natural cause.\nAnd something arriving from nowhere\nthat should not exist.'},
]
// ═══════════════════════════════════════════════════════════════════
//  GAME ENGINE UTILITIES
// ═══════════════════════════════════════════════════════════════════
//  The PURE engine (calcStat, heroStats, expToLevel, applyCard, bfsMove,
//  getAttackRange, enemyAI) lives in src/core/engine.mjs and is inlined by
//  src/build.js — those names are available as globals here. Only data-glue
//  helpers that reference the DATA tables stay in this file.
function getHeroCards(heroId, level=1) {
  return (CARDS[heroId] || []).filter(c => c.lv <= level)
}

// ═══════════════════════════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════════════════════════
const INIT = {
  screen:'title',prevScreen:null,
  party:[],partyLevels:{},
  // ── persistent slice (survives battles; the ONLY thing save/load touches;
  //    see serializeProgress/hydrateProgress in core/engine) ──
  progress:{heroExp:{},chaptersCleared:[]},
  scenario:null,heroes:[],enemies:[],
  selectedHeroId:null,selectedCard:null,moveRange:[],atkRange:[],
  phase:'player',round:1,log:[],result:null,
  introStage:'done',    // battle-intro ceremony: map→heroes→enemies→objective→done
  postBattle:null,      // {award:[...], outroLines:[...]} transient victory data
  godMode:false,narratorSlide:0,kbTab:'heroes',kbHero:null,adminMsg:'',
  floaters:[],          // [{id,x,y,text,color,big}]
  hitFlash:{},          // {unitId: timestamp}
  playingCard:null,     // {card, heroCl} for center-screen flourish
  banner:null,          // {text, tone} phase-transition banner
  enemyQueue:[],        // precomputed enemy actions to replay
  phaseAnimating:false, // locks input during enemy phase / banners
}
function reducer(state, action) {
  const s={...state}
  switch(action.type){
    case 'GO': return{...s,screen:action.to,prevScreen:s.screen}
    case 'SELECT_PARTY_HERO':{
      const already=s.party.includes(action.id)
      if(already) return{...s,party:s.party.filter(x=>x!==action.id)}
      if(s.party.length>=4) return s
      return{...s,party:[...s.party,action.id]}
    }
    case 'START_GAME':{
      const sc=action.scenario
      const heroUnits=s.party.map((hid,i)=>{
        const h=HEROES.find(x=>x.id===hid)
        // Level from earned EXP; the admin per-hero override wins when set (testing).
        const lv=s.partyLevels[hid]||expToLevel(s.progress.heroExp[hid]||0)
        const st=heroStats(h,lv)
        const start=sc.heroStarts[i]||{x:0,y:i}
        return{id:hid,n:h.n,cl:h.cl,ic:h.ic,img:h.img,
          ...st,mhp:st.hp,dr:0,cardPlayed:null,
          atkLeft:1,mvLeft:st.mv,done:false,x:start.x,y:start.y,
          cards:getHeroCards(hid,lv)}
      })
      const enemyUnits=sc.enemies.map((e,i)=>{
        const mt=MONSTERS.find(m=>m.id===e.type)||MONSTERS[0]
        return{...mt,id:`e${i}`,x:e.x,y:e.y,mhp:mt.hp,hp:mt.hp,atkLeft:1,mvLeft:mt.mv}
      })
      return{...s,screen:'battle',scenario:sc,heroes:heroUnits,enemies:enemyUnits,
        selectedHeroId:null,selectedCard:null,moveRange:[],atkRange:[],
        phase:'player',round:1,log:['Battle start!'],result:null,postBattle:null,
        introStage:'map',phaseAnimating:true,   // play the intro ceremony; input locked until 'done'
        floaters:[],hitFlash:{},playingCard:null,banner:null,enemyQueue:[]}
    }
    case 'SELECT_HERO':{
      if(s.phase!=='player') return s
      const h=s.heroes.find(x=>x.id===action.id)
      if(!h||h.done||h.hp<=0) return s
      return{...s,selectedHeroId:action.id,selectedCard:null,moveRange:[],atkRange:[]}
    }
    case 'SELECT_CARD':{
      const h=s.heroes.find(x=>x.id===s.selectedHeroId)
      if(!h||h.cardPlayed) return s
      const card=(h.cards||[]).find(c=>c.id===action.id)
      if(!card) return s
      const updH=applyCard(h,card)
      const newHeroes=s.heroes.map(x=>x.id===h.id?updH:x)
      const all=[...newHeroes,...s.enemies.filter(e=>e.hp>0)]
      const mr=bfsMove(updH,all,s.scenario.w,s.scenario.h,s.scenario.walls)
      const ar=getAttackRange(updH,s.enemies.filter(e=>e.hp>0))
      // Heal floater if card heals
      const newFloaters=[...s.floaters]
      const healFx=(card.fx||[]).find(f=>f.t==='H')
      if(healFx){
        const healed=healFx.v===999?updH.mhp-h.hp:Math.min(healFx.v,updH.mhp-h.hp)
        if(healed>0) newFloaters.push({id:`f${Date.now()}`,x:updH.x,y:updH.y,text:`+${healed}`,color:'#4ade80',big:false})
      }
      return{...s,heroes:newHeroes,selectedCard:action.id,moveRange:mr,atkRange:ar,
        floaters:newFloaters,
        playingCard:{card,heroCl:h.cl,t:Date.now()},
        log:[`${h.n} plays ${card.n}.`,...s.log.slice(0,19)]}
    }
    case 'MOVE_HERO':{
      const h=s.heroes.find(x=>x.id===s.selectedHeroId)
      if(!h||!h.cardPlayed) return s
      const ok=s.moveRange.find(t=>t.x===action.x&&t.y===action.y)
      if(!ok) return s
      const updH={...h,x:action.x,y:action.y,mvLeft:0}
      const newHeroes=s.heroes.map(x=>x.id===h.id?updH:x)
      const ar=getAttackRange(updH,s.enemies.filter(e=>e.hp>0))
      return{...s,heroes:newHeroes,moveRange:[],atkRange:ar,
        log:[`${h.n} moved to (${action.x},${action.y}).`,...s.log.slice(0,19)]}
    }
    case 'ATTACK':{
      const h=s.heroes.find(x=>x.id===s.selectedHeroId)
      if(!h||!h.cardPlayed||h.atkLeft<=0) return s
      const e=s.enemies.find(x=>x.id===action.id)
      if(!e||e.hp<=0) return s
      const dmg=Math.max(1,h.at-(e.dr||0))
      const updE={...e,hp:Math.max(0,e.hp-dmg)}
      const updH={...h,atkLeft:h.atkLeft-1}
      const newHeroes=s.heroes.map(x=>x.id===h.id?updH:x)
      const newEnemies=s.enemies.map(x=>x.id===e.id?updE:x)
      const stillAlive=newEnemies.filter(x=>x.hp>0)
      const won=stillAlive.length===0
      // Damage floater + hit flash
      const floater={id:`f${Date.now()}`,x:e.x,y:e.y,text:`-${dmg}`,
        color:dmg>=5?'#fbbf24':'#fff',big:dmg>=5}
      const newFloaters=[...s.floaters,floater]
      const newHitFlash={...s.hitFlash,[e.id]:Date.now()}
      const logMsg=`${h.n} hits ${e.n} for ${dmg}!${updE.hp<=0?' Defeated!':''}`
      if(won){
        const survivors=newHeroes.filter(x=>x.hp>0)
        const{progress,award}=awardChapter(s.progress,s.scenario.id,survivors.map(x=>x.id))
        const richAward=award.map(a=>{const u=survivors.find(x=>x.id===a.heroId);
          return{...a,n:u.n,cl:u.cl,img:u.img}})
        return{...s,heroes:newHeroes,enemies:newEnemies,atkRange:[],result:'win',
          progress,postBattle:{award:richAward,outroLines:s.scenario.outro||[]},
          floaters:newFloaters,hitFlash:newHitFlash,log:[logMsg,...s.log.slice(0,19)]}
      }
      const ar=updH.atkLeft>0?getAttackRange(updH,stillAlive):[]
      return{...s,heroes:newHeroes,enemies:newEnemies,atkRange:ar,
        floaters:newFloaters,hitFlash:newHitFlash,log:[logMsg,...s.log.slice(0,19)]}
    }
    case 'END_HERO_TURN':{
      const h=s.heroes.find(x=>x.id===s.selectedHeroId)
      if(!h) return s
      const newHeroes=s.heroes.map(x=>x.id===h.id?{...x,done:true,dr:0}:x)
      const allDone=newHeroes.filter(x=>x.hp>0).every(x=>x.done)
      if(!allDone){
        const next=newHeroes.find(x=>x.hp>0&&!x.done)
        return{...s,heroes:newHeroes,selectedHeroId:next?.id||null,
          selectedCard:null,moveRange:[],atkRange:[],log:['Next hero.',...s.log.slice(0,19)]}
      }
      // All heroes done — precompute the enemy phase as a replayable queue.
      let simEnemies=[...s.enemies.filter(e=>e.hp>0)]
      let simHeroes=[...newHeroes]
      const queue=[]
      for(const enemy of simEnemies){
        const all=[...simHeroes,...simEnemies.filter(e=>e.hp>0)]
        const res=enemyAI(enemy,simHeroes,all,s.scenario.w,s.scenario.h,s.scenario.walls)
        simEnemies=simEnemies.map(e=>e.id===enemy.id?res.movedEnemy:e)
        let step={enemyId:enemy.id,moveTo:{x:res.movedEnemy.x,y:res.movedEnemy.y},attack:null}
        if(res.attackedHero&&!s.godMode){
          const{dmg,targetId}=res
          simHeroes=simHeroes.map(hh=>hh.id===targetId?{...hh,hp:Math.max(0,hh.hp-dmg)}:hh)
          const tgt=simHeroes.find(hh=>hh.id===targetId)
          step.attack={targetId,dmg,tx:tgt?tgt.x:0,ty:tgt?tgt.y:0,tn:tgt?tgt.n:'hero',en:enemy.n}
        }
        queue.push(step)
      }
      return{...s,heroes:newHeroes,phase:'enemy',phaseAnimating:true,
        enemyQueue:queue,selectedHeroId:null,selectedCard:null,moveRange:[],atkRange:[],
        banner:{text:'ENEMY PHASE',tone:'enemy'},
        log:['\u26A1 Enemy Phase!',...s.log.slice(0,19)]}
    }
    case 'SET_INTRO':{
      const stage=action.stage
      let banner=s.banner
      if(stage==='objective') banner={text:(s.scenario.objective||'DEFEAT ALL ENEMIES'),tone:'gold'}
      if(stage==='done') banner={text:`ROUND ${String(s.round).padStart(2,'0')} — PLAYER PHASE`,tone:'player'}
      return{...s,introStage:stage,phaseAnimating:stage!=='done',banner}
    }
    case 'CLEAR_BANNER': return{...s,banner:null}
    case 'ENEMY_STEP':{
      // Apply one enemy's move+attack (called by the replay effect)
      const step=action.step
      let newEnemies=s.enemies.map(e=>e.id===step.enemyId?{...e,x:step.moveTo.x,y:step.moveTo.y}:e)
      let newHeroes=s.heroes
      let newFloaters=[...s.floaters]
      let newHitFlash={...s.hitFlash}
      let logLine=null
      if(step.attack){
        const{targetId,dmg,tx,ty,tn,en}=step.attack
        newHeroes=s.heroes.map(hh=>hh.id===targetId?{...hh,hp:Math.max(0,hh.hp-dmg)}:hh)
        newFloaters.push({id:`f${Date.now()}_${step.enemyId}`,x:tx,y:ty,text:`-${dmg}`,color:'#f87171',big:dmg>=5})
        newHitFlash[targetId]=Date.now()
        logLine=`${en} hits ${tn} for ${dmg}!`
      }
      return{...s,enemies:newEnemies,heroes:newHeroes,floaters:newFloaters,hitFlash:newHitFlash,
        log:logLine?[logLine,...s.log.slice(0,19)]:s.log}
    }
    case 'END_ENEMY_PHASE':{
      const lost=s.heroes.every(h=>h.hp<=0)
      if(lost) return{...s,phase:'player',phaseAnimating:false,enemyQueue:[],result:'lose'}
      const resetHeroes=s.heroes.map(h=>({...h,done:false,dr:0,cardPlayed:null,atkLeft:1,mvLeft:h.mv}))
      const firstAlive=resetHeroes.find(h=>h.hp>0)
      return{...s,heroes:resetHeroes,phase:'player',phaseAnimating:false,enemyQueue:[],
        round:s.round+1,selectedHeroId:firstAlive?.id||null,
        selectedCard:null,moveRange:[],atkRange:[],
        banner:{text:`ROUND ${String(s.round+1).padStart(2,'0')} \u2014 PLAYER PHASE`,tone:'player'},
        log:[`\uD83C\uDF05 Round ${s.round+1}.`,...s.log.slice(0,19)]}
    }
    case 'SET_LEVEL': return{...s,partyLevels:{...s.partyLevels,[action.hid]:action.lv}}
    case 'SET_GOD': return{...s,godMode:action.v}
    case 'SET_KB_TAB': return{...s,kbTab:action.tab}
    case 'SET_KB_HERO': return{...s,kbHero:action.hero}
    case 'SET_NARRATOR': return{...s,narratorSlide:action.i}
    case 'REMOVE_FLOATER': return{...s,floaters:s.floaters.filter(f=>f.id!==action.id)}
    case 'CLEAR_CARD_FLOURISH': return{...s,playingCard:null}
    case 'ADMIN_MSG': return{...s,adminMsg:action.msg}
    case 'RESET': return{...INIT}
    default: return s
  }
}

// ═══════════════════════════════════════════════════════════════════
//  HOOKS
// ═══════════════════════════════════════════════════════════════════
function useTypewriter(text, speed=26) {
  const rawLines = text ? text.split('\n') : []
  const [lineIdx, setLineIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [done, setDone] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    setLineIdx(0); setCharIdx(0); setDone(false)
  }, [text])

  useEffect(() => {
    if (!text || done) return
    clearInterval(timerRef.current)
    clearTimeout(timerRef.current)
    const currentLine = rawLines[lineIdx] || ''
    if (charIdx >= currentLine.length) {
      timerRef.current = setTimeout(() => {
        if (lineIdx < rawLines.length - 1) { setLineIdx(l=>l+1); setCharIdx(0) }
        else setDone(true)
      }, currentLine === '' ? 100 : 260)
    } else {
      timerRef.current = setInterval(() => setCharIdx(c=>c+1), speed)
    }
    return () => { clearInterval(timerRef.current); clearTimeout(timerRef.current) }
  }, [text, lineIdx, charIdx, done])

  const visibleLines = rawLines.map((line,i) => {
    if (i < lineIdx) return {text:line,complete:true}
    if (i === lineIdx) return {text:line.slice(0,charIdx),complete:false}
    return null
  }).filter(Boolean)

  const displayed = visibleLines.map(l=>l.text).join('\n')

  function skip() {
    clearInterval(timerRef.current); clearTimeout(timerRef.current)
    setLineIdx(rawLines.length-1)
    setCharIdx((rawLines[rawLines.length-1]||'').length)
    setDone(true)
  }
  return { visibleLines, displayed, done, skip }
}

// ═══════════════════════════════════════════════════════════════════
//  SHARED UI
// ═══════════════════════════════════════════════════════════════════
function Btn({cls='btn-teal',sm,lg,icon:Icon,onClick,disabled,children}){
  return(
    <button className={`btn ${cls} ${sm?'btn-sm':''} ${lg?'btn-lg':''}`}
      onClick={onClick} disabled={disabled} style={{fontFamily:'inherit'}}>
      {Icon&&<Icon size={sm?13:15}/>}{children}
    </button>
  )
}
function HpBar({hp,mhp,cl='#4ade80'}){
  const pct=Math.max(0,Math.min(100,(hp/mhp)*100))
  const col=pct>60?cl:pct>30?'#fbbf24':'#f87171'
  return(<div className="hpbar-bg"><div className="hpbar" style={{width:`${pct}%`,background:col}}/></div>)
}
function Panel({children,style={}}){
  return <div className="panel" style={{padding:16,...style}}>{children}</div>
}

// ═══════════════════════════════════════════════════════════════════
//  TITLE SCREEN
// ═══════════════════════════════════════════════════════════════════
function TitleScreen({state,dispatch}){
  return(
    <div style={{display:'flex',flexDirection:'column',height:'100vh',
      background:'var(--bg)',overflow:'hidden',position:'relative'}}>
      <style>{CSS}</style>
      <div style={{position:'absolute',inset:0,display:'flex',overflow:'hidden',opacity:.2}}>
        {HEROES.slice(0,6).map((h,i)=>(
          <div key={h.id} style={{flex:1,position:'relative',
            animation:`heroFloat ${3+i*.4}s ease-in-out ${i*.3}s infinite`}}>
            <img src={h.img} alt="" style={{position:'absolute',inset:0,width:'100%',
              height:'100%',objectFit:'cover',objectPosition:'20% 10%'}}
              onError={e=>e.target.style.display='none'}/>
          </div>
        ))}
        <div style={{position:'absolute',inset:0,
          background:'linear-gradient(to right,var(--bg) 0%,transparent 20%,transparent 80%,var(--bg) 100%)'}}/>
        <div style={{position:'absolute',inset:0,
          background:'linear-gradient(to top,var(--bg) 0%,transparent 40%)'}}/>
        <div style={{position:'absolute',inset:0,
          background:'linear-gradient(to bottom,var(--bg) 0%,transparent 30%)'}}/>
      </div>
      <div style={{position:'relative',zIndex:1,display:'flex',flexDirection:'column',
        alignItems:'center',justifyContent:'center',flex:1,gap:32}}>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:'.7rem',fontWeight:700,letterSpacing:'.4em',
            color:'rgba(251,191,36,.7)',textTransform:'uppercase',marginBottom:14}}>
            ✶ A Tactical RPG ✶
          </div>
          <h1 className="glow-gold" style={{fontFamily:"'Fraunces',Georgia,serif",
            fontStyle:'italic',fontWeight:700,
            fontSize:'clamp(2rem,5vw,3.5rem)',letterSpacing:'.03em',
            background:'linear-gradient(135deg,#fef3c7,#fbbf24,#f59e0b)',
            WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
            lineHeight:1.1,marginBottom:10}}>
            Magic Maidens Tactic
          </h1>
          <div style={{fontSize:'.78rem',color:'var(--txt3)',letterSpacing:'.1em',
            fontStyle:'italic'}}>
            Version 1.0 · Eight warriors. One truth. No mercy.
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:10,width:240}}>
          <Btn cls="btn-gold" lg icon={Play}
            onClick={()=>{dispatch({type:'SET_NARRATOR',i:0});dispatch({type:'GO',to:'narrator'})}}>
            New Campaign
          </Btn>
          <Btn cls="btn-ghost" icon={BookOpen}
            onClick={()=>dispatch({type:'GO',to:'knowledge'})}>
            Knowledge Base
          </Btn>
          <Btn cls="btn-ghost" icon={Settings}
            onClick={()=>dispatch({type:'GO',to:'admin'})}>
            Admin / Dev Tools
          </Btn>
        </div>
        <div style={{display:'flex',gap:8,opacity:.6}}>
          {HEROES.map(h=>(
            <div key={h.id} style={{width:34,height:34,borderRadius:'50%',
              border:`2px solid ${h.cl}44`,overflow:'hidden',background:'var(--panel)'}}>
              <img src={h.img} alt={h.n} style={{width:'100%',height:'100%',
                objectFit:'cover',objectPosition:'20% 10%'}}
                onError={e=>e.target.style.display='none'}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
//  NARRATOR SCREEN
// ═══════════════════════════════════════════════════════════════════
function NarratorScreen({state,dispatch}){
  const slide = state.narratorSlide || 0
  const cur   = NARR[slide] || NARR[0]
  const isLast = slide >= NARR.length - 1
  const PARTY_INTRO = 'Eight of them.\n\nFaces you can almost see.\nNames that almost come.\n\nFour are already here.\nFour are somewhere in this room.\n\n...Which four?'

  // ALL HOOKS AT TOP LEVEL
  const [introShown, setIntroShown] = useState(false)
  useEffect(()=>{ setIntroShown(false) }, [slide])
  const mainTxt = cur.type === 'narr' ? cur.txt : ''
  const { visibleLines, done, skip } = useTypewriter(mainTxt, 24)
  const introTxt = (cur.type === 'party' && !introShown) ? PARTY_INTRO : ''
  const { visibleLines: iVL, done: iDone, skip: iSkip } = useTypewriter(introTxt, 22)

  function prev(){ if(slide>0) dispatch({type:'SET_NARRATOR',i:slide-1}); else dispatch({type:'GO',to:'title'}) }
  function next(){ if(isLast) dispatch({type:'START_GAME',scenario:SCENARIOS[0]}); else dispatch({type:'SET_NARRATOR',i:slide+1}) }
  function handleClick(){ if(!done){skip();return} next() }

  const NarrText = ({lines, isDone}) => (
    <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',
      fontSize:'clamp(.88rem,1.8vw,1.06rem)',lineHeight:2.1,
      color:'var(--txt)',textAlign:'left',maxWidth:560,margin:'0 auto'}}>
      {lines.map((line,li)=>{
        const isLast2=li===lines.length-1
        return(
          <div key={li} style={{minHeight:'2.1em'}}>
            {line.text===''?'\u00A0':line.text}
            {isLast2&&!isDone&&line.text!==''&&(
              <span style={{display:'inline-block',width:'1.5px',height:'.9em',
                background:'#fbbf24',marginLeft:'2px',verticalAlign:'text-bottom',
                animation:'pulse .5s ease-in-out infinite'}}/>
            )}
          </div>
        )
      })}
    </div>
  )

  const TagLine = ({tag}) => tag?(
    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:30}}>
      <div style={{flex:1,height:'1px',background:'linear-gradient(to right,transparent,rgba(251,191,36,.2))'}}/>
      <span style={{fontSize:'.56rem',fontWeight:700,letterSpacing:'.32em',
        textTransform:'uppercase',color:'rgba(251,191,36,.5)',
        fontFamily:"'Outfit',sans-serif",whiteSpace:'nowrap'}}>{tag}</span>
      <div style={{flex:1,height:'1px',background:'linear-gradient(to left,transparent,rgba(251,191,36,.2))'}}/>
    </div>
  ):null

  const ProgressBar = () => (
    <div style={{marginTop:36,height:1,background:'rgba(255,255,255,.06)',borderRadius:1,overflow:'hidden'}}>
      <div style={{height:'100%',background:'linear-gradient(90deg,rgba(251,191,36,.35),rgba(251,191,36,.65))',
        transition:'width .5s ease',width:`${((slide+1)/NARR.length)*100}%`}}/>
    </div>
  )

  // WHISPER
  if(cur.type==='whisper') return(
    <div style={{position:'fixed',inset:0,background:'#000',
      display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}
      onClick={next}>
      <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',
        fontSize:'clamp(1.1rem,3vw,1.9rem)',color:'rgba(255,255,255,.45)',
        letterSpacing:'.12em',textAlign:'center',lineHeight:1.8,
        animation:'fadeIn 2.5s ease both',maxWidth:500,padding:40}}>
        {cur.txt}
        <div style={{marginTop:36,fontSize:'.56rem',fontWeight:500,letterSpacing:'.3em',
          textTransform:'uppercase',fontFamily:"'Outfit',sans-serif",fontStyle:'normal',
          color:'rgba(255,255,255,.15)',animation:'pulse 2s ease-in-out 2s infinite'}}>
          tap to continue
        </div>
      </div>
    </div>
  )

  // CHAPTER CARD
  if(cur.type==='chapter') return(
    <div style={{position:'fixed',inset:0,
      background:'linear-gradient(135deg,#0a0612,#120818,#0a0612)',
      display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}
      onClick={next}>
      <div style={{textAlign:'center',animation:'fadeIn 1.2s ease both',padding:'0 40px'}}>
        <div style={{fontSize:'.6rem',fontWeight:700,letterSpacing:'.44em',
          textTransform:'uppercase',color:'rgba(251,191,36,.42)',
          fontFamily:"'Outfit',sans-serif",marginBottom:20}}>Chapter {cur.chapterNum}</div>
        <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:700,
          fontSize:'clamp(2.2rem,6vw,4rem)',
          background:'linear-gradient(135deg,#fef3c7,#fbbf24,#d97706)',
          WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
          lineHeight:1.1,marginBottom:24}}>{cur.chapterTitle}</div>
        <div style={{width:90,height:1,background:'rgba(251,191,36,.25)',margin:'0 auto 20px'}}/>
        <div style={{fontSize:'.85rem',color:'rgba(255,255,255,.42)',fontStyle:'italic',
          maxWidth:420,lineHeight:1.8,fontFamily:"'Fraunces',serif",margin:'0 auto'}}>
          {cur.sub.split('\n').map((l,i)=><div key={i}>{l}</div>)}
        </div>
        <div style={{marginTop:36,fontSize:'.56rem',fontWeight:600,letterSpacing:'.32em',
          textTransform:'uppercase',color:'rgba(255,255,255,.16)',
          fontFamily:"'Outfit',sans-serif",animation:'pulse 2s ease-in-out 1.5s infinite'}}>
          tap to begin
        </div>
      </div>
    </div>
  )

  // PARTY SLIDE
  if(cur.type==='party'){
    if(!introShown) return(
      <div style={{display:'flex',flexDirection:'column',height:'100vh',
        background:'var(--bg)',position:'relative',cursor:'pointer'}}
        onClick={iDone?()=>setIntroShown(true):iSkip}>
        <div style={{position:'relative',zIndex:1,display:'flex',flexDirection:'column',
          alignItems:'center',justifyContent:'center',flex:1,padding:'40px 28px'}}>
          <div style={{maxWidth:560,width:'100%'}}>
            <TagLine tag="Your Companions"/>
            <NarrText lines={iVL} isDone={iDone}/>
            <div style={{textAlign:'left',marginTop:24,fontSize:'.54rem',letterSpacing:'.22em',
              fontFamily:"'Outfit',sans-serif",textTransform:'uppercase',
              color:'rgba(255,255,255,.16)',animation:iDone?'pulse 1.8s ease-in-out infinite':'none',
              maxWidth:560,margin:'24px auto 0'}}>
              {iDone?'click to choose your companions':'click to skip'}
            </div>
          </div>
        </div>
        <div style={{padding:'12px 24px',borderTop:'1px solid rgba(255,255,255,.04)',
          display:'flex',justifyContent:'flex-end'}}
          onClick={e=>e.stopPropagation()}>
          <Btn cls={iDone?'btn-gold':'btn-ghost'} sm icon={ChevronRight}
            onClick={iDone?()=>setIntroShown(true):iSkip}>
            {iDone?'Choose Companions':'Skip'}
          </Btn>
        </div>
      </div>
    )

    return(
      <div style={{display:'flex',flexDirection:'column',height:'100vh',background:'var(--bg)',overflow:'hidden'}}>
        <div style={{padding:'14px 20px',borderBottom:'1px solid var(--border)',
          background:'var(--panel)',flexShrink:0}}>
          <div style={{display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
            <div>
              <div style={{fontFamily:"'Fraunces',serif",fontSize:'1.05rem',
                fontWeight:700,fontStyle:'italic',color:'var(--gold)'}}>Your Companions</div>
              <div style={{fontSize:'.7rem',color:'var(--txt3)',marginTop:2}}>
                Who sits with you tonight? Choose 4 companions.
              </div>
            </div>
            <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:10}}>
              <div style={{display:'flex',gap:5}}>
                {[0,1,2,3].map(i=>{
                  const h=HEROES.find(x=>x.id===state.party[i])
                  return(
                    <div key={i} style={{width:30,height:30,borderRadius:'50%',
                      border:`2px solid ${h?h.cl:'rgba(255,255,255,.12)'}`,
                      overflow:'hidden',background:'var(--panel)',
                      display:'flex',alignItems:'center',justifyContent:'center',
                      fontSize:'.68rem',color:'var(--txt3)',transition:'all .2s'}}>
                      {h?<img src={h.img} alt="" style={{width:'100%',height:'100%',
                        objectFit:'cover',objectPosition:'20% 10%'}}
                        onError={e=>e.target.style.display='none'}/>
                      :<span>{i+1}</span>}
                    </div>
                  )
                })}
              </div>
              <span style={{fontSize:'.8rem',color:'var(--txt2)',fontWeight:600}}>{state.party.length}/4</span>
              <Btn cls="btn-gold" disabled={state.party.length<4} icon={ChevronRight} onClick={next}>Continue Story</Btn>
            </div>
          </div>
          <div style={{marginTop:8,padding:'5px 11px',borderRadius:7,
            background:'rgba(45,212,191,.05)',border:'1px solid rgba(45,212,191,.14)',
            fontSize:'.67rem',color:'rgba(45,212,191,.75)',display:'flex',gap:7}}>
            <Info size={12} style={{flexShrink:0,marginTop:1}}/>
            <span>You are not shown here. HP·ATK·MOV·RNG shape how each companion fights. A tank, a healer, and two damage dealers is a solid foundation.</span>
          </div>
        </div>
        <div style={{flex:1,minHeight:0,overflowY:'auto',padding:'10px 12px'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(8,1fr)',gap:6}}>
            {HEROES.map(h=>{
              const sel=state.party.includes(h.id)
              const full=state.party.length>=4&&!sel
              return(
                <div key={h.id} style={{aspectRatio:'2/5',borderRadius:10,overflow:'hidden',
                  border:`1px solid ${sel?h.cl+'77':'rgba(255,255,255,.07)'}`,
                  background:'var(--panel)',cursor:full?'not-allowed':'pointer',
                  opacity:full?.35:1,
                  boxShadow:sel?`0 0 0 2px ${h.cl}33,0 10px 28px ${h.cl}18`:'none',
                  transition:'all .2s'}}
                  onClick={()=>!full&&dispatch({type:'SELECT_PARTY_HERO',id:h.id})}>
                  <div style={{height:'72%',position:'relative',overflow:'hidden'}}>
                    <img src={h.img} alt={h.n} style={{width:'100%',height:'100%',
                      objectFit:'cover',objectPosition:'20% 10%',display:'block',
                      transform:sel?'scale(1.05)':'scale(1)',transition:'transform .3s'}}
                      onError={e=>e.target.style.display='none'}/>
                    <div style={{position:'absolute',inset:0,
                      background:'linear-gradient(to top,rgba(0,0,0,.92) 0%,transparent 55%)'}}/>
                    {sel&&<div style={{position:'absolute',top:6,left:6,width:18,height:18,
                      borderRadius:'50%',background:h.cl,display:'flex',
                      alignItems:'center',justifyContent:'center',
                      fontSize:'.6rem',fontWeight:900,color:'#000'}}>&#10003;</div>}
                    <div style={{position:'absolute',bottom:6,left:7,right:7}}>
                      <div style={{fontSize:'.46rem',fontWeight:800,letterSpacing:'.12em',
                        textTransform:'uppercase',color:h.cl,marginBottom:2}}>{h.t}</div>
                      <div style={{fontFamily:"'Fraunces',serif",fontSize:'.8rem',
                        fontWeight:700,color:'#fff',lineHeight:1.1}}>{h.n}</div>
                    </div>
                  </div>
                  <div style={{height:'28%',padding:'4px 6px',display:'flex',
                    flexDirection:'column',justifyContent:'center',gap:3}}>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:1}}>
                      {[['HP',h.hp,'#f87171'],['AT',h.at,'#fbbf24'],
                        ['MV',h.mv,'#2dd4bf'],['RG',h.rg,'#a78bfa']].map(([l,v,c])=>(
                        <div key={l} style={{textAlign:'center'}}>
                          <div style={{fontSize:'.44rem',color:'var(--txt3)',fontWeight:700}}>{l}</div>
                          <div style={{fontSize:'.68rem',fontWeight:800,color:c}}>{v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{fontSize:'.5rem',color:'var(--txt3)',fontStyle:'italic',
                      lineHeight:1.3,fontFamily:"'Fraunces',serif",overflow:'hidden',
                      display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>
                      {h.pl}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // NORMAL NARR SLIDE
  return(
    <div style={{display:'flex',flexDirection:'column',height:'100vh',
      background:'var(--bg)',overflow:'hidden',position:'relative',cursor:'pointer'}}
      onClick={handleClick}>
      <div style={{position:'absolute',inset:0,zIndex:0,overflow:'hidden',opacity:.07,pointerEvents:'none'}}>
        {state.party.slice(0,2).map((hid,i)=>{
          const h=HEROES.find(x=>x.id===hid); if(!h) return null
          return <img key={hid} src={h.img} alt="" style={{position:'absolute',
            left:i===0?'-5%':'55%',top:0,width:'55%',height:'100%',
            objectFit:'cover',objectPosition:'20% 10%',filter:'blur(3px)'}}
            onError={e=>e.target.style.display='none'}/>
        })}
        <div style={{position:'absolute',inset:0,
          background:'linear-gradient(to right,var(--bg) 0%,rgba(7,6,18,.82) 35%,rgba(7,6,18,.82) 65%,var(--bg) 100%)'}}/>
        <div style={{position:'absolute',inset:0,
          background:'linear-gradient(to bottom,var(--bg) 0%,transparent 18%,transparent 82%,var(--bg) 100%)'}}/>
      </div>
      <div style={{position:'relative',zIndex:1,display:'flex',flexDirection:'column',
        alignItems:'center',justifyContent:'center',flex:1,padding:'40px 28px'}}>
        <div style={{maxWidth:620,width:'100%'}}>
          <TagLine tag={cur.tag}/>
          <NarrText lines={visibleLines} isDone={done}/>
          <ProgressBar/>
          <div style={{textAlign:'left',marginTop:14,fontSize:'.54rem',
            letterSpacing:'.22em',fontFamily:"'Outfit',sans-serif",
            textTransform:'uppercase',color:'rgba(255,255,255,.16)',
            animation:done?'pulse 1.8s ease-in-out infinite':'none',
            maxWidth:560,margin:'14px auto 0'}}>
            {done?'click anywhere to continue':'click to skip typing'}
          </div>
        </div>
      </div>
      <div style={{position:'relative',zIndex:1,display:'flex',alignItems:'center',
        justifyContent:'space-between',padding:'11px 22px',
        borderTop:'1px solid rgba(255,255,255,.04)',flexShrink:0}}
        onClick={e=>e.stopPropagation()}>
        <Btn cls="btn-ghost" sm icon={ArrowLeft} onClick={prev}>Back</Btn>
        <div style={{fontSize:'.58rem',color:'rgba(255,255,255,.14)',fontFamily:"'Outfit',sans-serif",
          letterSpacing:'.1em'}}>{slide+1} / {NARR.length}</div>
        <Btn cls={done?'btn-gold':'btn-ghost'} sm icon={ChevronRight}
          onClick={done?next:skip}>{done?'Continue':'Skip'}</Btn>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
//  POST-BATTLE  (victory: EXP tally → outro narration → title · defeat: line → retry)
// ═══════════════════════════════════════════════════════════════════
function PostBattle({state,dispatch}){
  const{result,scenario,postBattle}=state
  const win=result==='win'
  const outroLines=(postBattle&&postBattle.outroLines)||[]
  const award=(postBattle&&postBattle.award)||[]

  // ALL HOOKS AT TOP LEVEL (before any conditional return — see §hard rules)
  const [stage,setStage]=useState('summary')   // 'summary' | 'outro'
  const [oi,setOi]=useState(0)
  const outroTxt = stage==='outro' ? (outroLines[oi]||'') : ''
  const { visibleLines, done, skip } = useTypewriter(outroTxt, 24)

  const toTitle=()=>dispatch({type:'GO',to:'title'})
  const lastOutro=oi>=outroLines.length-1

  const Multi=({txt})=>(
    <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',
      fontSize:'clamp(.9rem,1.8vw,1.05rem)',lineHeight:2,color:'var(--txt)',
      textAlign:'left',maxWidth:520,margin:'0 auto'}}>
      {txt.split('\n').map((l,i)=><div key={i} style={{minHeight:'1.4em'}}>{l}</div>)}
    </div>
  )

  // ── DEFEAT ──
  if(!win){
    return(
      <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.9)',zIndex:50,
        display:'flex',alignItems:'center',justifyContent:'center',padding:30}}>
        <div style={{textAlign:'center',animation:'fadeIn .6s ease both',maxWidth:520}}>
          <div style={{fontSize:'.6rem',fontWeight:700,letterSpacing:'.4em',textTransform:'uppercase',
            color:'rgba(248,113,113,.6)',fontFamily:"'Outfit',sans-serif",marginBottom:18}}>Defeat</div>
          <Multi txt={scenario.defeat||'All heroes have fallen.'}/>
          <div style={{display:'flex',gap:8,justifyContent:'center',marginTop:34}}>
            <Btn cls="btn-ghost" icon={RotateCcw} onClick={()=>dispatch({type:'START_GAME',scenario})}>Retry</Btn>
            <Btn cls="btn-ghost" icon={ArrowLeft} onClick={toTitle}>Title</Btn>
          </div>
        </div>
      </div>
    )
  }

  // ── VICTORY · outro narration ──
  if(stage==='outro'){
    const advance=()=>{ if(!done){skip();return} if(!lastOutro){setOi(oi+1)} else {toTitle()} }
    return(
      <div style={{position:'fixed',inset:0,background:'linear-gradient(135deg,#0a0612,#120818,#0a0612)',
        zIndex:50,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
        padding:40,cursor:'pointer'}} onClick={advance}>
        <Multi txt={visibleLines.map(l=>l.text).join('\n')}/>
        <div style={{marginTop:34,fontSize:'.54rem',fontWeight:600,letterSpacing:'.28em',
          textTransform:'uppercase',color:'rgba(255,255,255,.18)',fontFamily:"'Outfit',sans-serif",
          animation:'pulse 1.8s ease-in-out infinite'}}>
          {done?(lastOutro?'tap to close':'tap to continue'):'tap to skip'}
        </div>
      </div>
    )
  }

  // ── VICTORY · EXP tally ──
  return(
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.85)',zIndex:50,
      display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
      <div className="panel" style={{padding:30,maxWidth:420,width:'100%',animation:'fadeIn .4s ease both'}}>
        <div style={{textAlign:'center',marginBottom:20}}>
          <div style={{fontSize:'.6rem',fontWeight:700,letterSpacing:'.4em',textTransform:'uppercase',
            color:'rgba(251,191,36,.6)',fontFamily:"'Outfit',sans-serif",marginBottom:8}}>Victory</div>
          <div className="glow-gold" style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:700,
            fontSize:'1.8rem',background:'linear-gradient(135deg,#fef3c7,#fbbf24,#d97706)',
            WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>The Burning Hour</div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:22}}>
          {award.map(a=>(
            <div key={a.heroId} style={{display:'flex',alignItems:'center',gap:10,padding:'7px 10px',
              borderRadius:8,background:'rgba(255,255,255,.02)',border:'1px solid var(--border)'}}>
              <div style={{width:28,height:28,borderRadius:'50%',overflow:'hidden',
                border:`2px solid ${a.cl}55`,flexShrink:0}}>
                <img src={a.img} alt="" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'20% 10%'}}
                  onError={e=>e.target.style.display='none'}/>
              </div>
              <span style={{fontSize:'.78rem',fontWeight:600,color:a.cl,flex:1}}>{a.n}</span>
              {a.toLv>a.fromLv&&(
                <span className="chip chip-u" style={{fontSize:'.56rem'}}>Lv {a.fromLv} → {a.toLv}</span>
              )}
              <span style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:700,
                color:'var(--green)',fontSize:'.85rem',fontVariantNumeric:'tabular-nums'}}>+{a.gained} EXP</span>
            </div>
          ))}
          {!award.length&&(
            <div style={{fontSize:'.72rem',color:'var(--txt3)',textAlign:'center',padding:'6px 0'}}>
              No survivors to reward.
            </div>
          )}
        </div>
        <div style={{display:'flex',justifyContent:'center'}}>
          {outroLines.length>0
            ?<Btn cls="btn-gold" lg icon={ChevronRight} onClick={()=>{setOi(0);setStage('outro')}}>Continue</Btn>
            :<Btn cls="btn-gold" lg icon={ArrowLeft} onClick={toTitle}>Return to Title</Btn>}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
//  BATTLE SCREEN
// ═══════════════════════════════════════════════════════════════════
function BattleScreen({state,dispatch}){
  const{heroes,enemies,selectedHeroId,selectedCard,moveRange,atkRange,phase,round,log,result,scenario,floaters,hitFlash,playingCard}=state
  const selHero=heroes.find(h=>h.id===selectedHeroId)
  const TILE=38
  const moveSet=useMemo(()=>new Set(moveRange.map(t=>`${t.x},${t.y}`)),[moveRange])
  const atkSet=useMemo(()=>new Set(atkRange.map(e=>e.id)),[atkRange])
  const wallSet=useMemo(()=>new Set((scenario?.walls||[]).map(([x,y])=>`${x},${y}`)),[scenario])

  // ── Game-feel: ticking clock for hit-flash expiry ──
  const [now,setNow]=useState(Date.now())
  useEffect(()=>{
    const anyFlash=Object.keys(hitFlash||{}).length>0
    if(!anyFlash) return
    const iv=setInterval(()=>setNow(Date.now()),80)
    return ()=>clearInterval(iv)
  },[hitFlash])

  // ── Death dissolve: track units that just died, keep them ~400ms ──
  const [dyingIds,setDyingIds]=useState(()=>new Set())
  const prevAliveRef=useRef({heroes:new Set(),enemies:new Set()})
  useEffect(()=>{
    const prevH=prevAliveRef.current.heroes
    const prevE=prevAliveRef.current.enemies
    const justDied=[]
    heroes.forEach(h=>{ if(prevH.has(h.id)&&h.hp<=0) justDied.push(h.id) })
    enemies.forEach(e=>{ if(prevE.has(e.id)&&e.hp<=0) justDied.push(e.id) })
    if(justDied.length){
      setDyingIds(prev=>{ const n=new Set(prev); justDied.forEach(id=>n.add(id)); return n })
      justDied.forEach(id=>{
        setTimeout(()=>setDyingIds(prev=>{ const n=new Set(prev); n.delete(id); return n }),420)
      })
    }
    prevAliveRef.current={
      heroes:new Set(heroes.filter(h=>h.hp>0).map(h=>h.id)),
      enemies:new Set(enemies.filter(e=>e.hp>0).map(e=>e.id)),
    }
  },[heroes,enemies])

  // ── Floater auto-removal ──
  useEffect(()=>{
    if(!floaters.length) return
    const timers=floaters.map(f=>setTimeout(()=>dispatch({type:'REMOVE_FLOATER',id:f.id}),900))
    return ()=>timers.forEach(clearTimeout)
  },[floaters,dispatch])

  // ── Card flourish auto-clear ──
  useEffect(()=>{
    if(!playingCard) return
    const t=setTimeout(()=>dispatch({type:'CLEAR_CARD_FLOURISH'}),820)
    return ()=>clearTimeout(t)
  },[playingCard,dispatch])

  // ── Banner auto-clear ──
  useEffect(()=>{
    if(!state.banner) return
    const t=setTimeout(()=>dispatch({type:'CLEAR_BANNER'}),1100)
    return ()=>clearTimeout(t)
  },[state.banner,dispatch])

  // ── Enemy phase replay: walk the queue with stagger ──
  const queueRunning=useRef(false)
  useEffect(()=>{
    if(state.phase!=='enemy') return
    if(queueRunning.current) return
    // Empty queue (no living enemies) — end phase after the banner
    if(!state.enemyQueue.length){
      queueRunning.current=true
      const t=setTimeout(()=>{ dispatch({type:'END_ENEMY_PHASE'}); queueRunning.current=false },1300)
      return ()=>{ clearTimeout(t); queueRunning.current=false }
    }
    queueRunning.current=true
    const queue=state.enemyQueue
    const timers=[]
    // Wait for the ENEMY PHASE banner to clear (~1150ms) then step through
    let delay=1200
    queue.forEach((step)=>{
      timers.push(setTimeout(()=>dispatch({type:'ENEMY_STEP',step}),delay))
      delay+=650  // stagger: move animates (280ms) then hit feedback shows
    })
    timers.push(setTimeout(()=>{
      dispatch({type:'END_ENEMY_PHASE'})
      queueRunning.current=false
    },delay+250))
    return ()=>{ timers.forEach(clearTimeout); queueRunning.current=false }
  },[state.phase,state.enemyQueue,dispatch])

  // ── Battle intro ceremony: advance each stage after its beat (skippable) ──
  useEffect(()=>{
    const stage=state.introStage
    if(!stage||stage==='done') return
    // Respect reduced motion — jump straight to a playable board.
    if(stage==='map'&&typeof window!=='undefined'&&window.matchMedia
       &&window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      dispatch({type:'SET_INTRO',stage:'done'}); return
    }
    const dur ={map:1100,heroes:1600,enemies:1200,objective:1000}[stage]
    const next={map:'heroes',heroes:'enemies',enemies:'objective',objective:'done'}[stage]
    if(!next) return
    const t=setTimeout(()=>dispatch({type:'SET_INTRO',stage:next}),dur)
    return ()=>clearTimeout(t)
  },[state.introStage,dispatch])

  if(!scenario) return null
  const introStep={map:0,heroes:1,enemies:2,objective:3,done:4}[state.introStage]??4
  const introActive=introStep<4
  return(
    <div style={{display:'flex',flexDirection:'column',height:'100vh',overflow:'hidden',background:'var(--bg)'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',
        padding:'7px 14px',borderBottom:'1px solid var(--border)',flexShrink:0,background:'var(--panel)'}}>
        <div style={{display:'flex',alignItems:'center',gap:14}}>
          <div>
            <span style={{fontSize:'.56rem',color:'var(--txt3)',fontWeight:700,letterSpacing:'.08em',display:'block'}}>ROUND</span>
            <span style={{fontFamily:"'Fraunces',serif",fontSize:'1.2rem',fontWeight:700,color:'var(--gold)'}}>{String(round).padStart(2,'0')}</span>
          </div>
          <div style={{padding:'4px 12px',borderRadius:20,fontSize:'.68rem',fontWeight:700,letterSpacing:'.06em',
            background:phase==='player'?'rgba(45,212,191,.15)':'rgba(248,113,113,.15)',
            color:phase==='player'?'#2dd4bf':'#f87171',
            border:`1px solid ${phase==='player'?'rgba(45,212,191,.3)':'rgba(248,113,113,.3)'}`}}>
            ◆ {phase==='player'?'PLAYER PHASE':'ENEMY PHASE'}
          </div>
        </div>
        <div style={{display:'flex',gap:5}}>
          {heroes.map(h=>(
            <div key={h.id} style={{display:'flex',alignItems:'center',gap:5,
              padding:'3px 7px',borderRadius:7,background:'var(--bg2)',
              border:`1px solid ${h.hp>0?h.cl+'44':'rgba(255,255,255,.05)'}`,opacity:h.hp>0?1:.4}}>
              <div style={{width:18,height:18,borderRadius:'50%',overflow:'hidden',
                border:`1px solid ${h.cl}55`,flexShrink:0}}>
                <img src={h.img} alt="" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'20% 10%'}}
                  onError={e=>e.target.style.display='none'}/>
              </div>
              <div>
                <div style={{fontSize:'.56rem',color:'var(--txt3)',fontWeight:600}}>{h.n}</div>
                <div style={{width:44}}><HpBar hp={h.hp} mhp={h.mhp} cl={h.cl}/></div>
              </div>
            </div>
          ))}
        </div>
        <div style={{display:'flex',gap:6}}>
          <Btn cls="btn-ghost" sm icon={BookOpen} onClick={()=>dispatch({type:'GO',to:'knowledge'})}>KB</Btn>
          <Btn cls="btn-ghost" sm icon={Settings} onClick={()=>dispatch({type:'GO',to:'admin'})}>Dev</Btn>
        </div>
      </div>
      <div style={{flex:1,minHeight:0,display:'flex',overflow:'hidden'}}>
        <div style={{width:172,flexShrink:0,borderRight:'1px solid var(--border)',
          overflowY:'auto',padding:8,display:'flex',flexDirection:'column',gap:5}}>
          <div style={{fontSize:'.58rem',fontWeight:700,letterSpacing:'.1em',color:'var(--txt3)',
            marginBottom:2,textTransform:'uppercase'}}>Party</div>
          {heroes.map(h=>(
            <div key={h.id} style={{borderRadius:7,padding:7,cursor:h.hp>0&&!h.done?'pointer':'default',
              background:selectedHeroId===h.id?`${h.cl}11`:'rgba(255,255,255,.02)',
              border:`1px solid ${selectedHeroId===h.id?h.cl+'44':'transparent'}`,
              opacity:h.hp<=0?.35:h.done?.55:1,transition:'all .15s'}}
              onClick={()=>!state.phaseAnimating&&h.hp>0&&!h.done&&dispatch({type:'SELECT_HERO',id:h.id})}>
              <div style={{display:'flex',alignItems:'center',gap:5,marginBottom:4}}>
                <div style={{width:24,height:24,borderRadius:'50%',overflow:'hidden',
                  border:`2px solid ${h.cl}55`,flexShrink:0}}>
                  <img src={h.img} alt="" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'20% 10%'}}
                    onError={e=>e.target.style.display='none'}/>
                </div>
                <div style={{minWidth:0}}>
                  <div style={{fontSize:'.7rem',fontWeight:700,color:h.cl,
                    whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{h.n}</div>
                  <div style={{fontSize:'.6rem',color:'var(--txt3)'}}>{h.hp}/{h.mhp} HP</div>
                </div>
                {h.done&&<span style={{marginLeft:'auto',fontSize:'.58rem',color:'var(--txt3)'}}>&#10003;</span>}
                {h.hp<=0&&<Skull size={11} color="#f87171" style={{marginLeft:'auto'}}/>}
              </div>
              <HpBar hp={h.hp} mhp={h.mhp} cl={h.cl}/>
            </div>
          ))}
          <div style={{fontSize:'.58rem',fontWeight:700,letterSpacing:'.1em',color:'var(--txt3)',
            marginTop:6,textTransform:'uppercase'}}>Enemies</div>
          {enemies.filter(e=>e.hp>0).map(e=>(
            <div key={e.id} style={{padding:'5px 7px',borderRadius:6,
              background:'rgba(248,113,113,.05)',border:'1px solid rgba(248,113,113,.12)'}}>
              <div style={{display:'flex',alignItems:'center',gap:4,marginBottom:3}}>
                <span style={{fontSize:'.78rem'}}>{e.ic}</span>
                <span style={{fontSize:'.68rem',fontWeight:600,color:'var(--txt2)'}}>{e.n}</span>
              </div>
              <HpBar hp={e.hp} mhp={e.mhp} cl='#f87171'/>
            </div>
          ))}
        </div>
        <div style={{flex:1,minWidth:0,overflow:'auto',display:'flex',
          alignItems:'center',justifyContent:'center',padding:8,background:'var(--bg)'}}>
          <div style={{position:'relative',
            width:scenario.w*TILE,height:scenario.h*TILE}}>
            {/* Tile grid layer (clickable) */}
            <div style={{position:'absolute',inset:0,display:'grid',
              gridTemplateColumns:`repeat(${scenario.w},${TILE}px)`,
              gridTemplateRows:`repeat(${scenario.h},${TILE}px)`}}>
              {Array.from({length:scenario.h},(_,y)=>Array.from({length:scenario.w},(_,x)=>{
                const k=`${x},${y}`
                const isWall=wallSet.has(k)
                const isMove=moveSet.has(k)
                const enemy=enemies.find(e=>e.x===x&&e.y===y&&e.hp>0)
                const hero=heroes.find(h=>h.x===x&&h.y===y&&h.hp>0)
                const canAtk=enemy&&atkSet.has(enemy.id)
                const xZ=x<4?'#0b0a1e':x>9?'#0d0813':'#090818'
                return(
                  <div key={k} className={`tile ${isWall?'t-wall':isMove?'t-move':canAtk?'t-atk':''}`}
                    style={{width:TILE,height:TILE,background:isWall?undefined:xZ,
                      ...(state.introStage==='map'?{animation:'tilePop .4s ease both',animationDelay:`${(x+y)*26}ms`}:{})}}
                    onClick={()=>{
                      if(state.phaseAnimating) return
                      if(isMove) dispatch({type:'MOVE_HERO',x,y})
                      else if(hero) dispatch({type:'SELECT_HERO',id:hero.id})
                      else if(canAtk) dispatch({type:'ATTACK',id:enemy.id})
                    }}>
                    {isWall&&<span style={{fontSize:'.7rem',opacity:.4}}>&#x1F9F1;</span>}
                  </div>
                )
              }))}
            </div>
            {/* Token overlay layer (absolute, animated) */}
            {introStep>=1&&heroes.filter(h=>h.hp>0||dyingIds.has(h.id)).map((h,hi)=>{
              const flashing=hitFlash[h.id]&&(now-hitFlash[h.id]<250)
              const spawning=state.introStage==='heroes'
              return(
                <div key={h.id} className={`board-token ${dyingIds.has(h.id)?'dying':''} ${flashing?'flashing':''}`}
                  style={{left:h.x*TILE,top:h.y*TILE,width:TILE,height:TILE,
                    display:'flex',alignItems:'center',justifyContent:'center'}}
                  onClick={()=>!state.phaseAnimating&&h.hp>0&&!h.done&&dispatch({type:'SELECT_HERO',id:h.id})}>
                  {spawning&&(
                    <div style={{position:'absolute',top:-13,left:'50%',transform:'translateX(-50%)',
                      fontSize:'.5rem',fontWeight:800,letterSpacing:'.14em',textTransform:'uppercase',
                      color:h.cl,whiteSpace:'nowrap',fontFamily:"'Outfit',sans-serif",pointerEvents:'none',
                      animation:'fadeIn .4s ease both'}}>{h.n}</div>
                  )}
                  <div className={`token ${selectedHeroId===h.id?'token-sel':''} ${h.done?'token-done':''}`}
                    style={{borderColor:h.cl,background:'var(--bg2)',cursor:h.hp>0&&!h.done?'pointer':'default',
                      ...(spawning?{animation:`tokenSpawn .5s ease ${hi*140}ms both`,
                        boxShadow:`0 0 0 3px ${h.cl}55,0 0 16px ${h.cl}44`}:{})}}>
                    <img src={h.img} alt="" onError={e=>e.target.style.display='none'}/>
                  </div>
                  {h.hp<h.mhp&&h.hp>0&&(
                    <div style={{position:'absolute',bottom:1,left:'50%',transform:'translateX(-50%)',
                      width:TILE-12,height:3}}>
                      <HpBar hp={h.hp} mhp={h.mhp} cl={h.cl}/>
                    </div>
                  )}
                </div>
              )
            })}
            {introStep>=2&&enemies.filter(e=>e.hp>0||dyingIds.has(e.id)).map((e,ei)=>{
              const canAtk=atkSet.has(e.id)
              const flashing=hitFlash[e.id]&&(now-hitFlash[e.id]<250)
              const warping=state.introStage==='enemies'
              return(
                <div key={e.id} className={`board-token ${dyingIds.has(e.id)?'dying':''} ${flashing?'flashing':''}`}
                  style={{left:e.x*TILE,top:e.y*TILE,width:TILE,height:TILE,
                    display:'flex',alignItems:'center',justifyContent:'center'}}
                  onClick={()=>!state.phaseAnimating&&canAtk&&dispatch({type:'ATTACK',id:e.id})}>
                  <div className={`token ${canAtk?'token-sel':''}`}
                    style={{borderColor:'#f87171',background:'#200a0a',fontSize:'.85rem',
                      cursor:canAtk?'pointer':'default',
                      ...(warping?{animation:`warpIn .55s ease ${ei*220}ms both`,
                        boxShadow:'0 0 14px rgba(248,113,113,.6)'}:{})}}>
                    {e.ic}
                  </div>
                  {e.hp<e.mhp&&e.hp>0&&(
                    <div style={{position:'absolute',bottom:1,left:'50%',transform:'translateX(-50%)',
                      width:TILE-12,height:3}}>
                      <HpBar hp={e.hp} mhp={e.mhp} cl='#f87171'/>
                    </div>
                  )}
                </div>
              )
            })}
            {/* Floating damage numbers */}
            {floaters.map(f=>(
              <div key={f.id} className="floater"
                style={{left:f.x*TILE+TILE/2,top:f.y*TILE+4,
                  transform:'translateX(-50%)',
                  fontSize:f.big?'1.05rem':'.85rem',color:f.color}}>
                {f.text}
              </div>
            ))}
          </div>
        </div>
        <div style={{width:210,flexShrink:0,borderLeft:'1px solid var(--border)',display:'flex',flexDirection:'column',overflow:'hidden'}}>
          {selHero?(
            <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
              <div style={{padding:10,borderBottom:'1px solid var(--border)',flexShrink:0}}>
                <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:8}}>
                  <div style={{width:34,height:34,borderRadius:'50%',overflow:'hidden',border:`2px solid ${selHero.cl}`,flexShrink:0}}>
                    <img src={selHero.img} alt="" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'20% 10%'}}
                      onError={e=>e.target.style.display='none'}/>
                  </div>
                  <div>
                    <div style={{fontWeight:700,color:selHero.cl,fontSize:'.82rem'}}>{selHero.n}</div>
                    <div style={{fontSize:'.62rem',color:'var(--txt3)'}}>{selHero.cardPlayed?'Card played':'Choose a card'}</div>
                  </div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:3}}>
                  {[['AT',selHero.at,'#fbbf24'],['MV',selHero.mv,'#2dd4bf'],['RG',selHero.rg,'#a78bfa'],['HP',selHero.hp,'#f87171']].map(([l,v,c])=>(
                    <div key={l} style={{textAlign:'center',padding:'3px 2px',background:'rgba(255,255,255,.03)',borderRadius:4}}>
                      <div style={{fontSize:'.5rem',color:'var(--txt3)',fontWeight:700}}>{l}</div>
                      <div style={{fontSize:'.78rem',fontWeight:800,color:c}}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{flex:1,minHeight:0,overflowY:'auto',padding:8}}>
                <div style={{fontSize:'.58rem',fontWeight:700,letterSpacing:'.08em',color:'var(--txt3)',marginBottom:6,textTransform:'uppercase'}}>Ability Cards</div>
                <div style={{display:'flex',flexDirection:'column',gap:4}}>
                  {(selHero.cards||[]).map(card=>{
                    const isSel=selectedCard===card.id
                    const played=selHero.cardPlayed&&selHero.cardPlayed!==card.id
                    return(
                      <div key={card.id}
                        className={`acard ${isSel?'acard-sel':''} ${card.tp==='U'?'acard-ult':''}`}
                        style={{opacity:played?.4:1,cursor:played?'default':'pointer'}}
                        onClick={()=>!played&&dispatch({type:'SELECT_CARD',id:card.id})}>
                        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:2}}>
                          <span style={{fontSize:'.7rem',fontWeight:700,color:card.tp==='U'?'#fbbf24':'var(--txt)'}}>{card.n}</span>
                          <span className={card.tp==='U'?'chip chip-u':'chip chip-n'}>{card.tp}</span>
                        </div>
                        <div style={{fontSize:'.61rem',color:'var(--txt2)'}}>{card.d}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div style={{padding:8,borderTop:'1px solid var(--border)',display:'flex',flexDirection:'column',gap:5,flexShrink:0}}>
                <div style={{display:'flex',gap:5}}>
                  <Btn cls="btn-teal" sm icon={Move} disabled={!selHero.cardPlayed}
                    onClick={()=>{}} style={{flex:1}}>Move</Btn>
                  <Btn cls="btn-red" sm icon={Crosshair} disabled={!selHero.cardPlayed||selHero.atkLeft<=0}
                    onClick={()=>{}} style={{flex:1}}>Atk</Btn>
                </div>
                <Btn cls="btn-ghost" sm icon={SkipForward} disabled={state.phaseAnimating} onClick={()=>dispatch({type:'END_HERO_TURN'})}>End Turn</Btn>
              </div>
            </div>
          ):(
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',
              justifyContent:'center',height:'100%',gap:8,padding:16,opacity:.45}}>
              <User size={28} color="var(--txt3)"/>
              <div style={{fontSize:'.72rem',color:'var(--txt3)',textAlign:'center'}}>Select a hero to command</div>
            </div>
          )}
          <div style={{height:110,borderTop:'1px solid var(--border)',overflowY:'auto',
            padding:7,background:'rgba(0,0,0,.2)',flexShrink:0}}>
            <div style={{fontSize:'.56rem',fontWeight:700,letterSpacing:'.08em',
              color:'var(--txt3)',marginBottom:3,textTransform:'uppercase'}}>Log</div>
            {log.map((l,i)=>(
              <div key={i} style={{fontSize:'.62rem',color:i===0?'var(--txt2)':'var(--txt3)',padding:'1px 0',lineHeight:1.4}}>{l}</div>
            ))}
          </div>
        </div>
      </div>
      {/* Phase transition banner */}
      {/* Intro ceremony: full-screen catcher locks input and skips on click */}
      {introActive&&(
        <div onClick={()=>dispatch({type:'SET_INTRO',stage:'done'})}
          style={{position:'fixed',inset:0,zIndex:45,cursor:'pointer',background:'transparent'}}>
          <div style={{position:'absolute',bottom:22,left:'50%',transform:'translateX(-50%)',
            fontSize:'.54rem',fontWeight:600,letterSpacing:'.28em',textTransform:'uppercase',
            color:'rgba(255,255,255,.28)',fontFamily:"'Outfit',sans-serif",
            animation:'pulse 1.8s ease-in-out infinite'}}>tap to skip</div>
        </div>
      )}
      {state.banner&&(()=>{
        const tc={enemy:['#f87171','rgba(248,113,113,'],gold:['#fbbf24','rgba(251,191,36,'],player:['#2dd4bf','rgba(45,212,191,']}[state.banner.tone]||['#2dd4bf','rgba(45,212,191,']
        const[col,rgb]=tc
        return(
        <div className="phase-banner">
          <div className="rule" style={{background:`linear-gradient(to right,transparent,${rgb}.4))`}}/>
          <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:800,
            fontSize:'1.05rem',letterSpacing:'.28em',textTransform:'uppercase',
            color:col,textShadow:`0 0 30px ${rgb}.5)`,whiteSpace:'nowrap'}}>
            {state.banner.text}
          </div>
          <div className="rule" style={{background:`linear-gradient(to left,transparent,${rgb}.4))`}}/>
        </div>
        )
      })()}
      {/* Card play flourish */}
      {playingCard&&(
        <div className="card-flourish" style={{
          border:`1px solid ${playingCard.card.tp==='U'?'rgba(251,191,36,.5)':'rgba(255,255,255,.15)'}`,
          boxShadow:playingCard.card.tp==='U'
            ?'0 0 70px rgba(251,191,36,.35),0 20px 50px rgba(0,0,0,.6)'
            :'0 0 50px rgba(45,212,191,.2),0 20px 50px rgba(0,0,0,.6)'}}>
          <div style={{fontSize:'.55rem',fontWeight:800,letterSpacing:'.18em',
            textTransform:'uppercase',marginBottom:6,
            color:playingCard.card.tp==='U'?'#fbbf24':playingCard.heroCl}}>
            {playingCard.card.tp==='U'?'Ultimate':'Ability'}
          </div>
          <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:700,
            fontSize:'1.15rem',color:playingCard.card.tp==='U'?'#fbbf24':'#fff',
            lineHeight:1.15,marginBottom:8}}>
            {playingCard.card.n}
          </div>
          <div style={{fontSize:'.72rem',color:'var(--txt2)',lineHeight:1.5}}>
            {playingCard.card.d}
          </div>
        </div>
      )}
      {result&&<PostBattle state={state} dispatch={dispatch}/>}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
//  KNOWLEDGE BASE
// ═══════════════════════════════════════════════════════════════════
function CardRow({card}){
  return(
    <div style={{display:'grid',gridTemplateColumns:'22px 30px 160px 1fr',
      alignItems:'center',gap:'0 7px',padding:'5px 8px',borderRadius:5,
      background:'rgba(255,255,255,.02)',borderBottom:'1px solid var(--border)'}}>
      <span style={{fontSize:'.6rem',color:'var(--txt3)',fontWeight:700,textAlign:'right'}}>{card.lv}</span>
      <span className={card.tp==='U'?'chip chip-u':'chip chip-n'}
        style={{fontSize:'.52rem',padding:'1px 4px'}}>{card.tp==='U'?'ULT':'NRM'}</span>
      <span style={{fontSize:'.7rem',fontWeight:600,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{card.n}</span>
      <span style={{fontSize:'.66rem',color:'var(--txt2)'}}>{card.d}</span>
    </div>
  )
}
function HeroDetail({hero}){
  const h=hero
  const cards=CARDS[h.id]||[]
  return(
    <div style={{display:'grid',gridTemplateColumns:'240px 1fr',height:'100%'}}>
      <div style={{borderRight:'1px solid var(--border)',display:'flex',flexDirection:'column',overflow:'hidden'}}>
        <div style={{position:'relative',aspectRatio:'3/4',flexShrink:0}}>
          <img src={h.img} alt={h.n} style={{position:'absolute',inset:0,width:'100%',height:'100%',
            objectFit:'cover',objectPosition:'20% 10%'}}
            onError={e=>e.target.style.display='none'}/>
          <div style={{position:'absolute',inset:0,
            background:'linear-gradient(to top,rgba(0,0,0,.95) 0%,rgba(0,0,0,.25) 50%,transparent 70%)'}}/>
          <div style={{position:'absolute',bottom:0,left:0,right:0,padding:14}}>
            <div style={{fontSize:'.54rem',fontWeight:800,letterSpacing:'.14em',color:h.cl,
              textTransform:'uppercase',marginBottom:3}}>{h.t}</div>
            <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontSize:'1.4rem',fontWeight:700,marginBottom:2}}>{h.n}</div>
            <div style={{fontSize:'.72rem',color:'var(--txt3)'}}>{h.r}</div>
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',borderBottom:'1px solid var(--border)'}}>
          {[['HP',h.hp,'#f87171'],['ATK',h.at,'#fbbf24'],['MOV',h.mv,'#2dd4bf'],['RNG',h.rg,'#a78bfa']].map(([l,v,c])=>(
            <div key={l} style={{padding:'9px 4px',textAlign:'center',borderRight:'1px solid var(--border)'}}>
              <div style={{fontSize:'.52rem',color:'var(--txt3)',fontWeight:700,letterSpacing:'.08em',marginBottom:3}}>{l}</div>
              <div style={{fontSize:'1rem',fontWeight:800,color:c}}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{flex:1,overflowY:'auto',padding:13}}>
          <div style={{fontSize:'.6rem',fontWeight:700,letterSpacing:'.1em',color:'var(--txt3)',marginBottom:6,textTransform:'uppercase'}}>Background</div>
          <p style={{fontSize:'.74rem',color:'var(--txt2)',lineHeight:1.72,marginBottom:14}}>{h.bi}</p>
          <div style={{fontSize:'.6rem',fontWeight:700,letterSpacing:'.1em',color:'#2dd4bf',marginBottom:6,textTransform:'uppercase'}}>Playstyle</div>
          <p style={{fontSize:'.74rem',color:'var(--txt2)',lineHeight:1.72,
            borderLeft:'3px solid rgba(45,212,191,.35)',paddingLeft:10}}>{h.pl}</p>
        </div>
      </div>
      <div style={{overflowY:'auto',padding:18}}>
        <div style={{fontSize:'.62rem',fontWeight:700,letterSpacing:'.12em',color:'#60a5fa',
          marginBottom:10,textTransform:'uppercase',display:'flex',alignItems:'center',gap:8}}>
          Normal Cards<div style={{flex:1,height:1,background:'rgba(96,165,250,.2)'}}/>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:3,marginBottom:20}}>
          {cards.filter(c=>c.tp==='N').map(c=><CardRow key={c.id} card={c}/>)}
        </div>
        <div style={{fontSize:'.62rem',fontWeight:700,letterSpacing:'.12em',color:'#fbbf24',
          marginBottom:10,textTransform:'uppercase',display:'flex',alignItems:'center',gap:8}}>
          Ultimate Cards<div style={{flex:1,height:1,background:'rgba(251,191,36,.2)'}}/>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:3}}>
          {cards.filter(c=>c.tp==='U').map(c=><CardRow key={c.id} card={c}/>)}
        </div>
      </div>
    </div>
  )
}
function KnowledgeScreen({state,dispatch}){
  const{kbTab,kbHero}=state
  const back=()=>{ if(kbHero) dispatch({type:'SET_KB_HERO',hero:null}); else dispatch({type:'GO',to:state.prevScreen||'title'}) }
  return(
    <div style={{display:'flex',flexDirection:'column',height:'100vh',overflow:'hidden',background:'var(--bg)'}}>
      <div style={{display:'flex',alignItems:'center',gap:10,padding:'9px 14px',
        borderBottom:'1px solid var(--border)',flexShrink:0,background:'var(--panel)'}}>
        <Btn cls="btn-ghost" sm icon={ArrowLeft} onClick={back}>Back</Btn>
        <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',color:'var(--gold)',fontWeight:600}}>Knowledge Base</div>
        {!kbHero&&(
          <div style={{display:'flex',borderBottom:'2px solid var(--border)',marginLeft:'auto',gap:0}}>
            {['heroes','monsters','mechanics'].map(tab=>(
              <button key={tab} className={`tab ${kbTab===tab?'tab-active':''}`}
                style={{background:'none',border:'none',color:'inherit',fontFamily:'inherit'}}
                onClick={()=>dispatch({type:'SET_KB_TAB',tab})}>
                {tab.charAt(0).toUpperCase()+tab.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>
      <div style={{flex:1,minHeight:0,overflow:'hidden'}}>
        {kbHero?<HeroDetail hero={kbHero}/>:
         kbTab==='heroes'?(
          <div style={{overflowY:'auto',height:'100%',padding:14}}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(8,1fr)',gap:6}}>
              {HEROES.map(h=>(
                <div key={h.id} style={{aspectRatio:'2/5',borderRadius:10,overflow:'hidden',
                  border:'1px solid rgba(255,255,255,.07)',background:'var(--panel)',cursor:'pointer'}}
                  onClick={()=>dispatch({type:'SET_KB_HERO',hero:h})}>
                  <div style={{height:'75%',overflow:'hidden',position:'relative'}}>
                    <img src={h.img} alt={h.n} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'20% 10%'}}
                      onError={e=>e.target.style.display='none'}/>
                    <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(0,0,0,.88) 0%,transparent 50%)'}}/>
                    <div style={{position:'absolute',bottom:7,left:7,right:7}}>
                      <div style={{fontSize:'.46rem',color:h.cl,fontWeight:800,textTransform:'uppercase',letterSpacing:'.1em',marginBottom:1}}>{h.t}</div>
                      <div style={{fontFamily:"'Fraunces',serif",fontSize:'.78rem',fontWeight:700}}>{h.n}</div>
                    </div>
                  </div>
                  <div style={{height:'25%',padding:'5px 7px',overflow:'hidden',display:'-webkit-box',
                    WebkitLineClamp:3,WebkitBoxOrient:'vertical',fontSize:'.52rem',color:'var(--txt3)',
                    fontStyle:'italic',lineHeight:1.4,fontFamily:"'Fraunces',serif"}}>{h.bi}</div>
                </div>
              ))}
            </div>
          </div>
        ):kbTab==='monsters'?(
          <div style={{overflowY:'auto',height:'100%',padding:16}}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:10}}>
              {MONSTERS.map(m=>(
                <Panel key={m.id}>
                  <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:9}}>
                    <div style={{width:38,height:38,borderRadius:'50%',background:`${m.cl}22`,
                      border:`2px solid ${m.cl}55`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem'}}>{m.ic}</div>
                    <div>
                      <div style={{fontWeight:700,color:m.cl,fontSize:'.82rem'}}>{m.n}</div>
                      <div style={{fontSize:'.66rem',color:'var(--txt3)'}}>Enemy Unit</div>
                    </div>
                  </div>
                  <p style={{fontSize:'.73rem',color:'var(--txt2)',lineHeight:1.6,marginBottom:9}}>{m.desc}</p>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:3}}>
                    {[['HP',m.hp,'#f87171'],['ATK',m.at,'#fbbf24'],['MOV',m.mv,'#2dd4bf'],['RNG',m.rg,'#a78bfa']].map(([l,v,c])=>(
                      <div key={l} style={{textAlign:'center',padding:5,background:'rgba(255,255,255,.03)',borderRadius:5}}>
                        <div style={{fontSize:'.52rem',color:'var(--txt3)',fontWeight:700}}>{l}</div>
                        <div style={{fontSize:'.86rem',fontWeight:800,color:c}}>{v}</div>
                      </div>
                    ))}
                  </div>
                </Panel>
              ))}
            </div>
          </div>
        ):(
          <div style={{overflowY:'auto',height:'100%',padding:16}}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:10}}>
              {[
                ['Action Points (ATP)','Each hero gets 1 Move ATP + 1 Attack ATP per turn. Playing a card can grant bonus ATP. Use all actions before ending your turn.'],
                ['Ability Cards','Choose one ability card per turn before acting. Cards grant stat boosts, healing, damage reduction, or extra actions. Stats reset each turn.'],
                ['Movement','After playing a card, click Move to see reachable tiles highlighted in teal. Click a tile to move there.'],
                ['Combat','Click Attack after moving. Red tiles show enemies in range. RNG 1 = melee only, RNG 3+ = ranged attack.'],
                ['Damage Reduction','Some cards grant DR. Each point reduces incoming damage by 1. DR resets at the start of your next turn.'],
                ['Enemy Phase','After all heroes act, enemies move toward the nearest hero and attack if in range.'],
              ].map(([title,body])=>(
                <Panel key={title}>
                  <div style={{fontWeight:700,color:'var(--gold)',marginBottom:8,fontSize:'.82rem'}}>{title}</div>
                  <p style={{fontSize:'.74rem',color:'var(--txt2)',lineHeight:1.72}}>{body}</p>
                </Panel>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
//  ADMIN SCREEN
// ═══════════════════════════════════════════════════════════════════
function AdminScreen({state,dispatch}){
  const{godMode,adminMsg,partyLevels}=state
  const log=(msg)=>dispatch({type:'ADMIN_MSG',msg})
  function jumpBattle(scIdx){
    const sc=SCENARIOS[scIdx]||SCENARIOS[0]
    const heroIds=state.party.length>=4?state.party:HEROES.slice(0,4).map(h=>h.id)
    dispatch({type:'RESET'})
    setTimeout(()=>{
      heroIds.forEach(id=>dispatch({type:'SELECT_PARTY_HERO',id}))
      setTimeout(()=>{ dispatch({type:'START_GAME',scenario:sc}); log(`Jumped to ${sc.title}`) },50)
    },50)
  }
  return(
    <div style={{display:'flex',flexDirection:'column',height:'100vh',overflow:'hidden',background:'var(--bg)'}}>
      <div style={{display:'flex',alignItems:'center',gap:10,padding:'9px 14px',
        borderBottom:'1px solid var(--border)',flexShrink:0,background:'var(--panel)'}}>
        <Btn cls="btn-ghost" sm icon={ArrowLeft} onClick={()=>dispatch({type:'GO',to:'title'})}>Back</Btn>
        <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',color:'#a78bfa',fontWeight:600}}>Admin / Dev Tools</div>
        <span style={{marginLeft:'auto',fontSize:'.64rem',padding:'2px 9px',borderRadius:20,
          background:'rgba(139,92,246,.15)',color:'#a78bfa',border:'1px solid rgba(139,92,246,.25)'}}>DEV</span>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:18,display:'flex',flexDirection:'column',gap:14}}>
        {adminMsg&&(
          <div style={{padding:'7px 12px',borderRadius:7,background:'rgba(45,212,191,.1)',
            border:'1px solid rgba(45,212,191,.25)',color:'#2dd4bf',fontSize:'.76rem'}}>
            ✓ {adminMsg}
          </div>
        )}
        <Panel>
          <div style={{fontWeight:700,color:'var(--gold)',marginBottom:9,fontSize:'.8rem',display:'flex',alignItems:'center',gap:5}}>
            <FastForward size={13}/> Quick Navigate
          </div>
          <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
            {[['Title','title'],['Narrator','narrator'],['Knowledge','knowledge']].map(([label,screen])=>(
              <Btn key={screen} cls="btn-ghost" sm
                onClick={()=>{dispatch({type:'GO',to:screen});log(`\u2192 ${label}`)}}>
                {label}
              </Btn>
            ))}
          </div>
        </Panel>
        <Panel>
          <div style={{fontWeight:700,color:'#f87171',marginBottom:9,fontSize:'.8rem',display:'flex',alignItems:'center',gap:5}}>
            <Sword size={13}/> Jump to Battle
          </div>
          <div style={{display:'flex',gap:6,marginBottom:7}}>
            {SCENARIOS.map((sc,i)=>(
              <Btn key={sc.id} cls="btn-red" sm onClick={()=>jumpBattle(i)}>
                {sc.title.split('\u2014')[0].trim()}
              </Btn>
            ))}
          </div>
          <div style={{fontSize:'.68rem',color:'var(--txt3)'}}>Uses current party or defaults to first 4 heroes.</div>
        </Panel>
        <Panel>
          <div style={{fontWeight:700,color:'#2dd4bf',marginBottom:9,fontSize:'.8rem',display:'flex',alignItems:'center',gap:5}}>
            <Star size={13}/> Hero Levels
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))',gap:7}}>
            {HEROES.map(h=>(
              <div key={h.id} style={{display:'flex',alignItems:'center',gap:7,padding:'5px 7px',
                borderRadius:7,background:'rgba(255,255,255,.02)',border:'1px solid var(--border)'}}>
                <div style={{width:22,height:22,borderRadius:'50%',overflow:'hidden',border:`2px solid ${h.cl}44`,flexShrink:0}}>
                  <img src={h.img} alt="" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'20% 10%'}}
                    onError={e=>e.target.style.display='none'}/>
                </div>
                <span style={{fontSize:'.7rem',fontWeight:600,flex:1,color:h.cl}}>{h.n}</span>
                <select value={partyLevels[h.id]||1}
                  onChange={e=>dispatch({type:'SET_LEVEL',hid:h.id,lv:+e.target.value})}
                  style={{background:'var(--bg2)',border:'1px solid var(--border)',color:'var(--txt)',
                    borderRadius:4,padding:'2px 3px',fontSize:'.7rem'}}>
                  {[1,5,10,15,20,25,30].map(lv=><option key={lv} value={lv}>Lv {lv}</option>)}
                </select>
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <div style={{fontWeight:700,color:'#fbbf24',marginBottom:9,fontSize:'.8rem',display:'flex',alignItems:'center',gap:5}}>
            <Settings size={13}/> Flags
          </div>
          <label style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer'}}>
            <div style={{width:34,height:18,borderRadius:9,position:'relative',
              background:godMode?'rgba(251,191,36,.4)':'rgba(255,255,255,.08)',
              border:`1px solid ${godMode?'rgba(251,191,36,.6)':'var(--border)'}`,
              transition:'all .2s',cursor:'pointer'}}
              onClick={()=>dispatch({type:'SET_GOD',v:!godMode})}>
              <div style={{position:'absolute',top:2,left:godMode?'calc(100% - 16px)':2,
                width:12,height:12,borderRadius:'50%',
                background:godMode?'var(--gold)':'rgba(255,255,255,.3)',transition:'all .2s'}}/>
            </div>
            <div>
              <div style={{fontSize:'.76rem',fontWeight:600}}>God Mode</div>
              <div style={{fontSize:'.66rem',color:'var(--txt3)'}}>Heroes cannot take damage</div>
            </div>
          </label>
        </Panel>
        <Panel>
          <div style={{fontWeight:700,color:'#a78bfa',marginBottom:9,fontSize:'.8rem',display:'flex',alignItems:'center',gap:5}}>
            <Database size={13}/> State
          </div>
          <div style={{fontFamily:'monospace',fontSize:'.63rem',color:'var(--txt3)',
            background:'rgba(0,0,0,.3)',borderRadius:5,padding:9,maxHeight:140,overflowY:'auto',lineHeight:1.6}}>
            <div>screen: {state.screen}</div>
            <div>party: [{state.party.join(', ')}]</div>
            <div>cleared: [{state.progress.chaptersCleared.join(', ')}]</div>
            <div>heroExp: {Object.entries(state.progress.heroExp).map(([k,v])=>`${k}:${v}`).join(' ')||'—'}</div>
            <div>godMode: {String(godMode)}</div>
            <div>round: {state.round}</div>
            <div>heroes alive: {state.heroes.filter(h=>h.hp>0).length}</div>
            <div>enemies alive: {state.enemies.filter(e=>e.hp>0).length}</div>
            <div>result: {state.result||'null'}</div>
          </div>
        </Panel>
        <Btn cls="btn-red" icon={RotateCcw} onClick={()=>{dispatch({type:'RESET'});log('State reset!')}}>Reset All State</Btn>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
//  APP ROOT
// ═══════════════════════════════════════════════════════════════════
export default function App(){
  const [state, dispatch] = useReducer(reducer, INIT)
  function renderScreen(){
    switch(state.screen){
      case 'title':     return <TitleScreen state={state} dispatch={dispatch}/>
      case 'narrator':  return <NarratorScreen state={state} dispatch={dispatch}/>
      case 'battle':    return <BattleScreen state={state} dispatch={dispatch}/>
      case 'knowledge': return <KnowledgeScreen state={state} dispatch={dispatch}/>
      case 'admin':     return <AdminScreen state={state} dispatch={dispatch}/>
      default:          return <TitleScreen state={state} dispatch={dispatch}/>
    }
  }
  return(
    <div style={{width:'100%',height:'100vh',background:'var(--bg)',color:'var(--txt)',overflow:'hidden'}}>
      <style>{CSS}</style>
      {renderScreen()}
    </div>
  )
}
