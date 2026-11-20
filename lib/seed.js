// Mock data. This file is server-only: `likedMe` must never be sent to the client.

const rows = [
  ["Aanya", 20, "Miranda House", "Reads in cafés, argues about the film afterwards.", ["cinema", "books", "coffee"]],
  ["Kabir", 22, "IIT Bombay", "Builds side projects. Finishes some of them.", ["coding", "football", "chai"]],
  ["Meera", 21, "Pune", "Weekend trekker, weekday overthinker.", ["trekking", "journaling", "indie music"]],
  ["Rohan", 23, "Bengaluru", "Product designer with strong opinions on fonts.", ["design", "running", "podcasts"]],
  ["Ishita", 19, "St. Stephen's College", "Debate society, dog person.", ["debate", "dogs", "poetry"]],
  ["Vihaan", 24, "Mumbai", "Stand-up open mics on Thursdays.", ["comedy", "guitar", "street food"]],
  ["Tara", 22, "Delhi University", "Paints walls and canvases.", ["art", "thrifting", "travel"]],
  ["Arjun", 21, "BITS Pilani", "Cricket, calculus, in that order.", ["cricket", "math", "gaming"]],
  ["Diya", 20, "Jaipur", "Matcha enthusiast. Ask about my playlist.", ["music", "matcha", "dance"]],
  ["Neil", 25, "Hyderabad", "Photographer chasing golden hour.", ["photography", "biryani", "cycling"]],
  ["Sana", 22, "Jamia Millia Islamia", "Future journalist, current chai addict.", ["writing", "news", "chai"]],
  ["Yash", 23, "Chandigarh", "Gym at 6am, memes at 6pm.", ["fitness", "memes", "road trips"]],
  ["Anika", 21, "Christ University", "Theatre kid for life.", ["theatre", "baking", "anime"]],
  ["Dev", 22, "NIT Trichy", "Robotics club president. Not a robot.", ["robotics", "chess", "hiking"]],
  ["Riya", 20, "Kolkata", "Old books, new playlists.", ["books", "adda", "photography"]],
  ["Samar", 24, "Gurugram", "Weekend chef, full-time analyst.", ["cooking", "finance", "badminton"]],
  ["Navya", 19, "Ashoka University", "Philosophy major. Ask me anything.", ["philosophy", "yoga", "poetry"]],
  ["Ishaan", 23, "Lucknow", "Qawwali nights and long drives.", ["music", "driving", "history"]],
  ["Zoya", 21, "Patna", "Home-town girl with big-city plans.", ["startups", "dance", "reading"]],
  ["Aditya", 22, "Ahmedabad", "CAT prep and cricket commentary.", ["cricket", "quizzing", "dosa"]],
  ["Kiara", 20, "Goa", "Surf, sunsets, sourdough.", ["surfing", "baking", "sunsets"]],
  ["Vivaan", 25, "Delhi", "Pub quiz regular. Trivia is a personality.", ["trivia", "coffee", "board games"]],
  ["Myra", 22, "Pune", "Illustrator with a sticker problem.", ["illustration", "stickers", "cats"]],
  ["Rahul", 21, "IIT Kanpur", "Sleeps through 9am classes, never through hackathons.", ["hackathons", "football", "sleep"]],
  ["Pari", 23, "Bengaluru", "Climbing gym regular.", ["climbing", "coffee", "travel"]],
  ["Aryan", 24, "Mumbai", "Film school dropout turned editor.", ["film", "editing", "vinyl"]],
  ["Simran", 20, "Amritsar", "Punjabi pop and parathas.", ["music", "food", "dance"]],
  ["Kunal", 22, "Ranchi", "Bikes, bonfires, bad puns.", ["biking", "camping", "puns"]],
  ["Tanvi", 21, "Mumbai", "Books first, brunch second.", ["books", "tennis", "brunch"]],
  ["Harsh", 23, "Patna", "UPSC aspirant who still makes time for cricket.", ["cricket", "politics", "history"]],
  ["Naina", 22, "Chennai", "Carnatic singer, K-drama watcher.", ["singing", "k-dramas", "filter coffee"]],
  ["Rudra", 24, "Jaipur", "Heritage walks and heritage biryani.", ["history", "food", "walking"]],
];

export const profiles = rows.map(([name, age, place, bio, interests], i) => ({
  id: i + 1,
  name,
  age,
  place,
  bio,
  interests,
  photo: `https://picsum.photos/seed/coy-${i + 1}/600/800`,
}));

// Profile ids that have already liked the logged-in user. Never expose this.
export const likedMe = [3, 7, 12, 15, 19, 24, 28, 31];
