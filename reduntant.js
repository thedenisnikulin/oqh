room = {
    users: [
        {tag: 'backend developer'}, {tag: 'backend developer'}, {tag: 'frontend developer'}, {tag: 'backend developer'}, 
        {tag: 'frontend developer'}, {tag: 'frontend developer'}, {tag: 'frontend developer'}, {tag: 'backend developer'},
        {tag: 'backend developer'}, {tag: 'frontend developer'}, {tag: 'backend developer'}, {tag: 'frontend developer'},
        {tag: 'backend developer'}, {tag: 'backend developer'}, {tag: 'frontend developer'}, {tag: 'frontend developer'},
    ]
}

const frontend_tag = 'frontend developer';
const backend_tag = 'backend developer';

// map users by teams: 4 teams with 4 members
let teams = [
    // 2 frontenders and 2 backenders in each team
    [2, 2], [2, 2], // team A, team B
    [2, 2], [2, 2]  // team C, team D
];
const teamTags = ['A', 'B', 'C', 'D'];

room.users.map(user => {
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

room.users.map(user => console.log(user.team))