import { useState, useReducer, useEffect, useRef } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  ChevronUp, ChevronDown, Check, Search, Plus, Trash2, Copy,
  GripVertical, ChevronLeft, Play, Trophy, Flame, X, Volume2,
  VolumeX, Home, Dumbbell, BookOpen, TrendingUp, Star, ArrowRight,
  RefreshCw, Info, Heart, AlertCircle, ChevronRight, RotateCcw
} from "lucide-react";

// ─── EXERCISES DATABASE ───────────────────────────────────────────────────────

const EXERCISES_DB = [
  { id: "bench",        name: "Bench Press",             muscle: "Chest",      equipment: "Barbell",    defaultSets: 3, defaultReps: 12, lastWeight: 185, pr: 225, tags: ["push","compound"] },
  { id: "incline_db",   name: "Incline DB Press",        muscle: "Chest",      equipment: "Dumbbell",   defaultSets: 3, defaultReps: 12, lastWeight: 65,  pr: 80,  tags: ["push","compound"] },
  { id: "cable_fly",    name: "Cable Fly",               muscle: "Chest",      equipment: "Cable",      defaultSets: 3, defaultReps: 15, lastWeight: 35,  pr: 45,  tags: ["push","isolation"] },
  { id: "lat_pulldown", name: "Lat Pulldown",            muscle: "Back",       equipment: "Machine",    defaultSets: 3, defaultReps: 12, lastWeight: 120, pr: 150, tags: ["pull","compound"] },
  { id: "seated_row",   name: "Seated Cable Row",        muscle: "Back",       equipment: "Cable",      defaultSets: 3, defaultReps: 12, lastWeight: 110, pr: 140, tags: ["pull","compound"] },
  { id: "pullup",       name: "Pull-Up",                 muscle: "Back",       equipment: "Bodyweight", defaultSets: 3, defaultReps: 10, lastWeight: 0,   pr: 0,   tags: ["pull","compound"] },
  { id: "row",          name: "Barbell Row",             muscle: "Back",       equipment: "Barbell",    defaultSets: 3, defaultReps: 12, lastWeight: 135, pr: 165, tags: ["pull","compound"] },
  { id: "legpress",     name: "Leg Press",               muscle: "Legs",       equipment: "Machine",    defaultSets: 3, defaultReps: 12, lastWeight: 270, pr: 360, tags: ["legs","compound"] },
  { id: "squat",        name: "Goblet Squat",            muscle: "Legs",       equipment: "Dumbbell",   defaultSets: 3, defaultReps: 12, lastWeight: 60,  pr: 80,  tags: ["legs","compound"] },
  { id: "leg_ext",      name: "Leg Extension",           muscle: "Legs",       equipment: "Machine",    defaultSets: 3, defaultReps: 15, lastWeight: 90,  pr: 120, tags: ["legs","isolation"] },
  { id: "rdl",          name: "Romanian Deadlift",       muscle: "Hamstrings", equipment: "Barbell",    defaultSets: 3, defaultReps: 12, lastWeight: 155, pr: 185, tags: ["legs","compound"] },
  { id: "leg_curl",     name: "Leg Curl",                muscle: "Hamstrings", equipment: "Machine",    defaultSets: 3, defaultReps: 15, lastWeight: 80,  pr: 100, tags: ["legs","isolation"] },
  { id: "calf_raise",   name: "Calf Raise",              muscle: "Calves",     equipment: "Machine",    defaultSets: 4, defaultReps: 15, lastWeight: 120, pr: 160, tags: ["legs","isolation"] },
  { id: "ohp",          name: "DB Shoulder Press",       muscle: "Shoulders",  equipment: "Dumbbell",   defaultSets: 3, defaultReps: 12, lastWeight: 45,  pr: 60,  tags: ["push","compound"],  note: "Seated. All 3 delt heads. Safer for 45+ than barbell OHP." },
  { id: "arnold_press", name: "Arnold Press",            muscle: "Shoulders",  equipment: "Dumbbell",   defaultSets: 3, defaultReps: 12, lastWeight: 35,  pr: 45,  tags: ["push","compound"],  note: "Rotational press hits all 3 heads in one movement." },
  { id: "lat_raise",    name: "Lateral Raise",           muscle: "Shoulders",  equipment: "Dumbbell",   defaultSets: 3, defaultReps: 15, lastWeight: 20,  pr: 30,  tags: ["push","isolation"], note: "Primary medial delt builder. Key for shoulder width." },
  { id: "cable_lat",    name: "Cable Lateral Raise",     muscle: "Shoulders",  equipment: "Cable",      defaultSets: 3, defaultReps: 15, lastWeight: 15,  pr: 22,  tags: ["push","isolation"], note: "Constant tension through full ROM vs dumbbell drop-off." },
  { id: "front_raise",  name: "Front Raise",             muscle: "Shoulders",  equipment: "Dumbbell",   defaultSets: 3, defaultReps: 12, lastWeight: 20,  pr: 25,  tags: ["push","isolation"], note: "Anterior delt isolation. Control the eccentric." },
  { id: "rear_delt_fly",name: "Rear Delt Fly",           muscle: "Shoulders",  equipment: "Dumbbell",   defaultSets: 3, defaultReps: 15, lastWeight: 15,  pr: 20,  tags: ["pull","isolation"], note: "Critical for posture balance and rotator cuff health." },
  { id: "face_pull",    name: "Face Pull",               muscle: "Shoulders",  equipment: "Cable",      defaultSets: 3, defaultReps: 15, lastWeight: 40,  pr: 55,  tags: ["pull","isolation"], note: "Rear delt + rotator cuff. Essential at 45+ for shoulder longevity." },
  { id: "upright_row",  name: "Cable Upright Row",       muscle: "Shoulders",  equipment: "Cable",      defaultSets: 3, defaultReps: 12, lastWeight: 55,  pr: 70,  tags: ["pull","compound"],  note: "Cable version reduces impingement risk vs barbell." },
  { id: "shrug",        name: "DB Shrug",                muscle: "Shoulders",  equipment: "Dumbbell",   defaultSets: 3, defaultReps: 15, lastWeight: 60,  pr: 80,  tags: ["pull","isolation"], note: "Upper trap hypertrophy. Hold the top contraction 1 sec." },
  { id: "banded_ext",   name: "Band Pull-Apart",         muscle: "Shoulders",  equipment: "Band",       defaultSets: 3, defaultReps: 20, lastWeight: 0,   pr: 0,   tags: ["pull","isolation"], note: "Shoulder health + rear delt activation. Great as warm-up." },
  { id: "lyd_raise",    name: "Lying Y Raise",           muscle: "Shoulders",  equipment: "Dumbbell",   defaultSets: 3, defaultReps: 15, lastWeight: 10,  pr: 15,  tags: ["pull","isolation"], note: "Lower trap + rear delt. Underrated for shoulder stability." },
  { id: "curl",         name: "Dumbbell Curl",           muscle: "Biceps",     equipment: "Dumbbell",   defaultSets: 3, defaultReps: 12, lastWeight: 35,  pr: 45,  tags: ["pull","isolation"] },
  { id: "hammer_curl",  name: "Hammer Curl",             muscle: "Biceps",     equipment: "Dumbbell",   defaultSets: 3, defaultReps: 12, lastWeight: 35,  pr: 45,  tags: ["pull","isolation"] },
  { id: "tricep_push",  name: "Tricep Pushdown",         muscle: "Triceps",    equipment: "Cable",      defaultSets: 3, defaultReps: 15, lastWeight: 55,  pr: 70,  tags: ["push","isolation"] },
  { id: "overhead_tri", name: "Overhead Tricep Ext",     muscle: "Triceps",    equipment: "Dumbbell",   defaultSets: 3, defaultReps: 12, lastWeight: 40,  pr: 55,  tags: ["push","isolation"] },
];

// ─── PHYSICAL THERAPY DATABASE ────────────────────────────────────────────────

const PT_INJURIES = [
  {
    id: "rotator_cuff",
    name: "Rotator Cuff",
    icon: "🔄",
    color: "#00D4FF",
    subtitle: "Strain / Partial Tear / Tendinitis",
    description: "Rotator cuff injuries affect the supraspinatus, infraspinatus, teres minor, and subscapularis. PT focuses on restoring pain-free ROM, strengthening the cuff, and correcting scapular mechanics.",
    disclaimer: "Stop if you feel sharp or pinching pain. Consult your physio before progressing.",
    phases: [
      {
        phase: "PHASE 1", label: "Pain Relief & ROM", weeks: "Weeks 1–3", color: "#4ade80",
        goal: "Reduce inflammation, restore passive range of motion, activate scapular stabilizers.",
        exercises: [
          { id: "pt_pendulum",      name: "Pendulum Circles",          sets: 2, reps: "20 circles each direction", equipment: "Bodyweight", cue: "Lean forward, let arm hang. Gentle gravity-assisted ROM. NO active muscular effort.", caution: false },
          { id: "pt_passive_er",    name: "Passive External Rotation", sets: 3, reps: "15 reps",                   equipment: "Wand/Stick",  cue: "Use uninjured arm to push injured arm into external rotation. Hold 2 sec at end range.", caution: false },
          { id: "pt_scap_squeeze",  name: "Scapular Retraction",       sets: 3, reps: "15 reps, 5 sec hold",       equipment: "Bodyweight", cue: "Sitting tall, squeeze shoulder blades together and down. Avoid shrugging.", caution: false },
          { id: "pt_doorway",       name: "Doorway Pec Stretch",       sets: 3, reps: "30 sec hold",               equipment: "Doorway",    cue: "Forearm on doorframe, elbow at 90°. Gentle lean forward. Stop before pain.", caution: false },
        ]
      },
      {
        phase: "PHASE 2", label: "Cuff Activation", weeks: "Weeks 3–7", color: "#E8FF47",
        goal: "Begin isolated rotator cuff strengthening with very light resistance — band or light dumbbell only.",
        exercises: [
          { id: "pt_ir_band",       name: "Internal Rotation (Band)",  sets: 3, reps: "15 reps",                   equipment: "Band",       cue: "Elbow at 90°, arm at side. Rotate inward against band. SLOW — 3 sec concentric, 3 sec eccentric.", caution: false },
          { id: "pt_er_band",       name: "External Rotation (Band)",  sets: 3, reps: "15 reps",                   equipment: "Band",       cue: "Elbow at 90°, arm at side. Rotate outward against band. Keep elbow tight to body.", caution: false },
          { id: "pt_sidelying_er",  name: "Side-Lying Ext. Rotation",  sets: 3, reps: "12 reps",                   equipment: "Dumbbell",   cue: "Lie on non-affected side, elbow bent 90°. Lift forearm up slowly. Use 1–3 lb max.", caution: false },
          { id: "pt_t_raise",       name: "T-Raise (Prone)",           sets: 3, reps: "12 reps",                   equipment: "Dumbbell",   cue: "Face-down on bench, arms out to side in T. Lift to shoulder height only. Very light weight.", caution: false },
          { id: "pt_wall_slide",    name: "Wall Slide",                sets: 3, reps: "12 reps",                   equipment: "Wall",       cue: "Back against wall, arms at 90°. Slide arms up overhead maintaining wall contact. Stop at pain.", caution: false },
        ]
      },
      {
        phase: "PHASE 3", label: "Strengthening & Load", weeks: "Weeks 7–14", color: "#FF9900",
        goal: "Progressive loading of cuff and periscapular muscles. Return to pain-free overhead movement.",
        exercises: [
          { id: "pt_fullcan",       name: "Full Can Raise",             sets: 3, reps: "12–15 reps",               equipment: "Dumbbell",   cue: "Arm at 30° forward, thumb up. Raise to shoulder height only. Do NOT go overhead yet.", caution: false },
          { id: "pt_facepull_pt",   name: "Face Pull (Light)",          sets: 3, reps: "15 reps",                  equipment: "Band/Cable", cue: "Pull to forehead, elbows high. External rotation at end range. This is the gold standard cuff exercise.", caution: false },
          { id: "pt_prone_y",       name: "Prone Y Raise",              sets: 3, reps: "12 reps",                  equipment: "Dumbbell",   cue: "Face-down on bench, arms form Y overhead. Light weight. Trains lower trap — key for impingement prevention.", caution: false },
          { id: "pt_pushup_plus",   name: "Push-Up Plus",               sets: 3, reps: "12 reps",                  equipment: "Bodyweight", cue: "At top of push-up, protract scapula (round upper back). Trains serratus anterior — prevents impingement.", caution: true, cautionText: "Only if pain-free at shoulder" },
          { id: "pt_db_press_lt",   name: "DB Press (Light, Seated)",   sets: 3, reps: "12 reps",                  equipment: "Dumbbell",   cue: "Elbows at 45°, NOT flared to 90°. Light weight only. Stop 15° short of full lockout overhead.", caution: true, cautionText: "Add only when fully pain-free overhead" },
        ]
      },
    ]
  },
  {
    id: "shoulder_impingement",
    name: "Shoulder Impingement",
    icon: "⚡",
    color: "#E8FF47",
    subtitle: "Subacromial Impingement Syndrome",
    description: "Impingement occurs when the rotator cuff tendons are pinched under the acromion during overhead movement. PT targets scapular upward rotation, posterior capsule flexibility, and cuff strengthening.",
    disclaimer: "Avoid any overhead pressing or reaching above shoulder height during Phase 1.",
    phases: [
      {
        phase: "PHASE 1", label: "Decompress & Stretch", weeks: "Weeks 1–4", color: "#4ade80",
        goal: "Reduce impingement space compression. Stretch posterior capsule. Restore scapular mechanics.",
        exercises: [
          { id: "pt_sleeper",       name: "Sleeper Stretch",            sets: 3, reps: "30 sec hold",               equipment: "Bodyweight", cue: "Lie on affected shoulder, elbow at 90°. Use other hand to gently press forearm down. Stretches posterior capsule.", caution: false },
          { id: "pt_cross_body",    name: "Cross-Body Stretch",         sets: 3, reps: "30 sec hold",               equipment: "Bodyweight", cue: "Pull affected arm across chest with other hand. Hold at mild stretch. Do not force.", caution: false },
          { id: "pt_scap_squeeze",  name: "Scapular Retraction",        sets: 3, reps: "15 reps, 5 sec hold",       equipment: "Bodyweight", cue: "Squeeze shoulder blades together and DOWN. The downward component opens the subacromial space.", caution: false },
          { id: "pt_pec_minor",     name: "Pec Minor Stretch",          sets: 3, reps: "30 sec hold",               equipment: "Doorway",    cue: "Forearm on frame, elbow BELOW shoulder height. Tightness here tilts scapula forward, worsening impingement.", caution: false },
        ]
      },
      {
        phase: "PHASE 2", label: "Scapular Control", weeks: "Weeks 4–8", color: "#E8FF47",
        goal: "Strengthen lower trapezius and serratus anterior to improve scapular upward rotation.",
        exercises: [
          { id: "pt_band_pull",     name: "Band Pull-Apart",            sets: 3, reps: "20 reps",                   equipment: "Band",       cue: "Arms in front at chest height. Pull band apart to arms-wide. Squeeze shoulder blades at end. Elbows soft.", caution: false },
          { id: "pt_prone_y",       name: "Prone Y Raise",              sets: 3, reps: "12 reps",                   equipment: "Dumbbell",   cue: "Face-down, thumbs up, arms in Y shape. Lower trap activation. Critical for healthy scapular mechanics.", caution: false },
          { id: "pt_wall_angel",    name: "Wall Angel",                 sets: 3, reps: "10 reps",                   equipment: "Wall",       cue: "Stand against wall, maintain contact head-back-arms. Slowly raise arms overhead. Most people cannot do this fully — that's the point.", caution: false },
          { id: "pt_er_band",       name: "External Rotation (Band)",   sets: 3, reps: "15 reps",                   equipment: "Band",       cue: "Arm at side, elbow 90°. Rotate outward. This is the #1 impingement prevention exercise.", caution: false },
          { id: "pt_serratus",      name: "Serratus Punch",             sets: 3, reps: "15 reps",                   equipment: "Band",       cue: "Band behind back, punch forward rounding the shoulder at end. Activates serratus anterior — key upward rotator.", caution: false },
        ]
      },
      {
        phase: "PHASE 3", label: "Return to Loading", weeks: "Weeks 8–14", color: "#FF9900",
        goal: "Gradually reintroduce pushing movements with corrected scapular mechanics.",
        exercises: [
          { id: "pt_pushup_plus",   name: "Push-Up Plus",               sets: 3, reps: "15 reps",                   equipment: "Bodyweight", cue: "At top of push-up, push further rounding the upper back. Keeps scapula rotating correctly during pressing.", caution: false },
          { id: "pt_facepull_pt",   name: "Face Pull (Light)",           sets: 3, reps: "15 reps",                   equipment: "Band/Cable", cue: "Pull to forehead, external rotate at end. Do this EVERY session as prehab. Never remove from routine.", caution: false },
          { id: "pt_lp_row",        name: "Low-Pulley Row to Neck",      sets: 3, reps: "12 reps",                   equipment: "Cable",      cue: "Pull to chin level, elbows flare wide. Trains posterior cuff and rear delt without overhead risk.", caution: false },
          { id: "pt_db_press_lt",   name: "DB Press (Elbows In)",        sets: 3, reps: "12 reps",                   equipment: "Dumbbell",   cue: "Elbows at 45° — NOT 90°. Light weight. This angle eliminates the impingement arc. NEVER press with elbows flared.", caution: true, cautionText: "Only when symptom-free for 2+ weeks" },
        ]
      },
    ]
  },
  {
    id: "frozen_shoulder",
    name: "Frozen Shoulder",
    icon: "🧊",
    color: "#00D4FF",
    subtitle: "Adhesive Capsulitis",
    description: "Frozen shoulder involves progressive capsular thickening causing severe ROM restriction. PT is the primary treatment. Recovery is long (6–18 months). Gentle, consistent mobilization is key — never aggressive stretching.",
    disclaimer: "This condition requires patience. Never force range of motion — aggressive stretching worsens adhesive capsulitis.",
    phases: [
      {
        phase: "PHASE 1", label: "Freezing — Pain Control", weeks: "Weeks 1–6", color: "#4ade80",
        goal: "Manage pain. Maintain what ROM you have. Avoid further capsular irritation.",
        exercises: [
          { id: "pt_pendulum",      name: "Pendulum Circles",           sets: 3, reps: "20 circles each direction", equipment: "Bodyweight", cue: "The ONLY active exercise in this phase. Let gravity do the work. NO muscle engagement. Gradual ROM without pain.", caution: false },
          { id: "pt_passive_er",    name: "Passive Forward Flexion",    sets: 2, reps: "10 slow reps",              equipment: "Wand/Stick", cue: "Use good arm to lift affected arm forward. Stop at first point of resistance — do not push through.", caution: false },
          { id: "pt_heat_mob",      name: "Heat + Gentle Pendulum",     sets: 2, reps: "5 min",                     equipment: "Heat pack",  cue: "Apply heat for 10 min before pendulums. Reduces capsular stiffness and makes gentle mobilization more effective.", caution: false },
        ]
      },
      {
        phase: "PHASE 2", label: "Thawing — Mobility", weeks: "Weeks 6–20", color: "#E8FF47",
        goal: "Progressively restore ROM in all planes. Gentle end-range holds — never aggressive.",
        exercises: [
          { id: "pt_table_slide",   name: "Table Slide",                sets: 3, reps: "10 reps",                   equipment: "Table",      cue: "Seated, slide arm forward on table as far as comfortable. Lean body forward gently. Hold 5 sec at end range.", caution: false },
          { id: "pt_towel_er",      name: "Towel External Rotation",    sets: 3, reps: "15 reps",                   equipment: "Towel",      cue: "Hold towel behind back. Use good arm to gently pull bad arm into ER. Millimeter progress over weeks — this is normal.", caution: false },
          { id: "pt_wall_climb",    name: "Wall Climb (Finger Walk)",   sets: 3, reps: "2 min",                     equipment: "Wall",       cue: "Walk fingers up wall to limit of comfortable ROM. Mark progress daily. Gradual elevation gain over weeks.", caution: false },
          { id: "pt_pulleys",       name: "Overhead Pulley",            sets: 3, reps: "15 reps",                   equipment: "Pulley",     cue: "Use good arm to pull bad arm overhead via rope. Passive assisted — bad arm is relaxed. Gentle, no forcing.", caution: false },
          { id: "pt_scap_squeeze",  name: "Scapular Retraction",        sets: 3, reps: "15 reps",                   equipment: "Bodyweight", cue: "Maintain scapular movement — prevents compensatory patterns that develop during frozen phase.", caution: false },
        ]
      },
      {
        phase: "PHASE 3", label: "Recovered — Rebuilding", weeks: "Weeks 20+", color: "#FF9900",
        goal: "Rebuild strength in the newly recovered ROM. Gradual return to normal activity.",
        exercises: [
          { id: "pt_er_band",       name: "External Rotation (Band)",   sets: 3, reps: "15 reps",                   equipment: "Band",       cue: "Now that ROM is restored, begin cuff strengthening. Start very light — cuff atrophies during frozen phase.", caution: false },
          { id: "pt_lp_row",        name: "Low Row (Cable/Band)",        sets: 3, reps: "12 reps",                   equipment: "Band/Cable", cue: "Row to lower chest. Rebuilt lat and mid-trap strength. Important for supporting restored overhead motion.", caution: false },
          { id: "pt_prone_y",       name: "Prone Y Raise",              sets: 3, reps: "12 reps",                   equipment: "Dumbbell",   cue: "Lower trap strengthening. Essential rebuild after months of compensatory patterns.", caution: false },
          { id: "pt_fullcan",       name: "Full Can Raise",             sets: 3, reps: "12 reps",                   equipment: "Dumbbell",   cue: "Thumb up, arm at 30° forward. Raise to newly accessible height only. Progress range over weeks.", caution: false },
        ]
      },
    ]
  },
  {
    id: "shoulder_instability",
    name: "Shoulder Instability",
    icon: "🔧",
    color: "#c084fc",
    subtitle: "Hypermobility / Post-Dislocation",
    description: "Instability involves lax or torn ligaments allowing excessive humeral head translation. PT focuses on dynamic stability via rotator cuff and periscapular strengthening — NOT stretching.",
    disclaimer: "AVOID all stretching exercises. Avoid any position that recreates the sensation of slipping or instability.",
    phases: [
      {
        phase: "PHASE 1", label: "Protect & Activate", weeks: "Weeks 1–4", color: "#4ade80",
        goal: "Activate rotator cuff as a dynamic stabilizer. Avoid positions of vulnerability (arm back and to the side).",
        exercises: [
          { id: "pt_rhythmic_stab", name: "Rhythmic Stabilization",     sets: 3, reps: "30 sec",                    equipment: "Partner/Wall", cue: "Hold arm at 90° forward. Have partner apply gentle unpredictable forces. Resist movement. Trains co-contraction.", caution: false },
          { id: "pt_ir_band",       name: "Internal Rotation (Band)",   sets: 3, reps: "15 reps",                   equipment: "Band",       cue: "Strengthen subscapularis — your primary anterior stabilizer. Elbow at 90°, rotate inward. Controlled movement.", caution: false },
          { id: "pt_er_band",       name: "External Rotation (Band)",   sets: 3, reps: "15 reps",                   equipment: "Band",       cue: "Strengthen infraspinatus/teres minor. Rotate outward. These compress the humeral head into the socket.", caution: false },
          { id: "pt_scap_squeeze",  name: "Scapular Retraction",        sets: 3, reps: "15 reps, 5 sec hold",       equipment: "Bodyweight", cue: "Scapular stability is critical for instability rehab. Squeeze and hold.", caution: false },
        ]
      },
      {
        phase: "PHASE 2", label: "Dynamic Stability", weeks: "Weeks 4–10", color: "#E8FF47",
        goal: "Progress to closed-chain and functional stability exercises. Build neuromuscular control.",
        exercises: [
          { id: "pt_wall_pushup",   name: "Wall Push-Up Isometric",     sets: 3, reps: "30 sec hold",               equipment: "Wall",       cue: "Push into wall at various angles. Closed-chain — joint compression increases stability. Great for instability rehab.", caution: false },
          { id: "pt_pushup_plus",   name: "Push-Up Plus",               sets: 3, reps: "12 reps",                   equipment: "Bodyweight", cue: "Serratus anterior activation. Correct scapular mechanics are essential for instability management.", caution: false },
          { id: "pt_band_pull",     name: "Band Pull-Apart",            sets: 3, reps: "20 reps",                   equipment: "Band",       cue: "Horizontal abduction strengthening. Posterior cuff and rear delt — dynamic posterior stabilizers.", caution: false },
          { id: "pt_facepull_pt",   name: "Face Pull",                  sets: 3, reps: "15 reps",                   equipment: "Band/Cable", cue: "MOST IMPORTANT exercise for instability. External rotation at end range = cuff compression into socket.", caution: false },
          { id: "pt_t_raise",       name: "T-Raise (Prone)",            sets: 3, reps: "12 reps",                   equipment: "Dumbbell",   cue: "Prone T-raises train the posterior cuff in horizontal abduction — a commonly weak plane in unstable shoulders.", caution: false },
        ]
      },
      {
        phase: "PHASE 3", label: "Return to Loading", weeks: "Weeks 10–20", color: "#FF9900",
        goal: "Progressive loading with controlled mechanics. Avoid impingement or end-range positions.",
        exercises: [
          { id: "pt_db_press_lt",   name: "DB Press (Elbows In, Light)", sets: 3, reps: "12 reps",                  equipment: "Dumbbell",   cue: "Elbows at 45° only. This position minimizes anterior capsule stress. NEVER allow elbow behind shoulder plane.", caution: true, cautionText: "Stop if any feeling of looseness/instability" },
          { id: "pt_fullcan",       name: "Full Can Raise",              sets: 3, reps: "12 reps",                   equipment: "Dumbbell",   cue: "Thumb up, arm at 30°. Raise to 90° only. Supraspinatus strengthening in the safe scapular plane.", caution: false },
          { id: "pt_prone_y",       name: "Prone Y Raise",               sets: 3, reps: "12 reps",                   equipment: "Dumbbell",   cue: "Lower trap builds the scapular platform that prevents the humeral head from riding up during pressing.", caution: false },
          { id: "pt_lp_row",        name: "Low Row (Cable)",             sets: 3, reps: "12 reps",                   equipment: "Cable",      cue: "Row to lower chest only. Avoid any external rotation at end range in this phase for anterior instability.", caution: false },
        ]
      },
    ]
  },
  {
    id: "ac_joint",
    name: "AC Joint Sprain",
    icon: "🦴",
    color: "#fb7185",
    subtitle: "Acromioclavicular Joint Injury",
    description: "AC joint sprains range from Grade I (stretched ligaments) to Grade III (complete separation). PT focuses on restoring pain-free mechanics and strengthening the dynamic stabilizers around the joint.",
    disclaimer: "Grade III+ injuries may require surgical consultation. Avoid cross-body adduction movements that compress the AC joint.",
    phases: [
      {
        phase: "PHASE 1", label: "Protect & Settle", weeks: "Weeks 1–3", color: "#4ade80",
        goal: "Reduce inflammation. Maintain gentle ROM. Avoid painful positions (reaching across body, overhead).",
        exercises: [
          { id: "pt_pendulum",      name: "Pendulum Circles",           sets: 2, reps: "20 circles each direction", equipment: "Bodyweight", cue: "Gravity-assisted ROM. Keep arm below shoulder height. The AC joint is most compressed at end ranges.", caution: false },
          { id: "pt_scap_squeeze",  name: "Scapular Retraction",        sets: 3, reps: "15 reps",                   equipment: "Bodyweight", cue: "Gentle scapular setting. Avoid shrugging which loads the AC joint. Squeeze and pull DOWN.", caution: false },
          { id: "pt_passive_er",    name: "Passive ER (Wand)",          sets: 3, reps: "15 reps",                   equipment: "Wand",       cue: "Gentle passive external rotation. Keeps cuff active while resting AC joint. Stay below shoulder height.", caution: false },
        ]
      },
      {
        phase: "PHASE 2", label: "Restore Mechanics", weeks: "Weeks 3–8", color: "#E8FF47",
        goal: "Restore full pain-free ROM below shoulder height. Strengthen periscapular muscles.",
        exercises: [
          { id: "pt_er_band",       name: "External Rotation (Band)",   sets: 3, reps: "15 reps",                   equipment: "Band",       cue: "Standard cuff ER strengthening. Arm at side, elbow 90°. Essential dynamic stabilizer of AC joint.", caution: false },
          { id: "pt_prone_y",       name: "Prone Y Raise",              sets: 3, reps: "12 reps",                   equipment: "Dumbbell",   cue: "Lower trap strengthening stabilizes the clavicle-scapula-rib cage relationship. Critical for AC joint health.", caution: false },
          { id: "pt_band_pull",     name: "Band Pull-Apart",            sets: 3, reps: "20 reps",                   equipment: "Band",       cue: "Horizontal abduction. Trains posterior cuff and rear delt without loading the AC joint.", caution: false },
          { id: "pt_wall_slide",    name: "Wall Slide",                 sets: 3, reps: "12 reps",                   equipment: "Wall",       cue: "Restore overhead ROM gradually. If pain at a specific point — that's your current limit. Progress weekly.", caution: false },
          { id: "pt_fullcan",       name: "Full Can Raise",             sets: 3, reps: "12 reps",                   equipment: "Dumbbell",   cue: "Raise in scapular plane only. Avoid crossing midline (adduction compresses AC joint). Thumb up.", caution: false },
        ]
      },
      {
        phase: "PHASE 3", label: "Return to Press", weeks: "Weeks 8–16", color: "#FF9900",
        goal: "Gradual return to overhead and pressing activities. Avoid deep cross-body movements permanently.",
        exercises: [
          { id: "pt_facepull_pt",   name: "Face Pull",                  sets: 3, reps: "15 reps",                   equipment: "Band/Cable", cue: "Maintain this exercise permanently. Posterior cuff and rear delt are the AC joint's best protectors.", caution: false },
          { id: "pt_pushup_plus",   name: "Push-Up Plus (Gradual)",     sets: 3, reps: "12 reps",                   equipment: "Bodyweight", cue: "Start with wall push-up plus, progress to incline, then floor. Serratus keeps scapula from tilting into AC joint.", caution: true, cautionText: "Add only when pain-free at shoulder height" },
          { id: "pt_db_press_lt",   name: "DB Press (Elbows In)",       sets: 3, reps: "12 reps",                   equipment: "Dumbbell",   cue: "Elbows 45° — NEVER flare to 90° as this loads AC joint. Light weight. Increase by 5 lb per week max.", caution: true, cautionText: "Only pain-free overhead motion first" },
          { id: "pt_lp_row",        name: "Cable Row (Low)",            sets: 3, reps: "12 reps",                   equipment: "Cable",      cue: "Row to lower chest. Avoid rowing to chin — that position compresses the AC joint.", caution: false },
        ]
      },
    ]
  },
  {
    id: "bicep_tendon",
    name: "Bicep Tendinopathy",
    icon: "💪",
    color: "#4ade80",
    subtitle: "Long Head Bicep Tendon Irritation",
    description: "Bicep tendinopathy involves degeneration or irritation of the long head bicep tendon in the bicipital groove. Pain is felt at the front of the shoulder. PT uses eccentric loading — the gold standard for tendinopathy.",
    disclaimer: "Avoid direct overhead activities and heavy supinated curls until Phase 2. Eccentric loading may cause soreness — this is normal and expected.",
    phases: [
      {
        phase: "PHASE 1", label: "Settle & Isometrics", weeks: "Weeks 1–3", color: "#4ade80",
        goal: "Use isometric loading to reduce tendon pain and begin neurological activation without tendon stress.",
        exercises: [
          { id: "pt_iso_curl",      name: "Isometric Curl (Wall)",      sets: 5, reps: "45 sec hold",               equipment: "Wall",       cue: "Stand in front of wall, forearm against it, elbow at 90°. Push up against wall — tendon loaded, no movement. Reduces pain immediately.", caution: false },
          { id: "pt_scap_squeeze",  name: "Scapular Retraction",        sets: 3, reps: "15 reps",                   equipment: "Bodyweight", cue: "Scapular position affects the bicep groove. Retracting scapula reduces bicep tendon tension.", caution: false },
          { id: "pt_pendulum",      name: "Pendulum Circles",           sets: 2, reps: "20 circles",                 equipment: "Bodyweight", cue: "Maintain shoulder ROM. The bicep tendon is within the glenohumeral joint — keep it moving gently.", caution: false },
        ]
      },
      {
        phase: "PHASE 2", label: "Eccentric Loading", weeks: "Weeks 3–8", color: "#E8FF47",
        goal: "Eccentric curls are the evidence-based treatment for bicep tendinopathy. Controlled lowering is the key stimulus.",
        exercises: [
          { id: "pt_ecc_curl",      name: "Eccentric Curl",             sets: 3, reps: "15 slow reps",              equipment: "Dumbbell",   cue: "Use BOTH hands to curl up, then lower with ONE hand over 5 seconds. The slow eccentric is the therapy. Mild soreness is expected and beneficial.", caution: false },
          { id: "pt_ecc_hammer",    name: "Eccentric Hammer Curl",      sets: 3, reps: "15 slow reps",              equipment: "Dumbbell",   cue: "Same eccentric protocol but neutral grip. Loads brachialis too. 5 sec lowering — count it out.", caution: false },
          { id: "pt_er_band",       name: "External Rotation (Band)",   sets: 3, reps: "15 reps",                   equipment: "Band",       cue: "The bicep tendon sits in a groove stabilized by the transverse ligament. Cuff strengthening stabilizes this groove.", caution: false },
          { id: "pt_prone_y",       name: "Prone Y Raise",              sets: 3, reps: "12 reps",                   equipment: "Dumbbell",   cue: "Lower trap activation — corrects the forward shoulder posture that increases bicep groove stress.", caution: false },
        ]
      },
      {
        phase: "PHASE 3", label: "Heavy Slow Resistance", weeks: "Weeks 8–16", color: "#FF9900",
        goal: "Progress to heavier loads through full ROM. Maintain 3–5 sec eccentric on all curl variations.",
        exercises: [
          { id: "pt_hsr_curl",      name: "Heavy Slow Curl",            sets: 4, reps: "8 reps (3-3 tempo)",        equipment: "Dumbbell",   cue: "3 sec up, 3 sec down. Load is heavy enough that rep 8 is challenging. This is Heavy Slow Resistance (HSR) — the gold standard tendon loading protocol.", caution: false },
          { id: "pt_facepull_pt",   name: "Face Pull",                  sets: 3, reps: "15 reps",                   equipment: "Band/Cable", cue: "Permanent prehab. Stabilizes the shoulder girdle and reduces bicep groove stress during all pressing movements.", caution: false },
          { id: "pt_fullcan",       name: "Full Can Raise",             sets: 3, reps: "12 reps",                   equipment: "Dumbbell",   cue: "Supraspinatus loading. The supraspinatus and bicep long head share load — strengthen both.", caution: false },
          { id: "pt_db_press_lt",   name: "DB Press (Light)",           sets: 3, reps: "12 reps",                   equipment: "Dumbbell",   cue: "Begin reloading pressing. Elbows at 45°. Full range once pain-free. Avoid wide grip that compresses bicep groove.", caution: true, cautionText: "Only when fully pain-free with curling" },
        ]
      },
    ]
  },
];

// ─── SMART SWAP ───────────────────────────────────────────────────────────────

function getSwapSuggestions(exerciseId, routineExercises) {
  const current = EXERCISES_DB.find(e => e.id === exerciseId);
  if (!current) return [];
  return EXERCISES_DB
    .filter(ex =>
      ex.id !== exerciseId &&
      !routineExercises.includes(ex.id) &&
      (ex.muscle === current.muscle || ex.tags.some(t => current.tags.includes(t)))
    )
    .slice(0, 5);
}

// ─── ROUTINES — ALL 45+ OPTIMIZED (shoulder focus removed) ───────────────────

const ROUTINES = [
  {
    id: "push", name: "PUSH DAY", color: "#E8FF47", dayTags: ["push"], optimized45: true,
    exercises: ["incline_db", "cable_fly", "ohp", "arnold_press", "lat_raise", "cable_lat", "tricep_push", "overhead_tri"],
    description: "Chest, shoulders & triceps. DB/cable only — zero barbell spinal load.",
    optimizations: [
      "Incline DB replaces flat barbell bench — less shoulder impingement, independent arm path",
      "Seated DB press replaces barbell OHP — no axial spine compression",
      "Cable fly replaces dips — constant tension without deep shoulder stretch at lockout",
      "All pressing at 10–12 reps, isolation work at 12–15 reps, RPE 7–8",
    ],
  },
  {
    id: "pull", name: "PULL DAY", color: "#FF3C00", dayTags: ["pull"], optimized45: true,
    exercises: ["lat_pulldown", "seated_row", "rear_delt_fly", "face_pull", "lyd_raise", "banded_ext", "curl", "hammer_curl"],
    description: "Back, rear delts & biceps. Machine/cable throughout — prioritises rotator cuff health.",
    optimizations: [
      "Lat pulldown replaces weighted pull-ups — controllable load, no sudden joint stress",
      "Seated cable row replaces barbell row — neutral spine, no lumbar shear force",
      "Face pull + rear delt fly + band pull-apart for complete posterior shoulder health",
      "Hammer curl added for brachialis — reduces wrist supination strain vs barbell curl",
    ],
  },
  {
    id: "legs", name: "LEG DAY", color: "#00D4FF", dayTags: ["legs"], optimized45: true,
    exercises: ["legpress", "leg_ext", "leg_curl", "rdl", "squat", "calf_raise"],
    description: "Quads, hamstrings & calves. Machine-first — no axial spinal load from back squats.",
    optimizations: [
      "Leg press replaces barbell back squat — identical quad stimulus, zero spinal compression",
      "Goblet squat included for mobility & glutes — light load, goblet position is joint-safe",
      "DB Romanian deadlift replaces barbell — shorter ROM reduces lumbar stress at 45+",
      "Leg curl + leg extension for knee joint health via balanced antagonist training",
    ],
  },
  {
    id: "full", name: "FULL BODY", color: "#4ade80", dayTags: ["push","pull","legs"], optimized45: true,
    exercises: ["legpress", "lat_pulldown", "incline_db", "seated_row", "ohp", "lat_raise", "face_pull", "leg_curl", "curl", "tricep_push"],
    description: "10-exercise full body. Ideal 3×/week schedule — highest frequency for masters hypertrophy.",
    optimizations: [
      "Frequency > volume for 45+ — hitting each muscle 3×/week outperforms 1× splits",
      "Compound movements first (leg press, pulldown, press), isolation finishers after",
      "No free-weight axial loading — all machine and cable for session-to-session consistency",
      "10 exercises at 3 sets each = ~30 working sets, optimal weekly volume for 45+",
    ],
  },
];

// ─── 45+ SCIENCE PROTOCOL ────────────────────────────────────────────────────

const MASTERS_PROTOCOL = [
  { icon: "📊", label: "REP RANGE",    value: "10–15 reps",     detail: "Higher reps (65–75% 1RM) maximize hypertrophy with lower joint stress — Schoenfeld et al., 2017" },
  { icon: "⏱️", label: "REST PERIODS", value: "2–3 min",        detail: "Longer rest preserves testosterone output and limits cortisol spike — Morton et al., 2016" },
  { icon: "🔁", label: "FREQUENCY",    value: "3× / week",      detail: "3× weekly full-body outperforms splits for masters athletes — Ralston et al., 2017" },
  { icon: "🏋️", label: "INTENSITY",    value: "RPE 7–8",        detail: "Leave 2–3 reps in reserve. Maintains stimulus while reducing injury risk in 45+ trainees" },
  { icon: "💊", label: "RECOVERY",     value: "48–72 hrs",      detail: "MPS recovery extends longer after 40 — prioritise sleep and protein ≥1.6g/kg — Phillips, 2012" },
  { icon: "🎯", label: "EQUIPMENT",    value: "Machine > Free", detail: "Machine loading reduces stabilizer fatigue and CNS demand — optimal for training longevity" },
];

// ─── CHART DATA ───────────────────────────────────────────────────────────────

const WEEKLY_VOLUME = [
  { week: "W1", Chest: 3800, Back: 5200, Legs: 6100, Shoulders: 3200 },
  { week: "W2", Chest: 4100, Back: 5600, Legs: 5800, Shoulders: 3600 },
  { week: "W3", Chest: 4400, Back: 5200, Legs: 6800, Shoulders: 4100 },
  { week: "W4", Chest: 4700, Back: 6100, Legs: 6400, Shoulders: 4600 },
];
const PR_HISTORY = {
  legpress:     [{ date: "Jan", weight: 225 },{ date: "Feb", weight: 250 },{ date: "Mar", weight: 270 },{ date: "Apr", weight: 295 }],
  lat_pulldown: [{ date: "Jan", weight: 100 },{ date: "Feb", weight: 110 },{ date: "Mar", weight: 120 },{ date: "Apr", weight: 130 }],
  lat_raise:    [{ date: "Jan", weight: 15  },{ date: "Feb", weight: 20  },{ date: "Mar", weight: 25  },{ date: "Apr", weight: 30  }],
};
const RECENT_PRS = [
  { exercise: "Leg Press",     weight: 295, date: "2 days ago",  isNew: true  },
  { exercise: "Face Pull",     weight: 55,  date: "1 week ago",  isNew: false },
  { exercise: "Lateral Raise", weight: 30,  date: "2 weeks ago", isNew: false },
];

// ─── AUDIO ────────────────────────────────────────────────────────────────────

function playBeep(freq = 880, dur = 0.15, vol = 0.3) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    o.start(ctx.currentTime); o.stop(ctx.currentTime + dur);
  } catch (e) {}
}
function playComplete() {
  playBeep(660,0.1,0.2); setTimeout(()=>playBeep(880,0.1,0.2),120); setTimeout(()=>playBeep(1100,0.2,0.3),240);
}

// ─── REDUCER ──────────────────────────────────────────────────────────────────

const initWorkout = (routine) => ({
  routine, exerciseIndex: 0, restTimer: null, isResting: false,
  startTime: Date.now(), completed: false,
  sets: routine.exercises.map(id => {
    const ex = EXERCISES_DB.find(e => e.id === id);
    return Array.from({ length: ex.defaultSets }, (_, i) => ({
      setNum: i+1, targetReps: ex.defaultReps,
      actualReps: ex.defaultReps, weight: ex.lastWeight, done: false,
    }));
  }),
});

function reducer(state, action) {
  switch (action.type) {
    case "COMPLETE_SET": {
      const sets = state.sets.map((s, ei) =>
        ei === action.exIdx ? s.map((r, si) => si === action.setIdx ? {...r, done:true} : r) : s);
      return { ...state, sets, isResting: true, restTimer: 150 };
    }
    case "UPDATE_FIELD": {
      const sets = state.sets.map((s, ei) =>
        ei === action.exIdx ? s.map((r, si) => si === action.setIdx ? {...r, [action.field]: action.value} : r) : s);
      return { ...state, sets };
    }
    case "SWAP_EXERCISE": {
      const newEx = EXERCISES_DB.find(e => e.id === action.newId);
      const exercises = state.routine.exercises.map((id, i) => i === action.exIdx ? action.newId : id);
      const sets = state.sets.map((s, i) => i === action.exIdx
        ? Array.from({length: newEx.defaultSets}, (_, si) => ({
            setNum: si+1, targetReps: newEx.defaultReps,
            actualReps: newEx.defaultReps, weight: newEx.lastWeight, done: false,
          }))
        : s);
      return { ...state, sets, routine: {...state.routine, exercises}, isResting: false, restTimer: null };
    }
    case "TICK":       return state.restTimer <= 1 ? {...state, restTimer:0, isResting:false} : {...state, restTimer: state.restTimer-1};
    case "SKIP_REST":  return {...state, restTimer:0, isResting:false};
    case "NEXT_EX":    return {...state, exerciseIndex: Math.min(state.exerciseIndex+1, state.routine.exercises.length-1), isResting:false, restTimer:null};
    case "PREV_EX":    return {...state, exerciseIndex: Math.max(state.exerciseIndex-1, 0)};
    case "FINISH":     return {...state, completed:true};
    default:           return state;
  }
}

// ─── UI ATOMS ─────────────────────────────────────────────────────────────────

const MC = { Chest:"#FF3C00", Back:"#00D4FF", Legs:"#E8FF47", Shoulders:"#c084fc", Biceps:"#4ade80", Triceps:"#fb923c", Hamstrings:"#fb7185", Calves:"#60a5fa" };

function Confetti({ active }) {
  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({length:36},(_,i)=>(
        <div key={i} style={{ position:"absolute", left:Math.random()*100+"%", top:"-10px",
          width:(6+Math.random()*8)+"px", height:(6+Math.random()*8)+"px",
          background:["#E8FF47","#FF3C00","#00D4FF","#fff","#FF9900"][i%5],
          transform:`rotate(${Math.random()*360}deg)`,
          animation:`cf ${1.5+Math.random()}s cubic-bezier(.25,.46,.45,.94) ${Math.random()*0.5}s forwards` }} />
      ))}
      <style>{`@keyframes cf{to{transform:translateY(100vh) rotate(720deg);opacity:0}}`}</style>
    </div>
  );
}

function RestTimer({ seconds, onSkip }) {
  const r=36, circ=2*Math.PI*r, pct=seconds/150;
  const color = pct>0.6?"#4ade80":pct>0.3?"#facc15":"#FF3C00";
  return (
    <div className="flex flex-col items-center gap-2 py-3">
      <div className="relative w-20 h-20">
        <svg width="80" height="80" className="absolute inset-0 -rotate-90">
          <circle cx="40" cy="40" r={r} fill="none" stroke="#3A3A3E" strokeWidth="5"/>
          <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="5"
            strokeDasharray={circ} strokeDashoffset={circ*(1-pct)}
            style={{transition:"stroke-dashoffset 1s linear, stroke 0.3s ease"}}/>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",color,fontSize:"2.4rem",fontWeight:700}}>{seconds}</span>
        </div>
      </div>
      <div style={{color:"#AEAEB2",fontSize:"0.82rem",letterSpacing:"0.15em",fontFamily:"monospace"}}>REST · 2–3 MIN REC.</div>
      <button onClick={onSkip} className="px-4 py-1" style={{borderColor:"#333",color:"#BBBBBC",fontFamily:"monospace",fontSize:"0.82rem",background:"transparent",border:"1px solid #4A4A4E",letterSpacing:"0.1em"}}>SKIP</button>
    </div>
  );
}

function TabBar({ active, onChange }) {
  const tabs = [
    {id:"home",    icon:Home,    label:"HOME"},
    {id:"workout", icon:Dumbbell,label:"WORKOUT"},
    {id:"pt",      icon:Heart,   label:"PT"},
    {id:"library", icon:BookOpen,label:"LIBRARY"},
    {id:"progress",icon:TrendingUp,label:"PROGRESS"},
  ];
  return (
    <div className="flex border-t" style={{borderColor:"#3A3A3E",background:"#252528"}}>
      {tabs.map(({id,icon:Icon,label})=>(
        <button key={id} onClick={()=>onChange(id)} className="flex-1 flex flex-col items-center py-4 gap-1"
          style={{color:active===id?(id==="pt"?"#fb7185":"#E8FF47"):"#9A9A9E",transition:"color 0.15s",background:"transparent",border:"none"}}>
          <Icon size={16}/>
          <span style={{fontSize:"0.72rem",fontFamily:"monospace",letterSpacing:"0.08em"}}>{label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── SWAP MODAL ───────────────────────────────────────────────────────────────

function SwapModal({ exerciseId, routineExercises, onSwap, onClose }) {
  const current = EXERCISES_DB.find(e => e.id === exerciseId);
  const suggestions = getSwapSuggestions(exerciseId, routineExercises);
  return (
    <div className="fixed inset-0 z-40 flex items-end" style={{background:"rgba(0,0,0,0.88)"}} onClick={onClose}>
      <div className="w-full rounded-t-2xl overflow-hidden" style={{background:"#222222",border:"1px solid #3A3A3E",maxHeight:"78vh",overflowY:"auto",maxWidth:"430px",margin:"0 auto"}} onClick={e=>e.stopPropagation()}>
        <div className="flex justify-center pt-3 pb-1"><div style={{width:36,height:4,background:"#333",borderRadius:2}}/></div>
        <div className="px-5 pt-2 pb-3" style={{borderBottom:"2px solid #3A3A3E"}}>
          <div style={{color:"#AEAEB2",fontFamily:"monospace",fontSize:"0.8rem",letterSpacing:"0.15em"}}>SWAP EXERCISE</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.85rem",fontWeight:800,color:"#FFFFFF"}}>{current?.name.toUpperCase()}</div>
          <div style={{fontFamily:"monospace",fontSize:"0.8rem",color:"#FF9900",marginTop:"2px"}}>⚡ SMART PICKS — SAME MUSCLE OR MOVEMENT PATTERN</div>
        </div>
        <div className="px-4 pt-3 pb-6 flex flex-col gap-2">
          {suggestions.map(ex=>(
            <button key={ex.id} onClick={()=>onSwap(ex.id)}
              className="flex flex-col gap-1 p-3 rounded-lg text-left"
              style={{background:"#252528",border:"1px solid #3A3A3E",transition:"border-color 0.1s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor="#FF9900"}
              onMouseLeave={e=>e.currentTarget.style.borderColor="#222"}>
              <div className="flex items-center justify-between">
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.3rem",fontWeight:700,color:"#FFFFFF"}}>{ex.name.toUpperCase()}</span>
                <span className="px-2 py-0.5 rounded" style={{background:MC[ex.muscle]||"#888"+"22",color:MC[ex.muscle]||"#888",fontFamily:"monospace",fontSize:"1.15rem",border:"1px solid "+MC[ex.muscle]||"#888"+"44"}}>{ex.muscle.toUpperCase()}</span>
              </div>
              <div style={{fontFamily:"monospace",fontSize:"0.82rem",color:"#AEAEB2"}}>{ex.defaultSets}×{ex.defaultReps} · {ex.equipment}</div>
              {ex.note&&<div className="flex items-start gap-1 mt-1"><Info size={9} color="#FF9900" style={{flexShrink:0,marginTop:1}}/><span style={{fontFamily:"monospace",fontSize:"0.8rem",color:"#FF9900",lineHeight:1.4}}>{ex.note}</span></div>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MUSCLE HEATMAP ───────────────────────────────────────────────────────────

function MuscleHeatmap({ vol, side }) {
  const max = Math.max(...Object.values(vol),1);
  const h = m => { const p=(vol[m]||0)/max; return p>0.8?"#FF3C00":p>0.5?"#E8FF47":p>0.2?"#4ade80":"#3A3A3E"; };
  if (side==="front") return (
    <svg viewBox="0 0 120 260" width="110" height="250">
      <rect width="120" height="260" fill="#1C1C1E"/>
      <ellipse cx="60" cy="20" rx="16" ry="18" fill="#2E2E32" stroke="#666668" strokeWidth="1"/>
      <rect x="54" y="36" width="12" height="10" fill="#2E2E32"/>
      <ellipse cx="48" cy="68" rx="18" ry="20" fill={h("Chest")} stroke="#1C1C1E" strokeWidth="1"/>
      <ellipse cx="72" cy="68" rx="18" ry="20" fill={h("Chest")} stroke="#1C1C1E" strokeWidth="1"/>
      <ellipse cx="28" cy="54" rx="13" ry="10" fill={h("Shoulders")} stroke="#1C1C1E" strokeWidth="1"/>
      <ellipse cx="92" cy="54" rx="13" ry="10" fill={h("Shoulders")} stroke="#1C1C1E" strokeWidth="1"/>
      <rect x="14" y="64" width="12" height="36" rx="6" fill={h("Biceps")} stroke="#1C1C1E" strokeWidth="1"/>
      <rect x="94" y="64" width="12" height="36" rx="6" fill={h("Biceps")} stroke="#1C1C1E" strokeWidth="1"/>
      <rect x="10" y="100" width="10" height="28" rx="5" fill="#2E2E32"/>
      <rect x="100" y="100" width="10" height="28" rx="5" fill="#2E2E32"/>
      <rect x="48" y="88" width="10" height="52" rx="3" fill="#2E2E32" stroke="#666668" strokeWidth="1"/>
      <rect x="62" y="88" width="10" height="52" rx="3" fill="#2E2E32" stroke="#666668" strokeWidth="1"/>
      <line x1="48" y1="100" x2="72" y2="100" stroke="#666668" strokeWidth="1"/>
      <line x1="48" y1="112" x2="72" y2="112" stroke="#666668" strokeWidth="1"/>
      <line x1="48" y1="124" x2="72" y2="124" stroke="#666668" strokeWidth="1"/>
      <rect x="44" y="142" width="20" height="58" rx="8" fill={h("Legs")} stroke="#1C1C1E" strokeWidth="1"/>
      <rect x="56" y="142" width="20" height="58" rx="8" fill={h("Legs")} stroke="#1C1C1E" strokeWidth="1"/>
      <rect x="44" y="202" width="15" height="40" rx="7" fill={h("Calves")}/>
      <rect x="61" y="202" width="15" height="40" rx="7" fill={h("Calves")}/>
      <text x="60" y="256" textAnchor="middle" fill="#8A8A8E" fontSize="9" fontFamily="monospace">FRONT</text>
    </svg>
  );
  return (
    <svg viewBox="0 0 120 260" width="110" height="250">
      <rect width="120" height="260" fill="#1C1C1E"/>
      <ellipse cx="60" cy="20" rx="16" ry="18" fill="#2E2E32" stroke="#666668" strokeWidth="1"/>
      <rect x="54" y="36" width="12" height="10" fill="#2E2E32"/>
      <ellipse cx="60" cy="52" rx="22" ry="10" fill={h("Back")} stroke="#1C1C1E" strokeWidth="1"/>
      <ellipse cx="28" cy="54" rx="13" ry="10" fill={h("Shoulders")} stroke="#1C1C1E" strokeWidth="1"/>
      <ellipse cx="92" cy="54" rx="13" ry="10" fill={h("Shoulders")} stroke="#1C1C1E" strokeWidth="1"/>
      <ellipse cx="44" cy="84" rx="20" ry="28" fill={h("Back")} stroke="#1C1C1E" strokeWidth="1"/>
      <ellipse cx="76" cy="84" rx="20" ry="28" fill={h("Back")} stroke="#1C1C1E" strokeWidth="1"/>
      <rect x="14" y="64" width="12" height="36" rx="6" fill={h("Triceps")} stroke="#1C1C1E" strokeWidth="1"/>
      <rect x="94" y="64" width="12" height="36" rx="6" fill={h("Triceps")} stroke="#1C1C1E" strokeWidth="1"/>
      <rect x="46" y="112" width="28" height="24" rx="4" fill={h("Back")} stroke="#1C1C1E" strokeWidth="1"/>
      <ellipse cx="48" cy="148" rx="20" ry="16" fill="#2E2E32"/>
      <ellipse cx="72" cy="148" rx="20" ry="16" fill="#2E2E32"/>
      <rect x="44" y="160" width="19" height="50" rx="8" fill={h("Hamstrings")} stroke="#1C1C1E" strokeWidth="1"/>
      <rect x="57" y="160" width="19" height="50" rx="8" fill={h("Hamstrings")} stroke="#1C1C1E" strokeWidth="1"/>
      <rect x="44" y="212" width="15" height="36" rx="7" fill={h("Calves")}/>
      <rect x="61" y="212" width="15" height="36" rx="7" fill={h("Calves")}/>
      <text x="60" y="256" textAnchor="middle" fill="#8A8A8E" fontSize="9" fontFamily="monospace">BACK</text>
    </svg>
  );
}

// ─── HOME SCREEN ─────────────────────────────────────────────────────────────

function HomeScreen({ onStart, streak=5, weekDone=2, weekGoal=3, recentPRs=RECENT_PRS, workoutLog=[] }) {
  const [showProtocol, setShowProtocol] = useState(false);
  const pct=Math.min(weekDone/weekGoal,1);
  const r=28, circ=2*Math.PI*r;
  return (
    <div className="flex flex-col overflow-y-auto pb-4" style={{height:"100%"}}>
      <div className="px-5 pt-6 pb-4" style={{borderBottom:"2px solid #3A3A3E"}}>
        <div className="flex items-start justify-between">
          <div>
            <div style={{color:"#9A9A9E",fontFamily:"monospace",fontSize:"0.82rem",letterSpacing:"0.2em"}}>{new Date().toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"}).toUpperCase()}</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"2.5rem",fontWeight:800,color:"#FFFFFF",lineHeight:1}}>READY TO<br/><span style={{color:"#E8FF47"}}>GRIND?</span></div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="relative w-16 h-16">
              <svg width="64" height="64" className="-rotate-90 absolute inset-0">
                <circle cx="32" cy="32" r={r} fill="none" stroke="#3A3A3E" strokeWidth="4"/>
                <circle cx="32" cy="32" r={r} fill="none" stroke="#E8FF47" strokeWidth="4" strokeDasharray={circ} strokeDashoffset={circ*(1-pct)}/>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Flame size={12} color="#FF3C00"/><span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.3rem",fontWeight:700,color:"#FFFFFF",lineHeight:1}}>{streak}</span>
              </div>
            </div>
            <span style={{fontFamily:"monospace",fontSize:"0.78rem",color:"#9A9A9E",letterSpacing:"0.1em"}}>{weekDone}/{weekGoal} WK</span>
          </div>
        </div>
      </div>

      <div className="px-5 pt-4">
        <button onClick={()=>setShowProtocol(!showProtocol)} className="w-full flex items-center justify-between px-3 py-2 rounded"
          style={{background:"#241E00",border:"1px solid #4A3A00",transition:"border-color 0.1s"}}
          onMouseEnter={e=>e.currentTarget.style.borderColor="#FF9900"}
          onMouseLeave={e=>e.currentTarget.style.borderColor="#2a1a00"}>
          <div className="flex items-center gap-2">
            <Info size={13} color="#FF9900"/>
            <span style={{fontFamily:"monospace",fontSize:"0.8rem",color:"#FF9900",letterSpacing:"0.08em"}}>ALL WORKOUTS BUILT FOR AGE 45+ — SEE PROTOCOL</span>
          </div>
          <span style={{fontFamily:"monospace",fontSize:"0.82rem",color:"#FF9900"}}>{showProtocol?"▲":"▼"}</span>
        </button>
        {showProtocol && (
          <div className="rounded-b-lg px-4 py-3 flex flex-col gap-2" style={{background:"#2C2400",border:"1px solid #6A5500",borderTop:"none"}}>
            {MASTERS_PROTOCOL.map((p,i)=>(
              <div key={i} className="flex gap-2">
                <span style={{fontSize:"0.8rem",flexShrink:0}}>{p.icon}</span>
                <div>
                  <div style={{fontFamily:"monospace",fontSize:"0.8rem",color:"#FF9900"}}>{p.label}: <span style={{color:"#FFFFFF"}}>{p.value}</span></div>
                  <div style={{fontFamily:"monospace",fontSize:"0.74rem",color:"#AEAEB2",lineHeight:1.4,marginTop:"1px"}}>{p.detail}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-5 pt-4">
        <div style={{color:"#9A9A9E",fontFamily:"monospace",fontSize:"0.8rem",letterSpacing:"0.2em",marginBottom:"8px"}}>ROUTINES</div>
        <div className="flex flex-col gap-2">
          {ROUTINES.map(r=>(
            <button key={r.id} onClick={()=>onStart(r)} className="p-4 text-left rounded-lg"
              style={{background:"#2A2A2E",border:"1px solid "+r.color+"33",transition:"transform 0.1s cubic-bezier(.4,0,.2,1)",width:"100%"}}
              onMouseDown={e=>e.currentTarget.style.transform="scale(0.98)"} onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}
              onMouseEnter={e=>e.currentTarget.style.borderColor=r.color+"CC"} onMouseLeave={e=>e.currentTarget.style.borderColor=r.color+"33"}>
              <div className="flex items-center justify-between">
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.25rem",fontWeight:800,color:r.color}}>{r.name}</div>
                <Play size={22} color={r.color}/>
              </div>
              <div style={{fontFamily:"monospace",fontSize:"0.78rem",color:"#AEAEB2",lineHeight:1.4,marginTop:"2px"}}>{r.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pt-5">
        <div style={{color:"#9A9A9E",fontFamily:"monospace",fontSize:"0.8rem",letterSpacing:"0.2em",marginBottom:"8px"}}>RECENT PRs</div>
        <div className="flex flex-col gap-2">
          {recentPRs.map((pr,i)=>(
            <div key={i} className="flex items-center justify-between px-3 py-2 rounded"
              style={{background:pr.isNew?"#2A2500":"#2A2A2E",border:"1px solid "+pr.isNew?"#E8FF47":"#3A3A3E"}}>
              <div className="flex items-center gap-2">
                {pr.isNew && <Star size={12} color="#E8FF47" fill="#E8FF47"/>}
                <span style={{fontFamily:"monospace",fontSize:"0.92rem",color:pr.isNew?"#E8FF47":"#bbb"}}>{pr.exercise}</span>
              </div>
              <div className="flex items-center gap-3">
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.3rem",fontWeight:700,color:pr.isNew?"#E8FF47":"#f0f0f0"}}>{pr.weight} LB</span>
                <span style={{fontFamily:"monospace",fontSize:"1.15rem",color:"#9A9A9E"}}>{pr.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PHYSICAL THERAPY SCREEN ─────────────────────────────────────────────────

function PhysicalTherapyScreen() {
  const [selectedInjury, setSelectedInjury] = useState(null);
  const [activePhase, setActivePhase] = useState(0);
  const [completedExercises, setCompletedExercises] = useState({});
  const [expandedEx, setExpandedEx] = useState(null);

  const toggleComplete = (exId) => {
    setCompletedExercises(prev => ({ ...prev, [exId]: !prev[exId] }));
  };

  // ── Injury selection screen ──
  if (!selectedInjury) return (
    <div className="flex flex-col h-full overflow-y-auto pb-4">
      <div className="px-5 pt-5 pb-4" style={{borderBottom:"2px solid #3A3A3E"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"2.4rem",fontWeight:800,color:"#FFFFFF",lineHeight:1}}>
          PHYSICAL<br/><span style={{color:"#fb7185"}}>THERAPY</span>
        </div>
        <div style={{fontFamily:"monospace",fontSize:"0.82rem",color:"#AEAEB2",marginTop:"6px",lineHeight:1.5}}>
          Select your injury for a phased PT protocol with evidence-based exercise progressions.
        </div>
        <div className="flex items-start gap-2 mt-3 px-3 py-2 rounded" style={{background:"#2A1414",border:"1px solid #5A2525"}}>
          <AlertCircle size={13} color="#fb7185" style={{flexShrink:0,marginTop:1}}/>
          <span style={{fontFamily:"monospace",fontSize:"0.78rem",color:"#FF8888",lineHeight:1.5}}>
            These protocols are for informational purposes only. Always consult a licensed physical therapist or physician before starting any rehabilitation program.
          </span>
        </div>
      </div>

      <div className="px-4 pt-4 flex flex-col gap-3">
        {PT_INJURIES.map(inj=>(
          <button key={inj.id} onClick={()=>{ setSelectedInjury(inj); setActivePhase(0); setCompletedExercises({}); }}
            className="flex items-center gap-4 p-4 rounded-lg text-left"
            style={{background:"#2A2A2E",border:"1px solid "+inj.color+"33",transition:"all 0.15s cubic-bezier(.4,0,.2,1)"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=inj.color+"CC"}
            onMouseLeave={e=>e.currentTarget.style.borderColor=inj.color+"33"}
            onMouseDown={e=>e.currentTarget.style.transform="scale(0.98)"}
            onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}>
            <div className="flex items-center justify-center rounded-lg flex-shrink-0"
              style={{width:44,height:44,background:inj.color+"18",border:"1px solid "+inj.color+"44",fontSize:"1.3rem"}}>
              {inj.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.85rem",fontWeight:800,color:inj.color}}>{inj.name.toUpperCase()}</div>
              <div style={{fontFamily:"monospace",fontSize:"0.78rem",color:"#BBBBBC",marginTop:"1px"}}>{inj.subtitle}</div>
              <div style={{fontFamily:"monospace",fontSize:"1.15rem",color:"#9A9A9E",marginTop:"3px"}}>
                {inj.phases.length} phases · {inj.phases.reduce((acc,p)=>acc+p.exercises.length,0)} exercises
              </div>
            </div>
            <ChevronRight size={16} color="#9A9A9E"/>
          </button>
        ))}
      </div>
    </div>
  );

  // ── Protocol screen ──
  const phase = selectedInjury.phases[activePhase];
  const phaseExIds = phase.exercises.map(e=>e.id);
  const phaseDone = phaseExIds.filter(id=>completedExercises[id]).length;
  const phasePct = phaseDone / phaseExIds.length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-3" style={{borderBottom:"2px solid #3A3A3E"}}>
        <div className="flex items-center gap-3 mb-2">
          <button onClick={()=>setSelectedInjury(null)} style={{color:"#AEAEB2",background:"transparent",border:"none",flexShrink:0}}><ChevronLeft size={20}/></button>
          <div>
            <div className="flex items-center gap-2">
              <span style={{fontSize:"1.3rem"}}>{selectedInjury.icon}</span>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.7rem",fontWeight:800,color:selectedInjury.color}}>{selectedInjury.name.toUpperCase()}</span>
            </div>
            <div style={{fontFamily:"monospace",fontSize:"0.78rem",color:"#AEAEB2"}}>{selectedInjury.subtitle}</div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-2 px-3 py-2 rounded mb-3" style={{background:"#2A1414",border:"1px solid #5A2525"}}>
          <AlertCircle size={11} color="#fb7185" style={{flexShrink:0,marginTop:1}}/>
          <span style={{fontFamily:"monospace",fontSize:"1.15rem",color:"#FF8888",lineHeight:1.4}}>{selectedInjury.disclaimer}</span>
        </div>

        {/* Phase tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {selectedInjury.phases.map((p,i)=>(
            <button key={i} onClick={()=>setActivePhase(i)}
              className="flex-shrink-0 px-3 py-1.5 rounded text-left"
              style={{background:activePhase===i?p.color+"33":"#2A2A2E",border:"1px solid "+activePhase===i?p.color+"CC":"#222",transition:"all 0.1s"}}>
              <div style={{fontFamily:"monospace",fontSize:"0.78rem",color:activePhase===i?p.color:"#AEAEB2",letterSpacing:"0.08em"}}>{p.phase}</div>
              <div style={{fontFamily:"monospace",fontSize:"0.72rem",color:activePhase===i?p.color+"DD":"#9A9A9E"}}>{p.weeks}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Phase content */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-4">
        {/* Phase header */}
        <div className="rounded-lg px-4 py-3 mb-3" style={{background:phase.color+"11",border:"1px solid "+phase.color+"44"}}>
          <div className="flex items-center justify-between mb-1">
            <div>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.3rem",fontWeight:800,color:phase.color}}>{phase.label.toUpperCase()}</span>
              <span style={{fontFamily:"monospace",fontSize:"0.78rem",color:"#AEAEB2",marginLeft:"8px"}}>{phase.weeks}</span>
            </div>
            <div style={{fontFamily:"monospace",fontSize:"0.82rem",color:phase.color}}>{phaseDone}/{phaseExIds.length}</div>
          </div>
          {/* Phase progress bar */}
          <div style={{height:"3px",background:"#2A2A2E",borderRadius:2,overflow:"hidden",marginBottom:"6px"}}>
            <div style={{height:"100%",background:phase.color,width:phasePct*100+"%",transition:"width 0.3s cubic-bezier(.4,0,.2,1)"}}/>
          </div>
          <div style={{fontFamily:"monospace",fontSize:"0.78rem",color:"#BBBBBC",lineHeight:1.4}}>
            <span style={{color:"#C7C7CC"}}>GOAL: </span>{phase.goal}
          </div>
        </div>

        {/* Exercise list */}
        <div className="flex flex-col gap-2">
          {phase.exercises.map((ex,i)=>{
            const done = !!completedExercises[ex.id];
            const expanded = expandedEx === ex.id;
            return (
              <div key={ex.id} className="rounded-lg overflow-hidden"
                style={{background: done?"#0D2010":"#2A2A2E", border:"1px solid "+done?"#3A6000":"#3A3A3E", transition:"background 0.2s, border 0.2s"}}>
                {/* Exercise row */}
                <div className="flex items-center gap-3 px-3 py-3">
                  {/* Complete toggle */}
                  <button onClick={()=>toggleComplete(ex.id)}
                    className="flex items-center justify-center rounded flex-shrink-0"
                    style={{width:32,height:32,background:done?"#4ade80":"#2A2A2E",border:"1px solid "+done?"#4ade80":"#5A5A5E",transition:"all 0.15s cubic-bezier(.4,0,.2,1)"}}>
                    <Check size={14} color={done?"#1C1C1E":"#AEAEB2"} strokeWidth={done?3:1.5}/>
                  </button>
                  {/* Info */}
                  <div className="flex-1 min-w-0" onClick={()=>setExpandedEx(expanded?null:ex.id)} style={{cursor:"pointer"}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1rem",fontWeight:700,color:done?"#4ade80":"#f0f0f0",lineHeight:1}}>{ex.name.toUpperCase()}</div>
                    <div style={{fontFamily:"monospace",fontSize:"0.78rem",color:"#AEAEB2",marginTop:"2px"}}>
                      {ex.sets} sets · {ex.reps} · {ex.equipment}
                    </div>
                    {ex.caution && (
                      <div className="flex items-center gap-1 mt-1">
                        <AlertCircle size={9} color="#facc15"/>
                        <span style={{fontFamily:"monospace",fontSize:"0.72rem",color:"#facc15"}}>{ex.cautionText}</span>
                      </div>
                    )}
                  </div>
                  <button onClick={()=>setExpandedEx(expanded?null:ex.id)} style={{color:"#9A9A9E",background:"transparent",border:"none",flexShrink:0}}>
                    <ChevronRight size={14} style={{transform:expanded?"rotate(90deg)":"rotate(0deg)",transition:"transform 0.15s"}}/>
                  </button>
                </div>
                {/* Expanded cue */}
                {expanded && (
                  <div className="px-4 pb-3 pt-1" style={{borderTop:"1px solid #1e1e1e"}}>
                    <div style={{fontFamily:"monospace",fontSize:"0.78rem",color:"#C7C7CC",letterSpacing:"0.08em",marginBottom:"4px"}}>COACHING CUE</div>
                    <div style={{fontFamily:"monospace",fontSize:"0.84rem",color:"#EBEBF0",lineHeight:1.6}}>{ex.cue}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Phase complete CTA */}
        {phasePct === 1 && activePhase < selectedInjury.phases.length - 1 && (
          <div className="mt-4 rounded-lg px-4 py-3 text-center" style={{background:"#152600",border:"1px solid #3A5800"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.85rem",fontWeight:800,color:"#4ade80",marginBottom:"6px"}}>SESSION COMPLETE ✓</div>
            <div style={{fontFamily:"monospace",fontSize:"0.8rem",color:"#AEAEB2",marginBottom:"10px"}}>Ready to progress? Next phase begins when you're consistently pain-free.</div>
            <button onClick={()=>{ setActivePhase(activePhase+1); setCompletedExercises({}); setExpandedEx(null); }}
              className="px-6 py-2 rounded font-bold"
              style={{background:"#4ade80",color:"#0D0D0D",fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1rem",letterSpacing:"0.1em",border:"none"}}>
              ADVANCE TO {selectedInjury.phases[activePhase+1].phase} →
            </button>
          </div>
        )}

        {/* Reset session */}
        {phaseDone > 0 && (
          <button onClick={()=>setCompletedExercises({})} className="w-full mt-3 py-2 flex items-center justify-center gap-2 rounded"
            style={{background:"transparent",border:"1px solid #3A3A3E",color:"#9A9A9E",fontFamily:"monospace",fontSize:"0.8rem"}}>
            <RotateCcw size={11}/> RESET SESSION
          </button>
        )}
      </div>
    </div>
  );
}

// ─── ACTIVE WORKOUT ───────────────────────────────────────────────────────────

function ActiveWorkout({ routine, lastPRs={}, onFinish }) {
  const [state, dispatch] = useReducer(reducer, null, ()=>initWorkout(routine));
  const [muted, setMuted] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [swapIdx, setSwapIdx] = useState(null);
  const timerRef = useRef(null);

  const exId = state.routine.exercises[state.exerciseIndex];
  const ex = EXERCISES_DB.find(e=>e.id===exId);
  const curSets = state.sets[state.exerciseIndex];
  const doneSets = curSets.filter(s=>s.done).length;
  const totalDone = state.sets.flat().filter(s=>s.done).length;
  const totalSets = state.sets.flat().length;

  useEffect(()=>{
    if (state.isResting && state.restTimer>0) { timerRef.current=setInterval(()=>dispatch({type:"TICK"}),1000); }
    else { clearInterval(timerRef.current); if(state.isResting&&state.restTimer===0&&!muted) playBeep(660,0.3,0.4); }
    return ()=>clearInterval(timerRef.current);
  },[state.isResting,state.restTimer]);

  const finish = ()=>{
    setConfetti(true);
    if(!muted){playBeep(523,0.1);setTimeout(()=>playBeep(659,0.1),150);setTimeout(()=>playBeep(784,0.1),300);setTimeout(()=>playBeep(1046,0.3),450);}
    // Build summary for localStorage
    const muscleVolume = {};
    state.routine.exercises.forEach((id, ei) => {
      const ex = EXERCISES_DB.find(e=>e.id===id);
      if (!ex) return;
      const vol = state.sets[ei].filter(s=>s.done).reduce((a,s)=>a+(s.weight||0)*(s.actualReps||0),0);
      muscleVolume[ex.muscle] = (muscleVolume[ex.muscle]||0) + vol;
    });
    const prCandidates = state.routine.exercises.map(id => {
      const ex = EXERCISES_DB.find(e=>e.id===id);
      const sets = state.sets[state.routine.exercises.indexOf(id)];
      const maxWeight = Math.max(0, ...sets.filter(s=>s.done).map(s=>s.weight||0));
      return { id, name: ex?.name||id, weight: maxWeight };
    });
    const summary = {
      routineId: routine.id, routineName: routine.name,
      duration: Math.round((Date.now()-state.startTime)/60000),
      totalSets, muscleVolume, prCandidates,
    };
    setTimeout(()=>{setConfetti(false);onFinish(summary);},3000);
    dispatch({type:"FINISH"});
  };

  if (state.completed) return (
    <div className="flex flex-col items-center justify-center h-full gap-6" style={{background:"#1C1C1E"}}>
      <Confetti active={confetti}/>
      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"3.4rem",fontWeight:800,color:"#E8FF47",textAlign:"center"}}>WORKOUT<br/>COMPLETE</div>
      <div style={{fontFamily:"monospace",fontSize:"1.15rem",color:"#AEAEB2"}}>{totalSets} SETS · {Math.round((Date.now()-state.startTime)/60000)} MIN</div>
      <button onClick={()=>onFinish(null)} className="px-8 py-3 font-bold" style={{background:"#E8FF47",color:"#0D0D0D",fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.3rem",letterSpacing:"0.1em",border:"none",borderRadius:"4px"}}>BACK TO HOME</button>
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{background:"#1C1C1E"}}>
      <Confetti active={confetti}/>
      {swapIdx!==null && (
        <SwapModal exerciseId={state.routine.exercises[swapIdx]} routineExercises={state.routine.exercises}
          onSwap={newId=>{dispatch({type:"SWAP_EXERCISE",exIdx:swapIdx,newId});setSwapIdx(null);}}
          onClose={()=>setSwapIdx(null)}/>
      )}
      <div className="flex items-center justify-between px-4 py-3" style={{borderBottom:"2px solid #3A3A3E"}}>
        <button onClick={()=>onFinish(null)} style={{color:"#AEAEB2",background:"transparent",border:"none",padding:"8px"}}><X size={20}/></button>
        <div style={{fontFamily:"monospace",fontSize:"0.85rem",color:"#AEAEB2",letterSpacing:"0.1em"}}>{totalDone}/{totalSets} SETS</div>
        <div className="flex gap-3 items-center">
          <button onClick={()=>setMuted(!muted)} style={{color:"#AEAEB2",background:"transparent",border:"none"}}>{muted?<VolumeX size={16}/>:<Volume2 size={16}/>}</button>
          <button onClick={finish} style={{color:"#E8FF47",background:"transparent",border:"none",fontFamily:"monospace",fontSize:"0.85rem",letterSpacing:"0.1em"}}>FINISH</button>
        </div>
      </div>
      <div style={{height:"3px",background:"#2A2A2E"}}>
        <div style={{height:"100%",background:"#E8FF47",width:(totalDone/totalSets)*100+"%",transition:"width 0.4s cubic-bezier(.4,0,.2,1)"}}/>
      </div>
      <div className="flex items-center px-3 py-3 gap-2" style={{borderBottom:"2px solid #3A3A3E"}}>
        <button onClick={()=>dispatch({type:"PREV_EX"})} disabled={state.exerciseIndex===0}
          style={{color:state.exerciseIndex===0?"#222":"#555",background:"transparent",border:"none",flexShrink:0}}><ChevronLeft size={20}/></button>
        <div className="text-center flex-1 min-w-0">
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.85rem",fontWeight:800,color:"#FFFFFF",lineHeight:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
            {ex.name.toUpperCase()}
          </div>
          <div style={{fontFamily:"monospace",fontSize:"0.78rem",color:"#AEAEB2",letterSpacing:"0.06em"}}>
            {state.exerciseIndex+1}/{state.routine.exercises.length} · {ex.muscle.toUpperCase()} · {ex.equipment}
          </div>
          {ex.note && <div style={{fontFamily:"monospace",fontSize:"1.15rem",color:"#FF9900",marginTop:"2px"}}>💡 {ex.note}</div>}
        </div>
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <button onClick={()=>setSwapIdx(state.exerciseIndex)} className="flex flex-col items-center gap-0.5"
            style={{color:"#AEAEB2",background:"transparent",border:"none"}}>
            <RefreshCw size={16}/><span style={{fontFamily:"monospace",fontSize:"0.78rem",color:"#AEAEB2",letterSpacing:"0.05em"}}>SWAP</span>
          </button>
        </div>
        <button onClick={()=>dispatch({type:"NEXT_EX"})} disabled={state.exerciseIndex===state.routine.exercises.length-1}
          style={{color:state.exerciseIndex===state.routine.exercises.length-1?"#222":"#555",background:"transparent",border:"none",flexShrink:0}}><ArrowRight size={20}/></button>
      </div>
      {state.isResting && state.restTimer>0 && (
        <div className="px-4" style={{background:"#1C1C1E",borderBottom:"1px solid #3A3A3E"}}>
          <RestTimer seconds={state.restTimer} onSkip={()=>dispatch({type:"SKIP_REST"})}/>
        </div>
      )}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="flex gap-3 mb-4">
          {[{label:"LAST WT",value:ex.lastWeight?`${ex.lastWeight}`:"BW"},{label:"PR",value:ex.pr?`${ex.pr}`:"BW"},{label:"DONE",value:`${doneSets}/${curSets.length}`}].map(s=>(
            <div key={s.label} className="flex-1 p-2 rounded text-center" style={{background:"#2A2A2E",border:"1px solid #3A3A3E"}}>
              <div style={{fontFamily:"monospace",fontSize:"0.92rem",color:"#9A9A9E",letterSpacing:"0.1em"}}>{s.label}</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1rem",fontWeight:700,color:"#FFFFFF"}}>{s.value}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {curSets.map((set,si)=>(
            <SetRow key={si} set={set} setIdx={si} exIdx={state.exerciseIndex} dispatch={dispatch}
              onComplete={si=>{dispatch({type:"COMPLETE_SET",exIdx:state.exerciseIndex,setIdx:si});if(!muted)playComplete();}}/>
          ))}
        </div>
        {state.exerciseIndex < state.routine.exercises.length-1 && !state.isResting && (
          <button onClick={()=>dispatch({type:"NEXT_EX"})} className="w-full mt-4 py-2 flex items-center justify-center gap-2 rounded"
            style={{background:"transparent",border:"1px solid #3A3A3E",color:"#AEAEB2",fontFamily:"monospace",fontSize:"0.82rem",letterSpacing:"0.08em"}}>
            NEXT: {EXERCISES_DB.find(e=>e.id===state.routine.exercises[state.exerciseIndex+1])?.name.toUpperCase()} <ArrowRight size={12}/>
          </button>
        )}
      </div>
    </div>
  );
}

function SetRow({ set, setIdx, exIdx, dispatch, onComplete }) {
  const [pressed, setPressed] = useState(false);
  const upd = (f,v) => dispatch({type:"UPDATE_FIELD",exIdx,setIdx,field:f,value:v});
  return (
    <div className="rounded-xl p-4 flex items-center gap-4"
      style={{background:set.done?"#152600":"#2A2A2E",border:"1px solid "+set.done?"#3A5500":"#3A3A3E",transition:"background 0.2s,border 0.2s"}}>
      <div style={{fontFamily:"monospace",fontSize:"0.85rem",color:"#AEAEB2",minWidth:"18px"}}>S{set.setNum}</div>
      <div className="flex flex-col items-center">
        <button onClick={()=>upd("weight",set.weight+5)} style={{color:"#AEAEB2",background:"transparent",border:"none",padding:"6px"}}><ChevronUp size={18}/></button>
        <span style={{fontFamily:"monospace",fontSize:"1.3rem",color:"#FFFFFF",minWidth:"40px",textAlign:"center"}}>{set.weight===0?"BW":set.weight}</span>
        <button onClick={()=>upd("weight",Math.max(0,set.weight-5))} style={{color:"#AEAEB2",background:"transparent",border:"none",padding:"6px"}}><ChevronDown size={18}/></button>
        <div style={{fontFamily:"monospace",fontSize:"0.92rem",color:"#8A8A8E"}}>LBS</div>
      </div>
      <div style={{color:"#9A9A9E",fontSize:"1rem"}}>×</div>
      <div className="flex flex-col items-center">
        <button onClick={()=>upd("actualReps",set.actualReps+1)} style={{color:"#AEAEB2",background:"transparent",border:"none",padding:"6px"}}><ChevronUp size={18}/></button>
        <span style={{fontFamily:"monospace",fontSize:"1.3rem",color:"#FFFFFF",minWidth:"26px",textAlign:"center"}}>{set.actualReps}</span>
        <button onClick={()=>upd("actualReps",Math.max(1,set.actualReps-1))} style={{color:"#AEAEB2",background:"transparent",border:"none",padding:"6px"}}><ChevronDown size={18}/></button>
        <div style={{fontFamily:"monospace",fontSize:"0.92rem",color:"#8A8A8E"}}>REPS</div>
      </div>
      <div className="flex-1"/>
      <button onClick={()=>!set.done&&onComplete(setIdx)}
        onMouseDown={()=>setPressed(true)} onMouseUp={()=>setPressed(false)} disabled={set.done}
        className="flex items-center justify-center rounded"
        style={{width:"40px",height:"40px",background:set.done?"#E8FF47":"#2A2A2E",border:"1px solid "+set.done?"#E8FF47":"#5A5A5E",color:set.done?"#1C1C1E":"#AEAEB2",transform:pressed?"scale(0.88)":"scale(1)",transition:"transform 0.1s cubic-bezier(.4,0,.2,1),background 0.2s"}}>
        <Check size={16} strokeWidth={set.done?3:1.5}/>
      </button>
    </div>
  );
}

// ─── LIBRARY SCREEN ───────────────────────────────────────────────────────────

function LibraryScreen({ lastPRs={} }) {
  const [search, setSearch] = useState("");
  const [muscleFilter, setMuscleFilter] = useState("All");
  const muscles = ["All","Shoulders","Chest","Back","Legs","Hamstrings","Biceps","Triceps","Calves"];
  const filtered = EXERCISES_DB.filter(ex => ex.name.toLowerCase().includes(search.toLowerCase()) && (muscleFilter==="All"||ex.muscle===muscleFilter));
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-5 pt-5 pb-3" style={{borderBottom:"2px solid #3A3A3E"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"2.4rem",fontWeight:800,color:"#FFFFFF"}}>EXERCISE<br/><span style={{color:"#E8FF47"}}>LIBRARY</span></div>
        <div style={{fontFamily:"monospace",fontSize:"0.8rem",color:"#AEAEB2",marginTop:"3px"}}>{EXERCISES_DB.length} EXERCISES</div>
      </div>
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded mb-2" style={{background:"#2A2A2E",border:"1px solid #3A3A3E"}}>
          <Search size={14} color="#9A9A9E"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search exercises..."
            style={{background:"transparent",border:"none",outline:"none",color:"#FFFFFF",fontFamily:"monospace",fontSize:"1.15rem",flex:1}}/>
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {muscles.map(m=>(
            <button key={m} onClick={()=>setMuscleFilter(m)} className="px-2 py-1 rounded text-xs whitespace-nowrap"
              style={{fontFamily:"monospace",fontSize:"0.8rem",background:muscleFilter===m?(MC[m]||"#E8FF47"):"#2A2A2E",color:muscleFilter===m?"#1C1C1E":"#EBEBF0",border:muscleFilter===m?"1px solid "+(MC[m]||"#E8FF47"):"1px solid #4A4A4E",transition:"all 0.1s"}}>
              {m.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="flex flex-col gap-2">
          {filtered.map(ex=>(
            <div key={ex.id} className="rounded-lg p-3" style={{background:"#2A2A2E",border:"1px solid #3A3A3E"}}>
              <div className="flex items-center justify-between mb-1">
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.85rem",fontWeight:700,color:"#FFFFFF"}}>{ex.name.toUpperCase()}</span>
                <div className="flex items-center gap-2">
                  {ex.tags.includes("isolation")&&<span style={{fontFamily:"monospace",fontSize:"0.92rem",color:"#FF9900",background:"#2A1E00",border:"1px solid #2a1500",borderRadius:"3px",padding:"1px 5px"}}>ISO</span>}
                  <span className="px-2 py-0.5 rounded" style={{background:MC[ex.muscle]||"#888"+"22",color:MC[ex.muscle]||"#888",fontFamily:"monospace",fontSize:"1.15rem",border:"1px solid "+MC[ex.muscle]||"#888"+"44"}}>{ex.muscle.toUpperCase()}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span style={{fontFamily:"monospace",fontSize:"0.8rem",color:"#AEAEB2"}}>{ex.defaultSets}×{ex.defaultReps} · {ex.equipment}</span>
                <div className="flex-1"/>
                {(lastPRs[ex.id]||ex.lastWeight)>0&&<span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.15rem",fontWeight:700,color:"#AEAEB2"}}>{lastPRs[ex.id]||ex.lastWeight}<span style={{fontSize:"0.8rem",fontFamily:"monospace",color:"#8A8A8E"}}> LB LAST</span></span>}
                {(lastPRs[ex.id]||ex.pr)>0&&<div className="flex items-center gap-1"><Trophy size={10} color="#E8FF47"/><span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.15rem",fontWeight:700,color:"#E8FF47"}}>{lastPRs[ex.id]||ex.pr} PR</span></div>}
              </div>
              {ex.note&&<div className="flex items-start gap-1 mt-1"><Info size={9} color="#FF9900" style={{flexShrink:0,marginTop:1}}/><span style={{fontFamily:"monospace",fontSize:"1.15rem",color:"#D4A800",lineHeight:1.4}}>{ex.note}</span></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PROGRESS ────────────────────────────────────────────────────────────────

function ProgressScreen({ weeklyVolume=WEEKLY_VOLUME, prHistory=PR_HISTORY, workoutLog=[] }) {
  const [prEx, setPrEx] = useState("legpress");
  const [side, setSide] = useState("front");
  const vol = workoutLog.length>0
    ? workoutLog.reduce((acc,w)=>{ Object.entries(w.muscleVolume||{}).forEach(([k,v])=>{acc[k]=(acc[k]||0)+v}); return acc; }, {})
    : {Chest:4700,Back:6100,Legs:6400,Shoulders:4600,Biceps:1400,Triceps:1100,Hamstrings:2400,Calves:900};
  const tip = ({active,payload,label}) => !active||!payload?.length?null:(
    <div style={{background:"#2A2A2E",border:"1px solid #3A3A3E",padding:"8px 12px",fontFamily:"monospace",fontSize:"0.85rem"}}>
      <div style={{color:"#AEAEB2",marginBottom:"4px"}}>{label}</div>
      {payload.map((p,i)=><div key={i} style={{color:p.color}}>{p.name}: {p.value.toLocaleString()}</div>)}
    </div>
  );
  return (
    <div className="flex flex-col h-full overflow-y-auto pb-4">
      <div className="px-5 pt-5 pb-3" style={{borderBottom:"2px solid #3A3A3E"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"2.4rem",fontWeight:800,color:"#FFFFFF"}}>PROGRESS<br/><span style={{color:"#E8FF47"}}>TRACKER</span></div>
      </div>
      <div className="px-4 pt-5">
        <div style={{color:"#9A9A9E",fontFamily:"monospace",fontSize:"0.8rem",letterSpacing:"0.2em",marginBottom:"12px"}}>WEEKLY VOLUME (LBS)</div>
        <div className="rounded-lg p-3" style={{background:"#2A2A2E",border:"1px solid #3A3A3E"}}>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={weeklyVolume} margin={{top:4,right:4,left:-20,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3E"/>
              <XAxis dataKey="week" tick={{fill:"#9A9A9E",fontFamily:"monospace",fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"#9A9A9E",fontFamily:"monospace",fontSize:9}} axisLine={false} tickLine={false}/>
              <Tooltip content={tip}/>
              <Bar dataKey="Chest" stackId="a" fill="#FF3C00"/>
              <Bar dataKey="Back" stackId="a" fill="#00D4FF"/>
              <Bar dataKey="Legs" stackId="a" fill="#E8FF47"/>
              <Bar dataKey="Shoulders" stackId="a" fill="#c084fc" radius={[2,2,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="px-4 pt-5">
        <div style={{color:"#9A9A9E",fontFamily:"monospace",fontSize:"0.8rem",letterSpacing:"0.2em",marginBottom:"8px"}}>PR HISTORY</div>
        <div className="flex gap-2 mb-3">
          {[["legpress","Leg Press"],["lat_pulldown","Pulldown"],["lat_raise","Lateral"]].map(([id,l])=>(
            <button key={id} onClick={()=>setPrEx(id)} className="px-3 py-1 rounded"
              style={{fontFamily:"monospace",fontSize:"0.8rem",background:prEx===id?"#E8FF47":"#2A2A2E",color:prEx===id?"#1C1C1E":"#EBEBF0",border:prEx===id?"1px solid #E8FF47":"1px solid #222",transition:"all 0.1s"}}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="rounded-lg p-3" style={{background:"#2A2A2E",border:"1px solid #3A3A3E"}}>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={prHistory[prEx]||PR_HISTORY[prEx]} margin={{top:4,right:8,left:-20,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3E"/>
              <XAxis dataKey="date" tick={{fill:"#9A9A9E",fontFamily:"monospace",fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"#9A9A9E",fontFamily:"monospace",fontSize:9}} axisLine={false} tickLine={false} domain={["auto","auto"]}/>
              <Tooltip content={tip}/>
              <Line type="stepAfter" dataKey="weight" stroke="#E8FF47" strokeWidth={2} dot={{fill:"#E8FF47",r:3}} activeDot={{r:5,fill:"#E8FF47"}}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="px-4 pt-5">
        <div style={{color:"#9A9A9E",fontFamily:"monospace",fontSize:"0.8rem",letterSpacing:"0.2em",marginBottom:"8px"}}>MUSCLE HEATMAP</div>
        <div className="rounded-lg p-4" style={{background:"#2A2A2E",border:"1px solid #3A3A3E"}}>
          <div className="flex gap-2 mb-4">
            {["front","back"].map(s=>(
              <button key={s} onClick={()=>setSide(s)} className="px-3 py-1 rounded"
                style={{fontFamily:"monospace",fontSize:"0.8rem",letterSpacing:"0.1em",background:side===s?"#E8FF47":"#2A2A2E",color:side===s?"#1C1C1E":"#EBEBF0",border:side===s?"1px solid #E8FF47":"1px solid #222",transition:"all 0.1s"}}>
                {s.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="flex gap-6 items-start">
            <MuscleHeatmap vol={vol} side={side}/>
            <div className="flex flex-col gap-2 pt-4">
              {[["#FF3C00","HIGH"],["#E8FF47","MED"],["#4ade80","LOW"],["#1e1e1e","REST"]].map(([c,l])=>(
                <div key={l} className="flex items-center gap-2"><div style={{width:12,height:12,background:c,borderRadius:2}}/><span style={{fontFamily:"monospace",fontSize:"0.8rem",color:"#AEAEB2"}}>{l}</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WORKOUT SELECT ───────────────────────────────────────────────────────────

function WorkoutSelectScreen({ onStart }) {
  const [expanded, setExpanded] = useState(null);
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-5 pt-5 pb-3" style={{borderBottom:"2px solid #3A3A3E"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"2.4rem",fontWeight:800,color:"#FFFFFF"}}>SELECT<br/><span style={{color:"#E8FF47"}}>WORKOUT</span></div>
        <div style={{fontFamily:"monospace",fontSize:"0.8rem",color:"#FF9900",marginTop:"3px"}}>ALL ROUTINES OPTIMIZED FOR AGE 45+</div>
      </div>
      <div className="px-4 pt-4 flex flex-col gap-3 pb-4">
        {ROUTINES.map(r=>(
          <div key={r.id} className="rounded-lg overflow-hidden"
            style={{border:"1px solid "+r.color+"55",background:"#2A2A2E"}}>
            <div className="flex items-center justify-between p-4">
              <div className="flex-1 min-w-0" onClick={()=>onStart(r)} style={{cursor:"pointer"}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.7rem",fontWeight:800,color:r.color}}>{r.name}</div>
                <div style={{fontFamily:"monospace",fontSize:"0.78rem",color:"#AEAEB2",marginTop:"2px",lineHeight:1.4}}>{r.description}</div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                <button onClick={()=>setExpanded(expanded===r.id?null:r.id)} style={{background:"transparent",border:"none",color:"#AEAEB2"}}><Info size={16}/></button>
                <button onClick={()=>onStart(r)}
                  className="flex items-center justify-center w-10 h-10 rounded"
                  style={{background:r.color,border:"none",transition:"transform 0.1s cubic-bezier(.4,0,.2,1)"}}
                  onMouseDown={e=>e.currentTarget.style.transform="scale(0.9)"} onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}>
                  <Play size={20} color="#1C1C1E"/>
                </button>
              </div>
            </div>
            {expanded===r.id && r.optimizations && (
              <div className="px-4 pb-4" style={{borderTop:"1px solid #3A3A3E",paddingTop:"12px"}}>
                <div style={{fontFamily:"monospace",fontSize:"0.78rem",color:"#FF9900",letterSpacing:"0.1em",marginBottom:"8px"}}>WHY THIS IS 45+ OPTIMIZED</div>
                {r.optimizations.map((o,i)=>(
                  <div key={i} className="flex gap-2 mb-1">
                    <span style={{color:"#FF9900",flexShrink:0,fontFamily:"monospace",fontSize:"0.82rem"}}>→</span>
                    <span style={{fontFamily:"monospace",fontSize:"0.78rem",color:"#C7C7CC",lineHeight:1.5}}>{o}</span>
                  </div>
                ))}
                <div style={{marginTop:"8px",fontFamily:"monospace",fontSize:"1.15rem",color:"#9A9A9E",borderTop:"1px solid #3A3A3E",paddingTop:"8px"}}>
                  {r.exercises.map(id=>EXERCISES_DB.find(e=>e.id===id)?.name).filter(Boolean).join(" · ")}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── BUILDER ─────────────────────────────────────────────────────────────────

function BuilderScreen() {
  const [routines, setRoutines] = useState(ROUTINES.map(r=>({...r,exercises:[...r.exercises]})));
  const [sel, setSel] = useState(0);
  const [dragIdx, setDragIdx] = useState(null);
  const [saved, setSaved] = useState(false);
  const r = routines[sel];
  const add = id => { if(r.exercises.includes(id))return; setRoutines(rs=>rs.map((x,i)=>i===sel?{...x,exercises:[...x.exercises,id]}:x)); };
  const rem = id => setRoutines(rs=>rs.map((x,i)=>i===sel?{...x,exercises:x.exercises.filter(e=>e!==id)}:x));
  const move = (from,to) => {
    const exs=[...r.exercises]; const [m]=exs.splice(from,1); exs.splice(to,0,m);
    setRoutines(rs=>rs.map((x,i)=>i===sel?{...x,exercises:exs}:x));
  };
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-5 pt-5 pb-3" style={{borderBottom:"2px solid #3A3A3E"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"2.4rem",fontWeight:800,color:"#FFFFFF"}}>WORKOUT<br/><span style={{color:"#E8FF47"}}>BUILDER</span></div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {routines.map((x,i)=>(
            <button key={x.id} onClick={()=>setSel(i)} className="px-3 py-1 rounded whitespace-nowrap"
              style={{fontFamily:"monospace",fontSize:"0.8rem",background:sel===i?x.color:"#2A2A2E",color:sel===i?"#1C1C1E":"#EBEBF0",border:sel===i?"1px solid "+x.color:"1px solid #222",transition:"all 0.1s"}}>
              {x.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 mb-4">
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.85rem",fontWeight:700,color:r.color,flex:1}}>{r.name}</div>
          <button onClick={()=>{setRoutines(rs=>[...rs,{...r,id:"c_"+Date.now(),name:r.name+" COPY"}]);setSel(routines.length);}} style={{color:"#AEAEB2",background:"transparent",border:"none"}}><Copy size={16}/></button>
          <button onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2000);}} className="px-3 py-1 rounded flex items-center gap-1"
            style={{background:saved?"#E8FF47":"#2A2A2E",color:saved?"#1C1C1E":"#E8FF47",border:"1px solid "+saved?"#E8FF47":"#333",fontFamily:"monospace",fontSize:"0.8rem",transition:"all 0.2s"}}>
            {saved?<><Check size={10}/> SAVED</>:"SAVE"}
          </button>
        </div>
        <div style={{color:"#9A9A9E",fontFamily:"monospace",fontSize:"0.8rem",letterSpacing:"0.2em",marginBottom:"8px"}}>EXERCISES ({r.exercises.length})</div>
        <div className="flex flex-col gap-2 mb-4">
          {r.exercises.map((id,i)=>{
            const ex=EXERCISES_DB.find(e=>e.id===id);
            return (
              <div key={id} draggable onDragStart={()=>setDragIdx(i)}
                onDragOver={e=>{e.preventDefault();if(dragIdx!==null&&dragIdx!==i){move(dragIdx,i);setDragIdx(i);}}}
                onDragEnd={()=>setDragIdx(null)}
                className="flex items-center gap-3 px-4 py-3 rounded"
                style={{background:"#2A2A2E",border:"1px solid #3A3A3E",cursor:"grab"}}>
                <GripVertical size={14} color="#333"/>
                <span style={{fontFamily:"monospace",fontSize:"0.9rem",color:"#E5E5EA",flex:1}}>{ex.name}</span>
                <span style={{fontFamily:"monospace",fontSize:"0.8rem",color:"#9A9A9E"}}>{ex.defaultSets}×{ex.defaultReps}</span>
                <button onClick={()=>rem(id)} style={{color:"#FF3C00",background:"transparent",border:"none"}}><X size={14}/></button>
              </div>
            );
          })}
          {r.exercises.length===0&&<div className="py-6 text-center" style={{fontFamily:"monospace",fontSize:"0.85rem",color:"#8A8A8E"}}>ADD EXERCISES BELOW</div>}
        </div>
        <div style={{color:"#9A9A9E",fontFamily:"monospace",fontSize:"0.8rem",letterSpacing:"0.2em",marginBottom:"8px"}}>ADD FROM LIBRARY</div>
        <div className="flex flex-col gap-1">
          {EXERCISES_DB.filter(e=>!r.exercises.includes(e.id)).map(ex=>(
            <button key={ex.id} onClick={()=>add(ex.id)} className="flex items-center gap-3 px-3 py-2 rounded text-left"
              style={{background:"#1C1C1E",border:"1px solid #333337",transition:"border-color 0.1s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor="#333"} onMouseLeave={e=>e.currentTarget.style.borderColor="#151515"}>
              <Plus size={12} color="#9A9A9E"/>
              <span style={{fontFamily:"monospace",fontSize:"0.9rem",color:"#BBBBBC",flex:1}}>{ex.name}</span>
              <span style={{fontFamily:"monospace",fontSize:"1.15rem",color:"#8A8A8E"}}>{ex.muscle}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── LOCALSTORAGE HELPERS ─────────────────────────────────────────────────────

const LS_KEY = "woa_v1";

function loadStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveStorage(data) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch {}
}

function todayStr() {
  return new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"});
}

function thisWeekKey() {
  const d = new Date();
  const day = d.getDay();
  const mon = new Date(d); mon.setDate(d.getDate() - (day===0?6:day-1));
  return mon.toISOString().slice(0,10);
}

function buildDefaultStorage() {
  return {
    recentPRs: RECENT_PRS,
    weeklyVolume: WEEKLY_VOLUME,
    prHistory: PR_HISTORY,
    workoutLog: [],         // [{date, routineId, routineName, duration, totalSets, volume}]
    customRoutines: [],     // user-saved routines from builder
    streak: 5,
    weekGoal: 3,
    weekWorkouts: {},       // { "2025-01-06": ["push","legs"] } keyed by monday of week
    lastPRs: {},            // { exerciseId: weightLB }
  };
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function WorkoutApp() {
  const [tab, setTab] = useState("home");
  const [activeWorkout, setActiveWorkout] = useState(null);

  // ── Persistent app data ──
  const [appData, setAppData] = useState(() => {
    const saved = loadStorage();
    return saved ? { ...buildDefaultStorage(), ...saved } : buildDefaultStorage();
  });

  const updateData = (updater) => {
    setAppData(prev => {
      const next = typeof updater === "function" ? updater(prev) : { ...prev, ...updater };
      saveStorage(next);
      return next;
    });
  };

  // ── Compute streak and weekly progress ──
  const weekKey = thisWeekKey();
  const weekDoneList = appData.weekWorkouts[weekKey] || [];
  const weekDone = weekDoneList.length;

  // ── Start workout ──
  const start = r => { setActiveWorkout(r); setTab("workout"); };

  // ── Finish workout — record history and update PRs ──
  const finish = (summary) => {
    if (summary) {
      const today = todayStr();
      const newLog = { date: today, routineId: summary.routineId, routineName: summary.routineName,
        duration: summary.duration, totalSets: summary.totalSets, volume: summary.volume };

      // Update PRs
      const newLastPRs = { ...appData.lastPRs };
      const newRecentPRs = [];
      summary.prCandidates.forEach(({ id, weight, name }) => {
        const prev = newLastPRs[id] || 0;
        const isNew = weight > 0 && weight > prev;
        if (isNew) newLastPRs[id] = weight;
        newRecentPRs.push({ exercise: name, weight, date: today, isNew });
      });

      // Update weekly volume chart — add this week's volume to last entry or push new
      const vol = [...appData.weeklyVolume];
      const lastWeek = vol[vol.length - 1];
      const weekLabel = "W"+(vol.length);
      if (lastWeek && lastWeek.week === weekLabel) {
        vol[vol.length-1] = { ...lastWeek,
          Chest: (lastWeek.Chest||0) + (summary.muscleVolume.Chest||0),
          Back:  (lastWeek.Back||0)  + (summary.muscleVolume.Back||0),
          Legs:  (lastWeek.Legs||0)  + (summary.muscleVolume.Legs||0),
          Shoulders:(lastWeek.Shoulders||0)+(summary.muscleVolume.Shoulders||0),
        };
      } else {
        vol.push({ week: "W"+(vol.length+1), ...summary.muscleVolume });
        if (vol.length > 8) vol.shift();
      }

      // Update streak
      const todayKey = new Date().toISOString().slice(0,10);
      const ww = { ...appData.weekWorkouts };
      if (!ww[weekKey]) ww[weekKey] = [];
      if (!ww[weekKey].includes(todayKey)) ww[weekKey] = [...ww[weekKey], todayKey];

      const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1);
      const yKey = yesterday.toISOString().slice(0,10);
      const prevWKey = new Date(weekKey); prevWKey.setDate(prevWKey.getDate()-7);
      const prevWeekKey = prevWKey.toISOString().slice(0,10);
      const workedYesterday = (ww[weekKey]||[]).includes(yKey) || (ww[prevWeekKey]||[]).includes(yKey);
      const newStreak = workedYesterday ? appData.streak + 1 : 1;

      updateData({
        workoutLog: [newLog, ...appData.workoutLog].slice(0, 100),
        recentPRs: newRecentPRs.slice(0, 6),
        weeklyVolume: vol,
        lastPRs: newLastPRs,
        streak: newStreak,
        weekWorkouts: ww,
      });
    }
    setActiveWorkout(null);
    setTab("home");
  };
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
        ::-webkit-scrollbar{width:0;height:0;}
        button{cursor:pointer;}
        input{color:#f0f0f0;}
        input::placeholder{color:#333;}
      `}</style>
      <div style={{width:"100%",maxWidth:"430px",height:"100dvh",margin:"0 auto",background:"#1C1C1E",display:"flex",flexDirection:"column",overflow:"hidden",fontFamily:"monospace"}}>
        <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
          {tab==="home"    && <HomeScreen onStart={start} streak={appData.streak} weekDone={weekDone} weekGoal={appData.weekGoal} recentPRs={appData.recentPRs} workoutLog={appData.workoutLog}/>}
          {tab==="workout" && (activeWorkout ? <ActiveWorkout routine={activeWorkout} lastPRs={appData.lastPRs} onFinish={finish}/> : <WorkoutSelectScreen onStart={start}/>)}
          {tab==="pt"      && <PhysicalTherapyScreen/>}
          {tab==="library" && <LibraryScreen lastPRs={appData.lastPRs}/>}
          {tab==="progress"&& <ProgressScreen weeklyVolume={appData.weeklyVolume} prHistory={appData.prHistory} workoutLog={appData.workoutLog}/>}
        </div>
        {!activeWorkout && <TabBar active={tab} onChange={t=>{setTab(t);if(t!=="workout")setActiveWorkout(null);}}/>}
      </div>
    </>
  );
}
