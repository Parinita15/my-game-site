let charm = 0;
let awkward = 0;
let chaos = 0;

const storyBox = document.getElementById("storyBox");
const choicesBox = document.getElementById("choices");
const stats = document.getElementById("stats");

// ---------------- STORY ----------------
const story = {
  start: {
    text: "You arrive at a small café for a blind date. A girl is already sitting there. She looks up nervously, fidgeting with her cup. She's pretty in a quiet, shy way.\n\nShe notices you walking over.\n\nHow do you greet her?",
    choices: [
      { text: "Smile warmly and say 'Hey, you must be Parinita 😊'", next: "goodIntro", charm: 2, awkward: 0, chaos: 0 },
      { text: "Wave awkwardly and say 'So… I guess this is happening.'", next: "awkIntro", charm: 0, awkward: 2, chaos: 0 },
      { text: "Sit down and say nothing for 5 seconds", next: "silentIntro", charm: -1, awkward: 3, chaos: 1 }
    ]
  },

  goodIntro: {
    text: "She relaxes a little and smiles. 'Hi…yup thats me it's nice to meet you, Richard?' She looks relieved you’re normal.\n\nThe waiter comes over. What do you do?",
    choices: [
      { text: "Let her order first politely", next: "ordering", charm: 3, awkward: 0, chaos: 0 },
      { text: "Say 'I’ll just get whatever my pakistani bombshell princess gets'", next: "orderingChaos", charm: -2, awkward: 3, chaos: 2 },
      { text: "Ask the waiter what THEY personally recommend for 'the full romantic experience'", next: "orderingChaos", charm: 0, awkward: 2, chaos: 3 }
    ]
  },

  awkIntro: {
    text: "She laughs nervously. 'Yup… it sure is.' There's awkward energy, but it's not bad yet.\n\nShe tries to start conversation. You?",
    choices: [
      { text: "Ask her about her hobbies", next: "conversationGood", charm: 3, awkward: 0, chaos: 0 },
      { text: "Say 'I'm not good at this, wanna skip food and go to my crib instead?' *PERVY SMIRK* ", next: "conversationAwk", charm: 0, awkward: 2, chaos: 3 },
      { text: "Start rigorously trauma dumping while maintaining severe eye contact", next: "conversationChaos", charm: -1, awkward: 3, chaos: 3 }
    ]
  },

  silentIntro: {
    text: "She slowly sips her drink. The silence is… loud.\n\nShe awkwardly says 'So… how was your day?'",
    choices: [
      { text: "Answer normally and recover", next: "conversationGood", charm: 2, awkward: 1, chaos: 0 },
      { text: "Say 'Define day'", next: "conversationChaos", charm: 0, awkward: 2, chaos: 3 }
    ]
  },

  ordering: {
    text: "The conversation starts flowing a bit more naturally. She seems more comfortable now.\n\nThe food arrives. What’s your move?",
    choices: [
      { text: "Make light jokes while eating", next: "midDateGood", charm: 3, awkward: 0, chaos: 0 },
      { text: "Compliment her HUGE HONKERS randomly", next: "midDateChaos", charm: 0, awkward: 3, chaos: 3 },
      { text: "Stare at your food like it owes you money", next: "midDateAwk", charm: 0, awkward: 3, chaos: 1 }
    ]
  },

  orderingChaos: {
    text: "The waiter looks confused. She laughs but also looks slightly concerned.\n\nThis is becoming unpredictable.",
    choices: [
      { text: "Say 'I was joking… mostly'", next: "midDateAwk", charm: 1, awkward: 2, chaos: 2 },
      { text: "Commit to the chaos energy", next: "midDateChaos", charm: 0, awkward: 1, chaos: 4 }
    ]
  },

  conversationGood: {
    text: "She opens up more. You can tell she’s starting to enjoy herself.\n\nTime passes faster than expected.",
    choices: [
      { text: "Ask if she wants dessert", next: "endingGood", charm: 4, awkward: 0, chaos: 0 },
      { text: "Ask if she wants YOU as dessert while suggestively licking your lips repeatedly like a reptile on a hunt", next: "endingChaos", charm: 0, awkward: 3, chaos: 3 }
    ]
  },

  conversationAwk: {
    text: "She nods politely but there’s a slight distance now.\n\nThe vibe is a bit off, but recoverable.",
    choices: [
      { text: "Try to recover with humor", next: "midDateAwk", charm: 1, awkward: 2, chaos: 1 },
      { text: "Go quiet again", next: "endingAwk", charm: -1, awkward: 4, chaos: 1 }
    ]
  },

  conversationChaos: {
    text: "She is visibly unsure how to respond now. Parinita is flabbergasted. \n\nYou may have entered chaos territory.",
    choices: [
      { text: "Try to steer back to normal conversation", next: "midDateAwk", charm: 1, awkward: 2, chaos: 2 },
      { text: "Double down and say something worse", next: "endingChaos", charm: -2, awkward: 3, chaos: 5 }
    ]
  },

  midDateGood: {
    text: "The date actually feels… nice. Comfortable silence, occasional laughter.\n\nShe seems happy she came.",
    choices: [
      { text: "Offer to walk her home after", next: "endingGood", charm: 5, awkward: 0, chaos: 0 },
      { text: "Say you’d like to see her again", next: "endingGood", charm: 6, awkward: 0, chaos: 0 }
    ]
  },

  midDateAwk: {
    text: "The potential is hanging by a thread, but the awkward moments are really stacking up.\n\nShe’s trying though.",
    choices: [
      { text: "Apologize and try to reset vibe", next: "endingNeutral", charm: 2, awkward: 2, chaos: 0 },
      { text: "Make a self-deprecating joke", next: "endingNeutral", charm: 2, awkward: 1, chaos: 1 }
    ]
  },

  midDateChaos: {
    text: "This is no longer a normal date.\n\nIt has become an ungodly out of world experience.",
    choices: [
      { text: "Try to calm things down", next: "endingNeutral", charm: 1, awkward: 2, chaos: 2 },
      { text: "Embrace chaos fully", next: "endingChaos", charm: -3, awkward: 3, chaos: 6 }
    ]
  },

  endingGood: {
    text: "💖 ENDING: Successful Date\n\nShe smiles at the end and says she had a really nice time.\n\nRating: 9/10\n\nShe would absolutely go on another date.",
    choices: []
  },

  endingNeutral: {
    text: "😐 ENDING: Mixed Feelings\n\nThe date wasn’t bad… just a bit all over the place.\n\nRating: 6/10\n\nShe’s unsure, but not entirely against a second chance.",
    choices: []
  },

  endingAwk: {
    text: "😬 ENDING: Awkward Exit\n\nShe politely finishes her drink and leaves hurriedly. Safe to assume she's never coming back.\n\nRating: 4/10\n\nProbably needs recovery time.",
    choices: []
  },

  endingChaos: {
    text: "💀 ENDING: NEVER AGAIN\n\nShe looks at you fearfully and says:\n\n'I'm going to off myself from this horrendous experience and my lawyer WILL be contacting you for harassment charges!'\n\nRating: 1/10\n\nYou have caused emotional damage (unintentionally… probably).",
    choices: []
  }
};

// ---------------- LOAD SCENE ----------------
function loadScene(key) {
  const scene = story[key];

  storyBox.innerText = scene.text;
  choicesBox.innerHTML = "";

  scene.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.innerText = choice.text;

    btn.onclick = () => {
      charm += choice.charm;
      awkward += choice.awkward;
      chaos += choice.chaos;

      updateStats();
      loadScene(choice.next);
    };

    choicesBox.appendChild(btn);
  });
}

// ---------------- STATS ----------------
function updateStats() {
  stats.innerText = `💖 Charm: ${charm} | 😬 Awkward: ${awkward} | 💀 Chaos: ${chaos}`;
}

// ---------------- HOME ----------------
function goHome() {
  window.location.href = "index.html";
}

// START
loadScene("start");