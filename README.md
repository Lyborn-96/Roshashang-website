# Roshashang website: go-live guide

Same setup as VioletTech and Lane BB:

- **Domain and DNS**: HostAfrica
- **Website**: GitHub Pages (free)
- **Email**: Zoho Mail
- **Contact form**: FormSubmit (free), which emails each request to info@roshashang.co.za with the recording attached (up to 10 MB) and sends the client an automatic reply

| Setting | File |
| --- | --- |
| WhatsApp number | `site.js`: `WHATSAPP_NUMBER = '27820485072'` (082 048 5072) |
| Form destination | `contact.html`: `action="https://formsubmit.co/info@roshashang.co.za"` |
| Custom domain | `CNAME`: `roshashang.co.za` |

---

## 0. Get these first

- [ ] Approval to move roshashang.co.za from Deovolent to HostAfrica. The domain's registered contact approves the transfer email, and Deovolent may need to unlock it.
- [ ] From Deovolent: the old mail server's name or IP address, and each mailbox's password (to copy old emails into Zoho).
- [ ] The list of mailboxes Roshashang wants (for example info@).

## 1. Transfer the domain to HostAfrica

1. hostafrica.co.za → **Domains → Transfer** → `roshashang.co.za` (.co.za transfers are free; renewal is R109 a year).
2. Approve the transfer email. When it completes, the domain uses HostAfrica's nameservers, and DNS is managed in the client area under **Domains → roshashang.co.za → DNS Management**.
3. **Before** the transfer completes, add the Zoho and GitHub records from steps 2 and 3, so email and the website switch over together.

## 2. Zoho Mail

1. zoho.com/mail → **Business Email** → sign up → **Add an existing domain** → `roshashang.co.za`.
   - Forever Free: up to 5 users, 5 GB each, Zoho webmail and app only.
   - Mail Lite (paid): for Outlook or a phone's own mail app.
2. Add these in HostAfrica DNS Management:

   | Type | Host | Value | Priority |
   | --- | --- | --- | --- |
   | TXT | @ | zoho-verification=… (from Zoho) | |
   | MX | @ | mx.zoho.com | 10 |
   | MX | @ | mx2.zoho.com | 20 |
   | MX | @ | mx3.zoho.com | 50 |
   | TXT | @ | v=spf1 include:zohomail.com ~all | |
   | TXT | _dmarc | v=DMARC1; p=none; rua=mailto:info@roshashang.co.za | |

   Remove any other MX records, and keep only one `v=spf1` record. If Zoho's console shows different MX values for your region, use Zoho's.
3. **Verify** in Zoho, create the mailboxes, then add DKIM: Zoho admin console → Domains → Email configuration → DKIM → Add selector `zmail` → add the TXT record (Host `zmail._domainkey`) in HostAfrica → **Verify**.
4. **Old emails**: Zoho admin console → **Data Migration → IMAP** → server = the old Deovolent mail server name or IP address, port 993, SSL → add each mailbox with its old password → Start.

## 3. GitHub Pages

1. github.com → **New repository** → `roshashang-website` → **Public** (GitHub Pages on a free account needs a public repo) → Create.
2. **Add file → Upload files** → upload everything in this folder (including `CNAME` and `.nojekyll`; on a Mac press Cmd+Shift+. to show hidden files) → **Commit changes**.
3. Repository **Settings → Pages** → Source **Deploy from a branch** → Branch **main** / **(root)** → Save.
4. Under **Custom domain** enter `roshashang.co.za` → Save.
5. In HostAfrica DNS Management add:

   | Type | Host | Value |
   | --- | --- | --- |
   | A | @ | 185.199.108.153 |
   | A | @ | 185.199.109.153 |
   | A | @ | 185.199.110.153 |
   | A | @ | 185.199.111.153 |
   | CNAME | www | lyborn-96.github.io |

   Delete any older A record for @ and any old www record.
6. Once GitHub shows the DNS check as successful (minutes to a few hours), tick **Enforce HTTPS**.

## 4. Activate the contact form

1. Open https://roshashang.co.za/contact and send a test request.
2. FormSubmit emails info@roshashang.co.za asking to confirm. Click **Activate**.
3. FormSubmit then sends a random string. In GitHub, edit `contact.html` and replace `info@roshashang.co.za` in `action="https://formsubmit.co/info@roshashang.co.za"` with that string, so the email address isn't visible in the page code → Commit.
4. Send another test with a small recording. info@ gets the request as a table with the file attached, and the sender gets the automatic reply.

## 5. Final checks, then close Deovolent

- [ ] https://roshashang.co.za and https://www.roshashang.co.za show the new site; all pages load
- [ ] WhatsApp button opens a chat with 082 048 5072
- [ ] Contact form arrives in info@ (check spam the first time)
- [ ] Email to and from info@ works in Zoho, and old emails are migrated
- [ ] Then cancel the Deovolent hosting

## Making changes later

Edit the file on GitHub → Commit. GitHub Pages republishes within a minute or two.
