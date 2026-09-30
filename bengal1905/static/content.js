(function () {
  // ─────────────────────────────────────────────────────────────
  //  DIVIDE AND RULE: BENGAL 1905–1908
  //  You play the Raj. Loyalty ties (Raj ↔ each group) must stay above
  //  zero. Opposition ties (among Indian groups) feed the National Front
  //  gauge; if it reaches the threshold, the movement has united.
  //  Effects: positive amounts raise a tie, negative amounts lower it.
  // ─────────────────────────────────────────────────────────────

  const OPENING_VIGNETTE = {
    pages: [
      {
        title: "Calcutta, October 1905",
        text: "You are an officer in the Home Department, working for Home Secretary **Herbert Risley**. Last year he wrote the memo that explains your job: \"Bengal united is a power. Bengal divided will pull in different ways... One of our main objects is to split up and thereby to weaken a solid body of opponents to our rule.\"\n\nOn October 16 the **partition** takes effect. Calcutta is in mourning. Your task is to keep the partition in place until the opposition gives up.",
        button: "Continue"
      },
      {
        title: "Two Kinds of Ties",
        text: "**Blue lines** run from the Raj at the center to each group: the Moderates' faith in petitions, the Muslim Leaders' loyalty, the merchants' trade and credit, the students' careers, and the Extremists' fear of force. If any blue line reaches zero, you lose control of that group.\n\n**Red lines** tie the Indian groups to each other. You want them weak. The five **bright red** lines, Congress unity and the four Hindu-Muslim bridges, make up the **National Front**. If the National Front reaches **65**, the movement has united, and you have no troops to spare to stop it.",
        button: "Continue"
      },
      {
        title: "Your Tools",
        text: "Each month brings news. You answer with one of three tools: offers, crackdowns, leaks, concessions. Every tool helps somewhere and costs somewhere else. Crackdowns frighten the Extremists and drive students toward them. Favors to Muslim leaders loosen the Hindu-Muslim bridge and anger the Moderates.\n\nEvery month, red lines you leave alone grow stronger, and blue lines you neglect weaken. The movement grows unless you act, and loyalty fades unless you pay for it.",
        button: "Begin"
      }
    ]
  };

  const NODE_DEFINITIONS = [
    { id: "moderates", label: "Congress Moderates", shortLabel: "Moderates", color: "#d4a843" },
    { id: "radicals", label: "Extremists", shortLabel: "Extremists", color: "#c0392b" },
    { id: "students", label: "Students", shortLabel: "Students", color: "#e87d2f" },
    { id: "muslims", label: "Muslim Leaders of East Bengal", shortLabel: "Muslims", color: "#2d8a5e" },
    { id: "merchants", label: "Merchants and Zamindars", shortLabel: "Merchants", color: "#8b5e3c" },
    { id: "british", label: "The Raj", shortLabel: "The Raj", color: "#4a6fa5", center: true }
  ];

  // kind: 'loyalty' (Raj ↔ group; must stay above 0) or 'opposition' (want low)
  // front: true if it counts toward the National Front gauge
  const TIE_DEFINITIONS = [
    { id: "moderates-british", nodeA: "moderates", nodeB: "british", kind: "loyalty", label: "Constitutional Channel", description: "The Moderates' belief that petitions and council seats still matter", initial: 50 },
    { id: "radicals-british", nodeA: "radicals", nodeB: "british", kind: "loyalty", label: "Deterrence", description: "The Extremists' fear of what the Raj will do to them", initial: 40 },
    { id: "students-british", nodeA: "students", nodeB: "british", kind: "loyalty", label: "Colleges & Careers", description: "Students' dependence on government colleges, scholarships, and jobs", initial: 50 },
    { id: "muslims-british", nodeA: "muslims", nodeB: "british", kind: "loyalty", label: "Loyalist Compact", description: "Muslim leaders' confidence that the Raj protects their new province", initial: 45 },
    { id: "merchants-british", nodeA: "merchants", nodeB: "british", kind: "loyalty", label: "Trade & Credit", description: "Merchants' and zamindars' dependence on British trade and government banks", initial: 55 },

    { id: "moderates-radicals", nodeA: "moderates", nodeB: "radicals", kind: "opposition", front: true, label: "Congress Unity", description: "Petitioners and street organizers still in one movement", initial: 55 },
    { id: "moderates-muslims", nodeA: "moderates", nodeB: "muslims", kind: "opposition", front: true, label: "Secular Alliance", description: "Moderates and Muslim leaders working together", initial: 50 },
    { id: "radicals-muslims", nodeA: "radicals", nodeB: "muslims", kind: "opposition", front: true, label: "Anti-Colonial Solidarity", description: "Extremists and Muslims united against the Raj", initial: 30 },
    { id: "students-muslims", nodeA: "students", nodeB: "muslims", kind: "opposition", front: true, label: "Campus Coexistence", description: "Hindu and Muslim students in the same classrooms and causes", initial: 50 },
    { id: "muslims-merchants", nodeA: "muslims", nodeB: "merchants", kind: "opposition", front: true, label: "Bazaar Trust", description: "Trade across communal lines in the markets", initial: 60 },
    { id: "moderates-students", nodeA: "moderates", nodeB: "students", kind: "opposition", label: "Student Discipline", description: "Moderate leaders' hold over student activists", initial: 60 },
    { id: "moderates-merchants", nodeA: "moderates", nodeB: "merchants", kind: "opposition", label: "Elite Funding", description: "Propertied Bengal bankrolling the Moderates", initial: 60 },
    { id: "radicals-students", nodeA: "radicals", nodeB: "students", kind: "opposition", label: "Revolutionary Pipeline", description: "Students drawn into the Extremists' networks", initial: 45 },
    { id: "radicals-merchants", nodeA: "radicals", nodeB: "merchants", kind: "opposition", label: "Boycott Funding", description: "Money for swadeshi mills and pickets", initial: 40 },
    { id: "students-merchants", nodeA: "students", nodeB: "merchants", kind: "opposition", label: "Swadeshi Consumers", description: "Students buying swadeshi goods and merchants' sons in the movement", initial: 50 }
  ];

  // Tuned by simulation (4,000 games per policy): random play wins ~30%;
  // balanced play wins; ignoring loyalty loses the Moderates.
  const GAME_RULES = {
    frontThreshold: 65,
    driftMin: 2,
    driftMax: 2,
    loyaltyErosion: 1
  };

  const EVENT_CARDS = [
    {
      id: "partition_takes_effect",
      date: "October 1905",
      title: "Partition Day",
      telegraph: "PARTITION IN FORCE — CALCUTTA IN MOURNING — STOP",
      narration: "The partition takes effect. Calcutta observes a day of mourning: shops shut, crowds bathe in the Ganges, and Tagore's followers tie *rakhis* on Hindu and Muslim wrists alike.",
      learnMore: "The partition was announced in July 1905 and took effect on October 16. Rabindranath Tagore called for a Raksha Bandhan observance in which Bengalis tied rakhis on one another's wrists as a sign of unity. Many Muslims joined, but some Muslim leaders in the east saw a Hindu ritual wrapped around a political demand.",
      shifts: [
        { tie: "students-muslims", amount: 6, reason: "Rakhis tied across communal lines" },
        { tie: "moderates-british", amount: -8, reason: "Twenty years of petitions ignored" }
      ],
      actions: [
        { label: "Receive the Moderates", description: "The Lieutenant-Governor grants Banerjee's deputation a courteous hearing", effects: [{ tie: "moderates-british", amount: 12 }, { tie: "moderates-radicals", amount: 4 }] },
        { label: "Court the Nawab", description: "Invite Nawab Salimullah to Government House as the champion of the new province", effects: [{ tie: "muslims-british", amount: 10 }, { tie: "moderates-muslims", amount: -8 }, { tie: "moderates-british", amount: -4 }] },
        { label: "Ban the Processions", description: "Order the police to disperse mourning processions in Calcutta", effects: [{ tie: "radicals-british", amount: 10 }, { tie: "radicals-students", amount: 8 }] }
      ]
    },
    {
      id: "carlyle_circular",
      date: "October 1905",
      title: "Students on the Pickets",
      telegraph: "STUDENTS PICKET CLOTH SHOPS — COLLEGES EMPTY — STOP",
      narration: "College students are picketing shops that sell British cloth. The education department wants to threaten their scholarships.",
      learnMore: "In October 1905 the government's Carlyle Circular threatened to withdraw grants and scholarships from schools whose students joined political activity. Instead of quieting the students, it produced the Anti-Circular Society and pushed many into full-time organizing.",
      shifts: [
        { tie: "radicals-students", amount: 6, reason: "Students join the pickets" },
        { tie: "students-british", amount: -6, reason: "Colleges lose their students to the streets" }
      ],
      actions: [
        { label: "Issue the Circular", description: "Threaten to cut grants to any school whose students picket", effects: [{ tie: "students-british", amount: 8 }, { tie: "radicals-students", amount: 6 }, { tie: "moderates-students", amount: -8 }] },
        { label: "Quiet Word to Principals", description: "Ask college heads to discipline pickets privately, without a public order", effects: [{ tie: "students-british", amount: 6 }, { tie: "radicals-british", amount: -4 }] },
        { label: "Open Posts to Muslim Graduates", description: "Announce new government posts in Dacca reserved for Muslim graduates", effects: [{ tie: "students-muslims", amount: -10 }, { tie: "muslims-british", amount: 6 }, { tie: "moderates-british", amount: -4 }] }
      ]
    },
    {
      id: "swadeshi_bonfires",
      date: "December 1905",
      title: "Bonfires of Manchester Cloth",
      telegraph: "BRITISH CLOTH BURNED IN CALCUTTA SQUARES — STOP",
      narration: "Crowds burn imported cloth in public squares. Swadeshi mills are raising money. Manchester merchants are writing angry letters to London.",
      learnMore: "Public bonfires of British cloth became the signature ritual of the boycott. They cost merchants who held imported stock real money, and much of the cloth trade in East Bengal was in the hands of Muslim traders, who could not afford to burn it.",
      shifts: [
        { tie: "radicals-merchants", amount: 6, reason: "Merchants fund swadeshi mills" },
        { tie: "merchants-british", amount: -6, reason: "Import orders are cancelled" }
      ],
      actions: [
        { label: "Protect Muslim Traders", description: "Post police at Muslim-owned cloth shops and publicize every attack on them", effects: [{ tie: "muslims-merchants", amount: -10 }, { tie: "muslims-british", amount: 6 }, { tie: "radicals-british", amount: -4 }] },
        { label: "Extend Credit to Importers", description: "Have government banks carry importers through the boycott", effects: [{ tie: "merchants-british", amount: 10 }, { tie: "radicals-merchants", amount: -4 }] },
        { label: "Prosecute the Organizers", description: "Charge bonfire organizers under the rioting laws", effects: [{ tie: "radicals-british", amount: 10 }, { tie: "moderates-radicals", amount: 6 }] }
      ]
    },
    {
      id: "nawab_loan",
      date: "February 1906",
      title: "The Nawab's Debts",
      telegraph: "NAWAB OF DACCA SEEKS GOVERNMENT LOAN — STOP",
      narration: "Nawab Salimullah of Dacca, the loudest Muslim voice for the partition, is deep in debt. His agents ask quietly whether the government might help.",
      learnMore: "In 1906 the government arranged a large, low-interest loan (about 14 lakh rupees) for Nawab Salimullah. Nationalists charged that his support for the partition had been bought. The Nawab went on to host the founding of the All-India Muslim League at Dacca that December.",
      shifts: [
        { tie: "muslims-british", amount: -6, reason: "The Nawab's creditors are pressing" },
        { tie: "moderates-muslims", amount: 4, reason: "Calcutta Muslims question the partition" }
      ],
      actions: [
        { label: "Arrange the Loan", description: "Lend the Nawab 14 lakh rupees at low interest through government channels", effects: [{ tie: "muslims-british", amount: 14 }, { tie: "moderates-muslims", amount: -6 }, { tie: "moderates-british", amount: -6 }] },
        { label: "Delay and Hint", description: "Promise to consider it, and let him understand that his loyalty is being noticed", effects: [{ tie: "muslims-british", amount: 5 }] },
        { label: "Refuse, Publicly", description: "Decline the loan and announce that the government plays no favorites", effects: [{ tie: "moderates-british", amount: 8 }, { tie: "muslims-british", amount: -10 }, { tie: "moderates-muslims", amount: 4 }] }
      ]
    },
    {
      id: "barisal",
      date: "April 1906",
      title: "The Barisal Conference",
      telegraph: "BARISAL CONFERENCE — PROCESSION CHANTS BANDE MATARAM — STOP",
      narration: "Delegates to the Bengal provincial conference at Barisal plan to march through the town shouting *Bande Mataram*, which the district magistrate has banned in public streets.",
      learnMore: "In April 1906 police under Magistrate Emerson broke up the Barisal conference procession with lathis. Surendranath Banerjee was arrested and fined. The conference's president was the Muslim barrister Abdul Rasul, a reminder that some Muslims stood with the movement.",
      shifts: [
        { tie: "moderates-radicals", amount: 6, reason: "Moderates and Extremists march together" },
        { tie: "moderates-muslims", amount: 4, reason: "A Muslim barrister presides" }
      ],
      actions: [
        { label: "Break Up the Procession", description: "Let Emerson's police clear the streets with lathis and arrest Banerjee", effects: [{ tie: "radicals-british", amount: 12 }, { tie: "moderates-british", amount: -10 }, { tie: "moderates-radicals", amount: 6 }] },
        { label: "Allow It, Quietly", description: "Tell the magistrate to look away and let the procession pass", effects: [{ tie: "moderates-british", amount: 6 }, { tie: "radicals-british", amount: -8 }] },
        { label: "Ban the Slogan Only", description: "Permit the march but prosecute anyone who shouts Bande Mataram", effects: [{ tie: "radicals-british", amount: 6 }, { tie: "moderates-radicals", amount: -4 }, { tie: "radicals-students", amount: 4 }] }
      ]
    },
    {
      id: "simla_deputation",
      date: "October 1906",
      title: "A Deputation to Simla",
      telegraph: "MUSLIM DEPUTATION REQUESTS AUDIENCE WITH VICEROY — STOP",
      narration: "Thirty-five Muslim notables led by the Aga Khan ask Lord Minto to receive them at Simla. They want separate electorates: Muslim seats chosen by Muslim voters.",
      learnMore: "On October 1, 1906, Lord Minto received the Aga Khan's deputation at Simla and assured them that Muslims would be represented as a community. The promise became separate electorates in the Morley-Minto reforms of 1909, and it shaped Indian politics until 1947. Nationalists have long argued that officials encouraged the deputation.",
      shifts: [
        { tie: "muslims-british", amount: 4, reason: "Muslim leaders look to the Viceroy" },
        { tie: "moderates-muslims", amount: 4, reason: "Congress courts Muslim support" }
      ],
      actions: [
        { label: "Promise Separate Electorates", description: "The Viceroy assures the deputation that Muslims will be represented as a community", effects: [{ tie: "muslims-british", amount: 12 }, { tie: "moderates-muslims", amount: -10 }, { tie: "radicals-muslims", amount: -6 }, { tie: "moderates-british", amount: -8 }] },
        { label: "Warm Words Only", description: "Receive them graciously and promise nothing specific", effects: [{ tie: "muslims-british", amount: 4 }, { tie: "moderates-muslims", amount: -3 }] },
        { label: "Decline the Audience", description: "Tell them the Viceroy cannot receive sectarian deputations", effects: [{ tie: "moderates-british", amount: 6 }, { tie: "muslims-british", amount: -12 }] }
      ]
    },
    {
      id: "muslim_league",
      date: "December 1906",
      title: "A League at Dacca",
      telegraph: "ALL-INDIA MUSLIM LEAGUE FOUNDED AT DACCA — STOP",
      narration: "At the Nawab's estate in Dacca, Muslim leaders found the All-India Muslim League. Its first resolution supports the partition and condemns the boycott.",
      learnMore: "The All-India Muslim League was founded on December 30, 1906, during the All-India Muhammadan Educational Conference hosted by Nawab Salimullah. It pledged loyalty to the British government and backed the partition.",
      shifts: [
        { tie: "radicals-muslims", amount: -4, reason: "The League condemns the boycott" },
        { tie: "moderates-radicals", amount: 4, reason: "Hindu nationalists close ranks" }
      ],
      actions: [
        { label: "Welcome the League", description: "Send official congratulations and invite League leaders to advise on East Bengal", effects: [{ tie: "muslims-british", amount: 8 }, { tie: "students-muslims", amount: -6 }, { tie: "moderates-british", amount: -4 }] },
        { label: "Fund Muslim Schools", description: "Announce grants for Muslim education in East Bengal", effects: [{ tie: "muslims-british", amount: 6 }, { tie: "muslims-merchants", amount: -6 }, { tie: "merchants-british", amount: -4 }] },
        { label: "Stay Neutral", description: "Note the League's founding without comment", effects: [{ tie: "moderates-british", amount: 4 }] }
      ]
    },
    {
      id: "national_schools",
      date: "January 1907",
      title: "Expelled Students, National Schools",
      telegraph: "NATIONAL COUNCIL OF EDUCATION OPENS SCHOOLS — STOP",
      narration: "Students expelled for picketing are enrolling in new 'national' schools outside government control. Aurobindo Ghose teaches at the new National College.",
      learnMore: "In 1906 nationalists founded the National Council of Education and the Bengal National College, with Aurobindo Ghose as principal. The schools gave expelled students somewhere to go, and for a time they threatened the government's control of higher education.",
      shifts: [
        { tie: "radicals-students", amount: 6, reason: "Aurobindo teaches the expelled" },
        { tie: "students-british", amount: -8, reason: "Degrees outside government colleges" }
      ],
      actions: [
        { label: "Refuse to Recognize Their Degrees", description: "Bar national-school graduates from government posts and the bar", effects: [{ tie: "students-british", amount: 10 }, { tie: "radicals-students", amount: 6 }] },
        { label: "Readmit the Expelled", description: "Let expelled students return to government colleges if they sign a pledge", effects: [{ tie: "students-british", amount: 8 }, { tie: "moderates-students", amount: -6 }, { tie: "radicals-british", amount: -4 }] },
        { label: "Scholarships in Dacca", description: "Fund new scholarships at Dacca colleges for East Bengal's students", effects: [{ tie: "students-muslims", amount: -8 }, { tie: "students-british", amount: 4 }] }
      ]
    },
    {
      id: "picket_violence",
      date: "March 1907",
      title: "Pickets Turn on Muslim Traders",
      telegraph: "PICKETS ASSAULT CLOTH SELLERS IN EAST BENGAL — STOP",
      narration: "Boycott volunteers in East Bengal are beating traders who keep selling British cloth. Many of the traders are Muslim.",
      learnMore: "Enforcing the boycott often meant coercion: fines, social boycott, and beatings of shopkeepers who sold foreign goods. In East Bengal, where many cloth traders and most peasants were Muslim, enforcement looked to Muslims like Hindu landlords' politics imposed by force.",
      shifts: [
        { tie: "muslims-merchants", amount: -6, reason: "Muslim traders are beaten" },
        { tie: "radicals-students", amount: 4, reason: "Student volunteers run the pickets" }
      ],
      actions: [
        { label: "Publicize Every Attack", description: "Feed the Muslim press full accounts of each beating", effects: [{ tie: "radicals-muslims", amount: -10 }, { tie: "students-muslims", amount: -6 }, { tie: "radicals-british", amount: -4 }] },
        { label: "Arrest the Pickets", description: "Sweep up the volunteers and try them quickly", effects: [{ tie: "radicals-british", amount: 10 }, { tie: "radicals-students", amount: 6 }] },
        { label: "Compensate the Traders", description: "Pay damages to traders who lost stock, through the district officers", effects: [{ tie: "muslims-british", amount: 8 }, { tie: "merchants-british", amount: 4 }] }
      ]
    },
    {
      id: "comilla_jamalpur",
      date: "April 1907",
      title: "Riots at Comilla and Jamalpur",
      telegraph: "COMMUNAL RIOTING IN COMILLA AND JAMALPUR — STOP",
      narration: "After the Nawab's visit to Comilla, Hindu and Muslim crowds clash. At Jamalpur a Hindu fair is attacked. A pamphlet circulating among Muslim peasants urges them to boycott Hindu shops.",
      learnMore: "In the spring of 1907, riots at Comilla and Jamalpur in East Bengal pitted Muslim peasants against Hindu landlords and traders. A 'Red Pamphlet' (Lal Ishtahar) told Muslims to shun Hindu goods. Nationalists accused officials of standing by; officials blamed the boycott.",
      shifts: [
        { tie: "students-muslims", amount: -6, reason: "Communal violence in the east" },
        { tie: "muslims-merchants", amount: -6, reason: "Hindu shops boycotted" }
      ],
      actions: [
        { label: "Restore Order Firmly", description: "Send armed police and punish rioters of both communities", effects: [{ tie: "radicals-british", amount: 6 }, { tie: "muslims-british", amount: -4 }, { tie: "moderates-british", amount: 4 }] },
        { label: "Slow Response", description: "Let the district officers take their time", effects: [{ tie: "moderates-muslims", amount: -8 }, { tie: "radicals-muslims", amount: -6 }, { tie: "moderates-british", amount: -8 }] },
        { label: "Blame the Boycott", description: "Issue an official report tracing the riots to swadeshi coercion", effects: [{ tie: "moderates-radicals", amount: -6 }, { tie: "radicals-british", amount: -4 }, { tie: "muslims-british", amount: 4 }] }
      ]
    },
    {
      id: "deportations_1907",
      date: "May 1907",
      title: "Meetings and Presses",
      telegraph: "LAJPAT RAI DEPORTED — MEETINGS ORDINANCE PROPOSED — STOP",
      narration: "In the Punjab, Lala Lajpat Rai has been deported without trial. Calcutta officials want an ordinance banning public meetings and powers to seize printing presses.",
      learnMore: "In May 1907 the government deported Lala Lajpat Rai and Ajit Singh under an 1818 regulation that allowed detention without trial, and issued an ordinance restricting public meetings. The Newspapers (Incitement to Offences) Act of 1908 later allowed presses to be seized.",
      shifts: [
        { tie: "moderates-radicals", amount: 4, reason: "Moderates protest the deportations" },
        { tie: "moderates-british", amount: -4, reason: "Detention without trial" }
      ],
      actions: [
        { label: "Ban Public Meetings", description: "Issue the meetings ordinance for Bengal", effects: [{ tie: "radicals-british", amount: 10 }, { tie: "moderates-british", amount: -8 }, { tie: "moderates-radicals", amount: 4 }] },
        { label: "Target the Extremist Press", description: "Prosecute the editors of Bande Mataram and Jugantar, leave The Bengalee alone", effects: [{ tie: "radicals-british", amount: 8 }, { tie: "moderates-radicals", amount: -6 }, { tie: "radicals-students", amount: 4 }] },
        { label: "Offer Council Seats", description: "Hint to the Moderates that reforms and new council seats are coming", effects: [{ tie: "moderates-british", amount: 10 }, { tie: "moderates-radicals", amount: -4 }, { tie: "radicals-british", amount: -4 }] }
      ]
    },
    {
      id: "surat_split",
      date: "December 1907",
      title: "Chairs Fly at Surat",
      telegraph: "CONGRESS SESSION AT SURAT BREAKS UP IN DISORDER — STOP",
      narration: "At the Congress session in Surat, Moderates and Extremists fight over the presidency. A shoe is thrown at the platform, chairs fly, and the session breaks up.",
      learnMore: "The Surat session of December 1907 ended in chaos, and the Moderates expelled the Extremists from Congress. The quarrel was over the presidency and the scope of the boycott, but the underlying split was over methods. Congress stayed divided until 1916.",
      shifts: [
        { tie: "moderates-radicals", amount: -14, reason: "Congress splits at Surat" }
      ],
      actions: [
        { label: "Reward the Moderates", description: "Let it be known that reforms will go to the loyal wing of Congress", effects: [{ tie: "moderates-british", amount: 10 }, { tie: "moderates-radicals", amount: -6 }, { tie: "moderates-students", amount: -4 }] },
        { label: "Strike the Extremists Now", description: "Use the split to arrest Extremist leaders while they are isolated", effects: [{ tie: "radicals-british", amount: 10 }, { tie: "radicals-students", amount: 6 }] },
        { label: "Say Nothing", description: "Let them keep fighting each other", effects: [{ tie: "moderates-radicals", amount: -3 }] }
      ]
    },
    {
      id: "muzaffarpur",
      date: "April 1908",
      title: "A Bomb at Muzaffarpur",
      telegraph: "BOMB AT MUZAFFARPUR — TWO ENGLISHWOMEN KILLED — STOP",
      narration: "Two young revolutionaries threw a bomb at a carriage they believed carried Magistrate Kingsford. It carried two Englishwomen instead. Both are dead.",
      learnMore: "On April 30, 1908, Khudiram Bose and Prafulla Chaki bombed a carriage in Muzaffarpur, killing Mrs. and Miss Kennedy. Chaki shot himself before capture; Bose, eighteen, was hanged in August and became a nationalist martyr. Police raids in Calcutta followed.",
      shifts: [
        { tie: "radicals-students", amount: 6, reason: "Khudiram Bose becomes a hero" },
        { tie: "moderates-radicals", amount: -6, reason: "Moderates condemn the bombing" }
      ],
      actions: [
        { label: "Raid the Secret Societies", description: "Search every suspected revolutionary house in Calcutta", effects: [{ tie: "radicals-british", amount: 14 }, { tie: "radicals-students", amount: 6 }] },
        { label: "Invite Condemnations", description: "Ask Moderate and Muslim leaders to denounce the bombing publicly", effects: [{ tie: "moderates-radicals", amount: -6 }, { tie: "radicals-muslims", amount: -6 }, { tie: "moderates-british", amount: 4 }] },
        { label: "Hang the Bomber Quickly", description: "Rush Khudiram Bose's trial and execution as a warning", effects: [{ tie: "radicals-british", amount: 10 }, { tie: "radicals-students", amount: 10 }, { tie: "students-british", amount: -6 }] }
      ]
    },
    {
      id: "alipore",
      date: "May 1908",
      title: "The Alipore Conspiracy",
      telegraph: "BOMB FACTORY FOUND AT MANIKTALA — AUROBINDO ARRESTED — STOP",
      narration: "Police have found a bomb workshop in a Calcutta garden house and arrested dozens, including Aurobindo Ghose. The trial will be the largest the province has seen.",
      learnMore: "The Maniktala raid of May 1908 led to the Alipore Conspiracy Case. Aurobindo Ghose was acquitted in 1909, defended by C. R. Das, but others were transported for life. The long trial gave the accused a public platform.",
      shifts: [
        { tie: "radicals-british", amount: 8, reason: "The secret societies are exposed" },
        { tie: "moderates-radicals", amount: 4, reason: "Moderates defend the accused's rights" }
      ],
      actions: [
        { label: "A Long Public Trial", description: "Try all the accused together, in full view", effects: [{ tie: "radicals-british", amount: 8 }, { tie: "radicals-students", amount: 6 }, { tie: "moderates-radicals", amount: 4 }] },
        { label: "Quiet Deals", description: "Offer lighter sentences to those who name others", effects: [{ tie: "radicals-students", amount: -8 }, { tie: "radicals-british", amount: 4 }] },
        { label: "Show the Bombs to the Merchants", description: "Brief merchants and zamindars on what the revolutionaries planned", effects: [{ tie: "radicals-merchants", amount: -10 }, { tie: "moderates-merchants", amount: -4 }, { tie: "merchants-british", amount: 4 }] }
      ]
    },
    {
      id: "tilak",
      date: "July 1908",
      title: "Tilak Sentenced",
      telegraph: "TILAK SENTENCED TO SIX YEARS — BOMBAY MILLS STRIKE — STOP",
      narration: "In Bombay, Tilak has been sentenced to six years for sedition over articles defending the Muzaffarpur bombers. Bombay's mill workers have walked out in protest.",
      learnMore: "Tilak was convicted in July 1908 and sent to Mandalay. Bombay's textile workers struck for six days, often called the first political mass strike in India. In Bengal, Extremists held protest meetings in his honor.",
      shifts: [
        { tie: "moderates-radicals", amount: 6, reason: "Even Moderates call the sentence harsh" },
        { tie: "radicals-merchants", amount: 4, reason: "Protest funds are raised" }
      ],
      actions: [
        { label: "Ban the Protest Meetings", description: "Forbid Tilak meetings across Bengal", effects: [{ tie: "radicals-british", amount: 8 }, { tie: "moderates-british", amount: -6 }, { tie: "moderates-radicals", amount: 4 }] },
        { label: "Reassure the Mill Owners", description: "Promise Calcutta's owners protection from strikes", effects: [{ tie: "merchants-british", amount: 10 }, { tie: "students-merchants", amount: -6 }] },
        { label: "Let It Burn Out", description: "Ignore the meetings and wait", effects: [{ tie: "moderates-british", amount: 4 }, { tie: "radicals-british", amount: -6 }] }
      ]
    },
    {
      id: "bengal_deportations",
      date: "December 1908",
      title: "Deportations",
      telegraph: "NINE BENGAL LEADERS DEPORTED WITHOUT TRIAL — STOP",
      narration: "Nine Bengali leaders, including the Barisal schoolmaster Aswini Kumar Dutt, are to be deported without trial. The Samitis that ran the boycott are to be banned.",
      learnMore: "In December 1908 the government deported nine Bengal leaders under the 1818 regulation and banned the major Samitis. By 1909 the boycott had faded. In 1911 the partition was annulled anyway, and the capital moved from Calcutta to Delhi.",
      shifts: [
        { tie: "moderates-radicals", amount: 6, reason: "Deportations unite the leaders' defenders" },
        { tie: "moderates-british", amount: -6, reason: "No trial, no charges" }
      ],
      actions: [
        { label: "Deport and Ban", description: "Carry out the deportations and ban the Samitis", effects: [{ tie: "radicals-british", amount: 12 }, { tie: "moderates-british", amount: -8 }] },
        { label: "Deport Only the Extremists", description: "Spare the Moderates' friends; remove the organizers", effects: [{ tie: "radicals-british", amount: 8 }, { tie: "moderates-radicals", amount: -6 }] },
        { label: "Hold Back", description: "Keep the deportation orders in reserve and let the reforms work", effects: [{ tie: "moderates-british", amount: 8 }, { tie: "radicals-british", amount: -6 }] }
      ]
    },
    {
      id: "morley_minto",
      date: "December 1908",
      title: "The Last Test: Reforms",
      telegraph: "MORLEY ANNOUNCES COUNCIL REFORMS — SEPARATE MUSLIM SEATS — STOP",
      narration: "London announces reforms: larger councils with more elected Indian members, and separate seats for Muslims chosen by Muslim voters.",
      learnMore: "The Morley-Minto reforms, announced in 1908 and enacted in 1909, enlarged the legislative councils and created separate Muslim electorates. The Moderates welcomed the councils; the separate electorates became a lasting grievance for Congress and a lasting safeguard for the Muslim League.",
      shifts: [
        { tie: "moderates-british", amount: 6, reason: "More seats for Indians" },
        { tie: "moderates-muslims", amount: -4, reason: "Separate seats divide the electorate" }
      ],
      actions: [
        { label: "Stress the Muslim Seats", description: "Tell Muslim leaders the reforms were written for them", effects: [{ tie: "muslims-british", amount: 10 }, { tie: "moderates-muslims", amount: -6 }, { tie: "moderates-british", amount: -4 }] },
        { label: "Stress the Council Seats", description: "Tell the Moderates constitutional methods have paid off", effects: [{ tie: "moderates-british", amount: 10 }, { tie: "moderates-radicals", amount: -6 }] },
        { label: "Pair Reform with Repression", description: "Announce the reforms alongside new powers against sedition", effects: [{ tie: "radicals-british", amount: 10 }, { tie: "moderates-british", amount: -4 }, { tie: "radicals-students", amount: 4 }] }
      ]
    }

  ];

  const REFLECTION_COMMON = [
    "Which of your tools did the most to keep Hindus and Muslims apart? Which one backfired most?",
    "In the in-class Swadeshi Crisis, the British faction wins if the movement never gets both breadth and pressure. How did this game make that goal look from the inside?",
    "The partition was annulled in 1911, but separate electorates lasted until 1947. Which of your choices would still matter at Simla in 1945?"
  ];

  const DEFEAT_NARRATIONS = {
    national_front: {
      title: "The Movement Unites",
      narration: "Hindu and Muslim leaders have signed a joint platform. Moderates and Extremists speak from the same stage. The boycott is spreading into East Bengal's markets, and the Nawab's men are wavering.\n\nYou have no troops to spare. London wants to know why a policy meant to divide Bengal has united it.",
      reflection: ["Which Hindu-Muslim bridge did you neglect? What would have weakened it?", ...REFLECTION_COMMON]
    },
    "moderates-british": {
      title: "The Moderates Walk Out",
      narration: "Banerjee and his allies resign their council seats and join the boycott. With the Moderates gone, there is no one left who believes in petitions, and the Liberal press in London turns on you.",
      reflection: ["The Moderates were the Raj's best argument that reform could work. What did you spend their trust on?", ...REFLECTION_COMMON]
    },
    "radicals-british": {
      title: "Nobody Is Afraid Anymore",
      narration: "The Extremists have concluded you are bluffing. Pickets fill every market, strikes spread to the mills, and the police cannot hold the streets. You cannot call troops you do not have.",
      reflection: ["Crackdowns raised Deterrence but fed the revolutionary pipeline. How did you balance fear and anger?", ...REFLECTION_COMMON]
    },
    "students-british": {
      title: "The Colleges Empty",
      narration: "Students have abandoned the government colleges for the national schools and the Samitis. A generation no longer needs your degrees or your jobs, and it is drilling in akharas across Bengal.",
      reflection: ["Why did losing the students matter so much to a government that ruled through educated clerks?", ...REFLECTION_COMMON]
    },
    "muslims-british": {
      title: "The Nawab Changes Sides",
      narration: "Convinced that the Raj will abandon East Bengal at the first sign of trouble, the Muslim leaders open talks with Congress. Without them, the partition has no defenders but you.",
      reflection: ["What did the Muslim leaders need from the Raj, and why did they stop believing they would get it?", ...REFLECTION_COMMON]
    },
    "merchants-british": {
      title: "Credit Runs Out",
      narration: "Merchants and zamindars have given up on British trade and British banks. Swadeshi mills are running, imports have collapsed, and the men who used to fund loyalty now fund the boycott.",
      reflection: ["Why did the propertied classes matter so much to both the Raj and the movement?", ...REFLECTION_COMMON]
    }
  };

  const VICTORY_NARRATION = {
    title: "The Partition Holds, December 1908",
    narration: "By the end of 1908 the boycott is fading. Congress is split, the Extremists' leaders are in prison or exile, and the Muslim League is loyal and growing. On paper, divide and rule has worked.\n\nIt will not last. In 1911 King George V annuls the partition and moves the capital from Calcutta to Delhi. But separate electorates, the Muslim League, and the habit of treating Hindus and Muslims as separate political communities outlive the partition by decades.",
    reflection: REFLECTION_COMMON
  };

  const GLOSSARY = [
    { term: "Herbert Risley", description: "Home Secretary to the Government of India (1902–1909) and census commissioner, whose 1904 memo described the partition as a way to split Bengal's opposition." },
    { term: "Risley", description: "Herbert Risley, Home Secretary to the Government of India, whose 1904 memo described the partition as a way to split Bengal's opposition." },
    { term: "Surendranath Banerjee", description: "Moderate Congress leader (1848–1925) and editor of The Bengalee, the leading voice of constitutional opposition to the partition." },
    { term: "Banerjee", description: "Surendranath Banerjee (1848–1925), moderate Congress leader and editor of The Bengalee." },
    { term: "Aurobindo Ghose", description: "Radical nationalist (1872–1950), editor of Bande Mataram and principal of the Bengal National College; acquitted in the Alipore case." },
    { term: "Tilak", description: "Bal Gangadhar Tilak (1856–1920), Maharashtra's Extremist leader: 'Swaraj is my birthright.' Sentenced to six years in 1908." },
    { term: "Nawab Salimullah", description: "Nawab of Dacca (1871–1915), leading Muslim supporter of the partition and host of the Muslim League's founding." },
    { term: "Lord Minto", description: "Viceroy of India 1905–1910, who received the 1906 Muslim deputation at Simla." },
    { term: "Aga Khan", description: "Sir Sultan Muhammad Shah, Aga Khan III, who led the 1906 Muslim deputation to the Viceroy and became the Muslim League's first president." },
    { term: "separate electorates", description: "A system in which Muslim voters elected Muslim representatives to reserved seats. Introduced by the Morley-Minto reforms of 1909." },
    { term: "partition", description: "The 1905 division of Bengal into a Hindu-majority west and a Muslim-majority East Bengal and Assam. Annulled in 1911." },
    { term: "swadeshi", description: "'Of one's own country': the movement to boycott British goods and buy Indian-made ones." },
    { term: "Bande Mataram", description: "'Hail to the Motherland': Bankim Chandra Chatterjee's hymn, the rallying cry of the anti-partition movement." },
    { term: "Muslim League", description: "The All-India Muslim League, founded at Dacca in December 1906 to represent Muslim political interests." },
    { term: "Samitis", description: "Nationalist volunteer associations that organized the boycott, physical training, and, in some cases, revolutionary cells." },
    { term: "rakhis", description: "Sacred threads tied on the wrist as a sign of protection and kinship, used in Tagore's 1905 unity observance." },
    { term: "lathis", description: "Long bamboo staffs carried by Indian police." },
    { term: "akharas", description: "Gymnasiums for wrestling and physical training, which some Samitis used to recruit and drill young men." }
  ].sort((a, b) => b.term.length - a.term.length);

  window.OPENING_VIGNETTE = OPENING_VIGNETTE;
  window.NODE_DEFINITIONS = NODE_DEFINITIONS;
  window.TIE_DEFINITIONS = TIE_DEFINITIONS;
  window.GAME_RULES = GAME_RULES;
  window.EVENT_CARDS = EVENT_CARDS;
  window.DEFEAT_NARRATIONS = DEFEAT_NARRATIONS;
  window.VICTORY_NARRATION = VICTORY_NARRATION;
  window.GLOSSARY = GLOSSARY;
})();
