// ═══════════════════════════════════════════════════════════════════
//  ICONS — inline SVG (replaces lucide-react, no build deps)
// ═══════════════════════════════════════════════════════════════════
function mkIcon(paths){
  return function Icon({size=16,color='currentColor',style={},...rest}){
    return React.createElement('svg',{
      xmlns:'http://www.w3.org/2000/svg',width:size,height:size,viewBox:'0 0 24 24',
      fill:'none',stroke:color,strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round',
      style:{flexShrink:0,...style},...rest
    }, paths.map((d,i)=>React.createElement(d.t||'path',{key:i,...d})))
  }
}
const Sword = mkIcon([
  {t:'polyline',points:'14.5 17.5 3 6 3 3 6 3 17.5 14.5'},
  {t:'line',x1:13,y1:19,x2:19,y2:13},
  {t:'line',x1:16,y1:16,x2:20,y2:20},
  {t:'line',x1:19,y1:21,x2:21,y2:19},
])
const BookOpen = mkIcon([
  {d:'M12 7v14'},
  {d:'M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z'},
])
const Settings = mkIcon([
  {t:'circle',cx:12,cy:12,r:3},
  {d:'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z'},
])
const ChevronRight = mkIcon([{d:'m9 18 6-6-6-6'}])
const RotateCcw = mkIcon([
  {d:'M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8'},
  {d:'M3 3v5h5'},
])
const Play = mkIcon([{t:'polygon',points:'6 3 20 12 6 21 6 3'}])
const User = mkIcon([
  {d:'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'},
  {t:'circle',cx:12,cy:7,r:4},
])
const Star = mkIcon([{t:'polygon',points:'12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'}])
const ArrowLeft = mkIcon([{d:'m12 19-7-7 7-7'},{d:'M19 12H5'}])
const Skull = mkIcon([
  {t:'circle',cx:9,cy:12,r:1},
  {t:'circle',cx:15,cy:12,r:1},
  {d:'M8 20v2h8v-2'},
  {d:'m12.5 17-.5-1-.5 1h1z'},
  {d:'M16 20a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20'},
])
const Crosshair = mkIcon([
  {t:'circle',cx:12,cy:12,r:10},
  {t:'line',x1:22,y1:12,x2:18,y2:12},
  {t:'line',x1:6,y1:12,x2:2,y2:12},
  {t:'line',x1:12,y1:6,x2:12,y2:2},
  {t:'line',x1:12,y1:22,x2:12,y2:18},
])
const Move = mkIcon([
  {d:'M12 2v20'},{d:'m15 19-3 3-3-3'},{d:'m19 9 3 3-3 3'},
  {d:'M2 12h20'},{d:'m5 9-3 3 3 3'},{d:'m9 5 3-3 3 3'},
])
const SkipForward = mkIcon([
  {t:'polygon',points:'5 4 15 12 5 20 5 4'},
  {t:'line',x1:19,y1:5,x2:19,y2:19},
])
const Database = mkIcon([
  {t:'ellipse',cx:12,cy:5,rx:9,ry:3},
  {d:'M3 5V19A9 3 0 0 0 21 19V5'},
  {d:'M3 12A9 3 0 0 0 21 12'},
])
const FastForward = mkIcon([
  {t:'polygon',points:'13 19 22 12 13 5 13 19'},
  {t:'polygon',points:'2 19 11 12 2 5 2 19'},
])
const Info = mkIcon([
  {t:'circle',cx:12,cy:12,r:10},
  {d:'M12 16v-4'},{d:'M12 8h.01'},
])
