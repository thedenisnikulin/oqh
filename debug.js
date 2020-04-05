let users = [
    {tag: 'f'}, {tag: 'f'}, {tag: 'f'}, {tag: 'f'},
    {tag: 'f'}, {tag: 'f'}, {tag: 'f'}, {tag: 'f'},
    {tag: 'b'}, {tag: 'b'}, {tag: 'b'}, {tag: 'b'},
    {tag: 'b'}, {tag: 'b'}, {tag: 'b'}, {tag: 'b'},
]

let teams = [
    // 2 frontend, 2 backend
    [2, 2], [2, 2], // team A, team B
    [2, 2], [2, 2]  // team C, team D
];
const teamTags = ['A', 'B', 'C', 'D'];
users.map(user => {
    let isSet = false;
    let tagIndex = user.tag === frontend_tag ? 0 : 1;
    for (let teamIndex = 0; teamIndex < teams.length; teamIndex++) {
        if (isSet) break;
        if (teams[teamIndex][tagIndex] !== 0) {
            teams[teamIndex][tagIndex]--;
            user.team = teamTags[teamIndex]
            isSet = true;
        }
    }
})

console.log(users)
console.log(teams)