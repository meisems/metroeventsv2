// ══════════════════════════════════════════════════════════════════════
//  METRO EVENTS — ADMINISTRATIVE COMMAND CENTER  v2.4
//  React · Inline styles · Design tokens (navy/gold palette)
//  RBAC roles: admin | coordinator | designer | warehouse
//  9 Modules: Dashboard · CRM · Checklist · Crew · Warehouse ·
//             Supplier · Quotation · Automation · Audit
//  NEW v2.0:  Dual-factor auth (Password + Access Code) ·
//             Granular inline editing across CRM / Warehouse /
//             Supplier / Quotation · Access Code Control Board ·
//             Staff profile creation with 2FA validation
//  NEW v2.2:  Crew deletion flow (admin-only, confirmation modal) ·
//  NEW v2.4:  Session persistence fix (lazy localStorage) ·
//             Crew assignment dropdown on checklist tasks ·
//             Coordinator staff-picker in CRM ·
//             Live audit log (admin actions auto-logged)
//             Universal self-service password reset (all roles) ·
//             Module-specific Task Photo Attachments (Checklist +
//             Warehouse) with lightbox preview and FileReader upload
// ══════════════════════════════════════════════════════════════════════

import { supabase, supabaseAdmin } from './supabaseClient'
import { useState, useMemo, useEffect, useRef } from "react";
import {
  Menu, X, LogOut, Home, BarChart2, Users, Package, FileText,
  ClipboardList, Truck, DollarSign, Settings, Shield, Bell,
  AlertCircle, Clock, CheckCircle, TrendingUp, Plus, Edit2,
  Trash2, Search, ArrowRight, Check, Calendar, Phone, Mail,
  Percent, Activity, Briefcase, ChevronRight, Star, Zap, Hash,
  Building, Eye, EyeOff, Lock, RefreshCw, Download, Upload,
  ChevronDown, Filter, Archive, MapPin, Circle, ChevronUp,
  List, Layers, MoreHorizontal, UserCheck, Wrench, Database,
  AlertTriangle, Info, CheckSquare, Square, Minus, XCircle,
  Key, RotateCcw, Save, PenLine, ToggleLeft, ToggleRight,
  ShieldCheck, UserPlus, Camera, ImageIcon, ZoomIn
} from "lucide-react";

/* ══════════════════════════════════════════════════════
   GLOBAL STYLES
══════════════════════════════════════════════════════ */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Mono:wght@400;500&display=swap');

:root {
  --canvas:      #f7f5f0;
  --surface:     #ffffff;
  --overlay:     #f0ede5;
  --navy:        #131825;
  --navy-mid:    #192036;
  --navy-lt:     #212944;
  --navy-faint:  rgba(19,24,37,.04);
  --gold:        #b8924a;
  --gold-lt:     #d4aa6a;
  --gold-pale:   #f5edd6;
  --gold-faint:  rgba(184,146,74,.08);
  --tp:          #131825;
  --ts:          #566070;
  --tm:          #9ba3af;
  --border:      #e2ddd3;
  --border-s:    #c8bfa6;
  --success:     #267048;
  --success-pale:#e8f5ee;
  --danger:      #b83c3c;
  --danger-pale: #fdf0f0;
  --warn:        #b06c14;
  --warn-pale:   #fdf3e5;
  --info:        #2a5ea8;
  --info-pale:   #eef2fc;
  --sh-xs: 0 1px 2px rgba(19,24,37,.04);
  --sh-sm: 0 2px 8px rgba(19,24,37,.07), 0 1px 2px rgba(19,24,37,.03);
  --sh-md: 0 4px 16px rgba(19,24,37,.09), 0 2px 4px rgba(19,24,37,.05);
  --sh-lg: 0 8px 32px rgba(19,24,37,.12), 0 4px 8px rgba(19,24,37,.06);
  --r-xs:4px; --r-sm:6px; --r-md:10px; --r-lg:14px; --r-xl:20px; --r-full:9999px;
  --t-fast:100ms ease; --t-base:190ms ease; --t-slow:340ms ease;
  --sidebar-w: 224px;
  /* Extended tokens */
  --sidebar-text:        #f8f4ed;
  --sidebar-text-dim:    rgba(248,244,237,.35);
  --sidebar-text-mid:    rgba(248,244,237,.5);
  --sidebar-text-faint:  rgba(248,244,237,.2);
  --sidebar-text-ghost:  rgba(248,244,237,.28);
  --sidebar-hover:       rgba(255,255,255,.05);
  --sidebar-active-bg:   rgba(184,146,74,.18);
  --sidebar-active-bdr:  rgba(184,146,74,.28);
  --sidebar-bdr:         rgba(184,146,74,.12);
  --sidebar-sep:         rgba(255,255,255,.05);
  --gold-border:         rgba(184,146,74,.3);
  --gold-border-mid:     rgba(184,146,74,.35);
  --gold-border-faint:   rgba(184,146,74,.2);
  --gold-border-hair:    rgba(184,146,74,.24);
  --danger-border:       rgba(184,60,60,.22);
  --modal-scrim:         rgba(19,24,37,.55);
  --navy-avatar:         #3a4568;
  --checklist-done-hover:#daf0e5;
  --gold-shadow:         0 5px 18px rgba(184,146,74,.38);
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'DM Sans',sans-serif;background:var(--canvas);color:var(--tp);-webkit-font-smoothing:antialiased;overflow-x:hidden}
.disp{font-family:'Cormorant Garamond',serif}
.mono{font-family:'DM Mono',monospace}
button,a,[role=button]{transition:color var(--t-base),background-color var(--t-base),border-color var(--t-base),box-shadow var(--t-base),transform var(--t-base),opacity var(--t-base)}
::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-track{background:var(--canvas)}
::-webkit-scrollbar-thumb{background:var(--border-s);border-radius:99px}
input,textarea,select{font-family:'DM Sans',sans-serif;outline:none;transition:border-color var(--t-base),box-shadow var(--t-base)}
input:focus,textarea:focus,select:focus{border-color:var(--gold)!important;box-shadow:0 0 0 3px rgba(184,146,74,.14)}

@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideIn{from{transform:translateX(-10px);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
.fade-up{animation:fadeUp .48s ease both}
.d1{animation-delay:.05s}.d2{animation-delay:.1s}.d3{animation-delay:.15s}.d4{animation-delay:.2s}.d5{animation-delay:.25s}
.card-h{transition:transform var(--t-base),box-shadow var(--t-base)}
.card-h:hover{transform:translateY(-3px);box-shadow:var(--sh-lg)}
.section-label{font-size:10px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);display:block;margin-bottom:8px}

.dt{width:100%;border-collapse:collapse}
.dt th{font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--ts);padding:9px 13px;text-align:left;border-bottom:1.5px solid var(--border);white-space:nowrap;background:var(--overlay)}
.dt td{padding:11px 13px;font-size:13px;color:var(--tp);border-bottom:1px solid var(--border);vertical-align:middle}
.dt tr:last-child td{border-bottom:none}
.dt tbody tr{transition:background var(--t-fast)}
.dt tbody tr:hover td{background:var(--navy-faint)}

.kan-col{min-width:208px;max-width:220px;flex-shrink:0}
.kan-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-md);padding:13px;margin-bottom:8px;box-shadow:var(--sh-xs);cursor:pointer;transition:transform var(--t-base),box-shadow var(--t-base),border-color var(--t-base)}
.kan-card:hover{transform:translateY(-2px);box-shadow:var(--sh-md);border-color:var(--gold)}

@media(max-width:900px){
  .hide-m{display:none!important}
  .show-m{display:flex!important}
  .admin-main{margin-left:0!important;padding:66px 16px 32px!important}
}
@media(min-width:901px){.show-m{display:none!important}}

/* Auth screen: on mobile hide the left panel via hide-m class */

.ovly{position:fixed;inset:0;background:rgba(0,0,0,.46);z-index:89;animation:fadeIn .2s ease}

.prog-bar{height:6px;background:var(--overlay);border-radius:99px;overflow:hidden}
.prog-fill{height:100%;border-radius:99px;background:linear-gradient(90deg,var(--gold),var(--gold-lt));transition:width .6s ease}

.edit-field{width:100%;padding:6px 10px;background:var(--surface);border:1.5px solid var(--gold);border-radius:var(--r-sm);font-size:13px;font-family:'DM Sans',sans-serif;color:var(--tp);box-shadow:0 0 0 3px rgba(184,146,74,.10)}
.edit-field:focus{border-color:var(--gold-lt);box-shadow:0 0 0 3px rgba(184,146,74,.18)}

/* Focus-visible ring for keyboard nav */
:focus-visible{outline:2px solid var(--gold);outline-offset:2px}
button:focus-visible,a:focus-visible,[role=button]:focus-visible{outline:2px solid var(--gold);outline-offset:2px;border-radius:var(--r-sm)}
input:focus-visible,select:focus-visible,textarea:focus-visible{outline:none}

/* Mobile table improvements */
.tbl-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;width:100%}

/* ── Responsive grid helpers ── */
.g-2{display:grid;grid-template-columns:1fr 1fr}
.g-3{display:grid;grid-template-columns:repeat(3,1fr)}
.g-2-side{display:grid;grid-template-columns:1fr 320px;align-items:start}

@media(max-width:900px){
  .mob-stack{flex-direction:column}
  .hide-m{display:none!important}
  .show-m{display:flex!important}
  .admin-main{margin-left:0!important;padding:66px 12px 32px!important;max-width:100vw!important;width:100%!important;}
}
@media(max-width:640px){
  /* Stack all multi-col grids to single column */
  .g-2,.g-3,.g-2-side{grid-template-columns:1fr!important}
  /* Stat cards: 2-up on small screens, proper basis accounting for 14px gap */
  .stat-card{flex:1 1 calc(50% - 7px)!important;min-width:0!important;padding:14px!important}
  /* Reduce stat value font size on mobile */
  .stat-val{font-size:20px!important}
  /* Touch-friendly tap targets */
  button{min-height:40px}
  /* Prevent iOS auto-zoom on focus (needs ≥16px) */
  input,select,textarea{font-size:16px!important}
  /* Kanban columns slightly narrower */
  .kan-col{min-width:172px;max-width:182px}
  /* Remove left border in split modal panels */
  .mob-no-bdr-l{border-left:none!important;padding-left:0!important;padding-top:14px!important;border-top:1px solid var(--border)!important}
  /* Quotation summary: not sticky on narrow screens, move to top via order */
  .quo-sticky{position:static!important;order:-1}
  /* g-2-side: switch to flex column so order property works */
  .g-2-side{display:flex!important;flex-direction:column!important}
  /* Tighter table cells on small screens */
  .dt td,.dt th{padding:8px 9px;font-size:11.5px}
  /* Modal body padding */
  [role=dialog] > div > div{padding:20px 16px!important}
}
@media(max-width:400px){
  /* Stat cards full-width on very small screens */
  .stat-card{flex:1 1 100%!important}
  .kan-col{min-width:155px;max-width:165px}
}

/* Final modal + scroll fixes */
body{overflow-x:hidden}
[role="dialog"]{overscroll-behavior:contain}
/* Fix for Crew & Tasks modal specifically */
#add-staff-modal .g-2,.g-3{gap:16px!important}

/* ── v2.3 Mobile additions ── */
/* Checklist top-action row: event picker + Add Task button wrap on narrow screens */
.cl-action{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.cl-action select{flex:1 1 140px;min-width:0}
/* Task row: shrink label text before pushing action icons off-screen */
.task-label-wrap{flex:1 1 0;min-width:0;display:flex;align-items:center;gap:14px;cursor:pointer}
/* File-input label styled like GoldBtn — used in TaskPhotoModal */
.photo-label-btn{
  display:inline-flex;align-items:center;gap:6px;
  padding:10px 22px;
  background:linear-gradient(135deg,var(--gold),var(--gold-lt));
  color:var(--surface);font-size:13px;font-weight:500;letter-spacing:.04em;
  border:none;border-radius:var(--r-sm);cursor:pointer;
  box-shadow:var(--sh-xs);transition:transform var(--t-base),box-shadow var(--t-base);
}
.photo-label-btn:hover{transform:translateY(-1px);box-shadow:var(--gold-shadow)}
.photo-label-btn.sm{padding:7px 16px;font-size:12px}
/* Photo drop-zone label overlay — covers zone for native file picker */
.photo-drop-label{
  position:absolute;inset:0;cursor:pointer;z-index:2;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
}
/* Change-photo overlay button (label) inside preview */
.photo-change-label{
  position:absolute;bottom:8px;right:8px;
  padding:5px 10px;
  background:rgba(0,0,0,.55);color:#fff;
  border-radius:var(--r-sm);font-size:11px;font-weight:600;cursor:pointer;
  display:flex;align-items:center;gap:5px;
  backdrop-filter:blur(4px);
  transition:background var(--t-fast);
}
.photo-change-label:hover{background:rgba(0,0,0,.75)}
@media(max-width:640px){
  /* Make modals use near-full width on phones */
  [role=dialog]>div>div{width:calc(100vw - 32px)!important;max-width:100%!important}
  /* Stack section-head action row vertically */
  .cl-action{flex-direction:column;align-items:stretch}
  .cl-action select,.cl-action>button,.cl-action>a{width:100%}
  /* Checklist task-row: wrap action icons below if needed */
  .task-row{flex-wrap:wrap;row-gap:6px}
  /* Section heads: wrap action buttons */
  .sec-head-row{flex-direction:column;gap:8px!important}
  /* Package selector cards: single column on phones */
  .pkg-grid{grid-template-columns:1fr!important}
  /* Override panel cards: single column */
  .rate-override-grid{grid-template-columns:1fr!important}
  /* Discount variables: wrap value row */
  .disc-val-row{flex-wrap:wrap}
}
`;

/* ══════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════
   CROSS-BROWSER SYNC HOOK
   Syncs any piece of state to Supabase app_settings so
   every browser stays up to date via polling + realtime.
   Usage: const [state, setState] = useSyncedState('key', initialValue)
══════════════════════════════════════════════════════ */
const useSyncedState = (supabaseKey, init, pollMs=5000) => {
  // Use the service-role client for all Supabase operations in this hook.
  // The admin user authenticates with hardcoded credentials and never signs
  // into Supabase Auth, so the anon client is unauthenticated.  With RLS
  // enabled the anon client silently fails every write — changes are never
  // persisted and other browsers never receive them.
  // supabaseAdmin (service role) bypasses RLS and always succeeds.
  // Falls back to the anon client if the service key env var is absent (dev).
  const db = supabaseAdmin ?? supabase;

  const [state, setState] = useState(() => {
    try { const s = localStorage.getItem(supabaseKey); return s ? JSON.parse(s) : init; } catch(e) { return init; }
  });
  const lastVal  = useRef('');
  const skipSave = useRef(false);
  const saveTimer= useRef(null);
  // ↓ KEY FIX: block saves until the first Supabase fetch completes.
  // Without this, a browser with empty localStorage initialises state as {}
  // and immediately overwrites Supabase with that empty value before the
  // real data has been fetched — wiping everyone else's data.
  const loaded   = useRef(false);
  // BroadcastChannel for instant same-origin cross-tab delivery.
  // Supabase realtime covers different browsers; this covers the case where
  // the user has two tabs open in the same browser — no network round-trip needed.
  const bc       = useRef(null);

  // Stable fetch fn via ref — avoids stale closure in setInterval
  const fetchFn = useRef(null);
  fetchFn.current = () => {
    db.from('app_settings').select('value').eq('key', supabaseKey).maybeSingle()
      .then(({data}) => {
        loaded.current = true; // allow saves from this point on
        if(data?.value && data.value !== lastVal.current){
          lastVal.current = data.value;
          try { skipSave.current = true; setState(JSON.parse(data.value)); } catch(e) {}
        }
      });
  };

  useEffect(() => {
    fetchFn.current(); // initial load

    // Supabase realtime — covers cross-browser updates
    const ch = db.channel('sync-' + supabaseKey)
      .on('postgres_changes', {event:'*', schema:'public', table:'app_settings'},
        ({new:row}) => {
          if(row?.key === supabaseKey && row.value && row.value !== lastVal.current){
            lastVal.current = row.value;
            try { skipSave.current = true; setState(JSON.parse(row.value)); } catch(e) {}
          }
        })
      .subscribe();

    // BroadcastChannel — instant same-browser cross-tab sync (no Supabase round-trip)
    try {
      bc.current = new BroadcastChannel('metro-sync-' + supabaseKey);
      bc.current.onmessage = (e) => {
        if(e.data && e.data !== lastVal.current){
          lastVal.current = e.data;
          try { skipSave.current = true; setState(JSON.parse(e.data)); } catch(err) {}
        }
      };
    } catch(err) { /* BroadcastChannel not supported — fall back to polling only */ }

    // visibilitychange — immediately re-fetch when the tab regains focus so the
    // user always sees fresh data without waiting for the next poll interval.
    const onVisible = () => { if(document.visibilityState === 'visible') fetchFn.current(); };
    document.addEventListener('visibilitychange', onVisible);

    const poll = setInterval(() => fetchFn.current(), pollMs);
    return () => {
      db.removeChannel(ch);
      clearInterval(poll);
      bc.current?.close(); bc.current = null;
      document.removeEventListener('visibilitychange', onVisible);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabaseKey]);

  useEffect(() => {
    if(!loaded.current) return; // wait for initial fetch before saving
    if(skipSave.current){ skipSave.current = false; return; }
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const serialized = JSON.stringify(state);
      try { localStorage.setItem(supabaseKey, serialized); } catch(e) {}
      lastVal.current = serialized;
      // Notify other tabs in the same browser immediately
      try { bc.current?.postMessage(serialized); } catch(e) {}
      db.from('app_settings')
        .upsert({key: supabaseKey, value: serialized}, {onConflict: 'key'})
        .then(({error}) => {
          if(error) console.error('[sync:'+supabaseKey+'] save failed — check RLS policies and VITE_SUPABASE_SERVICE_KEY:', error.message);
        });
    }, 400);
    return () => clearTimeout(saveTimer.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return [state, setState];
};

const fmt = n => '₱' + Number(n).toLocaleString('en-PH');

const genCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({length:8}, ()=> chars[Math.floor(Math.random()*chars.length)]).join('');
};

/* ══════════════════════════════════════════════════════
   MOCK DATA
══════════════════════════════════════════════════════ */
const EVENTS_INIT = [];

const CRM_STAGES = ['New Inquiry','Ocular Scheduled','Proposal Sent','Reserved','Fully Booked','Done'];

const STAFF_INIT = [
  {
    id:'S-01',name:'Maria Dela Cruz',username:'mdelacruz',password:'Coord@2025',
    role:'coordinator',email:'maria@metroevents.ph',phone:'09171234567',
    callTime:'08:00',active:true,tasks:3,
  },
  {
    id:'S-02',name:'Jose Reyes',username:'jreyes',password:'Design@2025',
    role:'designer',email:'jose@metroevents.ph',phone:'09181234567',
    callTime:'09:00',active:true,tasks:2,
  },
  {
    id:'S-03',name:'Ana Santos',username:'asantos',password:'Ware@2025',
    role:'warehouse',email:'ana@metroevents.ph',phone:'09191234567',
    callTime:'07:00',active:true,tasks:1,
  },
];

const INVENTORY_INIT = [];

const SUPPLIERS_INIT = [];

const CHECKLIST_INIT = {
  'Pre-Production':[
    {id:'PP-001',label:'Confirm event date and venue with client',done:false,photoUrl:null,assignedTo:null},
    {id:'PP-002',label:'Send and collect signed contract',done:false,photoUrl:null,assignedTo:null},
    {id:'PP-003',label:'Receive down payment',done:false,photoUrl:null,assignedTo:null},
    {id:'PP-004',label:'Finalize event theme and color palette',done:false,photoUrl:null,assignedTo:null},
    {id:'PP-005',label:'Assign lead coordinator',done:false,photoUrl:null,assignedTo:null},
  ],
  'Fabrication':[
    {id:'FA-001',label:'Create backdrop design mock-up',done:false,photoUrl:null,assignedTo:null},
    {id:'FA-002',label:'Order fabrication materials',done:false,photoUrl:null,assignedTo:null},
    {id:'FA-003',label:'Build and paint backdrop panels',done:false,photoUrl:null,assignedTo:null},
    {id:'FA-004',label:'Fabricate table centerpieces',done:false,photoUrl:null,assignedTo:null},
  ],
  'Supplier':[
    {id:'SU-001',label:'Book catering supplier',done:false,photoUrl:null,assignedTo:null},
    {id:'SU-002',label:'Confirm florals order',done:false,photoUrl:null,assignedTo:null},
    {id:'SU-003',label:'Coordinate with sound and lights team',done:false,photoUrl:null,assignedTo:null},
    {id:'SU-004',label:'Collect supplier invoices',done:false,photoUrl:null,assignedTo:null},
  ],
  'Load-in':[
    {id:'LI-001',label:'Load all decor items to truck',done:false,photoUrl:null,assignedTo:null},
    {id:'LI-002',label:'Arrive at venue 4 hours before event',done:false,photoUrl:null,assignedTo:null},
    {id:'LI-003',label:'Set up backdrop and stage',done:false,photoUrl:null,assignedTo:null},
    {id:'LI-004',label:'Arrange table centerpieces and linens',done:false,photoUrl:null,assignedTo:null},
    {id:'LI-005',label:'Sound check and lighting test',done:false,photoUrl:null,assignedTo:null},
  ],
  'Load-out':[
    {id:'LO-001',label:'Dismantle backdrop and stage elements',done:false,photoUrl:null,assignedTo:null},
    {id:'LO-002',label:'Pack and inventory all rental items',done:false,photoUrl:null,assignedTo:null},
    {id:'LO-003',label:'Return items to warehouse',done:false,photoUrl:null,assignedTo:null},
    {id:'LO-004',label:'File post-event report',done:false,photoUrl:null,assignedTo:null},
  ],
};

const AUDIT_LOGS = [];

/* ══════════════════════════════════════════════════════
   AUTH CONFIG
══════════════════════════════════════════════════════ */
// Initial access codes — managed by admin via Control Board
const ACCESS_CODES_INIT = {
  coordinator: 'coord123',
  designer:    'design123',
  warehouse:   'ware123',
};

// Admin credentials remain hardcoded; all other roles authenticate
// dynamically against the staff state array (username + password).
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD_DEFAULT = 'Admin@2025';
const ADMIN_CODE = 'admin123';

/* ══════════════════════════════════════════════════════
   RBAC
══════════════════════════════════════════════════════ */
const ACCESS = {
  admin:       ['dashboard','crm','checklist','crew','warehouse','supplier','quotation','audit'],
  coordinator: ['dashboard','crm','checklist','crew','supplier','quotation'],
  designer:    ['dashboard','checklist','crew'],
  warehouse:   ['dashboard','warehouse'],
  client:      ['dashboard'],
};

const ROLE_COLOR = {admin:'gold',coordinator:'blue',designer:'green',warehouse:'grey',client:'grey'};
const ROLE_LABEL = {admin:'Administrator',coordinator:'Coordinator',designer:'Designer',warehouse:'Warehouse',client:'Client'};

/* ══════════════════════════════════════════════════════
   SHARED COMPONENTS
══════════════════════════════════════════════════════ */
const GoldBtn = ({children,onClick,sm,full,type="button",disabled,'aria-label':ariaLabel})=>(
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel}
    aria-disabled={disabled||undefined}
    style={{
      display:'inline-flex',alignItems:'center',gap:6,
      padding:sm?'7px 16px':'10px 22px',
      background:disabled?'var(--border)':'linear-gradient(135deg,var(--gold),var(--gold-lt))',
      color:disabled?'var(--tm)':'var(--surface)',
      fontSize:sm?12:13,fontWeight:500,letterSpacing:'.04em',
      border:'none',borderRadius:'var(--r-sm)',cursor:disabled?'not-allowed':'pointer',
      width:full?'100%':'auto',justifyContent:full?'center':'flex-start',
      boxShadow:'var(--sh-xs)',flexShrink:0,
    }}
    onMouseEnter={e=>{if(!disabled){e.currentTarget.style.transform='translateY(-1px)';e.currentTarget.style.boxShadow='var(--gold-shadow)'}}}
    onMouseLeave={e=>{if(!disabled){e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='var(--sh-xs)'}}}
  >{children}</button>
);

const GhostBtn = ({children,onClick,danger,sm,'aria-label':ariaLabel})=>(
  <button
    onClick={onClick}
    aria-label={ariaLabel}
    style={{
      display:'inline-flex',alignItems:'center',gap:6,
      padding:sm?'6px 14px':'9px 18px',
      background:'transparent',
      color:danger?'var(--danger)':'var(--ts)',
      fontSize:sm?11:13,fontWeight:500,
      border:`1.5px solid ${danger?'var(--danger)':'var(--border-s)'}`,
      borderRadius:'var(--r-sm)',cursor:'pointer',flexShrink:0,
    }}
    onMouseEnter={e=>e.currentTarget.style.background=danger?'var(--danger-pale)':'var(--overlay)'}
    onMouseLeave={e=>e.currentTarget.style.background='transparent'}
  >{children}</button>
);

const Badge = ({label,color='grey',dot,role:badgeRole})=>{
  const map={
    green:['var(--success-pale)','var(--success)'],
    gold:['var(--gold-pale)','var(--gold)'],
    red:['var(--danger-pale)','var(--danger)'],
    blue:['var(--info-pale)','var(--info)'],
    orange:['var(--warn-pale)','var(--warn)'],
    grey:['var(--overlay)','var(--ts)'],
  };
  const [bg,fg]=map[color]||map.grey;
  return(
    <span
      role={badgeRole||'status'}
      aria-label={label}
      style={{display:'inline-flex',alignItems:'center',gap:5,padding:'3px 9px',
        background:bg,border:`1px solid ${fg}33`,borderRadius:'var(--r-full)',
        fontSize:11,fontWeight:600,color:fg,letterSpacing:'.04em',whiteSpace:'nowrap'}}>
      {dot&&<span aria-hidden="true" style={{width:5,height:5,borderRadius:'50%',background:fg,flexShrink:0}}/>}
      {label}
    </span>
  );
};

const Field = ({label,type='text',value,onChange,placeholder,options,rows,hint})=>{
  const base={width:'100%',padding:'9px 12px',background:'var(--surface)',
    border:'1.5px solid var(--border)',borderRadius:'var(--r-sm)',fontSize:13,color:'var(--tp)'};
  return(
    <div style={{marginBottom:14}}>
      <label style={{fontSize:11,fontWeight:600,color:'var(--ts)',letterSpacing:'.05em',display:'block',marginBottom:5,textTransform:'uppercase'}}>{label}</label>
      {options?(
        <select value={value} onChange={e=>onChange(e.target.value)} style={base}>
          {options.map(o=><option key={o.value||o} value={o.value||o}>{o.label||o}</option>)}
        </select>
      ):rows?(
        <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{...base,resize:'vertical',lineHeight:1.6}}/>
      ):(
        <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={base}/>
      )}
      {hint&&<div style={{fontSize:11,color:'var(--tm)',marginTop:4}}>{hint}</div>}
    </div>
  );
};

// footer prop: pass the action buttons here so they render in a sticky bar
// at the bottom of the modal — always visible on mobile even with keyboard open.
const Modal = ({title,onClose,children,wide,extraWide,footer})=>{
  const titleId=`modal-title-${Math.random().toString(36).slice(2,7)}`;
  useEffect(()=>{
    const originalOverflow=document.body.style.overflow;
    document.body.style.overflow='hidden';
    return ()=>{document.body.style.overflow=originalOverflow;};
  },[]);
  return(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
      style={{
        position:'fixed',inset:0,zIndex:9999,
        background:'rgba(0,0,0,0.7)',
        display:'flex',
        alignItems:'flex-start',
        justifyContent:'center',
        paddingTop:'12px',
        paddingLeft:'12px',
        paddingRight:'12px',
        // 64px bottom clears Android 3-button nav bar (48px) + gesture bar (34px)
        // env() fallback also included for devices that do expose it
        paddingBottom:'max(64px, env(safe-area-inset-bottom, 64px))',
      }}
    >
      <div
        onClick={e=>e.stopPropagation()}
        style={{
          background:'var(--surface)',
          border:'1px solid var(--border)',
          borderRadius:'var(--r-xl)',
          width:'100%',
          maxWidth:extraWide?820:wide?640:440,
          // maxHeight accounts for top padding (12px) + bottom clearance (64px) = 76px
          maxHeight:'calc(100dvh - 76px)',
          display:'flex',
          flexDirection:'column',
          boxShadow:'var(--sh-lg)',
          animation:'fadeUp .3s ease both',
        }}
      >
        {/* Header — never scrolls away */}
        <div style={{
          display:'flex',alignItems:'center',justifyContent:'space-between',
          padding:'16px 20px 12px',
          borderBottom:'1px solid var(--border)',
          flexShrink:0,
        }}>
          <h3 id={titleId} style={{fontSize:16,fontWeight:600,color:'var(--tp)'}}>{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            style={{background:'none',border:'none',cursor:'pointer',color:'var(--tm)',display:'flex',borderRadius:'var(--r-sm)',padding:4}}
          ><X size={18} aria-hidden="true"/></button>
        </div>

        {/* Scrollable body */}
        <div style={{
          overflowY:'auto',
          WebkitOverflowScrolling:'touch', // smooth momentum scroll on iOS
          flex:1,
          padding:'16px 20px',
        }}>
          {children}
        </div>

        {/* Sticky footer — buttons always visible above the keyboard */}
        {footer&&(
          <div style={{
            flexShrink:0,
            padding:'12px 20px',
            paddingBottom:'max(12px, env(safe-area-inset-bottom, 12px))',
            borderTop:'1px solid var(--border)',
            background:'var(--surface)',
            display:'flex',gap:10,justifyContent:'flex-end',
            borderBottomLeftRadius:'var(--r-xl)',
            borderBottomRightRadius:'var(--r-xl)',
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   v2.2 — PHOTO LIGHTBOX
   Full-screen overlay for viewing attached task/item
   reference photos. Renders above all other UI layers.
══════════════════════════════════════════════════════ */
const PhotoLightbox = ({src, caption, onClose})=>{
  useEffect(()=>{
    const handler=e=>{if(e.key==='Escape')onClose();};
    window.addEventListener('keydown',handler);
    return()=>window.removeEventListener('keydown',handler);
  },[onClose]);
  return(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photo preview"
      onClick={onClose}
      style={{
        position:'fixed',inset:0,zIndex:10010,
        background:'rgba(10,13,22,.92)',
        display:'flex',flexDirection:'column',
        alignItems:'center',justifyContent:'center',
        padding:20,
        animation:'fadeIn .18s ease',
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close photo preview"
        style={{
          position:'fixed',top:18,right:22,
          width:36,height:36,
          background:'rgba(255,255,255,.1)',
          border:'1px solid rgba(255,255,255,.18)',
          borderRadius:'50%',
          display:'flex',alignItems:'center',justifyContent:'center',
          cursor:'pointer',color:'#fff',zIndex:1,
        }}
        onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,.2)';}}
        onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,.1)';}}
      ><X size={16}/></button>

      {/* Image container */}
      <div onClick={e=>e.stopPropagation()} style={{maxWidth:'90vw',maxHeight:'82vh',display:'flex',flexDirection:'column',alignItems:'center',gap:12}}>
        <img
          src={src}
          alt={caption||'Attached reference photo'}
          style={{
            maxWidth:'100%',maxHeight:'78vh',
            borderRadius:'var(--r-md)',
            boxShadow:'0 20px 60px rgba(0,0,0,.6)',
            objectFit:'contain',
            display:'block',
          }}
        />
        {caption&&(
          <div style={{
            fontSize:12,color:'rgba(255,255,255,.55)',
            background:'rgba(255,255,255,.05)',
            border:'1px solid rgba(255,255,255,.08)',
            borderRadius:'var(--r-full)',
            padding:'4px 14px',
            maxWidth:420,
            textAlign:'center',
            overflow:'hidden',
            textOverflow:'ellipsis',
            whiteSpace:'nowrap',
          }}>{caption}</div>
        )}
      </div>
      <div style={{position:'fixed',bottom:18,fontSize:11,color:'rgba(255,255,255,.25)'}}>
        Press <kbd style={{background:'rgba(255,255,255,.08)',padding:'1px 6px',borderRadius:3,fontFamily:"'DM Mono',monospace"}}>Esc</kbd> or click outside to close
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   v2.2 — TASK PHOTO MODAL
   Reusable photo-attach dialog for ChecklistView tasks
   and WarehouseView inventory items. Uses the browser's
   native FileReader API to produce a base64 dataURL
   preview — no external upload dependency required.
══════════════════════════════════════════════════════ */
const TaskPhotoModal = ({itemLabel, existingPhotoUrl, onAttach, onClose})=>{
  const [preview,setPreview]=useState(existingPhotoUrl||null);
  const [dragging,setDragging]=useState(false);
  // Stable unique ID so <label htmlFor> binding works — avoids programmatic .click()
  // which is blocked in sandboxed iframes (Claude artifacts, etc.)
  const inputId=useRef('tpm-file-'+Math.random().toString(36).slice(2));

  const readFile=(file)=>{
    if(!file||!file.type.startsWith('image/')) return;
    const reader=new FileReader();
    reader.onload=ev=>setPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleFileInput=e=>{readFile(e.target.files[0]);e.target.value='';};
  const handleDrop=e=>{
    e.preventDefault();setDragging(false);
    readFile(e.dataTransfer.files[0]);
  };
  const handleDragOver=e=>{e.preventDefault();setDragging(true);};
  const handleDragLeave=()=>setDragging(false);

  return(
    <Modal title={`Attach Reference Photo`} onClose={onClose}>
      {/* Item context banner */}
      <div style={{display:'flex',alignItems:'center',gap:9,padding:'9px 12px',background:'var(--navy)',borderRadius:'var(--r-md)',marginBottom:16}}>
        <Camera size={14} color='var(--gold)' aria-hidden="true"/>
        <div>
          <div style={{fontSize:11,color:'var(--sidebar-text-dim)',marginBottom:1}}>Attaching photo to task / item</div>
          <div style={{fontSize:12,fontWeight:600,color:'var(--sidebar-text)',maxWidth:340,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{itemLabel}</div>
        </div>
      </div>

      {/* Drop / click zone
          — The hidden input is bound to labels via htmlFor so clicks are native,
            no JS .click() needed (which sandboxed iframes block). */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{
          border:`2px dashed ${dragging?'var(--gold)':preview?'var(--border)':'var(--border-s)'}`,
          borderRadius:'var(--r-lg)',
          padding:preview?'10px':'36px 20px',
          textAlign:'center',
          background:dragging?'var(--gold-faint)':'var(--overlay)',
          transition:'border-color var(--t-base),background var(--t-base)',
          marginBottom:14,
          position:'relative',
          overflow:'hidden',
        }}
      >
        {/* Always-rendered hidden input — associated by id, never triggered via JS */}
        <input
          id={inputId.current}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileInput}
          style={{display:'none'}}
          aria-label="Select image file"
        />

        {/* When no preview: transparent label overlay covers the whole zone */}
        {!preview&&(
          <label
            htmlFor={inputId.current}
            className="photo-drop-label"
            aria-label="Click to select a photo"
            onMouseEnter={e=>{e.currentTarget.parentElement.style.borderColor='var(--gold)';e.currentTarget.parentElement.style.background='var(--gold-faint)';}}
            onMouseLeave={e=>{e.currentTarget.parentElement.style.borderColor='var(--border-s)';e.currentTarget.parentElement.style.background='var(--overlay)';}}
          >
            <div style={{width:48,height:48,background:'var(--gold-pale)',border:`1px solid var(--gold-border)`,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px'}}>
              <Camera size={22} color='var(--gold)'/>
            </div>
            <div style={{fontSize:13,fontWeight:500,color:'var(--tp)',marginBottom:4}}>Click to select or drag & drop a photo</div>
            <div style={{fontSize:11,color:'var(--tm)'}}>JPG · PNG · WEBP · GIF · Max 10 MB</div>
          </label>
        )}

        {preview&&(
          <div style={{position:'relative',display:'inline-block'}}>
            <img
              src={preview}
              alt="Preview"
              style={{maxHeight:200,maxWidth:'100%',borderRadius:'var(--r-md)',objectFit:'contain',display:'block'}}
            />
            {/* Native label triggers the input — no JS .click() */}
            <label
              htmlFor={inputId.current}
              className="photo-change-label"
              aria-label="Change photo"
            ><Camera size={11}/>Change</label>
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{display:'flex',gap:9,justifyContent:'flex-end',alignItems:'center',flexWrap:'wrap'}}>
        {preview&&(
          <button
            onClick={()=>setPreview(null)}
            style={{padding:'7px 13px',background:'transparent',color:'var(--danger)',border:'1.5px solid var(--danger)',borderRadius:'var(--r-sm)',fontSize:12,fontWeight:500,cursor:'pointer',display:'flex',alignItems:'center',gap:5}}
            onMouseEnter={e=>e.currentTarget.style.background='var(--danger-pale)'}
            onMouseLeave={e=>e.currentTarget.style.background='transparent'}
          ><Trash2 size={11}/>Remove</button>
        )}
        <GhostBtn onClick={onClose}>Cancel</GhostBtn>
        {preview&&(
          <GoldBtn onClick={()=>onAttach(preview)}>
            <Check size={13}/>Attach Photo
          </GoldBtn>
        )}
        {/* Label-as-button: native file picker — no .click() needed */}
        {!preview&&(
          <label htmlFor={inputId.current} className="photo-label-btn" aria-label="Select a photo to attach">
            <Camera size={13}/>Select Photo
          </label>
        )}
      </div>
    </Modal>
  );
};

const StatCard = ({label,value,sub,icon:Ic,color='gold',trend})=>{
  const clr=color==='gold'?'var(--gold)':color==='green'?'var(--success)':color==='red'?'var(--danger)':'var(--info)';
  const bg=color==='gold'?'var(--gold-pale)':color==='green'?'var(--success-pale)':color==='red'?'var(--danger-pale)':'var(--info-pale)';
  return(
    <div className="card-h stat-card" style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:'18px 20px',boxShadow:'var(--sh-sm)',flex:'1 1 160px',minWidth:148}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
        <div style={{width:34,height:34,background:bg,borderRadius:'var(--r-md)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
          <Ic size={15} color={clr}/>
        </div>
        {trend!=null&&<span style={{fontSize:11,fontWeight:600,color:trend>=0?'var(--success)':'var(--danger)'}}>{trend>=0?'+':''}{trend}%</span>}
      </div>
      <div className="stat-val" style={{fontSize:24,fontWeight:600,color:'var(--tp)',lineHeight:1,marginBottom:3}}>{value}</div>
      <div style={{fontSize:11,color:'var(--ts)',fontWeight:500,lineHeight:1.3}}>{label}</div>
      {sub&&<div style={{fontSize:10,color:'var(--tm)',marginTop:2,lineHeight:1.3}}>{sub}</div>}
    </div>
  );
};

const RoleBlock = ({module,role})=>(
  <div role="alert" style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:400,textAlign:'center',padding:40}}>
    <div style={{width:64,height:64,background:'var(--danger-pale)',border:`1.5px solid var(--danger-border)`,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:18}}>
      <Lock size={26} color='var(--danger)' aria-hidden="true"/>
    </div>
    <h3 style={{fontSize:18,fontWeight:600,color:'var(--tp)',marginBottom:8}}>Access Restricted</h3>
    <p style={{fontSize:14,color:'var(--ts)',maxWidth:380,lineHeight:1.7,marginBottom:6}}>
      The <strong>{module}</strong> module requires elevated permissions not assigned to the <strong style={{color:'var(--danger)'}}>{ROLE_LABEL[role]}</strong> role.
    </p>
    <p style={{fontSize:12,color:'var(--tm)'}}>Contact your system administrator to request access. All attempts are logged.</p>
    <div aria-live="assertive" style={{marginTop:20,padding:'8px 16px',background:'var(--danger-pale)',border:`1px solid var(--danger-border)`,borderRadius:'var(--r-sm)',fontSize:11,color:'var(--danger)',fontWeight:600,letterSpacing:'.06em',display:'flex',alignItems:'center',gap:6}}>
      <AlertTriangle size={12} aria-hidden="true"/>THIS ATTEMPT HAS BEEN LOGGED
    </div>
  </div>
);

const SectionHead = ({title,sub,action})=>(
  <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:24,flexWrap:'wrap',gap:12}}>
    <div>
      <h2 style={{fontSize:20,fontWeight:600,color:'var(--tp)',lineHeight:1.2}}>{title}</h2>
      {sub&&<p style={{fontSize:13,color:'var(--ts)',marginTop:4}}>{sub}</p>}
    </div>
    {action}
  </div>
);

/* ══════════════════════════════════════════════════════
   MODULE 1 — DASHBOARD
══════════════════════════════════════════════════════ */
const DashboardView = ({events,role,staff=[]})=>{
  const active = events.filter(e=>!['Done','New Inquiry'].includes(e.stage));
  const pipeline = events.reduce((s,e)=>s+e.value,0);
  const outstanding = events.reduce((s,e)=>s+e.balance,0);

  // Real month-over-month trend: compare this calendar month vs last month
  // using each event's date field.  Returns null if there's no prior-month
  // data (avoids showing a meaningless +∞% on a fresh install).
  const now = new Date();
  const tm = now.getMonth(), ty = now.getFullYear();
  const lm = tm === 0 ? 11 : tm - 1;
  const ly = tm === 0 ? ty - 1 : ty;
  const inMonth = (e, mo, yr) => { const d = new Date(e.date); return d.getMonth()===mo && d.getFullYear()===yr; };
  const thisMonthEvs  = events.filter(e=>inMonth(e,tm,ty));
  const lastMonthEvs  = events.filter(e=>inMonth(e,lm,ly));
  const thisPipeline  = thisMonthEvs.reduce((s,e)=>s+e.value,0);
  const lastPipeline  = lastMonthEvs.reduce((s,e)=>s+e.value,0);
  const activeStages  = ['Reserved','Fully Booked','In Progress','Ocular Scheduled'];
  const thisActive    = thisMonthEvs.filter(e=>activeStages.includes(e.stage)).length;
  const lastActive    = lastMonthEvs.filter(e=>activeStages.includes(e.stage)).length;
  const pctChange     = (cur,prev) => prev===0 ? null : Math.round(((cur-prev)/prev)*100);
  const pipelineTrend = pctChange(thisPipeline, lastPipeline);
  const activeTrend   = pctChange(thisActive,   lastActive);

  return(
    <div className="fade-up">
      {role==='client'&&(
        <div style={{maxWidth:560,margin:'40px auto',textAlign:'center'}}>
          <div style={{width:64,height:64,background:'var(--gold-pale)',border:'1.5px solid var(--gold-border)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px'}}>
            <Star size={26} color='var(--gold)'/>
          </div>
          <h2 className="disp" style={{fontSize:28,fontWeight:700,color:'var(--tp)',marginBottom:10,letterSpacing:'-.02em'}}>Welcome to your Client Portal</h2>
          <p style={{fontSize:14,color:'var(--ts)',lineHeight:1.75,maxWidth:420,margin:'0 auto'}}>
            Your coordinator manages your event details here. For proposals, timelines, and updates, please reach out to your assigned Metro Events coordinator directly.
          </p>
          <div style={{marginTop:28,padding:'16px 20px',background:'var(--gold-faint)',border:'1px solid var(--gold-border-faint)',borderRadius:'var(--r-lg)',fontSize:13,color:'var(--ts)',textAlign:'left'}}>
            <div style={{fontSize:10,fontWeight:700,color:'var(--gold)',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:8}}>Quick Info</div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              <div style={{display:'flex',gap:8,alignItems:'center'}}><Check size={13} color='var(--success)'/><span>Your event data is securely stored</span></div>
              <div style={{display:'flex',gap:8,alignItems:'center'}}><Check size={13} color='var(--success)'/><span>24-hour coordinator response guarantee</span></div>
              <div style={{display:'flex',gap:8,alignItems:'center'}}><Check size={13} color='var(--success)'/><span>Real-time updates as your event progresses</span></div>
            </div>
          </div>
        </div>
      )}
      {role!=='client'&&<SectionHead title="Command Dashboard" sub={`Good morning. ${active.length} events are actively in progress.`}/>}
      {role!=='client'&&<div style={{display:'flex',gap:14,flexWrap:'wrap',marginBottom:28}}>
        <StatCard label="Revenue Pipeline" value={fmt(pipeline)} sub="All active events" icon={TrendingUp} color="gold" trend={pipelineTrend}/>
        <StatCard label="Active Events" value={active.length} sub="Reserved or above" icon={Calendar} color="blue" trend={activeTrend}/>
        <StatCard label="Outstanding" value={fmt(outstanding)} sub="Unpaid client balances" icon={DollarSign} color="red"/>
        <StatCard label="Staff On Duty" value={staff.filter(s=>s.active).length} sub="Active staff members" icon={Users} color="green"/>
      </div>
      {role!=='client'&&<div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',boxShadow:'var(--sh-sm)',overflow:'hidden'}}>
        <div style={{padding:'16px 20px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <span style={{fontSize:13,fontWeight:600,color:'var(--tp)'}}>Recent Events</span>
          <Badge label={`${events.length} total`} color="grey" role="none"/>
        </div>
        <div className="tbl-wrap">
          <table className="dt" aria-label="Recent events summary">
            <thead><tr><th scope="col">ID</th><th scope="col">Client</th><th scope="col">Event</th><th scope="col">Date</th><th scope="col">Stage</th><th scope="col">Value</th><th scope="col">Balance</th></tr></thead>
            <tbody>
              {events.slice(0,6).map(e=>(
                <tr key={e.id}>
                  <td><span className="mono" style={{fontSize:11,color:'var(--tm)'}}>{e.id}</span></td>
                  <td style={{fontWeight:500}}>{e.client}</td>
                  <td style={{color:'var(--ts)'}}>{e.event}</td>
                  <td><span className="mono" style={{fontSize:12}}>{e.date}</span></td>
                  <td><Badge label={e.stage} color={e.stage==='Fully Booked'?'green':e.stage==='Done'?'grey':e.stage==='Reserved'?'blue':e.stage==='New Inquiry'?'orange':'gold'} role="none"/></td>
                  <td><span className="mono" style={{fontSize:12,fontWeight:500}}>{fmt(e.value)}</span></td>
                  <td><span className="mono" style={{fontSize:12,color:e.balance>0?'var(--danger)':'var(--success)',fontWeight:600}}>{fmt(e.balance)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>}
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   MODULE 2 — CRM PIPELINE (KANBAN + INLINE EDIT)
══════════════════════════════════════════════════════ */
const CRMView = ({events,setEvents,role,staff=[],addLog})=>{
  if(!ACCESS[role].includes('crm')) return <RoleBlock module="CRM Pipeline" role={role}/>;
  const [sel,setSel]=useState(null);
  const [editMode,setEditMode]=useState(false);
  const [editForm,setEditForm]=useState({});
  const [showAdd,setShowAdd]=useState(false);
  const [addForm,setAddForm]=useState({});
  const [delConfirm,setDelConfirm]=useState(null);
  const canEdit = role==='admin'||role==='coordinator';
  const canAdmin = role==='admin';
  const blankEvent={client:'',event:'',date:'',venue:'',pkg:'Classic Prestige',coord:'',value:0,balance:0,stage:'New Inquiry'};

  const advance = (ev)=>{
    const idx=CRM_STAGES.indexOf(ev.stage);
    if(idx<CRM_STAGES.length-1){
      const nextStage=CRM_STAGES[idx+1];
      setEvents(prev=>prev.map(e=>e.id===ev.id?{...e,stage:nextStage}:e));  // optimistic
      (supabaseAdmin??supabase).from('events').update({stage:nextStage}).eq('id',ev.id)
        .then(({error})=>{if(error)console.error('[events] advance failed:',error.message);});
      addLog&&addLog(`Advanced event ${ev.id} to ${nextStage}`,ev.client,'info');
    }
  };

  const openModal = (ev)=>{ setSel(ev); setEditMode(false); setEditForm({...ev}); };

  const startEdit = ()=>{ setEditForm({...sel}); setEditMode(true); };

  const saveEdit = ()=>{
    const updated={...editForm,id:sel.id};
    setEvents(prev=>prev.map(e=>e.id===sel.id?updated:e));  // optimistic
    // Use admin client: admin user has no Supabase auth session, anon writes blocked by RLS
    (supabaseAdmin??supabase).from('events').update({
      client:updated.client, event_name:updated.event,
      date:updated.date, venue:updated.venue, pkg:updated.pkg,
      coord:updated.coord, value:updated.value,
      balance:updated.balance, stage:updated.stage,
    }).eq('id',sel.id).then(({error})=>{if(error)console.error('[events] update failed:',error.message);});
    addLog&&addLog(`Edited event ${sel.id}`,sel.client,'info');
    setSel(updated);
    setEditMode(false);
  };

  const ef = (k,v)=>setEditForm(p=>({...p,[k]:v}));
  const aef = (k,v)=>setAddForm(p=>({...p,[k]:v}));

  const addEvent = ()=>{
    if(!addForm.client?.trim()) return;
    // Timestamp-based ID avoids duplicate IDs across browsers (unlike events.length+1)
    const newId='E-'+Date.now().toString(36).toUpperCase().slice(-5);
    const newEvent={...blankEvent,...addForm,id:newId};
    setEvents(prev=>[newEvent,...prev]);           // optimistic
    // Use admin client: admin user has no Supabase auth session, anon writes blocked by RLS
    (supabaseAdmin??supabase).from('events').insert({
      id:newId, client:newEvent.client, event_name:newEvent.event,
      date:newEvent.date, venue:newEvent.venue, pkg:newEvent.pkg,
      coord:newEvent.coord, value:newEvent.value,
      balance:newEvent.balance, stage:newEvent.stage,
    }).then(({error})=>{if(error)console.error('[events] insert failed:',error.message);});
    addLog&&addLog(`Created event for ${addForm.client}`,newId,'info');
    setShowAdd(false);
  };

  const deleteEvent = (ev)=>{
    setEvents(prev=>prev.filter(e=>e.id!==ev.id));  // optimistic
    (supabaseAdmin??supabase).from('events').delete().eq('id',ev.id)
      .then(({error})=>{if(error)console.error('[events] delete failed:',error.message);});
    addLog&&addLog(`Deleted event ${ev.id}`,ev.client,'warn');
    setDelConfirm(null);
    if(sel?.id===ev.id) setSel(null);
  };

  const inlineInput = (key,type='text')=>(
    <input type={type} className="edit-field" value={editForm[key]||''} onChange={e=>ef(key,type==='number'?Number(e.target.value):e.target.value)}/>
  );

  return(
    <div className="fade-up">
      <SectionHead title="CRM Pipeline" sub="Kanban pipeline with full metadata editing for authorized staff."
        action={canAdmin&&<GoldBtn onClick={()=>{setAddForm({...blankEvent});setShowAdd(true);}}><Plus size={13}/>Add Event</GoldBtn>}
      />
      {events.length === 0 && (
        <div style={{
          marginTop:40,
          padding:'80px 40px',
          textAlign:'center',
          background:'var(--surface)',
          border:'2px dashed var(--border)',
          borderRadius:'var(--r-lg)',
          color:'var(--tm)',
        }}>
          <div style={{fontSize:'64px',marginBottom:16,opacity:0.25}}>📪</div>
          <h3 style={{fontSize:22,marginBottom:8}}>No Events in Pipeline</h3>
          <p style={{maxWidth:420,margin:'0 auto 24px'}}>
            Start by adding your first client event
          </p>
          {canAdmin&&<GoldBtn onClick={()=>{setAddForm({...blankEvent});setShowAdd(true);}}>
            <Plus size={14}/> Create First Event
          </GoldBtn>}
        </div>
      )}
      <div style={{display:'flex',gap:12,overflowX:'auto',paddingBottom:16,minWidth:'100%',alignItems:'flex-start',maxHeight:'calc(100vh - 220px)',overflowY:'hidden'}}>
        {CRM_STAGES.map(stage=>{
          const cols=events.filter(e=>e.stage===stage);
          return(
            <div key={stage} className="kan-col">
              <div style={{marginBottom:10,padding:'8px 12px',background:stage==='New Inquiry'?'var(--warn-pale)':stage==='Done'?'var(--overlay)':'var(--navy-faint)',border:'1px solid var(--border)',borderRadius:'var(--r-md)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <span style={{fontSize:11,fontWeight:600,color:'var(--ts)',letterSpacing:'.06em',textTransform:'uppercase'}}>{stage}</span>
                <span style={{fontSize:11,fontWeight:700,color:'var(--gold)',background:'var(--gold-pale)',border:`1px solid var(--gold-border-hair)`,borderRadius:'var(--r-full)',padding:'1px 7px'}}>{cols.length}</span>
              </div>
              {cols.map(ev=>(
                <div key={ev.id} className="kan-card" onClick={()=>openModal(ev)}>
                  <div style={{fontSize:10,color:'var(--tm)',fontFamily:"'DM Mono',monospace",marginBottom:6}}>{ev.id}</div>
                  <div style={{fontSize:13,fontWeight:600,color:'var(--tp)',marginBottom:2,lineHeight:1.3}}>{ev.client}</div>
                  <div style={{fontSize:12,color:'var(--ts)',marginBottom:8}}>{ev.event}</div>
                  <div style={{display:'flex',gap:6,alignItems:'center',marginBottom:8}}>
                    <Calendar size={11} color='var(--tm)'/>
                    <span style={{fontSize:11,color:'var(--ts)'}}>{ev.date}</span>
                  </div>
                  <div style={{fontSize:12,fontWeight:600,color:'var(--gold)',marginBottom:10,fontFamily:"'DM Mono',monospace"}}>{fmt(ev.value)}</div>
                  {stage!=='Done'&&(
                    <button
                      onClick={e=>{e.stopPropagation();advance(ev);}}
                      aria-label={`Advance ${ev.client} to next stage`}
                      style={{width:'100%',padding:'5px',background:'var(--navy)',color:'var(--sidebar-text-mid)',border:'none',borderRadius:'var(--r-sm)',fontSize:11,fontWeight:500,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:5,letterSpacing:'.04em'}}
                      onMouseEnter={e=>e.currentTarget.style.background='var(--navy-lt)'}
                      onMouseLeave={e=>e.currentTarget.style.background='var(--navy)'}>
                      Advance <ChevronRight size={11} aria-hidden="true"/>
                    </button>
                  )}
                  {canAdmin&&(
                    <button
                      onClick={e=>{e.stopPropagation();setDelConfirm(ev);}}
                      aria-label={`Delete ${ev.client}`}
                      style={{width:'100%',marginTop:6,padding:'5px',background:'transparent',color:'var(--danger)',border:'1px solid var(--danger)',borderRadius:'var(--r-sm)',fontSize:11,fontWeight:500,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:5}}
                      onMouseEnter={e=>{e.currentTarget.style.background='var(--danger-pale)'}}
                      onMouseLeave={e=>{e.currentTarget.style.background='transparent'}}>
                      <Trash2 size={11} aria-hidden="true"/>Delete
                    </button>
                  )}
                </div>
              ))}
              {cols.length===0&&<div style={{padding:'20px 12px',textAlign:'center',color:'var(--tm)',fontSize:12,border:'1px dashed var(--border)',borderRadius:'var(--r-md)'}}>No events</div>}
            </div>
          );
        })}
      </div>

      {sel&&(
        <Modal title={`${sel.id} — ${sel.client}`} onClose={()=>setSel(null)} wide>
          {/* Edit mode toggle banner */}
          {canEdit&&(
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'9px 14px',background:editMode?'var(--gold-pale)':'var(--overlay)',border:`1px solid ${editMode?'var(--gold-border-mid)':'var(--border)'}`,borderRadius:'var(--r-md)',marginBottom:18}}>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                {editMode?<PenLine size={13} color='var(--gold)'/>:<Eye size={13} color='var(--ts)'/>}
                <span style={{fontSize:12,fontWeight:600,color:editMode?'var(--gold)':'var(--ts)'}}>{editMode?'Edit Mode — changes pending':'View Mode'}</span>
              </div>
              <div style={{display:'flex',gap:8}}>
                {editMode?(
                  <>
                    <GoldBtn sm onClick={saveEdit}><Save size={12}/>Save Changes</GoldBtn>
                    <GhostBtn sm onClick={()=>setEditMode(false)}>Cancel</GhostBtn>
                  </>
                ):(
                  <GhostBtn sm onClick={startEdit}><Edit2 size={12}/>Edit Details</GhostBtn>
                )}
              </div>
            </div>
          )}

          <div className="g-2" style={{gap:12}}>
            {[
              {label:'Client Name',key:'client'},
              {label:'Event Type',key:'event'},
              {label:'Date',key:'date',type:'date'},
              {label:'Venue',key:'venue'},
              {label:'Package',key:'pkg'},
              {label:'Coordinator',key:'coord'},
            ].map(({label,key,type='text'})=>(
              <div key={key} style={{padding:'10px 12px',background:'var(--overlay)',borderRadius:'var(--r-md)'}}>
                <div style={{fontSize:10,fontWeight:600,color:'var(--ts)',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:5}}>{label}</div>
                {editMode?(
                  key==='coord'?(
                    <select className="edit-field" value={editForm[key]||''} onChange={e=>ef(key,e.target.value)} style={{marginTop:2}}>
                      <option value=''>— Unassigned —</option>
                      {canAdmin&&<option value="Administrator">Administrator</option>}
                      {staff.filter(s=>s.active&&(s.role==='coordinator'||s.role==='admin')).map(s=>(<option key={s.id} value={s.name}>{s.name}</option>))}
                    </select>
                  ):(
                    <input type={type} className="edit-field" value={editForm[key]||''} onChange={e=>ef(key,e.target.value)} style={{marginTop:2}}/>
                  )
                ):(
                  <div style={{fontSize:13,fontWeight:500,color:'var(--tp)'}}>{sel[key]||'—'}</div>
                )}
              </div>
            ))}
          </div>

          {/* Financial pipeline fields */}
          <div style={{marginTop:12,padding:'14px 16px',background:'var(--navy-faint)',border:'1px solid var(--border)',borderRadius:'var(--r-md)'}}>
            <div style={{fontSize:10,fontWeight:600,color:'var(--gold)',letterSpacing:'.14em',textTransform:'uppercase',marginBottom:12}}>Financial Pipeline</div>
            <div className="g-3" style={{gap:12}}>
              {[
                {label:'Total Value',key:'value',type:'number'},
                {label:'Balance Due',key:'balance',type:'number'},
                {label:'Pipeline Stage',key:'stage',isStage:true},
              ].map(({label,key,type,isStage})=>(
                <div key={key}>
                  <div style={{fontSize:10,fontWeight:600,color:'var(--ts)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:5}}>{label}</div>
                  {editMode&&!isStage?(
                    <input type={type} className="edit-field" value={editForm[key]||''} onChange={e=>ef(key,type==='number'?Number(e.target.value):e.target.value)}/>
                  ):editMode&&isStage?(
                    <select className="edit-field" value={editForm[key]||''} onChange={e=>ef(key,e.target.value)}>
                      {CRM_STAGES.map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                  ):(
                    <div style={{fontSize:14,fontWeight:700,color:key==='balance'&&sel[key]>0?'var(--danger)':key==='value'?'var(--gold)':'var(--tp)',fontFamily:"'DM Mono',monospace"}}>
                      {isStage?<Badge label={sel[key]} color='blue'/>:fmt(sel[key])}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{marginTop:16,display:'flex',gap:10,justifyContent:'flex-end'}}>
            {!editMode&&sel.stage!=='Done'&&<GoldBtn onClick={()=>{advance(sel);setSel(null);}}>Advance Stage <ChevronRight size={12}/></GoldBtn>}
            {canAdmin&&!editMode&&<GhostBtn danger onClick={()=>{setSel(null);setDelConfirm(sel);}}>
              <Trash2 size={12}/>Delete Event
            </GhostBtn>}
            <GhostBtn onClick={()=>setSel(null)}>Close</GhostBtn>
          </div>
        </Modal>
      )}

      {/* Add Event Modal */}
      {showAdd&&(
        <Modal title="Add New Event" onClose={()=>setShowAdd(false)} extraWide
          footer={<>
            <GhostBtn onClick={()=>setShowAdd(false)}>Cancel</GhostBtn>
            <GoldBtn onClick={addEvent} disabled={!addForm.client?.trim()}><Plus size={13}/>Create Event</GoldBtn>
          </>}
        >
          <div className="g-2" style={{gap:12,marginBottom:14}}>
            {[
              {label:'Client Name',key:'client',placeholder:'e.g. Santos Family'},
              {label:'Event Type',key:'event',placeholder:'e.g. 18th Birthday Debut'},
              {label:'Venue',key:'venue',placeholder:'e.g. Grand Ballroom, Makati'},
              {label:'Coordinator',key:'coord',placeholder:'e.g. Ana Cruz'},
            ].map(({label,key,placeholder})=>(
              <div key={key} style={{marginBottom:0}}>
                <label style={{fontSize:11,fontWeight:600,color:'var(--ts)',letterSpacing:'.05em',display:'block',marginBottom:5,textTransform:'uppercase'}}>{label}</label>
                {key==='coord'?(
                  <select className="edit-field" value={addForm[key]||''} onChange={e=>aef(key,e.target.value)}>
                    <option value=''>— Select Coordinator —</option>
                    {canAdmin&&<option value="Administrator">Administrator</option>}
                    {staff.filter(s=>s.active&&(s.role==='coordinator'||s.role==='admin')).map(s=>(<option key={s.id} value={s.name}>{s.name}</option>))}
                  </select>
                ):(
                  <input className="edit-field" value={addForm[key]||''} onChange={e=>aef(key,e.target.value)} placeholder={placeholder}/>
                )}
              </div>
            ))}
            <div>
              <label style={{fontSize:11,fontWeight:600,color:'var(--ts)',letterSpacing:'.05em',display:'block',marginBottom:5,textTransform:'uppercase'}}>Event Date</label>
              <input type="date" className="edit-field" value={addForm.date||''} onChange={e=>aef('date',e.target.value)}/>
            </div>
            <div>
              <label style={{fontSize:11,fontWeight:600,color:'var(--ts)',letterSpacing:'.05em',display:'block',marginBottom:5,textTransform:'uppercase'}}>Pipeline Stage</label>
              <select className="edit-field" value={addForm.stage||'New Inquiry'} onChange={e=>aef('stage',e.target.value)}>
                {CRM_STAGES.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="g-2" style={{gap:12,padding:'14px 16px',background:'var(--navy-faint)',border:'1px solid var(--border)',borderRadius:'var(--r-md)',marginBottom:18}}>
            <div>
              <label style={{fontSize:11,fontWeight:600,color:'var(--gold)',letterSpacing:'.05em',display:'block',marginBottom:5,textTransform:'uppercase'}}>Total Value (₱)</label>
              <input type="number" className="edit-field" value={addForm.value||''} onChange={e=>aef('value',Number(e.target.value))} placeholder="0"/>
            </div>
            <div>
              <label style={{fontSize:11,fontWeight:600,color:'var(--danger)',letterSpacing:'.05em',display:'block',marginBottom:5,textTransform:'uppercase'}}>Balance Due (₱)</label>
              <input type="number" className="edit-field" value={addForm.balance||''} onChange={e=>aef('balance',Number(e.target.value))} placeholder="0"/>
            </div>
          </div>
          {!addForm.client?.trim()&&<div style={{fontSize:12,color:'var(--danger)',marginBottom:10,display:'flex',alignItems:'center',gap:5}}><AlertCircle size={12}/>Client name is required.</div>}
        </Modal>
      )}

      {/* Delete Confirm Modal */}
      {delConfirm&&(
        <Modal title="Delete Event?" onClose={()=>setDelConfirm(null)}>
          <div style={{padding:'14px 16px',background:'var(--danger-pale)',border:'1px solid var(--danger-border)',borderRadius:'var(--r-md)',marginBottom:18}}>
            <div style={{fontSize:13,fontWeight:600,color:'var(--danger)',marginBottom:4}}>{delConfirm.client} — {delConfirm.id}</div>
            <div style={{fontSize:12,color:'var(--ts)'}}>This will permanently remove the event record. This action cannot be undone.</div>
          </div>
          <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
            <GhostBtn onClick={()=>setDelConfirm(null)}>Cancel</GhostBtn>
            <GhostBtn danger onClick={()=>deleteEvent(delConfirm)}><Trash2 size={13}/>Delete Permanently</GhostBtn>
          </div>
        </Modal>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   MODULE 3 — MASTER CHECKLIST
══════════════════════════════════════════════════════ */
const ChecklistView = ({role, events=[], staff=[], addLog})=>{
  if(!ACCESS[role].includes('checklist')) return <RoleBlock module="Master Checklist" role={role}/>;
  // Per-event checklist store: { [eventId]: { [category]: [...tasks] } }
  const [allItems,setAllItems]=useSyncedState('checklist_data',{});

  const [cat,setCat]=useState('Pre-Production');
  const [selEvent,setSelEvent]=useState(()=>events[0]?.id||null);
  // Derive items for the selected event; fall back to the template for new events
  const items=selEvent?(allItems[selEvent]??CHECKLIST_INIT):CHECKLIST_INIT;
  // Scope all writes to the selected event only — this is what fixes "stays checked on event switch"
  const setItems=(updater)=>{
    if(!selEvent)return;
    setAllItems(prev=>{
      const cur=prev[selEvent]??CHECKLIST_INIT;
      const next=typeof updater==='function'?updater(cur):updater;
      return{...prev,[selEvent]:next};
    });
  };
  const [showAdd,setShowAdd]=useState(false);
  const [newLabel,setNewLabel]=useState('');
  const [delTaskConfirm,setDelTaskConfirm]=useState(null);
  // v2.2 — Photo attachment state
  const [photoModal,setPhotoModal]=useState(null);   // item object being photo-attached
  const [lightboxUrl,setLightboxUrl]=useState(null); // URL string for lightbox overlay

  useEffect(()=>{
    if(selEvent&&!events.find(e=>e.id===selEvent)){
      setSelEvent(events[0]?.id||null);
    } else if(!selEvent&&events.length>0){
      setSelEvent(events[0].id);
    }
  },[events]);

  const canEdit = role==='admin'||role==='coordinator';
  const canPhoto = role==='admin'; // v2.2 — only admins attach photos

  const toggle = (id)=>setItems(prev=>({...prev,[cat]:prev[cat].map(i=>i.id===id?{...i,done:!i.done}:i)}));

  const addTask = ()=>{
    if(!newLabel.trim()) return;
    const prefix=cat.replace(/[^A-Za-z]/g,'').slice(0,2).toUpperCase();
    const newId=`${prefix}-${String(items[cat].length+1).padStart(3,'0')}`;
    setItems(prev=>({...prev,[cat]:[...prev[cat],{id:newId,label:newLabel.trim(),done:false,photoUrl:null,assignedTo:null}]}));
    setNewLabel('');
    setShowAdd(false);
  };

  const deleteTask = (id)=>{
    const taskLabel=items[cat].find(i=>i.id===id)?.label||id;
    setItems(prev=>({...prev,[cat]:prev[cat].filter(i=>i.id!==id)}));
    addLog&&addLog(`Deleted task "${taskLabel}"`,cat,'warn');
    setDelTaskConfirm(null);
  };

  // v2.2 — attach a photo dataURL to a task
  const attachPhotoToTask=(itemId,photoUrl)=>{
    setItems(prev=>({
      ...prev,
      [cat]:prev[cat].map(i=>i.id===itemId?{...i,photoUrl}:i),
    }));
  };

  const taskList=Object.values(items).flat();
  const done=taskList.filter(i=>i.done).length;
  const pct=taskList.length>0?Math.round((done/taskList.length)*100):0;
  const catPct=(c)=>{const arr=items[c];return arr.length>0?Math.round((arr.filter(i=>i.done).length/arr.length)*100):0;};

  return(
    <div className="fade-up">
      <SectionHead title="Master Checklist" sub="Track pre-production, fabrication, and logistics milestones."
        action={
          <div className="cl-action">
            {events.length>0?(
              <select value={selEvent||''} onChange={e=>setSelEvent(e.target.value)} style={{padding:'8px 12px',background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:'var(--r-sm)',fontSize:13,color:'var(--tp)',cursor:'pointer'}}>
                {events.map(ev=><option key={ev.id} value={ev.id}>{ev.id} — {ev.client}</option>)}
              </select>
            ):(
              <span style={{fontSize:12,color:'var(--tm)',padding:'8px 12px',background:'var(--overlay)',border:'1.5px solid var(--border)',borderRadius:'var(--r-sm)'}}>No events yet</span>
            )}
            {canEdit&&<GoldBtn sm onClick={()=>{setNewLabel('');setShowAdd(true);}}><Plus size={13}/>Add Task</GoldBtn>}
          </div>
        }
      />
      <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:'18px 22px',boxShadow:'var(--sh-sm)',marginBottom:20}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
          <span style={{fontSize:13,fontWeight:600,color:'var(--tp)'}}>Overall Completion</span>
          <span style={{fontSize:18,fontWeight:700,color:'var(--gold)',fontFamily:"'DM Mono',monospace"}}>{pct}%</span>
        </div>
        <div className="prog-bar"><div className="prog-fill" style={{width:`${pct}%`}}/></div>
        <div style={{fontSize:11,color:'var(--tm)',marginTop:8}}>{done} of {taskList.length} tasks completed</div>
      </div>
      <div style={{display:'flex',gap:8,marginBottom:18,flexWrap:'wrap'}}>
        {Object.keys(items).map(c=>{
          const p=catPct(c);const active=cat===c;
          return(
            <button key={c} onClick={()=>setCat(c)} style={{padding:'7px 14px',borderRadius:'var(--r-sm)',border:`1.5px solid ${active?'var(--gold)':'var(--border)'}`,background:active?'var(--gold-pale)':'var(--surface)',color:active?'var(--gold)':'var(--ts)',fontSize:12,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:7}}>
              {c}<span style={{fontSize:10,background:active?'var(--gold)':'var(--overlay)',color:active?'#fff':'var(--tm)',borderRadius:'var(--r-full)',padding:'1px 6px',fontWeight:700}}>{p}%</span>
            </button>
          );
        })}
      </div>
      <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',boxShadow:'var(--sh-sm)',overflow:'hidden'}}>
        {items[cat].length===0&&(
          <div style={{padding:'40px 20px',textAlign:'center',color:'var(--tm)'}}>
            <div style={{fontSize:32,marginBottom:10,opacity:0.25}}>✓</div>
            <div style={{fontSize:13,fontWeight:500,marginBottom:4}}>No tasks in this category</div>
            {canEdit&&<div style={{fontSize:12}}>Click <strong>Add Task</strong> to get started.</div>}
          </div>
        )}
        {items[cat].map((item,i)=>(
          <div
            key={item.id}
            className="task-row"
            style={{display:'flex',alignItems:'center',gap:14,padding:'12px 18px',borderBottom:i<items[cat].length-1?'1px solid var(--border)':'none',background:item.done?'var(--success-pale)':'var(--surface)',transition:'background var(--t-fast)'}}
          >
            {/* Checkbox + label */}
            <div
              role="checkbox"
              aria-checked={item.done}
              tabIndex={0}
              onClick={()=>toggle(item.id)}
              onKeyDown={e=>(e.key===' '||e.key==='Enter')&&(e.preventDefault(),toggle(item.id))}
              aria-label={item.label}
              style={{display:'flex',alignItems:'center',gap:14,flex:1,cursor:'pointer',minWidth:0}}
              onMouseEnter={e=>e.currentTarget.parentElement.style.background=item.done?'var(--checklist-done-hover)':'var(--overlay)'}
              onMouseLeave={e=>e.currentTarget.parentElement.style.background=item.done?'var(--success-pale)':'var(--surface)'}
            >
              <div aria-hidden="true" style={{width:20,height:20,borderRadius:'var(--r-xs)',border:`2px solid ${item.done?'var(--success)':'var(--border-s)'}`,background:item.done?'var(--success)':'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'all var(--t-fast)'}}>
                {item.done&&<Check size={12} color="var(--surface)" strokeWidth={3}/>}
              </div>
              <span style={{fontSize:13,color:item.done?'var(--ts)':'var(--tp)',textDecoration:item.done?'line-through':'none',fontWeight:item.done?400:500,flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.label}</span>
              {item.done&&<Badge label="Done" color="green" role="none"/>}
            </div>

            {/* v2.2 — Photo thumbnail (visible to all if attached) */}
            {item.photoUrl&&(
              <button
                onClick={()=>setLightboxUrl(item.photoUrl)}
                aria-label={`View attached photo for: ${item.label}`}
                title="View attached photo"
                style={{
                  padding:0,border:'1.5px solid var(--gold-border)',borderRadius:'var(--r-sm)',
                  cursor:'pointer',background:'transparent',flexShrink:0,
                  overflow:'hidden',width:34,height:34,position:'relative',
                  display:'flex',alignItems:'center',justifyContent:'center',
                }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--gold)';e.currentTarget.style.boxShadow='var(--sh-sm)';}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--gold-border)';e.currentTarget.style.boxShadow='none';}}
              >
                <img src={item.photoUrl} alt="" style={{width:34,height:34,objectFit:'cover',display:'block'}}/>
                <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0)',display:'flex',alignItems:'center',justifyContent:'center',transition:'background var(--t-fast)'}}
                  onMouseEnter={e=>{e.currentTarget.style.background='rgba(0,0,0,.28)';}}
                  onMouseLeave={e=>{e.currentTarget.style.background='rgba(0,0,0,0)';}}
                >
                  <ZoomIn size={13} color='rgba(255,255,255,0)' style={{transition:'color var(--t-fast)'}}
                    onMouseEnter={e=>{e.style.color='rgba(255,255,255,1)';}}
                  />
                </div>
              </button>
            )}

            {/* v2.2 — Attach photo button (admin only) */}
            {canPhoto&&(
              <button
                onClick={()=>setPhotoModal(item)}
                aria-label={`${item.photoUrl?'Change':'Attach'} photo for task: ${item.label}`}
                title={item.photoUrl?'Change attached photo':'Attach a reference photo'}
                style={{
                  padding:'5px 7px',
                  background:item.photoUrl?'var(--gold-faint)':'transparent',
                  color:item.photoUrl?'var(--gold)':'var(--tm)',
                  border:`1px solid ${item.photoUrl?'var(--gold-border)':'transparent'}`,
                  borderRadius:'var(--r-sm)',cursor:'pointer',
                  display:'flex',alignItems:'center',flexShrink:0,
                  opacity:0.7,transition:'all var(--t-fast)',
                }}
                onMouseEnter={e=>{e.currentTarget.style.color='var(--gold)';e.currentTarget.style.opacity='1';e.currentTarget.style.background='var(--gold-faint)';e.currentTarget.style.borderColor='var(--gold-border)';}}
                onMouseLeave={e=>{e.currentTarget.style.color=item.photoUrl?'var(--gold)':'var(--tm)';e.currentTarget.style.opacity='0.7';e.currentTarget.style.background=item.photoUrl?'var(--gold-faint)':'transparent';e.currentTarget.style.borderColor=item.photoUrl?'var(--gold-border)':'transparent';}}
              ><Camera size={13}/></button>
            )}

            {/* Crew assignment dropdown — admin only */}
            {role==='admin'&&staff.length>0&&(
              <select
                value={item.assignedTo||''}
                onChange={e=>{
                  const memberId=e.target.value;
                  setItems(prev=>({...prev,[cat]:prev[cat].map(i=>i.id===item.id?{...i,assignedTo:memberId||null}:i)}));
                  if(memberId){const m=staff.find(s=>s.id===memberId);addLog&&addLog(`Assigned "${item.label}" to ${m?.name||memberId}`,cat,'info');}
                }}
                onClick={e=>e.stopPropagation()}
                title="Assign crew member"
                aria-label={`Assign crew to: ${item.label}`}
                style={{fontSize:11,padding:'3px 7px',border:`1.5px solid ${item.assignedTo?'var(--gold-border)':'var(--border)'}`,borderRadius:'var(--r-sm)',background:item.assignedTo?'var(--gold-faint)':'var(--surface)',color:item.assignedTo?'var(--gold)':'var(--ts)',cursor:'pointer',maxWidth:130,flexShrink:0}}
              >
                <option value=''>Unassigned</option>
                {staff.filter(s=>s.active).map(s=>(<option key={s.id} value={s.id}>{s.name}</option>))}
              </select>
            )}
            {/* Show assignee badge for non-admin */}
            {role!=='admin'&&item.assignedTo&&(()=>{const m=staff.find(s=>s.id===item.assignedTo);return m?<Badge label={m.name} color="blue" role="none"/>:null;})()}

            {/* Delete task button */}
            {canEdit&&(
              <button
                onClick={()=>setDelTaskConfirm(item)}
                aria-label={`Delete task: ${item.label}`}
                style={{padding:'4px 8px',background:'transparent',color:'var(--tm)',border:'none',borderRadius:'var(--r-sm)',cursor:'pointer',display:'flex',alignItems:'center',flexShrink:0,opacity:0.5}}
                onMouseEnter={e=>{e.currentTarget.style.color='var(--danger)';e.currentTarget.style.opacity='1';e.currentTarget.style.background='var(--danger-pale)';}}
                onMouseLeave={e=>{e.currentTarget.style.color='var(--tm)';e.currentTarget.style.opacity='0.5';e.currentTarget.style.background='transparent';}}
              ><Trash2 size={13}/></button>
            )}
          </div>
        ))}
      </div>

      {showAdd&&(
        <Modal title={`Add Task — ${cat}`} onClose={()=>setShowAdd(false)}
          footer={<>
            <GhostBtn onClick={()=>setShowAdd(false)}>Cancel</GhostBtn>
            <GoldBtn onClick={addTask} disabled={!newLabel.trim()}><Plus size={13}/>Add Task</GoldBtn>
          </>}
        >
          <div style={{marginBottom:16}}>
            <label style={{fontSize:11,fontWeight:600,color:'var(--ts)',letterSpacing:'.05em',display:'block',marginBottom:5,textTransform:'uppercase'}}>Task Description</label>
            <input
              autoFocus
              className="edit-field"
              value={newLabel}
              onChange={e=>setNewLabel(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&addTask()}
              placeholder="e.g. Confirm venue floor plan with client"
            />
            {!newLabel.trim()&&<div style={{fontSize:11,color:'var(--tm)',marginTop:5}}>Press Enter or click Add Task to save.</div>}
          </div>
        </Modal>
      )}

      {delTaskConfirm&&(
        <Modal title="Delete Task?" onClose={()=>setDelTaskConfirm(null)}>
          <div style={{padding:'12px 14px',background:'var(--danger-pale)',border:'1px solid var(--danger-border)',borderRadius:'var(--r-md)',marginBottom:16}}>
            <div style={{fontSize:13,fontWeight:600,color:'var(--danger)',marginBottom:2}}>{delTaskConfirm.label}</div>
            <div style={{fontSize:12,color:'var(--ts)'}}>This will permanently remove the task. This action cannot be undone.</div>
          </div>
          <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
            <GhostBtn onClick={()=>setDelTaskConfirm(null)}>Cancel</GhostBtn>
            <GhostBtn danger onClick={()=>deleteTask(delTaskConfirm.id)}><Trash2 size={12}/>Delete Task</GhostBtn>
          </div>
        </Modal>
      )}

      {/* v2.2 — Task Photo Attach Modal */}
      {photoModal&&(
        <TaskPhotoModal
          itemLabel={photoModal.label}
          existingPhotoUrl={photoModal.photoUrl}
          onAttach={(url)=>{attachPhotoToTask(photoModal.id,url);setPhotoModal(null);}}
          onClose={()=>setPhotoModal(null)}
        />
      )}

      {/* v2.2 — Full-screen Photo Lightbox */}
      {lightboxUrl&&(
        <PhotoLightbox
          src={lightboxUrl}
          caption="Task Reference Photo"
          onClose={()=>setLightboxUrl(null)}
        />
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   MODULE 4 — CREW & TASKS (+ Add/Edit Staff w/ 2FA)
   v2.2: Admin crew deletion with confirmation modal
══════════════════════════════════════════════════════ */
const CrewView = ({role:userRole,accessCodes,staff,setStaff,currentUserId,addLog})=>{
  if(!ACCESS[userRole].includes('crew')) return <RoleBlock module="Crew & Tasks" role={userRole}/>;
  const [filter,setFilter]=useState('all');
  const [showAddModal,setShowAddModal]=useState(false);
  const [editStaffId,setEditStaffId]=useState(null);
  const blankForm={name:'',username:'',role:'coordinator',email:'',phone:'',callTime:'08:00',password:'',roleCode:''};
  const [form,setForm]=useState(blankForm);
  const [formErr,setFormErr]=useState('');
  // v2.2 — Crew deletion state
  const [delCrewConfirm,setDelCrewConfirm]=useState(null);

  const filtered=filter==='all'?staff:staff.filter(s=>s.role===filter);
  const rClr={admin:'gold',coordinator:'blue',designer:'green',warehouse:'grey'};

  const openAdd=()=>{setForm(blankForm);setFormErr('');setEditStaffId(null);setShowAddModal(true);};
  const openEdit=(s)=>{setForm({...s,password:s.password||'',roleCode:''});setFormErr('');setEditStaffId(s.id);setShowAddModal(true);};

  // v2.2 — permanent staff deletion
  const deleteStaff=async(s)=>{
    const {error}=await (supabaseAdmin??supabase).from('profiles').delete().eq('id',s.id);
    if(error){alert('Delete failed: '+error.message);return;}
    setStaff(prev=>prev.filter(m=>m.id!==s.id));
    addLog&&addLog(`Deleted staff profile for ${s.name}`,s.id,'warn');
    setDelCrewConfirm(null);
  };

  const saveStaff=async()=>{
    if(!form.name.trim()){setFormErr('Staff name is required.');return;}
    if(!form.username.trim()){setFormErr('A unique username is required.');return;}
    const usernameConflict=staff.some(s=>
      s.username.toLowerCase()===form.username.trim().toLowerCase()&&s.id!==editStaffId
    );
    if(usernameConflict){setFormErr(`Username "${form.username.trim()}" is already taken.`);return;}
    // Password is only required when creating a new account — not when editing an existing profile.
    // Passwords live in Supabase Auth and are never stored in the profiles table.
    if(!editStaffId&&!form.password.trim()){setFormErr('A password is required.');return;}
    const expectedCode=form.role==='admin'?ADMIN_CODE:accessCodes[form.role];
    if(form.roleCode!==expectedCode){setFormErr(`Invalid ${ROLE_LABEL[form.role]} Access Code.`);return;}

    if(editStaffId){
      // UPDATE existing profile (password not touched — use ChangePasswordModal for that)
      const {error}=await (supabaseAdmin??supabase).from('profiles').update({
        username:form.username.trim(),
        role:form.role,
        full_name:form.name,
        email:form.email,
        phone:form.phone,
      }).eq('id',editStaffId);
      if(error){setFormErr('Update failed: '+error.message);return;}
      setStaff(prev=>prev.map(s=>s.id===editStaffId?{...s,...form,id:editStaffId}:s));
      addLog&&addLog(`Edited staff profile for ${form.name}`,editStaffId,'info');
    } else {
      const email=form.email.trim()||`${form.username.trim()}@metroevents.ph`;

      // Use the admin API (service role) to create the account so that:
      //   1. email_confirm:true skips email confirmation — works regardless of Supabase project settings.
      //   2. The admin's own browser session is never overwritten (supabaseAdmin uses persistSession:false).
      //   3. data.user is always returned on success — no more "session not returned" false-positives.
      // Falls back to the anon signUp path only when VITE_SUPABASE_SERVICE_KEY is not configured.
      let newUser=null;
      if(supabaseAdmin){
        const {data,error}=await supabaseAdmin.auth.admin.createUser({
          email,
          password:form.password,
          email_confirm:true,
          user_metadata:{
            username:form.username.trim(),
            role:form.role,
            full_name:form.name,
          }
        });
        if(error){setFormErr('Failed to create account: '+error.message);return;}
        newUser=data.user;
      } else {
        // Fallback: VITE_SUPABASE_SERVICE_KEY not set — use public signUp.
        // NOTE: this may fail when email confirmation is enabled in Supabase Auth settings.
        //       Add VITE_SUPABASE_SERVICE_KEY to your environment to use the reliable admin path.
        const {data,error}=await supabase.auth.signUp({
          email,
          password:form.password,
          options:{
            emailRedirectTo:undefined,
            data:{
              username:form.username.trim(),
              role:form.role,
              full_name:form.name,
            }
          }
        });
        if(error){setFormErr('Failed to create account: '+error.message);return;}
        newUser=data.user||data.session?.user;
      }
      if(!newUser){
        setFormErr(
          supabaseAdmin
            ? 'Account creation failed: no user returned from admin API. Check Supabase logs.'
            : 'Account created but no session returned. Add VITE_SUPABASE_SERVICE_KEY to fix this, or disable "Email Confirmation" in your Supabase Auth settings.'
        );
        return;
      }

      const {error:upsertErr}=await (supabaseAdmin??supabase).from('profiles').upsert({
        id:newUser.id,
        username:form.username.trim(),
        role:form.role,
        full_name:form.name,
        email,
        phone:form.phone||'',
      });
      if(upsertErr){setFormErr('Auth account created but profile save failed: '+upsertErr.message);return;}

      const {data:updated}=await (supabaseAdmin??supabase).from('profiles').select('*');
      if(updated) setStaff(updated.map(s=>({...s, name: s.name ?? s.full_name ?? '', active: s.active ?? true})));
      addLog&&addLog(`Added new staff member ${form.name} (${form.role})`,newUser.id,'info');
    }
    setShowAddModal(false);
  };
  const ef=(k,v)=>setForm(p=>({...p,[k]:v}));

  return(
    <div className="fade-up">
      <SectionHead title="Crew & Tasks" sub="Staff directory with dual-factor protected profile management."
        action={
          userRole==='admin'?
          <GoldBtn onClick={openAdd}><UserPlus size={13}/>Add Staff Member</GoldBtn>:null
        }
      />
      <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:18}}>
        {['all','coordinator','designer','warehouse','admin'].map(r=>(
          <button key={r} onClick={()=>setFilter(r)} style={{padding:'6px 13px',borderRadius:'var(--r-sm)',border:`1.5px solid ${filter===r?'var(--gold)':'var(--border)'}`,background:filter===r?'var(--gold-pale)':'var(--surface)',color:filter===r?'var(--gold)':'var(--ts)',fontSize:11,fontWeight:600,cursor:'pointer',textTransform:'capitalize',letterSpacing:'.04em'}}>
            {r==='all'?'All Roles':r}
          </button>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:14}}>
        {filtered.map(s=>(
          <div key={s.id} style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:'18px 20px',boxShadow:'var(--sh-sm)',transition:'transform var(--t-base),box-shadow var(--t-base)'}}
          onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='var(--sh-md)'}}
          onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='var(--sh-sm)'}}>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
              <div style={{width:40,height:40,borderRadius:'50%',background:`linear-gradient(135deg,var(--navy),var(--navy-lt))`,border:`1.5px solid var(--gold-border)`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <span className="disp" style={{fontSize:17,fontWeight:700,color:'var(--gold-lt)'}}>{(s.name||s.full_name||'?').charAt(0)}</span>
              </div>
              <div style={{overflow:'hidden',flex:1}}>
                <div style={{fontSize:14,fontWeight:600,color:'var(--tp)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{s.name}</div>
                <div style={{fontSize:11,color:'var(--tm)',fontFamily:"'DM Mono',monospace",marginTop:1}}>@{s.username}</div>
                <div style={{marginTop:3,display:'flex',gap:6,alignItems:'center'}}>
                  <Badge label={s.role} color={rClr[s.role]||'grey'} role="none"/>
                </div>
              </div>
              {/* Action buttons — Edit + Delete (admin only) */}
              {userRole==='admin'&&(
                <div style={{display:'flex',gap:5,flexShrink:0}}>
                  <button onClick={()=>openEdit(s)} aria-label={`Edit ${s.name}'s profile`} style={{background:'var(--overlay)',border:'1px solid var(--border)',borderRadius:'var(--r-sm)',padding:'4px 8px',cursor:'pointer',display:'flex',alignItems:'center',gap:4,color:'var(--ts)',fontSize:11}}
                  onMouseEnter={e=>e.currentTarget.style.background='var(--gold-pale)'}
                  onMouseLeave={e=>e.currentTarget.style.background='var(--overlay)'}>
                    <Edit2 size={11} aria-hidden="true"/>Edit
                  </button>
                  {/* v2.2 — Delete button: shown for all staff except the current session user */}
                  {s.id!==currentUserId&&(
                    <button
                      onClick={()=>setDelCrewConfirm(s)}
                      aria-label={`Delete ${s.name}'s profile`}
                      title="Delete staff profile"
                      style={{
                        background:'transparent',
                        border:'1px solid var(--danger-border)',
                        borderRadius:'var(--r-sm)',
                        padding:'4px 7px',
                        cursor:'pointer',
                        display:'flex',alignItems:'center',
                        color:'var(--danger)',fontSize:11,
                        opacity:0.75,
                      }}
                      onMouseEnter={e=>{e.currentTarget.style.background='var(--danger-pale)';e.currentTarget.style.opacity='1';e.currentTarget.style.borderColor='var(--danger)';}}
                      onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.opacity='0.75';e.currentTarget.style.borderColor='var(--danger-border)';}}
                    ><Trash2 size={11} aria-hidden="true"/></button>
                  )}
                </div>
              )}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:14}}>
              {[['Tasks Assigned',s.tasks],['Call Time',s.callTime]].map(([l,v])=>(
                <div key={l} style={{padding:'8px 10px',background:'var(--overlay)',borderRadius:'var(--r-md)'}}>
                  <div style={{fontSize:10,color:'var(--tm)',fontWeight:600,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:3}}>{l}</div>
                  <div style={{fontSize:14,fontWeight:700,color:'var(--tp)'}}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{borderTop:'1px solid var(--border)',paddingTop:12,display:'flex',flexDirection:'column',gap:5}}>
              {[[Mail,s.email],[Phone,s.phone]].map(([Ic,v])=>(
                <div key={v} style={{display:'flex',gap:8,alignItems:'center'}}>
                  <Ic size={12} color='var(--tm)'/>
                  <span style={{fontSize:12,color:'var(--ts)',fontFamily:"'DM Mono',monospace"}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showAddModal&&(
        <Modal title={editStaffId?'Edit Staff Profile':'Add New Staff Member'} onClose={()=>setShowAddModal(false)} wide
          footer={<>
            <GhostBtn onClick={()=>setShowAddModal(false)}>Cancel</GhostBtn>
            <GoldBtn onClick={saveStaff}><ShieldCheck size={13}/>{editStaffId?'Save Changes':'Create Profile'}</GoldBtn>
          </>}
        >
          {/* 2FA notice banner */}
          <div style={{padding:'10px 14px',background:'var(--navy)',borderRadius:'var(--r-md)',marginBottom:18,display:'flex',gap:10,alignItems:'center'}}>
            <ShieldCheck size={16} color='var(--gold)' aria-hidden="true"/>
            <div>
              <div style={{fontSize:12,fontWeight:600,color:'var(--sidebar-text)'}}>Dual-Factor Profile Authorization</div>
              <div style={{fontSize:11,color:'var(--sidebar-text-mid)',marginTop:1}}>A unique username, staff password, and the role-specific Access Code are required to {editStaffId?'update':'create'} this profile.</div>
            </div>
          </div>

          {/* Profile fields — 2-column grid */}
          <div className="g-2" style={{gap:12,marginBottom:14}}>
            <Field label="Full Name" value={form.name} onChange={v=>ef('name',v)} placeholder="e.g. Ana Cruz"/>
            <div style={{marginBottom:14}}>
              <label style={{fontSize:11,fontWeight:600,color:'var(--ts)',letterSpacing:'.05em',display:'block',marginBottom:5,textTransform:'uppercase'}}>
                Username <span style={{color:'var(--danger)'}}>*</span>
              </label>
              <div style={{position:'relative'}}>
                <span style={{position:'absolute',left:11,top:'50%',transform:'translateY(-50%)',fontSize:13,color:'var(--tm)',fontFamily:"'DM Mono',monospace",pointerEvents:'none'}}>@</span>
                <input
                  value={form.username}
                  onChange={e=>ef('username',e.target.value.replace(/\s/g,'').toLowerCase())}
                  placeholder="e.g. anacruz"
                  style={{width:'100%',padding:'9px 12px 9px 26px',background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:'var(--r-sm)',fontSize:13,color:'var(--tp)',fontFamily:"'DM Mono',monospace"}}
                />
              </div>
              <div style={{fontSize:11,color:'var(--tm)',marginTop:4}}>Used to log in. Must be unique. Lowercase, no spaces.</div>
            </div>
            <Field label="Role" value={form.role} onChange={v=>ef('role',v)} options={Object.entries(ROLE_LABEL).map(([v,l])=>({value:v,label:l}))}/>
            <Field label="Email" type="email" value={form.email} onChange={v=>ef('email',v)} placeholder="staff@metroevents.ph"/>
            <Field label="Phone" value={form.phone} onChange={v=>ef('phone',v)} placeholder="09XXXXXXXXX"/>
            <Field label="Call Time" value={form.callTime} onChange={v=>ef('callTime',v)} placeholder="08:00"/>
          </div>

          {/* Security credentials — full-width section below */}
          <div style={{padding:'16px 18px',background:'var(--gold-faint)',border:'1px solid rgba(184,146,74,.2)',borderRadius:'var(--r-md)',marginBottom:14}}>
            <div style={{fontSize:10,fontWeight:600,color:'var(--gold)',letterSpacing:'.14em',textTransform:'uppercase',marginBottom:14,display:'flex',alignItems:'center',gap:6}}>
              <Key size={11} color='var(--gold)' aria-hidden="true"/>Security Credentials
            </div>
            <div className="g-2" style={{gap:12}}>
              <Field label="Staff Account Password" type="password" value={form.password} onChange={v=>ef('password',v)} placeholder="Minimum 8 characters" hint="This password will be used by this staff member to log in."/>
              <div style={{marginBottom:14}}>
                <label style={{fontSize:11,fontWeight:600,color:'var(--ts)',letterSpacing:'.05em',display:'block',marginBottom:5,textTransform:'uppercase'}}>
                  {ROLE_LABEL[form.role]} Access Code <span style={{color:'var(--danger)'}}>*</span>
                </label>
                <div style={{position:'relative'}}>
                  <Key size={12} color='var(--tm)' style={{position:'absolute',left:11,top:'50%',transform:'translateY(-50%)'}}/>
                  <input type="password" value={form.roleCode} onChange={e=>ef('roleCode',e.target.value)} placeholder="Enter role access code to authorize" style={{width:'100%',padding:'9px 12px 9px 32px',background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:'var(--r-sm)',fontSize:13,color:'var(--tp)'}}/>
                </div>
                <div style={{fontSize:11,color:'var(--tm)',marginTop:4}}>Required to authorize. Admin can find this in the Access Code Control Board.</div>
              </div>
            </div>
          </div>

          {formErr&&(
            <div role="alert" style={{padding:'9px 12px',background:'var(--danger-pale)',border:`1px solid var(--danger-border)`,borderRadius:'var(--r-sm)',fontSize:12,color:'var(--danger)',marginTop:4,marginBottom:12,display:'flex',gap:7,alignItems:'center'}}>
              <AlertCircle size={13} aria-hidden="true"/>{formErr}
            </div>
          )}
        </Modal>
      )}

      {/* v2.2 — Delete Staff Confirmation Modal */}
      {delCrewConfirm&&(
        <Modal title="Delete Staff Profile?" onClose={()=>setDelCrewConfirm(null)}>
          {/* Danger banner */}
          <div style={{padding:'14px 16px',background:'var(--danger-pale)',border:'1px solid var(--danger-border)',borderRadius:'var(--r-md)',marginBottom:16}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
              <div style={{width:38,height:38,borderRadius:'50%',background:`linear-gradient(135deg,var(--navy),var(--navy-lt))`,border:`1.5px solid var(--danger-border)`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <span className="disp" style={{fontSize:16,fontWeight:700,color:'var(--danger)'}}>{(delCrewConfirm.name||delCrewConfirm.full_name||'?').charAt(0)}</span>
              </div>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:'var(--danger)'}}>{delCrewConfirm.name}</div>
                <div style={{fontSize:11,color:'var(--ts)',fontFamily:"'DM Mono',monospace",marginTop:1}}>
                  @{delCrewConfirm.username} · <Badge label={ROLE_LABEL[delCrewConfirm.role]||delCrewConfirm.role} color={({admin:'gold',coordinator:'blue',designer:'green',warehouse:'grey'})[delCrewConfirm.role]||'grey'}/>
                </div>
              </div>
            </div>
            <div style={{display:'flex',alignItems:'flex-start',gap:8,padding:'10px 12px',background:'rgba(184,60,60,.08)',border:'1px solid rgba(184,60,60,.16)',borderRadius:'var(--r-sm)'}}>
              <AlertTriangle size={14} color='var(--danger)' style={{flexShrink:0,marginTop:1}} aria-hidden="true"/>
              <div>
                <div style={{fontSize:12,fontWeight:600,color:'var(--danger)',marginBottom:3}}>This action is permanent and cannot be undone.</div>
                <div style={{fontSize:11,color:'var(--ts)',lineHeight:1.6}}>
                  Deleting this profile will permanently remove <strong>{delCrewConfirm.name}</strong> from the staff directory. Their login credentials will be invalidated immediately and all associated task assignments will be orphaned. This action is logged in the audit trail.
                </div>
              </div>
            </div>
          </div>
          {/* Confirmation prompt */}
          <div style={{fontSize:12,color:'var(--ts)',marginBottom:18,padding:'10px 13px',background:'var(--overlay)',borderRadius:'var(--r-sm)',border:'1px solid var(--border)'}}>
            <span style={{color:'var(--tm)'}}>You are about to permanently delete the profile for </span>
            <strong style={{color:'var(--tp)'}}>{delCrewConfirm.name}</strong>
            <span style={{color:'var(--tm)'}}> ({delCrewConfirm.id}). Proceed only if you are certain.</span>
          </div>
          <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
            <GhostBtn onClick={()=>setDelCrewConfirm(null)}>Cancel — Keep Profile</GhostBtn>
            <GhostBtn danger onClick={()=>deleteStaff(delCrewConfirm)}>
              <Trash2 size={13}/>Delete Permanently
            </GhostBtn>
          </div>
        </Modal>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   MODULE 5 — WAREHOUSE INVENTORY (FULL INLINE EDIT)
══════════════════════════════════════════════════════ */
const WarehouseView = ({role,events=[],addLog})=>{
  if(!ACCESS[role].includes('warehouse')) return <RoleBlock module="Warehouse Inventory" role={role}/>;
  const [inv,setInv]=useSyncedState('metro_inv',INVENTORY_INIT);
  const [search,setSearch]=useState('');
  const [editItem,setEditItem]=useState(null);
  const [editForm,setEditForm]=useState({});
  const [checkoutItem,setCheckoutItem]=useState(null);
  const [coForm,setCoForm]=useState({event:'E-001',qty:1,note:'',deprRate:'',nextInspect:'',condAfter:'Good'});
  const [showAddInv,setShowAddInv]=useState(false);
  const [addInvForm,setAddInvForm]=useState({});
  const [delInvConfirm,setDelInvConfirm]=useState(null);
  // v2.2 — Photo attachment state
  const [photoModalItem,setPhotoModalItem]=useState(null);
  const [lightboxUrl,setLightboxUrl]=useState(null);
  const canAdmin = role==='admin';
  const blankInvItem={item:'',cat:'Decor',qty:0,avail:0,unitCost:0,cond:'Good',loc:'',reservedFor:''};

  const filtered=inv.filter(i=>
    i.item.toLowerCase().includes(search.toLowerCase())||
    i.cat.toLowerCase().includes(search.toLowerCase())||
    i.id.toLowerCase().includes(search.toLowerCase())
  );
  const condClr=c=>({Good:'green',Damaged:'red',Chipped:'orange'})[c]||'grey';

  const startEdit=(item)=>{setEditItem(item.id);setEditForm({...item});};
  const cancelEdit=()=>{setEditItem(null);};
  const saveEdit=()=>{
    setInv(prev=>prev.map(i=>i.id===editForm.id?{...editForm}:i));
    setEditItem(null);
  };
  const ef=(k,v)=>setEditForm(p=>({...p,[k]:v}));
  const aef=(k,v)=>setAddInvForm(p=>({...p,[k]:v}));

  const addInvItem=()=>{
    if(!addInvForm.item?.trim()) return;
    const newId='W-'+String(inv.length+1).padStart(3,'0');
    setInv(prev=>[...prev,{...blankInvItem,...addInvForm,id:newId}]);
    addLog&&addLog(`Added inventory item ${addInvForm.item}`,newId,'info');
    setShowAddInv(false);
  };

  const deleteInvItem=(item)=>{
    setInv(prev=>prev.filter(i=>i.id!==item.id));
    addLog&&addLog(`Removed inventory item ${item.item}`,item.id,'warn');
    setDelInvConfirm(null);
  };

  // v2.2 — attach a photo dataURL to a warehouse item
  const attachPhotoToInvItem=(itemId,photoUrl)=>{
    setInv(prev=>prev.map(i=>i.id===itemId?{...i,photoUrl}:i));
  };

  const doCheckout=()=>{
    setInv(prev=>prev.map(i=>i.id===checkoutItem.id?{...i,avail:Math.max(0,i.avail-coForm.qty),reservedFor:[i.reservedFor,coForm.event].filter(Boolean).join(', ')}:i));
    addLog&&addLog(`Checked out ${coForm.qty}× ${checkoutItem.item} → ${coForm.event||'unassigned'}`,checkoutItem.id,'info');
    setCheckoutItem(null);
  };

  return(
    <div className="fade-up">
      <SectionHead title="Warehouse Inventory" sub="Full edit access: stock levels, replacement costs, rack locations, and checkout flows."
        action={canAdmin&&<GoldBtn onClick={()=>{setAddInvForm({...blankInvItem});setShowAddInv(true);}}><Plus size={13}/>Add Item</GoldBtn>}
      />
      <div style={{display:'flex',gap:14,flexWrap:'wrap',marginBottom:20}}>
        <StatCard label="Total SKUs" value={inv.length} icon={Package} color="blue"/>
        <StatCard label="Reserved Items" value={inv.filter(i=>i.reservedFor).length} icon={Archive} color="gold"/>
        <StatCard label="Damaged/Chipped" value={inv.filter(i=>i.cond!=='Good').length} icon={AlertTriangle} color="red"/>
        <StatCard label="Available Units" value={inv.reduce((s,i)=>s+i.avail,0)} icon={CheckCircle} color="green"/>
      </div>

      <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',boxShadow:'var(--sh-sm)',overflow:'hidden'}}>
        <div style={{padding:'14px 18px',borderBottom:'1px solid var(--border)',display:'flex',gap:12,alignItems:'center',flexWrap:'wrap'}}>
          <div style={{position:'relative',flex:'1 1 200px'}}>
            <Search size={13} color='var(--tm)' style={{position:'absolute',left:11,top:'50%',transform:'translateY(-50%)'}}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search items, category, ID..." style={{width:'100%',padding:'8px 12px 8px 32px',background:'var(--overlay)',border:'1.5px solid var(--border)',borderRadius:'var(--r-sm)',fontSize:13,color:'var(--tp)'}}/>
          </div>
          <span style={{fontSize:12,color:'var(--tm)'}}>{filtered.length} items</span>
        </div>
        <div className="tbl-wrap">
          <table className="dt" aria-label="Warehouse inventory">
            <thead><tr>
              <th scope="col">ID</th><th scope="col">Item</th><th scope="col">Cat</th><th scope="col">Total Qty</th><th scope="col">Available</th><th scope="col">Unit Cost</th><th scope="col">Condition</th><th scope="col">Location</th><th scope="col">Reserved</th><th scope="col">Photo</th><th scope="col">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map(item=>{
                const isEditing=editItem===item.id;
                return(
                  <tr key={item.id} style={{background:isEditing?'var(--gold-faint)':''}}>
                    <td><span className="mono" style={{fontSize:11,color:'var(--tm)'}}>{item.id}</span></td>
                    <td style={{maxWidth:200}}>{isEditing?<input className="edit-field" value={editForm.item} onChange={e=>ef('item',e.target.value)} style={{minWidth:160}}/>:<span style={{fontWeight:500}}>{item.item}</span>}</td>
                    <td><Badge label={item.cat} color="grey"/></td>
                    <td>{isEditing?<input type="number" className="edit-field" value={editForm.qty} onChange={e=>ef('qty',Number(e.target.value))} style={{width:70}}/>:<span className="mono" style={{fontWeight:600}}>{item.qty}</span>}</td>
                    <td>{isEditing?<input type="number" className="edit-field" value={editForm.avail} onChange={e=>ef('avail',Number(e.target.value))} style={{width:70}}/>:<span className="mono" style={{fontWeight:600,color:item.avail<5?'var(--danger)':item.avail<10?'var(--warn)':'var(--success)'}}>{item.avail}</span>}</td>
                    <td>{isEditing?<input type="number" className="edit-field" value={editForm.unitCost} onChange={e=>ef('unitCost',Number(e.target.value))} style={{width:90}}/>:<span className="mono" style={{fontSize:12}}>{fmt(item.unitCost)}</span>}</td>
                    <td>{isEditing?(
                      <select className="edit-field" value={editForm.cond} onChange={e=>ef('cond',e.target.value)} style={{width:100}}>
                        {['Good','Chipped','Damaged'].map(c=><option key={c}>{c}</option>)}
                      </select>
                    ):<Badge label={item.cond} color={condClr(item.cond)} dot/>}</td>
                    <td>{isEditing?<input className="edit-field" value={editForm.loc} onChange={e=>ef('loc',e.target.value)} style={{width:110}}/>:<span style={{fontSize:12,color:'var(--ts)'}}>{item.loc}</span>}</td>
                    <td><span style={{fontSize:11,color:item.reservedFor?'var(--info)':'var(--tm)',fontFamily:"'DM Mono',monospace"}}>{item.reservedFor||'—'}</span></td>
                    {/* v2.2 — Photo thumbnail cell */}
                    <td>
                      <div style={{display:'flex',alignItems:'center',gap:6}}>
                        {item.photoUrl?(
                          <button
                            onClick={()=>setLightboxUrl(item.photoUrl)}
                            aria-label={`View photo for ${item.item}`}
                            title="View attached photo"
                            style={{padding:0,border:'1.5px solid var(--gold-border)',borderRadius:'var(--r-xs)',cursor:'pointer',background:'transparent',overflow:'hidden',width:30,height:30,flexShrink:0}}
                            onMouseEnter={e=>e.currentTarget.style.borderColor='var(--gold)'}
                            onMouseLeave={e=>e.currentTarget.style.borderColor='var(--gold-border)'}
                          >
                            <img src={item.photoUrl} alt="" style={{width:30,height:30,objectFit:'cover',display:'block'}}/>
                          </button>
                        ):null}
                        {canAdmin&&(
                          <button
                            onClick={()=>setPhotoModalItem(item)}
                            aria-label={`${item.photoUrl?'Change':'Attach'} photo for ${item.item}`}
                            title={item.photoUrl?'Change photo':'Attach reference photo'}
                            style={{padding:'4px 6px',background:item.photoUrl?'var(--gold-faint)':'transparent',color:item.photoUrl?'var(--gold)':'var(--tm)',border:`1px solid ${item.photoUrl?'var(--gold-border)':'transparent'}`,borderRadius:'var(--r-xs)',cursor:'pointer',display:'flex',alignItems:'center',opacity:0.8}}
                            onMouseEnter={e=>{e.currentTarget.style.color='var(--gold)';e.currentTarget.style.background='var(--gold-faint)';e.currentTarget.style.borderColor='var(--gold-border)';e.currentTarget.style.opacity='1';}}
                            onMouseLeave={e=>{e.currentTarget.style.color=item.photoUrl?'var(--gold)':'var(--tm)';e.currentTarget.style.background=item.photoUrl?'var(--gold-faint)':'transparent';e.currentTarget.style.borderColor=item.photoUrl?'var(--gold-border)':'transparent';e.currentTarget.style.opacity='0.8';}}
                          ><Camera size={12}/></button>
                        )}
                        {!item.photoUrl&&!canAdmin&&<span style={{fontSize:11,color:'var(--tm)'}}>—</span>}
                      </div>
                    </td>
                    <td>
                      {isEditing?(
                        <div style={{display:'flex',gap:6}}>
                          <button onClick={saveEdit} style={{padding:'4px 10px',background:'var(--success)',color:'#fff',border:'none',borderRadius:'var(--r-sm)',fontSize:11,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:4}}>
                            <Save size={11}/>Save
                          </button>
                          <button onClick={cancelEdit} style={{padding:'4px 10px',background:'var(--overlay)',color:'var(--ts)',border:'1px solid var(--border)',borderRadius:'var(--r-sm)',fontSize:11,fontWeight:600,cursor:'pointer',marginLeft:4}}>
                            Cancel
                          </button>
                        </div>
                      ):(
                        <div style={{display:'flex',gap:6}}>
                          <button onClick={()=>startEdit(item)} aria-label={`Edit ${item.item}`} style={{padding:'4px 10px',background:'var(--gold-pale)',color:'var(--gold)',border:`1px solid var(--gold-border)`,borderRadius:'var(--r-sm)',fontSize:11,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:4}}
                          onMouseEnter={e=>e.currentTarget.style.background='var(--gold-faint)'}
                          onMouseLeave={e=>e.currentTarget.style.background='var(--gold-pale)'}>
                            <Edit2 size={10} aria-hidden="true"/>Edit
                          </button>
                          <button onClick={()=>{setCheckoutItem(item);setCoForm({event:'E-001',qty:1,note:'',deprRate:'',nextInspect:'',condAfter:'Good'});}} aria-label={`Check out ${item.item}`} style={{padding:'4px 10px',background:'var(--navy)',color:'var(--sidebar-text-mid)',border:'none',borderRadius:'var(--r-sm)',fontSize:11,fontWeight:500,cursor:'pointer',whiteSpace:'nowrap'}}
                          onMouseEnter={e=>e.currentTarget.style.background='var(--navy-lt)'}
                          onMouseLeave={e=>e.currentTarget.style.background='var(--navy)'}>
                            Check Out
                          </button>
                          {canAdmin&&(
                            <button onClick={()=>setDelInvConfirm(item)} aria-label={`Delete ${item.item}`} style={{padding:'4px 10px',background:'var(--danger-pale)',color:'var(--danger)',border:'1px solid var(--danger-border)',borderRadius:'var(--r-sm)',fontSize:11,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:4}}
                            onMouseEnter={e=>e.currentTarget.style.background='#fde0e0'}
                            onMouseLeave={e=>e.currentTarget.style.background='var(--danger-pale)'}>
                              <Trash2 size={10} aria-hidden="true"/>
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {checkoutItem&&(
        <Modal title={`Check Out — ${checkoutItem.id}`} onClose={()=>setCheckoutItem(null)} wide>
          <div style={{padding:'10px 14px',background:'var(--overlay)',borderRadius:'var(--r-md)',marginBottom:16}}>
            <div style={{fontSize:13,fontWeight:600,color:'var(--tp)'}}>{checkoutItem.item}</div>
            <div style={{fontSize:12,color:'var(--ts)',marginTop:3}}>Available: {checkoutItem.avail} · Unit Replacement Cost: {fmt(checkoutItem.unitCost)} · Condition: {checkoutItem.cond}</div>
          </div>
          <div className="g-2" style={{gap:14}}>
            <div>
              <Field label="Assign to Event" value={coForm.event} onChange={v=>setCoForm({...coForm,event:v})} options={[{value:'',label:'— Select Event —'},...events.filter(e=>e.stage!=='Done').map(e=>({value:e.id,label:`${e.id} — ${e.client}`}))]}/>
              <Field label="Quantity" type="number" value={coForm.qty} onChange={v=>setCoForm({...coForm,qty:Math.min(v,checkoutItem.avail)})} hint={`Max available: ${checkoutItem.avail}`}/>
              <Field label="Post-Use Condition" value={coForm.condAfter} onChange={v=>setCoForm({...coForm,condAfter:v})} options={['Good','Chipped','Damaged']}/>
            </div>
            <div>
              <Field label="Depreciation Rate (%)" type="number" value={coForm.deprRate} onChange={v=>setCoForm({...coForm,deprRate:v})} placeholder="e.g. 5" hint="Annual depreciation % applied per use cycle"/>
              <Field label="Next Inspection Date" type="date" value={coForm.nextInspect} onChange={v=>setCoForm({...coForm,nextInspect:v})}/>
              <Field label="Condition & Depreciation Notes" value={coForm.note} onChange={v=>setCoForm({...coForm,note:v})} placeholder="Wear observations, damage notes..." rows={2}/>
            </div>
          </div>
          {coForm.deprRate&&coForm.qty&&(
            <div style={{padding:'10px 14px',background:'var(--warn-pale)',border:'1px solid rgba(176,108,20,.22)',borderRadius:'var(--r-md)',marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:600,color:'var(--warn)',marginBottom:4}}>Depreciation Estimate</div>
              <div style={{fontSize:13,color:'var(--tp)'}}>
                {coForm.qty}× {checkoutItem.item} · {coForm.deprRate}% depreciation per cycle<br/>
                <span style={{fontFamily:"'DM Mono',monospace",fontWeight:600}}>Est. value reduction: {fmt(Math.round(checkoutItem.unitCost*coForm.qty*(coForm.deprRate/100)))}</span>
              </div>
            </div>
          )}
          <div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:8}}>
            <GhostBtn onClick={()=>setCheckoutItem(null)}>Cancel</GhostBtn>
            <GoldBtn onClick={doCheckout}>Confirm Check-Out <Check size={13}/></GoldBtn>
          </div>
        </Modal>
      )}

      {/* Add Inventory Item Modal */}
      {showAddInv&&(
        <Modal title="Add Inventory Item" onClose={()=>setShowAddInv(false)} wide
          footer={<>
            <GhostBtn onClick={()=>setShowAddInv(false)}>Cancel</GhostBtn>
            <GoldBtn onClick={addInvItem} disabled={!addInvForm.item?.trim()}><Plus size={13}/>Add to Inventory</GoldBtn>
          </>}
        >
          <div className="g-2" style={{gap:12,marginBottom:14}}>
            <div style={{gridColumn:'1/-1'}}>
              <label style={{fontSize:11,fontWeight:600,color:'var(--ts)',letterSpacing:'.05em',display:'block',marginBottom:5,textTransform:'uppercase'}}>Item Name</label>
              <input className="edit-field" value={addInvForm.item||''} onChange={e=>aef('item',e.target.value)} placeholder="e.g. Chiavari Chair"/>
            </div>
            <div>
              <label style={{fontSize:11,fontWeight:600,color:'var(--ts)',letterSpacing:'.05em',display:'block',marginBottom:5,textTransform:'uppercase'}}>Category</label>
              <select className="edit-field" value={addInvForm.cat||'Decor'} onChange={e=>aef('cat',e.target.value)}>
                {['Decor','Lighting','Furniture','AV','Linen','Floral','Tableware','Other'].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{fontSize:11,fontWeight:600,color:'var(--ts)',letterSpacing:'.05em',display:'block',marginBottom:5,textTransform:'uppercase'}}>Condition</label>
              <select className="edit-field" value={addInvForm.cond||'Good'} onChange={e=>aef('cond',e.target.value)}>
                {['Good','Chipped','Damaged'].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{fontSize:11,fontWeight:600,color:'var(--ts)',letterSpacing:'.05em',display:'block',marginBottom:5,textTransform:'uppercase'}}>Total Qty</label>
              <input type="number" className="edit-field" value={addInvForm.qty||''} onChange={e=>aef('qty',Number(e.target.value))} placeholder="0"/>
            </div>
            <div>
              <label style={{fontSize:11,fontWeight:600,color:'var(--ts)',letterSpacing:'.05em',display:'block',marginBottom:5,textTransform:'uppercase'}}>Available Qty</label>
              <input type="number" className="edit-field" value={addInvForm.avail||''} onChange={e=>aef('avail',Number(e.target.value))} placeholder="0"/>
            </div>
            <div>
              <label style={{fontSize:11,fontWeight:600,color:'var(--ts)',letterSpacing:'.05em',display:'block',marginBottom:5,textTransform:'uppercase'}}>Unit Cost (₱)</label>
              <input type="number" className="edit-field" value={addInvForm.unitCost||''} onChange={e=>aef('unitCost',Number(e.target.value))} placeholder="0"/>
            </div>
            <div>
              <label style={{fontSize:11,fontWeight:600,color:'var(--ts)',letterSpacing:'.05em',display:'block',marginBottom:5,textTransform:'uppercase'}}>Storage Location</label>
              <input className="edit-field" value={addInvForm.loc||''} onChange={e=>aef('loc',e.target.value)} placeholder="e.g. Rack A-3"/>
            </div>
          </div>
          {!addInvForm.item?.trim()&&<div style={{fontSize:12,color:'var(--danger)',marginBottom:10,display:'flex',alignItems:'center',gap:5}}><AlertCircle size={12}/>Item name is required.</div>}
        </Modal>
      )}

      {/* Delete Inventory Confirm Modal */}
      {delInvConfirm&&(
        <Modal title="Remove Inventory Item?" onClose={()=>setDelInvConfirm(null)}>
          <div style={{padding:'14px 16px',background:'var(--danger-pale)',border:'1px solid var(--danger-border)',borderRadius:'var(--r-md)',marginBottom:18}}>
            <div style={{fontSize:13,fontWeight:600,color:'var(--danger)',marginBottom:4}}>{delInvConfirm.item} — {delInvConfirm.id}</div>
            <div style={{fontSize:12,color:'var(--ts)'}}>This will permanently remove this item from the warehouse inventory.</div>
          </div>
          <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
            <GhostBtn onClick={()=>setDelInvConfirm(null)}>Cancel</GhostBtn>
            <GhostBtn danger onClick={()=>deleteInvItem(delInvConfirm)}><Trash2 size={13}/>Remove Item</GhostBtn>
          </div>
        </Modal>
      )}

      {/* v2.2 — Warehouse Item Photo Attach Modal */}
      {photoModalItem&&(
        <TaskPhotoModal
          itemLabel={`${photoModalItem.id} — ${photoModalItem.item}`}
          existingPhotoUrl={photoModalItem.photoUrl||null}
          onAttach={(url)=>{attachPhotoToInvItem(photoModalItem.id,url);setPhotoModalItem(null);}}
          onClose={()=>setPhotoModalItem(null)}
        />
      )}

      {/* v2.2 — Full-screen Photo Lightbox */}
      {lightboxUrl&&(
        <PhotoLightbox
          src={lightboxUrl}
          caption="Warehouse Item Reference Photo"
          onClose={()=>setLightboxUrl(null)}
        />
      )}
    </div>
  );
};

/* ReceiptUploadModal — reads a file from disk and shows a preview.
   Accepts images (JPG/PNG/GIF/WEBP) and PDFs.
   The file is converted to a base64 data-URL so it persists in
   useSyncedState (Supabase app_settings) and appears in every browser. */
const ReceiptUploadModal = ({supplier, existing, onClose, onSave}) => {
  const [preview, setPreview] = useState(existing||null); // data-URL or null
  const [fileType, setFileType] = useState(existing?.startsWith('data:application/pdf')?'pdf': existing?'image':null);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if(!file) return;
    if(file.size > 10*1024*1024){ setError('File exceeds 10 MB limit. Please choose a smaller file.'); return; }
    const allowed = ['image/jpeg','image/png','image/gif','image/webp','application/pdf'];
    if(!allowed.includes(file.type)){ setError('Only PDF, JPG, PNG, GIF, WEBP files are accepted.'); return; }
    setError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      setFileType(file.type === 'application/pdf' ? 'pdf' : 'image');
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (e) => {
    e.preventDefault(); setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <Modal title={`Upload Receipt — ${supplier.name}`} onClose={onClose}>
      {/* Drop zone */}
      <div
        onDragOver={e=>{e.preventDefault();setDragging(true);}}
        onDragLeave={()=>setDragging(false)}
        onDrop={onDrop}
        onClick={()=>inputRef.current?.click()}
        style={{border:`2px dashed ${dragging?'var(--gold)':'var(--border)'}`,borderRadius:'var(--r-lg)',padding:'28px 20px',textAlign:'center',cursor:'pointer',background:dragging?'var(--gold-faint)':'var(--overlay)',transition:'all var(--t-base)',marginBottom:12}}
      >
        <Upload size={24} color='var(--gold)' style={{margin:'0 auto 10px'}}/>
        <div style={{fontSize:13,fontWeight:500,color:'var(--tp)'}}>{preview?'Click or drop to replace':'Click or drop to upload'}</div>
        <div style={{fontSize:11,color:'var(--tm)',marginTop:4}}>PDF, JPG, PNG · Max 10 MB</div>
        <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.gif,.webp" style={{display:'none'}}
          onChange={e=>handleFile(e.target.files[0])}/>
      </div>

      {/* Error */}
      {error&&<div style={{fontSize:12,color:'var(--danger)',marginBottom:10,padding:'8px 12px',background:'var(--danger-pale)',borderRadius:'var(--r-sm)'}}>{error}</div>}

      {/* Preview */}
      {preview&&(
        <div style={{marginBottom:14,borderRadius:'var(--r-md)',overflow:'hidden',border:'1px solid var(--border)',maxHeight:340,display:'flex',alignItems:'center',justifyContent:'center',background:'#000'}}>
          {fileType==='pdf'
            ? <embed src={preview} type="application/pdf" width="100%" height="320px" style={{display:'block'}}/>
            : <img src={preview} alt="Receipt preview" style={{maxWidth:'100%',maxHeight:320,objectFit:'contain',display:'block'}}/>
          }
        </div>
      )}

      {/* Actions */}
      <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
        <GhostBtn onClick={onClose}>Cancel</GhostBtn>
        <GoldBtn onClick={()=>{if(preview) onSave(preview);}} style={{opacity:preview?1:.5,pointerEvents:preview?'auto':'none'}}>
          <Upload size={13}/>{existing?'Replace Receipt':'Save Receipt'}
        </GoldBtn>
      </div>
    </Modal>
  );
};

/* ══════════════════════════════════════════════════════
   MODULE 6 — SUPPLIER HUB (FULL INLINE EDIT)
══════════════════════════════════════════════════════ */
const SupplierView = ({role,addLog})=>{
  if(!ACCESS[role].includes('supplier')) return <RoleBlock module="Supplier Hub" role={role}/>;
  const [sups,setSups]=useSyncedState('metro_sups',SUPPLIERS_INIT);
  const [editSup,setEditSup]=useState(null);
  const [editForm,setEditForm]=useState({});
  const [upload,setUpload]=useState(null);
  // metro_receipts synced so receipt uploads are visible across all browsers/tabs.
  // Values are base64 data-URLs so previews render without a separate storage fetch.
  const [receipts,setReceipts]=useSyncedState('metro_receipts',{});
  const [showAddSup,setShowAddSup]=useState(false);
  const [addSupForm,setAddSupForm]=useState({});
  const [delSupConfirm,setDelSupConfirm]=useState(null);
  const canAdmin = role==='admin';
  const blankSupplier={name:'',contact:'',phone:'',cat:'',deliveryWindow:'',contract:'Pending',dp:0,outstanding:0,lastOrder:''};

  const totalOut=sups.reduce((s,v)=>s+v.outstanding,0);
  const totalDP=sups.reduce((s,v)=>s+v.dp,0);

  const startEdit=(s)=>{setEditSup(s.id);setEditForm({...s});};
  const cancelEdit=()=>setEditSup(null);
  const saveEdit=()=>{
    setSups(prev=>prev.map(s=>s.id===editForm.id?{...editForm}:s));
    setEditSup(null);
  };
  const ef=(k,v)=>setEditForm(p=>({...p,[k]:v}));
  const aef=(k,v)=>setAddSupForm(p=>({...p,[k]:v}));

  const addSupplier=()=>{
    if(!addSupForm.name?.trim()) return;
    const newId='SUP-'+String(sups.length+1).padStart(2,'0');
    setSups(prev=>[...prev,{...blankSupplier,...addSupForm,id:newId}]);
    addLog&&addLog(`Added supplier ${addSupForm.name}`,newId,'info');
    setShowAddSup(false);
  };

  const deleteSupplier=(s)=>{
    setSups(prev=>prev.filter(x=>x.id!==s.id));
    addLog&&addLog(`Deleted supplier ${s.name}`,s.id,'warn');
    setDelSupConfirm(null);
  };

  return(
    <div className="fade-up">
      <SectionHead title="Supplier Hub" sub="Full edit access: payments, contract status, delivery windows, and balance tracking."
        action={canAdmin&&<GoldBtn onClick={()=>{setAddSupForm({...blankSupplier});setShowAddSup(true);}}><Plus size={13}/>Add Supplier</GoldBtn>}
      />
      <div style={{display:'flex',gap:14,flexWrap:'wrap',marginBottom:20}}>
        <StatCard label="Total Suppliers" value={sups.length} icon={Building} color="blue"/>
        <StatCard label="Total DP Released" value={fmt(totalDP)} icon={DollarSign} color="green"/>
        <StatCard label="Outstanding Balance" value={fmt(totalOut)} icon={AlertCircle} color="red"/>
        <StatCard label="Contracts Pending" value={sups.filter(s=>s.contract==='Pending').length} icon={FileText} color="orange"/>
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        {sups.map(s=>{
          const isEditing=editSup===s.id;
          return(
            <div key={s.id} style={{background:'var(--surface)',border:`1.5px solid ${isEditing?'var(--gold)':'var(--border)'}`,borderRadius:'var(--r-lg)',padding:'18px 22px',boxShadow:isEditing?'var(--sh-md)':'var(--sh-sm)',transition:'all var(--t-base)'}}>
              {isEditing?(
                /* EDIT MODE */
                <div>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:18}}>
                    <PenLine size={14} color='var(--gold)'/>
                    <span style={{fontSize:13,fontWeight:600,color:'var(--gold)'}}>Editing — {s.name}</span>
                    <span style={{marginLeft:'auto',fontSize:11,color:'var(--tm)'}}>All changes saved to live record</span>
                  </div>
                  <div className="g-3" style={{gap:14,marginBottom:14}}>
                    <div>
                      <label style={{fontSize:10,fontWeight:600,color:'var(--ts)',textTransform:'uppercase',letterSpacing:'.08em',display:'block',marginBottom:5}}>Supplier Name</label>
                      <input className="edit-field" value={editForm.name} onChange={e=>ef('name',e.target.value)}/>
                    </div>
                    <div>
                      <label style={{fontSize:10,fontWeight:600,color:'var(--ts)',textTransform:'uppercase',letterSpacing:'.08em',display:'block',marginBottom:5}}>Contact Person</label>
                      <input className="edit-field" value={editForm.contact} onChange={e=>ef('contact',e.target.value)}/>
                    </div>
                    <div>
                      <label style={{fontSize:10,fontWeight:600,color:'var(--ts)',textTransform:'uppercase',letterSpacing:'.08em',display:'block',marginBottom:5}}>Phone</label>
                      <input className="edit-field" value={editForm.phone} onChange={e=>ef('phone',e.target.value)}/>
                    </div>
                    <div>
                      <label style={{fontSize:10,fontWeight:600,color:'var(--ts)',textTransform:'uppercase',letterSpacing:'.08em',display:'block',marginBottom:5}}>Category</label>
                      <input className="edit-field" value={editForm.cat} onChange={e=>ef('cat',e.target.value)}/>
                    </div>
                    <div>
                      <label style={{fontSize:10,fontWeight:600,color:'var(--ts)',textTransform:'uppercase',letterSpacing:'.08em',display:'block',marginBottom:5}}>Delivery Window</label>
                      <input className="edit-field" value={editForm.deliveryWindow} onChange={e=>ef('deliveryWindow',e.target.value)} placeholder="e.g. 3 days prior"/>
                    </div>
                    <div>
                      <label style={{fontSize:10,fontWeight:600,color:'var(--ts)',textTransform:'uppercase',letterSpacing:'.08em',display:'block',marginBottom:5}}>Contract Status</label>
                      <div style={{display:'flex',gap:8,marginTop:2}}>
                        {['Signed','Pending'].map(v=>(
                          <button key={v} onClick={()=>ef('contract',v)} style={{flex:1,padding:'8px 10px',border:`1.5px solid ${editForm.contract===v?(v==='Signed'?'var(--success)':'var(--warn)'):'var(--border)'}`,borderRadius:'var(--r-sm)',background:editForm.contract===v?(v==='Signed'?'var(--success-pale)':'var(--warn-pale)'):'transparent',color:editForm.contract===v?(v==='Signed'?'var(--success)':'var(--warn)'):'var(--ts)',fontSize:11,fontWeight:600,cursor:'pointer'}}>
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="g-2" style={{gap:14,padding:'14px 16px',background:'var(--navy-faint)',border:'1px solid var(--border)',borderRadius:'var(--r-md)',marginBottom:14}}>
                    <div>
                      <label style={{fontSize:10,fontWeight:600,color:'var(--gold)',textTransform:'uppercase',letterSpacing:'.08em',display:'block',marginBottom:5}}>Downpayment Milestone (₱)</label>
                      <input type="number" className="edit-field" value={editForm.dp} onChange={e=>ef('dp',Number(e.target.value))}/>
                      <div style={{fontSize:11,color:'var(--tm)',marginTop:4}}>Current: {fmt(s.dp)}</div>
                    </div>
                    <div>
                      <label style={{fontSize:10,fontWeight:600,color:'var(--danger)',textTransform:'uppercase',letterSpacing:'.08em',display:'block',marginBottom:5}}>Outstanding Balance (₱)</label>
                      <input type="number" className="edit-field" value={editForm.outstanding} onChange={e=>ef('outstanding',Number(e.target.value))}/>
                      <div style={{fontSize:11,color:'var(--tm)',marginTop:4}}>
                        {editForm.outstanding!==s.outstanding&&<span style={{color:'var(--warn)'}}>Δ {editForm.outstanding>s.outstanding?'+':''}{fmt(editForm.outstanding-s.outstanding)} from current</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
                    <GhostBtn onClick={cancelEdit}>Discard</GhostBtn>
                    <GoldBtn onClick={saveEdit}><Save size={13}/>Save Supplier Record</GoldBtn>
                  </div>
                </div>
              ):(
                /* VIEW MODE */
                <div style={{display:'flex',gap:18,alignItems:'center',flexWrap:'wrap'}}>
                  <div style={{flex:'1 1 200px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:6}}>
                      <div style={{width:34,height:34,background:'var(--navy)',borderRadius:'var(--r-md)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                        <Building size={14} color='rgba(184,146,74,.8)'/>
                      </div>
                      <div>
                        <div style={{fontSize:14,fontWeight:600,color:'var(--tp)'}}>{s.name}</div>
                        <div style={{fontSize:11,color:'var(--ts)'}}>{s.contact} · {s.phone}</div>
                      </div>
                    </div>
                    <div style={{display:'flex',gap:6,flexWrap:'wrap',alignItems:'center'}}>
                      <Badge label={s.cat} color="blue"/>
                      <Badge label={s.contract==='Signed'?'Contract Signed':'Contract Pending'} color={s.contract==='Signed'?'green':'orange'} dot/>
                      {s.deliveryWindow&&<Badge label={`Delivery: ${s.deliveryWindow}`} color="grey"/>}
                    </div>
                  </div>
                  <div style={{display:'flex',gap:20,flexWrap:'wrap'}}>
                    {[['Downpayment',fmt(s.dp),'green'],['Outstanding',fmt(s.outstanding),s.outstanding>0?'red':'green'],['Last Order',s.lastOrder,'blue']].map(([l,v,c])=>(
                      <div key={l} style={{textAlign:'center'}}>
                        <div style={{fontSize:10,fontWeight:600,color:'var(--ts)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:4}}>{l}</div>
                        <div style={{fontSize:14,fontWeight:700,color:c==='red'?'var(--danger)':c==='green'&&v!=='₱0'?'var(--success)':'var(--tp)',fontFamily:"'DM Mono',monospace"}}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{display:'flex',gap:8,flexShrink:0}}>
                    <button onClick={()=>startEdit(s)} aria-label={`Edit ${s.name} record`} style={{padding:'6px 12px',background:'var(--gold-pale)',color:'var(--gold)',border:`1px solid var(--gold-border-hair)`,borderRadius:'var(--r-sm)',fontSize:11,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:5}}
                    onMouseEnter={e=>e.currentTarget.style.background='var(--gold-faint)'}
                    onMouseLeave={e=>e.currentTarget.style.background='var(--gold-pale)'}>
                      <Edit2 size={11} aria-hidden="true"/> Edit Record
                    </button>
                    <button onClick={()=>setUpload(s)} style={{padding:'6px 12px',background:'var(--info-pale)',color:'var(--info)',border:'1px solid rgba(42,94,168,.24)',borderRadius:'var(--r-sm)',fontSize:11,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:5}}
                    onMouseEnter={e=>e.currentTarget.style.background='#dde9f8'}
                    onMouseLeave={e=>e.currentTarget.style.background='var(--info-pale)'}>
                      <Upload size={11}/> Receipt
                    </button>
                    {receipts[s.id]&&(
                      receipts[s.id].startsWith('data:image')
                        ? <img src={receipts[s.id]} alt="Receipt" title="Receipt uploaded — click Receipt to view"
                            style={{width:28,height:28,objectFit:'cover',borderRadius:'var(--r-xs)',border:'1.5px solid var(--success)',cursor:'pointer'}}
                            onClick={()=>setUpload(s)}/>
                        : <Badge label="Receipt Uploaded" color="green" dot/>
                    )}
                    {canAdmin&&(
                      <button onClick={()=>setDelSupConfirm(s)} aria-label={`Delete ${s.name}`} style={{padding:'6px 12px',background:'var(--danger-pale)',color:'var(--danger)',border:'1px solid var(--danger-border)',borderRadius:'var(--r-sm)',fontSize:11,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:5}}
                      onMouseEnter={e=>e.currentTarget.style.background='#fde0e0'}
                      onMouseLeave={e=>e.currentTarget.style.background='var(--danger-pale)'}>
                        <Trash2 size={11}/> Delete
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {upload&&(
        <ReceiptUploadModal
          supplier={upload}
          existing={receipts[upload.id]}
          onClose={()=>setUpload(null)}
          onSave={(dataUrl)=>{setReceipts(p=>({...p,[upload.id]:dataUrl}));setUpload(null);}}
        />
      )}

      {/* Add Supplier Modal */}
      {showAddSup&&(
        <Modal title="Add New Supplier" onClose={()=>setShowAddSup(false)} wide>
          <div className="g-3" style={{gap:12,marginBottom:14}}>
            {[
              {label:'Supplier Name',key:'name',placeholder:'e.g. Bloom & Petal Florals'},
              {label:'Contact Person',key:'contact',placeholder:'e.g. Maria Santos'},
              {label:'Phone',key:'phone',placeholder:'09XXXXXXXXX'},
              {label:'Category',key:'cat',placeholder:'e.g. Florals, Catering, AV'},
              {label:'Delivery Window',key:'deliveryWindow',placeholder:'e.g. 3 days prior'},
              {label:'Last Order Date',key:'lastOrder',placeholder:'YYYY-MM-DD'},
            ].map(({label,key,placeholder})=>(
              <div key={key}>
                <label style={{fontSize:11,fontWeight:600,color:'var(--ts)',letterSpacing:'.05em',display:'block',marginBottom:5,textTransform:'uppercase'}}>{label}</label>
                <input className="edit-field" value={addSupForm[key]||''} onChange={e=>aef(key,e.target.value)} placeholder={placeholder}/>
              </div>
            ))}
          </div>
          <div style={{marginBottom:14}}>
            <label style={{fontSize:11,fontWeight:600,color:'var(--ts)',letterSpacing:'.05em',display:'block',marginBottom:6,textTransform:'uppercase'}}>Contract Status</label>
            <div style={{display:'flex',gap:8}}>
              {['Signed','Pending'].map(v=>(
                <button key={v} onClick={()=>aef('contract',v)} style={{flex:1,padding:'8px',border:`1.5px solid ${addSupForm.contract===v?(v==='Signed'?'var(--success)':'var(--warn)'):'var(--border)'}`,borderRadius:'var(--r-sm)',background:addSupForm.contract===v?(v==='Signed'?'var(--success-pale)':'var(--warn-pale)'):'transparent',color:addSupForm.contract===v?(v==='Signed'?'var(--success)':'var(--warn)'):'var(--ts)',fontSize:12,fontWeight:600,cursor:'pointer'}}>
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div className="g-2" style={{gap:12,padding:'14px 16px',background:'var(--navy-faint)',border:'1px solid var(--border)',borderRadius:'var(--r-md)',marginBottom:18}}>
            <div>
              <label style={{fontSize:11,fontWeight:600,color:'var(--gold)',letterSpacing:'.05em',display:'block',marginBottom:5,textTransform:'uppercase'}}>Downpayment (₱)</label>
              <input type="number" className="edit-field" value={addSupForm.dp||''} onChange={e=>aef('dp',Number(e.target.value))} placeholder="0"/>
            </div>
            <div>
              <label style={{fontSize:11,fontWeight:600,color:'var(--danger)',letterSpacing:'.05em',display:'block',marginBottom:5,textTransform:'uppercase'}}>Outstanding Balance (₱)</label>
              <input type="number" className="edit-field" value={addSupForm.outstanding||''} onChange={e=>aef('outstanding',Number(e.target.value))} placeholder="0"/>
            </div>
          </div>
          {!addSupForm.name?.trim()&&<div style={{fontSize:12,color:'var(--danger)',marginBottom:10,display:'flex',alignItems:'center',gap:5}}><AlertCircle size={12}/>Supplier name is required.</div>}
          <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
            <GhostBtn onClick={()=>setShowAddSup(false)}>Cancel</GhostBtn>
            <GoldBtn onClick={addSupplier} disabled={!addSupForm.name?.trim()}><Plus size={13}/>Add Supplier</GoldBtn>
          </div>
        </Modal>
      )}

      {/* Delete Supplier Confirm Modal */}
      {delSupConfirm&&(
        <Modal title="Delete Supplier?" onClose={()=>setDelSupConfirm(null)}>
          <div style={{padding:'14px 16px',background:'var(--danger-pale)',border:'1px solid var(--danger-border)',borderRadius:'var(--r-md)',marginBottom:18}}>
            <div style={{fontSize:13,fontWeight:600,color:'var(--danger)',marginBottom:4}}>{delSupConfirm.name} — {delSupConfirm.id}</div>
            <div style={{fontSize:12,color:'var(--ts)'}}>This will permanently remove this supplier record and all associated data.</div>
          </div>
          <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
            <GhostBtn onClick={()=>setDelSupConfirm(null)}>Cancel</GhostBtn>
            <GhostBtn danger onClick={()=>deleteSupplier(delSupConfirm)}><Trash2 size={13}/>Delete Supplier</GhostBtn>
          </div>
        </Modal>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   MODULE 7 — QUOTATION & MARGINS (FULLY EDITABLE)
══════════════════════════════════════════════════════ */
const BASE_PKGS_INIT = [
  {id:'classic',name:'Classic Prestige',base:120000,margin:.35},
  {id:'elegant',name:'Elegant Debut',base:160000,margin:.38},
  {id:'grand',name:'Grand Luxe',base:260000,margin:.40},
  {id:'corporate',name:'Corporate Elite',base:380000,margin:.42},
];
const ADDONS_INIT = [
  {id:'photo',label:'Photo & Video Package',price:35000},
  {id:'photobooth',label:'Photobooth Station',price:15000},
  {id:'fog',label:'Cold Fog Machine',price:8000},
  {id:'fireworks',label:'Indoor Confetti Cannons',price:12000},
  {id:'neon',label:'Custom Neon Signage',price:18000},
  {id:'catering',label:'Premium Catering Upgrade',price:55000},
  {id:'valet',label:'Valet Parking Service',price:20000},
];

const QuotationView = ({role})=>{
  if(!ACCESS[role].includes('quotation')) return <RoleBlock module="Quotation & Margins" role={role}/>;
  const canOverride = role==='admin';
  const [pkgs,setPkgs]=useSyncedState('metro_pkgs',BASE_PKGS_INIT);
  const [addonsLib,setAddonsLib]=useSyncedState('metro_addons',ADDONS_INIT);
  const [selectedPkg,setSelectedPkg]=useState('grand');
  const [selectedAddons,setSelectedAddons]=useState([]);
  // metro_discounts synced so discount toggles/edits made in one browser
  // are immediately reflected in every other open browser/tab.
  const [discounts,setDiscounts]=useSyncedState('metro_discounts',[
    {key:'earlybird',label:'Early Bird Discount',sub:'Booked 90+ days ahead',type:'percent',value:10,active:false},
    {key:'referral',label:'Referral Discount',sub:'Referred by existing client',type:'percent',value:5,active:false},
    {key:'bundle',label:'Multi-Event Bundle',sub:'2+ events same year',type:'percent',value:8,active:false},
  ]);
  const [editRates,setEditRates]=useState(false);
  const [editingAddon,setEditingAddon]=useState(null);
  const [editAddonPrice,setEditAddonPrice]=useState('');
  const [editPkgId,setEditPkgId]=useState(null);
  const [editPkgForm,setEditPkgForm]=useState({});
  const [showAddPkg,setShowAddPkg]=useState(false);
  const [newPkgForm,setNewPkgForm]=useState({name:'',base:0,margin:0.35});
  const [deletePkgId,setDeletePkgId]=useState(null);

  const selPkg=pkgs.find(p=>p.id===selectedPkg);
  const addonTotal=addonsLib.filter(a=>selectedAddons.includes(a.id)).reduce((s,a)=>s+a.price,0);
  const subtotal=selPkg.base+addonTotal;
  const disc=discounts.reduce((s,d)=>s+(d.active?(d.type==='percent'?d.value/100:d.value/subtotal):0),0);
  const discAmt=discounts.reduce((s,d)=>{
    if(!d.active) return s;
    return s+(d.type==='percent'?Math.round(subtotal*(d.value/100)):d.value);
  },0);
  const total=subtotal-discAmt;
  const cost=Math.round(total*(1-selPkg.margin));
  const grossProfit=total-cost;
  const gpPct=Math.round((grossProfit/total)*100);

  const toggleAddon=id=>setSelectedAddons(p=>p.includes(id)?p.filter(a=>a!==id):[...p,id]);
  const toggleDiscount=key=>setDiscounts(p=>p.map(d=>d.key===key?{...d,active:!d.active}:d));
  const setDiscountType=(key,type)=>setDiscounts(p=>p.map(d=>d.key===key?{...d,type}:d));
  const setDiscountValue=(key,value)=>setDiscounts(p=>p.map(d=>d.key===key?{...d,value:Number(value)}:d));
  // Editable label/sub per discount row
  const setDiscountLabel=(key,label)=>setDiscounts(p=>p.map(d=>d.key===key?{...d,label}:d));
  const setDiscountSub=(key,sub)=>setDiscounts(p=>p.map(d=>d.key===key?{...d,sub}:d));
  // Add / delete discounts (admin only)
  const [showAddDiscount,setShowAddDiscount]=useState(false);
  const [newDiscount,setNewDiscount]=useState({label:'',sub:'',type:'percent',value:0});
  const addDiscount=()=>{
    if(!newDiscount.label.trim()) return;
    const key='disc-'+Date.now();
    setDiscounts(p=>[...p,{key,label:newDiscount.label.trim(),sub:newDiscount.sub.trim(),type:newDiscount.type,value:Number(newDiscount.value)||0,active:false}]);
    setNewDiscount({label:'',sub:'',type:'percent',value:0});
    setShowAddDiscount(false);
  };
  const deleteDiscount=key=>setDiscounts(p=>p.filter(d=>d.key!==key));

  const startEditPkg=(p)=>{setEditPkgId(p.id);setEditPkgForm({...p});};
  const saveEditPkg=()=>{setPkgs(prev=>prev.map(p=>p.id===editPkgId?{...editPkgForm,margin:Number(editPkgForm.margin)}:p));setEditPkgId(null);};
  const saveAddonPrice=()=>{setAddonsLib(prev=>prev.map(a=>a.id===editingAddon?{...a,price:Number(editAddonPrice)}:a));setEditingAddon(null);};
  const addPkg=()=>{
    if(!newPkgForm.name.trim()) return;
    const id='pkg-'+Date.now();
    setPkgs(prev=>[...prev,{id,name:newPkgForm.name.trim(),base:Number(newPkgForm.base)||0,margin:Number(newPkgForm.margin)||0.35}]);
    setNewPkgForm({name:'',base:0,margin:0.35});
    setShowAddPkg(false);
  };
  const confirmDeletePkg=(id)=>setDeletePkgId(id);
  const deletePkg=()=>{
    setPkgs(prev=>prev.filter(p=>p.id!==deletePkgId));
    if(selectedPkg===deletePkgId) setSelectedPkg(pkgs.find(p=>p.id!==deletePkgId)?.id||'');
    setDeletePkgId(null);
  };

  const generateProposal=()=>{
    const today=new Date().toLocaleDateString('en-PH',{year:'numeric',month:'long',day:'numeric'});
    const refNo='PROP-'+Date.now().toString(36).toUpperCase();
    const activeAddons=addonsLib.filter(a=>selectedAddons.includes(a.id));
    const activeDiscounts=discounts.filter(d=>d.active);
    const fmtPHP=n=>'&#x20B1;'+Number(n).toLocaleString('en-PH');
    const marginColor=gpPct>=35&&gpPct<=50?'#b8924a':gpPct<35?'#e53e3e':'#38a169';

    const addonRows=activeAddons.length>0
      ? activeAddons.map(a=>`
          <tr>
            <td style="padding:10px 14px;border-bottom:1px solid #f0ede8;color:#555;">${a.label}</td>
            <td style="padding:10px 14px;border-bottom:1px solid #f0ede8;text-align:right;font-family:'Courier New',monospace;color:#2d2a24;">${fmtPHP(a.price)}</td>
          </tr>`).join('')
      : `<tr><td colspan="2" style="padding:10px 14px;border-bottom:1px solid #f0ede8;color:#aaa;font-style:italic;">No add-ons selected</td></tr>`;

    const discountRows=activeDiscounts.length>0
      ? activeDiscounts.map(d=>`
          <div class="total-row disc">
            <span>${d.label}${d.sub?` <span style="font-size:11px;color:#888">(${d.sub})</span>`:''}</span>
            <span style="font-family:'Courier New',monospace">-${d.type==='percent'?`${d.value}% (${fmtPHP(Math.round(subtotal*(d.value/100)))})`:`${fmtPHP(d.value)}`}</span>
          </div>`).join('')
      : '';

    const html=`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Metro Events Proposal ${refNo}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Georgia',serif;background:#fdfaf6;color:#2d2a24;font-size:14px;line-height:1.7}
    @page{margin:20mm 18mm}
    @media print{body{background:#fff}.no-print{display:none!important}}
    .wrap{max-width:780px;margin:0 auto;padding:40px 32px}
    .header{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:28px;border-bottom:3px solid #b8924a;margin-bottom:32px}
    .brand-name{font-size:26px;font-weight:700;letter-spacing:.06em;color:#1a1714}
    .brand-tag{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#b8924a;font-family:Arial,sans-serif;margin-top:4px}
    .meta{text-align:right;font-size:12px;color:#888;line-height:1.9;font-family:Arial,sans-serif}
    .meta strong{color:#2d2a24;font-size:13px}
    .section-title{font-size:10px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#b8924a;margin-bottom:14px;font-family:Arial,sans-serif}
    .pkg-box{background:#1a1714;border-radius:8px;padding:22px 26px;margin-bottom:28px;display:flex;justify-content:space-between;align-items:center}
    .pkg-name{font-size:20px;font-weight:600;color:#f8f4ed}
    .pkg-price{font-size:24px;font-weight:700;color:#b8924a;font-family:'Courier New',monospace}
    .pkg-sub{font-size:11px;color:#9a8c7c;margin-top:4px;font-family:Arial,sans-serif}
    table{width:100%;border-collapse:collapse;margin-bottom:28px}
    thead tr{background:#1a1714}
    thead th{padding:11px 14px;text-align:left;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#b8924a;font-family:Arial,sans-serif}
    thead th:last-child{text-align:right}
    .totals-box{background:#f8f4ed;border-radius:8px;padding:22px 26px;margin-bottom:28px}
    .total-row{display:flex;justify-content:space-between;padding:6px 0;font-size:13px;font-family:Arial,sans-serif}
    .total-row.sub{color:#777;border-bottom:1px solid #e8e2d8}
    .total-row.disc{color:#38a169}
    .total-row.grand{font-size:20px;font-weight:700;color:#1a1714;padding-top:14px;margin-top:8px;border-top:2px solid #b8924a}
    .total-row.grand span:last-child{color:#b8924a;font-family:'Courier New',monospace}
    .margin-box{background:#1a1714;border-radius:8px;padding:22px 26px;margin-bottom:28px}
    .m-title{font-size:10px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#b8924a;margin-bottom:14px;font-family:Arial,sans-serif}
    .m-row{display:flex;justify-content:space-between;padding:5px 0;font-size:13px;font-family:Arial,sans-serif;color:#b8bfcc}
    .m-row span:last-child{font-family:'Courier New',monospace;font-weight:600}
    .prog-bg{background:rgba(255,255,255,.1);border-radius:99px;height:7px;margin-top:14px;overflow:hidden}
    .prog-fill{height:100%;border-radius:99px;background:${marginColor};width:${Math.min(gpPct,100)}%}
    .m-note{font-size:11px;margin-top:8px;font-family:Arial,sans-serif;color:${gpPct<35?'#fc8181':'#68d391'}}
    .validity{background:#fffbf0;border:1px solid #e8d9aa;border-radius:6px;padding:12px 16px;margin-bottom:28px;font-size:12px;color:#7a6630;font-family:Arial,sans-serif}
    .validity strong{color:#b8924a}
    .footer{border-top:1px solid #e8e2d8;padding-top:22px;font-size:11px;color:#aaa;text-align:center;line-height:1.9;font-family:Arial,sans-serif}
    .print-btn{position:fixed;bottom:28px;right:28px;padding:13px 24px;background:#b8924a;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;box-shadow:0 4px 18px rgba(184,146,74,.4);font-family:Arial,sans-serif}
    .print-btn:hover{background:#a07c3c}
  </style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <div>
      <div class="brand-name">Metro Events</div>
      <div class="brand-tag">Premium Event Management</div>
    </div>
    <div class="meta">
      <strong>Event Proposal</strong><br/>
      Ref: ${refNo}<br/>
      Date: ${today}<br/>
      Valid: <strong>30 days</strong>
    </div>
  </div>

  <div class="validity">
    <strong>Proposal Validity:</strong> This quotation is valid for 30 days from the date of issuance.
    To confirm your booking, a 50% downpayment is required upon acceptance.
  </div>

  <div class="section-title">Selected Package</div>
  <div class="pkg-box">
    <div>
      <div class="pkg-name">${selPkg.name}</div>
      <div class="pkg-sub">Base event package</div>
    </div>
    <div style="text-align:right">
      <div class="pkg-price">${fmtPHP(selPkg.base)}</div>
    </div>
  </div>

  <div class="section-title">Add-On Services</div>
  <table>
    <thead><tr><th>Service</th><th style="text-align:right">Price</th></tr></thead>
    <tbody>
      ${addonRows}
      <tr style="background:#f8f4ed">
        <td style="padding:10px 14px;font-weight:700;color:#2d2a24;font-family:Arial,sans-serif">Add-ons Subtotal</td>
        <td style="padding:10px 14px;text-align:right;font-weight:700;font-family:'Courier New',monospace;color:#2d2a24">${fmtPHP(addonTotal)}</td>
      </tr>
    </tbody>
  </table>

  <div class="section-title">Pricing Summary</div>
  <div class="totals-box">
    <div class="total-row sub"><span>Base Package</span><span style="font-family:'Courier New',monospace">${fmtPHP(selPkg.base)}</span></div>
    <div class="total-row sub"><span>Add-ons Total</span><span style="font-family:'Courier New',monospace">${fmtPHP(addonTotal)}</span></div>
    <div class="total-row sub" style="font-weight:600;color:#2d2a24;padding:10px 0"><span>Subtotal</span><span style="font-family:'Courier New',monospace">${fmtPHP(subtotal)}</span></div>
    ${discountRows}
    <div class="total-row grand"><span>Total Amount Due</span><span>${fmtPHP(total)}</span></div>
  </div>

  <div class="section-title">Internal Margin Analysis</div>
  <div class="margin-box">
    <div class="m-title">Confidential — Internal Use Only</div>
    <div class="m-row"><span>Estimated Cost</span><span style="color:#ccc">${fmtPHP(cost)}</span></div>
    <div class="m-row"><span>Gross Profit</span><span style="color:#ccc">${fmtPHP(grossProfit)}</span></div>
    <div class="m-row"><span>GP Margin</span><span style="color:${marginColor}">${gpPct}%</span></div>
    <div class="prog-bg"><div class="prog-fill"></div></div>
    <div class="m-note">${gpPct<35?'Below target margin (35\u201345%). Consider reducing discounts or adding services.':'\u2713 Healthy margin \u2014 within the 35\u201345% target range.'}</div>
  </div>

  <div class="footer">
    <p>Metro Events Administration System &middot; Generated ${today}</p>
    <p>This document is computer-generated. For inquiries, reference proposal <strong style="color:#b8924a">${refNo}</strong>.</p>
  </div>
</div>
<button class="print-btn no-print" onclick="window.print()">\uD83D\uDDA8 Print / Save as PDF</button>
</body>
</html>`;

    const blob=new Blob([html],{type:'text/html'});
    const url=URL.createObjectURL(blob);
    const win=window.open(url,'_blank');
    if(!win) alert('Popup blocked — please allow popups for this site to generate proposals.');
    setTimeout(()=>URL.revokeObjectURL(url),60000);
  };

  return(
    <div className="fade-up">
      <SectionHead title="Quotation & Margins" sub="Dynamic pricing engine with full rate overrides, add-on pricing edits, and flexible discount controls."
        action={canOverride&&(
          <button onClick={()=>setEditRates(!editRates)} style={{padding:'7px 14px',border:`1.5px solid ${editRates?'var(--gold)':'var(--border)'}`,borderRadius:'var(--r-sm)',background:editRates?'var(--gold-pale)':'var(--surface)',color:editRates?'var(--gold)':'var(--ts)',fontSize:12,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:7}}>
            <Wrench size={13}/>{editRates?'Exit Rate Override':'Override Base Rates'}
          </button>
        )}
      />

      {editRates&&(
        <div style={{background:'var(--gold-faint)',border:'1.5px solid rgba(184,146,74,.3)',borderRadius:'var(--r-lg)',padding:'20px',marginBottom:18,animation:'fadeUp .3s ease'}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16,flexWrap:'wrap'}}>
            <Wrench size={14} color='var(--gold)'/>
            <span style={{fontSize:13,fontWeight:600,color:'var(--gold)',flex:1}}>Base Rate Override Panel — Admin Only</span>
            <button onClick={()=>{setShowAddPkg(v=>!v);setEditPkgId(null);}} style={{padding:'6px 12px',background:showAddPkg?'var(--gold)':'var(--gold-pale)',color:showAddPkg?'#fff':'var(--gold)',border:`1.5px solid var(--gold-border)`,borderRadius:'var(--r-sm)',fontSize:11,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:5}}>
              <Plus size={11}/>{showAddPkg?'Cancel':'Add Package'}
            </button>
          </div>

          {/* Add new package form */}
          {showAddPkg&&(
            <div style={{background:'var(--surface)',border:`1.5px solid var(--gold)`,borderRadius:'var(--r-md)',padding:'14px',marginBottom:14,animation:'fadeUp .2s ease'}}>
              <div style={{fontSize:11,fontWeight:700,color:'var(--gold)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:10}}>New Package</div>
              <label style={{fontSize:10,fontWeight:600,color:'var(--ts)',textTransform:'uppercase',letterSpacing:'.06em',display:'block',marginBottom:4}}>Package Name</label>
              <input type="text" className="edit-field" placeholder="e.g. Premium Gold" value={newPkgForm.name} onChange={e=>setNewPkgForm(f=>({...f,name:e.target.value}))} style={{marginBottom:10}}/>
              <label style={{fontSize:10,fontWeight:600,color:'var(--ts)',textTransform:'uppercase',letterSpacing:'.06em',display:'block',marginBottom:4}}>Base Price (₱)</label>
              <input type="number" className="edit-field" value={newPkgForm.base} onChange={e=>setNewPkgForm(f=>({...f,base:e.target.value}))} style={{marginBottom:10}}/>
              <label style={{fontSize:10,fontWeight:600,color:'var(--ts)',textTransform:'uppercase',letterSpacing:'.06em',display:'block',marginBottom:4}}>Margin (0–1, e.g. 0.38)</label>
              <input type="number" step="0.01" min="0" max="1" className="edit-field" value={newPkgForm.margin} onChange={e=>setNewPkgForm(f=>({...f,margin:e.target.value}))} style={{marginBottom:10}}/>
              <button onClick={addPkg} disabled={!newPkgForm.name.trim()} style={{width:'100%',padding:'8px',background:'var(--success)',color:'#fff',border:'none',borderRadius:'var(--r-sm)',fontSize:12,fontWeight:600,cursor:newPkgForm.name.trim()?'pointer':'not-allowed',opacity:newPkgForm.name.trim()?1:.5,display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                <Plus size={12}/>Add Package
              </button>
            </div>
          )}

          {/* Delete confirm dialog */}
          {deletePkgId&&(
            <div style={{background:'var(--danger-pale)',border:`1.5px solid var(--danger-border)`,borderRadius:'var(--r-md)',padding:'14px',marginBottom:14,animation:'fadeUp .2s ease'}}>
              <div style={{fontSize:12,fontWeight:600,color:'var(--danger)',marginBottom:8}}>Delete "{pkgs.find(p=>p.id===deletePkgId)?.name}"?</div>
              <div style={{fontSize:11,color:'var(--ts)',marginBottom:12}}>This will permanently remove the package. Existing quotes using it are unaffected.</div>
              <div style={{display:'flex',gap:8}}>
                <button onClick={deletePkg} style={{flex:1,padding:'7px',background:'var(--danger)',color:'#fff',border:'none',borderRadius:'var(--r-sm)',fontSize:11,fontWeight:600,cursor:'pointer'}}>Delete</button>
                <button onClick={()=>setDeletePkgId(null)} style={{flex:1,padding:'7px',background:'var(--overlay)',color:'var(--ts)',border:'1px solid var(--border)',borderRadius:'var(--r-sm)',fontSize:11,fontWeight:600,cursor:'pointer'}}>Cancel</button>
              </div>
            </div>
          )}

          <div className="rate-override-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:12}}>
            {pkgs.map(p=>(
              <div key={p.id} style={{background:'var(--surface)',border:`1.5px solid ${editPkgId===p.id?'var(--gold)':'var(--border)'}`,borderRadius:'var(--r-md)',padding:'14px'}}>
                <div style={{fontSize:12,fontWeight:600,color:'var(--tp)',marginBottom:10}}>{p.name}</div>
                {editPkgId===p.id?(
                  <>
                    <label style={{fontSize:10,fontWeight:600,color:'var(--ts)',textTransform:'uppercase',letterSpacing:'.06em',display:'block',marginBottom:4}}>Package Name</label>
                    <input type="text" className="edit-field" value={editPkgForm.name} onChange={e=>setEditPkgForm(f=>({...f,name:e.target.value}))} style={{marginBottom:10}}/>
                    <label style={{fontSize:10,fontWeight:600,color:'var(--ts)',textTransform:'uppercase',letterSpacing:'.06em',display:'block',marginBottom:4}}>Base Price (₱)</label>
                    <input type="number" className="edit-field" value={editPkgForm.base} onChange={e=>setEditPkgForm(f=>({...f,base:Number(e.target.value)}))} style={{marginBottom:10}}/>
                    <label style={{fontSize:10,fontWeight:600,color:'var(--ts)',textTransform:'uppercase',letterSpacing:'.06em',display:'block',marginBottom:4}}>Margin (%)</label>
                    <input type="number" step="0.01" min="0" max="1" className="edit-field" value={editPkgForm.margin} onChange={e=>setEditPkgForm(f=>({...f,margin:e.target.value}))} style={{marginBottom:10}}/>
                    <div style={{display:'flex',gap:8}}>
                      <button onClick={saveEditPkg} style={{flex:1,padding:'6px',background:'var(--success)',color:'#fff',border:'none',borderRadius:'var(--r-sm)',fontSize:11,fontWeight:600,cursor:'pointer'}}>Save</button>
                      <button onClick={()=>setEditPkgId(null)} style={{flex:1,padding:'6px',background:'var(--overlay)',color:'var(--ts)',border:'1px solid var(--border)',borderRadius:'var(--r-sm)',fontSize:11,fontWeight:600,cursor:'pointer'}}>Cancel</button>
                    </div>
                  </>
                ):(
                  <>
                    <div style={{fontSize:16,fontWeight:700,color:'var(--tp)',fontFamily:"'DM Mono',monospace",marginBottom:4}}>{fmt(p.base)}</div>
                    <div style={{fontSize:11,color:'var(--tm)',marginBottom:10}}>{(p.margin*100).toFixed(0)}% margin</div>
                    <div style={{display:'flex',gap:6}}>
                      <button onClick={()=>startEditPkg(p)} aria-label={`Edit rates for ${p.name}`} style={{flex:1,padding:'6px',background:'var(--gold-pale)',color:'var(--gold)',border:`1px solid var(--gold-border)`,borderRadius:'var(--r-sm)',fontSize:11,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:5}}>
                        <Edit2 size={10} aria-hidden="true"/>Edit
                      </button>
                      {pkgs.length>1&&(
                        <button onClick={()=>confirmDeletePkg(p.id)} aria-label={`Delete ${p.name}`} style={{padding:'6px 10px',background:'var(--danger-pale)',color:'var(--danger)',border:`1px solid var(--danger-border)`,borderRadius:'var(--r-sm)',fontSize:11,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
                          <Trash2 size={10}/>
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="g-2-side" style={{gap:18,display:'grid'}}>
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          {/* Package selector */}
          <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:'20px',boxShadow:'var(--sh-sm)'}}>
            <span className="section-label">Base Package</span>
            <div className="g-2 pkg-grid" style={{gap:10}}>
              {pkgs.map(p=>(
                <button key={p.id} onClick={()=>setSelectedPkg(p.id)} style={{padding:'14px 16px',border:`2px solid ${selectedPkg===p.id?'var(--gold)':'var(--border)'}`,borderRadius:'var(--r-md)',background:selectedPkg===p.id?'var(--gold-pale)':'var(--surface)',cursor:'pointer',textAlign:'left',transition:'all var(--t-base)'}}>
                  <div style={{fontSize:13,fontWeight:600,color:selectedPkg===p.id?'var(--gold)':'var(--tp)'}}>{p.name}</div>
                  <div style={{fontSize:15,fontWeight:700,color:'var(--tp)',fontFamily:"'DM Mono',monospace",margin:'4px 0'}}>{fmt(p.base)}</div>
                  <div style={{fontSize:10,color:'var(--tm)'}}>{(p.margin*100).toFixed(0)}% margin</div>
                </button>
              ))}
            </div>
          </div>

          {/* Add-ons (with editable prices) */}
          <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:'20px',boxShadow:'var(--sh-sm)'}}>
            <div style={{display:'flex',alignItems:'center',marginBottom:12}}>
              <span className="section-label" style={{marginBottom:0,flex:1}}>Add-On Services</span>
              {canOverride&&<span style={{fontSize:11,color:'var(--tm)'}}>Click price to edit</span>}
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {addonsLib.map(a=>{
                const on=selectedAddons.includes(a.id);
                const isEditingThis=editingAddon===a.id;
                return(
                  <div key={a.id} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 13px',border:`1.5px solid ${on?'var(--gold)':'var(--border)'}`,borderRadius:'var(--r-md)',cursor:'pointer',background:on?'var(--gold-faint)':'transparent',transition:'all var(--t-base)'}}>
                    <div onClick={()=>toggleAddon(a.id)} style={{width:18,height:18,borderRadius:'var(--r-xs)',border:`2px solid ${on?'var(--gold)':'var(--border-s)'}`,background:on?'var(--gold)':'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,cursor:'pointer'}}>
                      {on&&<Check size={11} color="#fff" strokeWidth={3}/>}
                    </div>
                    <span onClick={()=>toggleAddon(a.id)} style={{fontSize:13,fontWeight:500,color:'var(--tp)',flex:1}}>{a.label}</span>
                    {isEditingThis?(
                      <div style={{display:'flex',gap:6,alignItems:'center'}} onClick={e=>e.stopPropagation()}>
                        <input type="number" className="edit-field" value={editAddonPrice} onChange={e=>setEditAddonPrice(e.target.value)} style={{width:90}}/>
                        <button onClick={saveAddonPrice} style={{padding:'4px 9px',background:'var(--success)',color:'#fff',border:'none',borderRadius:'var(--r-sm)',fontSize:11,cursor:'pointer'}}>✓</button>
                        <button onClick={()=>setEditingAddon(null)} style={{padding:'4px 9px',background:'var(--overlay)',color:'var(--ts)',border:'1px solid var(--border)',borderRadius:'var(--r-sm)',fontSize:11,cursor:'pointer'}}>✕</button>
                      </div>
                    ):(
                      <span onClick={canOverride?()=>{setEditingAddon(a.id);setEditAddonPrice(a.price);}:()=>toggleAddon(a.id)}
                        className="mono" style={{fontSize:12,fontWeight:600,color:on?'var(--gold)':'var(--ts)',cursor:canOverride?'text':'pointer',borderBottom:canOverride?`1px dashed var(--gold-border)`:'none',paddingBottom:canOverride?1:0}}>
                        {fmt(a.price)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Discount variables (flexible %/₱) — admin can edit labels, values, add/delete */}
          <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:'20px',boxShadow:'var(--sh-sm)'}}>
            <div style={{display:'flex',alignItems:'center',marginBottom:12}}>
              <span className="section-label" style={{marginBottom:0,flex:1}}>Discount Variables</span>
              {canOverride&&(
                <button onClick={()=>setShowAddDiscount(v=>!v)} style={{padding:'4px 10px',background:showAddDiscount?'var(--gold)':'var(--gold-pale)',color:showAddDiscount?'#fff':'var(--gold)',border:`1.5px solid var(--gold-border)`,borderRadius:'var(--r-sm)',fontSize:11,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:5}}>
                  <Plus size={11}/>{showAddDiscount?'Cancel':'Add Discount'}
                </button>
              )}
            </div>

            {/* Add Discount form (admin only) */}
            {canOverride&&showAddDiscount&&(
              <div style={{background:'var(--gold-faint)',border:'1.5px solid rgba(184,146,74,.3)',borderRadius:'var(--r-md)',padding:'14px',marginBottom:12,animation:'fadeUp .2s ease'}}>
                <div style={{fontSize:11,fontWeight:700,color:'var(--gold)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:10}}>New Discount</div>
                <label style={{fontSize:10,fontWeight:600,color:'var(--ts)',textTransform:'uppercase',letterSpacing:'.06em',display:'block',marginBottom:3}}>Label</label>
                <input className="edit-field" placeholder="e.g. Loyalty Discount" value={newDiscount.label} onChange={e=>setNewDiscount(f=>({...f,label:e.target.value}))} style={{marginBottom:8}}/>
                <label style={{fontSize:10,fontWeight:600,color:'var(--ts)',textTransform:'uppercase',letterSpacing:'.06em',display:'block',marginBottom:3}}>Description</label>
                <input className="edit-field" placeholder="e.g. Returning clients" value={newDiscount.sub} onChange={e=>setNewDiscount(f=>({...f,sub:e.target.value}))} style={{marginBottom:8}}/>
                <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:10}}>
                  <div style={{display:'flex',border:'1px solid var(--border)',borderRadius:'var(--r-sm)',overflow:'hidden'}}>
                    {['percent','fixed'].map(t=>(
                      <button key={t} onClick={()=>setNewDiscount(f=>({...f,type:t}))} style={{padding:'4px 12px',background:newDiscount.type===t?'var(--navy)':'transparent',color:newDiscount.type===t?'#f8f4ed':'var(--ts)',border:'none',fontSize:11,fontWeight:600,cursor:'pointer'}}>
                        {t==='percent'?'%':'₱'}
                      </button>
                    ))}
                  </div>
                  <input type="number" className="edit-field" value={newDiscount.value} onChange={e=>setNewDiscount(f=>({...f,value:e.target.value}))} style={{width:80}} min={0} placeholder="0"/>
                </div>
                <button onClick={addDiscount} disabled={!newDiscount.label.trim()} style={{width:'100%',padding:'8px',background:'var(--success)',color:'#fff',border:'none',borderRadius:'var(--r-sm)',fontSize:12,fontWeight:600,cursor:newDiscount.label.trim()?'pointer':'not-allowed',opacity:newDiscount.label.trim()?1:.5,display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                  <Plus size={12}/>Add Discount
                </button>
              </div>
            )}

            {discounts.map(d=>(
              <div key={d.key} style={{display:'flex',alignItems:'flex-start',gap:12,padding:'12px 14px',border:`1.5px solid ${d.active?'var(--success)':'var(--border)'}`,borderRadius:'var(--r-md)',marginBottom:9,background:d.active?'var(--success-pale)':'transparent',transition:'all var(--t-base)'}}>
                <div onClick={()=>toggleDiscount(d.key)} style={{width:20,height:12,background:d.active?'var(--success)':'var(--border-s)',borderRadius:'var(--r-full)',position:'relative',flexShrink:0,transition:'background var(--t-base)',marginTop:3,cursor:'pointer'}}>
                  <div style={{position:'absolute',width:10,height:10,background:'#fff',borderRadius:'50%',top:1,left:d.active?9:1,transition:'left var(--t-base)',boxShadow:'var(--sh-xs)'}}/>
                </div>
                <div style={{flex:1}}>
                  {/* Editable label and sub when admin override is on */}
                  {canOverride
                    ? <>
                        <input className="edit-field" value={d.label} onChange={e=>setDiscountLabel(d.key,e.target.value)} style={{marginBottom:4,fontSize:13,fontWeight:500}} placeholder="Discount name"/>
                        <input className="edit-field" value={d.sub} onChange={e=>setDiscountSub(d.key,e.target.value)} style={{fontSize:11,color:'var(--ts)'}} placeholder="Short description"/>
                      </>
                    : <>
                        <div style={{fontSize:13,fontWeight:500,color:'var(--tp)'}}>{d.label}</div>
                        <div style={{fontSize:11,color:'var(--ts)'}}>{d.sub}</div>
                      </>
                  }
                  {canOverride&&(
                    <div style={{display:'flex',gap:8,alignItems:'center',marginTop:8}}>
                      {/* Type toggle */}
                      <div style={{display:'flex',border:'1px solid var(--border)',borderRadius:'var(--r-sm)',overflow:'hidden'}}>
                        {['percent','fixed'].map(t=>(
                          <button key={t} onClick={()=>setDiscountType(d.key,t)} style={{padding:'3px 10px',background:d.type===t?'var(--navy)':'transparent',color:d.type===t?'#f8f4ed':'var(--ts)',border:'none',fontSize:11,fontWeight:600,cursor:'pointer'}}>
                            {t==='percent'?'%':'₱'}
                          </button>
                        ))}
                      </div>
                      <input type="number" className="edit-field" value={d.value} onChange={e=>setDiscountValue(d.key,e.target.value)} style={{width:80}} min={0}/>
                      <span style={{fontSize:11,color:'var(--tm)'}}>{d.type==='percent'?`= ${fmt(Math.round(subtotal*(d.value/100)))} off`:`flat deduction`}</span>
                      {/* Delete discount button */}
                      <button onClick={()=>deleteDiscount(d.key)} aria-label={`Delete ${d.label} discount`} title="Delete this discount" style={{marginLeft:'auto',padding:'3px 8px',background:'var(--danger-pale)',color:'var(--danger)',border:'1px solid var(--danger-border)',borderRadius:'var(--r-sm)',fontSize:11,cursor:'pointer',display:'flex',alignItems:'center',gap:4}}>
                        <Trash2 size={10}/>
                      </button>
                    </div>
                  )}
                </div>
                {d.active&&<Badge label={d.type==='percent'?`-${d.value}%`:`-${fmt(d.value)}`} color="green"/>}
              </div>
            ))}
          </div>
        </div>

        {/* Pricing summary */}
        <div className="quo-sticky" style={{position:'sticky',top:20}}>
          <div style={{background:'var(--navy)',borderRadius:'var(--r-xl)',padding:'24px',boxShadow:'var(--sh-lg)',color:'var(--sidebar-text)'}}>
            <div className="disp" style={{fontSize:18,fontWeight:600,color:'var(--gold-lt)',marginBottom:18}}>Price Summary</div>
            {[['Base Package',fmt(selPkg.base)],['Add-ons Total',fmt(addonTotal)],['Subtotal',fmt(subtotal)]].map(([l,v])=>(
              <div key={l} style={{display:'flex',justifyContent:'space-between',marginBottom:10,fontSize:13}}>
                <span style={{color:'var(--sidebar-text-mid)'}}>{l}</span>
                <span className="mono" style={{fontWeight:500,color:'var(--sidebar-text)'}}>{v}</span>
              </div>
            ))}
            {discAmt>0&&(
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:10,fontSize:13}}>
                <span style={{color:'var(--success)'}}>Total Discounts</span>
                <span className="mono" style={{fontWeight:500,color:'var(--success)'}}>-{fmt(discAmt)}</span>
              </div>
            )}
            <div style={{borderTop:`1px solid var(--gold-border)`,margin:'14px 0',paddingTop:14}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                <span style={{fontSize:13,color:'var(--sidebar-text-dim)'}}>Client Total</span>
                <span className="mono" style={{fontSize:20,fontWeight:700,color:'var(--gold-lt)'}}>{fmt(total)}</span>
              </div>
            </div>
            <div style={{background:'var(--gold-faint)',border:`1px solid var(--gold-border-faint)`,borderRadius:'var(--r-md)',padding:'12px 14px',marginTop:8}}>
              <span className="section-label" style={{color:'var(--gold)',marginBottom:8}}>Margin Analysis</span>
              {[['Est. Cost',fmt(cost)],['Gross Profit',fmt(grossProfit)],['GP Margin',`${gpPct}%`]].map(([l,v])=>(
                <div key={l} style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:6}}>
                  <span style={{color:'var(--sidebar-text-mid)'}}>{l}</span>
                  <span className="mono" style={{fontWeight:600,color:l==='GP Margin'?(gpPct>=35&&gpPct<=50?'var(--gold-lt)':gpPct<35?'var(--danger)':'var(--success)'):'var(--sidebar-text)'}}>{v}</span>
                </div>
              ))}
              <div style={{marginTop:8}}>
                <div className="prog-bar" style={{background:'var(--sidebar-hover)'}}><div className="prog-fill" style={{width:`${Math.min(gpPct,100)}%`}}/></div>
                <div style={{fontSize:10,color:gpPct<35?'var(--danger)':'var(--gold)',marginTop:4}}>
                  {gpPct<35?'⚠ Below target margin':'Healthy margin target: 35–45%'}
                </div>
              </div>
            </div>
            <GoldBtn onClick={generateProposal} full style={{marginTop:16}}>Generate Proposal <Download size={13}/></GoldBtn>
          </div>
        </div>
      </div>
    </div>
  );
};


/* ══════════════════════════════════════════════════════
   MODULE 9 — AUDIT LOGS & PERMISSIONS + CODE BOARD
══════════════════════════════════════════════════════ */
const AuditView = ({role,accessCodes,setAccessCodes,auditLogs=[],addLog,setAuditLogs})=>{
  if(!ACCESS[role].includes('audit')) return <RoleBlock module="Audit Logs & Permissions" role={role}/>;
  const [tab,setTab]=useState('logs');
  const [codeEdit,setCodeEdit]=useState({});   // {role: editingValue}
  const [codeVisible,setCodeVisible]=useState({});  // {role: bool}
  const [rotateAnim,setRotateAnim]=useState({});
  const [clearConfirm,setClearConfirm]=useState(false); // admin-only clear-all logs confirm

  const sevColor=s=>({info:'blue',warn:'orange',danger:'red'})[s]||'grey';
  const sevIcon=s=>({info:Info,warn:AlertTriangle,danger:XCircle})[s]||Info;
  const cellColor=v=>v?'var(--success)':'var(--danger)';
  const cellBg=v=>v?'var(--success-pale)':'var(--danger-pale)';

  const MODULES_LIST=['Dashboard','CRM Pipeline','Master Checklist','Crew & Tasks','Warehouse','Supplier Hub','Quotation','Audit Logs'];
  const accessMatrix={
    admin:      [1,1,1,1,1,1,1,1],
    coordinator:[1,1,1,1,0,1,1,0],
    designer:   [1,0,1,1,0,0,0,0],
    warehouse:  [1,0,0,0,1,0,0,0],
  };

  const codeRoles=['coordinator','designer','warehouse'];

  const startCodeEdit=(r)=>setCodeEdit(p=>({...p,[r]:accessCodes[r]}));
  const saveCodeEdit=(r)=>{
    if(codeEdit[r]&&codeEdit[r].trim()){
      const newVal=codeEdit[r].trim();
      setAccessCodes(p=>({...p,[r]:newVal}));
      // Persist to Supabase so all browsers get the updated code.
      // supabaseAdmin bypasses RLS — admin user has no Supabase auth session.
      (supabaseAdmin??supabase).from('app_settings').upsert({key:'access_code_'+r,value:newVal},{onConflict:'key'})
        .then(({error})=>{if(error)console.error('[access_code] save failed — check VITE_SUPABASE_SERVICE_KEY and RLS:',error.message);});
      addLog&&addLog(`Updated access code for ${r} role`,r,'warn');
    }
    setCodeEdit(p=>{const n={...p};delete n[r];return n;});
  };
  const cancelCodeEdit=(r)=>setCodeEdit(p=>{const n={...p};delete n[r];return n;});
  const rotateCode=(r)=>{
    setRotateAnim(p=>({...p,[r]:true}));
    const newCode=genCode();
    setTimeout(()=>{
      setAccessCodes(p=>({...p,[r]:newCode}));
      // Persist rotated code to Supabase so all browsers get the new code.
      // supabaseAdmin bypasses RLS — admin user has no Supabase auth session.
      (supabaseAdmin??supabase).from('app_settings').upsert({key:'access_code_'+r,value:newCode},{onConflict:'key'})
        .then(({error})=>{if(error)console.error('[access_code] rotate failed — check VITE_SUPABASE_SERVICE_KEY and RLS:',error.message);});
      addLog&&addLog(`Rotated access code for ${r} role`,r,'warn');
      setRotateAnim(p=>({...p,[r]:false}));
    },600);
  };

  const tabs=[
    {id:'logs',label:'Activity Log'},
    {id:'perms',label:'Permissions Matrix'},
    ...(role==='admin'?[{id:'codes',label:'Access Code Control Board'}]:[]),
  ];

  return(
    <div className="fade-up">
      <SectionHead title="Audit Logs & Permissions" sub="Timestamped activity ledger, access control matrix, and admin-only access code management."/>
      <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap'}}>
        {tabs.map(({id,label})=>(
          <button key={id} onClick={()=>setTab(id)} style={{padding:'8px 18px',borderRadius:'var(--r-sm)',border:`1.5px solid ${tab===id?'var(--gold)':'var(--border)'}`,background:tab===id?'var(--gold-pale)':'var(--surface)',color:tab===id?'var(--gold)':'var(--ts)',fontSize:12,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:7}}>
            {id==='codes'&&<Key size={12}/>}{label}
            {id==='codes'&&<Badge label="Admin Only" color="gold"/>}
          </button>
        ))}
        {tab==='logs'&&<button onClick={()=>{
          // Build CSV from current audit log data
          const headers = ['Timestamp','Staff','Role','Action','Target','Severity'];
          const rows = auditLogs.map(l=>[
            `"${(l.ts||'').replace(/"/g,'""')}"`,
            `"${(l.user||'').replace(/"/g,'""')}"`,
            `"${(l.role||'').replace(/"/g,'""')}"`,
            `"${(l.action||'').replace(/"/g,'""')}"`,
            `"${(l.target||'').replace(/"/g,'""')}"`,
            `"${(l.sev||'').replace(/"/g,'""')}"`,
          ].join(','));
          const csv = [headers.join(','), ...rows].join('\r\n');
          const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          const ts = new Date().toISOString().slice(0,10);
          a.href = url; a.download = `metro-audit-log-${ts}.csv`;
          document.body.appendChild(a); a.click();
          document.body.removeChild(a); URL.revokeObjectURL(url);
        }} style={{marginLeft:'auto',padding:'7px 14px',background:'var(--overlay)',border:'1.5px solid var(--border)',borderRadius:'var(--r-sm)',fontSize:12,fontWeight:500,color:'var(--ts)',cursor:'pointer',display:'flex',alignItems:'center',gap:5}}><Download size={12}/>Export Log</button>}
        {/* Admin-only: clear all logs */}
        {tab==='logs'&&role==='admin'&&(
          <button onClick={()=>setClearConfirm(true)} style={{padding:'7px 14px',background:'var(--danger-pale)',border:'1.5px solid var(--danger-border)',borderRadius:'var(--r-sm)',fontSize:12,fontWeight:500,color:'var(--danger)',cursor:'pointer',display:'flex',alignItems:'center',gap:5}}>
            <Trash2 size={12}/>Clear All Logs
          </button>
        )}
      </div>

      {/* Clear All Logs confirm dialog (admin only) */}
      {clearConfirm&&(
        <div style={{background:'var(--danger-pale)',border:'1.5px solid var(--danger-border)',borderRadius:'var(--r-lg)',padding:'18px 20px',marginBottom:14,animation:'fadeUp .2s ease'}}>
          <div style={{fontSize:13,fontWeight:600,color:'var(--danger)',marginBottom:6}}>Clear all {auditLogs.length} log entries?</div>
          <div style={{fontSize:12,color:'var(--ts)',marginBottom:14}}>This permanently deletes every activity record from both this session and Supabase. This action cannot be undone.</div>
          <div style={{display:'flex',gap:10}}>
            <button onClick={()=>{
              // Clear local state immediately for instant feedback across all components
              setAuditLogs&&setAuditLogs([]);
              // Delete all rows from Supabase so other browsers also see the cleared log
              (supabaseAdmin??supabase).from('audit_logs').delete().neq('id',0)
                .then(({error})=>{if(error) console.error('[audit] clear failed:',error.message);});
              setClearConfirm(false);
              // Log the clear action itself after clearing
              addLog&&addLog('Cleared all audit logs','audit_logs','danger');
            }} style={{flex:1,padding:'8px',background:'var(--danger)',color:'#fff',border:'none',borderRadius:'var(--r-sm)',fontSize:12,fontWeight:600,cursor:'pointer'}}>
              Yes, Clear All
            </button>
            <button onClick={()=>setClearConfirm(false)} style={{flex:1,padding:'8px',background:'var(--overlay)',color:'var(--ts)',border:'1px solid var(--border)',borderRadius:'var(--r-sm)',fontSize:12,fontWeight:600,cursor:'pointer'}}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {tab==='logs'&&(
        <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',boxShadow:'var(--sh-sm)',overflow:'hidden'}}>
          <div className="tbl-wrap">
            <table className="dt" aria-label="Activity log">
              <thead><tr><th scope="col" aria-label="Severity"></th><th scope="col">Timestamp</th><th scope="col">Staff</th><th scope="col">Role</th><th scope="col">Action</th><th scope="col">Target</th></tr></thead>
              <tbody>
                {auditLogs.length===0&&<tr><td colSpan={6} style={{textAlign:'center',padding:'32px',color:'var(--tm)',fontSize:13}}>No activity recorded yet. Logins and actions by all staff across all modules will appear here.</td></tr>}
                {[...auditLogs].map(log=>{
                  const Ic=sevIcon(log.sev);
                  return(
                    <tr key={log.id}>
                      <td style={{width:32}}>
                        <div style={{width:22,height:22,background:cellBg(log.sev!=='danger'),borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}>
                          <Ic size={11} color={cellColor(log.sev!=='danger')}/>
                        </div>
                      </td>
                      <td><span className="mono" style={{fontSize:11,color:'var(--tm)'}}>{log.ts}</span></td>
                      <td style={{fontWeight:500}}>{log.user}</td>
                      <td><Badge label={log.role} color={ROLE_COLOR[log.role]||'grey'}/></td>
                      <td style={{color:'var(--ts)'}}>{log.action}</td>
                      <td><span className="mono" style={{fontSize:11,color:log.sev==='danger'?'var(--danger)':'var(--ts)'}}>{log.target}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab==='perms'&&(
        <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',boxShadow:'var(--sh-sm)',overflow:'hidden'}}>
          <div className="tbl-wrap">
            <table className="dt" aria-label="Role permissions matrix">
              <thead>
                <tr>
                  <th>Module</th>
                  {Object.keys(accessMatrix).map(r=>(
                    <th key={r} style={{textAlign:'center'}}><Badge label={r} color={ROLE_COLOR[r]||'grey'}/></th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MODULES_LIST.map((mod,i)=>(
                  <tr key={mod}>
                    <td style={{fontWeight:500}}>{mod}</td>
                    {Object.keys(accessMatrix).map(r=>{
                      const has=accessMatrix[r][i];
                      return(
                        <td key={r} style={{textAlign:'center'}}>
                          <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:22,height:22,background:cellBg(has),border:`1px solid ${cellColor(has)}33`,borderRadius:'50%'}}>
                            {has?<Check size={11} color={cellColor(has)} strokeWidth={3}/>:<Minus size={11} color={cellColor(has)}/>}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{padding:'12px 18px',borderTop:'1px solid var(--border)',display:'flex',gap:16,alignItems:'center',background:'var(--overlay)'}}>
            <div style={{display:'flex',gap:6,alignItems:'center'}}><span style={{width:16,height:16,background:'var(--success-pale)',border:'1px solid var(--success)33',borderRadius:'50%',display:'inline-flex',alignItems:'center',justifyContent:'center'}}><Check size={9} color='var(--success)' strokeWidth={3}/></span><span style={{fontSize:11,color:'var(--ts)'}}>Full Access</span></div>
            <div style={{display:'flex',gap:6,alignItems:'center'}}><span style={{width:16,height:16,background:'var(--danger-pale)',border:'1px solid var(--danger)33',borderRadius:'50%',display:'inline-flex',alignItems:'center',justifyContent:'center'}}><Minus size={9} color='var(--danger)'/></span><span style={{fontSize:11,color:'var(--ts)'}}>No Access</span></div>
            <div style={{marginLeft:'auto',fontSize:11,color:'var(--tm)'}}>Changes to this matrix require admin-level access and are fully logged.</div>
          </div>
        </div>
      )}

      {tab==='codes'&&role==='admin'&&(
        <div>
          {/* Control Board header */}
          <div style={{padding:'16px 20px',background:'var(--navy)',borderRadius:'var(--r-lg)',marginBottom:18,display:'flex',gap:14,alignItems:'center',boxShadow:'var(--sh-md)'}}>
            <div style={{width:40,height:40,background:'var(--gold-faint)',border:`1px solid var(--gold-border)`,borderRadius:'var(--r-md)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <Key size={18} color='var(--gold)' aria-hidden="true"/>
            </div>
            <div>
              <div style={{fontSize:14,fontWeight:600,color:'var(--sidebar-text)'}}>Access Code Control Board</div>
              <div style={{fontSize:12,color:'var(--sidebar-text-dim)',marginTop:2}}>Master codes governing role-level authentication. Edit, rotate, or regenerate per tier. All changes are logged.</div>
            </div>
            <div style={{marginLeft:'auto'}}>
              <Badge label="Administrator Access Only" color="gold"/>
            </div>
          </div>

          {/* Admin code (read-only display) */}
          <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:'18px 22px',marginBottom:14,boxShadow:'var(--sh-sm)'}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:4}}>
              <div style={{width:28,height:28,background:'var(--gold-pale)',borderRadius:'var(--r-sm)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <Shield size={13} color='var(--gold)'/>
              </div>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:'var(--tp)'}}>Administrator</div>
                <div style={{fontSize:11,color:'var(--tm)'}}>Root-level code — managed outside this board</div>
              </div>
              <div style={{marginLeft:'auto'}}>
                <Badge label="System-Level" color="gold"/>
              </div>
            </div>
            <div style={{marginTop:10,padding:'10px 14px',background:'var(--overlay)',borderRadius:'var(--r-sm)',fontFamily:"'DM Mono',monospace",fontSize:13,color:'var(--tm)',letterSpacing:'.1em'}}>
              ••••••••  (contact system operator to rotate)
            </div>
          </div>

          {/* Editable role codes */}
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {codeRoles.map(r=>{
              const isEditing=r in codeEdit;
              const isVisible=codeVisible[r];
              const isRotating=rotateAnim[r];
              return(
                <div key={r} style={{background:'var(--surface)',border:`1.5px solid ${isEditing?'var(--gold)':'var(--border)'}`,borderRadius:'var(--r-lg)',padding:'18px 22px',boxShadow:'var(--sh-sm)',transition:'border-color var(--t-base)'}}>
                  <div style={{display:'flex',alignItems:'center',gap:14,flexWrap:'wrap'}}>
                    <div style={{width:36,height:36,background:ROLE_COLOR[r]==='blue'?'var(--info-pale)':ROLE_COLOR[r]==='green'?'var(--success-pale)':'var(--overlay)',borderRadius:'var(--r-md)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                      <Shield size={15} color={ROLE_COLOR[r]==='blue'?'var(--info)':ROLE_COLOR[r]==='green'?'var(--success)':'var(--ts)'}/>
                    </div>
                    <div style={{flex:1,minWidth:120}}>
                      <div style={{fontSize:13,fontWeight:600,color:'var(--tp)'}}>{ROLE_LABEL[r]}</div>
                      <div style={{fontSize:11,color:'var(--tm)',marginTop:1}}>Required for all {r} account creation and system login</div>
                    </div>

                    {/* Code display / edit area */}
                    <div style={{flex:'1 1 220px',display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
                      {isEditing?(
                        <>
                          <input
                            className="edit-field"
                            value={codeEdit[r]}
                            onChange={e=>setCodeEdit(p=>({...p,[r]:e.target.value}))}
                            style={{flex:1,fontFamily:"'DM Mono',monospace",letterSpacing:'.1em'}}
                            autoFocus
                          />
                          <button onClick={()=>saveCodeEdit(r)} style={{padding:'7px 14px',background:'var(--success)',color:'#fff',border:'none',borderRadius:'var(--r-sm)',fontSize:12,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:5,flexShrink:0}}>
                            <Save size={12}/>Save
                          </button>
                          <button onClick={()=>cancelCodeEdit(r)} style={{padding:'7px 12px',background:'var(--overlay)',color:'var(--ts)',border:'1px solid var(--border)',borderRadius:'var(--r-sm)',fontSize:12,cursor:'pointer',flexShrink:0}}>
                            Cancel
                          </button>
                        </>
                      ):(
                        <>
                          <div style={{flex:1,padding:'9px 14px',background:'var(--overlay)',border:'1px solid var(--border)',borderRadius:'var(--r-sm)',fontFamily:"'DM Mono',monospace",fontSize:13,letterSpacing:'.1em',color:isVisible?'var(--tp)':'var(--tm)'}}>
                            {isVisible?accessCodes[r]:'•'.repeat(accessCodes[r].length)}
                          </div>
                          <button onClick={()=>setCodeVisible(p=>({...p,[r]:!isVisible}))} aria-label={isVisible?`Hide ${r} access code`:`Show ${r} access code`} style={{padding:'8px',background:'var(--overlay)',border:'1px solid var(--border)',borderRadius:'var(--r-sm)',cursor:'pointer',display:'flex',flexShrink:0}}
                          onMouseEnter={e=>e.currentTarget.style.background='var(--canvas)'}
                          onMouseLeave={e=>e.currentTarget.style.background='var(--overlay)'}>
                            {isVisible?<EyeOff size={14} color='var(--ts)' aria-hidden="true"/>:<Eye size={14} color='var(--ts)' aria-hidden="true"/>}
                          </button>
                          <button onClick={()=>startCodeEdit(r)} aria-label={`Edit ${r} access code`} style={{padding:'7px 12px',background:'var(--gold-pale)',color:'var(--gold)',border:`1px solid var(--gold-border)`,borderRadius:'var(--r-sm)',fontSize:11,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:4,flexShrink:0}}
                          onMouseEnter={e=>e.currentTarget.style.background='var(--gold-faint)'}
                          onMouseLeave={e=>e.currentTarget.style.background='var(--gold-pale)'}>
                            <Edit2 size={11} aria-hidden="true"/>Edit
                          </button>
                          <button onClick={()=>rotateCode(r)} aria-label={`Rotate ${r} access code`} style={{padding:'7px 12px',background:'var(--info-pale)',color:'var(--info)',border:'1px solid rgba(42,94,168,.24)',borderRadius:'var(--r-sm)',fontSize:11,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:4,flexShrink:0}}
                          onMouseEnter={e=>e.currentTarget.style.background='#dde9f8'}
                          onMouseLeave={e=>e.currentTarget.style.background='var(--info-pale)'}>
                            <RotateCcw size={11} aria-hidden="true" style={{animation:isRotating?'spin .6s linear':''}}/>Rotate
                          </button>
                        </>
                      )}
                    </div>
                    <Badge label={accessCodes[r].length+' chars'} color="grey"/>
                  </div>
                  <div style={{marginTop:12,padding:'8px 12px',background:'var(--warn-pale)',border:'1px solid rgba(176,108,20,.18)',borderRadius:'var(--r-sm)',fontSize:11,color:'var(--warn)',display:'flex',gap:7,alignItems:'flex-start'}}>
                    <AlertTriangle size={12} style={{flexShrink:0,marginTop:1}}/>
                    Rotating or editing this code will invalidate all existing sessions for <strong>{r}</strong> roles and require re-authentication. Distribute the new code through a secure channel.
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   AUTH SCREEN — USERNAME-BASED DUAL-FACTOR AUTH
   Step 1: Username lookup (resolves identity + role)
   Step 2: Password + Role Access Code verification
   Admin path: hardcoded username/password/code bypass
══════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════
   AUTH SCREEN — v3.0
   Redesigned: split-panel layout with two modes:
   - "admin" tab  → Staff login (username + pw + access code)
   - "client" tab → Client login (email + password only, Supabase auth)
   Both modes share the luxury navy/gold aesthetic.
══════════════════════════════════════════════════════ */
const AuthScreen = ({onLogin,onClientLogin,accessCodes,staff,adminPassword,adminUsername})=>{
  const [mode,setMode]=useState('admin'); // 'admin' | 'client'

  /* ── ADMIN login state ── */
  const [username,setUsername]=useState('');
  const [resolvedUser,setResolvedUser]=useState(null);
  const [password,setPassword]=useState('');
  const [code,setCode]=useState('');
  const [showPass,setShowPass]=useState(false);
  const [showCode,setShowCode]=useState(false);
  const [err,setErr]=useState('');
  const [loading,setLoading]=useState(false);
  const [step,setStep]=useState(1);

  /* ── CLIENT login state ── */
  const [cEmail,setCEmail]=useState('');
  const [cPass,setCPass]=useState('');
  const [cShowPass,setCShowPass]=useState(false);
  const [cErr,setCErr]=useState('');
  const [cLoading,setCLoading]=useState(false);

  const resetAdmin=()=>{setUsername('');setResolvedUser(null);setPassword('');setCode('');setErr('');setStep(1);setShowPass(false);setShowCode(false);};
  const resetClient=()=>{setCEmail('');setCPass('');setCErr('');setCShowPass(false);};

  const switchMode=(m)=>{setMode(m);setErr('');setCErr('');if(m==='admin')resetAdmin();else resetClient();};

  /* ── Admin: Step 1 — resolve identity ── */
  const nextStep=async()=>{
    const u=username.trim().toLowerCase();
    if(!u){setErr('Please enter your username.');return;}
    if(u===adminUsername){
      setResolvedUser({name:'Administrator',role:'admin',staffId:null});
      setErr('');setStep(2);return;
    }
    setLoading(true);
    const {data,error}=await supabase.from('profiles').select('id,username,full_name,role').eq('username',u).maybeSingle();
    setLoading(false);
    if(error||!data){setErr('No account found for that username.');return;}
    setResolvedUser({name:data.full_name||'',role:data.role,staffId:data.id});
    setErr('');setStep(2);
  };

  /* ── Admin: Step 2 — validate credentials ── */
  const submitAdmin=()=>{
    if(!password.trim()){setErr('Password is required.');return;}
    if(!code.trim()){setErr('Access code is required.');return;}
    if(!resolvedUser){setErr('Session error — please refresh.');return;}
    const {role}=resolvedUser;
    if(role==='admin'){
      if(password!==adminPassword){setErr('Incorrect password.');return;}
      if(code!==ADMIN_CODE){setErr('Invalid administrator access code.');return;}
    } else {
      const expectedCode=accessCodes[role];
      if(code!==expectedCode){setErr('Invalid access code for this role.');return;}
    }
    setLoading(true);
    setTimeout(()=>onLogin({name:resolvedUser.name,role:resolvedUser.role,username:username.trim().toLowerCase(),staffId:resolvedUser.staffId,password}),900);
  };

  /* ── Client: sign in with Supabase auth ── */
  const submitClient=async()=>{
    if(!cEmail.trim()){setCErr('Email is required.');return;}
    if(!cPass.trim()){setCErr('Password is required.');return;}
    setCLoading(true);
    const {data,error}=await supabase.auth.signInWithPassword({email:cEmail.trim(),password:cPass});
    if(error){setCErr(error.message==='Invalid login credentials'?'Incorrect email or password. Please try again.':error.message);setCLoading(false);return;}
    // Fetch full profile
    const {data:profile}=await supabase.from('profiles').select('*').eq('id',data.user.id).maybeSingle();
    setCLoading(false);
    if(onClientLogin) onClientLogin({...profile, name:profile?.full_name||cEmail, role:profile?.role||'client', staffId:profile?.id||null});
  };

  /* ── Shared input style ── */
  const inp={width:'100%',padding:'11px 14px',background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:'var(--r-sm)',fontSize:13,color:'var(--tp)',fontFamily:"'DM Sans',sans-serif"};
  const inpMono={...inp,fontFamily:"'DM Mono',monospace"};
  const eyeBtn={position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'var(--tm)',display:'flex',borderRadius:'var(--r-xs)',padding:2};
  const lbl={fontSize:11,fontWeight:600,color:'var(--ts)',letterSpacing:'.06em',display:'block',marginBottom:6,textTransform:'uppercase'};

  return(
    <div style={{minHeight:'100vh',display:'flex',background:'var(--navy)',overflow:'hidden'}}>

      {/* ── LEFT PANEL — brand + illustration ── */}
      <div style={{width:'44%',background:'var(--navy)',display:'flex',flexDirection:'column',justifyContent:'center',padding:'64px 52px',position:'relative',overflow:'hidden',flexShrink:0}} className="hide-m">
        {/* Decorative circles */}
        <div aria-hidden="true" style={{position:'absolute',width:560,height:560,border:'1px solid rgba(184,146,74,.07)',borderRadius:'50%',top:-120,right:-220,pointerEvents:'none'}}/>
        <div aria-hidden="true" style={{position:'absolute',width:340,height:340,border:'1px solid rgba(184,146,74,.05)',borderRadius:'50%',top:60,right:-80,pointerEvents:'none'}}/>
        <div aria-hidden="true" style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 30% 60%,rgba(184,146,74,.06) 0%,transparent 65%)',pointerEvents:'none'}}/>

        {/* Brand */}
        <div style={{display:'flex',alignItems:'center',gap:11,marginBottom:52,position:'relative'}}>
          <div style={{width:38,height:38,background:'linear-gradient(135deg,var(--gold),var(--gold-lt))',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <Briefcase size={16} color="#fff"/>
          </div>
          <span className="disp" style={{fontSize:20,fontWeight:700,color:'#f8f4ed',letterSpacing:'-.01em'}}>Metro Events</span>
        </div>

        {/* Headline */}
        <h1 className="disp" style={{fontSize:'clamp(2rem,3.5vw,3rem)',fontWeight:700,color:'#f8f4ed',lineHeight:1.1,letterSpacing:'-.02em',marginBottom:16,position:'relative'}}>
          Command<br/><span style={{color:'var(--gold-lt)',fontStyle:'italic'}}>Center</span>
        </h1>
        <p style={{fontSize:14,color:'rgba(248,244,237,.5)',lineHeight:1.8,maxWidth:320,marginBottom:40,position:'relative'}}>
          {mode==='admin'
            ? 'Dual-factor staff access with role-based permissions and full audit logging.'
            : 'Client portal access — track your event, review proposals, and connect with your coordinator.'}
        </p>

        {/* Feature list */}
        <ul style={{listStyle:'none',position:'relative'}}>
          {(mode==='admin'?[
            {ic:Shield,t:'Role-based access control (RBAC)'},
            {ic:Activity,t:'Live audit trail for all actions'},
            {ic:Users,t:'Multi-role staff management'},
            {ic:BarChart2,t:'Real-time CRM & event pipeline'},
          ]:[
            {ic:Calendar,t:'Track your event milestones'},
            {ic:FileText,t:'Review proposals & approve quotes'},
            {ic:Bell,t:'Real-time updates from your coordinator'},
            {ic:ShieldCheck,t:'Secure bank-level data protection'},
          ]).map(({ic:Ic,t},i)=>(
            <li key={i} style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
              <div style={{width:30,height:30,background:'rgba(184,146,74,.12)',borderRadius:'var(--r-sm)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <Ic size={13} color='var(--gold-lt)'/>
              </div>
              <span style={{fontSize:13,color:'rgba(248,244,237,.6)'}}>{t}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── RIGHT PANEL — login form ── */}
      <div style={{flex:1,background:'var(--canvas)',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',padding:'40px 32px',overflowY:'auto'}}>
        <div style={{width:'100%',maxWidth:420}}>

          {/* Mode toggle */}
          <div style={{background:'#ebe7de',borderRadius:10,padding:5,display:'flex',marginBottom:32,gap:3}}>
            {[{id:'admin',label:'Staff Login'},{id:'client',label:'Client Portal'}].map(({id,label})=>(
              <button key={id} onClick={()=>switchMode(id)} style={{flex:1,padding:'10px 0',borderRadius:8,border:'none',fontSize:13,fontWeight:id===mode?600:500,cursor:'pointer',background:id===mode?'var(--surface)':'transparent',color:id===mode?'var(--tp)':'var(--tm)',boxShadow:id===mode?'var(--sh-sm)':'none',transition:'all var(--t-base)'}}>
                {label}
              </button>
            ))}
          </div>

          {/* ────────── ADMIN LOGIN ────────── */}
          {mode==='admin'&&(
            <div style={{animation:'fadeUp .3s ease'}}>
              {/* Header */}
              <div style={{marginBottom:24}}>
                <h2 style={{fontSize:22,fontWeight:700,color:'var(--tp)',marginBottom:4,letterSpacing:'-.02em'}}>
                  {step===1?'Welcome back':'Verify credentials'}
                </h2>
                <p style={{fontSize:13,color:'var(--ts)'}}>
                  {step===1?'Enter your system username to continue.':'Enter your password and role access code.'}
                </p>
              </div>

              {/* Step dots */}
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:24}}>
                {[1,2].map(s=>(
                  <div key={s} style={{display:'flex',alignItems:'center',gap:8,flex:1}}>
                    <div style={{width:22,height:22,borderRadius:'50%',background:step>=s?'var(--gold)':'var(--border)',border:`2px solid ${step>=s?'var(--gold)':'var(--border)'}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'all var(--t-base)'}}>
                      {step>s?<Check size={10} color='#fff' strokeWidth={3}/>:<span style={{fontSize:10,fontWeight:700,color:step>=s?'#fff':'var(--tm)'}}>{s}</span>}
                    </div>
                    <span style={{fontSize:11,fontWeight:600,color:step>=s?'var(--tp)':'var(--tm)'}}>{s===1?'Identity':'Credentials'}</span>
                    {s===1&&<div style={{flex:1,height:1,background:step>1?'var(--gold)':'var(--border)',transition:'background var(--t-slow)'}}/>}
                  </div>
                ))}
              </div>

              {step===1&&(
                <div>
                  <div style={{marginBottom:16}}>
                    <label style={lbl}>Username</label>
                    <div style={{position:'relative'}}>
                      <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',fontSize:13,color:'var(--tm)',fontFamily:"'DM Mono',monospace",pointerEvents:'none'}}>@</span>
                      <input autoFocus value={username} onChange={e=>{setUsername(e.target.value.replace(/\s/g,''));setErr('');}} onKeyDown={e=>e.key==='Enter'&&nextStep()} placeholder="e.g. mdelacruz" style={{...inpMono,paddingLeft:30}}/>
                    </div>
                    <div style={{fontSize:11,color:'var(--tm)',marginTop:5}}>Enter your assigned system username.</div>
                  </div>
                  {err&&<div role="alert" style={{padding:'10px 12px',background:'var(--danger-pale)',border:'1px solid rgba(184,60,60,.22)',borderRadius:'var(--r-sm)',fontSize:12,color:'var(--danger)',marginBottom:12,display:'flex',gap:7,alignItems:'center'}}><AlertCircle size={13}/>{err}</div>}
                  <GoldBtn onClick={nextStep} full disabled={loading}>
                    {loading?<><RefreshCw size={13} style={{animation:'spin 1s linear infinite'}}/>Checking...</>:<>Continue <ArrowRight size={13}/></>}
                  </GoldBtn>
                </div>
              )}

              {step===2&&resolvedUser&&(
                <div style={{animation:'fadeUp .25s ease'}}>
                  {/* Identity banner */}
                  <div style={{padding:'11px 14px',background:'var(--navy)',border:'1px solid rgba(184,146,74,.18)',borderRadius:'var(--r-md)',marginBottom:18,display:'flex',gap:11,alignItems:'center'}}>
                    <div style={{width:32,height:32,background:'linear-gradient(135deg,var(--navy-lt),#3a4568)',borderRadius:'50%',border:'1.5px solid rgba(184,146,74,.3)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                      <span className="disp" style={{fontSize:14,fontWeight:700,color:'var(--gold-lt)'}}>{(resolvedUser.name||'?').charAt(0)}</span>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:600,color:'#f8f4ed'}}>{resolvedUser.name}</div>
                      <div style={{display:'flex',alignItems:'center',gap:6,marginTop:3}}>
                        <Badge label={ROLE_LABEL[resolvedUser.role]} color={ROLE_COLOR[resolvedUser.role]||'grey'}/>
                        <span style={{fontSize:11,color:'rgba(248,244,237,.4)',fontFamily:"'DM Mono',monospace"}}>@{username}</span>
                      </div>
                    </div>
                    <button onClick={()=>{setStep(1);setPassword('');setCode('');setErr('');setResolvedUser(null);}} style={{background:'none',border:'none',cursor:'pointer',fontSize:11,color:'rgba(248,244,237,.4)',textDecoration:'underline'}}>Change</button>
                  </div>

                  {/* Password */}
                  <div style={{marginBottom:14}}>
                    <label style={lbl}>Password</label>
                    <div style={{position:'relative'}}>
                      <input autoFocus type={showPass?'text':'password'} value={password} onChange={e=>{setPassword(e.target.value);setErr('');}} onKeyDown={e=>e.key==='Enter'&&submitAdmin()} placeholder="Enter your password" style={{...inp,paddingRight:42}}/>
                      <button onClick={()=>setShowPass(!showPass)} style={eyeBtn} aria-label={showPass?'Hide':'Show'}>{showPass?<EyeOff size={15}/>:<Eye size={15}/>}</button>
                    </div>
                  </div>

                  {/* Access code */}
                  <div style={{marginBottom:16}}>
                    <label style={{...lbl,display:'flex',alignItems:'center',gap:5}}><Key size={10}/>Role Access Code</label>
                    <div style={{position:'relative'}}>
                      <input type={showCode?'text':'password'} value={code} onChange={e=>{setCode(e.target.value);setErr('');}} onKeyDown={e=>e.key==='Enter'&&submitAdmin()} placeholder="Role-specific access code" style={{...inp,paddingRight:42}}/>
                      <button onClick={()=>setShowCode(!showCode)} style={eyeBtn} aria-label={showCode?'Hide':'Show'}>{showCode?<EyeOff size={15}/>:<Eye size={15}/>}</button>
                    </div>
                    <div style={{fontSize:11,color:'var(--tm)',marginTop:4}}>Contact your administrator for your role access code.</div>
                  </div>

                  {err&&<div role="alert" style={{padding:'10px 12px',background:'var(--danger-pale)',border:'1px solid rgba(184,60,60,.22)',borderRadius:'var(--r-sm)',fontSize:12,color:'var(--danger)',marginBottom:12,display:'flex',gap:7,alignItems:'center'}}><AlertCircle size={13}/>{err}</div>}
                  <GoldBtn onClick={submitAdmin} full disabled={loading}>
                    {loading?<><RefreshCw size={13} style={{animation:'spin 1s linear infinite'}}/>Authenticating...</>:<><ShieldCheck size={13}/>Sign In Securely</>}
                  </GoldBtn>
                </div>
              )}
            </div>
          )}

          {/* ────────── CLIENT LOGIN ────────── */}
          {mode==='client'&&(
            <div style={{animation:'fadeUp .3s ease'}}>
              <div style={{marginBottom:24}}>
                <h2 style={{fontSize:22,fontWeight:700,color:'var(--tp)',marginBottom:4,letterSpacing:'-.02em'}}>Welcome back</h2>
                <p style={{fontSize:13,color:'var(--ts)'}}>Sign in to access your event portal.</p>
              </div>

              <div style={{marginBottom:14}}>
                <label style={lbl}>Email Address</label>
                <input type="email" value={cEmail} onChange={e=>{setCEmail(e.target.value);setCErr('');}} onKeyDown={e=>e.key==='Enter'&&submitClient()} placeholder="you@email.com" style={inp} autoFocus/>
              </div>

              <div style={{marginBottom:16}}>
                <label style={lbl}>Password</label>
                <div style={{position:'relative'}}>
                  <input type={cShowPass?'text':'password'} value={cPass} onChange={e=>{setCPass(e.target.value);setCErr('');}} onKeyDown={e=>e.key==='Enter'&&submitClient()} placeholder="Enter your password" style={{...inp,paddingRight:42}}/>
                  <button onClick={()=>setCShowPass(!cShowPass)} style={eyeBtn} aria-label={cShowPass?'Hide':'Show'}>{cShowPass?<EyeOff size={15}/>:<Eye size={15}/>}</button>
                </div>
              </div>

              {cErr&&<div role="alert" style={{padding:'10px 12px',background:'var(--danger-pale)',border:'1px solid rgba(184,60,60,.22)',borderRadius:'var(--r-sm)',fontSize:12,color:'var(--danger)',marginBottom:12,display:'flex',gap:7,alignItems:'center'}}><AlertCircle size={13}/>{cErr}</div>}

              <GoldBtn onClick={submitClient} full disabled={cLoading}>
                {cLoading?<><RefreshCw size={13} style={{animation:'spin 1s linear infinite'}}/>Signing in...</>:<>Sign In to Portal <ArrowRight size={13}/></>}
              </GoldBtn>

              <div style={{marginTop:16,padding:'12px 14px',background:'#f0ede5',border:'1px solid var(--border)',borderRadius:'var(--r-md)',fontSize:12,color:'var(--ts)',lineHeight:1.65}}>
                Don't have an account yet? Your Metro Events coordinator will send you an activation link after your first consultation.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


/* ══════════════════════════════════════════════════════
   NAV CONFIG
══════════════════════════════════════════════════════ */
const NAV = [
  {id:'dashboard',label:'Dashboard',icon:Home},
  {id:'crm',label:'CRM Pipeline',icon:BarChart2},
  {id:'checklist',label:'Master Checklist',icon:ClipboardList},
  {id:'crew',label:'Crew & Tasks',icon:Users},
  {id:'warehouse',label:'Warehouse',icon:Package},
  {id:'supplier',label:'Supplier Hub',icon:Building},
  {id:'quotation',label:'Quotation & Margins',icon:DollarSign},
  {id:'audit',label:'Audit & Permissions',icon:Shield},
];

/* ══════════════════════════════════════════════════════
   CHANGE PASSWORD MODAL
   Universal self-service credential reset for all roles.
   Admin validates against adminPassword state;
   Staff members validate against their own staff record.
   v2.3: Admin can also change their login username here.
══════════════════════════════════════════════════════ */
const ChangePasswordModal = ({user,staff,setStaff,adminPassword,setAdminPassword,adminUsername,setAdminUsername,onUsernameChange,onClose})=>{
  const [curPw,setCurPw]=useState('');
  const [newPw,setNewPw]=useState('');
  const [confPw,setConfPw]=useState('');
  // v2.3 — admin username change fields
  const [newUsername,setNewUsername]=useState('');
  const [showCur,setShowCur]=useState(false);
  const [showNew,setShowNew]=useState(false);
  const [showConf,setShowConf]=useState(false);
  const [err,setErr]=useState('');
  const [success,setSuccess]=useState(false);
  const [successMsg,setSuccessMsg]=useState('');

  const isAdmin=user.role==='admin';
  // Tracks whether the admin wants to change their username at all
  const wantsUsernameChange=isAdmin&&newUsername.trim().length>0;

  const submit=async ()=>{
    // Password fields are required only if any password field is filled,
    // OR if no username change is happening (i.e. something must change).
    const anyPwField=curPw||newPw||confPw;
    const changingPw=anyPwField||!wantsUsernameChange;

    if(changingPw){
      if(!curPw.trim()){setErr('Current password is required.');return;}
      if(!newPw.trim()||newPw.length<6){setErr('New password must be at least 6 characters.');return;}
      if(newPw!==confPw){setErr('New password and confirmation do not match.');return;}
      if(newPw===curPw){setErr('New password must be different from the current password.');return;}
    }

    // Validate current password
    if(isAdmin){
      if(changingPw&&curPw!==adminPassword){setErr('Current password is incorrect.');return;}
    } else {
      if(changingPw){
        // Re-authenticate via Supabase to verify current password — never stored in profiles.
        const staffRecord=staff.find(s=>s.id===user.staffId);
        if(!staffRecord||!staffRecord.email){setErr('Staff record not found. Contact your administrator.');return;}
        const {error:reAuthErr}=await supabase.auth.signInWithPassword({email:staffRecord.email,password:curPw});
        if(reAuthErr){setErr('Current password is incorrect.');return;}
      }
    }

    // Validate new username (admin only)
    if(wantsUsernameChange){
      const trimmed=newUsername.trim().toLowerCase();
      if(trimmed.length<3){setErr('New username must be at least 3 characters.');return;}
      if(/\s/.test(trimmed)){setErr('Username cannot contain spaces.');return;}
      // Ensure it does not conflict with any existing staff username
      const conflict=staff.some(s=>s.username.toLowerCase()===trimmed);
      if(conflict){setErr(`Username "${trimmed}" is already taken by a staff member. Choose a different one.`);return;}
    }

    // Apply changes
    if(isAdmin){
      if(changingPw) setAdminPassword(newPw);
      if(wantsUsernameChange){
        const trimmed=newUsername.trim().toLowerCase();
        setAdminUsername(trimmed);
        onUsernameChange&&onUsernameChange(trimmed);
      }
    } else {
      if(changingPw){
        // Persist new password to Supabase Auth — requires active crew session.
        const { error: pwErr } = await supabase.auth.updateUser({ password: newPw });
        if(pwErr){ setErr('Password update failed: ' + pwErr.message); return; }
        setStaff(prev=>prev.map(s=>s.id===user.staffId?{...s,password:newPw}:s));
      }
    }

    const changed=[];
    if(changingPw) changed.push('password');
    if(wantsUsernameChange) changed.push('username');
    setSuccessMsg(`Your ${changed.join(' and ')} ${changed.length>1?'have':'has'} been updated. This dialog will close automatically.`);
    setSuccess(true);
    setTimeout(()=>onClose(),1800);
  };

  const pwInput=(label,val,setVal,show,setShow,id)=>(
    <div style={{marginBottom:13}}>
      <label style={{fontSize:11,fontWeight:600,color:'var(--ts)',letterSpacing:'.05em',display:'block',marginBottom:5,textTransform:'uppercase'}}>{label}</label>
      <div style={{position:'relative'}}>
        <input
          id={id}
          type={show?'text':'password'}
          value={val}
          onChange={e=>{setVal(e.target.value);setErr('');}}
          onKeyDown={e=>e.key==='Enter'&&submit()}
          placeholder="••••••••"
          style={{width:'100%',padding:'9px 40px 9px 12px',background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:'var(--r-sm)',fontSize:13,color:'var(--tp)'}}
        />
        <button onClick={()=>setShow(!show)} aria-label={show?`Hide ${label.toLowerCase()}`:`Show ${label.toLowerCase()}`}
          style={{position:'absolute',right:11,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'var(--tm)',display:'flex',borderRadius:'var(--r-xs)',padding:2}}>
          {show?<EyeOff size={14} aria-hidden="true"/>:<Eye size={14} aria-hidden="true"/>}
        </button>
      </div>
    </div>
  );

  return(
    <Modal title="Change Credentials" onClose={onClose}>
      {success?(
        <div style={{textAlign:'center',padding:'28px 20px'}}>
          <div style={{width:48,height:48,background:'var(--success-pale)',border:'1.5px solid var(--success)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px'}}>
            <Check size={22} color='var(--success)' strokeWidth={3}/>
          </div>
          <div style={{fontSize:15,fontWeight:600,color:'var(--tp)',marginBottom:6}}>Credentials Updated</div>
          <div style={{fontSize:13,color:'var(--ts)'}}>{successMsg}</div>
        </div>
      ):(
        <>
          <div style={{padding:'10px 14px',background:'var(--navy)',borderRadius:'var(--r-md)',marginBottom:18,display:'flex',gap:10,alignItems:'center'}}>
            <Lock size={14} color='var(--gold)' aria-hidden="true"/>
            <div>
              <div style={{fontSize:12,fontWeight:600,color:'var(--sidebar-text)'}}>Secure Credential Reset</div>
              <div style={{fontSize:11,color:'var(--sidebar-text-dim)',marginTop:1}}>Updating credentials for <span style={{color:'var(--gold)'}}>{user.name}</span> · <span style={{fontFamily:"'DM Mono',monospace",fontSize:10}}>@{user.username}</span></div>
            </div>
          </div>

          {/* Password section */}
          <div style={{fontSize:10,fontWeight:600,color:'var(--ts)',letterSpacing:'.12em',textTransform:'uppercase',marginBottom:10,display:'flex',alignItems:'center',gap:6}}>
            <Lock size={10} aria-hidden="true"/>Change Password
          </div>
          {pwInput('Current Password',curPw,setCurPw,showCur,setShowCur,'cp-cur')}
          <div style={{height:1,background:'var(--border)',margin:'4px 0 13px'}}/>
          {pwInput('New Password',newPw,setNewPw,showNew,setShowNew,'cp-new')}
          {pwInput('Confirm New Password',confPw,setConfPw,showConf,setShowConf,'cp-conf')}

          {newPw&&newPw===confPw&&newPw!==curPw&&(
            <div style={{padding:'7px 12px',background:'var(--success-pale)',border:'1px solid rgba(38,112,72,.22)',borderRadius:'var(--r-sm)',fontSize:11,color:'var(--success)',marginBottom:12,display:'flex',gap:6,alignItems:'center'}}>
              <Check size={12} strokeWidth={3}/>Passwords match
            </div>
          )}

          {/* v2.3 — Admin username change section */}
          {isAdmin&&(
            <>
              <div style={{height:1,background:'var(--border)',margin:'16px 0 14px'}}/>
              <div style={{fontSize:10,fontWeight:600,color:'var(--ts)',letterSpacing:'.12em',textTransform:'uppercase',marginBottom:10,display:'flex',alignItems:'center',gap:6}}>
                <Hash size={10} aria-hidden="true"/>Change Login Username <span style={{color:'var(--tm)',fontSize:9,fontWeight:400,textTransform:'none',letterSpacing:0}}>(optional)</span>
              </div>
              <div style={{marginBottom:13}}>
                <label style={{fontSize:11,fontWeight:600,color:'var(--ts)',letterSpacing:'.05em',display:'block',marginBottom:5,textTransform:'uppercase'}}>New Username</label>
                <div style={{position:'relative'}}>
                  <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',fontSize:13,color:'var(--tm)',fontFamily:"'DM Mono',monospace",pointerEvents:'none'}}>@</span>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={e=>{setNewUsername(e.target.value.replace(/\s/g,'').toLowerCase());setErr('');}}
                    placeholder={`Current: ${user.username}`}
                    style={{width:'100%',padding:'9px 12px 9px 28px',background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:'var(--r-sm)',fontSize:13,color:'var(--tp)',fontFamily:"'DM Mono',monospace"}}
                  />
                </div>
                <div style={{fontSize:11,color:'var(--tm)',marginTop:4}}>Leave blank to keep current username. Must be unique, lowercase, no spaces.</div>
              </div>
            </>
          )}

          {err&&<div role="alert" style={{padding:'9px 12px',background:'var(--danger-pale)',border:`1px solid var(--danger-border)`,borderRadius:'var(--r-sm)',fontSize:12,color:'var(--danger)',marginBottom:12,display:'flex',gap:7,alignItems:'center'}}><AlertCircle size={13} aria-hidden="true"/>{err}</div>}

          <div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:6,flexWrap:'wrap'}}>
            <GhostBtn onClick={onClose}>Cancel</GhostBtn>
            <GoldBtn onClick={submit} disabled={!curPw&&!wantsUsernameChange}><Lock size={13}/>Update Credentials</GoldBtn>
          </div>
        </>
      )}
    </Modal>
  );
};

/* ══════════════════════════════════════════════════════
   ADMIN SHELL
══════════════════════════════════════════════════════ */
const AdminShell = ({user,onLogout,accessCodes,setAccessCodes,staff,setStaff,adminPassword,setAdminPassword,adminUsername,setAdminUsername,setUser,auditLogs,setAuditLogs})=>{
  // Restore last active tab from localStorage so a reload lands back where
  // the user was. Falls back to 'dashboard' if the saved tab doesn't exist
  // or the current role doesn't have access to it.
  const [tab,setTab]=useState(()=>{
    try{
      const saved=localStorage.getItem('metro_active_tab');
      if(saved&&ACCESS[user.role]?.includes(saved)) return saved;
    }catch(e){}
    return 'dashboard';
  });
  // Persist tab changes immediately so reloads restore the right view
  const navigateTo=(id)=>{setTab(id);try{localStorage.setItem('metro_active_tab',id);}catch(e){}};
  const [sideOpen,setSideOpen]=useState(false);
  // Optimistic-first: start from localStorage so the UI is instant on reload,
  // then fetch Supabase on mount and overwrite with the authoritative server state.
  const [events,setEvents]=useState(()=>{try{const s=localStorage.getItem('metro_events');return s?JSON.parse(s):EVENTS_INIT;}catch(e){return EVENTS_INIT;}});
  const [eventsLoading,setEventsLoading]=useState(true);

  // Write-through cache: keep localStorage in sync so the next page load is instant.
  useEffect(()=>{try{localStorage.setItem('metro_events',JSON.stringify(events));}catch(e){}},[events]);

  // ── Realtime sync ──────────────────────────────────────────────────────────
  // 1. Initial fetch: load all events from Supabase. If the table doesn't exist
  //    or the network is down, local events from localStorage are kept and pushed
  //    up to Supabase once they can reach it.
  // 2. Realtime channel: Supabase broadcasts every INSERT / UPDATE / DELETE to
  //    every connected browser instantly — no polling, no manual refresh needed.
  // ──────────────────────────────────────────────────────────────────────────
  const toLocal = r => ({
    id:r.id, client:r.client||'', event:r.event_name||'',
    date:r.date||'', venue:r.venue||'', pkg:r.pkg||'',
    coord:r.coord||'', value:Number(r.value)||0,
    balance:Number(r.balance)||0, stage:r.stage||'New Inquiry',
  });

  useEffect(()=>{
    // Use admin client for events reads/writes: admin user has no Supabase auth
    // session so the anon client is blocked by RLS on both SELECT and mutations.
    const evDb = supabaseAdmin ?? supabase;

    // Step 1: initial full load
    evDb.from('events').select('*').order('created_at',{ascending:false})
      .then(({data,error})=>{
        if(error){
          console.error('[events] initial fetch failed — check RLS or VITE_SUPABASE_SERVICE_KEY:',error.message);
          setEventsLoading(false);
          return;
        }
        const remote=(data||[]).map(toLocal);
        const remoteIds=new Set(remote.map(e=>e.id));
        setEvents(prev=>{
          const localOnly=prev.filter(e=>!remoteIds.has(e.id));
          if(localOnly.length>0){
            evDb.from('events').upsert(localOnly.map(e=>({
              id:e.id,client:e.client,event_name:e.event,date:e.date,
              venue:e.venue,pkg:e.pkg,coord:e.coord,
              value:e.value,balance:e.balance,stage:e.stage,
            }))).then(({error:uErr})=>{
              if(uErr) console.error('[events] local-only push failed:',uErr.message);
            });
          }
          return [...remote,...localOnly];
        });
        setEventsLoading(false);
      });

    // Step 2: live subscription — every browser sees changes immediately
    const channel = evDb
      .channel('events-realtime')
      .on('postgres_changes',{event:'INSERT',schema:'public',table:'events'},
        ({new:row})=>{ setEvents(prev=>prev.find(e=>e.id===row.id)?prev:[toLocal(row),...prev]); })
      .on('postgres_changes',{event:'UPDATE',schema:'public',table:'events'},
        ({new:row})=>{ setEvents(prev=>prev.map(e=>e.id===row.id?toLocal(row):e)); })
      .on('postgres_changes',{event:'DELETE',schema:'public',table:'events'},
        ({old:row})=>{ setEvents(prev=>prev.filter(e=>e.id!==row.id)); })
      .subscribe(status=>{
        if(status==='SUBSCRIBED') console.info('[events] realtime connected');
        if(status==='CHANNEL_ERROR') console.warn('[events] realtime error — enable Realtime in Supabase dashboard for the events table');
      });

    return ()=>{ evDb.removeChannel(channel); };
  },[]);
  const [showChangePw,setShowChangePw]=useState(false);

  /* Centralized audit logger — stamps current user and persists to Supabase */
  const addLog=(action,target,sev='info')=>{
    const ts=new Date().toLocaleString('en-PH',{timeZone:'Asia/Manila',hour12:false});
    const localId='L-'+Date.now();
    // Optimistic local update so the UI reflects immediately
    setAuditLogs(prev=>[{id:localId,ts,user:user.name,role:user.role,action,target,sev},...prev].slice(0,500));
    // Persist to Supabase so all browsers see the entry.
    // Admin has no Supabase auth session — use service-role client to bypass RLS.
    (supabaseAdmin??supabase).from('audit_logs').insert({ts,user_name:user.name,role:user.role,action,target,sev})
      .then(({error})=>{if(error)console.error('[audit] write failed:',error.message);});
  };

  const allowed=ACCESS[user.role]||[];
  const visibleNav=NAV.filter(()=>true);

  const SideLink=({t})=>{
    const Ic=t.icon;
    const active=tab===t.id;
    const locked=!allowed.includes(t.id);
    return(
      <button
        onClick={()=>{navigateTo(t.id);setSideOpen(false);}}
        aria-current={active?'page':undefined}
        aria-label={locked?`${t.label} (access restricted)`:t.label}
        style={{
          display:'flex',alignItems:'center',gap:10,padding:'9px 12px',
          borderRadius:'var(--r-md)',width:'100%',textAlign:'left',cursor:'pointer',
          background:active?'var(--sidebar-active-bg)':'transparent',
          border:`1px solid ${active?'var(--sidebar-active-bdr)':'transparent'}`,
          color:active?'var(--gold-lt)':locked?'var(--sidebar-text-faint)':'var(--sidebar-text-dim)',
          fontSize:12,fontWeight:active?600:400,letterSpacing:'.02em',
          transition:'all var(--t-base)',
        }}
        onMouseEnter={e=>{if(!active)e.currentTarget.style.background='var(--sidebar-hover)'}}
        onMouseLeave={e=>{if(!active)e.currentTarget.style.background='transparent'}}>
        <Ic size={14} aria-hidden="true" color={active?'var(--gold)':locked?'var(--sidebar-text-faint)':'var(--sidebar-text-dim)'}/>
        <span style={{flex:1}}>{t.label}</span>
        {locked&&<Lock size={10} aria-hidden="true" color='var(--sidebar-text-faint)'/>}
      </button>
    );
  };

  const content={
    dashboard:<DashboardView events={events} role={user.role} staff={staff}/>,
    crm:<CRMView events={events} setEvents={setEvents} role={user.role} staff={staff} addLog={addLog}/>,
    checklist:<ChecklistView role={user.role} events={events} staff={staff} addLog={addLog}/>,
    crew:<CrewView role={user.role} accessCodes={accessCodes} staff={staff} setStaff={setStaff} currentUserId={user.staffId} addLog={addLog}/>,
    warehouse:<WarehouseView role={user.role} events={events} addLog={addLog}/>,
    supplier:<SupplierView role={user.role} addLog={addLog}/>,
    quotation:<QuotationView role={user.role}/>,
    audit:<AuditView role={user.role} accessCodes={accessCodes} setAccessCodes={setAccessCodes} auditLogs={auditLogs} addLog={addLog} setAuditLogs={setAuditLogs}/>,
  };

  /* ── Change Password trigger button (reused in both sidebars) ── */
  const ChangePwBtn=({mobile=false})=>(
    <button
      onClick={()=>setShowChangePw(true)}
      aria-label="Change your password"
      style={{
        display:'flex',alignItems:'center',gap:8,
        padding:mobile?'7px 12px':'7px 12px',
        borderRadius:'var(--r-md)',
        background:'transparent',
        border:'1px solid rgba(184,146,74,.18)',
        cursor:'pointer',width:'100%',
        color:'rgba(248,244,237,.45)',fontSize:11,
        transition:'all var(--t-base)',
      }}
      onMouseEnter={e=>{e.currentTarget.style.background='rgba(184,146,74,.1)';e.currentTarget.style.color='var(--gold-lt)';e.currentTarget.style.borderColor='rgba(184,146,74,.35)';}}
      onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='rgba(248,244,237,.45)';e.currentTarget.style.borderColor='rgba(184,146,74,.18)';}}
    >
      <Lock size={11} aria-hidden="true"/>
      <span>Change Password</span>
    </button>
  );

  return(
    <div style={{display:'flex',minHeight:'100vh',background:'var(--canvas)'}}>
      {sideOpen&&<div className="ovly" onClick={()=>setSideOpen(false)}/>}

      {/* Desktop Sidebar */}
      <aside style={{width:'var(--sidebar-w)',background:'var(--navy)',display:'flex',flexDirection:'column',position:'fixed',left:0,top:0,bottom:0,zIndex:90}} className="hide-m">
        <div style={{padding:'22px 18px 18px',borderBottom:'1px solid var(--sidebar-bdr)'}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:30,height:30,background:'linear-gradient(135deg,var(--gold),var(--gold-lt))',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,boxShadow:'0 2px 8px rgba(184,146,74,.35)'}}>
              <Briefcase size={13} color="#fff"/>
            </div>
            <div>
              <div className="disp" style={{fontSize:16,fontWeight:700,color:'#f8f4ed',letterSpacing:'-.01em',lineHeight:1.1}}>Metro Events</div>
              <div style={{fontSize:9,color:'var(--sidebar-text-faint)',letterSpacing:'.12em',textTransform:'uppercase',marginTop:2}}>
                {(['admin','coordinator','designer','warehouse'].includes(user.role))?'Command Center':'Client Portal'}
              </div>
            </div>
          </div>
        </div>
        <div style={{padding:'14px 16px',borderBottom:'1px solid var(--sidebar-sep)'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
            <div style={{width:34,height:34,background:'linear-gradient(135deg,var(--navy-lt),#3a4568)',borderRadius:'50%',border:'1.5px solid var(--gold-border-hair)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <span className="disp" style={{fontSize:15,fontWeight:700,color:'var(--gold-lt)'}}>{(user.name||'?').charAt(0).toUpperCase()}</span>
            </div>
            <div style={{overflow:'hidden',flex:1}}>
              <div style={{fontSize:12,fontWeight:600,color:'var(--sidebar-text)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',marginBottom:3}}>{user.name}</div>
              <Badge label={ROLE_LABEL[user.role]||user.role} color={ROLE_COLOR[user.role]||'grey'}/>
            </div>
          </div>
          <ChangePwBtn/>
        </div>
        <nav style={{padding:'12px 10px',flex:1,overflowY:'auto'}}>
          <div style={{fontSize:8,fontWeight:700,color:'var(--sidebar-text-ghost)',letterSpacing:'.18em',textTransform:'uppercase',padding:'0 4px',marginBottom:8}}>Modules</div>
          {visibleNav.map(t=><SideLink key={t.id} t={t}/>)}
        </nav>
        <div style={{padding:'12px 10px',borderTop:'1px solid var(--sidebar-sep)'}}>
          <button onClick={onLogout}
            style={{display:'flex',alignItems:'center',gap:9,padding:'9px 12px',borderRadius:'var(--r-md)',background:'transparent',border:'1px solid transparent',cursor:'pointer',width:'100%',color:'var(--sidebar-text-dim)',fontSize:12,fontWeight:400,transition:'all var(--t-base)'}}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(184,60,60,.12)';e.currentTarget.style.color='rgba(220,150,150,.85)';e.currentTarget.style.borderColor='rgba(184,60,60,.2)';}}
            onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='var(--sidebar-text-dim)';e.currentTarget.style.borderColor='transparent';}}>
            <LogOut size={13}/> Sign Out
          </button>
        </div>
      </aside>
      {/* Mobile sidebar */}
      <aside style={{width:260,background:'var(--navy)',display:'flex',flexDirection:'column',position:'fixed',left:0,top:0,bottom:0,zIndex:91,transform:sideOpen?'translateX(0)':'translateX(-100%)',transition:'transform var(--t-slow)'}} className="show-m">
        <div style={{padding:'18px 16px 14px',borderBottom:'1px solid rgba(184,146,74,.12)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span className="disp" style={{fontSize:16,fontWeight:700,color:'#f8f4ed'}}>Admin Center</span>
          <button onClick={()=>setSideOpen(false)} style={{background:'none',border:'none',cursor:'pointer',display:'flex'}}><X size={18} color='rgba(248,244,237,.5)'/></button>
        </div>
        {/* Mobile user block */}
        <div style={{padding:'10px 12px',borderBottom:'1px solid rgba(255,255,255,.05)'}}>
          <div style={{fontSize:12,fontWeight:600,color:'#f8f4ed',marginBottom:2}}>{user.name}</div>
          <Badge label={ROLE_LABEL[user.role]} color={ROLE_COLOR[user.role]||'grey'}/>
          <div style={{marginTop:8}}>
            <ChangePwBtn mobile/>
          </div>
        </div>
        <nav style={{padding:'10px 8px',flex:1,overflowY:'auto'}}>
          {visibleNav.map(t=><SideLink key={t.id} t={t}/>)}
        </nav>
        <div style={{padding:'10px 8px',borderTop:'1px solid rgba(255,255,255,.05)'}}>
          <button onClick={onLogout} style={{display:'flex',alignItems:'center',gap:8,padding:'8px 12px',borderRadius:'var(--r-md)',background:'transparent',border:'none',cursor:'pointer',width:'100%',color:'rgba(248,244,237,.4)',fontSize:12}}>
            <LogOut size={13}/> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile topbar */}
      <div className="show-m" style={{display:'none',position:'fixed',top:0,left:0,right:0,zIndex:80,background:'var(--navy)',borderBottom:'1px solid rgba(184,146,74,.14)',padding:'0 16px',height:56,alignItems:'center',justifyContent:'space-between'}}>
        <button onClick={()=>setSideOpen(true)} style={{background:'none',border:'none',cursor:'pointer',display:'flex'}}><Menu size={20} color='rgba(248,244,237,.6)'/></button>
        <span className="disp" style={{fontSize:16,fontWeight:700,color:'#f8f4ed'}}>{NAV.find(n=>n.id===tab)?.label||'Dashboard'}</span>
        <Badge label={user.role} color={ROLE_COLOR[user.role]||'grey'}/>
      </div>

      {/* Main content */}
      <main className="admin-main" style={{marginLeft:'var(--sidebar-w)',flex:1,padding:'32px 36px',minHeight:'100vh',overflowX:'hidden'}}>        <div style={{maxWidth:1100,margin:'0 auto'}}>
          {content[tab]}
        </div>
      </main>

      {/* Change Password Modal — rendered at shell root so it overlays everything */}
      {showChangePw&&(
        <ChangePasswordModal
          user={user}
          staff={staff}
          setStaff={setStaff}
          adminPassword={adminPassword}
          setAdminPassword={setAdminPassword}
          adminUsername={adminUsername}
          setAdminUsername={setAdminUsername}
          onUsernameChange={(newU)=>setUser(prev=>({...prev,username:newU}))}
          onClose={()=>setShowChangePw(false)}
        />
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   APP ROOT
══════════════════════════════════════════════════════ */
const SESSION_KEY='metro_session_v1';

export default function AdminApp(){
  const [view,setView]=useState(()=>{try{const s=JSON.parse(localStorage.getItem(SESSION_KEY)||'null');return s?.view==='shell'&&s?.user?'shell':'auth';}catch(e){return 'auth';}});
  const [user,setUser]=useState(()=>{try{const s=JSON.parse(localStorage.getItem(SESSION_KEY)||'null');return s?.view==='shell'&&s?.user?s.user:null;}catch(e){return null;}});
  const [accessCodes,setAccessCodes]=useState(ACCESS_CODES_INIT);
  const [staff,setStaff]=useState([]);

  // Load persisted access codes from Supabase on mount; fall back to defaults if table not yet seeded
  useEffect(()=>{
    supabase.from('app_settings').select('key,value').in('key',['access_code_coordinator','access_code_designer','access_code_warehouse'])
      .then(({data})=>{
        if(data&&data.length){
          const map={};
          data.forEach(r=>{map[r.key.replace('access_code_','')]=r.value;});
          setAccessCodes(p=>({...p,...map}));
        }
      });
  },[]);

  useEffect(()=>{
    supabase.from('profiles').select('*').then(({data})=>{
      // Normalise: ensure every staff record exposes `.name` regardless of
      // whether the DB column is called full_name or name.
      // Default `active` to true — profiles table may not have this column;
      // undefined is falsy and would silently filter out every staff member.
      if(data) setStaff(data.map(s=>({...s, name: s.name ?? s.full_name ?? '', active: s.active ?? true})));
    });
  },[]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        supabase.from('profiles').select('*').eq('id', session.user.id).single()
          .then(({ data }) => {
            if (data) {
              setUser({...data, name: data.full_name});
              setView("shell");
            }
          });
      }
    });
  }, []);

  const [adminPassword,setAdminPassword]=useState(ADMIN_PASSWORD_DEFAULT);
  const [adminUsername,setAdminUsername]=useState(ADMIN_USERNAME);
  const [auditLogs,setAuditLogs]=useState([]);
  // Fetch all audit logs from Supabase on mount so every browser sees full history
  useEffect(()=>{
    supabase.from('audit_logs').select('*').order('created_at',{ascending:false}).limit(500)
      .then(({data,error})=>{
        if(data&&!error){
          setAuditLogs(data.map(r=>({id:r.id,ts:r.ts,user:r.user_name,role:r.role,action:r.action,target:r.target,sev:r.sev})));
        }
      });
  },[]);

  // Session restored synchronously via lazy useState — no useEffect flash

  const handleLogin = async (userObj) => {
    const { username, password, role } = userObj;

    // Admin uses hardcoded credentials — no Supabase auth account needed.
    // Password + access code were already validated in AuthScreen.submit().
    if (role === 'admin') {
      const adminUser = { name: 'Administrator', role: 'admin', username, staffId: null };
      setUser(adminUser);
      setView("shell");
      try { localStorage.setItem(SESSION_KEY, JSON.stringify({ user: adminUser, view: "shell" })); } catch(e) {}
      const ts = new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila', hour12: false });
      setAuditLogs(prev => [{ id: 'L-' + Date.now(), ts, user: 'Administrator', role: 'admin', action: 'Logged in', target: username, sev: 'info' }, ...prev]);
      // Admin has no Supabase auth session — use service-role client to bypass RLS
      (supabaseAdmin??supabase).from('audit_logs').insert({ts, user_name:'Administrator', role:'admin', action:'Logged in', target:username, sev:'info'})
        .then(({error})=>{if(error)console.error('[audit] login write failed:',error.message);});
      return;
    }

    // Step 1: get email from profiles table using username
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username.toLowerCase())
      .single();

    if (profileError || !profileData) {
      alert('Login failed: User profile not found.');
      return;
    }

    const email = profileData.email;

    if (!email) {
      alert('Login failed: No email associated with this account. Contact your administrator.');
      return;
    }

    // Step 2: sign in with email + password
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { alert('Login failed: ' + error.message); return; }

    setUser({...profileData, name: profileData.full_name});
    setView("shell");
    try { localStorage.setItem(SESSION_KEY, JSON.stringify({ user: {...profileData, name: profileData.full_name}, view: "shell" })); } catch(e) {}

    const ts = new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila', hour12: false });
    setAuditLogs(prev => [{ id: 'L-' + Date.now(), ts, user: profileData.full_name, role: profileData.role, action: 'Logged in', target: profileData.username, sev: 'info' }, ...prev]);
    (supabaseAdmin??supabase).from('audit_logs').insert({ts, user_name:profileData.full_name, role:profileData.role, action:'Logged in', target:profileData.username, sev:'info'})
      .then(({error})=>{if(error)console.error('[audit] login write failed:',error.message);});
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setView("auth");
    // Audit logs are intentionally preserved across logout — they are a tamper-evident
    // historical record and must not be wiped when a session ends.
    try { localStorage.removeItem(SESSION_KEY); } catch(e) {}
  };

  // Client portal login — Supabase auth already completed inside AuthScreen.
  // We receive the full profile record back; just persist the session and set state.
  const handleClientLogin = (profileData) => {
    const clientUser = { ...profileData, name: profileData.full_name || profileData.name || profileData.email, role: profileData.role || 'client' };
    setUser(clientUser);
    setView("shell");
    try { localStorage.setItem(SESSION_KEY, JSON.stringify({ user: clientUser, view: "shell" })); } catch(e) {}
    const ts = new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila', hour12: false });
    setAuditLogs(prev => [{ id: 'L-' + Date.now(), ts, user: clientUser.name, role: clientUser.role, action: 'Client signed in', target: profileData.email || '', sev: 'info' }, ...prev]);
    (supabaseAdmin??supabase).from('audit_logs').insert({ ts, user_name: clientUser.name, role: clientUser.role, action: 'Client signed in', target: profileData.email || '', sev: 'info' })
      .then(({ error }) => { if (error) console.error('[audit] client login write failed:', error.message); });
  };

  return(
    <>
      <style>{STYLES}</style>
      {view==='auth'&&(
        <AuthScreen
          onLogin={handleLogin}
          onClientLogin={handleClientLogin}
          accessCodes={accessCodes}
          staff={staff}
          adminPassword={adminPassword}
          adminUsername={adminUsername}
        />
      )}
      {view==='shell'&&user&&(
        <AdminShell
          user={user}
          setUser={setUser}
          onLogout={handleLogout}
          accessCodes={accessCodes}
          setAccessCodes={setAccessCodes}
          staff={staff}
          setStaff={setStaff}
          adminPassword={adminPassword}
          setAdminPassword={setAdminPassword}
          adminUsername={adminUsername}
          setAdminUsername={setAdminUsername}
          auditLogs={auditLogs}
          setAuditLogs={setAuditLogs}
        />
      )}
    </>
  );
}
