// Student leaderboard entries.
//
// Placeholder rows — populate with real student names, schools and scores
// once enrolment opens. Each entry expects:
//
//   rank      number     1-based rank (auto-sorted by `score` if reordered)
//   name      string     full student name
//   school    string     short school identifier (sof | sot | sod | som)
//   country   string     ISO-style 2-letter for the flag column
//   score     number     0-100 — progress / cumulative grade percentage
//   streak    number     consecutive weeks active (lab attendance)
//   badge     string     'gold' | 'silver' | 'bronze' | null
//
// `isPlaceholder: true` flips the leaderboard into "coming soon" mode, which
// renders the same row with anonymised initials and a Soon pill. Set to
// false once you start uploading real students.

export const LEADERBOARD_IS_LIVE = false;

export const leaderboard = [
    { rank: 1, name: 'Aarav S.',     school: 'sof', country: 'AE', score: 98, streak: 24, badge: 'gold',   isPlaceholder: true },
    { rank: 2, name: 'Layla R.',     school: 'sot', country: 'AE', score: 96, streak: 22, badge: 'silver', isPlaceholder: true },
    { rank: 3, name: 'Karthik M.',   school: 'som', country: 'IN', score: 94, streak: 21, badge: 'bronze', isPlaceholder: true },
    { rank: 4, name: 'Nadia K.',     school: 'sod', country: 'AE', score: 92, streak: 19, badge: null,     isPlaceholder: true },
    { rank: 5, name: 'Rohan V.',     school: 'sof', country: 'IN', score: 91, streak: 18, badge: null,     isPlaceholder: true },
    { rank: 6, name: 'Mariam A.',    school: 'sot', country: 'AE', score: 89, streak: 17, badge: null,     isPlaceholder: true },
    { rank: 7, name: 'Daniel C.',    school: 'sof', country: 'US', score: 88, streak: 16, badge: null,     isPlaceholder: true },
    { rank: 8, name: 'Priya N.',     school: 'som', country: 'IN', score: 86, streak: 15, badge: null,     isPlaceholder: true },
    { rank: 9, name: 'Yusuf H.',     school: 'sod', country: 'AE', score: 84, streak: 14, badge: null,     isPlaceholder: true },
    { rank: 10, name: 'Sara B.',     school: 'sot', country: 'IN', score: 82, streak: 13, badge: null,     isPlaceholder: true },
];

export default leaderboard;
