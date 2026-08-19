const HEROES = [
  {id:'elena', name:'Elena', role:'Mage Fighter', trait:'Balanced Vanguard', color:'#6ee7d8', image:'legacy/asset-tactic/01elena.png', hp:25, atk:4, mov:3, rng:1, quote:'The eastern watch would not abandon its post without a fight.'},
  {id:'yumi', name:'Yumi', role:'Sage Ranger', trait:'Long-range Precision', color:'#8cb8ff', image:'legacy/asset-tactic/02yumi.png', hp:18, atk:4, mov:3, rng:3, quote:'The birds left before sunrise. Something frightened the whole wood.'},
  {id:'lilith', name:'Lilith', role:'Warlock', trait:'Unstable Power', color:'#d9a0ff', image:'legacy/asset-tactic/03lilith.png', hp:16, atk:6, mov:2, rng:2, quote:'These reports disagree because time itself disagrees.'},
  {id:'aria', name:'Aria', role:'Trickster Mage', trait:'Extreme Mobility', color:'#ff9ccd', image:'legacy/asset-tactic/04aria.png', hp:20, atk:2, mov:4, rng:2, quote:'Missing guards, strange lights, no witnesses. It smells like a trap.'},
  {id:'freya', name:'Freya', role:'Mage Knight', trait:'Defensive Anchor', color:'#ffad72', image:'legacy/asset-tactic/05freya.png', hp:30, atk:3, mov:1, rng:1, quote:'We secure the villagers first. Questions can wait behind a shield.'},
  {id:'nia', name:'Nia', role:'Beast Master', trait:'Relentless Hunter', color:'#b9ed74', image:'legacy/asset-tactic/06nia.png', hp:22, atk:4, mov:4, rng:1, quote:'Every animal is running west. Whatever comes is already close.'},
  {id:'seraphina', name:'Seraphina', role:'Arch Bishop', trait:'Sustain & Support', color:'#ffd86f', image:'legacy/asset-tactic/07seraphina.png', hp:22, atk:2, mov:2, rng:3, quote:'The earth has a pulse tonight. I can feel it beneath the floor.'},
  {id:'mei', name:'Mei', role:'Techno Mage', trait:'Mobile Artillery', color:'#68e2f2', image:'legacy/asset-tactic/08mei.png', hp:18, atk:3, mov:4, rng:4, quote:'The timestamps are impossible. Unless the instruments are all correct.'},
]

const state = { screen:'title', selected:[], inspect:null, storyIndex:0, tutorial:0, activeHero:null, cardPlayed:false, moved:false, enemyHp:[8,10,8] }
const app = document.querySelector('#app')
let transitioning = false
const icon = (name) => ({arrow:'→', check:'✓', target:'⌖', move:'◇', card:'▱', sword:'⚔', hour:'◷', info:'i'}[name] || '•')

function button(label, action, cls='primary', disabled=false){
  return `<button class="btn ${cls}" data-action="${action}" ${disabled?'disabled':''}><span>${label}</span><b>${icon('arrow')}</b></button>`
}
function render(entering=false){
  app.className = `screen screen-${state.screen}${entering?' screen-entering':''}`
  app.innerHTML = ({title:titleScreen, whisper:whisperScreen, select:selectScreen, meeting:meetingScreen, impact:impactScreen, prelude:preludeScreen, battle:battleScreen}[state.screen] || titleScreen)()
  bind()
}
function navigate(to){
  if(transitioning || state.screen===to) return
  transitioning = true
  app.classList.add('screen-leave')
  window.setTimeout(()=>{
    state.screen = to
    render(true)
    window.setTimeout(()=>{
      app.classList.remove('screen-entering')
      transitioning = false
    }, 760)
  }, 460)
}

function titleScreen(){ return `
  <section class="title-screen">
    <div class="grain"></div><div class="ambient"><i></i><i></i><i></i><i></i><i></i></div><div class="rift rift-a"></div><div class="rift rift-b"></div>
    <div class="title-mark"><span></span><i>MM</i><span></span></div>
    <p class="eyebrow">A tactical chronicle</p>
    <h1>Magic Maidens<br><em>Tactic</em></h1>
    <p class="title-copy">Nine places at the table.<br>Only five names remain.</p>
    <div class="title-actions"><button class="title-start" data-action="start"><span>Start</span><i></i></button></div>
    <footer class="title-footer"><span>A story-driven tactical RPG</span><i></i><span>Original world by Soft</span></footer>
  </section>` }

function whisperScreen(){ return `
  <section class="narrative dark-scene" data-action="advance-whisper">
    <div class="echo echo-1">RETURN</div><div class="echo echo-2">BEGINNING</div>
    <div class="narrative-copy">
      <span class="ornament">✦</span>
      <p class="whisper">“You left something behind.”</p>
      <p class="whisper delayed">“Go back to where it began.”</p>
    </div>
    <div class="continue-hint"><i></i> click anywhere to wake</div>
  </section>` }

function selectScreen(){
  const cards = HEROES.map((h,i)=>{
    const chosen=state.selected.includes(h.id), inspected=state.inspect===h.id
    return `<article class="hero-card ${chosen?'chosen':''} ${inspected?'inspected':''}" style="--hero:${h.color};--delay:${i*45}ms" data-hero="${h.id}" tabindex="0">
      <div class="hero-index">0${i+1}</div><div class="portrait"><img src="${h.image}" alt="${h.name}"><div class="portrait-shade"></div></div>
      <div class="hero-basic"><small>${h.role}</small><h3>${h.name}</h3><p>${h.trait}</p></div>
      <div class="selected-seal">${icon('check')}</div>
      <div class="hover-line"></div>
    </article>`
  }).join('')
  const h=HEROES.find(x=>x.id===state.inspect)
  const panel = h ? `<aside class="inspect-panel open" style="--hero:${h.color}">
    <button class="close" data-action="close-inspect" aria-label="Close">×</button>
    <p class="eyebrow">Field dossier</p><h2>${h.name}</h2><p class="role">${h.role} · ${h.trait}</p>
    <blockquote>“${h.quote}”</blockquote>
    <div class="stat-guide"><span><b>HP</b>survivability</span><span><b>ATK</b>base damage</span><span><b>MOV</b>tiles per move</span><span><b>RNG</b>attack reach</span></div>
    <div class="stats"><span><i>HP</i><b>${h.hp}</b></span><span><i>ATK</i><b>${h.atk}</b></span><span><i>MOV</i><b>${h.mov}</b></span><span><i>RNG</i><b>${h.rng}</b></span></div>
    <div class="decision-note"><b>${icon('info')} How to choose</b><p>Balance durability, damage, movement and range. Your four choices become the team present in this timeline.</p></div>
    ${button(state.selected.includes(h.id)?'Remove from party':'Choose this maiden','toggle-hero',state.selected.includes(h.id)?'danger':'primary')}
  </aside>` : ''
  return `<section class="roster-screen">
    <header class="roster-head"><div><p class="eyebrow">Prologue · The Table</p><h1>Who sits before you?</h1><p>Hover to reveal a maiden. Select four to continue the meeting.</p></div><div class="party-count"><strong>${state.selected.length}</strong><span>/ 4 selected</span></div></header>
    <div class="roster-layout"><div class="hero-grid">${cards}</div>${panel}</div>
    <footer class="roster-footer"><div class="legend"><span><i>HP</i> Endurance</span><span><i>ATK</i> Power</span><span><i>MOV</i> Mobility</span><span><i>RNG</i> Reach</span></div>${button('Return to the meeting','confirm-party','primary',state.selected.length!==4)}</footer>
  </section>`
}

function meetingScreen(){
 const party=state.selected.map(id=>HEROES.find(h=>h.id===id))
 return `<section class="meeting-scene">
   <div class="tavern-light"></div><div class="table"><div class="map-lines"></div><span class="map-pin p1"></span><span class="map-pin p2"></span></div>
   <div class="party-portraits">${party.map((h,i)=>`<div class="meeting-portrait m${i+1}" style="--hero:${h.color}"><img src="${h.image}" alt="${h.name}"><span>${h.name}</span></div>`).join('')}</div>
   <div class="dialogue-box"><div class="speaker">Narrator</div><p>Your cheek lifts from rough wood. Four voices fall quiet around the map. You remember calling this meeting. You remember being their captain. The reason refuses to return.</p>
   <div class="report-strip"><span>Eastern watch · no response</span><span>Wildlife moving west</span><span>Light beyond the ridge</span></div>${button('Continue the meeting','meeting-next')}</div>
 </section>`
}

function impactScreen(){ return `<section class="impact-scene">
 <div class="crack"></div><div class="impact-copy"><p class="eyebrow">Incident 00</p><h1>THE IMPACT</h1><p>The water trembles first. Then the table. Then the earth.</p><p class="arsenal-fail">You reach for the Arsenal—pain answers. Metal screams somewhere beyond sight, but nothing comes to your hand.</p>${button('Take command','to-prelude')}</div>
 <div class="alarm">EASTERN BELL · ACTIVE</div></section>` }

function preludeScreen(){
 const party=state.selected.map(id=>HEROES.find(h=>h.id===id))
 return `<section class="chapter-screen"><div class="chapter-art"><div class="embers"></div></div><div class="chapter-panel">
 <p class="eyebrow">Act I · Chapter 01</p><h1>The First<br><em>Impact</em></h1><p class="chapter-deck">The street outside the tavern is blocked. Clear every demon before the attack reaches deeper into the village.</p>
 <div class="objective-card"><span>${icon('target')}</span><div><small>Primary objective</small><b>Clear the street</b><p>Defeat all demons blocking the road.</p></div></div>
 <div class="party-row">${party.map(h=>`<img src="${h.image}" title="${h.name}" style="--hero:${h.color}">`).join('')}</div>
 ${button('Deploy the team','deploy')}</div></section>`
}

function battleScreen(){
 const party=state.selected.map(id=>HEROES.find(h=>h.id===id)), step=state.tutorial
 const objectiveOpen=step===0
 const firstHero=party[0]
 const tutorial = [
  {title:'Read the objective',copy:'Every scenario has a clear victory condition. Defeat all three demons to secure the street.',cta:'I understand',act:'tutorial-next'},
  {title:'Select a maiden',copy:`Choose ${firstHero.name} on the board. A selected unit reveals the actions available this turn.`,cta:'Waiting for selection…'},
  {title:'Play a card',copy:`Cards shape the turn. Use an opening card to prepare ${firstHero.name} before she moves.`,cta:'Waiting for a card…'},
  {title:'Move into position',copy:`Teal tiles show reachable ground. Move ${firstHero.name} to the highlighted tile.`,cta:'Waiting for movement…'},
  {title:'Attack',copy:'Red markers show targets in range. Strike the nearest demon.',cta:'Waiting for attack…'},
  {title:'End the turn',copy:'When a maiden has finished acting, pass command to the next member.',cta:'End tutorial turn',act:'tutorial-next'},
  {title:'Enemy phase',copy:'Enemies act after the team. Watch their movement and attack range before the next round.',cta:'Begin free play',act:'finish-tutorial'},
 ][Math.min(step,6)]
 const tiles=Array.from({length:96},(_,i)=>`<div class="tile ${(i===69&&step===3)?'move-target':''}" ${(i===69&&step===3)?'data-action="move-hero"':''} style="--x:${i%12};--y:${Math.floor(i/12)}"></div>`).join('')
 return `<section class="battle-shell">
 <header class="battle-top"><div><p class="eyebrow">Chapter 01</p><h2>The First Impact</h2></div><button class="objective-pill ${objectiveOpen?'pulse':''}" data-action="objective"><span>${icon('target')}</span><div><small>Objective</small><b>Clear the street · ${state.enemyHp.filter(x=>x>0).length} remaining</b></div></button><div class="round"><small>Round</small><b>01</b></div></header>
 <div class="battle-stage"><div class="board-wrap"><div class="board">${tiles}<div class="tavern-label">THE GILDED CUP</div>
 ${party.map((h,i)=>`<button class="unit hero-unit ${state.activeHero===h.id?'active':''} ${step===1&&i===0?'guided':''}" style="--x:${1+i%2};--y:${2+i*1.25};--hero:${h.color}" data-unit="${h.id}"><img src="${h.image}" alt="${h.name}"><i></i><span>${h.name}</span></button>`).join('')}
 ${state.enemyHp.map((hp,i)=>hp>0?`<button class="unit enemy-unit ${step===4&&i===0?'guided':''}" style="--x:${7+i*1.35};--y:${1.5+i*1.8}" data-enemy="${i}"><b>✦</b><i style="--hp:${hp/10*100}%"></i><span>Riftling</span></button>`:'').join('')}
 </div></div>
 <aside class="command-panel"><div class="commander"><div class="commander-mark">A</div><div><small>Commander</small><b>Arsenal Mage</b><p>Arsenal unavailable · issuing field orders</p></div></div>
 <div class="selected-info">${state.activeHero?`<small>Active maiden</small><h3>${HEROES.find(h=>h.id===state.activeHero).name}</h3><div class="mini-stats"><span>HP 25</span><span>ATK 4</span><span>MOV 3</span></div>`:'<p>Select a maiden on the battlefield to inspect her available actions.</p>'}</div>
 <div class="card-hand"><button class="action-card ${step===2?'guided':''} ${state.cardPlayed?'used':''}" data-action="play-card"><small>Attack · Lv 1</small><b>Opening Gambit</b><p>Gain +2 ATK for this turn.</p><span>Choose card ${icon('arrow')}</span></button></div>
 <button class="end-turn" data-action="end-turn">End turn <span>${icon('hour')}</span></button></aside></div>
 <div class="tutorial-callout step-${step}"><span class="step-count">0${step+1} / 07</span><div><h3>${tutorial.title}</h3><p>${tutorial.copy}</p></div>${tutorial.act?`<button data-action="${tutorial.act}">${tutorial.cta} ${icon('arrow')}</button>`:`<small>${tutorial.cta}</small>`}</div>
 </section>`
}

function bind(){
 document.querySelectorAll('[data-action]').forEach(el=>el.addEventListener('click',e=>{e.stopPropagation();act(el.dataset.action)}))
 document.querySelectorAll('[data-hero]').forEach(el=>{
  el.addEventListener('mouseenter',()=>{if(state.inspect!==el.dataset.hero){state.inspect=el.dataset.hero;render()}},{once:true})
  el.addEventListener('focus',()=>{if(state.inspect!==el.dataset.hero){state.inspect=el.dataset.hero;render()}},{once:true})
  el.addEventListener('click',()=>{state.inspect=el.dataset.hero;render()})
 })
 document.querySelectorAll('[data-unit]').forEach(el=>el.addEventListener('click',()=>{state.activeHero=el.dataset.unit;if(state.tutorial===1)state.tutorial=2;render()}))
 document.querySelectorAll('[data-enemy]').forEach(el=>el.addEventListener('click',()=>{if(state.tutorial===4){state.enemyHp[+el.dataset.enemy]-=6;state.tutorial=5;render()}}))
}
function act(action){
 if(action==='start') return navigate('whisper')
 if(action==='advance-whisper') return navigate('select')
 if(action==='close-inspect') state.inspect=null
 if(action==='toggle-hero'&&state.inspect){const i=state.selected.indexOf(state.inspect);i>=0?state.selected.splice(i,1):state.selected.length<4&&state.selected.push(state.inspect)}
 if(action==='confirm-party'&&state.selected.length===4) return navigate('meeting')
 if(action==='meeting-next') return navigate('impact')
 if(action==='to-prelude') return navigate('prelude')
 if(action==='deploy') return navigate('battle')
 if(action==='tutorial-next') state.tutorial++
 if(action==='play-card'&&state.tutorial===2&&state.activeHero){state.cardPlayed=true;state.tutorial=3}
 if(action==='move-hero'&&state.tutorial===3){state.moved=true;state.tutorial=4}
 if(action==='end-turn'&&state.tutorial===5)state.tutorial=6
 if(action==='finish-tutorial'){state.tutorial=7;document.querySelector('.tutorial-callout')?.classList.add('complete')}
 render()
}
render()
