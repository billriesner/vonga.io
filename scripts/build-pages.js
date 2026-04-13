const fs = require('fs').promises;
const path = require('path');

const dataPath = path.join(__dirname, 'data', 'teams.json');
const templatePath = path.join(__dirname, 'template.html');
const outputDir = path.join(__dirname, '..', 'sponsorship-activation');

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

async function buildPages() {
    try {
        const teamsData = JSON.parse(await fs.readFile(dataPath, 'utf-8'));
        const template = await fs.readFile(templatePath, 'utf-8');

        for (const league in teamsData) {
            const leagueDir = path.join(outputDir, league);
            await fs.mkdir(leagueDir, { recursive: true });

            for (const team of teamsData[league]) {
                const slug = slugify(team);
                let content = template.replace(/{{league}}/g, league);
                content = content.replace(/{{team}}/g, team);
                content = content.replace(/{{slug}}/g, `${slug}.html`);

                const outputPath = path.join(leagueDir, `${slug}.html`);
                await fs.writeFile(outputPath, content);
                console.log(`Successfully created ${outputPath}`);
            }
        }
        console.log('Successfully created all pages.');

    } catch (error) {
        console.error('Error building pages:', error);
    }
}

buildPages();
