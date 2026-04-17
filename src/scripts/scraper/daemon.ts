import { chromium } from 'playwright-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';
import { sendSmsNotification } from '../../lib/twilio-client';
import dotenv from 'dotenv';
import fs from 'fs';

// Load environment variables locally
dotenv.config();

// Enable stealth plugin to bypass Cloudflare
chromium.use(stealthPlugin());

const TARGET_PHONE_NUMBER = "+16476085348";

// Maintain a very naive cache of seen ads (in-memory or file) to avoid duplicate texting.
let seenUrls = new Set<string>();

async function scrapeLeolist() {
  console.log(`[${new Date().toISOString()}] Starting scraping job...`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  try {
    console.log('Navigating to LeoList Central Ontario...');
    await page.goto('https://www.leolist.cc/personals/female-escorts/central-ontario', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000); // Wait for Cloudflare/Age Gate

    console.log('Checking for Age Gate...');
    const enterButton = await page.$('a:has-text("ENTER SITE"), a:has-text("I agree"), :text("ENTER SITE")');
    if (enterButton) {
      console.log('Found Age Gate, clicking...');
      await enterButton.click();
      await page.waitForTimeout(3000);
    }

    // Looking for a typical ad link
    const adLinks = await page.$$('.mainlist-item a, .post-title a, a.title');
    let selectedHref: string | null = null;
    
    if (adLinks.length > 0) {
      selectedHref = await adLinks[0].getAttribute('href');
    } else {
      console.log('Class selector failed, looking at all links to find an ad URL heuristic...');
      const allA = await page.$$('a');
      for (const a of allA) {
        const href = await a.getAttribute('href');
        if (href && href.includes('/personals/female-escorts/central-ontario/') && !href.includes('?page=')) {
          selectedHref = href;
          break;
        }
      }
    }

    if (selectedHref) {
      let fullUrl = selectedHref.startsWith('http') ? selectedHref : `https://www.leolist.cc${selectedHref}`;
      console.log(`Found ad link: ${fullUrl}.`);

      if (!seenUrls.has(fullUrl)) {
        console.log('This is a newly detected ad! Sending SMS notification...');
        seenUrls.add(fullUrl);
        await sendSmsNotification(
          TARGET_PHONE_NUMBER,
          `New Leolist Ad Found!\n\nLink: ${fullUrl}\nTime: ${new Date().toLocaleTimeString()}`
        );

        // Limit memory leak, max 100 urls
        if (seenUrls.size > 100) {
          seenUrls = new Set(Array.from(seenUrls).slice(-50));
        }

        // Navigate to grab details
        await page.goto(fullUrl, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(5000); 

        const title = await page.title();
        console.log('Title extracted:', title);

        // Optionally, one day you can add Prisma here to save the data securely:
        // await prisma.listing.create({ data: { url: fullUrl, title } });
      } else {
        console.log('Ad was already seen previously. Skipping SMS...');
      }

    } else {
      console.log('Could not find any ad links. The page structure might be different or Cloudflare blocked us.');
    }
  } catch (err) {
    console.error('Error during scraping task:', err);
  } finally {
    await browser.close();
    console.log(`[${new Date().toISOString()}] Finished scraping job.`);
  }
}

// Run immediately, then every 30 minutes
console.log("Starting Daemon Wrapper...");
scrapeLeolist();
setInterval(scrapeLeolist, 30 * 60 * 1000);
