// Vercel serverless function for lead capture
// Sends leads to Instantly campaign list

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, name, resource, source } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email required' });
  }

  // Add to Instantly
  const INSTANTLY_API_KEY = process.env.INSTANTLY_API_KEY;
  
  if (INSTANTLY_API_KEY) {
    try {
      // Get lead magnet campaign ID (create one named "Lead Magnets" in Instantly)
      const campaignRes = await fetch(
        `https://api.instantly.ai/api/v1/campaign/list?api_key=${INSTANTLY_API_KEY}`
      );
      const campaigns = await campaignRes.json();
      const leadMagnetCampaign = campaigns.find(c => c.name.toLowerCase().includes('lead magnet'));
      
      if (leadMagnetCampaign) {
        await fetch(`https://api.instantly.ai/api/v1/lead/add?api_key=${INSTANTLY_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            campaign_id: leadMagnetCampaign.id,
            leads: [{
              email,
              first_name: name?.split(' ')[0] || '',
              last_name: name?.split(' ').slice(1).join(' ') || '',
              custom_variables: {
                resource,
                source,
                download_date: new Date().toISOString()
              }
            }]
          })
        });
      }
    } catch (err) {
      console.error('Instantly API error:', err);
    }
  }

  // Log locally regardless
  console.log('Lead captured:', { email, name, resource, source, timestamp: new Date().toISOString() });

  return res.status(200).json({ success: true });
}
