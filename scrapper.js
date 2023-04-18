const puppeteer = require('puppeteer');
const { SocksProxyAgent } = require('socks-proxy-agent');

(async () => {
  const torProxy = 'socks5://127.0.0.1:9050';
  const agent = new SocksProxyAgent(torProxy);

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      `--proxy-server=${torProxy}`,
    ],
  });

  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    req.continue({
      headers: {
        ...req.headers(),
        'Proxy-Authorization': agent.auth,
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
  });

  const customUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36';
  await page.setUserAgent(customUserAgent);

  const url1 = 'http://stniiomyjliimcgkvdszvgen3eaaoz55hreqqx6o77yvmpwt7gklffqd.onion/'; //Black Basta
  const url2 = 'http://lockbitapt2d73krlbewgv27tquljgxr33xbwwsp6rkyieto7u4ncead.onion/' //Lockbit

  // First URL
  await page.goto(url1, { waitUntil: 'networkidle2' });

  console.log('Basta News:');

  await page.waitForSelector('.card');

  const extractedData = await page.evaluate(() => {
    const cards = document.querySelectorAll('.card');
    const previews = [];

    for (let i = 0; i < Math.min(cards.length, 5); i++) {
      const card = cards[i];
      const previewContainer = card.querySelector('.preview_container');
      const previewText = previewContainer ? previewContainer.innerText.trim() : 'Element not found';
      previews.push({ previewText });
    }

    return previews;
  });

  extractedData.forEach((data, index) => {
    console.log(`Preview ${index + 1}: ${data.previewText}`);
  });

  // Second URL
  await page.goto(url2, { waitUntil: 'networkidle2' });

   console.log('LockBit News:');

  console.log('http://lockbitapt2d73krlbewgv27tquljgxr33xbwwsp6rkyieto7u4ncead.onion/');

  await page.waitForSelector('.post-title');

  const extractedPostTitles = await page.evaluate(() => {
    const postTitles = document.querySelectorAll('.post-title');
    const extractedTitles = [];

    for (let i = 0; i < Math.min(postTitles.length, 5); i++) {
      const title = postTitles[i].innerText.trim();
      extractedTitles.push(title);
    }

    return extractedTitles;
  });

  extractedPostTitles.forEach((title, index) => {
    console.log(`Post Title ${index + 1}: ${title}`);
  });

  await browser.close();
})();
