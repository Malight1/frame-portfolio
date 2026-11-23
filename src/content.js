// Edit this file to change the site's content. Every page reads from here.
// Reels and photos are Riah's own posts from instagram.com/riah_visuals (collaboration posts credited below).
// PLACEHOLDER: the email address still needs confirming with Riah.
// Media lives in public/media/riah. Photos have three sizes: pNN-s.jpg (640), pNN-m.jpg (1100), pNN.jpg (1650).

export const SITE = {
  brand: "Riah Visuals",
  name: "Seraiah",
  role: "Mobile photographer and videographer",
  line: "Portraits, street style, convocations and short films, all shot on phone.",
  instagram: "https://www.instagram.com/riah_visuals/",
  handle: "@riah_visuals",
  email: "hello@riahvisuals.com",
  credit: "Official photographer for @fazzy_d_",

  kinds: [
    { id: "fashion", name: "Fashion & street style", short: "Fashion", line: "Outfit shoots and brand films for designers and creators, styled for the feed.",
      gets: ["Edited outfit photos, ready to post", "A short vertical reel of the look", "Location ideas and help with posing"], good: ["Creators and influencers", "Clothing brands and designers", "Lookbooks and new drops"], img: "/media/riah/p08", img2: "/media/riah/p12", video: "/media/riah/reel3-loop.mp4" },
    { id: "portraits", name: "Portraits & convocation", short: "Portraits", line: "Graduation and personal portraits that look like you on your best day.",
      gets: ["Edited portraits in full resolution", "Solo, friends or family shots", "Help with poses on the day"], good: ["Convocation and graduation", "Birthdays and milestones", "Profile and personal brand photos"], img: "/media/riah/p04", img2: "/media/riah/p02" },
    { id: "events", name: "Final-year week & events", short: "Events", line: "Theme days, birthdays and campus events, covered start to finish.",
      gets: ["Coverage from start to finish", "Edited photos of the day", "A short highlight reel"], good: ["Final-year week theme days", "Birthdays and parties", "Campus and community events"], img: "/media/riah/p14", img2: "/media/riah/p15" },
    { id: "films", name: "Short films & reels", short: "Films", line: "Cinematic short pieces, recreations and behind the scenes, made for Instagram.",
      gets: ["Idea and shot list planned together", "Filmed and edited for you", "Cut for Reels and TikTok"], good: ["Creative concepts and recreations", "Artists and music teasers", "Behind-the-scenes content"], img: "/media/riah/reel0", video: "/media/riah/reel0-loop.mp4" },
  ],

  // ratio is width/height of the source video
  reels: [
    { id: "brand-new-day", title: "Brand New Day, in UNILAG", kind: "films", length: "0:42", ratio: 1.77, video: "/media/riah/reel0.mp4", loop: "/media/riah/reel0-loop.mp4", poster: "/media/riah/reel0.jpg",
      note: "A recreation of the end-credit shots from Spider-Man: Brand New Day, filmed around campus.", post: "https://www.instagram.com/riah_visuals/reel/DdKeYptITB9/" },
    { id: "everyone-gets-fazzy", title: "Everyone gets Fazzy", kind: "fashion", length: "0:40", ratio: 1.78, video: "/media/riah/reel3.mp4", loop: "/media/riah/reel3-loop.mp4", poster: "/media/riah/reel3.jpg",
      note: "Fashion film for @fazzy_d_. Videography by Riah, directed and edited by @_wg.studios.", post: "https://www.instagram.com/_wg.studios/reel/DgDWMUZBrUU/" },
    { id: "this-very-day", title: "This very day", kind: "films", length: "0:58", ratio: .8, video: "/media/riah/reel1.mp4", loop: "/media/riah/reel1-loop.mp4", poster: "/media/riah/reel1.jpg",
      note: "A slow, sunlit day, filmed for the memories.", post: "https://www.instagram.com/riah_visuals/reel/DLFAkHdtoHE/" },
    { id: "bloopers", title: "Twenty takes of chaos", kind: "films", length: "1:29", ratio: .5625, video: "/media/riah/reel2.mp4", loop: "/media/riah/reel2-loop.mp4", poster: "/media/riah/reel2.jpg",
      note: "Behind every sharp frame is about twenty takes of pure chaos. A glimpse into the process.", post: "https://www.instagram.com/riah_visuals/reel/Dc3Hz8wN4wn/" },
  ],

  photos: [
    { src: "/media/riah/p08.jpg", thumb: "/media/riah/p08-s.jpg", title: "Outfit inspo", kind: "fashion", w: 1279, h: 1600, credit: "For @a_fareed_o, wearing @fazzy_d__", post: "https://www.instagram.com/a_fareed_o/p/DfNfm28Dmpn/" },
    { src: "/media/riah/p02.jpg", thumb: "/media/riah/p02-s.jpg", title: "Elegance", kind: "portraits", w: 1200, h: 1600, credit: "Portrait shoot", post: "https://www.instagram.com/riah_visuals/p/DbdJgsGDSBF/" },
    { src: "/media/riah/p10.jpg", thumb: "/media/riah/p10-s.jpg", title: "Less is more", kind: "fashion", w: 1280, h: 1600, credit: "For @a_fareed_o, wearing @fazzy_d__", post: "https://www.instagram.com/a_fareed_o/p/DeCv5-1jnA3/" },
    { src: "/media/riah/p04.jpg", thumb: "/media/riah/p04-s.jpg", title: "Convocation smiles", kind: "portraits", w: 1200, h: 1600, credit: "For @zaycupcake", post: "https://www.instagram.com/riah_visuals/p/Dau8Eg5jeIF/" },
    { src: "/media/riah/p14.jpg", thumb: "/media/riah/p14-s.jpg", title: "Final-year week, day two", kind: "events", w: 1200, h: 1600, credit: "For @mosmococo_", post: "https://www.instagram.com/mosmococo_/p/DagJT_iF5hu/" },
    { src: "/media/riah/p00.jpg", thumb: "/media/riah/p00-s.jpg", title: "Good fits", kind: "fashion", w: 1200, h: 1600, credit: "A casual day for @fareedthecreator", post: "https://www.instagram.com/riah_visuals/p/Dez5IkaDavf/" },
    { src: "/media/riah/p06.jpg", thumb: "/media/riah/p06-s.jpg", title: "One degree hotter", kind: "portraits", w: 1280, h: 1600, credit: "Convocation shoot with @irebabshots", post: "https://www.instagram.com/irebabshots/p/DT1GFuUjO9L/" },
    { src: "/media/riah/p12.jpg", thumb: "/media/riah/p12-s.jpg", title: "Black and white", kind: "fashion", w: 1200, h: 1600, credit: "For @a_fareed_o, wearing @fazzy_d__", post: "https://www.instagram.com/a_fareed_o/p/DdgawLFDvaG/" },
    { src: "/media/riah/p03.jpg", thumb: "/media/riah/p03-s.jpg", title: "Remembered", kind: "portraits", w: 1200, h: 1600, credit: "Portrait shoot", post: "https://www.instagram.com/riah_visuals/p/DbdJgsGDSBF/" },
    { src: "/media/riah/p09.jpg", thumb: "/media/riah/p09-s.jpg", title: "Mid-air", kind: "fashion", w: 1280, h: 1600, credit: "For @a_fareed_o, wearing @fazzy_d__", post: "https://www.instagram.com/a_fareed_o/p/DfNfm28Dmpn/" },
    { src: "/media/riah/p15.jpg", thumb: "/media/riah/p15-s.jpg", title: "Yeehaw", kind: "events", w: 1200, h: 1600, credit: "For @mosmococo_", post: "https://www.instagram.com/mosmococo_/p/DagJT_iF5hu/" },
    { src: "/media/riah/p05.jpg", thumb: "/media/riah/p05-s.jpg", title: "Graduate", kind: "portraits", w: 1200, h: 1600, credit: "For @zaycupcake", post: "https://www.instagram.com/riah_visuals/p/Dau8Eg5jeIF/" },
    { src: "/media/riah/p11.jpg", thumb: "/media/riah/p11-s.jpg", title: "Container days", kind: "fashion", w: 1206, h: 1600, credit: "For @a_fareed_o, wearing @fazzy_d__", post: "https://www.instagram.com/a_fareed_o/p/DeCv5-1jnA3/" },
    { src: "/media/riah/p07.jpg", thumb: "/media/riah/p07-s.jpg", title: "Scroll in hand", kind: "portraits", w: 1280, h: 1600, credit: "Convocation shoot with @irebabshots", post: "https://www.instagram.com/irebabshots/p/DT1GFuUjO9L/" },
    { src: "/media/riah/p01.jpg", thumb: "/media/riah/p01-s.jpg", title: "On the steps", kind: "fashion", w: 1200, h: 1600, credit: "A casual day for @fareedthecreator", post: "https://www.instagram.com/riah_visuals/p/Dez5IkaDavf/" },
    { src: "/media/riah/p13.jpg", thumb: "/media/riah/p13-s.jpg", title: "Leather weather", kind: "fashion", w: 1200, h: 1600, credit: "For @a_fareed_o, wearing @fazzy_d__", post: "https://www.instagram.com/a_fareed_o/p/DdgawLFDvaG/" },
  ],

  about: {
    photo: "/media/riah/profile.jpg",
    lead: "I'm Seraiah, and I shoot everything on my phone: portraits, street style, convocations and short films.",
    text: [
      "A phone lets me move fast, get close and stay out of the way, so people relax and the photos feel like them.",
      "I'm the official photographer for @fazzy_d_, and I shoot for creators, designers and graduates around campus and the city.",
    ],
    steps: [
      { name: "Message me", note: "Tell me the date, the place and what you want to shoot." },
      { name: "We plan it", note: "We agree the look, the outfits, the locations and the price." },
      { name: "Shoot day", note: "I shoot photos and video on the day, quick and relaxed." },
      { name: "You get it", note: "Edited photos and reels, ready to post." },
    ],
  },
};
