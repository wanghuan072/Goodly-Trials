import LegalPage, { legalMetadata } from "@/page/legal/LegalPage";
export const metadata = legalMetadata("terms-of-service");
export default function TermsOfServicePage() { return <LegalPage page="terms-of-service" />; }
