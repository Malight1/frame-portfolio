// Edit this file to change the site's content. Every page reads from here.
// Reels and photos are Riah's own work: Instagram posts, his Pixieset galleries and films he sent us.
// PLACEHOLDER: the email address still needs confirming with Riah.
// Media lives in public/media/riah. Photos come in three widths (pNN-s 640, pNN-m 1100, pNN full),
// each as .webp (served first) and .jpg (fallback).

const PIX = "https://riahphotography.pixieset.com/";
const FASHION = PIX + "mosturohlifestyle-1/";
const ph = (n, title, kind, w, h, credit, post) => ({ src: `/media/riah/${n}.jpg`, thumb: `/media/riah/${n}-s.jpg`, title, kind, w, h, credit, post });

export const SITE = {
  brand: "Riah Visuals",
  name: "Seraiah",
  role: "Photographer and videographer",
  line: "Fashion, portraits, convocations, events and documentary films.",
  instagram: "https://www.instagram.com/riah_visuals/",
  handle: "@riah_visuals",
  email: "hello@riahvisuals.com",
  gallery: PIX,

  // The four groups used to filter the portfolio and on the Home page
  kinds: [
    { id: "fashion", name: "Fashion & lifestyle", short: "Fashion", line: "Outfit shoots, lookbooks and lifestyle content, with colour planned around every look." },
    { id: "portraits", name: "Portraits & convocation", short: "Portraits", line: "Graduation and personal portraits that look like you on your best day." },
    { id: "events", name: "Events & celebrations", short: "Events", line: "Parties, proposals, conferences and campus events, covered start to finish." },
    { id: "films", name: "Films & documentaries", short: "Films", line: "Fashion films, brand documentaries and short films, cut for Instagram and beyond." },
  ],

  // Riah's six services. type: photo or video. covers: what each one includes.
  // img/img2: photo base paths or posters; video/video2: silent loops; see: where "See the work" goes.
  services: [
    { id: "fashion", type: "photo", name: "Fashion & lifestyle shoot", line: "Outfit shoots, lookbooks and lifestyle content, with colour planned around every look.",
      covers: "Lookbooks, new drops, creators, lifestyle and brand content",
      gets: ["Edited outfit photos, ready to post", "Help with styling, colour and locations", "Posing and direction on the day"], img: "/media/riah/p16", img2: "/media/riah/p20", see: "/portfolio?k=fashion#photos" },
    { id: "portrait", type: "photo", name: "Portrait", line: "Personal, birthday and graduation portraits that look like you on your best day.",
      covers: "Personal portraits, birthday shoots, convocation and profile photos",
      gets: ["Edited portraits in full resolution", "Solo, friends or family shots", "Help with poses on the day"], img: "/media/riah/p41", img2: "/media/riah/p37", see: "/portfolio?k=portraits#photos" },
    { id: "events", type: "photo", name: "Event coverage", line: "Parties, proposals, birthdays and campus events, covered from start to finish.",
      covers: "Parties, proposals, birthdays, campus and community events",
      gets: ["Coverage from start to finish", "Candid moments and group shots", "Edited photos of the day"], img: "/media/riah/p68", img2: "/media/riah/p65", see: "/portfolio?k=events#photos" },
    { id: "conference", type: "photo", name: "Conference shoot", line: "Speakers, panels, guests and the room, for conferences, summits and launches.",
      covers: "Conferences, summits, product launches, workshops and talks",
      gets: ["Speakers, panels and audience shots", "Branding and venue details", "Quick edits for posting that week"], img: "/media/riah/p38", img2: "/media/riah/p39", see: "/portfolio?k=events#photos" },
    { id: "video", type: "video", name: "Video coverage", line: "Events, conferences and launches, filmed and cut into a highlight film and short reels.",
      covers: "Event highlights, conference recaps, reels and behind the scenes",
      gets: ["Filming from start to finish", "A highlight film of the day", "Short cuts for Reels and TikTok"], img: "/media/riah/reel5", video: "/media/riah/reel5-loop.mp4", img2: "/media/riah/reel2", video2: "/media/riah/reel2-loop.mp4", see: "/portfolio#films" },
    { id: "films", type: "video", name: "Fashion & brand films", line: "Fashion films, brand documentaries and short films, planned, shot and edited for you.",
      covers: "Fashion films, brand documentaries, short films and concepts",
      gets: ["Idea and shot list planned together", "Filmed and edited for you", "Vertical and wide versions"], img: "/media/riah/reel4", video: "/media/riah/reel4-loop.mp4", img2: "/media/riah/reel6", video2: "/media/riah/reel6-loop.mp4", see: "/portfolio#films" },
  ],

  faq: [
    ["What do you shoot?", "Fashion and lifestyle shoots, portraits, event coverage, conference shoots, video coverage, and fashion and brand films. Not sure it fits? Send me a message."],
    ["Can I get photos and a video from the same shoot?", "Yes. Many shoots include both. Tell me what you need when you book and we plan the day around it."],
    ["What do you shoot with?", "A camera or a phone, whichever suits the shoot. We decide when we plan the look and the location."],
    ["Do you help with styling and locations?", "Yes. I play with colour, so we plan the outfits and the location together before the day."],
    ["Where do you shoot?", "At your venue, around campus and the city, or a location we pick together. Send me the area when you book."],
    ["How do I book?", "Send a booking request on this site or message me on Instagram with the date, the place and the idea. I'll reply with a plan and a price."],
  ],

  // ratio is width/height of the source video
  reels: [
    { id: "estaz", title: "Estaz", kind: "fashion", length: "0:10", ratio: .5625, video: "/media/riah/reel4.mp4", loop: "/media/riah/reel4-loop.mp4", poster: "/media/riah/reel4.jpg",
      note: "Fashion film for Estaz: three fringe looks in orange, green and red." },
    { id: "waterfront", title: "Black & Tan", kind: "fashion", length: "0:30", ratio: .5625, video: "/media/riah/reel5.mp4", loop: "/media/riah/reel5-loop.mp4", poster: "/media/riah/reel5.jpg",
      note: "Three women in matching black and tan cut-out pieces walk the waterfront. Wide-brim hats, straw bags and close-ups of every detail, shot in bright afternoon light." },
    { id: "welum", title: "Welum", kind: "films", length: "0:55", ratio: .5625, video: "/media/riah/reel6.mp4", loop: "/media/riah/reel6-loop.mp4", poster: "/media/riah/reel6.jpg",
      note: "Brand documentary for the menswear label Welum." },
    { id: "white-dress", title: "White Hour", kind: "fashion", length: "0:30", ratio: .5625, video: "/media/riah/reel7.mp4", loop: "/media/riah/reel7-loop.mp4", poster: "/media/riah/reel7.jpg",
      note: "Two friends in white halter dresses with ruffled hems, on the waterfront in late sun. Hair flips, laughter and slow turns that show off the dresses." },
    { id: "brand-new-day", title: "Brand New Day, in UNILAG", kind: "films", length: "0:42", ratio: 1.77, video: "/media/riah/reel0.mp4", loop: "/media/riah/reel0-loop.mp4", poster: "/media/riah/reel0.jpg",
      note: "A recreation of the end-credit shots from Spider-Man: Brand New Day, filmed around campus.", post: "https://www.instagram.com/riah_visuals/reel/DdKeYptITB9/" },
    { id: "everyone-gets-fazzy", title: "Everyone gets Fazzy", kind: "fashion", length: "0:40", ratio: 1.78, video: "/media/riah/reel3.mp4", loop: "/media/riah/reel3-loop.mp4", poster: "/media/riah/reel3.jpg",
      note: "Fashion film for @fazzy_d_. Videography by Riah, directed and edited by @_wg.studios.", post: "https://www.instagram.com/_wg.studios/reel/DgDWMUZBrUU/" },
    { id: "this-very-day", title: "This very day", kind: "films", length: "0:58", ratio: .8, video: "/media/riah/reel1.mp4", loop: "/media/riah/reel1-loop.mp4", poster: "/media/riah/reel1.jpg",
      note: "A slow, sunlit day, filmed for the memories.", post: "https://www.instagram.com/riah_visuals/reel/DLFAkHdtoHE/" },
    { id: "bloopers", title: "Twenty takes of chaos", kind: "films", length: "1:29", ratio: .5625, video: "/media/riah/reel2.mp4", loop: "/media/riah/reel2-loop.mp4", poster: "/media/riah/reel2.jpg",
      note: "Behind every sharp frame is about twenty takes of pure chaos. A glimpse into the process.", post: "https://www.instagram.com/riah_visuals/reel/Dc3Hz8wN4wn/" },
  ],

  // Mixed on purpose: colours and kinds alternate so no single shoot fills the screen.
  // Every photo links to the Pixieset gallery it comes from (never to Instagram).
  photos: [
    ph("p16", "Pink on pink", "fashion", 1600, 2133, "Fashion and lifestyle shoot", FASHION),
    ph("p55", "Red cap", "fashion", 1600, 2133, "Fashion and lifestyle shoot", FASHION),
    ph("p68", "Quadtopia", "events", 1600, 1067, "Party coverage", PIX + "quadtopia/"),
    ph("p44", "Ankara smile", "fashion", 1600, 2133, "Fashion and lifestyle shoot", FASHION),
    ph("p65", "Just engaged", "events", 1600, 2400, "Proposal shoot", PIX + "weddingproposals/"),
    ph("p52", "Through the leaves", "fashion", 1080, 1350, "Fashion and lifestyle shoot", FASHION),
    ph("p04", "Convocation smiles", "portraits", 1200, 1600, "Convocation portrait", PIX),
    ph("p45", "Mid-kick", "fashion", 1600, 2000, "Fashion and lifestyle shoot", FASHION),
    ph("p26", "Mustard and cream", "fashion", 1600, 2133, "Fashion and lifestyle shoot", FASHION),
    ph("p69", "On the mic", "events", 1600, 1067, "Party coverage", PIX + "quadtopia/"),
    ph("p63", "Hands up", "fashion", 1600, 2133, "Fashion and lifestyle shoot", FASHION),
    ph("p56", "Blue shirt", "fashion", 1600, 2133, "Fashion and lifestyle shoot", FASHION),
    ph("p38", "At the podium", "events", 1600, 1280, "Conference coverage", PIX + "conferences/"),
    ph("p02", "Elegance", "portraits", 1200, 1600, "Portrait shoot", PIX),
    ph("p50", "Gold bag", "fashion", 1080, 1350, "Fashion and lifestyle shoot", FASHION),
    ph("p66", "The ring", "events", 1600, 2400, "Proposal shoot", PIX + "weddingproposals/"),
    ph("p46", "Black and white", "fashion", 1600, 2000, "Fashion and lifestyle shoot", FASHION),
    ph("p28", "Mosaic", "fashion", 1600, 2133, "Fashion and lifestyle shoot", FASHION),
    ph("p70", "Light sticks", "events", 1600, 1067, "Party coverage", PIX + "quadtopia/"),
    ph("p41", "Birthday candles", "portraits", 1600, 2400, "Birthday shoot", PIX + "tomisbirthday/"),
    ph("p57", "On the steps", "fashion", 1600, 2133, "Fashion and lifestyle shoot", FASHION),
    ph("p32", "Red bag", "fashion", 1600, 2133, "Fashion and lifestyle shoot", FASHION),
    ph("p64", "The yes", "events", 1600, 1067, "Proposal shoot", PIX + "weddingproposals/"),
    ph("p47", "Red shoes", "fashion", 1600, 2000, "Fashion and lifestyle shoot", FASHION),
    ph("p20", "Blue print", "fashion", 1600, 2133, "Fashion and lifestyle shoot", FASHION),
    ph("p37", "Done", "portraits", 1024, 1280, "Convocation 2026", PIX + "convocation2026/"),
    ph("p53", "In the green", "fashion", 1080, 1350, "Fashion and lifestyle shoot", FASHION),
    ph("p71", "In the crowd", "events", 1600, 1067, "Party coverage", PIX + "quadtopia/"),
    ph("p58", "Rail and mural", "fashion", 1600, 2133, "Fashion and lifestyle shoot", FASHION),
    ph("p62", "Green and jersey", "fashion", 1600, 2133, "Fashion and lifestyle shoot", FASHION),
    ph("p39", "On the panel", "events", 1600, 1067, "Conference coverage", PIX + "conferences/"),
    ph("p48", "White and denim", "fashion", 1600, 2000, "Fashion and lifestyle shoot", FASHION),
    ph("p06", "One degree hotter", "portraits", 1280, 1600, "Convocation portrait", PIX),
    ph("p67", "Laughing together", "events", 1600, 2400, "Proposal shoot", PIX + "weddingproposals/"),
    ph("p59", "Clutch", "fashion", 1600, 2133, "Fashion and lifestyle shoot", FASHION),
    ph("p51", "Print and blue", "fashion", 1350, 1080, "Fashion and lifestyle shoot", FASHION),
    ph("p72", "Hands in the air", "events", 1600, 1067, "Party coverage", PIX + "quadtopia/"),
    ph("p24", "Matching jerseys", "fashion", 1600, 2133, "Fashion and lifestyle shoot", FASHION),
    ph("p42", "Over the shoulder", "portraits", 1600, 2400, "Birthday shoot", PIX + "tomisbirthday/"),
    ph("p49", "The bag", "fashion", 1600, 2000, "Fashion and lifestyle shoot", FASHION),
    ph("p61", "Easy smile", "fashion", 1600, 2000, "Fashion and lifestyle shoot", FASHION),
    ph("p73", "Performer", "events", 1600, 1067, "Party coverage", PIX + "quadtopia/"),
    ph("p30", "Table for two", "fashion", 1600, 2133, "Fashion and lifestyle shoot", FASHION),
    ph("p03", "Remembered", "portraits", 1200, 1600, "Portrait shoot", PIX),
    ph("p54", "Leaves and denim", "fashion", 1080, 1350, "Fashion and lifestyle shoot", FASHION),
    ph("p60", "Detail", "fashion", 1600, 2133, "Fashion and lifestyle shoot", FASHION),
    ph("p74", "Behind the decks", "events", 1600, 1067, "Party coverage", PIX + "quadtopia/"),
    ph("p22", "Green on the chair", "fashion", 1600, 2133, "Fashion and lifestyle shoot", FASHION),
    ph("p43", "Under the arches", "portraits", 1600, 2400, "Birthday shoot", PIX + "tomisbirthday/"),
    ph("p29", "Street trio", "fashion", 1600, 2133, "Fashion and lifestyle shoot", FASHION),
    ph("p17", "Mustard skirt", "fashion", 1600, 2133, "Fashion and lifestyle shoot", FASHION),
    ph("p05", "Graduate", "portraits", 1200, 1600, "Convocation portrait", PIX),
    ph("p25", "Pink, seated", "fashion", 1600, 2133, "Fashion and lifestyle shoot", FASHION),
    ph("p31", "Jersey and denim", "fashion", 1600, 2133, "Fashion and lifestyle shoot", FASHION),
    ph("p07", "Scroll in hand", "portraits", 1280, 1600, "Convocation portrait", PIX),
    ph("p18", "Hands on the hat", "fashion", 1600, 2133, "Fashion and lifestyle shoot", FASHION),
    ph("p19", "Pink and denim", "fashion", 1600, 2133, "Fashion and lifestyle shoot", FASHION),
    ph("p08", "Outfit inspo", "fashion", 1279, 1600, "Fashion and lifestyle shoot", PIX),
  ],

  about: {
    photo: "/media/riah/me-portrait.jpg",
    working: ["/media/riah/me-shoot-1.jpg", "/media/riah/me-shoot-2.jpg"],
    lead: "I'm Seraiah, a photographer and videographer. I shoot fashion, portraits, convocations, events and documentary films.",
    text: [
      "I like to play with colour, so we plan the outfits and the location together and the photos come out bold and true to you.",
      "I work with creators, designers, brands and graduates, and I cover conferences and events from start to finish.",
    ],
    steps: [
      { name: "Message me", note: "Tell me the date, the place and what you want to shoot." },
      { name: "We plan it", note: "We agree the look, the outfits, the locations and the price." },
      { name: "Shoot day", note: "I shoot photos and video on the day, quick and relaxed." },
      { name: "You get it", note: "Edited photos and videos, ready to post." },
    ],
  },
};
