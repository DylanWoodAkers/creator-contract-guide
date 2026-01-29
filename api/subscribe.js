// Vercel Serverless Function - Email Signup via Resend
// API Key: re_3quFg5WX_PSSjJAJMUt7nF96P3kAvikrL

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, source } = req.body;

    if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Valid email required' });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_3quFg5WX_PSSjJAJMUt7nF96P3kAvikrL';

    // Email content - Red Flags Checklist
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Georgia, serif; line-height: 1.8; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; }
        h1 { font-size: 24px; margin-bottom: 20px; }
        h2 { font-size: 18px; color: #c62828; margin-top: 30px; margin-bottom: 10px; }
        .red-flag { background: #ffebee; border-left: 4px solid #c62828; padding: 15px; margin: 15px 0; }
        .green-box { background: #e8f5e9; border-left: 4px solid #2e7d32; padding: 15px; margin: 15px 0; }
        .cta { background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 20px; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #888; }
    </style>
</head>
<body>
    <h1>🚩 10 Contract Red Flags Every Creator Must Catch</h1>
    <p>Here's your checklist — the exact clauses that screw creators and what to demand instead.</p>

    <h2>🚩 #1: "Perpetual" or "Unlimited" Usage Rights</h2>
    <div class="red-flag">
        <strong>What it looks like:</strong> "Brand shall have perpetual, worldwide, unlimited rights to use the Content..."<br><br>
        <strong>Why it's dangerous:</strong> You're giving away your content forever. That "one TikTok" could become a TV ad.
    </div>
    <div class="green-box">
        <strong>✅ Demand instead:</strong> Specific platforms, time limits (30/90/365 days), organic vs paid specified separately.
    </div>

    <h2>🚩 #2: Hidden Whitelisting Permission</h2>
    <div class="red-flag">
        <strong>What it looks like:</strong> "...including the right to promote, advertise, or boost Content..."<br><br>
        <strong>Why it's dangerous:</strong> "Boost" = they can run paid ads using your face without extra pay.
    </div>
    <div class="green-box">
        <strong>✅ Demand instead:</strong> Whitelisting as separate line item with 2-3x organic rate.
    </div>

    <h2>🚩 #3: Vague Exclusivity</h2>
    <div class="red-flag">
        <strong>What it looks like:</strong> "Creator agrees not to work with competing brands..."<br><br>
        <strong>Why it's dangerous:</strong> What's a "competing brand"? Could lock you out of deals you didn't expect.
    </div>
    <div class="green-box">
        <strong>✅ Demand instead:</strong> Named specific competitors only, clear dates, premium rate (50-100%+).
    </div>

    <h2>🚩 #4: Exclusivity Outlasts the Deal</h2>
    <div class="red-flag">
        <strong>What it looks like:</strong> "...and for 12 months following the conclusion of the campaign."<br><br>
        <strong>Why it's dangerous:</strong> 2-week campaign with 12-month exclusivity = locked out for a year.
    </div>
    <div class="green-box">
        <strong>✅ Demand instead:</strong> Exclusivity matches content usage period, max 30-90 days post-campaign.
    </div>

    <h2>🚩 #5: No Revision Limits</h2>
    <div class="red-flag">
        <strong>What it looks like:</strong> "Creator shall make revisions as reasonably requested..."<br><br>
        <strong>Why it's dangerous:</strong> "Reasonable" is subjective. Could mean 10+ revision rounds.
    </div>
    <div class="green-box">
        <strong>✅ Demand instead:</strong> 2-3 revision rounds included, additional billed hourly.
    </div>

    <h2>🚩 #6: No Kill Fee</h2>
    <div class="red-flag">
        <strong>What it looks like:</strong> "Either party may terminate this Agreement at any time..."<br><br>
        <strong>Why it's dangerous:</strong> If they cancel after you've blocked time or started work — you get nothing.
    </div>
    <div class="green-box">
        <strong>✅ Demand instead:</strong> 50% kill fee before production, 100% after. Non-refundable deposit upfront.
    </div>

    <h2>🚩 #7: Payment "Upon Completion"</h2>
    <div class="red-flag">
        <strong>What it looks like:</strong> "Payment shall be made upon satisfactory completion..."<br><br>
        <strong>Why it's dangerous:</strong> Who decides "satisfactory"? Infinite leverage to delay payment.
    </div>
    <div class="green-box">
        <strong>✅ Demand instead:</strong> Net 15 or Net 30 from delivery date, late fee clause (1.5%/month).
    </div>

    <h2>🚩 #8: One-Sided Indemnification</h2>
    <div class="red-flag">
        <strong>What it looks like:</strong> "Creator shall indemnify and hold harmless Brand from any and all claims..."<br><br>
        <strong>Why it's dangerous:</strong> You're liable for everything — even things outside your control.
    </div>
    <div class="green-box">
        <strong>✅ Demand instead:</strong> Mutual indemnification, limited to your own actions, reasonable liability cap.
    </div>

    <h2>🚩 #9: "Derivative Works" Permission</h2>
    <div class="red-flag">
        <strong>What it looks like:</strong> "Brand may create derivative works based on the Content..."<br><br>
        <strong>Why it's dangerous:</strong> They can edit your content, Photoshop your face, remix without approval.
    </div>
    <div class="green-box">
        <strong>✅ Demand instead:</strong> Right to approve any edits, no substantive changes without consent.
    </div>

    <h2>🚩 #10: Assignment Without Consent</h2>
    <div class="red-flag">
        <strong>What it looks like:</strong> "Brand may assign this Agreement to any successor..."<br><br>
        <strong>Why it's dangerous:</strong> Your deal with Brand X becomes a deal with Brand Y without your input.
    </div>
    <div class="green-box">
        <strong>✅ Demand instead:</strong> Assignment requires written consent, or at minimum, notification + right to terminate.
    </div>

    <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;">

    <h2 style="color: #1976d2;">What To Do Next</h2>
    <p>Now that you know what to look for, you have two options:</p>
    <ol>
        <li><strong>Review brand contracts yourself</strong> using this checklist (Ctrl+F for the red flag words)</li>
        <li><strong>Start with creator-friendly terms</strong> — send your own contract instead of accepting theirs</li>
    </ol>

    <p>Most creators find option 2 easier. When you send your own contract, you control the terms from the start.</p>

    <a href="https://creatorcontracts.io/pricing?utm_source=checklist_email&utm_medium=email&utm_campaign=red_flags_lead_magnet" class="cta">See Creator Contract Templates →</a>

    <div class="footer">
        <p>You received this because you signed up at CreatorContractGuide.com</p>
        <p>© 2026 Creator Contract Guide</p>
    </div>
</body>
</html>
    `;

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Creator Contract Guide <checklist@mail.creatorcontracts.io>',
                to: email,
                subject: '🚩 Your 10 Contract Red Flags Checklist',
                html: emailHtml
            })
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Resend error:', error);
            return res.status(500).json({ error: 'Failed to send email' });
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
}
