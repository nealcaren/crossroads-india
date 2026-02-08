// ============================================================
//  THE LAST MAHARAJA — Script
//  Structure: 8 anchor events (always appear) + ~50 pool events
//  Each playthrough randomly draws 1-2 pool events per era,
//  producing a different game each time.
// ============================================================

// Game State
let state = {
    treasury: 50,
    britishFavor: 50,
    loyalty: 50,
    year: 1790,
    eventIndex: 0,
    decisionsLog: [],
    deck: [] // built at start from anchors + random pool draws
};

// Advisor definitions — each event is presented by a court figure
const ADVISORS = {
    vizier:   { icon: '\u{1F451}', name: 'The Dewan' },       // crown
    general:  { icon: '\u2694',    name: 'The Senapati' },     // crossed swords
    priest:   { icon: '\u{1F549}', name: 'The Raj Guru' },     // om
    merchant: { icon: '\u2696',    name: 'The Seth' },          // scales
    spy:      { icon: '\u{1F441}', name: 'The Gupta-char' },   // eye
    resident: { icon: '\u{1F3E0}', name: 'The British Resident' }
};

// Era labels
const ERAS = {
    1790: "The Military-Fiscal Trap",
    1806: "The Crisis of Legitimacy",
    1836: "The Era of Annexation",
    1853: "The Final Years"
};

function getEra(year) {
    if (year >= 1853) return ERAS[1853];
    if (year >= 1836) return ERAS[1836];
    if (year >= 1806) return ERAS[1806];
    return ERAS[1790];
}

// ============================================================
//  ANCHOR EVENTS — always appear in every playthrough
// ============================================================
const anchorEvents = [
    {
        year: 1798,
        advisor: 'resident',
        title: "The Subsidiary Alliance",
        desc: "Lord Wellesley offers you a treaty. British troops will garrison your borders for 'protection.' In exchange, you must dismiss your French-trained officers, surrender foreign policy, and pay handsomely for the soldiers' upkeep.",
        note: "The Subsidiary Alliance was perfected by Wellesley to neutralize the French threat. The Nizam of Hyderabad accepted in 1798, ceding fertile districts to pay for troops he didn't control. The cost was deliberately set high to create a debt spiral.",
        left: {
            text: "Accept the Treaty",
            effect: { treasury: -15, britishFavor: 25, loyalty: -10 },
            msg: "British redcoats march through your capital. You are safe from the Marathas, but your treasury bleeds to maintain soldiers loyal only to Calcutta. Your generals seethe as foreign officers take command of your defenses."
        },
        right: {
            text: "Refuse & Arm Yourself",
            effect: { treasury: -20, britishFavor: -25, loyalty: 15 },
            msg: "You refuse. 'We are sovereign, not servants,' you declare. The cost of modernizing your army is staggering, and the British are deeply offended. But your people hail you as a true king."
        }
    },
    {
        year: 1805,
        title: "The Maratha War Loans",
        desc: "War rages between the Company and the Maratha Confederacy. The British demand a massive loan from your treasury to fund their campaign. They hint that generosity now will be remembered later.",
        note: "Rulers like the Nawab of Oudh were pressured to lend vast sums. These loans transferred aristocratic wealth to the Company's balance sheet. Repayment came not in cash but in political concessions—or not at all.",
        left: {
            text: "Grant the Loan",
            effect: { treasury: -25, britishFavor: 20, loyalty: -5 },
            msg: "Chests of gold leave your palace for the Company's war chest. The British are grateful—for now. Your people see their king's wealth flowing east to Calcutta while roads crumble and canals silt up."
        },
        right: {
            text: "Stay Neutral",
            effect: { treasury: 0, britishFavor: -15, loyalty: 5 },
            msg: "You claim your treasury cannot spare the funds. The Company's accountants know better. They label you 'unreliable'—a dangerous word in British correspondence. Your people, at least, appreciate the peace."
        }
    },
    {
        year: 1813,
        title: "The Missionaries Arrive",
        desc: "The Charter Act of 1813 has opened India to Christian missionaries. A group arrives at your capital requesting permission to build a school and chapel. They promise education and charity. Your priests warn of conversion.",
        note: "Despite the Vellore warning, evangelical pressure in London forced the Charter Act to allow missionaries. For Indian rulers, permitting them signaled weakness in protecting dharma. Banning them made British newspapers label you a 'bigot.'",
        left: {
            text: "Allow the Mission",
            effect: { treasury: 5, britishFavor: 15, loyalty: -20 },
            msg: "The missionaries build their school. English-speaking clerks prove useful for administration. But the temple priests organize protests, and your subjects murmur that their king has sold the faith for foreign favor."
        },
        right: {
            text: "Deny Entry",
            effect: { treasury: 0, britishFavor: -15, loyalty: 15 },
            msg: "You declare your kingdom a place of ancestral tradition. The Resident is displeased. The London Missionary Society publishes accounts of your 'intolerance.' But your people garland you as Dharma-rakshak—Protector of Faith."
        }
    },
    {
        year: 1835,
        title: "Macaulay's Minute",
        desc: "Thomas Macaulay has declared that 'a single shelf of a good European library is worth the whole native literature of India.' The British offer funding for an English-language college in your capital, promising modern education.",
        note: "Macaulay's education policy aimed to create 'a class of persons Indian in blood and colour, but English in tastes, in opinions, in morals and in intellect.' This new class would staff the colonial bureaucracy, displacing traditional scholars.",
        left: {
            text: "Accept English Education",
            effect: { treasury: 10, britishFavor: 15, loyalty: -15 },
            msg: "The college opens. A generation of English-speaking clerks fills your administration. They are efficient but look to Calcutta, not to your throne, for advancement. Traditional pandits and maulvis lose their students and their livelihood."
        },
        right: {
            text: "Fund Traditional Learning",
            effect: { treasury: -10, britishFavor: -10, loyalty: 10 },
            msg: "You endow Sanskrit pathshalas and Persian madrasas. Your scholars compose verses in your honor. But British officials note your 'resistance to progress,' and your clerks struggle to communicate with the Company's paperwork."
        }
    },
    {
        year: 1848,
        title: "The Doctrine of Lapse",
        desc: "Lord Dalhousie declares that if a dependent ruler dies without a natural male heir, the state 'lapses' to British sovereignty. Satara—seat of Shivaji's descendants—has just been annexed. You have no son.",
        note: "The Doctrine of Lapse negated the ancient Hindu custom of adoption for political succession. Satara (1848), Nagpur (1853), and Jhansi (1853) were all annexed this way. When Nagpur's royal jewels were auctioned in Calcutta's bazaar, the humiliation resonated across every princely court.",
        left: {
            text: "Adopt an Heir",
            effect: { treasury: -5, britishFavor: -25, loyalty: 15 },
            msg: "You perform the adoption ceremony with full Vedic rites. Dalhousie immediately declares it 'illegal without Company sanction.' Your nobles rally around the boy, but the legal noose tightens. The clock is ticking."
        },
        right: {
            text: "Petition for Recognition",
            effect: { treasury: -10, britishFavor: -10, loyalty: -10 },
            msg: "You send envoys to Calcutta and London pleading for recognition. Dalhousie ignores your petitions. The years of negotiation drain your treasury and your dignity. Your people see a king reduced to a supplicant."
        }
    },
    {
        year: 1853,
        title: "The Iron Horse",
        desc: "The British want to build a railway through your kingdom. It requires seizing peasant farmland, raising taxes, and granting unrestricted British access. They promise 'progress and prosperity.' Your peasants promise resistance.",
        note: "Railways were laid out to maximize military mobility. Land acquisition displaced thousands of peasants. The mixing of castes in railway carriages was seen by the orthodox as an attack on the social order, fueling anxieties before 1857.",
        left: {
            text: "Build the Railway",
            effect: { treasury: 10, britishFavor: 20, loyalty: -20 },
            msg: "Steel tracks slice through your fields. British troops can now reach your capital in hours, not weeks. Some merchants prosper, but displaced farmers join the swelling ranks of the landless."
        },
        right: {
            text: "Block the Project",
            effect: { treasury: 0, britishFavor: -20, loyalty: 10 },
            msg: "You refuse to condemn your peasants' land. Dalhousie is furious—you are 'obstructing the march of civilization.' British newspapers mock your 'medieval obstinacy.' But your villages remain intact."
        }
    },
    {
        year: 1856,
        title: "The Oudh Warning",
        desc: "Oudh—the Company's most loyal ally—has been annexed. Nawab Wajid Ali Shah, who lent millions and never rebelled, is exiled to Calcutta, weeping as he leaves Lucknow. If loyalty cannot save a kingdom, what can?",
        note: "The annexation of Oudh shattered every assumption about British good faith. Oudh had been the most compliant state, lending enormous sums. Its annexation proved that compliance was no defense.",
        left: {
            text: "Submit to Reforms",
            effect: { treasury: -5, britishFavor: 10, loyalty: -15 },
            msg: "You restructure your court along British lines. The Resident is satisfied. But your nobles are stripped of traditional roles, and your people see an alien administration wearing Indian clothes."
        },
        right: {
            text: "Prepare for the Worst",
            effect: { treasury: -10, britishFavor: -5, loyalty: 10 },
            msg: "You quietly stockpile grain, maintain your army, and send your family's jewels to a trusted ally. If Oudh's fate awaits you, you will not go quietly."
        }
    },
    {
        year: 1857,
        title: "The Great Rebellion",
        desc: "The cartridge has been bitten. Sepoys in Meerut have mutinied and marched to Delhi. The rebellion spreads like wildfire. Princes, peasants, and soldiers rise together. A rider arrives at your gate: Whose side are you on?",
        note: "The rebellion of 1857 was the culmination of decades of grievance. Princes who joined fought with nothing left to lose. Those who stayed loyal became 'breakwaters to the storm,' saving the British Raj.",
        left: {
            text: "Side with the British",
            effect: { treasury: 0, britishFavor: 30, loyalty: -40 },
            msg: "You close your gates to the rebels and offer your troops to the Company. The British will remember your loyalty. Your dynasty will survive under the Crown. But your people will never forgive the king who chose the conqueror."
        },
        right: {
            text: "Join the Rebellion",
            effect: { treasury: -30, britishFavor: -100, loyalty: 40 },
            msg: "You ride out under your ancestral banner, joining the tide of rebellion. Your people roar with joy—at last, a king who fights. The outcome is uncertain, but win or lose, they will sing of this day."
        }
    }
];

// ============================================================
//  POOL EVENTS — randomly drawn, organized by era
//  Each era pool has 5-8 events; 1-2 are drawn per playthrough.
// ============================================================

const poolEvents = {
    // ERA 1: Before the Subsidiary Alliance (1790-1797)
    era1: [
        {
            year: 1791,
            title: "The Tiger's Envoy",
            desc: "Tipu Sultan of Mysore has been defeated but not destroyed. He sends a secret envoy to your court, proposing an alliance against the Company. The British Resident watches closely.",
            note: "Tipu maintained anti-British alliances, seeking support from revolutionary France and the Ottoman Empire. Any prince who received his envoys risked British retaliation.",
            left: {
                text: "Receive the Envoy",
                effect: { treasury: 0, britishFavor: -12, loyalty: 8 },
                msg: "You receive Tipu's envoy in secret, but the Resident has spies. Word reaches Calcutta. Your people admire your defiance, but the Company marks your name in its ledger."
            },
            right: {
                text: "Turn Him Away",
                effect: { treasury: 5, britishFavor: 10, loyalty: -5 },
                msg: "You refuse Tipu's envoy and inform the Resident. A small trade concession follows. Your courtiers whisper that you have chosen the jackal over the tiger."
            }
        },
        {
            year: 1792,
            title: "The French Officers",
            desc: "A group of French military officers, veterans of European wars, offers to train your army in modern tactics. Accepting them would anger the British but greatly improve your defenses.",
            note: "Many Indian rulers employed French mercenaries—de Boigne served Scindia, Raymond served the Nizam. The British demanded their dismissal as a condition of every alliance, seeing them as agents of revolutionary France.",
            left: {
                text: "Hire the French",
                effect: { treasury: -10, britishFavor: -15, loyalty: 5 },
                msg: "Your infantry drills with bayonets and learns volley fire. The French officers are expensive, but your army transforms. The British Resident sends urgent dispatches to Calcutta about your 'Jacobin sympathies.'"
            },
            right: {
                text: "Decline Politely",
                effect: { treasury: 0, britishFavor: 8, loyalty: -3 },
                msg: "You send the officers away with gifts and apologies. The Resident is relieved. Your generals grumble that they must fight modern wars with medieval methods."
            }
        },
        {
            year: 1793,
            title: "The Monsoon Fails",
            desc: "The rains have not come. Crops wither in the fields, and your peasants look to the palace for relief. Opening the royal granaries will cost the treasury dearly. The British offer emergency grain—at a price.",
            note: "Famine relief was a core duty of the Indian ruler—the 'Ma-Baap Sarkar' (mother-father government). Failure to provide it destroyed the reciprocal bonds of loyalty that held the state together.",
            left: {
                text: "Open the Granaries",
                effect: { treasury: -15, britishFavor: 0, loyalty: 12 },
                msg: "Grain flows from the royal stores to every village. Your treasury thins, but no one starves. Elders tell their children that their king is a true father of his people."
            },
            right: {
                text: "Buy British Grain",
                effect: { treasury: -10, britishFavor: 8, loyalty: -8 },
                msg: "Company ships deliver grain at inflated prices. Your people survive, but they see British merchants profiting from their misery while the king's own granaries stay sealed. The debt is noted in Calcutta."
            }
        },
        {
            year: 1794,
            title: "The Succession Dispute",
            desc: "Your elder cousin claims your throne is illegitimate, citing a disputed inheritance. He has gathered supporters among disaffected nobles. The British Resident offers to 'mediate'—but his involvement would set a precedent.",
            note: "Succession disputes were a primary tool of British intervention. By offering to arbitrate between claimants, the Company positioned itself as the ultimate authority over who sat on Indian thrones.",
            left: {
                text: "Accept British Mediation",
                effect: { treasury: 0, britishFavor: 12, loyalty: -8 },
                msg: "The Resident rules in your favor—for a price. Your cousin is exiled with a pension paid from your treasury. The precedent is set: the Company now has a say in your dynasty's future."
            },
            right: {
                text: "Settle It Yourself",
                effect: { treasury: -8, britishFavor: -5, loyalty: 5 },
                msg: "You gather your loyal nobles and confront your cousin. After tense negotiations, he accepts lands and titles in exchange for renouncing his claim. It costs you, but your house remains your own affair."
            }
        },
        {
            year: 1795,
            title: "The Maratha Tribute",
            desc: "A Maratha warlord demands annual tribute, threatening to ravage your northern districts if you refuse. Paying means safety but signals weakness. The British offer to intervene—for a fee.",
            note: "The Maratha Confederacy extracted chauth (one-quarter of revenue) from smaller states. This protection racket mirrored the British subsidiary system—both offered security in exchange for sovereignty.",
            left: {
                text: "Pay the Tribute",
                effect: { treasury: -12, britishFavor: -5, loyalty: -3 },
                msg: "Gold and horses are sent north. Your borders are safe for another year, but paying two masters—Marathas and British—is slowly bleeding your state dry."
            },
            right: {
                text: "Ask British Help",
                effect: { treasury: -5, britishFavor: 10, loyalty: -8 },
                msg: "British cavalry rides out to face the Marathas, who withdraw. The Resident reminds you that this 'favor' will be remembered. Your people watch foreign soldiers defend their land and wonder who truly rules."
            }
        },
        {
            year: 1796,
            title: "The Trading Post",
            desc: "The East India Company requests permission to establish a permanent trading post and warehouse ('factory') in your capital. They promise increased commerce and tax revenue. Your merchants are wary of competition.",
            note: "Every British trading post was a foothold. The 'factory' came with armed guards, a flag, and extraterritorial legal claims. What began as commerce invariably became control.",
            left: {
                text: "Allow the Factory",
                effect: { treasury: 8, britishFavor: 10, loyalty: -5 },
                msg: "British goods flow through your bazaars—cheaper and abundant. Tax revenue rises, but your weavers and artisans cannot compete with Manchester cloth. A Union Jack now flies in your capital."
            },
            right: {
                text: "Restrict Trade",
                effect: { treasury: -3, britishFavor: -8, loyalty: 5 },
                msg: "You limit the Company to a seasonal market outside the city walls. The Resident is displeased, but your guilds of weavers and metalworkers breathe easier. Local craft survives—for now."
            }
        },
        {
            year: 1794,
            title: "The Temple Endowment",
            desc: "The great temple of your capital is crumbling. Restoring it would demonstrate your devotion and please the priesthood. But the funds could also modernize your cannon foundry.",
            note: "Religious patronage was inseparable from political legitimacy. A ruler who neglected temples risked being seen as impious—but one who neglected defense risked destruction.",
            left: {
                text: "Restore the Temple",
                effect: { treasury: -10, britishFavor: 0, loyalty: 10 },
                msg: "The temple rises in renewed splendor. Pilgrims flock from neighboring states. The priesthood sings your praises, and your legitimacy as a dharmic ruler is renewed. Your cannons, however, remain old."
            },
            right: {
                text: "Modernize the Foundry",
                effect: { treasury: -10, britishFavor: -3, loyalty: -5 },
                msg: "New cannons are cast with improved bore. Your army gains firepower, but the neglected temple sends a message: this king serves Mars, not the gods. Priests murmur their discontent."
            }
        }
    ],

    // ERA 2: Between Subsidiary Alliance and Maratha War (1799-1804)
    era2: [
        {
            year: 1799,
            title: "The Fall of Seringapatam",
            desc: "Tipu Sultan is dead, killed defending his capital. His kingdom is partitioned. The British auction his treasury—his mechanical tiger, his jeweled throne. A message arrives: will you attend the victory celebrations hosted by the Governor-General?",
            note: "The fall of Seringapatam in 1799 was a spectacle of imperial triumph. Tipu's body was found among his fallen soldiers. His sons were pensioned off. The message to every remaining prince was clear: resistance means annihilation.",
            left: {
                text: "Attend the Celebration",
                effect: { treasury: -5, britishFavor: 10, loyalty: -8 },
                msg: "You attend in your finest regalia, toasting the Company's victory over a fellow sovereign. The British are charmed. Your own courtiers look away in shame—today you celebrate a king's death."
            },
            right: {
                text: "Send Regrets",
                effect: { treasury: 0, britishFavor: -8, loyalty: 5 },
                msg: "You plead illness. The Resident notes your absence with suspicion. But in the privacy of your court, you observe a day of mourning for a brother-king who chose to die free."
            }
        },
        {
            year: 1800,
            title: "The British Resident's Demands",
            desc: "Your British Resident—the Company's permanent ambassador—demands a larger residence, a military escort, and the right to attend your private council. He is becoming a shadow king.",
            note: "British Residents were initially diplomatic envoys but evolved into de facto rulers. In Hyderabad, the Resident controlled appointments, finances, and succession. The Resident's 'advice' was indistinguishable from command.",
            left: {
                text: "Grant His Requests",
                effect: { treasury: -5, britishFavor: 12, loyalty: -10 },
                msg: "The Resident's new palace rivals your own. He sits in on your councils, and soon your ministers address him before addressing you. You have gained a protector—and lost your privacy."
            },
            right: {
                text: "Set Boundaries",
                effect: { treasury: 0, britishFavor: -10, loyalty: 8 },
                msg: "You politely confine the Resident to diplomatic matters. He writes to Calcutta about your 'obstruction.' Your nobles are relieved—the throne room belongs to the king, not the Company."
            }
        },
        {
            year: 1801,
            title: "The Carnatic Precedent",
            desc: "The British have annexed the Carnatic, deposing the Nawab for 'misgovernance.' A British official arrives to inspect your court's finances. The message is clear: any ruler deemed incompetent can be removed.",
            note: "The annexation of the Carnatic in 1801 established that the Company could depose rulers for administrative failures—a tool of control that would be wielded repeatedly.",
            left: {
                text: "Open Your Books",
                effect: { treasury: -5, britishFavor: 12, loyalty: -5 },
                msg: "The inspector praises your 'transparency.' But your nobles are humiliated—a king who answers to clerks is no king at all. The inspector's report recommends several 'improvements.'"
            },
            right: {
                text: "Refuse the Inspection",
                effect: { treasury: 0, britishFavor: -12, loyalty: 8 },
                msg: "You cite sovereign prerogative. The Resident writes to Calcutta that your state is 'opaque and possibly corrupt.' Your court rallies behind you, but a shadow falls over your kingdom."
            }
        },
        {
            year: 1802,
            title: "The Treaty of Bassein",
            desc: "The Peshwa of the Marathas has signed a Subsidiary Alliance with the British after being defeated by Holkar. Other Maratha chiefs call it treachery. They ask you to join a confederacy against both the Peshwa and the Company.",
            note: "The Treaty of Bassein (1802) effectively made the Peshwa a British puppet, splitting the Maratha Confederacy and setting the stage for the Second Anglo-Maratha War.",
            left: {
                text: "Join the Confederacy",
                effect: { treasury: -8, britishFavor: -15, loyalty: 10 },
                msg: "You pledge support to Scindia and Bhonsle. The alliance is grand on paper but fractious in practice. The British now consider you an enemy. Your people see courage—the Company sees a target."
            },
            right: {
                text: "Remain Independent",
                effect: { treasury: 0, britishFavor: 5, loyalty: -5 },
                msg: "You stay out of Maratha quarrels. When war comes, you watch from the sidelines as the confederacy is shattered. You are safe—but you have no allies left."
            }
        },
        {
            year: 1803,
            title: "The Currency Question",
            desc: "The Company pressures you to adopt their standardized rupee, replacing your kingdom's traditional coinage bearing your own image. They argue it will simplify trade. Your mint-master warns it will erase your sovereignty.",
            note: "The right to mint coins was one of the fundamental markers of sovereignty in Indian political tradition. Giving up your own coinage was a symbolic surrender of independence.",
            left: {
                text: "Adopt Company Coinage",
                effect: { treasury: 5, britishFavor: 10, loyalty: -8 },
                msg: "Trade flows more smoothly with standardized currency. But your face no longer appears on the coins that circulate in your own bazaars. Your subjects handle British rupees and wonder whose kingdom this really is."
            },
            right: {
                text: "Keep Your Own Mint",
                effect: { treasury: -5, britishFavor: -8, loyalty: 5 },
                msg: "Your coins continue to bear the royal seal. Trade with British territories becomes more cumbersome, but every transaction in your market carries the stamp of your sovereignty."
            }
        },
        {
            year: 1800,
            title: "The Irrigation Canal",
            desc: "Your engineers propose a major canal project to irrigate the western districts, which would increase food production and revenue. But it will take years and drain your treasury during construction.",
            note: "Infrastructure investment was a gamble for princely states—it increased long-term revenue but left the treasury vulnerable during construction, exactly when the British might demand loans or payments.",
            left: {
                text: "Build the Canal",
                effect: { treasury: -12, britishFavor: 0, loyalty: 8 },
                msg: "Thousands of laborers dig through the dry earth. The project will take years, but when water finally flows, villages flourish. Your western districts become the breadbasket of the region."
            },
            right: {
                text: "Save the Funds",
                effect: { treasury: 5, britishFavor: 0, loyalty: -3 },
                msg: "You keep the treasury full for emergencies. Wise, perhaps, but the western farmers continue to depend on unreliable monsoons. When drought comes, they will remember the canal that was never built."
            }
        }
    ],

    // ERA 3: Between Maratha War and Missionaries (1806-1812)
    era3: [
        {
            year: 1806,
            title: "The Shadow of Vellore",
            desc: "At Vellore Fort, sepoys have mutinied after being forced to shave beards and wear leather cockades. They raised Tipu's flag. The British suppressed it by blowing men from cannons. Now your own soldiers are anxious about rumors of forced conversion.",
            note: "The Vellore Mutiny of 1806 was triggered by uniform regulations that offended Hindu and Muslim sepoys. Mutineers hoisted the flag of Mysore. The British response—execution by cannon—sent a message of terror.",
            left: {
                text: "Reassure Your Troops",
                effect: { treasury: -8, britishFavor: -3, loyalty: 10 },
                msg: "You visit the barracks, promising no soldier will be forced to violate their faith. Higher pay strains your purse, but your army's loyalty strengthens."
            },
            right: {
                text: "Enforce Discipline",
                effect: { treasury: 0, britishFavor: 8, loyalty: -12 },
                msg: "Following the British model, you crack down on dissent. The Resident approves of your 'firmness.' But whispers of Vellore echo in the barracks."
            }
        },
        {
            year: 1807,
            title: "The Spy in Court",
            desc: "Your spymaster reveals that the British Resident has been paying your prime minister for secret reports on your private councils, troop movements, and treasury reserves. Confronting him risks a diplomatic incident.",
            note: "British intelligence networks penetrated every princely court. Residents maintained elaborate spy rings, paying courtiers and servants for information. Exposing these networks was dangerous—it acknowledged their effectiveness.",
            left: {
                text: "Confront the Resident",
                effect: { treasury: 0, britishFavor: -12, loyalty: 8 },
                msg: "You present the evidence publicly. The Resident denies everything and writes furious dispatches to Calcutta. Your court is purged of informants—for now. But the Company does not forgive humiliation."
            },
            right: {
                text: "Feed Him False Information",
                effect: { treasury: -3, britishFavor: 3, loyalty: 3 },
                msg: "You keep the traitor in place but feed him carefully crafted lies. The Resident's reports to Calcutta paint a picture of a compliant, unthreatening state. A dangerous game, but a clever one."
            }
        },
        {
            year: 1809,
            title: "The Road to Calcutta",
            desc: "The Company requests permission to build a military road through your territory, connecting two British garrisons. They offer to pay for construction. Your advisors warn it will allow troops to march through your kingdom at will.",
            note: "Military roads were precursors to railways—strategic infrastructure that prioritized troop movement over local benefit. Allowing construction effectively surrendered control over who moved through your territory.",
            left: {
                text: "Allow the Road",
                effect: { treasury: 8, britishFavor: 10, loyalty: -8 },
                msg: "Construction brings wages and commerce. But now British columns can cross your kingdom in days, not weeks. Your territory has become a corridor—open, traversable, and indefensible."
            },
            right: {
                text: "Propose an Alternative Route",
                effect: { treasury: -3, britishFavor: -5, loyalty: 5 },
                msg: "You suggest a route skirting your borders. The British accept grudgingly—it adds cost and distance. Your territory remains intact, but the Company remembers your 'obstructionism.'"
            }
        },
        {
            year: 1810,
            title: "The Deposed Prince",
            desc: "A neighboring prince, deposed by the Company for 'misgovernance,' arrives at your court seeking asylum. Sheltering him would anger the British. Turning him away would betray princely solidarity.",
            note: "Deposed rulers became wandering symbols of British injustice. Hosting them was an act of defiance; rejecting them was an act of submission. Either way, their presence reminded every prince of their own fragility.",
            left: {
                text: "Grant Asylum",
                effect: { treasury: -5, britishFavor: -10, loyalty: 8 },
                msg: "You welcome the prince with full honors. His stories of dispossession spread through your court like wildfire. The Resident demands you hand him over. You refuse—for now."
            },
            right: {
                text: "Turn Him Away",
                effect: { treasury: 0, britishFavor: 5, loyalty: -8 },
                msg: "You send the prince away with gold and apologies. He rides into exile. Your courtiers are silent—today their king chose safety over honor."
            }
        },
        {
            year: 1811,
            title: "The Salt Monopoly",
            desc: "The Company proposes taking over salt production in your territory. They will pay a fixed annual sum—but salt is essential to every household, and controlling it gives leverage over your entire population.",
            note: "Salt monopolies were enormously profitable for the British. The salt tax would later become a symbol of colonial exploitation, famously challenged by Gandhi's Salt March in 1930.",
            left: {
                text: "Surrender the Monopoly",
                effect: { treasury: 10, britishFavor: 10, loyalty: -10 },
                msg: "The guaranteed income is welcome. But salt prices rise sharply as the Company maximizes profit. Your peasants, who once gathered salt freely from local deposits, now pay through the nose for a necessity of life."
            },
            right: {
                text: "Keep Control",
                effect: { treasury: -3, britishFavor: -8, loyalty: 8 },
                msg: "You maintain your own salt works, keeping prices low. The Company loses a revenue stream and notes your 'uncooperative' spirit. But every meal your subjects eat reminds them: your king provides."
            }
        },
        {
            year: 1808,
            title: "The Persian Ambassador",
            desc: "Napoleon's emissary to Persia passes through your territory, seeking allies against British interests. He offers advanced weapons and French military advisors. Meeting him would be an act of diplomatic defiance.",
            note: "Napoleon's alliance with Persia (Treaty of Finkenstein, 1807) alarmed the British, who feared a Franco-Persian invasion of India. Indian princes caught communicating with French agents faced severe consequences.",
            left: {
                text: "Meet in Secret",
                effect: { treasury: 0, britishFavor: -10, loyalty: 5 },
                msg: "The meeting yields little of substance—Napoleon's attention is elsewhere—but the British learn of it through their spies. You are now marked as a potential enemy, a dangerous association."
            },
            right: {
                text: "Report to the Resident",
                effect: { treasury: 3, britishFavor: 10, loyalty: -5 },
                msg: "You dutifully inform the Resident of the Frenchman's presence. He is grateful and impressed by your loyalty. Your courtiers, however, see a king who informs on visitors like a common spy."
            }
        }
    ],

    // ERA 4: Between Missionaries and Macaulay (1814-1834)
    era4: [
        {
            year: 1818,
            title: "The Pindari Menace",
            desc: "The Third Anglo-Maratha War has shattered the Confederacy. Thousands of demobilized soldiers roam as Pindari raiders. The British demand permission to march through your territory to 'suppress the bandits.'",
            note: "The Pindari campaigns of 1817-1818 gave the British a pretext to move armies through sovereign territories. Once troops crossed your borders, they rarely left. The operations completed British paramountcy over central India.",
            left: {
                text: "Allow British Passage",
                effect: { treasury: 0, britishFavor: 12, loyalty: -8 },
                msg: "British columns march through your lands. The Pindaris scatter, but a new cantonment appears near your capital. Your borders are quieter—but are they still yours?"
            },
            right: {
                text: "Hunt Them Yourself",
                effect: { treasury: -12, britishFavor: -8, loyalty: 8 },
                msg: "You mobilize your own cavalry. It is costly and slow, but your soldiers gain experience. The British question your 'competence.'"
            }
        },
        {
            year: 1820,
            title: "The Indigo Planters",
            desc: "British planters want to establish indigo cultivation on rented land in your territory. They promise high rents to landlords, but indigo exhausts the soil and the planters' treatment of laborers is notoriously harsh.",
            note: "Indigo plantations were sites of extreme exploitation. Planters used coercion, debt bondage, and violence to force cultivation. The Indigo Revolt of 1859 in Bengal demonstrated the depth of peasant resentment.",
            left: {
                text: "Welcome the Planters",
                effect: { treasury: 10, britishFavor: 8, loyalty: -12 },
                msg: "Rent payments boost your revenue. But the planters bring their own laws—peasants who resist are beaten, and your magistrates are told not to interfere. The soil turns pale blue with exhaustion."
            },
            right: {
                text: "Forbid Indigo Planting",
                effect: { treasury: -3, britishFavor: -10, loyalty: 8 },
                msg: "You ban the crop, citing soil damage. The Company accuses you of blocking free enterprise. But your farmers keep their land and their dignity."
            }
        },
        {
            year: 1825,
            title: "Opium for China",
            desc: "The Company wants opium cultivated on your most fertile farmland. The poppy crop will be sold to China. The profits are enormous, but it will displace food crops in your most populated districts.",
            note: "The Malwa opium trade integrated princely states into global capitalism. Short-term profits were immense, but the shift from food to cash crops made the peasant economy vulnerable to famine.",
            left: {
                text: "Plant the Poppies",
                effect: { treasury: 20, britishFavor: 10, loyalty: -18 },
                msg: "Gold flows in as opium caravans head east. But grain stores thin. When the monsoon fails next year, there is no surplus. Villagers starve while your coffers overflow."
            },
            right: {
                text: "Protect Food Crops",
                effect: { treasury: -5, britishFavor: -12, loyalty: 15 },
                msg: "You refuse to let fertile land grow poison. The Company loses projected profits. But your granaries hold, and village elders praise the wisdom of their king."
            }
        },
        {
            year: 1822,
            title: "The Cholera Epidemic",
            desc: "Cholera has swept through your territory, killing thousands. The British offer doctors and medicine but demand that your traditional healers step aside. Your people trust their own physicians.",
            note: "Cholera pandemics ravaged India throughout the 19th century. British medical interventions were often effective but were resisted as cultural imperialism—particularly when they interfered with religious practices around death and burial.",
            left: {
                text: "Accept British Doctors",
                effect: { treasury: 0, britishFavor: 8, loyalty: -8 },
                msg: "British surgeons establish quarantine camps. The death toll slows, but rumors spread that the foreign doctors are poisoning wells to justify their presence. Traditional healers lose status and income."
            },
            right: {
                text: "Rely on Your Own",
                effect: { treasury: -8, britishFavor: -5, loyalty: 5 },
                msg: "Your hakims and vaids work tirelessly. Some treatments help; others don't. The death toll is higher, but your medical traditions survive intact. The British note your 'stubbornness.'"
            }
        },
        {
            year: 1829,
            title: "The Abolition of Sati",
            desc: "Governor-General Bentinck has banned Sati—the immolation of widows—in British territories. He pressures you to do the same. Indian reformers support the ban; the orthodox Dharma Sabha calls it an assault on tradition.",
            note: "The 1829 Sati regulation was supported by reformers like Ram Mohan Roy but fiercely opposed by conservative groups. In Rajputana, many princes resisted the ban well into the 1860s, viewing it as a test of internal sovereignty.",
            left: {
                text: "Ban the Practice",
                effect: { treasury: 0, britishFavor: 12, loyalty: -12 },
                msg: "You issue the decree. The Resident applauds your 'enlightenment.' But the Dharma Sabha is outraged. Protests erupt at temples. The conservative clergy question your divine mandate."
            },
            right: {
                text: "Resist the Pressure",
                effect: { treasury: 0, britishFavor: -12, loyalty: 8 },
                msg: "You invoke sovereign authority over domestic customs. The British press brands you 'barbaric'—a label they will use to justify future intervention. But the orthodox establishment rallies behind you."
            }
        },
        {
            year: 1826,
            title: "The Marriage Alliance",
            desc: "A powerful neighboring prince proposes a marriage alliance between your families. It would strengthen regional solidarity against the Company, but the British Resident warns against 'entangling alliances.'",
            note: "The British systematically discouraged alliances between princely states, viewing them as potential anti-British coalitions. By isolating princes from each other, the Company ensured each faced British power alone.",
            left: {
                text: "Accept the Alliance",
                effect: { treasury: -8, britishFavor: -8, loyalty: 5 },
                msg: "The wedding is magnificent—a week of feasting and display. Two princely houses are now bound by blood. The Resident sends alarmed reports to Calcutta about a 'native confederacy.'"
            },
            right: {
                text: "Decline the Match",
                effect: { treasury: 0, britishFavor: 5, loyalty: -5 },
                msg: "You politely refuse, citing astrological incompatibility. The Resident is relieved. But another bridge between Indian rulers goes unbuilt, and isolation deepens."
            }
        },
        {
            year: 1830,
            title: "The Printing Press",
            desc: "A reformist intellectual offers to establish a printing press in your capital. He wants to publish newspapers, pamphlets, and translations of classical texts. The British Resident worries about 'seditious literature.'",
            note: "The printing press was a revolutionary technology in early 19th-century India. Reformers used it to spread ideas about social reform and political rights. The British oscillated between promoting literacy and fearing the press as a vehicle for dissent.",
            left: {
                text: "Allow the Press",
                effect: { treasury: -3, britishFavor: -5, loyalty: 8 },
                msg: "Newspapers appear in your bazaars. Poetry, philosophy, and eventually political commentary spread among the literate classes. Your subjects begin to think of themselves as a public, not just subjects."
            },
            right: {
                text: "Ban It",
                effect: { treasury: 0, britishFavor: 5, loyalty: -5 },
                msg: "You suppress the press, fearing disruption. The Resident approves—a quiet kingdom is a manageable kingdom. But ideas travel even without paper, and your reformers go underground."
            }
        },
        {
            year: 1828,
            title: "The British Surveyor",
            desc: "A team of British surveyors requests permission to map your territory in detail—every road, river, fort, and village. They claim it is for the 'Great Trigonometrical Survey of India.' Your generals see it as military intelligence.",
            note: "The Great Trigonometrical Survey was one of the largest scientific enterprises of the 19th century, but it also provided the British with detailed military intelligence about terrain, resources, and fortifications across the subcontinent.",
            left: {
                text: "Allow the Survey",
                effect: { treasury: 3, britishFavor: 8, loyalty: -5 },
                msg: "The surveyors arrive with theodolites and chains, measuring everything. When they leave, the British know your kingdom better than you do—every vulnerable approach, every supply route, every hiding place."
            },
            right: {
                text: "Restrict Access",
                effect: { treasury: 0, britishFavor: -8, loyalty: 3 },
                msg: "You allow the survey of roads and rivers but bar them from military sites. The Resident writes that you have 'something to hide.' Your forts, at least, keep their secrets."
            }
        }
    ],

    // ERA 5: Between Macaulay and Doctrine of Lapse (1836-1847)
    era5: [
        {
            year: 1836,
            title: "The Thuggee Hunters",
            desc: "Colonel Sleeman's agents want to operate inside your territory to arrest suspected Thugs. They demand your courts hand over suspects for trial under British law, nullifying your judicial sovereignty.",
            note: "The Thuggee and Dacoity Suppression Acts (1836-1848) allowed British officers to arrest suspects inside Princely States. Accepting help implicitly admitted administrative failure.",
            left: {
                text: "Grant Jurisdiction",
                effect: { treasury: 3, britishFavor: 12, loyalty: -8 },
                msg: "Sleeman's men sweep through your territory. Roads grow safer. But your judges are sidelined, and a precedent is set—British law now reaches inside your borders."
            },
            right: {
                text: "Handle It Internally",
                effect: { treasury: -8, britishFavor: -8, loyalty: 8 },
                msg: "You deploy your own magistrates. Progress is slower, and the British dismiss your efforts as 'native incompetence.' But your courts retain their authority."
            }
        },
        {
            year: 1838,
            title: "The Afghan Disaster",
            desc: "The British have invaded Afghanistan and demand provisions and porters from your state for the campaign. Rumors say the war is going badly. Supporting a losing war could drain you; refusing could anger the Company.",
            note: "The First Anglo-Afghan War (1839-1842) ended in catastrophic British defeat. The retreat from Kabul saw an entire army destroyed. Indian rulers who provided supplies lost resources for nothing; those who refused were later blamed for the debacle.",
            left: {
                text: "Provide Support",
                effect: { treasury: -10, britishFavor: 10, loyalty: -5 },
                msg: "Caravans of grain and thousands of porters are sent westward. Many never return. The Afghan war collapses in disaster, and your contribution is wasted. The British, humiliated, are grateful—but you have nothing to show for it."
            },
            right: {
                text: "Plead Inability",
                effect: { treasury: 0, britishFavor: -8, loyalty: 3 },
                msg: "You claim your harvest was poor and you cannot spare provisions. When the Afghan disaster unfolds, you are quietly relieved. The British, looking for scapegoats, remember who helped and who didn't."
            }
        },
        {
            year: 1840,
            title: "The Revenue Settlement",
            desc: "The Resident pressures you to adopt a 'scientific' revenue assessment modeled on British Bengal—fixed cash payments replacing flexible harvest-sharing. It promises predictability but removes your ability to grant relief in bad years.",
            note: "British revenue systems replaced flexible, negotiation-based collection with rigid cash demands. This made states more 'efficient' on paper but destroyed the traditional safety net that protected peasants during drought and flood.",
            left: {
                text: "Adopt the New System",
                effect: { treasury: 10, britishFavor: 10, loyalty: -12 },
                msg: "Revenue rises as collection becomes systematic. But when drought strikes, your collectors must extract the full amount regardless. Peasants sell cattle, then tools, then daughters. The old flexibility is gone."
            },
            right: {
                text: "Keep Traditional Methods",
                effect: { treasury: -5, britishFavor: -8, loyalty: 8 },
                msg: "Your revenue collectors continue to negotiate with village headmen, adjusting for the harvest. Revenue is less predictable, and the Resident calls your system 'primitive.' But your peasants survive bad years."
            }
        },
        {
            year: 1843,
            title: "The Fall of Sindh",
            desc: "Sir Charles Napier has conquered Sindh on a thin pretext, famously quipping 'Peccavi'—'I have sinned.' The Amirs are dispossessed. Neighboring princes panic. A coalition asks you to sign a joint letter of protest.",
            note: "The annexation of Sindh in 1843 showed that even rulers who posed no military threat could be conquered. Napier's brutal campaign alarmed every remaining prince.",
            left: {
                text: "Sign the Protest",
                effect: { treasury: 0, britishFavor: -12, loyalty: 8 },
                msg: "You add your seal to the letter. It is received in London and utterly ignored. But the Company notes which princes dared to complain."
            },
            right: {
                text: "Stay Silent",
                effect: { treasury: 0, britishFavor: 5, loyalty: -8 },
                msg: "You keep your head down. The Resident nods approvingly. But your courtiers see a king who watched a fellow sovereign be destroyed and said nothing."
            }
        },
        {
            year: 1842,
            title: "The Court Musician",
            desc: "Your kingdom is renowned for its musical tradition. A European collector offers a fortune for your court's precious collection of instruments and manuscripts. The money would replenish your drained treasury.",
            note: "Cultural patronage was central to Indian kingship—music, poetry, and art demonstrated refinement and legitimacy. Selling cultural treasures was a sign of desperation that signaled a dynasty's decline.",
            left: {
                text: "Sell the Collection",
                effect: { treasury: 12, britishFavor: 3, loyalty: -8 },
                msg: "The instruments and manuscripts are packed into crates bound for London. Your treasury recovers, but the court musicians weep. A kingdom that sells its songs has lost something money cannot restore."
            },
            right: {
                text: "Keep the Heritage",
                effect: { treasury: 0, britishFavor: 0, loyalty: 5 },
                msg: "You refuse. The collection stays in the royal archive, and evening ragas still echo through the palace. In hard times, beauty is a luxury—but also a declaration that your civilization endures."
            }
        },
        {
            year: 1845,
            title: "The Telegraph Line",
            desc: "The British propose running a telegraph line through your territory, connecting their military commands. The speed of communication would let Calcutta react to events in hours. They offer rental payments for the right of way.",
            note: "The telegraph, like the railway, was a tool of imperial control. It allowed centralized command and rapid military coordination, making it nearly impossible for local rebellions to succeed before British reinforcements arrived.",
            left: {
                text: "Allow the Telegraph",
                effect: { treasury: 5, britishFavor: 8, loyalty: -5 },
                msg: "Poles and wires cross your landscape. Information now travels faster than any horseman. The British can coordinate against any threat in your region before you even learn of it."
            },
            right: {
                text: "Refuse the Line",
                effect: { treasury: 0, britishFavor: -8, loyalty: 3 },
                msg: "You refuse, claiming the poles disturb sacred groves. The line is rerouted around your territory at extra cost. The Company is irritated, but your kingdom retains a sliver of strategic obscurity."
            }
        },
        {
            year: 1844,
            title: "The Arms Regulation",
            desc: "The British issue a new regulation requiring all subjects to obtain licenses for firearms. They ask you to enforce this in your territory. Your warrior nobles consider bearing arms their birthright.",
            note: "Disarming the population was a key step in establishing British control. The Indian Arms Act later formalized this, ensuring that only 'loyal' subjects could possess weapons—a policy that lasted until independence.",
            left: {
                text: "Enforce the Regulation",
                effect: { treasury: 3, britishFavor: 10, loyalty: -12 },
                msg: "Your soldiers go village to village collecting swords and matchlocks. Your warrior castes are humiliated—their ancestral weapons confiscated by their own king's order. The Resident is pleased."
            },
            right: {
                text: "Ignore It",
                effect: { treasury: 0, britishFavor: -10, loyalty: 8 },
                msg: "You decline to disarm your people. Every farmstead keeps its ancestral sword, every horseman his lance. The British label your territory 'lawless.' Your people call it free."
            }
        }
    ],

    // ERA 6: Between Doctrine of Lapse and Railway (1849-1852)
    era6: [
        {
            year: 1849,
            title: "The Lion of Punjab Falls",
            desc: "The mighty Sikh Empire has been conquered. Young Maharaja Duleep Singh—eleven years old—is forced to surrender the Koh-i-Noor diamond and exiled to England. If the Sikhs could not resist, can anyone?",
            note: "The annexation of Punjab in 1849 eliminated the last major military power in India. The forced surrender of the Koh-i-Noor and exile of the child-king demonstrated that no force could guarantee survival.",
            left: {
                text: "Strengthen Defenses",
                effect: { treasury: -12, britishFavor: -8, loyalty: 8 },
                msg: "You quietly purchase modern rifles and drill your troops. The British notice. But your soldiers gain confidence, and your people see a ruler preparing to fight, not surrender."
            },
            right: {
                text: "Accept the New Order",
                effect: { treasury: 3, britishFavor: 8, loyalty: -12 },
                msg: "You disband your irregular cavalry and reduce the army to a ceremonial guard. The Company offers favorable terms. But your warriors drift into bitterness."
            }
        },
        {
            year: 1850,
            title: "The Nagpur Auction",
            desc: "The Raja of Nagpur has died, and Dalhousie has annexed the state. The royal elephants, horses, and jewels are being auctioned in the Calcutta bazaar. A merchant offers to buy items 'on your behalf.' The humiliation resonates across India.",
            note: "The public auction of Nagpur's royal property was a calculated humiliation—demonstrating that an Indian kingdom's heritage could be sold like common merchandise. It deepened the fury that would erupt in 1857.",
            left: {
                text: "Buy Royal Items",
                effect: { treasury: -8, britishFavor: -3, loyalty: 5 },
                msg: "You purchase the late Raja's ceremonial sword and his favorite elephant. The gesture of respect for a fallen house does not go unnoticed—by your people or by the British."
            },
            right: {
                text: "Do Nothing",
                effect: { treasury: 0, britishFavor: 3, loyalty: -5 },
                msg: "You avert your eyes from the spectacle. It is prudent, perhaps. But every prince in India sees the auction and imagines their own jewels under the hammer."
            }
        },
        {
            year: 1851,
            title: "The Widow's Petition",
            desc: "The Rani of a recently 'lapsed' state writes to you, begging for help. She has adopted a son, but Dalhousie refuses to recognize him. She asks you to petition London on her behalf. The Resident warns you not to interfere.",
            note: "The case echoes that of Rani Lakshmibai of Jhansi, whose adopted son was rejected by Dalhousie. Her famous cry—'Meri Jhansi nahin doongi' (I will not give up my Jhansi)—became a rallying cry of 1857.",
            left: {
                text: "Champion Her Cause",
                effect: { treasury: -5, britishFavor: -10, loyalty: 10 },
                msg: "You write to London in eloquent English, arguing for the Rani's rights under Hindu law. The petition is filed and forgotten. But word of your courage spreads through every princely court."
            },
            right: {
                text: "Stay Out of It",
                effect: { treasury: 0, britishFavor: 5, loyalty: -8 },
                msg: "You decline to get involved. The Rani's state is absorbed. She retreats to a modest house with her adopted son, swearing that one day she will have justice."
            }
        },
        {
            year: 1850,
            title: "The Military Inspection",
            desc: "The British demand a formal inspection of your army—its numbers, weapons, and readiness. They say it is routine. Your generals say it is reconnaissance for a future invasion.",
            note: "Military inspections allowed the British to assess the fighting capacity of native states. The information gathered was used to plan campaigns and identify which states could resist and which would fall easily.",
            left: {
                text: "Allow the Inspection",
                effect: { treasury: 0, britishFavor: 10, loyalty: -8 },
                msg: "British officers walk through your barracks counting muskets and men. Their report to Calcutta details every strength and weakness. You have given your potential enemy a blueprint."
            },
            right: {
                text: "Show Only Ceremonial Units",
                effect: { treasury: -3, britishFavor: -5, loyalty: 5 },
                msg: "You parade only your ceremonial guard—magnificent but misleading. The British suspect deception but cannot prove it. Your real fighting strength remains hidden."
            }
        },
        {
            year: 1852,
            title: "The Widow Remarriage Question",
            desc: "The social reformer Ishwar Chandra Vidyasagar petitions you to allow widow remarriage in your territory. Conservative nobles threaten to revolt if you agree. The British Resident supports the reform.",
            note: "The Hindu Widow Remarriage Act of 1856 was another example of social reform being used as both genuine humanitarian progress and a tool to delegitimize traditional rulers who resisted.",
            left: {
                text: "Permit Remarriage",
                effect: { treasury: 0, britishFavor: 8, loyalty: -10 },
                msg: "You issue a decree allowing widows to remarry. Progressive intellectuals praise you. But conservative nobles see another sacred tradition trampled by a king who answers to the British."
            },
            right: {
                text: "Uphold Tradition",
                effect: { treasury: 0, britishFavor: -8, loyalty: 5 },
                msg: "You decline, citing the authority of the shastras. The reformers are disappointed. The Resident writes that you are 'stubbornly attached to medieval customs.' The orthodox are satisfied—for now."
            }
        }
    ],

    // ERA 7: Between Railway and Oudh/Rebellion (1854-1856)
    era7: [
        {
            year: 1854,
            title: "The Arms Confiscation",
            desc: "The Company issues an order for all princely states to surrender their heavy artillery to British arsenals 'for safekeeping.' They promise the cannons will be returned 'if needed.' Your ancestors cast those guns.",
            note: "Systematic disarmament of princely states accelerated under Dalhousie. Artillery was the decisive weapon of the era—surrendering it made resistance impossible and dependence complete.",
            left: {
                text: "Surrender the Guns",
                effect: { treasury: 0, britishFavor: 12, loyalty: -15 },
                msg: "Your bronze cannons—cast by your grandfather, named after gods—are wheeled away to British storehouses. Your fortress walls stare down with empty embrasures. You are now defenseless."
            },
            right: {
                text: "Hide the Cannons",
                effect: { treasury: -5, britishFavor: -12, loyalty: 10 },
                msg: "You hand over a few rusted pieces and bury the rest in secret locations. If the day comes, you will not face it unarmed. The British suspect treachery but cannot prove it."
            }
        },
        {
            year: 1855,
            title: "The Greased Cartridges",
            desc: "Disturbing rumors reach your court: the new Enfield rifle cartridges issued to sepoys are greased with cow and pig fat, defiling both Hindu and Muslim soldiers. Sepoys in your region are refusing to drill. Tension is electric.",
            note: "The cartridge controversy was the immediate trigger of the 1857 rebellion. Whether or not the grease actually contained animal fat, the rumor crystallized decades of religious anxiety about British intentions.",
            left: {
                text: "Calm the Sepoys",
                effect: { treasury: -5, britishFavor: 5, loyalty: 5 },
                msg: "You assemble your garrison and swear the rumors are false. Some believe you; others see a king covering for his British masters. The tension eases—slightly. But the cartridges remain."
            },
            right: {
                text: "Stoke the Anger",
                effect: { treasury: 0, britishFavor: -10, loyalty: 10 },
                msg: "You let the rumors spread unchecked. Your soldiers grow angrier by the day. The British Resident is alarmed by the 'seditious atmosphere.' But if rebellion comes, your soldiers will be ready."
            }
        },
        {
            year: 1854,
            title: "The Final Revenue Demand",
            desc: "The British issue a massive new revenue assessment, claiming you owe decades of 'arrears' on subsidiary payments. The sum is ruinous. They offer to forgive the debt—in exchange for territorial concessions.",
            note: "Manufactured debts were a primary tool of territorial annexation. The Company's accountants could always find arrears, and the solution was always the same: surrender territory or face consequences.",
            left: {
                text: "Cede the Territory",
                effect: { treasury: 10, britishFavor: 10, loyalty: -12 },
                msg: "You sign away your northern districts—rich farmland that fed a quarter of your subjects. The debt vanishes. So does your self-respect. Your kingdom shrinks, and with it, your tax base."
            },
            right: {
                text: "Dispute the Claim",
                effect: { treasury: -8, britishFavor: -10, loyalty: 5 },
                msg: "You hire English lawyers and challenge the assessment in the Company's own courts. The case drags on for years, draining your resources. Justice is expensive when the judge works for the plaintiff."
            }
        },
        {
            year: 1855,
            title: "The Secret Alliance",
            desc: "A messenger arrives after dark from a powerful prince: a secret network of rulers is forming, ready to act when the moment comes. They want your pledge. Joining could mean liberation—or destruction.",
            note: "In the months before 1857, clandestine networks of communication spread among disaffected princes, soldiers, and rural leaders. The distribution of chapatis (flatbreads) and lotus flowers were signals of an approaching storm.",
            left: {
                text: "Join the Network",
                effect: { treasury: 0, britishFavor: -8, loyalty: 10 },
                msg: "You mark the lotus with your seal and return it. You are now part of something larger than yourself—a conspiracy of princes, soldiers, and peasants. If it fails, you will hang. If it succeeds, you will be free."
            },
            right: {
                text: "Refuse Involvement",
                effect: { treasury: 0, britishFavor: 3, loyalty: -5 },
                msg: "You decline. The messenger vanishes into the night. You have chosen caution over courage. When the storm breaks, you will face it alone—allied to neither side."
            }
        },
        {
            year: 1856,
            title: "The Nawab's Tears",
            desc: "Wajid Ali Shah, the deposed Nawab of Oudh, passes near your territory on his way to exile. He asks to visit your court one last time. The road is lined with weeping subjects. Receiving him would be an act of profound defiance.",
            note: "Wajid Ali Shah's departure from Lucknow was one of the most emotionally devastating events of the era. The Nawab was a beloved patron of arts and culture. His exile radicalized the entire region.",
            left: {
                text: "Receive the Nawab",
                effect: { treasury: -3, britishFavor: -10, loyalty: 12 },
                msg: "You welcome the weeping king with royal honors. For one night, he is a sovereign again, dining in a palace, not a prisoner's carriage. The Resident is livid. Your people weep with gratitude."
            },
            right: {
                text: "Close Your Gates",
                effect: { treasury: 0, britishFavor: 5, loyalty: -10 },
                msg: "You send apologies and close the gates. The Nawab passes by in silence. Your people watch from the walls as a broken king rides past, and they wonder: will their own king receive the same treatment?"
            }
        }
    ]
};

// ============================================================
//  DECK BUILDING — Assemble a unique deck each playthrough
// ============================================================

function buildDeck() {
    const deck = [];
    const eraKeys = ['era1', 'era2', 'era3', 'era4', 'era5', 'era6', 'era7'];

    // For each era, draw 2 random events (or fewer if pool is small)
    const drawnPool = [];
    eraKeys.forEach(key => {
        const pool = [...poolEvents[key]];
        shuffle(pool);
        const drawCount = Math.min(2, pool.length);
        for (let i = 0; i < drawCount; i++) {
            drawnPool.push(pool[i]);
        }
    });

    // Combine anchors + drawn pool events, sort by year
    const allEvents = [...anchorEvents, ...drawnPool];
    allEvents.sort((a, b) => a.year - b.year);

    // If two events share a year, spread them out slightly for display
    // (keep sorting stable)
    return allEvents;
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

// ============================================================
//  UI FUNCTIONS
// ============================================================

function updateDisplay() {
    updateBar('treasury', state.treasury);
    updateBar('british', state.britishFavor);
    updateBar('loyalty', state.loyalty);

    document.getElementById('val-treasury').innerText = state.treasury;
    document.getElementById('val-british').innerText = state.britishFavor;
    document.getElementById('val-loyalty').innerText = state.loyalty;

    document.getElementById('year').innerText = state.year;
    document.getElementById('era-label').innerText = getEra(state.year);

    // Timeline progress
    const progress = ((state.year - 1790) / (1857 - 1790)) * 100;
    document.getElementById('timeline-fill').style.width = `${Math.min(100, progress)}%`;

    // Event counter
    document.getElementById('event-num').innerText = state.eventIndex + 1;
    document.getElementById('event-total').innerText = state.deck.length;
}

function updateBar(type, value) {
    const bar = document.getElementById(`bar-${type}`);
    bar.style.width = `${value}%`;

    if (value <= 15) {
        bar.style.backgroundColor = '#e53935';
    } else if (value <= 30) {
        bar.style.backgroundColor = '#ff9800';
    } else {
        bar.style.backgroundColor = '#4caf50';
    }
}

function showStatChange(stat, value) {
    const el = document.getElementById(`change-${stat}`);
    el.className = 'stat-change';
    if (value > 0) {
        el.innerText = `+${value}`;
        el.classList.add('positive', 'flash');
    } else if (value < 0) {
        el.innerText = `${value}`;
        el.classList.add('negative', 'flash');
    } else {
        el.innerText = '';
    }
    void el.offsetWidth;
    el.classList.add('flash');
}

// ============================================================
//  GAME LOGIC
// ============================================================

function startGame() {
    state.deck = buildDeck();
    document.getElementById('intro-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    loadEvent();
}

function loadEvent() {
    if (checkGameOver()) return;

    if (state.eventIndex >= state.deck.length) {
        triggerVictory();
        return;
    }

    const currentEvent = state.deck[state.eventIndex];
    state.year = currentEvent.year;

    const cardArea = document.getElementById('card-area');
    cardArea.classList.remove('hidden', 'fade-in');
    document.getElementById('outcome-screen').classList.add('hidden');

    void cardArea.offsetWidth;
    cardArea.classList.add('fade-in');

    document.getElementById('card-era').innerText = getEra(currentEvent.year);
    document.getElementById('card-year').innerText = currentEvent.year;
    document.getElementById('event-title').innerText = currentEvent.title;
    document.getElementById('event-desc').innerText = currentEvent.desc;

    const noteEl = document.getElementById('historical-note');
    if (currentEvent.note) {
        noteEl.classList.remove('hidden');
        document.getElementById('note-text').innerText = currentEvent.note;
    } else {
        noteEl.classList.add('hidden');
    }

    document.getElementById('btn-left').innerText = currentEvent.left.text;
    document.getElementById('btn-right').innerText = currentEvent.right.text;

    updateDisplay();
}

function makeChoice(side) {
    const currentEvent = state.deck[state.eventIndex];
    const choice = currentEvent[side];

    state.decisionsLog.push({
        year: currentEvent.year,
        title: currentEvent.title,
        choice: choice.text
    });

    state.treasury = clamp(state.treasury + choice.effect.treasury);
    state.britishFavor = clamp(state.britishFavor + choice.effect.britishFavor);
    state.loyalty = clamp(state.loyalty + choice.effect.loyalty);

    showStatChange('treasury', choice.effect.treasury);
    showStatChange('british', choice.effect.britishFavor);
    showStatChange('loyalty', choice.effect.loyalty);

    // Show outcome
    document.getElementById('card-area').classList.add('hidden');
    const outcomeScreen = document.getElementById('outcome-screen');
    outcomeScreen.classList.remove('hidden', 'fade-in');
    void outcomeScreen.offsetWidth;
    outcomeScreen.classList.add('fade-in');

    document.getElementById('outcome-title').innerText = choice.text;
    document.getElementById('outcome-msg').innerText = choice.msg;

    // Effect badges
    const effectsContainer = document.getElementById('outcome-effects');
    effectsContainer.innerHTML = '';

    const labels = [
        { key: 'treasury', label: 'Treasury', icon: '\u2696' },
        { key: 'britishFavor', label: 'British Favor', icon: '\u2691' },
        { key: 'loyalty', label: 'Loyalty', icon: '\u2665' }
    ];

    labels.forEach(({ key, label, icon }) => {
        const val = choice.effect[key];
        if (val === 0) return;
        const badge = document.createElement('div');
        badge.className = `effect-badge ${val > 0 ? 'positive' : 'negative'}`;
        badge.innerHTML = `${icon} ${label} ${val > 0 ? '+' : ''}${val}`;
        effectsContainer.appendChild(badge);
    });

    updateDisplay();
    state.eventIndex++;
}

function nextEvent() {
    loadEvent();
}

function clamp(val) {
    return Math.min(100, Math.max(0, val));
}

// ============================================================
//  WIN / LOSS
// ============================================================

function checkGameOver() {
    if (state.treasury <= 0) {
        triggerGameOver(
            "Bankruptcy",
            "\u2620",
            "Your kingdom is bankrupt. The British annex your state citing 'Gross Mismanagement,' just as they did to Oudh. Your palace is inventoried, your jewels auctioned. You are granted a modest pension and a house far from home."
        );
        return true;
    }
    if (state.britishFavor <= 0) {
        triggerGameOver(
            "Conquered",
            "\u2694",
            "The Company has declared war. Red-coated columns converge on your capital. Your fortress walls crumble under modern artillery. You are captured, deposed, and exiled—another name on the long list of fallen princes."
        );
        return true;
    }
    if (state.loyalty <= 0) {
        triggerGameOver(
            "Overthrown",
            "\u26A0",
            "Your own people have risen against you. Peasants refuse taxes, soldiers desert, nobles conspire. You are overthrown from within—a king who lost the mandate of heaven long before he lost his throne."
        );
        return true;
    }
    return false;
}

function triggerGameOver(reason, icon, text) {
    const overlay = document.getElementById('game-over');
    overlay.classList.remove('hidden');

    document.getElementById('game-over-icon').innerText = icon;
    document.getElementById('end-title').innerText = reason;
    document.getElementById('end-year').innerText = `Your reign ended in ${state.year}`;
    document.getElementById('end-reason').innerText = text;

    document.getElementById('card-area').classList.add('hidden');
    document.getElementById('outcome-screen').classList.add('hidden');

    buildEndStats();
}

function triggerVictory() {
    const overlay = document.getElementById('game-over');
    overlay.classList.remove('hidden');

    let title, icon, text;

    if (state.britishFavor >= 60 && state.loyalty >= 40) {
        title = "The Survivor";
        icon = "\u2654";
        text = "Through cunning diplomacy and careful governance, your dynasty endures. The Queen's Proclamation of 1858 guarantees your throne. You survived the Company—and lived to see it abolished.";
    } else if (state.britishFavor >= 60 && state.loyalty < 40) {
        title = "The Puppet King";
        icon = "\u265F";
        text = "Your kingdom survives, but as a hollow ornament. You kept the Crown's favor by sacrificing your subjects' trust. Your dynasty endures—gilded and irrelevant—a museum piece of empire.";
    } else if (state.britishFavor < 40 && state.loyalty >= 60) {
        title = "The People's King";
        icon = "\u2764";
        text = "When the rebellion erupts, your people rise with you. Whether it succeeds or fails, your name will be remembered with honor. You chose your people over the conqueror.";
    } else {
        title = "The Enduring";
        icon = "\u2696";
        text = "Neither fully compliant nor openly defiant, you walked the razor's edge. The Company is dissolved, the Crown takes over, and your kingdom—battered but breathing—enters a new age. The game was rigged, but you survived it.";
    }

    document.getElementById('game-over-icon').innerText = icon;
    document.getElementById('end-title').innerText = title;
    document.getElementById('end-year').innerText = 'You survived until 1857!';
    document.getElementById('end-reason').innerText = text;

    document.getElementById('card-area').classList.add('hidden');
    document.getElementById('outcome-screen').classList.add('hidden');

    buildEndStats();
}

function buildEndStats() {
    const container = document.getElementById('end-stats');
    container.innerHTML = '';

    const stats = [
        { label: 'Treasury', value: state.treasury },
        { label: 'British Favor', value: state.britishFavor },
        { label: 'Loyalty', value: state.loyalty },
        { label: 'Decisions', value: state.decisionsLog.length }
    ];

    stats.forEach(({ label, value }) => {
        const div = document.createElement('div');
        div.className = 'end-stat';
        div.innerHTML = `
            <div class="end-stat-label">${label}</div>
            <div class="end-stat-value">${value}</div>
        `;
        container.appendChild(div);
    });
}
