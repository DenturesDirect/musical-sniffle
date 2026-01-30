
import { SiteConfig } from "@/types";
import LuxuryLayout from "./luxury";
import BoldLayout from "./bold";
import SoftLayout from "./soft";
import MinimalLayout from "./minimal";

export default function ThemeRenderer({ config }: { config: SiteConfig }) {
    const { theme } = config;

    switch (theme) {
        case 'bold':
            return <BoldLayout config={config} />;
        case 'soft':
            return <SoftLayout config={config} />;
        case 'minimal':
            return <MinimalLayout config={config} />;
        case 'luxury':
        default:
            return <LuxuryLayout config={config} />;
    }
}
