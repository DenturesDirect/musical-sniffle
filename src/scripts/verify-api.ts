
import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function verify() {
    console.log("Verifying Profiles API Logic...");
    try {
        const { listProfiles } = await import('../lib/s3-config');
        const profiles = await listProfiles();
        console.log("SUCCESS: Retrieved profiles:", profiles);

        if (!profiles.includes('default')) {
            console.warn("WARNING: 'default' profile missing. Dashboard might need it.");
        }
    } catch (error) {
        console.error("FAILED: Could not list profiles.", error);
        process.exit(1);
    }
}

verify();
