import LegalPage, { legalMetadata } from "@/page/legal/LegalPage";
export const metadata = legalMetadata("copyright");
export default function CopyrightPage() { return <LegalPage page="copyright" />; }
