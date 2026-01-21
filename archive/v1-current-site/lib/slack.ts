// /lib/slack.ts
export async function notifySlack(webhookUrl: string, payload: {
  score: number, vertical: string, name: string, email: string, org?: string,
  audienceBand?: string, moqBand?: string, timeline?: string, goals?: string[],
  outcome: 'BOOK'|'REVIEW'|'NURTURE', appointmentUrl?: string, hubspot?: { dealUrl?: string, contactUrl?: string },
  fitCategory?: string, fitMessage?: string
}) {
  const lines = [
    `:bolt: *New inbound (Score ${payload.score}) — ${payload.vertical}*`,
    `*Name:* ${payload.name} (${payload.email})`,
    payload.org ? `*Org:* ${payload.org} • audience: ${payload.audienceBand} • MOQ: ${payload.moqBand}` : undefined,
    `*Goals:* ${payload.goals?.join(', ') || '—'} • *Timeline:* ${payload.timeline}`,
    payload.fitCategory && payload.fitMessage ? `🧭 *Fit Insight:* ${payload.fitMessage}` : undefined,
    `*Next:* ${payload.outcome === 'BOOK' ? 'BOOK NOW' : payload.outcome === 'REVIEW' ? 'REVIEW NEEDED' : 'NURTURE'}`,
    payload.appointmentUrl ? `*Booking:* ${payload.appointmentUrl}` : undefined,
    payload.hubspot?.dealUrl ? `*HubSpot:* ${payload.hubspot.dealUrl}` : undefined
  ].filter(Boolean).join('\n');

  await fetch(webhookUrl, {
    method:'POST',
    headers:{ 'Content-Type':'application/json' },
    body: JSON.stringify({ text: lines })
  });
}

type ReviewPayload = {
  channelId?: string;
  score: number;
  tier: 'BOOK'|'REVIEW'|'NURTURE';
  org: string;
  vertical: string;
  audienceBand: string;
  moqBand: string;
  timeline: string;
  goals: string[];
  fitCategory: string;
  fitMessage: string;
  hubspotDealUrl: string; // include the full URL so we can parse dealId on reaction
};

export async function postReviewLeadToSlack(botToken: string, payload: ReviewPayload) {
  const headerEmoji = payload.tier === 'BOOK' ? ':large_green_circle:' : payload.tier === 'REVIEW' ? ':large_yellow_circle:' : ':large_blue_circle:';
  const text =
`${headerEmoji} *New Lead — Score ${payload.score} (${payload.tier} Tier)*

*Org:* ${payload.org}
*Type:* ${payload.vertical}
*Audience:* ${payload.audienceBand} • *MOQ:* ${payload.moqBand} • *Timeline:* ${payload.timeline}
*Goals:* ${payload.goals.length ? payload.goals.join(', ') : '—'}

🧭 *Fit Insight:*
${payload.fitMessage}

*Next Steps*
✅ Approve → BOOK
❌ Decline → NURTURE

HubSpot → ${payload.hubspotDealUrl}`;

  const blocks = [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": `New Lead — Score ${payload.score} (${payload.tier} Tier)`
      }
    },
    {
      "type": "section",
      "fields": [
        {
          "type": "mrkdwn",
          "text": `*Org:* ${payload.org}`
        },
        {
          "type": "mrkdwn",
          "text": `*Type:* ${payload.vertical}`
        },
        {
          "type": "mrkdwn",
          "text": `*Audience:* ${payload.audienceBand} • *MOQ:* ${payload.moqBand}`
        },
        {
          "type": "mrkdwn",
          "text": `*Timeline:* ${payload.timeline}`
        }
      ]
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `*Goals:* ${payload.goals.length ? payload.goals.join(', ') : '—'}`
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `🧭 *Fit Insight:*\n${payload.fitMessage}`
      }
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "✅ Approve"
          },
          "style": "primary",
          "action_id": "approve_lead",
          "value": payload.hubspotDealUrl
        },
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "❌ Decline"
          },
          "style": "danger",
          "action_id": "decline_lead",
          "value": payload.hubspotDealUrl
        }
      ]
    },
    {
      "type": "context",
      "elements": [
        {
          "type": "mrkdwn",
          "text": `HubSpot → ${payload.hubspotDealUrl}`
        }
      ]
    }
  ];

  const requestBody = {
    channel: payload.channelId || process.env.SLACK_REVIEW_CHANNEL_ID,
    text: `${headerEmoji} New Lead — Score ${payload.score} (${payload.tier} Tier)`, // fallback text
    blocks
  };

  console.log('Slack message request:', JSON.stringify(requestBody, null, 2));

  const res = await fetch('https://slack.com/api/chat.postMessage', {
    method:'POST',
    headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${botToken}` },
    body: JSON.stringify(requestBody)
  });
  
  const json = await res.json();
  console.log('Slack API response:', JSON.stringify(json, null, 2));
  
  if (!json.ok) throw new Error(`Slack post failed: ${json.error}`);
  return json; // contains ts and channel
}
