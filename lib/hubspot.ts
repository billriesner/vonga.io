/**
 * HubSpot CRM Integration
 * Creates contacts and deals from lead form submissions
 */

import { Client } from "@hubspot/api-client";

const hubspotClient = process.env.HUBSPOT_ACCESS_TOKEN
  ? new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN })
  : null;

export interface LeadData {
  name: string;
  email: string;
  organization: string;
  role?: string;
  message?: string;
}

/**
 * Parse full name into first and last name
 */
function parseName(fullName: string): { firstname: string; lastname: string } {
  const parts = fullName.trim().split(" ");
  if (parts.length === 1) {
    return { firstname: parts[0], lastname: "" };
  }
  const firstname = parts[0];
  const lastname = parts.slice(1).join(" ");
  return { firstname, lastname };
}

/**
 * Create or update a contact in HubSpot
 */
export async function createHubSpotContact(data: LeadData) {
  if (!hubspotClient) {
    console.warn("HubSpot client not initialized. Skipping contact creation.");
    return null;
  }

  try {
    const { firstname, lastname } = parseName(data.name);

    // Create contact properties
    const properties: Record<string, string> = {
      email: data.email,
      firstname,
      lastname,
      company: data.organization,
      hs_lead_status: "NEW",
    };

    // Add optional fields
    if (data.role) {
      properties.jobtitle = data.role;
    }

    // Create or update contact
    const response = await hubspotClient.crm.contacts.basicApi.create({
      properties,
      associations: [],
    });

    console.log("HubSpot contact created:", response.id);

    // Add message as a note if provided
    if (data.message) {
      await createContactNote(response.id, data.message);
    }

    return response;
  } catch (error: any) {
    // If contact already exists, update it
    if (error.body?.category === "CONFLICT") {
      console.log("Contact already exists, attempting to update...");
      try {
        const { firstname, lastname } = parseName(data.name);
        const properties: Record<string, string> = {
          firstname,
          lastname,
          company: data.organization,
        };
        if (data.role) {
          properties.jobtitle = data.role;
        }

        const updateResponse = await hubspotClient.crm.contacts.basicApi.update(
          error.body.id,
          { properties }
        );

        // Add message as note
        if (data.message) {
          await createContactNote(error.body.id, data.message);
        }

        return updateResponse;
      } catch (updateError) {
        console.error("Error updating HubSpot contact:", updateError);
        throw updateError;
      }
    }

    console.error("Error creating HubSpot contact:", error);
    throw error;
  }
}

/**
 * Create a note on a contact
 */
async function createContactNote(contactId: string, message: string) {
  if (!hubspotClient) return;

  try {
    await hubspotClient.crm.objects.notes.basicApi.create({
      properties: {
        hs_note_body: `Lead Form Message:\n\n${message}`,
        hs_timestamp: Date.now().toString(),
      },
      associations: [
        {
          to: { id: contactId },
          types: [
            {
              associationCategory: "HUBSPOT_DEFINED",
              associationTypeId: 202, // Note to Contact
            },
          ],
        },
      ],
    });
  } catch (error) {
    console.error("Error creating contact note:", error);
  }
}

/**
 * Create a deal in HubSpot and associate with contact
 */
export async function createHubSpotDeal(
  contactId: string,
  organization: string
) {
  if (!hubspotClient) {
    console.warn("HubSpot client not initialized. Skipping deal creation.");
    return null;
  }

  try {
    const dealName = `${organization} - Pilot Inquiry`;

    const response = await hubspotClient.crm.deals.basicApi.create({
      properties: {
        dealname: dealName,
        dealstage: "appointmentscheduled", // HubSpot default first stage
        amount: "0",
        pipeline: "default", // Use default sales pipeline
      },
      associations: [
        {
          to: { id: contactId },
          types: [
            {
              associationCategory: "HUBSPOT_DEFINED",
              associationTypeId: 3, // Deal to Contact
            },
          ],
        },
      ],
    });

    console.log("HubSpot deal created:", response.id);
    return response;
  } catch (error) {
    console.error("Error creating HubSpot deal:", error);
    throw error;
  }
}

/**
 * Main function: Create contact and deal in HubSpot
 */
export async function createHubSpotLead(data: LeadData) {
  try {
    // Create or update contact
    const contact = await createHubSpotContact(data);

    if (!contact) {
      return { success: false, error: "HubSpot not configured" };
    }

    // Create deal associated with contact
    const deal = await createHubSpotDeal(contact.id, data.organization);

    return {
      success: true,
      contactId: contact.id,
      dealId: deal?.id,
    };
  } catch (error: any) {
    console.error("Error in HubSpot lead creation:", error);
    return {
      success: false,
      error: error.message || "Unknown error",
    };
  }
}
