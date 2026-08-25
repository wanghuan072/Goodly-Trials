export const legacyRedirects = [
  { source: "/wiki/gear/iron-sword-of-brawn", destination: "/wiki/gear/iron-sword", permanent: true },
  { source: "/wiki/gear/wand-of-wit", destination: "/wiki/gear/wand", permanent: true },
  { source: "/wiki/gear/boots-axe", destination: "/wiki/gear/boots-war-axe", permanent: true },
  { source: "/wiki/gear/bow-of-grace", destination: "/wiki/gear/bow", permanent: true },
  { source: "/wiki/gear/iron-shield-of-brawn", destination: "/wiki/gear/iron-shield", permanent: true },
  { source: "/wiki/gear/thin-blood", destination: "/wiki/gear", permanent: true },
] as const;

export function getSecurityHeaders(isDevelopment = false) {
  const scriptSources = ["'self'", "'unsafe-inline'"];

  // React's development runtime uses eval to rebuild debugging call stacks.
  // Keep that exception local to `next dev`; production CSP remains unchanged.
  if (isDevelopment) {
    scriptSources.push("'unsafe-eval'");
  }

  const contentSecurityPolicy = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "frame-src https://www.youtube-nocookie.com",
    "img-src 'self' data: https://i.ytimg.com",
    "font-src 'self' data:",
    "style-src 'self' 'unsafe-inline'",
    `script-src ${scriptSources.join(" ")}`,
    "connect-src 'self'",
  ].join("; ");

  return [
    { key: "Content-Security-Policy", value: contentSecurityPolicy },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "SAMEORIGIN" },
  ] as const;
}

export const securityHeaders = getSecurityHeaders();
