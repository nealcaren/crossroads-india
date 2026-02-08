// ============================================================
//  THE CENSOR'S REDACTION DESK — Content
//  9 dispatches covering Feb–Nov 1919
//  Curly braces {…} mark redactable phrases
// ============================================================

const INTRO_PAGES = [
    {
        title: "The Lahore Tribune",
        subtitle: "Lahore, Punjab — April 1919",
        body: "You are the editor of a nationalist newspaper in Lahore, Punjab. The Great War is over, but the emergency powers have not ended. Instead, the Imperial Legislative Council has passed the Rowlatt Acts — giving the government power to detain Indians without trial and suppress the press without appeal. Under the Indian Press Act, your printing press is held hostage by a security deposit of Rs. 2,000 — one wrong word and the government seizes it.",
        flavor: "Your newspaper is one of the last independent voices in the Punjab."
    },
    {
        title: "Your Dilemma",
        subtitle: "Print the Truth — or Survive?",
        body: "Each day, dispatches arrive at your desk. The British censor watches every word you print. Inflammatory phrases will draw the District Magistrate's wrath — but redacting too much will turn your paper into a government mouthpiece, and your readers will abandon you. The protesters' slogan captures the stakes: Na Vakil, Na Dalil, Na Appeal — No Lawyer, No Argument, No Appeal.",
        flavor: "You must decide: what to print, what to black out, and what price you are willing to pay for the truth."
    },
    {
        title: "How to Play",
        subtitle: "The Editor's Tools",
        body: "Read each dispatch carefully. Click on highlighted phrases to redact them — a black bar will cover the words. Click again to restore them. Watch your two meters:\n\n<strong>Truth</strong> — Your journalistic integrity. Drops when you redact important information. If it falls to 20 or below, your readers abandon you.\n\n<strong>Risk</strong> — The danger from the colonial censor. Rises when you leave inflammatory words unredacted. If it reaches 80 or above, the District Magistrate confiscates your press.",
        flavor: "When you are satisfied with your redactions, click PRINT EDITION to commit your choices and face the consequences."
    }
];

const GLOSSARY = {
    "Rowlatt Acts": "Emergency legislation passed in March 1919 extending wartime powers of detention without trial and press censorship into peacetime. Named after Justice Rowlatt who chaired the committee recommending them.",
    "hartal": "A form of protest involving the voluntary closure of shops and businesses, derived from Gujarati. Gandhi called for a nationwide hartal on 6 April 1919.",
    "satyagraha": "Literally 'truth-force' or 'soul-force' — Gandhi's philosophy of nonviolent resistance. First developed in South Africa and applied in India from 1917 onward.",
    "Jallianwala Bagh": "A walled garden in Amritsar where on 13 April 1919, Brigadier-General Dyer ordered troops to fire on an unarmed crowd, killing at least 379 people (Indian estimates say over 1,000).",
    "martial law": "Military rule imposed on the Punjab from 15 April 1919, suspending civil liberties. Included the 'crawling order' requiring Indians to crawl on their bellies past a certain street.",
    "Brigadier-General Dyer": "The officer who ordered the Jallianwala Bagh massacre. He later testified he intended to produce a 'moral effect' on the Punjab. The Hunter Commission censured him but he was celebrated by many in Britain.",
    "Hunter Commission": "The Disorders Inquiry Committee appointed in October 1919 to investigate the Punjab disturbances. Chaired by Lord Hunter. Its findings were split along racial lines — British and Indian members reached different conclusions.",
    "crawling order": "An order issued by General Dyer requiring Indians to crawl on their stomachs when passing through a particular street in Amritsar where a British woman had been assaulted. It remained in force for several days.",
    "Punjab": "The northwestern province of British India, center of the 1919 disturbances. Its capital was Lahore. The province had contributed heavily to the British war effort and expected political reforms in return.",
    "sedition": "The crime of inciting rebellion against the authority of the state. Under British Indian law, even peaceful criticism of the government could be prosecuted as sedition under Section 124A of the Indian Penal Code.",
    "Na Vakil, Na Dalil, Na Appeal": "The famous slogan against the Rowlatt Acts, meaning 'No Lawyer, No Argument, No Appeal.' It captured the Acts' denial of basic legal rights — suspects could be detained without trial, tried without a jury, and denied the right of appeal.",
    "Indian Press Act of 1910": "The primary legal weapon against the nationalist press. It required publishers to deposit a security bond of up to Rs. 2,000 — a fortune in 1919 — which the government could forfeit without trial if a newspaper published 'objectionable matter.' A second offence meant seizure of the printing press itself.",
    "security deposit": "Under the Indian Press Act, every newspaper was required to lodge a cash bond (Rs. 500–2,000) with the government. If the paper published material deemed objectionable, the bond was forfeited. A second bond — up to Rs. 10,000 — was required to resume publication, and a second forfeiture meant confiscation of the press.",
    "disaffection": "The legal concept at the heart of colonial sedition law. 'Disaffection' meant disloyalty and all feelings of enmity toward the government. The invisible line between legal 'disapprobation' (disapproval of a policy) and illegal 'disaffection' (disloyalty to the state) was the trap every editor had to navigate.",
    "Sir Michael O'Dwyer": "Lieutenant Governor of Punjab during 1919. He viewed urban, educated Indians as dangerous agitators misleading loyal peasants. He backed Dyer's actions at Jallianwala Bagh and orchestrated the suppression of the Punjab press. He was assassinated in London in 1940 by Udham Singh.",
    "Baisakhi": "The spring harvest festival celebrated across Punjab, falling on 13 April. In 1919, thousands of villagers gathered in Amritsar for Baisakhi celebrations — many had no knowledge of General Dyer's ban on public gatherings, which led to the Jallianwala Bagh massacre.",
    "Section 124-A": "The sedition clause of the Indian Penal Code, used to prosecute editors and activists. It criminalized any attempt to 'excite disaffection' toward the government. Tribune editor Kalinath Ray was charged under this section for his editorials criticizing the Punjab administration.",
    "pre-censorship": "An order issued on 11 April 1919 requiring all Lahore newspapers to submit every article to the Assistant Director of Criminal Intelligence for approval before publication. This shifted the censor's role from punishing after the fact to controlling what could be printed at all."
};

const DISPATCHES = [
    // ── DISPATCH 1: Tutorial ────────────────────────────────
    {
        id: "rowlatt_bills",
        date: "18 February 1919",
        headline: "IMPERIAL COUNCIL DEBATES NEW SECURITY MEASURES",
        source: "Our Legislative Correspondent, Delhi",
        body: "The Imperial Legislative Council today considered {extraordinary emergency powers} proposed by the Rowlatt Committee. The bills would permit {detention without trial} for those suspected of {seditious activity}, and authorize {judges to try political cases without juries}. All non-official Indian members of the Council have voiced {unanimous opposition}, with one member calling the measures {a betrayal of wartime promises}. Despite this opposition, the bills are expected to pass owing to the {official majority that overrides elected members}.",
        phrases: {
            "extraordinary emergency powers": { risk: 1, truth: 1 },
            "detention without trial": { risk: 3, truth: 2 },
            "seditious activity": { risk: 1, truth: 1 },
            "judges to try political cases without juries": { risk: 2, truth: 2 },
            "unanimous opposition": { risk: 2, truth: 2 },
            "a betrayal of wartime promises": { risk: 4, truth: 2 },
            "official majority that overrides elected members": { risk: 2, truth: 2 }
        },
        censorWarning: "The District Magistrate reminds editors that reports on Legislative Council proceedings must avoid language that could promote disaffection toward the Government. Your security deposit of Rs. 2,000 serves as a reminder of the cost of irresponsible journalism.",
        historicalNote: "The Rowlatt Acts were passed on 18 March 1919 despite unanimous Indian opposition. All elected Indian members voted against them. The bills extended wartime emergency measures into peacetime, allowing detention without trial for up to two years. The Tribune, under editor Kalinath Ray, would soon publish an editorial titled 'A Colossal Blunder' — a phrase that marked him for prosecution.",
        censorReaction: {
            heavy: "The District Censor nods approvingly. 'A responsible account of the proceedings. No need to inflame the public with legal details.'",
            moderate: "The Censor reviews your edition. 'Some phrases are borderline, but I'll allow it — this time. Remember, editors who test boundaries often find them.'",
            light: "'Detention without trial?' The Censor circles the phrase in red. 'You are sailing very close to the wind, Editor. Consider this your first warning.'"
        },
        publicReaction: {
            heavy: "Readers write in asking why your paper prints only government summaries when other papers report on the opposition. Subscriptions dip slightly.",
            moderate: "Your readers appreciate the balanced reporting. Tea-stall debates across Lahore cite your coverage.",
            light: "Your edition is read aloud at a public meeting. Other editors across India are publishing editorials with titles like 'A Colossal Blunder.' Your bold coverage places you in their ranks."
        }
    },

    // ── DISPATCH 2: Easy ────────────────────────────────────
    {
        id: "gandhi_hartal",
        date: "25 March 1919",
        headline: "GANDHI CALLS FOR NATIONAL DAY OF PRAYER AND FASTING",
        source: "Our Political Correspondent, Bombay",
        body: "Mr. M. K. Gandhi has issued a call for a {nationwide hartal} on 6 April to protest the passage of the Rowlatt Acts. In his statement, Gandhi described the Acts as {symptoms of a deep-seated disease in the Government} and called upon all Indians to observe a day of {self-purification and prayer}. The hartal, Gandhi stated, would demonstrate {the united will of a people who refuse to be governed by unjust laws}. Organizers report {massive support across provinces}, with merchants, students, and workers {pledging to close shops and suspend all business}. British officials have warned that {any disruption of public order will be firmly suppressed}.",
        phrases: {
            "nationwide hartal": { risk: 2, truth: 2 },
            "symptoms of a deep-seated disease in the Government": { risk: 4, truth: 2 },
            "self-purification and prayer": { risk: 1, truth: 1 },
            "the united will of a people who refuse to be governed by unjust laws": { risk: 4, truth: 3 },
            "massive support across provinces": { risk: 2, truth: 2 },
            "pledging to close shops and suspend all business": { risk: 3, truth: 2 },
            "any disruption of public order will be firmly suppressed": { risk: 1, truth: 1 }
        },
        censorWarning: "Editors are advised that promoting or encouraging participation in hartals may constitute an offence under the Defence of India Act.",
        historicalNote: "Gandhi's call for a hartal was the first mass political action under his leadership in India. The response exceeded all expectations — on 6 April 1919, cities across India shut down in an unprecedented display of unified nonviolent protest.",
        censorReaction: {
            heavy: "'Very sensible,' the Censor says, barely glancing at your edition. 'Prayer and fasting — that's all anyone needs to know.'",
            moderate: "The Censor reads carefully. 'You've reported Gandhi's words but kept the tone measured. Acceptable — but watch the word hartal. It excites people.'",
            light: "The Censor slams your edition on his desk. 'You are practically advertising this hartal! Do you want your press sealed? Because I can arrange that.'"
        },
        publicReaction: {
            heavy: "A reader cancels his subscription with a terse note: 'We can read government gazettes for free.'",
            moderate: "Your edition is discussed at the Congress office. Leaders appreciate your coverage of both sides.",
            light: "Your edition sells out by noon. Extra copies are hand-circulated through the bazaars of Lahore."
        }
    },

    // ── DISPATCH 3: Medium ──────────────────────────────────
    {
        id: "hartal_day",
        date: "6 April 1919",
        headline: "COMPLETE HARTAL PARALYSES CITIES ACROSS INDIA",
        source: "Our Special Correspondents, Multiple Cities",
        body: "India witnessed {an unprecedented day of unified protest} as the hartal called by Gandhi {brought commerce to a complete standstill} in cities across the country. In Delhi, the hartal began on 30 March, where {police fired upon a crowd near the railway station, killing several persons}. In Delhi, {some already speak of the dead as martyrs and shaheed}. In Lahore, {every shop in Anarkali Bazaar stood shuttered} and {thousands gathered for prayer meetings}. In Bombay, Hindu and Muslim communities {observed the hartal jointly, demonstrating remarkable unity}. The Government has described the hartal as {the work of a small group of agitators} — a characterization {contradicted by the sheer scale of participation}.",
        phrases: {
            "an unprecedented day of unified protest": { risk: 2, truth: 2 },
            "brought commerce to a complete standstill": { risk: 2, truth: 2 },
            "police fired upon a crowd near the railway station, killing several persons": { risk: 5, truth: 3 },
            "every shop in Anarkali Bazaar stood shuttered": { risk: 2, truth: 2 },
            "thousands gathered for prayer meetings": { risk: 2, truth: 2 },
            "observed the hartal jointly, demonstrating remarkable unity": { risk: 3, truth: 2 },
            "the work of a small group of agitators": { risk: 0, truth: 2 },
            "some already speak of the dead as martyrs and shaheed": { risk: 4, truth: 2 },
            "contradicted by the sheer scale of participation": { risk: 3, truth: 2 }
        },
        censorWarning: "Reports of police actions during the recent disturbances must be submitted to the District Censor before publication. Exaggeration of casualties is a prosecutable offence. Editors whose publications have already attracted notice may face forfeiture of their security deposit under the Indian Press Act.",
        historicalNote: "The 6 April hartal was the largest coordinated protest in Indian history to that point. The Delhi hartal on 30 March saw police fire on crowds, killing several people — an ominous foreshadowing of events to come in the Punjab.",
        censorReaction: {
            heavy: "The Censor smiles. 'A responsible account. You've done well to omit the more sensational details. The Government appreciates discretion.'",
            moderate: "'Hmm,' the Censor mutters, circling phrases. 'You've included some details I'd rather you hadn't. But it's not actionable — yet.'",
            light: "'Police fired upon a crowd?' The Censor's face reddens. 'This is exactly the kind of irresponsible reporting that inflames the mob. You are now on the watch list.'"
        },
        publicReaction: {
            heavy: "A delegation of students visits your office. 'Where is the news of the police firing in Delhi? Are you an editor or a government clerk?'",
            moderate: "Your coverage is cited in a petition to the Viceroy. Both sides find enough in your report to quote.",
            light: "Workers at the railway yards read your account aloud. Your newspaper becomes required reading for the protest movement."
        }
    },

    // ── DISPATCH 4: Medium ──────────────────────────────────
    {
        id: "punjab_arrests",
        date: "10 April 1919",
        headline: "PUNJAB LEADERS ARRESTED; CROWDS GATHER IN AMRITSAR",
        source: "Our Amritsar Correspondent (by Telephone)",
        body: "The Punjab authorities today {arrested Dr. Saifuddin Kitchlew and Dr. Satya Pal}, the two most prominent leaders of the satyagraha movement in Amritsar, and {deported them to an unknown location}. The arrests were carried out {without public notice or legal proceedings}. Upon learning of the arrests, {large crowds began marching toward the civil lines} demanding the leaders' release. Reports indicate that {troops opened fire on the marchers at the railway footbridge, killing several and wounding many more}. In response, {enraged crowds attacked several government buildings and banks}, and {violence spread through the city}. The Deputy Commissioner has {requested military reinforcements from Lahore}.",
        phrases: {
            "arrested Dr. Saifuddin Kitchlew and Dr. Satya Pal": { risk: 2, truth: 3 },
            "deported them to an unknown location": { risk: 3, truth: 2 },
            "without public notice or legal proceedings": { risk: 3, truth: 2 },
            "large crowds began marching toward the civil lines": { risk: 2, truth: 2 },
            "troops opened fire on the marchers at the railway footbridge, killing several and wounding many more": { risk: 5, truth: 4 },
            "enraged crowds attacked several government buildings and banks": { risk: 1, truth: 2 },
            "violence spread through the city": { risk: 1, truth: 2 },
            "requested military reinforcements from Lahore": { risk: 3, truth: 2 }
        },
        censorWarning: "URGENT: All reports from Amritsar must be submitted for pre-publication review. Any report of troop movements or casualties must be approved by the military censor.",
        historicalNote: "The arrest and deportation of Kitchlew and Satya Pal on 10 April triggered the violence that the authorities then used to justify martial law. Troops fired on the crowd at the railway bridge, killing several — but the official narrative focused on the subsequent crowd violence against Europeans.",
        censorReaction: {
            heavy: "'Excellent restraint,' the Censor says. 'You've reported the violence against government property — that's the real story here. The public needs to know what mobs are capable of.'",
            moderate: "The Censor marks several passages. 'You've included the troop firing, which is problematic. But you've also reported the mob violence, so I'll let it pass with a caution.'",
            light: "The Censor summons you personally. 'Sir Michael O'Dwyer has personally flagged your edition. The Lieutenant Governor considers you part of the educated agitator class he despises. Consider this your final warning before prosecution.'"
        },
        publicReaction: {
            heavy: "The families of those killed at the railway bridge send a delegation to your office. 'Our sons are dead and your paper says nothing. What are you afraid of?'",
            moderate: "Your balanced account is the most complete report available. Both the Congress and moderate leaders cite it.",
            light: "Your edition is reprinted in Bombay and Calcutta papers. The Tribune's Kalinath Ray has just published 'Blazing Indiscretion' — the editorial that will lead to his arrest. Your name is mentioned alongside his."
        }
    },

    // ── DISPATCH 5: Hard ────────────────────────────────────
    {
        id: "martial_law_fears",
        date: "11 April 1919",
        headline: "VIOLENCE ERUPTS IN AMRITSAR; MARTIAL LAW FEARED",
        source: "Our Amritsar Correspondent",
        body: "Amritsar remains in turmoil following yesterday's events. {Five Europeans were killed by mobs}, including bank managers and a railway guard. {A British woman, Miss Sherwood, was assaulted and left for dead}. In retaliation, {the military conducted aerial strafing of crowds outside the city walls}, an action {unprecedented in the governance of British India}. Brigadier-General Dyer has arrived in Amritsar with {Gurkha and Baluchi troops} and has {prohibited all public gatherings under penalty of being fired upon}. Despite this order, the traditional {Baisakhi festival draws thousands of defenseless villagers into the city} who {may not have heard the proclamation}. The atmosphere is {one of dread — the city holds its breath, sensing that the worst is yet to come}.",
        phrases: {
            "Five Europeans were killed by mobs": { risk: 0, truth: 2 },
            "A British woman, Miss Sherwood, was assaulted and left for dead": { risk: 0, truth: 1 },
            "the military conducted aerial strafing of crowds outside the city walls": { risk: 5, truth: 3 },
            "unprecedented in the governance of British India": { risk: 3, truth: 2 },
            "Gurkha and Baluchi troops": { risk: 2, truth: 1 },
            "prohibited all public gatherings under penalty of being fired upon": { risk: 3, truth: 3 },
            "Baisakhi festival draws thousands of defenseless villagers into the city": { risk: 2, truth: 3 },
            "may not have heard the proclamation": { risk: 3, truth: 3 },
            "one of dread — the city holds its breath, sensing that the worst is yet to come": { risk: 2, truth: 2 }
        },
        censorWarning: "NOTICE: Martial law is expected imminently. All publications will require pre-censorship approval. Editors who publish without clearance face immediate arrest and seizure of press. Any further offence will require a fresh security deposit of Rs. 5,000 before publication may resume.",
        historicalNote: "On 12 April, Dyer issued orders prohibiting all gatherings — but the proclamation was not widely circulated. Many of those who gathered at Jallianwala Bagh on 13 April were Baisakhi pilgrims from surrounding villages who had no knowledge of the ban.",
        censorReaction: {
            heavy: "The Censor nods curtly. 'You've reported the attacks on Europeans — good. The public should understand what provoked the military response. That is the correct framing.'",
            moderate: "'You've included the aerial strafing,' the Censor says slowly. 'That is a military detail. I'll let it stand because you've also reported the mob violence. Balance — that's what I want to see.'",
            light: "A military officer accompanies the Censor to your office. 'Your reporting is undermining military operations. If martial law is declared, your press will be the first one sealed.'"
        },
        publicReaction: {
            heavy: "A visitor from Amritsar weeps in your office. 'They are bombing us from the sky and you write about nothing? Print the truth or close your doors.'",
            moderate: "Your edition reaches Amritsar through back channels. People pass it hand to hand. It is the most complete account available.",
            light: "The Congress President telegrams your office with congratulations. Intelligence officers are intercepting telegrams containing the word 'Rowlatt,' treating it as a code for insurrection. The telegraph operator warns you: 'They are reading everything.'"
        }
    },

    // ── DISPATCH 6: Very Hard (The Massacre) ────────────────
    {
        id: "jallianwala_bagh",
        date: "14 April 1919",
        headline: "GRAVE INCIDENT REPORTED AT JALLIANWALA BAGH",
        source: "Eyewitness Accounts Reaching Lahore",
        body: "Reports reaching Lahore describe {a catastrophic act of military violence} at the Jallianwala Bagh garden in Amritsar yesterday afternoon. According to survivors, {Brigadier-General Dyer marched fifty riflemen to the walled garden} where {a crowd of several thousand had gathered}, many for the Baisakhi festival. {Without issuing any warning to disperse}, Dyer {ordered his troops to open fire directly into the densest sections of the crowd}. The firing continued for {approximately ten minutes}. Witnesses describe {men, women, and children falling in heaps} as {people stampeded toward the few narrow exits, trampling the fallen}. Some {jumped into the garden's well to escape the bullets — their bodies were later recovered from its depths}. {Official figures have not been released}, but survivors estimate {the dead number in the hundreds, with over a thousand wounded}. {The wounded were left without medical aid throughout the night}, as the {curfew prevented anyone from reaching them}. Survivors are calling this {an atrocity without precedent in the history of British India}.",
        phrases: {
            "a catastrophic act of military violence": { risk: 5, truth: 3 },
            "Brigadier-General Dyer marched fifty riflemen to the walled garden": { risk: 3, truth: 3 },
            "a crowd of several thousand had gathered": { risk: 2, truth: 2 },
            "Without issuing any warning to disperse": { risk: 5, truth: 3 },
            "ordered his troops to open fire directly into the densest sections of the crowd": { risk: 5, truth: 4 },
            "approximately ten minutes": { risk: 2, truth: 3 },
            "men, women, and children falling in heaps": { risk: 4, truth: 3 },
            "people stampeded toward the few narrow exits, trampling the fallen": { risk: 3, truth: 2 },
            "jumped into the garden's well to escape the bullets — their bodies were later recovered from its depths": { risk: 3, truth: 3 },
            "Official figures have not been released": { risk: 2, truth: 2 },
            "the dead number in the hundreds, with over a thousand wounded": { risk: 5, truth: 3 },
            "The wounded were left without medical aid throughout the night": { risk: 4, truth: 3 },
            "curfew prevented anyone from reaching them": { risk: 2, truth: 3 },
            "an atrocity without precedent in the history of British India": { risk: 5, truth: 2 }
        },
        censorWarning: "ALL REPORTS FROM AMRITSAR ARE SUBJECT TO MARTIAL LAW CENSORSHIP. Any publication of unverified casualty figures or descriptions of military operations without authorization is a criminal offence. Editors are personally liable.",
        historicalNote: "On 13 April 1919, General Dyer led troops to Jallianwala Bagh and opened fire without warning on an unarmed crowd. 1,650 rounds were fired in about ten minutes. The official death toll was 379, but Indian sources estimated over 1,000 killed. The wounded received no medical attention that night due to curfew. The well yielded 120 bodies. B.G. Horniman of the Bombay Chronicle later smuggled photographs of the aftermath to the Daily Herald in London, breaking the censorship blockade.",
        censorReaction: {
            heavy: "The Censor is relieved. 'You've shown admirable restraint. The Government will release an official account in due course. Until then, speculation serves no one.'",
            moderate: "'Some of these details are very concerning,' the Censor says. 'I'm going to let this pass because you've avoided the most inflammatory characterizations. But I want to see tomorrow's edition before it prints.'",
            light: "The Censor arrives with two policemen. 'This edition is seized. Every copy. You have published unauthorized details of military operations under martial law. You will be hearing from the District Magistrate.'"
        },
        publicReaction: {
            heavy: "A survivor of Jallianwala Bagh, bandages still bloody, appears at your door. 'I crawled over bodies to reach your office. And you will print nothing? Then the dead have no voice at all.'",
            moderate: "Your account, though cautious, is the first published report of the massacre. It is hand-copied and distributed across the Punjab.",
            light: "Your edition becomes the primary documentary source for the massacre. It will be cited in the Congress report and, later, in the Hunter Commission. This is the most important thing your newspaper has ever published."
        }
    },

    // ── DISPATCH 7: Hardest (Eyewitness Account) ────────────
    {
        id: "eyewitness",
        date: "16 April 1919",
        headline: "EYEWITNESS: 'THEY FIRED UNTIL THE AMMUNITION WAS EXHAUSTED'",
        source: "Interviews Conducted Under Conditions of Secrecy",
        body: "This newspaper has obtained eyewitness testimony from survivors of the Jallianwala Bagh incident. Ratan Devi, whose husband was killed, states: '{I found my husband's body at nightfall. I sat with it all night, surrounded by the dead and dying. No one was allowed to help us.}' Another survivor reports that {Dyer positioned his troops at the main entrance and directed fire toward the exits}, {ensuring maximum casualties}. A doctor who treated the wounded states: '{I have treated soldiers in the Great War. I have never seen wounds inflicted so deliberately on civilians.}' Reports indicate that {Dyer subsequently expressed satisfaction with his action}, telling officials that he had {produced the necessary moral effect on the people of Punjab}. {1,650 rounds were fired according to military records} — {nearly one bullet for every three people in the garden}. Under martial law, {Amritsar residents are now required to crawl on their stomachs} when passing through the street where Miss Sherwood was attacked.",
        phrases: {
            "I found my husband's body at nightfall. I sat with it all night, surrounded by the dead and dying. No one was allowed to help us.": { risk: 4, truth: 3 },
            "Dyer positioned his troops at the main entrance and directed fire toward the exits": { risk: 5, truth: 4 },
            "ensuring maximum casualties": { risk: 5, truth: 3 },
            "I have treated soldiers in the Great War. I have never seen wounds inflicted so deliberately on civilians.": { risk: 4, truth: 3 },
            "Dyer subsequently expressed satisfaction with his action": { risk: 5, truth: 3 },
            "produced the necessary moral effect on the people of Punjab": { risk: 3, truth: 3 },
            "1,650 rounds were fired according to military records": { risk: 3, truth: 3 },
            "nearly one bullet for every three people in the garden": { risk: 4, truth: 2 },
            "Amritsar residents are now required to crawl on their stomachs": { risk: 5, truth: 3 }
        },
        censorWarning: "FINAL WARNING: Publication of any testimony regarding the Jallianwala Bagh incident without prior military authorization constitutes an offence under martial law. Editors face imprisonment and permanent closure of their press. Under the Press Act, a second forfeiture results in seizure of the printing press itself.",
        historicalNote: "Ratan Devi's testimony is historical — she sat with her husband's body all night while jackals fed on the dead around her. Dyer did testify that he intended to create a 'moral effect.' The 1,650 rounds figure comes from Dyer's own reports. The crawling order was real and remained in force for several days. On 26 April, B.G. Horniman of the Bombay Chronicle was deported to England for his reporting. After his deportation, the Chronicle printed blank editorial columns in protest — silence as its own form of defiance.",
        censorReaction: {
            heavy: "The Censor is visibly surprised by your restraint. 'You've held back the most explosive details. The Government may actually owe you a debt. This kind of responsible editing prevents bloodshed.'",
            moderate: "'This is very, very dangerous material,' the Censor says quietly. 'Some of these testimonies — if they're accurate — I suggest you hide your notes. I can't protect you much longer.'",
            light: "The Censor does not come. Instead, two soldiers arrive. Your press is sealed. Your type is confiscated. As they leave, one soldier whispers: 'I was there. Print it all.'"
        },
        publicReaction: {
            heavy: "Your staff refuse to come to work. Your compositor leaves a note: 'I set type for a newspaper, not a government notice board. Find someone else.'",
            moderate: "Underground copies of your edition circulate through Amritsar. A survivor sends word: 'Your words are our only proof that this happened.'",
            light: "Your edition is smuggled to Bombay, where it is reprinted in full. The Viceroy's office demands to know how the testimony was obtained. You have changed the national conversation."
        }
    },

    // ── DISPATCH 8: Hard (Aftermath) ────────────────────────
    {
        id: "crawling_order",
        date: "22 April 1919",
        headline: "MARTIAL LAW REGIME IMPOSES CRAWLING ORDER",
        source: "Reports from Multiple Sources in Amritsar",
        body: "The martial law regime in Amritsar has imposed regulations that have {shocked even those who supported firm government action}. General Dyer has ordered that {all Indians passing through the street where Miss Sherwood was assaulted must crawl on their bellies}. {Students at certain colleges have been forced to march sixteen miles in the midday sun as collective punishment}. {Public floggings are being administered for minor infractions}, including failure to salute British officers. The {electricity and water supply to Indian quarters has been cut}. Indians must {dismount from vehicles and salaam any passing European}. A lawyer reports that {trials under martial law deny the accused any legal representation}. These measures, affecting {an entire civilian population for the actions of a few}, have drawn {private criticism from even some British civil servants} who {consider them disproportionate and counterproductive}. Critics have coined the term {Dyerarchy — a bitter pun suggesting not reform but military dictatorship}.",
        phrases: {
            "shocked even those who supported firm government action": { risk: 3, truth: 2 },
            "all Indians passing through the street where Miss Sherwood was assaulted must crawl on their bellies": { risk: 4, truth: 3 },
            "Students at certain colleges have been forced to march sixteen miles in the midday sun as collective punishment": { risk: 3, truth: 3 },
            "Public floggings are being administered for minor infractions": { risk: 4, truth: 3 },
            "electricity and water supply to Indian quarters has been cut": { risk: 3, truth: 3 },
            "dismount from vehicles and salaam any passing European": { risk: 2, truth: 2 },
            "trials under martial law deny the accused any legal representation": { risk: 3, truth: 3 },
            "an entire civilian population for the actions of a few": { risk: 4, truth: 2 },
            "private criticism from even some British civil servants": { risk: 2, truth: 2 },
            "consider them disproportionate and counterproductive": { risk: 3, truth: 2 },
            "Dyerarchy — a bitter pun suggesting not reform but military dictatorship": { risk: 4, truth: 2 }
        },
        censorWarning: "Martial law remains in effect. All publications in the Punjab are subject to pre-censorship. Reports of martial law proceedings that could undermine public confidence in the administration are prohibited.",
        historicalNote: "All the martial law measures described are historical. The crawling order, public floggings, forced marches, and cutting of utilities were documented by the Congress Punjab Inquiry Committee and later confirmed in the Hunter Commission hearings. These measures affected tens of thousands of civilians. The Amrita Bazar Patrika of Calcutta printed blank editorial columns in protest and published 'To Whom Does India Belong?' — an editorial that cost them a Rs. 5,000 security forfeiture.",
        censorReaction: {
            heavy: "'You've omitted the more extreme details,' the Censor notes. 'The martial law administration appreciates editors who understand the necessity of firm measures during emergencies.'",
            moderate: "The Censor reviews your edition in silence. 'Some of these details — the floggings, the crawling order — are technically matters of public record under martial law. I'll pass it, but with reservations.'",
            light: "'Disproportionate and counterproductive?' The Censor reads aloud. 'You are quoting critics of martial law. That is itself a seditious act. Your edition is confiscated.'"
        },
        publicReaction: {
            heavy: "A group of lawyers visits your office. 'The rule of law has collapsed in Amritsar and your newspaper reads like a railway timetable. History will not be kind to your silence.'",
            moderate: "Your measured account of martial law reaches Delhi. Members of the Imperial Council begin asking questions. Your reporting is contributing to political pressure for an inquiry.",
            light: "Your account is the most complete record of martial law abuses published in India. It will form the basis of the Congress inquiry and shape public opinion for a generation."
        }
    },

    // ── DISPATCH 9: Medium-Hard (Resolution) ────────────────
    {
        id: "hunter_commission",
        date: "19 November 1919",
        headline: "HUNTER COMMISSION HEARS TESTIMONY ON PUNJAB DISORDERS",
        source: "Our Correspondent, Delhi",
        body: "The Disorders Inquiry Committee under Lord Hunter has begun hearing testimony regarding the Punjab disturbances. In {extraordinary testimony, Brigadier-General Dyer admitted} that he {had no intention of giving the crowd a chance to disperse}. He stated that {his object was not to disperse the meeting but to punish the people of Punjab} and that he {would have used machine guns if he could have brought them through the narrow entrance}. When asked about the wounded, Dyer stated that {it was not his job to attend to the wounded — hospitals were open and the injured could have gone there}. Indian witnesses have testified about {systematic humiliation under martial law}, including the {crawling order, public floggings, and collective punishment of entire communities}. The Commission appears {divided along racial lines}, with the {British members sympathetic to Dyer's position} while {Indian members press for accountability}. {Public opinion in Britain has rallied behind Dyer}, who is being {hailed in certain newspapers as 'the man who saved India'}. Indian members argued that the press had been {gagged by the Press Act while the government manufactured its own narrative}.",
        phrases: {
            "extraordinary testimony, Brigadier-General Dyer admitted": { risk: 2, truth: 3 },
            "had no intention of giving the crowd a chance to disperse": { risk: 3, truth: 3 },
            "his object was not to disperse the meeting but to punish the people of Punjab": { risk: 4, truth: 4 },
            "would have used machine guns if he could have brought them through the narrow entrance": { risk: 4, truth: 3 },
            "it was not his job to attend to the wounded — hospitals were open and the injured could have gone there": { risk: 3, truth: 3 },
            "systematic humiliation under martial law": { risk: 3, truth: 2 },
            "crawling order, public floggings, and collective punishment of entire communities": { risk: 2, truth: 3 },
            "divided along racial lines": { risk: 3, truth: 2 },
            "British members sympathetic to Dyer's position": { risk: 2, truth: 2 },
            "Indian members press for accountability": { risk: 2, truth: 2 },
            "Public opinion in Britain has rallied behind Dyer": { risk: 2, truth: 2 },
            "hailed in certain newspapers as 'the man who saved India'": { risk: 2, truth: 2 },
            "gagged by the Press Act while the government manufactured its own narrative": { risk: 3, truth: 2 }
        },
        censorWarning: "Reports on the Hunter Commission proceedings are permitted but must accurately reflect testimony from all parties. Editorializing on Commission proceedings is strongly discouraged.",
        historicalNote: "Dyer's testimony before the Hunter Commission is quoted directly from the historical record. He did say he would have used machine guns. He did say it was not his duty to help the wounded. The Commission's findings were indeed split along racial lines. The Morning Post in London raised £26,000 for Dyer as 'the man who saved India.' The Tribune's Kalinath Ray was charged under Section 124-A for using the word 'martyrs' and for his editorial 'Blazing Indiscretion' — he was sentenced to two years' rigorous imprisonment.",
        censorReaction: {
            heavy: "The Censor shrugs. 'The Commission is a matter of public record now. But you've been wise to present only the summary. Less is more, as they say.'",
            moderate: "'Dyer's own words are damning enough,' the Censor admits. 'You haven't needed to editorialize. This is acceptable reporting.'",
            light: "The Censor reads your edition with a heavy expression. 'Every word of this is from the public record, so I cannot touch it. But the way you've arranged Dyer's own words — you've made the case more effectively than any editorial could.'"
        },
        publicReaction: {
            heavy: "Your readers have largely moved to other papers. Those who remain are mostly government officials who prefer your restrained style.",
            moderate: "Your Commission coverage is thorough and fair. Readers across the political spectrum turn to your paper for reliable reporting.",
            light: "Your full reporting of Dyer's testimony provokes outrage across India. Tagore renounces his knighthood. The movement for self-rule gains unstoppable momentum."
        }
    }
];

const ENDINGS = {
    truthCollapse: {
        title: "The Silent Press",
        icon: "silence",
        description: "Your newspaper has become indistinguishable from a government gazette. Readers who once turned to the Lahore Tribune for the truth now pass it by without a glance. The tea-stalls stack unsold copies for kindling.",
        epilogue: "In the years that follow, no one remembers the Lahore Tribune's coverage of 1919 — because there was nothing to remember. The stories of Jallianwala Bagh reached the world through other hands. Your press survived, but your purpose did not.",
        historicalReflection: "Many Indian newspapers did self-censor into irrelevance under British pressure — much like the Civil & Military Gazette, the loyalist Lahore paper that printed government communiques and was despised by locals as a mouthpiece of the Raj. The papers that survived with their reputations intact — like the Bombay Chronicle and the Tribune of Lahore — were those that found ways to print the truth despite the risks."
    },
    riskCollapse: {
        title: "Press Confiscated",
        icon: "confiscated",
        description: "The District Magistrate's men arrive at dawn. They carry away your type, your press, your files. A red seal is pasted across your door: CLOSED BY ORDER OF THE GOVERNMENT. Your compositors stand in the street, watching their livelihood carried away in carts.",
        epilogue: "Your fearless reporting reached those who needed it most — for a time. But a silenced press cannot report tomorrow's injustices. The stories you could not tell will have to wait for other voices, other times.",
        historicalReflection: "Under the Indian Press Act's three-strike system — forfeiture, second bond, then seizure — dozens of Indian presses were destroyed in 1919. The Punjab government alone prosecuted over 50 newspapers. Over 350 presses across India were penalized under the Act. Yet the suppressed stories eventually reached the world through underground pamphlets, the Congress inquiry, and the Hunter Commission."
    },
    fearlessEditor: {
        title: "The Fearless Editor",
        subtitle: "Truth ≥ 70, Risk ≤ 40",
        icon: "fearless",
        description: "Against all odds, you have printed the truth and survived. Your newspaper emerged from 1919 as the most trusted voice in the Punjab — a paper that reported the massacre, the martial law, and the Commission testimony without flinching.",
        epilogue: "The Lahore Tribune's coverage of 1919 becomes a primary source for historians. Your dispatches are cited in the Congress Punjab Inquiry, in Parliament, and in classrooms for generations. You proved that even under a regime of censorship, the truth can find its way to print.",
        historicalReflection: "A handful of editors achieved something close to this. Kalinath Ray of The Tribune accepted two years' imprisonment as the price of editorials like 'Blazing Indiscretion.' B.G. Horniman of the Bombay Chronicle was deported for smuggling photographs of the massacre to London. They accepted prison and deportation as the price of truth — and their reporting helped turn world opinion against the Raj."
    },
    survivingVoice: {
        title: "The Surviving Voice",
        subtitle: "Truth ≤ 40, Risk ≤ 30",
        icon: "surviving",
        description: "You made painful compromises, redacting words that burned to cut. Your newspaper survived, but as a shadow of what it could have been. The most important story of the century passed through your desk, and you printed only fragments.",
        epilogue: "In the quiet of your office, you keep the un-redacted versions in a locked drawer. Perhaps one day they can be published. For now, you tell yourself that a surviving voice is better than a silenced one — and perhaps you are right.",
        historicalReflection: "Most Indian editors occupied this position — printing what they could, suppressing what they must, and living with the knowledge of what they left unsaid. The invisible line between legal 'disapprobation' (disapproval of a policy) and illegal 'disaffection' (disloyalty to the state) was the trap every editor had to navigate. Their compromises were not cowardice but calculation: the newspaper that survives can fight another day."
    },
    tightrope: {
        title: "The Editor's Tightrope",
        subtitle: "All Other Outcomes",
        icon: "tightrope",
        description: "You walked the razor's edge between truth and survival. Some dispatches you printed boldly; others you trimmed to satisfy the censor. Your readers received an incomplete picture, but it was closer to the truth than the government wanted.",
        epilogue: "The year 1919 tested every editor in India. You neither surrendered to the censor nor sacrificed your press on the altar of principle. You did what most real editors did: your imperfect best, in impossible circumstances.",
        historicalReflection: "The tension between truth and survival was the defining experience of the Indian press under colonialism. There were no perfect choices — only degrees of compromise, resistance, and courage."
    }
};
