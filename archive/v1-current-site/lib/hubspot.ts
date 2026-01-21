// /lib/hubspot.ts
const HS_BASE = 'https://api.hubapi.com';

export async function hsUpsert({ token, contact, companyDomain, deal, payload }:{
  token: string,
  contact: { email: string, firstname?: string, lastname?: string },
  companyDomain?: string,
  deal: { name: string, pipeline: string, stage: string, amount?: number },
  payload: Record<string, any>
}) {
  const headers = { 
    'Content-Type': 'application/json', 
    'Authorization': `Bearer ${token}` 
  };

  try {
    console.log('Starting HubSpot integration for:', contact.email);
    console.log('HubSpot token (first 10 chars):', token.substring(0, 10) + '...');
    
    // Contact upsert (search first, then create if not found)
    const searchRes = await fetch(`${HS_BASE}/crm/v3/objects/contacts/search`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        filterGroups: [{
          filters: [{
            propertyName: 'email',
            operator: 'EQ',
            value: contact.email
          }]
        }]
      })
    });

    let contactId: string;
    const searchData = await searchRes.json();
    console.log('HubSpot contact search response:', searchRes.status, searchData);
    
    if (searchData.results && searchData.results.length > 0) {
      // Contact exists, update it
      contactId = searchData.results[0].id;
      await fetch(`${HS_BASE}/crm/v3/objects/contacts/${contactId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          properties: { 
            email: contact.email, 
            firstname: contact.firstname, 
            lastname: contact.lastname 
          }
        })
      });
    } else {
      // Create new contact
      const cRes = await fetch(`${HS_BASE}/crm/v3/objects/contacts`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          properties: { 
            email: contact.email, 
            firstname: contact.firstname, 
            lastname: contact.lastname 
          }
        })
      });
      const c = await cRes.json();
      if (!cRes.ok) {
        throw new Error(`HubSpot contact creation failed: ${JSON.stringify(c)}`);
      }
      contactId = c.id;
    }

    // Company (optional)
    let companyId: string | undefined;
    if (companyDomain) {
      const coRes = await fetch(`${HS_BASE}/crm/v3/objects/companies`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          properties: { 
            domain: companyDomain,
            name: companyDomain // Use domain as company name if no other name provided
          } 
        })
      });
      const co = await coRes.json();
      if (!coRes.ok) {
        console.warn(`HubSpot company creation failed: ${JSON.stringify(co)}`);
      } else {
        companyId = co.id;
        // Associate contact↔company
        await fetch(`${HS_BASE}/crm/v4/associations/companies/contacts/batch/create`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            inputs: [{ from: { id: companyId }, to: { id: contactId }, type: 'company_to_contact' }]
          })
        });
      }
    }

    // Deal
    const dRes = await fetch(`${HS_BASE}/crm/v3/objects/deals`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        properties: {
          dealname: deal.name,
          pipeline: deal.pipeline,
          dealstage: deal.stage,
          amount: deal.amount || 0
        }
      })
    });
    const d = await dRes.json();
    if (!dRes.ok) {
      throw new Error(`HubSpot deal creation failed: ${JSON.stringify(d)}`);
    }
    const dealId = d.id;

    // Associate deal↔contact
    await fetch(`${HS_BASE}/crm/v4/associations/deals/contacts/batch/create`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ 
        inputs: [{ from: { id: dealId }, to: { id: contactId }, type: 'deal_to_contact' }]
      })
    });

    // Associate deal↔company if company exists
    if (companyId) {
      await fetch(`${HS_BASE}/crm/v4/associations/deals/companies/batch/create`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          inputs: [{ from: { id: dealId }, to: { id: companyId }, type: 'deal_to_company' }]
        })
      });
    }

    // Log note with full intake payload + score
    const noteRes = await fetch(`${HS_BASE}/crm/v3/objects/notes`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        properties: { 
          hs_note_body: `Inbound intake:\n\`\`\`json\n${JSON.stringify(payload, null, 2)}\n\`\`\`` 
        }
      })
    });
    
    if (noteRes.ok) {
      const note = await noteRes.json();
      await fetch(`${HS_BASE}/crm/v4/associations/notes/deals/batch/create`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          inputs: [{ from: { id: note.id }, to: { id: dealId }, type: 'note_to_deal' }]
        })
      });
    }

    return { contactId, dealId, companyId };
  } catch (error) {
    console.error('HubSpot integration error:', error);
    throw error;
  }
}

export async function hsUpdateDealProps(token: string, dealId: string, props: Record<string, any>) {
  const headers = { 'Content-Type':'application/json', 'Authorization': `Bearer ${token}` };
  const res = await fetch(`${HS_BASE}/crm/v3/objects/deals/${dealId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ properties: props })
  });
  if (!res.ok) throw new Error(`HubSpot deal update failed: ${res.status}`);
  return res.json();
}

export async function hsUpdateContactProps(token: string, contactId: string, props: Record<string, any>) {
  const headers = { 'Content-Type':'application/json', 'Authorization': `Bearer ${token}` };
  const res = await fetch(`${HS_BASE}/crm/v3/objects/contacts/${contactId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ properties: props })
  });
  if (!res.ok) throw new Error(`HubSpot contact update failed: ${res.status}`);
  return res.json();
}

export async function hsCreateEngagementNote(token: string, body: string, dealId?: string, contactId?: string) {
  const headers = { 'Content-Type':'application/json', 'Authorization': `Bearer ${token}` };
  const res = await fetch(`${HS_BASE}/crm/v3/objects/notes`, {
    method:'POST',
    headers,
    body: JSON.stringify({ properties: { hs_note_body: body } })
  });
  const note = await res.json();

  const assocCalls: Promise<any>[] = [];
  if (dealId) {
    assocCalls.push(fetch(`${HS_BASE}/crm/v4/associations/notes/deals/batch/create`, {
      method:'POST', headers,
      body: JSON.stringify({ inputs:[{ from:{id:note.id}, to:{id:dealId}, type:'note_to_deal' }]})
    }));
  }
  if (contactId) {
    assocCalls.push(fetch(`${HS_BASE}/crm/v4/associations/notes/contacts/batch/create`, {
      method:'POST', headers,
      body: JSON.stringify({ inputs:[{ from:{id:note.id}, to:{id:contactId}, type:'note_to_contact' }]})
    }));
  }
  await Promise.all(assocCalls);
  return note;
}
