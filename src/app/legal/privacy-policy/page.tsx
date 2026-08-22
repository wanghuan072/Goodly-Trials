import LegalPage, { legalMetadata } from "@/page/legal/LegalPage";
export const metadata = legalMetadata("privacy-policy");
export default function PrivacyPolicyPage() { return <LegalPage page="privacy-policy" />; }
