export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/member/',
          '/editor/',
          '/api/',
          '/debug-token',
          '/force-logout',
          '/check-role',
          '/set-password',
        ],
      },
    ],
    sitemap: 'https://karumaincu.org/sitemap.xml',
  }
}
