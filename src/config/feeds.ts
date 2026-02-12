import type { Feed } from '@/types';

const SITE_VARIANT = import.meta.env.VITE_VARIANT || 'full';

// Helper to create RSS proxy URL (Vercel)
const rss = (url: string) => `/api/rss-proxy?url=${encodeURIComponent(url)}`;

// Source tier system for prioritization (lower = more authoritative)
// Tier 1: Wire services - fastest, most reliable breaking news
// Tier 2: Major outlets - high-quality journalism
// Tier 3: Specialty sources - domain expertise
// Tier 4: Aggregators & blogs - useful but less authoritative
export const SOURCE_TIERS: Record<string, number> = {
  // Tier 1 - Wire Services & Major Japan Media
  'Reuters': 1,
  'AP News': 1,
  'AFP': 1,
  'Bloomberg': 1,
  'Kyodo News': 1,
  'NHK World': 1,
  
  // Tier 2 - Major Japan Outlets
  'Japan Times': 2,
  'Nikkei Asia': 2,
  'Asahi Shimbun': 2,
  'Mainichi': 2,
  'BBC Asia': 2,
  'BBC World': 2,
  'Reuters Asia': 1,
  'Reuters Japan': 1,
  'Bloomberg Japan': 1,
  'Financial Times': 2,
  'The Diplomat': 2,
  'The Diplomat Japan': 2,

  // Tier 1 - Japanese Government & Regional Officials
  'MOFA Japan': 1,
  'Japan PM Office': 1,
  'Bank of Japan': 1,
  
  // Tier 2 - Regional & International
  'CSIS': 2,
  'Carnegie': 2,
  'Atlantic Council': 2,
  'Foreign Policy': 2,
  'Foreign Affairs': 2,
  
  // Tier 3 - Defense & Specialty
  'Defense News Japan': 3,
  'Janes Japan': 3,
  'Defense One': 3,
  'Breaking Defense': 3,
  'The War Zone': 3,
  'Janes': 3,
  'Bellingcat': 3,

  // Tier 3 - Japan Tech & Startups
  'Nikkei Tech': 2,
  'Japan Tech News': 3,
  'The Bridge (Japan)': 3,
  'Tech in Asia': 3,
  
  // Tier 2 - Regional Sources
  'South China Morning Post': 2,
  // LATAM
  'LATAM Tech News': 3,
  'Startups.co (LATAM)': 3,
  'Contxto (LATAM)': 3,
  'Brazil Tech News': 3,
  'Mexico Tech News': 3,
  'LATAM Fintech': 3,
  // Africa & MENA
  'Disrupt Africa': 3,
  'Wamda (MENA)': 3,
  'Magnitt': 3,

  // Tier 3 - Think Tanks
  'Brookings Tech': 3,
  'CSIS Tech': 3,
  'MIT Tech Policy': 3,
  'Stanford HAI': 2,
  'AI Now Institute': 3,
  'OECD Digital': 2,
  'Bruegel (EU)': 3,
  'Chatham House Tech': 3,
  'ISEAS (Singapore)': 3,
  'ORF Tech (India)': 3,
  'RIETI (Japan)': 3,
  'Lowy Institute': 3,
  'China Tech Analysis': 3,
  'DigiChina': 2,

  // Tier 3 - Policy Sources
  'Politico Tech': 2,
  'AI Regulation': 3,
  'Tech Antitrust': 3,
  'EFF News': 3,
  'EU Digital Policy': 3,
  'Euractiv Digital': 3,
  'EU Commission Digital': 2,
  'China Tech Policy': 3,
  'UK Tech Policy': 3,
  'India Tech Policy': 3,

  // Tier 2-3 - Podcasts & Newsletters
  'Acquired Podcast': 2,
  'All-In Podcast': 2,
  'a16z Podcast': 2,
  'This Week in Startups': 3,
  'The Twenty Minute VC': 2,
  'Lex Fridman Tech': 3,
  'The Vergecast': 3,
  'Decoder (Verge)': 3,
  'Hard Fork (NYT)': 2,
  'Pivot (Vox)': 2,
  'Benedict Evans': 2,
  'The Pragmatic Engineer': 2,
  'Lenny Newsletter': 2,
  'AI Podcast (NVIDIA)': 3,
  'Gradient Dissent': 3,
  'Eye on AI': 3,
  'How I Built This': 2,
  'Masters of Scale': 2,
  'The Pitch': 3,

  // Tier 4 - Aggregators
  'Hacker News': 4,
  'The Verge': 4,
  'The Verge AI': 4,
  'VentureBeat AI': 4,
  'Yahoo Finance': 4,
  'TechCrunch Layoffs': 4,
  'ArXiv AI': 4,
  'AI News': 4,
  'Layoffs News': 4,
};

export function getSourceTier(sourceName: string): number {
  return SOURCE_TIERS[sourceName] ?? 4; // Default to tier 4 if unknown
}

export type SourceType = 'wire' | 'gov' | 'intel' | 'mainstream' | 'market' | 'tech' | 'other';

export const SOURCE_TYPES: Record<string, SourceType> = {
  // Wire services - fastest, most authoritative
  'Reuters': 'wire', 'Reuters World': 'wire', 'Reuters Business': 'wire',
  'AP News': 'wire', 'AFP': 'wire', 'Bloomberg': 'wire',

  // Government & International Org sources
  'White House': 'gov', 'State Dept': 'gov', 'Pentagon': 'gov',
  'Treasury': 'gov', 'DOJ': 'gov', 'DHS': 'gov', 'CDC': 'gov',
  'FEMA': 'gov', 'Federal Reserve': 'gov', 'SEC': 'gov',
  'UN News': 'gov', 'CISA': 'gov',

  // Intel/Defense specialty
  'Defense One': 'intel', 'Breaking Defense': 'intel', 'The War Zone': 'intel',
  'Defense News': 'intel', 'Janes': 'intel', 'Bellingcat': 'intel', 'Krebs Security': 'intel',
  'Foreign Policy': 'intel', 'The Diplomat': 'intel',
  'Atlantic Council': 'intel', 'Foreign Affairs': 'intel',
  'CrisisWatch': 'intel',
  'CSIS': 'intel', 'RAND': 'intel', 'Brookings': 'intel', 'Carnegie': 'intel',
  'IAEA': 'gov', 'WHO': 'gov', 'UNHCR': 'gov',
  'Xinhua': 'wire', 'TASS': 'wire',

  // Mainstream outlets
  'BBC World': 'mainstream', 'BBC Middle East': 'mainstream',
  'Guardian World': 'mainstream', 'Guardian ME': 'mainstream',
  'NPR News': 'mainstream', 'Al Jazeera': 'mainstream',
  'CNN World': 'mainstream', 'Politico': 'mainstream',

  // Market/Finance
  'CNBC': 'market', 'MarketWatch': 'market', 'Yahoo Finance': 'market',
  'Financial Times': 'market',

  // Tech
  'Hacker News': 'tech', 'Ars Technica': 'tech', 'The Verge': 'tech',
  'The Verge AI': 'tech', 'MIT Tech Review': 'tech', 'TechCrunch Layoffs': 'tech',
  'AI News': 'tech', 'ArXiv AI': 'tech', 'VentureBeat AI': 'tech',
  'Layoffs.fyi': 'tech', 'Layoffs News': 'tech',

  // Regional Tech Startups
  'EU Startups': 'tech', 'Tech.eu': 'tech', 'Sifted (Europe)': 'tech',
  'The Next Web': 'tech', 'Tech in Asia': 'tech', 'e27 (SEA)': 'tech',
  'DealStreetAsia': 'tech', 'Pandaily (China)': 'tech', '36Kr English': 'tech',
  'TechNode (China)': 'tech', 'The Bridge (Japan)': 'tech', 'Nikkei Tech': 'tech',
  'Inc42 (India)': 'tech', 'YourStory': 'tech', 'TechCabal (Africa)': 'tech',
  'Disrupt Africa': 'tech', 'Wamda (MENA)': 'tech', 'Magnitt': 'tech',

  // Think Tanks & Policy
  'Brookings Tech': 'intel', 'CSIS Tech': 'intel', 'Stanford HAI': 'intel',
  'AI Now Institute': 'intel', 'OECD Digital': 'intel', 'Bruegel (EU)': 'intel',
  'Chatham House Tech': 'intel', 'DigiChina': 'intel', 'Lowy Institute': 'intel',
  'EFF News': 'intel', 'Politico Tech': 'intel',

  // Podcasts & Newsletters
  'Acquired Podcast': 'tech', 'All-In Podcast': 'tech', 'a16z Podcast': 'tech',
  'This Week in Startups': 'tech', 'The Twenty Minute VC': 'tech',
  'Hard Fork (NYT)': 'tech', 'Pivot (Vox)': 'tech', 'Stratechery': 'tech',
  'Benedict Evans': 'tech', 'How I Built This': 'tech', 'Masters of Scale': 'tech',
};

export function getSourceType(sourceName: string): SourceType {
  return SOURCE_TYPES[sourceName] ?? 'other';
}

// Propaganda risk assessment for sources (Quick Win #5)
// 'high' = State-controlled media, known to push government narratives
// 'medium' = State-affiliated or known editorial bias toward specific governments
// 'low' = Independent journalism with editorial standards
export type PropagandaRisk = 'low' | 'medium' | 'high';

export interface SourceRiskProfile {
  risk: PropagandaRisk;
  stateAffiliated?: string;
  knownBiases?: string[];
  note?: string;
}

export const SOURCE_PROPAGANDA_RISK: Record<string, SourceRiskProfile> = {
  // High risk - State-controlled media
  'Xinhua': { risk: 'high', stateAffiliated: 'China', note: 'Official CCP news agency' },
  'TASS': { risk: 'high', stateAffiliated: 'Russia', note: 'Russian state news agency' },
  'RT': { risk: 'high', stateAffiliated: 'Russia', note: 'Russian state media, banned in EU' },
  'Sputnik': { risk: 'high', stateAffiliated: 'Russia', note: 'Russian state media' },
  'CGTN': { risk: 'high', stateAffiliated: 'China', note: 'Chinese state broadcaster' },
  'Press TV': { risk: 'high', stateAffiliated: 'Iran', note: 'Iranian state media' },
  'KCNA': { risk: 'high', stateAffiliated: 'North Korea', note: 'North Korean state media' },

  // Medium risk - State-affiliated or known bias
  'Al Jazeera': { risk: 'medium', stateAffiliated: 'Qatar', note: 'Qatari state-funded, independent editorial' },
  'Al Arabiya': { risk: 'medium', stateAffiliated: 'Saudi Arabia', note: 'Saudi-owned, reflects Gulf perspective' },
  'TRT World': { risk: 'medium', stateAffiliated: 'Turkey', note: 'Turkish state broadcaster' },
  'France 24': { risk: 'medium', stateAffiliated: 'France', note: 'French state-funded, editorially independent' },
  'DW News': { risk: 'medium', stateAffiliated: 'Germany', note: 'German state-funded, editorially independent' },
  'Voice of America': { risk: 'medium', stateAffiliated: 'USA', note: 'US government-funded' },
  'Kyiv Independent': { risk: 'medium', knownBiases: ['Pro-Ukraine'], note: 'Ukrainian perspective on Russia-Ukraine war' },
  'Moscow Times': { risk: 'medium', knownBiases: ['Anti-Kremlin'], note: 'Independent, critical of Russian government' },

  // Low risk - Independent with editorial standards (explicit)
  'Reuters': { risk: 'low', note: 'Wire service, strict editorial standards' },
  'AP News': { risk: 'low', note: 'Wire service, nonprofit cooperative' },
  'AFP': { risk: 'low', note: 'Wire service, editorially independent' },
  'BBC World': { risk: 'low', note: 'Public broadcaster, editorial independence charter' },
  'BBC Middle East': { risk: 'low', note: 'Public broadcaster, editorial independence charter' },
  'Guardian World': { risk: 'low', knownBiases: ['Center-left'], note: 'Scott Trust ownership, no shareholders' },
  'Financial Times': { risk: 'low', note: 'Business focus, Nikkei-owned' },
  'Bellingcat': { risk: 'low', note: 'Open-source investigations, methodology transparent' },
};

export function getSourcePropagandaRisk(sourceName: string): SourceRiskProfile {
  return SOURCE_PROPAGANDA_RISK[sourceName] ?? { risk: 'low' };
}

export function isStateAffiliatedSource(sourceName: string): boolean {
  const profile = SOURCE_PROPAGANDA_RISK[sourceName];
  return !!profile?.stateAffiliated;
}

const FULL_FEEDS: Record<string, Feed[]> = {
  japan: [
    { name: 'NHK World', url: rss('https://www3.nhk.or.jp/nhkworld/en/news/rss.xml') },
    { name: 'Japan Times', url: rss('https://www.japantimes.co.jp/feed/') },
    { name: 'Nikkei Asia', url: rss('https://news.google.com/rss/search?q=site:asia.nikkei.com+Japan+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Kyodo News', url: rss('https://news.google.com/rss/search?q=site:english.kyodonews.net+when:1d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Mainichi', url: rss('https://news.google.com/rss/search?q=site:mainichi.jp+english+when:1d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Asahi Shimbun', url: rss('https://news.google.com/rss/search?q=site:asahi.com+english+when:1d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Japan News', url: rss('https://news.google.com/rss/search?q=Japan+news+when:1d&hl=en-US&gl=US&ceid=US:en') },
  ],
  politics: [
    { name: 'Japan PM Office', url: rss('https://news.google.com/rss/search?q=site:kantei.go.jp+OR+"Japanese+government"+OR+Diet+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'MOFA Japan', url: rss('https://news.google.com/rss/search?q=site:mofa.go.jp+OR+"Japanese+Ministry"+"Foreign+Affairs"+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Japan Politics', url: rss('https://news.google.com/rss/search?q=(Kishida+OR+LDP+OR+"Liberal+Democratic+Party"+OR+Japanese+government)+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'The Diplomat Japan', url: rss('https://news.google.com/rss/search?q=site:thediplomat.com+Japan+when:3d&hl=en-US&gl=US&ceid=US:en') },
  ],
  defense: [
    { name: 'Japan Defense', url: rss('https://news.google.com/rss/search?q=(JSDF+OR+"Japan+Self-Defense+Forces"+OR+"Japan+defense"+OR+"Japanese+military")+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'US Forces Japan', url: rss('https://news.google.com/rss/search?q=("US+Forces+Japan"+OR+USFJ+OR+Okinawa+base+OR+Kadena+OR+Futenma)+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Defense News Japan', url: rss('https://news.google.com/rss/search?q=site:defensenews.com+Japan+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Janes Japan', url: rss('https://news.google.com/rss/search?q=site:janes.com+Japan+when:7d&hl=en-US&gl=US&ceid=US:en') },
  ],
  regional: [
    { name: 'China-Japan', url: rss('https://news.google.com/rss/search?q=(China+Japan+OR+Senkaku+OR+"East+China+Sea"+OR+"Sino-Japanese")+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'North Korea Japan', url: rss('https://news.google.com/rss/search?q=("North+Korea"+Japan+OR+DPRK+Japan+OR+missile+Japan)+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Taiwan Strait', url: rss('https://news.google.com/rss/search?q=(Taiwan+strait+OR+"Taiwan+crisis"+OR+PLA+exercises)+Japan+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Korea-Japan', url: rss('https://news.google.com/rss/search?q=("South+Korea"+Japan+OR+Korea+Japan+OR+GSOMIA)+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Russia-Japan', url: rss('https://news.google.com/rss/search?q=(Russia+Japan+OR+"Northern+Territories"+OR+Kuril+islands)+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Reuters Asia', url: rss('https://news.google.com/rss/search?q=site:reuters.com+(Japan+OR+Taiwan+OR+Korea+OR+China)+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'BBC Asia', url: rss('https://feeds.bbci.co.uk/news/world/asia/rss.xml') },
  ],
  economy: [
    { name: 'Bank of Japan', url: rss('https://news.google.com/rss/search?q=("Bank+of+Japan"+OR+BOJ+OR+Japanese+yen+OR+JPY)+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Tokyo Stock Exchange', url: rss('https://news.google.com/rss/search?q=(Nikkei+225+OR+"Tokyo+Stock+Exchange"+OR+TSE+OR+TOPIX)+when:1d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Japanese Economy', url: rss('https://news.google.com/rss/search?q=("Japanese+economy"+OR+"Japan+GDP"+OR+"Japan+trade")+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Nikkei Business', url: rss('https://news.google.com/rss/search?q=site:asia.nikkei.com+business+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Reuters Japan', url: rss('https://news.google.com/rss/search?q=site:reuters.com+Japan+economy+business+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Bloomberg Japan', url: rss('https://news.google.com/rss/search?q=site:bloomberg.com+Japan+when:2d&hl=en-US&gl=US&ceid=US:en') },
  ],
  tech: [
    { name: 'Japan Tech', url: rss('https://news.google.com/rss/search?q=(Japan+technology+OR+Japanese+tech+OR+Sony+OR+Nintendo+OR+SoftBank+OR+Rakuten)+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Nikkei Tech', url: rss('https://news.google.com/rss/search?q=site:asia.nikkei.com+technology+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'The Bridge Japan', url: rss('https://news.google.com/rss/search?q=site:thebridge.jp+OR+"The+Bridge+Japan"+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Japan Startups', url: rss('https://news.google.com/rss/search?q=(Japan+startup+OR+"Japanese+startup"+OR+Japan+unicorn)+funding+when:7d&hl=en-US&gl=US&ceid=US:en') },
  ],
  disaster: [
    { name: 'Earthquake Japan', url: rss('https://news.google.com/rss/search?q=(Japan+earthquake+OR+tsunami+OR+seismic)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Typhoon Japan', url: rss('https://news.google.com/rss/search?q=(Japan+typhoon+OR+cyclone+OR+storm)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Fukushima', url: rss('https://news.google.com/rss/search?q=(Fukushima+OR+TEPCO+OR+"nuclear+Japan"+OR+Daiichi)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Japan Weather', url: rss('https://news.google.com/rss/search?q=Japan+weather+disaster+warning+when:3d&hl=en-US&gl=US&ceid=US:en') },
  ],
  society: [
    { name: 'Japan Society', url: rss('https://news.google.com/rss/search?q=(Japan+aging+OR+"Japanese+society"+OR+demographics+OR+immigration)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Japan Culture', url: rss('https://news.google.com/rss/search?q=(Japan+culture+OR+anime+OR+manga+OR+"Japanese+tradition")+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Tokyo News', url: rss('https://news.google.com/rss/search?q=Tokyo+city+OR+Osaka+OR+Kyoto+when:3d&hl=en-US&gl=US&ceid=US:en') },
  ],
  intl: [
    { name: 'Foreign Policy Japan', url: rss('https://news.google.com/rss/search?q=site:foreignpolicy.com+Japan+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Carnegie Japan', url: rss('https://news.google.com/rss/search?q=site:carnegieendowment.org+Japan+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'CSIS Japan', url: rss('https://news.google.com/rss/search?q=site:csis.org+Japan+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Atlantic Council Japan', url: rss('https://news.google.com/rss/search?q=site:atlanticcouncil.org+Japan+when:7d&hl=en-US&gl=US&ceid=US:en') },
  ],
};

// Tech/AI variant feeds
const TECH_FEEDS: Record<string, Feed[]> = {
  tech: [
    { name: 'TechCrunch', url: rss('https://techcrunch.com/feed/') },
    { name: 'The Verge', url: rss('https://www.theverge.com/rss/index.xml') },
    { name: 'Ars Technica', url: rss('https://feeds.arstechnica.com/arstechnica/technology-lab') },
    { name: 'Hacker News', url: rss('https://hnrss.org/frontpage') },
    { name: 'MIT Tech Review', url: rss('https://www.technologyreview.com/feed/') },
    { name: 'ZDNet', url: rss('https://www.zdnet.com/news/rss.xml') },
    { name: 'TechMeme', url: rss('https://www.techmeme.com/feed.xml') },
    { name: 'Engadget', url: rss('https://www.engadget.com/rss.xml') },
    { name: 'Fast Company', url: rss('https://feeds.feedburner.com/fastcompany/headlines') },
  ],
  ai: [
    { name: 'AI News', url: rss('https://news.google.com/rss/search?q=(OpenAI+OR+Anthropic+OR+Google+AI+OR+"large+language+model"+OR+ChatGPT+OR+Claude+OR+"AI+model")+when:2d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'VentureBeat AI', url: rss('https://venturebeat.com/category/ai/feed/') },
    { name: 'The Verge AI', url: rss('https://www.theverge.com/rss/ai-artificial-intelligence/index.xml') },
    { name: 'MIT Tech Review AI', url: rss('https://www.technologyreview.com/topic/artificial-intelligence/feed') },
    { name: 'MIT Research', url: rss('https://news.mit.edu/rss/research') },
    { name: 'ArXiv AI', url: rss('https://export.arxiv.org/rss/cs.AI') },
    { name: 'ArXiv ML', url: rss('https://export.arxiv.org/rss/cs.LG') },
    { name: 'AI Weekly', url: rss('https://news.google.com/rss/search?q="artificial+intelligence"+OR+"machine+learning"+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Anthropic News', url: rss('https://news.google.com/rss/search?q=Anthropic+Claude+AI+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'OpenAI News', url: rss('https://news.google.com/rss/search?q=OpenAI+ChatGPT+GPT-4+when:7d&hl=en-US&gl=US&ceid=US:en') },
  ],
  startups: [
    { name: 'TechCrunch Startups', url: rss('https://techcrunch.com/category/startups/feed/') },
    { name: 'VentureBeat', url: rss('https://venturebeat.com/feed/') },
    { name: 'Crunchbase News', url: rss('https://news.crunchbase.com/feed/') },
    { name: 'SaaStr', url: rss('https://www.saastr.com/feed/') },
    { name: 'AngelList News', url: rss('https://news.google.com/rss/search?q=site:angellist.com+OR+"AngelList"+funding+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'TechCrunch Venture', url: rss('https://techcrunch.com/category/venture/feed/') },
    { name: 'The Information', url: rss('https://news.google.com/rss/search?q=site:theinformation.com+startup+OR+funding+when:3d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Fortune Term Sheet', url: rss('https://news.google.com/rss/search?q="Term+Sheet"+venture+capital+OR+startup+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'PitchBook News', url: rss('https://news.google.com/rss/search?q=site:pitchbook.com+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'CB Insights', url: rss('https://www.cbinsights.com/research/feed/') },
  ],
  vcblogs: [
    { name: 'Y Combinator Blog', url: rss('https://www.ycombinator.com/blog/rss/') },
    { name: 'a16z Blog', url: rss('https://news.google.com/rss/search?q=site:a16z.com+OR+"Andreessen+Horowitz"+blog+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Sequoia Blog', url: rss('https://www.sequoiacap.com/feed/') },
    { name: 'Paul Graham Essays', url: rss('https://news.google.com/rss/search?q="Paul+Graham"+essay+OR+blog+when:30d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'VC Insights', url: rss('https://news.google.com/rss/search?q=("venture+capital"+insights+OR+"VC+trends"+OR+"startup+advice")+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Lenny\'s Newsletter', url: rss('https://www.lennysnewsletter.com/feed') },
    { name: 'Stratechery', url: rss('https://stratechery.com/feed/') },
    { name: 'FwdStart Newsletter', url: '/api/fwdstart' },
  ],
  regionalStartups: [
    // Europe
    { name: 'EU Startups', url: rss('https://www.eu-startups.com/feed/') },
    { name: 'Tech.eu', url: rss('https://tech.eu/feed/') },
    { name: 'Sifted (Europe)', url: rss('https://sifted.eu/feed') },
    { name: 'The Next Web', url: rss('https://news.google.com/rss/search?q=site:thenextweb.com+when:7d&hl=en-US&gl=US&ceid=US:en') },
    // Asia - General
    { name: 'Tech in Asia', url: rss('https://www.techinasia.com/feed') },
    { name: 'KrASIA', url: rss('https://news.google.com/rss/search?q=site:kr-asia.com+OR+KrASIA+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'SEA Startups', url: rss('https://news.google.com/rss/search?q=(Singapore+OR+Indonesia+OR+Vietnam+OR+Thailand+OR+Malaysia)+startup+funding+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Asia VC News', url: rss('https://news.google.com/rss/search?q=("Southeast+Asia"+OR+ASEAN)+venture+capital+OR+funding+when:7d&hl=en-US&gl=US&ceid=US:en') },
    // China
    { name: 'China Startups', url: rss('https://news.google.com/rss/search?q=China+startup+funding+OR+"Chinese+startup"+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: '36Kr English', url: rss('https://news.google.com/rss/search?q=site:36kr.com+OR+"36Kr"+startup+china+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'China Tech Giants', url: rss('https://news.google.com/rss/search?q=(Alibaba+OR+Tencent+OR+ByteDance+OR+Baidu+OR+JD.com+OR+Xiaomi+OR+Huawei)+when:3d&hl=en-US&gl=US&ceid=US:en') },
    // Japan
    { name: 'Japan Startups', url: rss('https://news.google.com/rss/search?q=Japan+startup+funding+OR+"Japanese+startup"+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Japan Tech News', url: rss('https://news.google.com/rss/search?q=(Japan+startup+OR+Japan+tech+OR+SoftBank+OR+Rakuten+OR+Sony)+funding+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Nikkei Tech', url: rss('https://news.google.com/rss/search?q=site:asia.nikkei.com+technology+when:3d&hl=en-US&gl=US&ceid=US:en') },
    // Korea
    { name: 'Korea Tech News', url: rss('https://news.google.com/rss/search?q=(Korea+startup+OR+Korean+tech+OR+Samsung+OR+Kakao+OR+Naver+OR+Coupang)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Korea Startups', url: rss('https://news.google.com/rss/search?q=Korea+startup+funding+OR+"Korean+unicorn"+when:7d&hl=en-US&gl=US&ceid=US:en') },
    // India
    { name: 'Inc42 (India)', url: rss('https://inc42.com/feed/') },
    { name: 'YourStory', url: rss('https://yourstory.com/feed') },
    { name: 'India Startups', url: rss('https://news.google.com/rss/search?q=India+startup+funding+OR+"Indian+startup"+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'India Tech News', url: rss('https://news.google.com/rss/search?q=(Flipkart+OR+Razorpay+OR+Zerodha+OR+Zomato+OR+Paytm+OR+PhonePe)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    // Southeast Asia
    { name: 'SEA Tech News', url: rss('https://news.google.com/rss/search?q=(Grab+OR+GoTo+OR+Sea+Limited+OR+Shopee+OR+Tokopedia)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Vietnam Tech', url: rss('https://news.google.com/rss/search?q=Vietnam+startup+OR+Vietnam+tech+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Indonesia Tech', url: rss('https://news.google.com/rss/search?q=Indonesia+startup+OR+Indonesia+tech+when:7d&hl=en-US&gl=US&ceid=US:en') },
    // Taiwan
    { name: 'Taiwan Tech', url: rss('https://news.google.com/rss/search?q=(Taiwan+startup+OR+TSMC+OR+MediaTek+OR+Foxconn)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    // Latin America
    { name: 'LAVCA (LATAM)', url: rss('https://lavca.org/feed/') },
    { name: 'LATAM Startups', url: rss('https://news.google.com/rss/search?q=("Latin+America"+startup+OR+LATAM+funding)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Startups LATAM', url: rss('https://news.google.com/rss/search?q=(startup+Brazil+OR+startup+Mexico+OR+startup+Argentina+OR+startup+Colombia+OR+startup+Chile)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Brazil Tech', url: rss('https://news.google.com/rss/search?q=(Nubank+OR+iFood+OR+Mercado+Libre+OR+Rappi+OR+VTEX)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'FinTech LATAM', url: rss('https://news.google.com/rss/search?q=fintech+(Brazil+OR+Mexico+OR+Argentina+OR+"Latin+America")+when:7d&hl=en-US&gl=US&ceid=US:en') },
    // Africa
    { name: 'TechCabal (Africa)', url: rss('https://techcabal.com/feed/') },
    { name: 'Disrupt Africa', url: rss('https://news.google.com/rss/search?q=site:disrupt-africa.com+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Africa Startups', url: rss('https://news.google.com/rss/search?q=Africa+startup+funding+OR+"African+startup"+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Africa Tech News', url: rss('https://news.google.com/rss/search?q=(Flutterwave+OR+Paystack+OR+Jumia+OR+Andela+OR+"Africa+startup")+when:7d&hl=en-US&gl=US&ceid=US:en') },
    // Middle East
    { name: 'MENA Startups', url: rss('https://news.google.com/rss/search?q=(MENA+startup+OR+"Middle+East"+funding+OR+Gulf+startup)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'MENA Tech News', url: rss('https://news.google.com/rss/search?q=(UAE+startup+OR+Saudi+tech+OR+Dubai+startup+OR+NEOM+tech)+when:7d&hl=en-US&gl=US&ceid=US:en') },
  ],
  github: [
    { name: 'GitHub Blog', url: rss('https://github.blog/feed/') },
    { name: 'GitHub Trending', url: rss('https://mshibanami.github.io/GitHubTrendingRSS/daily/all.xml') },
    { name: 'Show HN', url: rss('https://hnrss.org/show') },
    { name: 'YC Launches', url: rss('https://hnrss.org/launches') },
    { name: 'Dev Events', url: rss('https://dev.events/rss.xml') },
    { name: 'Open Source News', url: rss('https://news.google.com/rss/search?q="open+source"+project+release+OR+launch+when:3d&hl=en-US&gl=US&ceid=US:en') },
  ],
  ipo: [
    { name: 'IPO News', url: rss('https://news.google.com/rss/search?q=(IPO+OR+"initial+public+offering"+OR+SPAC)+tech+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Renaissance IPO', url: rss('https://news.google.com/rss/search?q=site:renaissancecapital.com+IPO+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Tech IPO News', url: rss('https://news.google.com/rss/search?q=tech+IPO+OR+"tech+company"+IPO+when:7d&hl=en-US&gl=US&ceid=US:en') },
  ],
  funding: [
    { name: 'SEC Filings', url: rss('https://news.google.com/rss/search?q=(S-1+OR+"IPO+filing"+OR+"SEC+filing")+startup+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'VC News', url: rss('https://news.google.com/rss/search?q=("Series+A"+OR+"Series+B"+OR+"Series+C"+OR+"funding+round"+OR+"venture+capital")+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Seed & Pre-Seed', url: rss('https://news.google.com/rss/search?q=("seed+round"+OR+"pre-seed"+OR+"angel+round"+OR+"seed+funding")+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Startup Funding', url: rss('https://news.google.com/rss/search?q=("startup+funding"+OR+"raised+funding"+OR+"raised+$"+OR+"funding+announced")+when:7d&hl=en-US&gl=US&ceid=US:en') },
  ],
  producthunt: [
    { name: 'Product Hunt', url: rss('https://www.producthunt.com/feed') },
  ],
  outages: [
    { name: 'AWS Status', url: rss('https://news.google.com/rss/search?q=AWS+outage+OR+"Amazon+Web+Services"+down+when:1d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Cloud Outages', url: rss('https://news.google.com/rss/search?q=(Azure+OR+GCP+OR+Cloudflare+OR+Slack+OR+GitHub)+outage+OR+down+when:1d&hl=en-US&gl=US&ceid=US:en') },
  ],
  security: [
    { name: 'Krebs Security', url: rss('https://krebsonsecurity.com/feed/') },
    { name: 'The Hacker News', url: rss('https://feeds.feedburner.com/TheHackersNews') },
    { name: 'Dark Reading', url: rss('https://www.darkreading.com/rss.xml') },
    { name: 'Schneier', url: rss('https://www.schneier.com/feed/') },
  ],
  policy: [
    // US Policy
    { name: 'Politico Tech', url: rss('https://rss.politico.com/technology.xml') },
    { name: 'AI Regulation', url: rss('https://news.google.com/rss/search?q=AI+regulation+OR+"artificial+intelligence"+law+OR+policy+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Tech Antitrust', url: rss('https://news.google.com/rss/search?q=tech+antitrust+OR+FTC+Google+OR+FTC+Apple+OR+FTC+Amazon+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'EFF News', url: rss('https://news.google.com/rss/search?q=site:eff.org+OR+"Electronic+Frontier+Foundation"+when:14d&hl=en-US&gl=US&ceid=US:en') },
    // EU Digital Policy
    { name: 'EU Digital Policy', url: rss('https://news.google.com/rss/search?q=("Digital+Services+Act"+OR+"Digital+Markets+Act"+OR+"EU+AI+Act"+OR+"GDPR")+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Euractiv Digital', url: rss('https://news.google.com/rss/search?q=site:euractiv.com+digital+OR+tech+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'EU Commission Digital', url: rss('https://news.google.com/rss/search?q=site:ec.europa.eu+digital+OR+technology+when:14d&hl=en-US&gl=US&ceid=US:en') },
    // China Tech Policy
    { name: 'China Tech Policy', url: rss('https://news.google.com/rss/search?q=(China+tech+regulation+OR+China+AI+policy+OR+MIIT+technology)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    // UK Policy
    { name: 'UK Tech Policy', url: rss('https://news.google.com/rss/search?q=(UK+AI+safety+OR+"Online+Safety+Bill"+OR+UK+tech+regulation)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    // India Policy
    { name: 'India Tech Policy', url: rss('https://news.google.com/rss/search?q=(India+tech+regulation+OR+India+data+protection+OR+India+AI+policy)+when:7d&hl=en-US&gl=US&ceid=US:en') },
  ],
  thinktanks: [
    // US Think Tanks
    { name: 'Brookings Tech', url: rss('https://news.google.com/rss/search?q=site:brookings.edu+technology+OR+AI+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'CSIS Tech', url: rss('https://news.google.com/rss/search?q=site:csis.org+technology+OR+AI+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'MIT Tech Policy', url: rss('https://news.google.com/rss/search?q=site:techpolicypress.org+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Stanford HAI', url: rss('https://news.google.com/rss/search?q=site:hai.stanford.edu+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'AI Now Institute', url: rss('https://news.google.com/rss/search?q=site:ainowinstitute.org+when:14d&hl=en-US&gl=US&ceid=US:en') },
    // Europe Think Tanks
    { name: 'OECD Digital', url: rss('https://news.google.com/rss/search?q=site:oecd.org+digital+OR+AI+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'EU Tech Policy', url: rss('https://news.google.com/rss/search?q=("EU+tech+policy"+OR+"European+digital"+OR+Bruegel+tech)+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Chatham House Tech', url: rss('https://news.google.com/rss/search?q=site:chathamhouse.org+technology+OR+AI+when:14d&hl=en-US&gl=US&ceid=US:en') },
    // Asia Think Tanks
    { name: 'ISEAS (Singapore)', url: rss('https://news.google.com/rss/search?q=site:iseas.edu.sg+technology+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'ORF Tech (India)', url: rss('https://news.google.com/rss/search?q=(India+tech+policy+OR+ORF+technology+OR+"Observer+Research+Foundation"+tech)+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'RIETI (Japan)', url: rss('https://news.google.com/rss/search?q=site:rieti.go.jp+technology+when:30d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Asia Pacific Tech', url: rss('https://news.google.com/rss/search?q=("Asia+Pacific"+tech+policy+OR+"Lowy+Institute"+technology)+when:14d&hl=en-US&gl=US&ceid=US:en') },
    // China Research (External Views)
    { name: 'China Tech Analysis', url: rss('https://news.google.com/rss/search?q=("China+tech+strategy"+OR+"Chinese+AI"+OR+"China+semiconductor")+analysis+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'DigiChina', url: rss('https://news.google.com/rss/search?q=site:digichina.stanford.edu+when:14d&hl=en-US&gl=US&ceid=US:en') },
  ],
  finance: [
    { name: 'CNBC Tech', url: rss('https://www.cnbc.com/id/19854910/device/rss/rss.html') },
    { name: 'MarketWatch Tech', url: rss('https://feeds.marketwatch.com/marketwatch/topstories/') },
    { name: 'Yahoo Finance', url: rss('https://finance.yahoo.com/rss/topstories') },
    { name: 'Seeking Alpha Tech', url: rss('https://seekingalpha.com/market_currents.xml') },
  ],
  hardware: [
    { name: "Tom's Hardware", url: rss('https://www.tomshardware.com/feeds/all') },
    { name: 'SemiAnalysis', url: rss('https://www.semianalysis.com/feed') },
    { name: 'Semiconductor News', url: rss('https://news.google.com/rss/search?q=semiconductor+OR+chip+OR+TSMC+OR+NVIDIA+OR+Intel+when:3d&hl=en-US&gl=US&ceid=US:en') },
  ],
  cloud: [
    { name: 'InfoQ', url: rss('https://feed.infoq.com/') },
    { name: 'The New Stack', url: rss('https://thenewstack.io/feed/') },
    { name: 'DevOps.com', url: rss('https://devops.com/feed/') },
  ],
  dev: [
    { name: 'Dev.to', url: rss('https://dev.to/feed') },
    { name: 'Lobsters', url: rss('https://lobste.rs/rss') },
    { name: 'Changelog', url: rss('https://changelog.com/feed') },
  ],
  layoffs: [
    { name: 'Layoffs.fyi', url: rss('https://news.google.com/rss/search?q=tech+layoffs+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'TechCrunch Layoffs', url: rss('https://techcrunch.com/tag/layoffs/feed/') },
  ],
  unicorns: [
    { name: 'Unicorn News', url: rss('https://news.google.com/rss/search?q=("unicorn+startup"+OR+"unicorn+valuation"+OR+"$1+billion+valuation")+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'CB Insights Unicorn', url: rss('https://news.google.com/rss/search?q=site:cbinsights.com+unicorn+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Decacorn News', url: rss('https://news.google.com/rss/search?q=("decacorn"+OR+"$10+billion+valuation"+OR+"$10B+valuation")+startup+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'New Unicorns', url: rss('https://news.google.com/rss/search?q=("becomes+unicorn"+OR+"joins+unicorn"+OR+"reaches+unicorn"+OR+"achieved+unicorn")+when:14d&hl=en-US&gl=US&ceid=US:en') },
  ],
  accelerators: [
    { name: 'Techstars News', url: rss('https://news.google.com/rss/search?q=Techstars+accelerator+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: '500 Global News', url: rss('https://news.google.com/rss/search?q="500+Global"+OR+"500+Startups"+accelerator+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Demo Day News', url: rss('https://news.google.com/rss/search?q=("demo+day"+OR+"YC+batch"+OR+"accelerator+batch")+startup+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Startup School', url: rss('https://news.google.com/rss/search?q="Startup+School"+OR+"YC+Startup+School"+when:14d&hl=en-US&gl=US&ceid=US:en') },
  ],
  podcasts: [
    // Tech Podcast Episodes (via Google News - podcast hosts block RSS proxies)
    { name: 'Acquired Episodes', url: rss('https://news.google.com/rss/search?q="Acquired+podcast"+episode+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'All-In Podcast', url: rss('https://news.google.com/rss/search?q="All-In+podcast"+(Chamath+OR+Sacks+OR+Friedberg)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'a16z Insights', url: rss('https://news.google.com/rss/search?q=("a16z"+OR+"Andreessen+Horowitz")+podcast+OR+interview+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'TWIST Episodes', url: rss('https://news.google.com/rss/search?q="This+Week+in+Startups"+Jason+Calacanis+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: '20VC Episodes', url: rss('https://news.google.com/rss/search?q="20+Minute+VC"+Harry+Stebbings+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Lex Fridman Tech', url: rss('https://news.google.com/rss/search?q=("Lex+Fridman"+interview)+(AI+OR+tech+OR+startup+OR+CEO)+when:7d&hl=en-US&gl=US&ceid=US:en') },
    // Tech Media Shows
    { name: 'Verge Shows', url: rss('https://news.google.com/rss/search?q=("Vergecast"+OR+"Decoder+podcast"+Verge)+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Hard Fork (NYT)', url: rss('https://news.google.com/rss/search?q="Hard+Fork"+podcast+NYT+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Pivot Podcast', url: rss('https://news.google.com/rss/search?q="Pivot+podcast"+(Kara+Swisher+OR+Scott+Galloway)+when:14d&hl=en-US&gl=US&ceid=US:en') },
    // Newsletters
    { name: 'Tech Newsletters', url: rss('https://news.google.com/rss/search?q=("Benedict+Evans"+OR+"Pragmatic+Engineer"+OR+Stratechery)+tech+when:14d&hl=en-US&gl=US&ceid=US:en') },
    // AI Podcasts & Shows
    { name: 'AI Podcasts', url: rss('https://news.google.com/rss/search?q=("AI+podcast"+OR+"artificial+intelligence+podcast")+episode+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'AI Interviews', url: rss('https://news.google.com/rss/search?q=(NVIDIA+OR+OpenAI+OR+Anthropic+OR+DeepMind)+interview+OR+podcast+when:14d&hl=en-US&gl=US&ceid=US:en') },
    // Startup Shows
    { name: 'How I Built This', url: rss('https://news.google.com/rss/search?q="How+I+Built+This"+Guy+Raz+when:14d&hl=en-US&gl=US&ceid=US:en') },
    { name: 'Startup Podcasts', url: rss('https://news.google.com/rss/search?q=("Masters+of+Scale"+OR+"The+Pitch+podcast"+OR+"startup+podcast")+episode+when:14d&hl=en-US&gl=US&ceid=US:en') },
  ],
};

// Variant-aware exports
export const FEEDS = SITE_VARIANT === 'tech' ? TECH_FEEDS : FULL_FEEDS;

export const INTEL_SOURCES: Feed[] = [
  // Japan Defense & Security (Tier 1)
  { name: 'Defense News Japan', url: rss('https://news.google.com/rss/search?q=site:defensenews.com+Japan+when:7d&hl=en-US&gl=US&ceid=US:en'), type: 'defense' },
  { name: 'Janes Japan', url: rss('https://news.google.com/rss/search?q=site:janes.com+Japan+when:7d&hl=en-US&gl=US&ceid=US:en'), type: 'defense' },
  { name: 'Breaking Defense Asia', url: rss('https://news.google.com/rss/search?q=site:breakingdefense.com+(Japan+OR+Asia+OR+Indo-Pacific)+when:7d&hl=en-US&gl=US&ceid=US:en'), type: 'defense' },
  { name: 'Defense One Japan', url: rss('https://news.google.com/rss/search?q=site:defenseone.com+Japan+when:7d&hl=en-US&gl=US&ceid=US:en'), type: 'defense' },
  { name: 'The War Zone Pacific', url: rss('https://news.google.com/rss/search?q=site:thedrive.com/the-war-zone+(Japan+OR+"Indo-Pacific"+OR+Taiwan)+when:7d&hl=en-US&gl=US&ceid=US:en'), type: 'defense' },

  // Regional Think Tanks & Analysis (Tier 2)
  { name: 'CSIS Japan', url: rss('https://news.google.com/rss/search?q=site:csis.org+Japan+when:7d&hl=en-US&gl=US&ceid=US:en'), type: 'intl' },
  { name: 'Carnegie Japan', url: rss('https://news.google.com/rss/search?q=site:carnegieendowment.org+Japan+when:7d&hl=en-US&gl=US&ceid=US:en'), type: 'research' },
  { name: 'Atlantic Council Japan', url: rss('https://news.google.com/rss/search?q=site:atlanticcouncil.org+Japan+when:7d&hl=en-US&gl=US&ceid=US:en'), type: 'intl' },
  { name: 'Foreign Policy Japan', url: rss('https://news.google.com/rss/search?q=site:foreignpolicy.com+Japan+when:7d&hl=en-US&gl=US&ceid=US:en'), type: 'intl' },
  { name: 'Foreign Affairs Asia', url: rss('https://news.google.com/rss/search?q=site:foreignaffairs.com+(Japan+OR+Asia+OR+"East+Asia")+when:14d&hl=en-US&gl=US&ceid=US:en'), type: 'intl' },
  { name: 'Brookings Asia', url: rss('https://news.google.com/rss/search?q=site:brookings.edu+(Japan+OR+Asia+OR+China)+when:14d&hl=en-US&gl=US&ceid=US:en'), type: 'research' },
  { name: 'RAND Asia', url: rss('https://news.google.com/rss/search?q=site:rand.org+(Japan+OR+Asia+OR+"Pacific")+when:14d&hl=en-US&gl=US&ceid=US:en'), type: 'research' },
  
  // Regional Security (Tier 2)
  { name: 'Chatham House Asia', url: rss('https://news.google.com/rss/search?q=site:chathamhouse.org+(Japan+OR+Asia)+when:14d&hl=en-US&gl=US&ceid=US:en'), type: 'intl' },
  { name: 'The Diplomat', url: rss('https://thediplomat.com/feed/'), type: 'intl' },
  
  // OSINT & Cyber (Tier 2)
  { name: 'Bellingcat', url: rss('https://www.bellingcat.com/feed/'), type: 'osint' },
  { name: 'Krebs Security', url: rss('https://krebsonsecurity.com/feed/'), type: 'cyber' },
];

// Keywords that trigger alert status - Japan-specific and regional threats
export const ALERT_KEYWORDS = [
  'war', 'invasion', 'military', 'nuclear', 'sanctions', 'missile',
  'airstrike', 'drone strike', 'troops deployed', 'armed conflict', 'bombing', 'casualties',
  'ceasefire', 'peace treaty', 'nato', 'coup', 'martial law',
  'assassination', 'terrorist', 'terror attack', 'cyber attack', 'hostage', 'evacuation order',
  // Japan-specific
  'j-alert', 'earthquake', 'tsunami', 'typhoon', 'senkaku', 'diaoyu',
  'north korea missile', 'dprk missile', 'territorial waters', 'incursion',
  'jsdf', 'self-defense forces', 'futenma', 'kadena', 'okinawa base',
  'northern territories', 'kuril', 'taiwan strait crisis',
];

// Patterns that indicate non-alert content (lifestyle, entertainment, etc.)
export const ALERT_EXCLUSIONS = [
  'protein', 'couples', 'relationship', 'dating', 'diet', 'fitness',
  'recipe', 'cooking', 'shopping', 'fashion', 'celebrity', 'movie',
  'tv show', 'sports', 'game', 'concert', 'festival', 'wedding',
  'vacation', 'travel tips', 'life hack', 'self-care', 'wellness',
];
