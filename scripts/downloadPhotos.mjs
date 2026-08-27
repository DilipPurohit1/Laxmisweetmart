import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const clientDir = path.join(process.cwd(), 'public', 'products');
const serverDir = path.join(process.cwd(), 'server', 'public', 'products');

if (!fs.existsSync(clientDir)) fs.mkdirSync(clientDir, { recursive: true });
if (!fs.existsSync(serverDir)) fs.mkdirSync(serverDir, { recursive: true });

// Curated high-resolution, authentic Indian mithai and savory food photographs
const photoSources = [
  {
    filename: 'kajukatli.jpg',
    url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Homemade_Kaju_Katli.jpg'
  },
  {
    filename: 'kajuroll.jpg',
    url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Homemade_Kaju_Katli.jpg'
  },
  {
    filename: 'gulabjamun.jpg',
    url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Gulab_Jamun_as_a_Diwali_Sweet.jpg'
  },
  {
    filename: 'motichoor.jpg',
    url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Laddu_preparation_for_Punjabi_wedding_06.jpg'
  },
  {
    filename: 'besanladdu.jpg',
    url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Laddu_preparation_for_Punjabi_wedding_06.jpg'
  },
  {
    filename: 'peda.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Kesar_peda.jpg',
    fallback: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80'
  },
  {
    filename: 'rasmalai.jpg',
    url: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Ras_Malai_2.JPG'
  },
  {
    filename: 'angoori.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Ras_Malai_2.JPG',
    fallback: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=800&q=80'
  },
  {
    filename: 'milkcake.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Kalakand_of_Salem.jpg',
    fallback: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80'
  },
  {
    filename: 'mixture.jpg',
    url: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80'
  },
  {
    filename: 'bhakarwadi.jpg',
    url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80'
  },
  {
    filename: 'cashews.jpg',
    url: 'https://images.unsplash.com/photo-1536591375315-1b836815777a?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/CASHEW_NUTS.jpg'
  },
  {
    filename: 'almonds.jpg',
    url: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://images.unsplash.com/photo-1536591375315-1b836815777a?auto=format&fit=crop&w=800&q=80'
  },
  {
    filename: 'bolinhas.jpg',
    url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80'
  },
  {
    filename: 'nankhatai.jpg',
    url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80'
  },
  {
    filename: 'ghee.jpg',
    url: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://images.unsplash.com/photo-1589927986086-3d10fb5555ca?auto=format&fit=crop&w=800&q=80'
  },
  {
    filename: 'paneer.jpg',
    url: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://images.unsplash.com/photo-1589927986086-3d10fb5555ca?auto=format&fit=crop&w=800&q=80'
  },
  {
    filename: 'hero-sweets.jpg',
    url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=85',
    fallback: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Homemade_Kaju_Katli.jpg'
  },
  {
    filename: 'placeholder.jpg',
    url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Homemade_Kaju_Katli.jpg'
  }
];

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    const get = (uri) => {
      const proto = uri.startsWith('https') ? https : http;
      proto.get(uri, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          get(res.headers.location);
          return;
        }
        if (res.statusCode !== 200) {
          file.close();
          fs.unlink(destPath, () => {});
          reject(new Error(`Failed with status ${res.statusCode}`));
          return;
        }
        res.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      }).on('error', (err) => {
        file.close();
        fs.unlink(destPath, () => {});
        reject(err);
      });
    };
    get(url);
  });
}

async function run() {
  console.log('Downloading real food photographs for all items...');
  for (const item of photoSources) {
    const clientPath = path.join(clientDir, item.filename);
    const serverPath = path.join(serverDir, item.filename);
    try {
      console.log(`Fetching ${item.filename}...`);
      await downloadFile(item.url, clientPath);
      // copy to server public
      fs.copyFileSync(clientPath, serverPath);
      console.log(`✓ Saved ${item.filename}`);
    } catch (err) {
      console.warn(`Fallback for ${item.filename}...`);
      try {
        await downloadFile(item.fallback, clientPath);
        fs.copyFileSync(clientPath, serverPath);
        console.log(`✓ Saved ${item.filename} (fallback)`);
      } catch (err2) {
        console.error(`✗ Failed ${item.filename}:`, err2.message);
      }
    }
  }
  console.log('All real photos downloaded successfully!');
}

run();
